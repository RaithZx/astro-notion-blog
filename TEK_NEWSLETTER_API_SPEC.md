# tek-newsletter-api — Build Specification

## Goal

Build a self-hosted newsletter API microservice from scratch. This replaces a previous Buttondown-dependent implementation. The service must handle subscriber management (subscribe, unsubscribe, confirm) and new post notifications via email. No third-party newsletter provider — we own the data and send emails directly via SMTP.

---

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** SQLite via `better-sqlite3` (single file, zero config, production-ready for small-medium lists)
- **Email:** Nodemailer with configurable SMTP (Brevo/Sendinblue, Resend, SES, or any SMTP provider)
- **Security:** CSRF tokens (`csrf-csrf` package or manual implementation), rate limiting (`express-rate-limit`), CORS, honeypot validation
- **Language:** JavaScript (CommonJS or ESM — prefer ESM with `"type": "module"` in package.json)
- **No TypeScript** — keep it simple, single `server.js` is fine, or split into small modules under `src/`

---

## Project Structure

```
tek-newsletter-api/
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── nixpack.toml            # Nixpacks config for Coolify deployment
├── db/
│   └── .gitkeep            # SQLite DB file created here at runtime (newsletter.db)
├── src/
│   ├── server.js           # Main Express app, middleware, route mounting
│   ├── routes/
│   │   ├── csrf.js         # GET /api/csrf-token
│   │   ├── subscribe.js    # POST /api/subscribe
│   │   ├── unsubscribe.js  # GET /api/unsubscribe/:token, POST /api/unsubscribe
│   │   ├── confirm.js      # GET /api/confirm/:token
│   │   ├── health.js       # GET /api/health
│   │   └── notify.js       # POST /api/notify (send new post email to all confirmed subscribers)
│   ├── db.js               # SQLite setup, schema migration, query helpers
│   ├── email.js            # Nodemailer transporter setup, email templates
│   └── tokens.js           # Token generation/validation helpers (confirmation + unsubscribe tokens)
└── templates/
    ├── confirm.html        # Confirmation email HTML template
    ├── welcome.html        # Welcome email after confirmation
    ├── new-post.html       # New post notification email template
    └── unsubscribe.html    # Unsubscribe confirmation page/email
```

---

## Database Schema (SQLite)

Create these tables on startup if they don't exist:

```sql
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'confirmed', 'unsubscribed'
  confirm_token TEXT UNIQUE,
  unsubscribe_token TEXT UNIQUE NOT NULL,
  subscribed_at TEXT NOT NULL DEFAULT (datetime('now')),
  confirmed_at TEXT,
  unsubscribed_at TEXT,
  ip_address TEXT,
  source TEXT DEFAULT 'website'  -- 'website', 'modal', 'inline_banner', 'api'
);

CREATE TABLE IF NOT EXISTS email_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subscriber_id INTEGER,
  email_type TEXT NOT NULL,  -- 'confirmation', 'welcome', 'new_post', 'unsubscribe'
  subject TEXT,
  sent_at TEXT NOT NULL DEFAULT (datetime('now')),
  status TEXT DEFAULT 'sent',  -- 'sent', 'failed'
  error TEXT,
  FOREIGN KEY (subscriber_id) REFERENCES subscribers(id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_title TEXT NOT NULL,
  post_url TEXT NOT NULL,
  post_excerpt TEXT,
  sent_at TEXT NOT NULL DEFAULT (datetime('now')),
  total_recipients INTEGER DEFAULT 0,
  total_sent INTEGER DEFAULT 0,
  total_failed INTEGER DEFAULT 0
);
```

---

## API Endpoints

### 1. `GET /api/health`

Health check endpoint.

**Response (200):**
```json
{
  "status": "ok",
  "service": "tek-newsletter-api",
  "timestamp": "2026-04-01T12:00:00.000Z",
  "subscribers": {
    "total": 42,
    "confirmed": 38,
    "pending": 4
  }
}
```

### 2. `GET /api/csrf-token`

Returns a CSRF token and sets a cookie for validation.

**Response headers:** Sets an HTTP-only cookie (e.g., `__csrf`) for double-submit pattern.

**Response (200):**
```json
{
  "csrfToken": "random-token-string"
}
```

**Implementation notes:**
- Generate a cryptographically random token
- Store token in an HTTP-only, SameSite=Strict cookie
- The frontend sends the token back in the `X-CSRF-Token` header on POST requests
- On POST, compare header token with cookie token (double-submit cookie pattern)
- Use `credentials: 'include'` on the frontend (already implemented)

### 3. `POST /api/subscribe`

Subscribe a new email address (double opt-in flow).

**Request headers:**
- `Content-Type: application/json`
- `X-CSRF-Token: <token from /api/csrf-token>`
- Cookie: `__csrf=<token>` (sent automatically with `credentials: 'include'`)

**Request body:**
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "privacy": true,
  "honeypot": ""
}
```

**Validation rules:**
- `email` — required, valid email format (regex validation)
- `privacy` — must be `true` (GDPR consent)
- `honeypot` — must be empty string or falsy (spam trap: bots fill hidden fields)
- CSRF token must match

**Success — new subscriber (200):**
```json
{
  "success": true,
  "message": "Obrigadu! Dja bu inskreve i bu sta ligadu! Djobe bu email pa konfirma.",
  "alreadySubscribed": false
}
```
Side effects: Insert subscriber with status `pending`, generate `confirm_token` and `unsubscribe_token`, send confirmation email.

**Success — already confirmed (200):**
```json
{
  "success": true,
  "message": "Bu email sta konfirmadu i rejistadu. Obrigadu pa kontinua ligadu.",
  "alreadySubscribed": true
}
```
Side effects: none (don't resend confirmation).

**Success — was pending, resend confirmation (200):**
```json
{
  "success": true,
  "message": "Obrigadu! Dja bu inskreve i bu sta ligadu! Djobe bu email pa konfirma.",
  "alreadySubscribed": false
}
```
Side effects: Resend confirmation email with same token.

**Success — was unsubscribed, re-subscribe (200):**
```json
{
  "success": true,
  "message": "Obrigadu! Dja bu inskreve i bu sta ligadu! Djobe bu email pa konfirma.",
  "alreadySubscribed": false
}
```
Side effects: Reset status to `pending`, generate new `confirm_token`, send confirmation email.

**Error — validation failure (400):**
```json
{
  "error": "Pur favor, fornese un email válidu."
}
```

**Error — honeypot triggered (400):**
```json
{
  "error": "Inskrison inválidu."
}
```

**Error — CSRF failure (403):**
```json
{
  "error": "Eru di siguransa. Pur favor, atualiza pájina i tenta otu bês."
}
```

**Error — rate limited (429):**
```json
{
  "error": "Muitu tentativa. Pur favor, spera algun minutu i tenta otu bês."
}
```

### 4. `GET /api/confirm/:token`

Confirm a subscriber's email via the link in the confirmation email.

**Behavior:**
- Look up subscriber by `confirm_token`
- If found and status is `pending`: set status to `confirmed`, set `confirmed_at`, clear `confirm_token`, send welcome email
- If found and already `confirmed`: show "already confirmed" message
- If not found: show error

**Response:** Redirect to the blog homepage with a query parameter, or render a simple HTML page with the result message. Prefer rendering a simple HTML page:

- Success: "Obrigadu! Bu inskrison sta konfirmadu."
- Already confirmed: "Bu email dja sta konfirmadu."
- Invalid: "Link inválidu o spiadu."

### 5. `GET /api/unsubscribe/:token`

Unsubscribe via link in emails.

**Behavior:**
- Look up subscriber by `unsubscribe_token`
- Set status to `unsubscribed`, set `unsubscribed_at`
- Render a simple HTML page confirming unsubscription

**Response:** Simple HTML page:
- Success: "Bu dja sai di lista. Bu ka ta resebe más email."
- Invalid: "Link inválidu."

### 6. `POST /api/unsubscribe`

Unsubscribe via email input (alternative to token link).

**Request body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Si bu email sta rejistadu, bu ta resebe un konfirmason."
}
```
Always return success (don't reveal if email exists).

### 7. `POST /api/notify`

Send a new post notification to all confirmed subscribers. Protected by an API key (not CSRF — this is a server-to-server call).

**Request headers:**
- `Authorization: Bearer <NOTIFY_API_KEY>`
- `Content-Type: application/json`

**Request body:**
```json
{
  "title": "Post Title",
  "url": "https://yourdomain.com/posts/my-new-post",
  "excerpt": "A brief summary of the post..."
}
```

**Behavior:**
- Validate API key
- Query all subscribers with status `confirmed`
- Send email to each (use BCC batching or sequential sends with small delays to avoid SMTP rate limits)
- Log to `notifications` table
- Return summary

**Response (200):**
```json
{
  "success": true,
  "totalRecipients": 38,
  "totalSent": 37,
  "totalFailed": 1
}
```

**Error — unauthorized (401):**
```json
{
  "error": "Unauthorized"
}
```

---

## Email Templates

All emails should be simple, clean HTML. Include the unsubscribe link (`{{unsubscribeUrl}}`) in every email footer.

### Confirmation Email
- **Subject:** "Konfirma bu inskrison - Ligadu"
- **Body:** Brief message asking them to click a button/link to confirm
- **CTA link:** `{{baseUrl}}/api/confirm/{{confirmToken}}`
- **Footer:** Unsubscribe link

### Welcome Email
- **Subject:** "Ben-vindu na Ligadu!"
- **Body:** Thank them for subscribing, brief intro to what they'll receive
- **Footer:** Unsubscribe link

### New Post Notification
- **Subject:** "Nobu artigu: {{postTitle}}"
- **Body:** Post title, excerpt, "Read more" button linking to the post
- **Footer:** Unsubscribe link

### Template Variables
Use simple `{{variable}}` placeholder syntax. Replace at send time with:
- `{{email}}` — subscriber email
- `{{name}}` — subscriber name (or empty)
- `{{confirmUrl}}` — full confirmation URL
- `{{unsubscribeUrl}}` — full unsubscribe URL (using unsubscribe_token)
- `{{baseUrl}}` — site base URL
- `{{postTitle}}` — post title (for notifications)
- `{{postUrl}}` — post URL (for notifications)
- `{{postExcerpt}}` — post excerpt (for notifications)

---

## Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development

# CORS - comma-separated allowed origins
ALLOWED_ORIGINS=http://localhost:4321

# Site base URL (for email links)
BASE_URL=https://yourdomain.com

# SMTP Configuration
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password

# Email sender
EMAIL_FROM_NAME=Ligadu
EMAIL_FROM_ADDRESS=noreply@yourdomain.com

# CSRF
CSRF_SECRET=generate-a-random-32-char-string

# API key for /api/notify endpoint (server-to-server auth)
NOTIFY_API_KEY=generate-a-random-api-key

# Rate limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=5

# Database path (relative to project root)
DB_PATH=./db/newsletter.db
```

---

## Security Requirements

1. **CSRF Protection (double-submit cookie pattern):**
   - `GET /api/csrf-token` generates a token, stores in HTTP-only cookie AND returns in JSON body
   - `POST /api/subscribe` validates that the `X-CSRF-Token` header matches the cookie value
   - Cookie settings: `httpOnly: true`, `sameSite: 'strict'`, `secure: true` in production

2. **Rate Limiting:**
   - Subscribe endpoint: 5 requests per minute per IP
   - CSRF token endpoint: 10 requests per minute per IP
   - Notify endpoint: 5 requests per hour (it's server-to-server)

3. **CORS:**
   - Only allow origins listed in `ALLOWED_ORIGINS`
   - Support `credentials: true` for cookie handling

4. **Honeypot:**
   - Reject requests where the `honeypot` field is non-empty

5. **Input Validation:**
   - Email: regex validation + max length 254 chars
   - Name: max length 100 chars, strip HTML
   - Privacy: must be boolean `true`

6. **Token Generation:**
   - Use `crypto.randomBytes(32).toString('hex')` for confirm and unsubscribe tokens
   - Tokens are single-use for confirmation, persistent for unsubscribe

7. **API Key Auth:**
   - `/api/notify` requires `Authorization: Bearer <NOTIFY_API_KEY>` header
   - Constant-time comparison to prevent timing attacks

---

## Middleware Stack (order matters)

```
1. CORS (with credentials support)
2. Cookie parser
3. JSON body parser (limit: '10kb')
4. Rate limiter (global, then per-route overrides)
5. CSRF validation (only on POST routes that need it)
6. Routes
7. Error handler
```

---

## Frontend API Contract (DO NOT CHANGE)

The Astro blog frontend is already built and expects this exact contract. The relevant frontend files are:

- `src/layouts/Layout.astro` — Newsletter modal (email + name + privacy checkbox + honeypot)
- `src/components/subscribeBanner.astro` — Inline banner (email + honeypot, no name field)

**Frontend behavior:**
1. On form submit, calls `GET /api/csrf-token` (with `credentials: 'include'`)
2. Extracts `csrfToken` from the JSON response
3. Calls `POST /api/subscribe` with:
   - Header `X-CSRF-Token: <token>`
   - Header `Content-Type: application/json`
   - `credentials: 'include'`
   - Body: `{ email, name, privacy, honeypot }` (inline banner sends `privacy: true` hardcoded, no name)
4. Checks `response.ok && data.success` for success
5. Reads `data.message` for success text
6. Reads `data.alreadySubscribed` boolean
7. Reads `data.error` for error text
8. Stores `localStorage.newsletter_subscribed = 'true'` on success

**DO NOT change these response shapes. The frontend depends on them.**

---

## Deployment (Coolify / Nixpacks)

### nixpack.toml
```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["npm ci"]

[start]
cmd = "node src/server.js"
```

### Coolify Configuration
- **Port:** 3001
- **Reverse proxy:** The blog's Coolify service routes `/api/*` to this service at port 3001
- **Persistent volume:** Mount `./db/` so SQLite data survives container restarts

### Health Check
Coolify should ping `GET /api/health` for container health monitoring.

---

## Startup Behavior

When the server starts:
1. Load environment variables (use `dotenv` in dev)
2. Initialize SQLite database and run migrations (create tables if not exist)
3. Verify SMTP connection (send a test connection, log result, but don't fail startup if SMTP is unreachable)
4. Log startup summary:
```
==================================================
  tek-newsletter-api running on port 3001
  Environment: production
  Database: ./db/newsletter.db
  SMTP: smtp-relay.brevo.com:587
  CORS origins: https://yourdomain.com
  Security: CSRF enabled, rate limiting enabled
  Subscribers: 42 confirmed, 3 pending
==================================================
```

---

## Error Handling

- All routes wrap logic in try/catch
- Return consistent JSON errors: `{ "error": "message" }`
- Log errors to stderr with timestamps
- Never expose stack traces in production responses
- Database errors return 500 with generic message

---

## Package Dependencies

```json
{
  "dependencies": {
    "express": "^4",
    "better-sqlite3": "^11",
    "nodemailer": "^6",
    "cors": "^2",
    "cookie-parser": "^1",
    "express-rate-limit": "^7",
    "dotenv": "^16",
    "helmet": "^8"
  }
}
```

Keep dependencies minimal. No ORMs, no heavy frameworks.

---

## Implementation Priority

1. **Phase 1 — Core subscribe flow:** `/api/health`, `/api/csrf-token`, `/api/subscribe`, database setup, CSRF, CORS, rate limiting
2. **Phase 2 — Double opt-in:** `/api/confirm/:token`, confirmation email sending via SMTP, welcome email
3. **Phase 3 — Unsubscribe:** `/api/unsubscribe/:token`, `POST /api/unsubscribe`
4. **Phase 4 — Notifications:** `/api/notify`, new post email template, batch sending
5. **Phase 5 — Polish:** Startup logs, health check with stats, email logging, error handling review

---

## Testing Checklist

After building, verify:

- [ ] `GET /api/health` returns 200 with subscriber stats
- [ ] `GET /api/csrf-token` returns token and sets cookie
- [ ] `POST /api/subscribe` with valid data creates subscriber in SQLite with status `pending`
- [ ] `POST /api/subscribe` sends confirmation email
- [ ] `POST /api/subscribe` with same email returns `alreadySubscribed: true` (if confirmed)
- [ ] `POST /api/subscribe` with same email resends confirmation (if pending)
- [ ] `POST /api/subscribe` without CSRF token returns 403
- [ ] `POST /api/subscribe` with non-empty honeypot returns 400
- [ ] `POST /api/subscribe` with invalid email returns 400
- [ ] `POST /api/subscribe` with `privacy: false` returns 400
- [ ] Rate limiting kicks in after 5 requests/minute
- [ ] `GET /api/confirm/:token` changes status to `confirmed` and sends welcome email
- [ ] `GET /api/confirm/:token` with invalid token shows error
- [ ] `GET /api/unsubscribe/:token` changes status to `unsubscribed`
- [ ] `POST /api/notify` with valid API key sends emails to all confirmed subscribers
- [ ] `POST /api/notify` without API key returns 401
- [ ] CORS blocks requests from unlisted origins
- [ ] SQLite database persists across server restarts
- [ ] Frontend modal subscription works end-to-end
- [ ] Frontend inline banner subscription works end-to-end

---

## Notes

- All user-facing messages are in **Kriolu** (Cape Verdean Creole) — keep the messages exactly as specified in this doc
- The blog site is called **"Ligadu"**
- The service name is **"tek-newsletter-api"**
- SQLite is preferred over PostgreSQL for simplicity — no external database to manage
- Email sending should be fire-and-forget where possible (don't block the API response waiting for SMTP)
- Consider using `setTimeout` or a simple in-process queue for batch email sending in `/api/notify` to avoid blocking

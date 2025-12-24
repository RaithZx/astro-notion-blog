# Newsletter Signup Implementation Guide

## Overview

This guide covers the complete setup of the newsletter subscription system for your Astro blog, including:
- **tek-newsletter-api**: Express.js backend service
- **Frontend integration**: Updated modal and inline subscription forms
- **Buttondown**: Third-party newsletter platform
- **Coolify deployment**: VPS hosting configuration

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  User Browser                                        │
│  ├─ Visits blog                                     │
│  ├─ Sees subscription prompts (modal/inline)        │
│  └─ Submits email                                   │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  Coolify Reverse Proxy                              │
│  ├─ yourdomain.com → astro-blog:4321               │
│  └─ yourdomain.com/api/* → tek-newsletter-api:3001 │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  tek-newsletter-api (Express.js)                    │
│  ├─ Validates email & spam protection               │
│  ├─ Rate limiting (5 req/min)                       │
│  └─ Calls Buttondown API                            │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  Buttondown API                                      │
│  ├─ Stores subscriber                                │
│  ├─ Sends confirmation email (double opt-in)        │
│  └─ Returns success/error                            │
└─────────────────────────────────────────────────────┘
```

---

## Part 1: Buttondown Setup

### Step 1: Create Buttondown Account

1. Go to https://buttondown.email
2. Click "Sign Up"
3. Choose the **Free plan** (up to 1,000 subscribers)
4. Verify your email address

### Step 2: Configure Basic Settings

1. Go to **Settings → General**
2. Set your newsletter name (e.g., "Tek Blog Newsletter")
3. Add description
4. Upload logo (optional)

### Step 3: Get API Key

1. Go to **Settings → Programming**
2. Copy your **API Key** (starts with "Token...")
3. Keep this secure - you'll need it for deployment

### Step 4: Configure Email Settings

1. Go to **Settings → Emails**
2. Set "From" name and email
3. Enable **"Require double opt-in"** (recommended for GDPR compliance)
4. Customize confirmation email template (optional)

---

## Part 2: Deploy tek-newsletter-api to Coolify

### Step 1: Prepare the API Service

The API service has already been created at:
```
/home/raithzx/Projects/tek-newsletter-api/
```

Install dependencies:
```bash
cd /home/raithzx/Projects/tek-newsletter-api
npm install
```

### Step 2: Test Locally (Optional)

Create `.env` file:
```bash
cp .env.example .env
nano .env
```

Add your values:
```env
BUTTONDOWN_API_KEY=your_actual_buttondown_api_key
ALLOWED_ORIGIN=http://localhost:4321
PORT=3001
NODE_ENV=development
```

Run locally:
```bash
npm run dev
```

Test health check:
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "tek-newsletter-api",
  "timestamp": "2025-12-23T..."
}
```

### Step 3: Create Coolify Service

1. Open Coolify dashboard
2. Click **"+ New"** → **"Application"**
3. Select **"Local Directory"**

### Step 4: Configure Application

**Basic Settings:**
- **Name:** `tek-newsletter-api`
- **Description:** Newsletter subscription API service
- **Source:** `/home/raithzx/Projects/tek-newsletter-api`
- **Build Pack:** Auto-detect (will use Node.js)

**Build Settings:**
- **Install Command:** `npm install`
- **Build Command:** (leave empty)
- **Start Command:** `npm start`
- **Port:** `3001`

### Step 5: Add Environment Variables

In Coolify, go to **Environment Variables** and add:

| Variable | Value | Notes |
|----------|-------|-------|
| `BUTTONDOWN_API_KEY` | `your_api_key_here` | From Buttondown Settings → Programming |
| `ALLOWED_ORIGIN` | `https://yourdomain.com` | Your blog's domain (with https://) |
| `PORT` | `3001` | Internal port |
| `NODE_ENV` | `production` | Production mode |

### Step 6: Configure Reverse Proxy Routing

In Coolify, configure routing rules:

**For the main blog service (astro-notion-blog):**
- Domain: `yourdomain.com`
- Port: `4321` (or your configured port)

**For the newsletter API service (tek-newsletter-api):**
- Domain: `yourdomain.com`
- Path: `/api/*`
- Port: `3001`
- Strip path prefix: **No**

This configuration ensures:
- `https://yourdomain.com/` → Astro blog
- `https://yourdomain.com/api/subscribe` → Newsletter API

### Step 7: Deploy

1. Click **"Deploy"** in Coolify
2. Monitor deployment logs
3. Look for success message:
   ```
   🚀 tek-newsletter-api running on port 3001
   📧 Environment: production
   🔑 Buttondown API key: configured
   ```

### Step 8: Test Deployment

Test health check from public URL:
```bash
curl https://yourdomain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "tek-newsletter-api",
  "timestamp": "2025-12-23T..."
}
```

Test subscription (use a real email you control):
```bash
curl -X POST https://yourdomain.com/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-test-email@example.com",
    "name": "Test User",
    "privacy": true,
    "honeypot": ""
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Subscription successful! Check your email to confirm."
}
```

Check your email for the Buttondown confirmation message.

---

## Part 3: Verify Frontend Integration

The frontend has already been updated with:

### ✅ Newsletter Modal (`src/layouts/Layout.astro`)
- Real API integration
- Honeypot spam protection
- localStorage tracking
- Smart triggers (scroll depth, time delay, exit intent)

### ✅ Inline Banner (`src/components/subscribeBanner.astro`)
- Form submission to API
- Error handling
- Success messages

### How to Test

1. **Build and deploy your blog:**
   ```bash
   cd /home/raithzx/Projects/astro-notion-blog
   npm run build
   ```

2. **Deploy via Coolify** (redeploy the main blog service if needed)

3. **Test the modal:**
   - Visit your blog
   - Scroll down 50% of a post (should trigger modal after 500ms)
   - OR wait 30 seconds (should trigger modal)
   - Fill in email and submit

4. **Test the inline banner:**
   - If you added the subscribeBanner component to any page
   - Enter email and click "Inskreve"

5. **Verify in Buttondown:**
   - Go to Buttondown dashboard → Subscribers
   - You should see the new subscriber (status: "pending" until confirmed)

6. **Check confirmation email:**
   - Check the email inbox
   - Click confirmation link
   - Subscriber status should change to "active"

---

## Part 4: Features & Behavior

### Smart Triggers

The newsletter modal will appear automatically when:

1. **Scroll Depth:** User scrolls past 50% of page content
2. **Time Delay:** After 30 seconds on the page
3. **Exit Intent:** When mouse moves to close the tab (desktop only)

**Important:** The modal will NOT appear if:
- User has already subscribed (`localStorage.newsletter_subscribed = true`)
- User dismissed it in current session (`sessionStorage.newsletter_dismissed = true`)

### Spam Protection

Multiple layers of protection:

1. **Honeypot field:** Hidden field that bots often fill out
2. **Rate limiting:** Max 5 requests per minute per IP
3. **Email validation:** Server-side regex check
4. **Double opt-in:** Buttondown sends confirmation email

### Privacy & GDPR Compliance

✅ **Explicit consent:** Privacy checkbox required in modal  
✅ **Privacy policy:** Link to privacy page  
✅ **Terms of use:** Link to terms page  
✅ **Double opt-in:** Confirmation email required  
✅ **Easy unsubscribe:** Buttondown includes unsubscribe in all emails  
✅ **Data protection:** Subscriber data stored securely in Buttondown  

---

## Part 5: Monitoring & Maintenance

### View Logs in Coolify

1. Go to Coolify dashboard
2. Select `tek-newsletter-api` service
3. Click **"Logs"**

Look for:
- ✅ `New subscriber: email@example.com`
- ℹ️  `Already subscribed: email@example.com`
- ❌ `Buttondown API error: ...`

### Monitor Subscribers in Buttondown

1. Go to Buttondown dashboard
2. Click **"Subscribers"**
3. View stats: total, active, pending, unsubscribed

### Update Dependencies

Periodically update npm packages:

```bash
cd /home/raithzx/Projects/tek-newsletter-api
npm update
npm audit fix
```

Then redeploy via Coolify.

### Backup Subscribers

Export subscriber list from Buttondown:
1. Go to **Settings → Export Data**
2. Download CSV file
3. Store securely

---

## Part 6: Troubleshooting

### Issue: "Buttondown API key: MISSING" in logs

**Solution:**
- Check that `BUTTONDOWN_API_KEY` environment variable is set in Coolify
- Verify the API key is correct (copy again from Buttondown)
- Redeploy the service after adding the variable

### Issue: CORS errors in browser console

**Solution:**
- Check `ALLOWED_ORIGIN` matches your blog's domain exactly
- Include `https://` in the URL
- Redeploy after updating

### Issue: 404 Not Found when calling /api/subscribe

**Solution:**
- Verify Coolify reverse proxy routing is configured
- Check that path is `/api/*` (with the asterisk)
- Ensure "Strip path prefix" is set to **No**
- Test API health endpoint first: `/api/health`

### Issue: Rate limit errors

**Solution:**
- This is expected behavior (5 requests/minute)
- Wait 60 seconds before retrying
- To adjust, edit `server.js` line 18-21 and redeploy

### Issue: Subscribers not appearing in Buttondown

**Solution:**
- Check API logs for errors
- Verify API key has write permissions
- Try subscribing with API curl test (see Part 2, Step 8)
- Check Buttondown dashboard for API usage/errors

### Issue: Confirmation emails not sending

**Solution:**
- This is handled by Buttondown, not your API
- Check Buttondown Settings → Emails
- Verify "From" email is confirmed
- Check spam folder
- Contact Buttondown support if persistent

---

## Part 7: Customization

### Change Trigger Timing

Edit `/home/raithzx/Projects/astro-notion-blog/src/layouts/Layout.astro`:

```javascript
// Change scroll depth (currently 50%)
if (scrollPercent > 75) { // Now triggers at 75%

// Change time delay (currently 30 seconds)
}, 60000); // Now triggers after 60 seconds
```

### Disable Specific Triggers

Comment out unwanted triggers in `Layout.astro`:

```javascript
// Disable exit intent
/*
document.addEventListener('mouseleave', function(e) {
  ...
});
*/
```

### Customize Email Templates in Buttondown

1. Go to Buttondown Settings → Emails
2. Edit "Confirmation email" template
3. Use variables: `{{ subscriber.email }}`, `{{ confirmation_link }}`
4. Save and test

### Add Newsletter to More Pages

Import and use the subscribeBanner component:

```astro
---
import SubscribeBanner from '../components/subscribeBanner.astro';
---

<SubscribeBanner />
```

---

## Part 8: Future Enhancements

### Potential Additions

1. **Subscriber tags:** Track source (modal vs inline, specific post)
2. **A/B testing:** Test different modal copy
3. **Welcome email series:** Automated sequence in Buttondown
4. **RSS-to-Email:** Auto-send new posts via Buttondown
5. **Analytics:** Track conversion rates
6. **Preferences center:** Let subscribers choose topics

### Migration Path

If you ever need to switch from Buttondown:

1. Export subscribers from Buttondown (CSV)
2. Update `server.js` to call different API
3. Import subscribers to new platform
4. No frontend changes needed (API contract remains the same)

---

## Summary Checklist

### Setup Complete ✅

- [ ] Buttondown account created and API key obtained
- [ ] tek-newsletter-api deployed to Coolify
- [ ] Environment variables configured
- [ ] Reverse proxy routing set up
- [ ] Health check endpoint tested
- [ ] Test subscription completed
- [ ] Confirmation email received
- [ ] Subscriber appears in Buttondown dashboard
- [ ] Frontend modal tested
- [ ] Inline banner tested (if used)

### Files Modified

- ✅ Created `/home/raithzx/Projects/tek-newsletter-api/` (entire service)
- ✅ Updated `/home/raithzx/Projects/astro-notion-blog/src/layouts/Layout.astro`
- ✅ Updated `/home/raithzx/Projects/astro-notion-blog/src/components/subscribeBanner.astro`

---

## Support & Resources

- **Buttondown Documentation:** https://docs.buttondown.email
- **Express.js Documentation:** https://expressjs.com
- **Coolify Documentation:** https://coolify.io/docs
- **API Service README:** `/home/raithzx/Projects/tek-newsletter-api/README.md`

---

## Quick Reference

### API Endpoints

- **Health Check:** `GET /api/health`
- **Subscribe:** `POST /api/subscribe`

### Environment Variables

- `BUTTONDOWN_API_KEY` - Your Buttondown API key
- `ALLOWED_ORIGIN` - Blog domain (with https://)
- `PORT` - Internal port (3001)
- `NODE_ENV` - production

### Coolify Services

1. **astro-notion-blog** - Main blog (port 4321)
2. **tek-newsletter-api** - Newsletter API (port 3001)

### File Locations

- API Service: `/home/raithzx/Projects/tek-newsletter-api/`
- Blog: `/home/raithzx/Projects/astro-notion-blog/`

---

**Congratulations!** Your newsletter signup system is now live. 🎉

For questions or issues, review the troubleshooting section or check the API logs in Coolify.


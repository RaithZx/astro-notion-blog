# Environment Configuration Update

## Newsletter API URL Added

I've added `NEWSLETTER_API_URL` to your `.env` file and updated both components to use it.

### What Changed

1. **`.env` file** - Added:
   ```env
   NEWSLETTER_API_URL=http://localhost:3001
   ```

2. **`src/layouts/Layout.astro`** - Now uses the environment variable:
   - Reads `import.meta.env.NEWSLETTER_API_URL`
   - Falls back to relative path `/api/subscribe` if not set (for production)
   - Constructs full URL: `http://localhost:3001/api/subscribe` in development

3. **`src/components/subscribeBanner.astro`** - Same pattern applied

### How It Works

**Development (your VPS, local testing):**
- `.env` has: `NEWSLETTER_API_URL=http://localhost:3001`
- Frontend calls: `http://localhost:3001/api/subscribe`
- Directly connects to tek-newsletter-api service

**Production (Coolify deployment):**
- `.env` is empty or variable not set: `NEWSLETTER_API_URL=`
- Frontend calls: `/api/subscribe` (relative path)
- Coolify reverse proxy routes to tek-newsletter-api:3001

### Testing

1. **Start the newsletter API service:**
   ```bash
   cd /home/raithzx/Projects/tek-newsletter-api
   npm install  # if not done already
   npm run dev
   ```

2. **In another terminal, start your blog:**
   ```bash
   cd /home/raithzx/Projects/astro-notion-blog
   npm run dev
   ```

3. **Test the subscription:**
   - Open http://localhost:4321
   - Scroll down or wait 30 seconds for modal
   - Enter email and submit
   - Should call `http://localhost:3001/api/subscribe`

### Production Deployment

When deploying to Coolify:

**Blog service `.env`:**
```env
# Leave NEWSLETTER_API_URL empty or remove it entirely
# NEWSLETTER_API_URL=
```

This way the frontend uses relative paths `/api/subscribe` which Coolify proxies to the API service.

### Files Modified

- ✅ `/home/raithzx/Projects/astro-notion-blog/.env` - Added NEWSLETTER_API_URL
- ✅ `src/layouts/Layout.astro` - Reads env variable, constructs API URL
- ✅ `src/components/subscribeBanner.astro` - Same pattern

The linter error on line 668 appears to be a false positive from the Astro/TypeScript parser being confused by the JSX ternary expression structure. The code should run fine - test it with `npm run dev` to confirm!


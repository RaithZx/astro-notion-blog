# Coming Soon Page - Setup Complete ✅

## What Was Implemented

Your Astro Notion blog now has a beautiful "Coming Soon" landing page with Aurora background effects that can be toggled on/off with a single environment variable.

## Files Created/Modified

### New Files:
1. **src/components/ComingSoon.astro** - Main coming soon page component
2. **src/components/ui/aurora-background.tsx** - Aurora background React component
3. **COMING_SOON.md** - Documentation for the feature
4. **SETUP_INSTRUCTIONS.md** - This file

### Modified Files:
1. **src/server-constants.ts** - Added COMING_SOON environment variable
2. **src/layouts/Layout.astro** - Added conditional rendering for coming soon page
3. **tailwind.config.mjs** - Added aurora animation keyframes
4. **src/styles/globals.css** - Added aurora animation CSS

## How to Enable

Create a `.env` file in your project root:

```bash
COMING_SOON=true
```

Or set it in your deployment platform (Vercel, Netlify, Cloudflare Pages):
- Variable: `COMING_SOON`
- Value: `true`

## How to Disable

Set the variable to `false` or remove it:

```bash
COMING_SOON=false
```

## Features

✨ **Aurora Background** - Animated Northern Lights effect with dark theme
🌑 **Dark & Sophisticated** - Deep indigo/blue color palette
📧 **Email Signup** - Newsletter subscription form
📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
🚀 **No Scroll** - Full viewport height, centered content
⚡ **Fast Loading** - Uses Astro + React for optimal performance

## Customization

Edit `src/components/ComingSoon.astro` to customize:
- Heading text
- Coming soon message
- Form description
- Colors and styling
- Logo

Edit `src/components/ui/aurora-background.tsx` to customize:
- Aurora colors (currently dark blues/indigos)
- Animation speed
- Gradient effects

## Email Integration

The form currently shows a success message. To integrate with an email service:

1. Open `src/components/ComingSoon.astro`
2. Find the form submit handler in the `<script>` section
3. Add your email service API call (Mailchimp, SendGrid, ConvertKit, etc.)

Example:
```javascript
const email = (emailInput as HTMLInputElement)?.value;

if (email) {
  // Add your API call here
  await fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  
  // Show success message
  form.classList.add('hidden');
  successMessage.classList.remove('hidden');
}
```

## Testing Locally

1. Install dependencies (if not already installed):
```bash
npm install
```

2. Create `.env` file:
```bash
echo "COMING_SOON=true" > .env
```

3. Start dev server:
```bash
npm run dev
```

4. Visit http://localhost:4321 to see the coming soon page

5. To see the normal site, change `.env`:
```bash
echo "COMING_SOON=false" > .env
```

## Deployment

The coming soon page works with all hosting platforms:
- **Vercel**: Add environment variable in project settings
- **Netlify**: Add in Site settings > Environment variables
- **Cloudflare Pages**: Add in Settings > Environment variables

## Need Help?

Check `COMING_SOON.md` for more detailed documentation.

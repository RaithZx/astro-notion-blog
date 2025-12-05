# Coming Soon Landing Page

This project includes a "Coming Soon" landing page feature that allows you to hide the entire site and display a beautiful landing page with Aurora background effect and email signup form.

## Features

- 🌌 Beautiful Aurora (Northern Lights) animated background
- 🎨 Dark theme with animated gradient effects
- 📧 Email input form for newsletter signups
- 📱 Fully responsive design (mobile, tablet, desktop)
- ⚡ No scrolling - full viewport hero section
- 🌐 Content in Cape Verdean Creole (customizable)
- ✨ Smooth fade-in animations

## How to Enable

To enable the coming soon page, set the `COMING_SOON` environment variable to `true`:

### Option 1: Using .env file

Create a `.env` file in the project root (if it doesn't exist) and add:

```env
COMING_SOON=true
```

### Option 2: Using system environment variables

```bash
export COMING_SOON=true
```

### Option 3: In your hosting platform

Set the environment variable in your hosting platform's dashboard (Vercel, Netlify, Cloudflare Pages, etc.):

- Variable name: `COMING_SOON`
- Value: `true`

## How to Disable

To show the normal site again, either:

1. Remove the `COMING_SOON` environment variable
2. Set it to `false`
3. Set it to any value other than `true`

```env
COMING_SOON=false
```

## Customization

The coming soon page can be customized by editing:

```
src/components/ComingSoon.astro
```

You can modify:
- The heading text
- The "coming soon" message
- The signup form description
- Colors and styling
- Logo/branding

## Email Integration

By default, the form submission is handled with a simple success message. To integrate with an email service:

1. Open `src/components/ComingSoon.astro`
2. Find the form submit handler in the `<script>` section
3. Replace the console.log with your email service API call (e.g., Mailchimp, SendGrid, ConvertKit)

Example:

```javascript
form?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = (emailInput as HTMLInputElement)?.value;
  
  if (email) {
    // Send to your email service
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    // Show success message
    if (successMessage) {
      form.classList.add('hidden');
      successMessage.classList.remove('hidden');
    }
  }
});
```

## Preview

When enabled, visitors will see:
- A centered, full-screen landing page with Aurora background
- Animated dark gradient effects (deep blues and purples)
- Your site logo (uses `/ligadu_logo.png`)
- A headline: "Artigus di siensia, teknolojia i saúdi"
- "Ta ben em brevi" (Coming soon)
- An email signup form in a frosted glass effect box
- Smooth fade-in animations

The entire normal site (navigation, posts, footer) will be hidden until you disable the feature.

## Technical Details

The landing page uses:
- **Aurora Background Component**: A React component from Aceternity UI that creates animated gradient effects
- **Tailwind CSS v3**: With custom keyframes for aurora animations
- **Astro + React Integration**: The Aurora component is loaded with `client:load` directive
- **Dark Theme**: Deep indigo/blue color palette for a sophisticated look

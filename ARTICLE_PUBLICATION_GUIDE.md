# 📝 Article Publication Guide

> **For Content Creation & Curation Team**  
> Last Updated: December 29, 2025

This guide explains how to publish articles on our Astro-Notion blog. The publication process consists of two main parts: **preparing the article in Notion** and **deploying the website on Vercel/Cloudflare**.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Part 1: Preparing Articles in Notion](#part-1-preparing-articles-in-notion)
3. [Part 2: Deploying the Website](#part-2-deploying-the-website)
4. [Troubleshooting](#troubleshooting)
5. [FAQ](#faq)

---

## Overview

Our blog uses **Astro** with **Notion** as a content management system (CMS). Articles are written in a Notion database, and the website fetches and displays them automatically during the build process.

### How It Works

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Write Article  │ ──>  │ Mark as Ready   │ ──>  │ Deploy Website  │
│   in Notion     │      │  for Publishing │      │  on Vercel/CF   │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

**Important:** Articles are **only** fetched during the build/deploy process. Publishing an article in Notion doesn't automatically make it live on the website—you must trigger a deployment.

---

## Part 1: Preparing Articles in Notion

### Required Database Properties

Your article page in Notion must have the following properties configured correctly:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| **Page** (Title) | Title | ✅ Yes | The article title that appears on the website |
| **Published** | Checkbox | ✅ Yes | Must be checked for the article to appear |
| **Date** | Date | ✅ Yes | Publish date - must be today or in the past |
| **Slug** | Text | ⚠️ Optional | URL-friendly identifier (auto-generated if empty) |
| **Excerpt** | Text | ⚠️ Recommended | Short description for SEO and article previews |
| **Tags** | Multi-select | ⚠️ Recommended | Categories for organizing articles |
| **FeaturedImage** | Files | ⚠️ Recommended | Main image shown in listings and social shares |
| **Rank** | Number | ⚪ Optional | Higher numbers = higher priority in featured lists |
| **AdminTags** | Multi-select | ⚪ Optional | Internal tags for team organization |

### Publication Eligibility Checklist

For an article to be **eligible for publication**, it must meet ALL of these conditions:

#### ✅ 1. Published Checkbox is Checked

- [ ] Open your article in Notion
- [ ] Locate the **"Published"** property
- [ ] Check the checkbox to mark it as published

**Why this matters:** This is the primary gate. Unchecked articles are completely ignored during the build process.

#### ✅ 2. Date is Set to Today or Earlier

- [ ] Set the **"Date"** property to today's date or a past date
- [ ] Articles with future dates will **not** be published (scheduled for future)

**Why this matters:** The system filters out articles with dates in the future. This allows you to prepare articles in advance and schedule them for automatic publication.

**Example:**
- ✅ Today is Dec 29, 2025. Article date: Dec 29, 2025 → Will publish
- ✅ Today is Dec 29, 2025. Article date: Dec 20, 2025 → Will publish
- ❌ Today is Dec 29, 2025. Article date: Dec 31, 2025 → Will NOT publish yet

#### ✅ 3. Title (Page Property) is Not Empty

- [ ] The article must have a title in the **"Page"** property
- [ ] Empty titles will cause the article to be skipped

**Why this matters:** The validation function checks for a valid title. Without it, the article is considered invalid.

### Optional but Recommended Properties

#### 🎯 Slug (URL Identifier)

The slug is the URL-friendly part of your article's web address.

- **If empty:** A slug will be auto-generated from your title
  - Example: "How to Write Articles" → `how-to-write-articles`
- **If filled:** Your custom slug will be used
  - Example: "writing-guide-2025"

**Best practices:**
- Use lowercase letters
- Separate words with hyphens (-)
- Avoid special characters
- Keep it short and descriptive

#### 📄 Excerpt (Article Summary)

A brief description of your article (1-2 sentences).

**Used for:**
- SEO meta descriptions
- Article preview cards
- Social media shares

**Recommended length:** 120-160 characters

#### 🏷️ Tags (Categories)

Multi-select tags for organizing content.

**Benefits:**
- Helps readers find related articles
- Used for "Related Articles" sections
- Enables filtering by topic

**Best practices:**
- Use 2-5 tags per article
- Be consistent with tag names
- Use existing tags when possible

#### 🖼️ Featured Image

Upload or link to a high-quality image.

**Requirements:**
- Recommended size: 1200x630px (for social sharing)
- Supported formats: JPG, PNG, WebP
- File size: Under 2MB for optimal performance

**Used for:**
- Article listing pages
- Social media previews (Open Graph)
- Hero image on article pages

#### ⭐ Rank (Featured Priority)

A number that determines placement in featured article lists.

- Higher numbers = higher priority
- Leave empty for normal articles
- Use for highlighting important content

**Example usage:**
- `10` - Homepage featured article
- `5` - Category featured article
- `0` or empty - Normal article

---

## Part 2: Deploying the Website

Once your articles are ready in Notion, you need to deploy the website to make them live.

### Where to Deploy

The website is hosted on **[Vercel/Cloudflare Pages]** (specify your platform).

### Deployment Steps

#### Option A: Manual Deployment via Dashboard

1. **Go to your hosting platform dashboard**
   - Vercel: https://vercel.com/dashboard
   - Cloudflare Pages: https://dash.cloudflare.com/
   - (Update with your specific URL if different)

2. **Navigate to your project**
   - Look for `astro-notion-blog` or your project name
   - Click on the project to open it

3. **Trigger a new deployment**
   
   **For Vercel:**
   - Click the **"Deployments"** tab
   - Click **"Redeploy"** button in the top right
   - Select **"Use existing Build Cache"** (optional - faster)
   - Click **"Redeploy"** to confirm

   **For Cloudflare Pages:**
   - Click **"Deployments"** in the left sidebar
   - Click **"Create deployment"** button
   - Select the production branch (usually `main` or `master`)
   - Click **"Save and Deploy"**

4. **Wait for deployment to complete**
   - The process typically takes 2-5 minutes
   - You'll see a progress indicator
   - Once complete, you'll see a success message with a preview URL

5. **Verify your articles are live**
   - Click the deployment URL to view the site
   - Navigate to the blog homepage
   - Confirm your new articles appear

#### Option B: Automatic Deployment via Git (If Configured)

If your team has set up automatic deployments:

1. **Commit a change to your repository**
   ```bash
   git commit --allow-empty -m "Trigger deployment for new articles"
   git push origin main
   ```

2. **The deployment will start automatically**
   - Check the dashboard to monitor progress

---

## 🚨 Troubleshooting

### Article Not Appearing After Deployment

**Problem:** I deployed the site, but my article isn't showing up.

**Solution Checklist:**
- [ ] Is the **Published** checkbox checked?
- [ ] Is the **Date** set to today or earlier (not a future date)?
- [ ] Does the article have a **Title** (Page property)?
- [ ] Did you wait for the deployment to fully complete (5+ minutes)?
- [ ] Try hard-refreshing your browser (Ctrl+F5 or Cmd+Shift+R)
- [ ] Check if the article appears in the Notion database view

### Article Shows Wrong Information

**Problem:** The article title/content is outdated or incorrect.

**Solution:**
1. Make your edits in Notion
2. **Important:** Changes in Notion don't appear instantly
3. Trigger a new deployment (see Part 2)
4. Wait for deployment to complete
5. Clear your browser cache

### Deployment Failed

**Problem:** The deployment shows an error or fails to complete.

**Solution:**
1. Check the deployment logs in your hosting dashboard
2. Common issues:
   - **API Timeout:** Notion API might be slow - retry deployment
   - **Missing Environment Variables:** Verify `NOTION_API_SECRET` and `DATABASE_ID` are set
   - **Node.js Version:** Ensure Node.js version is set correctly (20.18.1 or higher)
3. If the error persists, contact the technical team with:
   - Screenshot of the error
   - Deployment ID/timestamp
   - Link to the article in Notion

### Images Not Displaying

**Problem:** Article images are broken or not showing.

**Solution:**
- For Notion images: Ensure they're embedded properly in the page content
- For Featured Images: Re-upload the image to the FeaturedImage property
- Check file formats (JPG, PNG, WebP are supported)
- Ensure images are publicly accessible (not private Notion images)

---

## ❓ FAQ

### Q: How long does it take for an article to go live after deployment?

**A:** The deployment process takes 2-5 minutes. Once deployment completes, your article is immediately live. However, you might need to refresh your browser to see changes.

---

### Q: Can I schedule articles for future publication?

**A:** Yes! Set the **Date** property to a future date. The article won't appear until:
1. The date arrives (is today or in the past), AND
2. You trigger a new deployment after that date

**Example workflow:**
- December 29: Write article, set Date to January 5, check Published box
- January 5 or later: Trigger a deployment
- Result: Article goes live after the January 5+ deployment

---

### Q: What happens if I uncheck the Published checkbox?

**A:** The article will be removed from the website on the next deployment. It's not deleted from Notion—just hidden from the public site.

**Use this for:**
- Temporarily removing articles
- Unpublishing outdated content
- Hiding drafts you're working on

---

### Q: Do I need to deploy every time I publish a new article?

**A:** Yes. The website is statically generated, meaning it's built from Notion data at deployment time. New articles won't appear until you deploy.

**Best practice:** Batch your article publications and deploy once per day/week, depending on your publishing schedule.

---

### Q: Can multiple articles have the same slug?

**A:** No. Slugs must be unique. If you don't specify a slug:
- The system auto-generates one from the title
- If the title is identical to an existing article, add a number suffix manually (e.g., `guide-2`, `guide-3`)

---

### Q: What's the difference between Tags and AdminTags?

**A:** 
- **Tags:** Public-facing categories shown on the website. Readers can filter by these.
- **AdminTags:** Internal organization tags for your team. Not displayed publicly.

**Example:**
- Tags: "Marketing", "SEO", "Tutorials"
- AdminTags: "Needs Review", "Editor: John", "Priority: High"

---

### Q: How do I make an article "featured" on the homepage?

**A:** Set the **Rank** property to a high number (e.g., `10` for top priority, `5` for medium). Articles with higher Rank values appear first in featured sections.

---

### Q: Can I edit an article after it's published?

**A:** Yes! Make your edits in Notion, then deploy again. The changes will go live after the deployment completes.

**Note:** Old content remains cached on the live site until you redeploy.

---

### Q: Who has access to deploy the website?

**A:** (Update this section with your team's access policy)

Typically:
- **Team Leads:** Full deployment access
- **Content Managers:** Can request deployments
- **Writers:** Prepare articles in Notion

Contact [Your Admin Name] to request deployment access.

---

## 📞 Need Help?

If you're stuck or have questions not covered in this guide:

1. **Check the troubleshooting section** above
2. **Contact the technical team:**
   - Email: [your-email@domain.com]
   - Slack: #tech-support
   - (Update with your support channels)
3. **Include the following information:**
   - Link to the article in Notion
   - Screenshot of the issue
   - What you've tried so far

---

## 🔄 Version History

| Date | Changes |
|------|---------|
| 2025-12-29 | Initial documentation created |

---

**Happy Publishing! 🎉**


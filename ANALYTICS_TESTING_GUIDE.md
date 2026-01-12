# ✅ Analytics Tracking - Testing & Verification Guide

## 🎉 Tracking Implemented!

All tracking code has been successfully added to your website. Here's what's now tracking:

### ✅ Implemented Events

#### Article Engagement
- `article_viewed` - When someone views an article
- `article_scroll_depth` - At 25%, 50%, 75%, 90%, 100% scroll
- `article_completed` - When user reaches 90% scroll
- `reading_time` - Total active reading time when leaving page

#### Newsletter Performance
- `newsletter_modal_opened` - When modal displays (with trigger type)
- `newsletter_modal_dismissed` - When modal closes without subscribing
- `newsletter_subscribed` - When subscription succeeds (from modal or banner)
- `inline_banner_viewed` - When inline banner becomes visible
- `inline_banner_clicked` - When user submits inline banner form

#### User Interactions
- `menu_opened` - When mobile menu is opened
- `external_link_clicked` - When user clicks external links
- `related_article_clicked` - When user clicks related articles

---

## 🧪 How to Test (5 minutes)

### Step 1: Open Your Website in Browser
```
http://localhost:4321  (or your dev URL)
```

### Step 2: Open Browser Developer Tools
- **Chrome/Edge:** Press `F12` or `Right-click` → `Inspect`
- **Firefox:** Press `F12` or `Right-click` → `Inspect Element`
- **Safari:** Enable Developer menu first, then `Cmd+Option+I`

### Step 3: Go to Console Tab
Look for tracking confirmations

### Step 4: Test Each Event

#### Test Article Tracking
1. Navigate to any article
2. **Expected in Console:** `article_viewed` event
3. Scroll down slowly
4. **Expected:** Events fire at 25%, 50%, 75%, 90%, 100%

#### Test Newsletter Modal
1. On article page, scroll to 50%
2. **Expected:** Modal opens + `newsletter_modal_opened` with `trigger: "scroll"`
3. Close modal without subscribing
4. **Expected:** `newsletter_modal_dismissed` event

#### Test Newsletter Subscription
1. Click a "Inskreve" button
2. **Expected:** Modal opens + `newsletter_modal_opened` with `trigger: "cta_click"`
3. Fill in email and submit
4. **Expected:** `newsletter_subscribed` event

#### Test Inline Banner
1. Scroll to bottom of article
2. **Expected:** `inline_banner_viewed` when banner becomes visible
3. Submit email in banner form
4. **Expected:** `inline_banner_clicked` + `newsletter_subscribed` with `source: "inline_banner"`

#### Test Mobile Menu
1. Resize browser to mobile size (or use device toolbar)
2. Click hamburger menu
3. **Expected:** `menu_opened` with `device: "mobile"`

---

## 🔍 Verify in Umami Dashboard

### Step 1: Access Umami
```
URL: https://stats.ligadu.com
```

### Step 2: View Real-time Events
1. Log in to your Umami account
2. Select **Ligadu** website
3. Click on **Realtime** tab
4. You should see live visitors and pageviews

### Step 3: Check Custom Events
1. Click on **Events** tab
2. Wait 1-2 minutes for events to appear
3. You should see:
   - `article_viewed`
   - `article_scroll_depth`
   - `newsletter_modal_opened`
   - etc.

### Step 4: View Event Details
1. Click on any event name
2. See event properties (article name, trigger type, etc.)
3. View time series data

---

## 📊 What You'll See in Umami

### Events Tab
After testing, you should see events like:

```
Event Name                    | Count | Unique
------------------------------|-------|-------
article_viewed                |   5   |   1
article_scroll_depth          |  15   |   1
newsletter_modal_opened       |   2   |   1
newsletter_modal_dismissed    |   1   |   1
newsletter_subscribed         |   1   |   1
inline_banner_viewed          |   3   |   1
menu_opened                   |   2   |   1
```

### Event Properties
Click on an event to see properties:

**Example: newsletter_modal_opened**
- `trigger`: "scroll" | "time_delay" | "exit_intent" | "cta_click"
- `seconds_on_page`: 45
- `article`: "Article Title"

**Example: article_scroll_depth**
- `depth`: "50%"
- `article`: "Article Title"

---

## 🐛 Troubleshooting

### Issue 1: No Events Showing in Console

**Possible Causes:**
- Umami script not loaded yet
- Browser blocking trackers (AdBlock, Brave shields)

**Solution:**
```javascript
// In browser console, check if Umami is loaded:
console.log(typeof window.umami);
// Should return "object"

// If returns "undefined", Umami isn't loaded
// Check if script tag is present:
document.querySelector('[src*="umami"]');
```

**Fix:**
- Disable AdBlock on your site for testing
- Wait 2-3 seconds after page load

---

### Issue 2: Events Not Appearing in Umami Dashboard

**Possible Causes:**
- Wrong website ID
- Events not yet processed (delay up to 5 minutes)
- Umami instance not running

**Solution:**
1. **Check Website ID:**
   ```javascript
   // Look for this in your HTML:
   data-website-id="3a333f58-6b50-445d-9ccf-3cec581bc5e9"
   ```

2. **Wait 5 minutes** - Umami processes events in batches

3. **Check Umami Status:**
   - Go to `https://stats.ligadu.com`
   - Make sure it loads properly

---

### Issue 3: Article Tracking Not Working

**Check:**
```javascript
// In console on article page:
const articleTitle = document.querySelector('article h1')?.textContent?.trim();
console.log('Article title:', articleTitle);
// Should return actual article title, not null
```

**If null:**
- The article structure might be different
- Adjust selector if needed

---

### Issue 4: Scroll Tracking Fires Too Early/Late

**Check:**
```javascript
// In console:
const articleEnd = document.getElementById('article-content-end');
console.log('Article end marker:', articleEnd);
// Should return the marker element
```

**If null:**
- Marker missing in `[slug].astro`
- Check that `<div id="article-content-end">` exists

---

## 🎯 Quick Validation Checklist

Run through this checklist to verify everything works:

- [ ] Open website in browser
- [ ] Open Dev Tools Console
- [ ] Navigate to an article
- [ ] See "article_viewed" tracked (in console or network tab)
- [ ] Scroll to 50% of article
- [ ] See scroll depth events
- [ ] Modal opens automatically
- [ ] See "newsletter_modal_opened"
- [ ] Close modal
- [ ] See "newsletter_modal_dismissed"
- [ ] Click a CTA button
- [ ] Modal opens again
- [ ] Submit email (use test email)
- [ ] See "newsletter_subscribed"
- [ ] Scroll to inline banner
- [ ] See "inline_banner_viewed"
- [ ] Open mobile menu (if on mobile/resized)
- [ ] See "menu_opened"
- [ ] Go to Umami dashboard
- [ ] Wait 2-5 minutes
- [ ] Check Events tab
- [ ] See all events listed

---

## 📈 Expected Event Flow (User Journey)

### Typical Article Visit:
```
1. User lands on article
   → article_viewed

2. User reads (scrolls down)
   → article_scroll_depth: 25%
   → article_scroll_depth: 50%
   
3. Newsletter modal opens
   → newsletter_modal_opened (trigger: scroll)

4. User closes modal
   → newsletter_modal_dismissed (had_interaction: false)

5. User continues reading
   → article_scroll_depth: 75%
   → article_scroll_depth: 90%
   → article_completed

6. User sees inline banner
   → inline_banner_viewed

7. User subscribes via banner
   → inline_banner_clicked
   → newsletter_subscribed (source: inline_banner)

8. User leaves page
   → reading_time (seconds: 180, completed: true)
```

---

## 🔧 Manual Test Commands

Use these in browser console to manually trigger tracking:

```javascript
// Test article view
window.umami.track('article_viewed', { article: 'Test Article' });

// Test scroll depth
window.umami.track('article_scroll_depth', { depth: '50%', article: 'Test' });

// Test modal opened
window.umami.track('newsletter_modal_opened', { 
  trigger: 'test', 
  seconds_on_page: 30,
  article: 'Test'
});

// Test subscription
window.umami.track('newsletter_subscribed', { 
  source: 'modal',
  article: 'Test',
  already_subscribed: false
});

// Check if events are being sent
// Open Network tab, filter by "umami", trigger event, see request
```

---

## 📊 Umami Dashboard Setup

### Create Custom Reports

1. **Go to Umami Dashboard** → **Insights**
2. **Click "Create Report"**
3. **Select event type** (e.g., `newsletter_modal_opened`)
4. **Add filters:**
   - Filter by `trigger` property
   - Compare scroll vs time_delay vs exit_intent
5. **Save report** for quick access

### Recommended Reports to Create:

**1. Newsletter Conversion Funnel**
- Events: `newsletter_modal_opened` → `newsletter_subscribed`
- View conversion rate

**2. Article Engagement**
- Events: `article_viewed` → `article_scroll_depth` (90%)
- View completion rate

**3. Best Converting Articles**
- Events: `newsletter_subscribed`
- Group by `article` property
- Sort by count

**4. Best Newsletter Trigger**
- Events: `newsletter_modal_opened` + `newsletter_subscribed`
- Group by `trigger`
- Compare conversion rates

---

## ✅ Success Indicators

You'll know tracking is working correctly when:

### In Browser Console:
- No JavaScript errors
- Events logging (if you add console.log for testing)
- Network requests to Umami visible in Network tab

### In Umami Dashboard (after 5-10 min):
- Custom events appear in Events tab
- Event counts are incrementing
- Event properties are populated correctly
- Real-time shows current visitors

### In Practice:
- You can answer: "How many people read to the end?"
- You can answer: "Which trigger converts best?"
- You can answer: "What article drives most subscriptions?"

---

## 🚀 Next Steps After Verification

1. **Let it run for 1 week** - Collect baseline data
2. **Review ANALYTICS_DASHBOARD_TEMPLATE.md** - Set up Google Sheets
3. **Start weekly reviews** - Check Umami every Monday
4. **Make first data-driven decision** - Based on week 1 insights
5. **Iterate and optimize** - Adjust based on what you learn

---

## 📞 Need Help?

### Check These Files:
- `ANALYTICS_QUICKSTART.md` - Overview and getting started
- `ANALYTICS_STRATEGY.md` - Full strategy and metrics
- `ANALYTICS_IMPLEMENTATION.md` - Detailed technical guide

### Common Resources:
- Umami Docs: https://umami.is/docs
- Umami Events Guide: https://umami.is/docs/track-events
- Your Umami Dashboard: https://stats.ligadu.com

---

## 🎉 You're All Set!

Your analytics tracking is now live and collecting data. 

**What happens now:**
1. Events are tracked automatically
2. Data flows into Umami
3. You can view it in real-time
4. Make data-driven decisions

**Remember:**
- Wait 1 week before making major changes (need enough data)
- Check Umami dashboard weekly
- Document insights
- Iterate based on learning

**Happy tracking! 📊**



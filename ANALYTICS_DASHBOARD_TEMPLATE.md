# 📊 Analytics Dashboard Template (Google Sheets)

## Overview

This template helps you track and visualize key metrics from Umami and Buttondown in one place. Perfect for weekly/monthly reviews.

---

## 🗂️ Sheet Structure

Create a Google Sheet with these 5 tabs:

1. **📈 Overview Dashboard** - High-level KPIs
2. **📝 Content Performance** - Article metrics
3. **💌 Newsletter Funnel** - Subscription metrics
4. **👥 User Behavior** - Engagement metrics
5. **📅 Weekly Log** - Manual entry tracking

---

## Tab 1: Overview Dashboard

### Key Metrics Cards

| Metric | This Week | Last Week | Change | Target |
|--------|-----------|-----------|--------|--------|
| **Total Visitors** | | | | |
| **Page Views** | | | | |
| **Avg Session Duration** | | | | 3 min |
| **Bounce Rate** | | | | <60% |
| **Newsletter Subscribers** | | | | |
| **New Subscribers (7d)** | | | | |
| **Conversion Rate** | | | | >2% |
| **Modal Open Rate** | | | | |

### Charts to Include:

1. **Visitor Trend** (Line chart)
   - X-axis: Date (last 30 days)
   - Y-axis: Visitors
   - Data: From Umami

2. **Subscription Funnel** (Funnel chart)
   - Total Visitors
   - Modal Opened
   - Form Interaction
   - Subscribed

3. **Top 5 Articles** (Bar chart)
   - X-axis: Article title
   - Y-axis: Page views

4. **Newsletter Growth** (Line chart)
   - X-axis: Week
   - Y-axis: Total subscribers

---

## Tab 2: Content Performance

### Column Headers:

| Article Title | Category | Published Date | Page Views | Avg Time | Scroll 50% | Scroll 90% | Completed | Engagement Score | Subs Generated | Notes |
|--------------|----------|----------------|------------|----------|------------|------------|-----------|------------------|----------------|-------|
| | | | | | | | | | | |

### Formulas:

**Engagement Score** = `(Scroll 90% / Page Views * 50) + (Avg Time / 60 * 30) + (Subs Generated * 20)`

### How to Fill:

**From Umami:**
1. Go to **Pages** section
2. Sort by views
3. Export to CSV
4. Copy data into sheet

**Manual Entry:**
- Track scroll depth from custom events
- Track completions from `article_completed` event
- Track subscriptions from `newsletter_subscribed` where `article` matches

### Analysis Section:

| Top 5 by Views | Top 5 by Engagement | Top 5 by Conversions | Lowest Performers |
|----------------|---------------------|----------------------|-------------------|
| | | | |

---

## Tab 3: Newsletter Funnel

### Conversion Funnel Data:

| Stage | Count | % of Previous | % of Total | Drop-off |
|-------|-------|---------------|------------|----------|
| Total Visitors | | 100% | 100% | - |
| Modal Opened | | | | |
| Form Touched | | | | |
| Subscribed | | | | |

### Formula Examples:

- **% of Previous:** `=B4/B3` (copy down)
- **% of Total:** `=B4/$B$3` (copy down)
- **Drop-off:** `=1-(B4/B3)` (copy down)

### Trigger Performance:

| Trigger Type | Opens | Subscriptions | Conversion Rate | Avg Time to Subscribe |
|--------------|-------|---------------|-----------------|----------------------|
| Scroll | | | | |
| Time Delay | | | | |
| Exit Intent | | | | |
| CTA Click | | | | |
| Inline Banner | | | | |
| **TOTAL** | | | | |

**Data Source:** Umami custom events
- `newsletter_modal_opened` (filter by `trigger`)
- `newsletter_subscribed` (filter by `source`)

### Abandonment Analysis:

| Metric | Value | Notes |
|--------|-------|-------|
| Total Modal Opens | | From Umami |
| Dismissed Without Interaction | | `had_interaction = false` |
| Dismissed With Interaction | | `had_interaction = true` |
| Average Time Open (Dismissed) | | From `newsletter_modal_dismissed` |
| Abandonment Rate | | `=(Dismissed / Opened)` |

---

## Tab 4: User Behavior

### Session Metrics:

| Metric | This Week | Last Week | Target | Status |
|--------|-----------|-----------|--------|--------|
| Avg Pages per Session | | | 2.5 | |
| Avg Session Duration | | | 3 min | |
| Bounce Rate | | | <60% | |
| Return Visitor Rate | | | >30% | |

### Device Breakdown:

| Device | Visitors | % of Total | Avg Session | Conversion Rate |
|--------|----------|------------|-------------|-----------------|
| Desktop | | | | |
| Mobile | | | | |
| Tablet | | | | |

### Top Traffic Sources:

| Source | Visitors | % of Total | New Subs | Conversion Rate |
|--------|----------|------------|----------|-----------------|
| Direct | | | | |
| Organic Search | | | | |
| Social Media | | | | |
| Referral | | | | |

### User Interactions:

| Action | Count | Unique Users | Engagement Rate |
|--------|-------|--------------|-----------------|
| Search Used | | | |
| Mobile Menu Opened | | | |
| External Link Clicked | | | |
| Share Button Clicked | | | |
| Related Article Clicked | | | |

**Data Source:** 
- Umami events: `search_opened`, `menu_opened`, `external_link_clicked`, etc.
- Count from event logs

---

## Tab 5: Weekly Log

### Format: One row per week

| Week Starting | Total Visitors | Page Views | New Subscribers | Total Subscribers | Conversion Rate | Top Article | Best Trigger | Key Insights | Actions Taken |
|---------------|----------------|------------|-----------------|-------------------|-----------------|-------------|--------------|--------------|---------------|
| 2025-01-06 | | | | | | | | | |
| 2025-01-13 | | | | | | | | | |

### Monthly Summary Section:

| Month | Visitors | New Subs | Growth Rate | Avg Time | Top Content Category | Key Learnings |
|-------|----------|----------|-------------|----------|---------------------|---------------|
| Jan 2025 | | | | | | |

---

## 🔄 Data Collection Workflow

### Weekly (Every Monday):

1. **Open Umami Dashboard** (https://stats.ligadu.com)
2. **Export last 7 days data:**
   - Total visitors
   - Page views
   - Top pages
   - Event counts

3. **Check Buttondown:**
   - Total subscribers
   - New subscribers (last 7 days)
   - Email performance (if sent)

4. **Fill in Google Sheet:**
   - Tab 1: Update overview metrics
   - Tab 2: Update top 5 articles
   - Tab 3: Update conversion funnel
   - Tab 5: Add new weekly row

5. **Analyze:**
   - Compare to last week
   - Identify trends
   - Note anomalies
   - Plan content

### Monthly (First Monday):

1. **Generate monthly report** from weekly data
2. **Deep dive analysis:**
   - Content performance review
   - Newsletter optimization review
   - User behavior patterns
   
3. **Strategic planning:**
   - Identify top-performing content themes
   - Plan next month's content calendar
   - Adjust newsletter strategy

---

## 📊 Umami Data Export Guide

### Method 1: Manual Copy (Quick)

1. Go to Umami dashboard
2. Navigate to **"Pages"** or **"Events"**
3. Set date range (last 7 days)
4. Take screenshots or manually copy top items
5. Paste into spreadsheet

### Method 2: API Export (Advanced)

Use Umami API to pull data automatically:

```bash
# Get page views
curl -X GET 'https://stats.ligadu.com/api/websites/YOUR_WEBSITE_ID/stats' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json'
```

### Method 3: Browser Console (Quick Hack)

On Umami dashboard page:

```javascript
// Copy all data from current table
copy(Array.from(document.querySelectorAll('table tr')).map(row => 
  Array.from(row.querySelectorAll('td, th')).map(cell => cell.textContent).join('\t')
).join('\n'))
```

Then paste into Google Sheets (preserves table format).

---

## 📈 Buttondown Data Collection

### Manual Method:

1. Go to Buttondown → Analytics
2. Note:
   - Total subscribers
   - New subscribers (filter by date)
   - Unsubscribes
3. Copy into sheet

### API Method:

Create this script: `scripts/sync-buttondown-data.js`

```javascript
const axios = require('axios');
const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

const BUTTONDOWN_API = 'https://api.buttondown.email/v1';
const API_KEY = process.env.BUTTONDOWN_API_KEY;

async function syncSubscriberData() {
  try {
    // Fetch subscribers
    const response = await axios.get(`${BUTTONDOWN_API}/subscribers`, {
      headers: { 'Authorization': `Token ${API_KEY}` }
    });
    
    const subscribers = response.data.results;
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const stats = {
      total: subscribers.length,
      newLast7Days: subscribers.filter(s => 
        new Date(s.creation_date) > last7Days
      ).length,
      active: subscribers.filter(s => 
        s.subscriber_type === 'regular'
      ).length
    };
    
    console.log('📊 Subscriber Stats:', stats);
    
    // TODO: Write to Google Sheets using google-spreadsheet library
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

syncSubscriberData();
```

---

## 🎨 Conditional Formatting

### Set up in Google Sheets:

**Conversion Rate:**
- Green: ≥ 3%
- Yellow: 1-3%
- Red: < 1%

**Growth vs Target:**
- Green: ≥ Target
- Red: < Target

**Engagement Score:**
- Green: ≥ 75
- Yellow: 50-75
- Red: < 50

---

## 📋 Pre-filled Template

### Copy this Google Sheet Template:

[Create a copy of this template](https://docs.google.com/spreadsheets/d/YOUR_TEMPLATE_ID/copy)

Or create manually using the structure above.

---

## 🔔 Automated Reminders

### Set up Google Calendar reminders:

1. **Every Monday 9am:** "Update analytics spreadsheet"
2. **First Monday of month:** "Monthly analytics review"
3. **Every Friday:** "Check Umami dashboard"

---

## 💡 Quick Wins to Track

### Week 1:
- Basic visitor count
- Top 3 articles
- Total subscribers

### Week 2:
- Add scroll depth tracking
- Add modal open/close rates

### Week 3:
- Track conversion funnel
- Identify best trigger

### Week 4:
- Full dashboard operational
- Monthly review complete

---

## 📊 Sample Dashboard (Text Mockup)

```
╔══════════════════════════════════════════════════╗
║           LIGADU ANALYTICS DASHBOARD             ║
║                  Week of Jan 6                   ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  👥 VISITORS          📄 PAGE VIEWS              ║
║  2,450 (+15%)        5,680 (+22%)               ║
║                                                  ║
║  💌 NEW SUBS          📈 CONVERSION              ║
║  48 (+12)            1.96% (+0.3%)              ║
║                                                  ║
╠══════════════════════════════════════════════════╣
║  TOP ARTICLES THIS WEEK                          ║
║  1. "AI in Healthcare" - 580 views, 48% engaged ║
║  2. "Future of Tech" - 420 views, 52% engaged   ║
║  3. "Science Update" - 380 views, 41% engaged   ║
╠══════════════════════════════════════════════════╣
║  NEWSLETTER PERFORMANCE                          ║
║  Modals Opened: 320                             ║
║  Conversion Rate: 15% (48/320)                  ║
║  Best Trigger: Scroll (22 subs)                 ║
╠══════════════════════════════════════════════════╣
║  🎯 INSIGHTS                                     ║
║  • Healthcare content drives highest engagement  ║
║  • Scroll trigger outperforms time delay 2:1    ║
║  • Mobile traffic up 18% - optimize mobile UX   ║
║  • Exit intent has 8% conversion (test more)    ║
╚══════════════════════════════════════════════════╝
```

---

## ✅ Setup Checklist

- [ ] Create Google Sheet with 5 tabs
- [ ] Set up column headers
- [ ] Add formulas for calculated fields
- [ ] Set up conditional formatting
- [ ] Create charts for visualization
- [ ] Schedule weekly reminder
- [ ] Do first weekly entry
- [ ] Set up Buttondown API access
- [ ] Create data collection scripts (optional)
- [ ] Share with team

---

## 🚀 Next Steps

1. **Create your Google Sheet** using this template
2. **Do first manual entry** this week
3. **Set up weekly routine** (10 minutes every Monday)
4. **Review monthly** and adjust strategy
5. **Automate** with scripts when comfortable

---

**Need help?** Reference `ANALYTICS_STRATEGY.md` for full context and `ANALYTICS_IMPLEMENTATION.md` for technical setup.


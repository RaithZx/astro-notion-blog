# 📊 Analytics & Tracking Strategy for Ligadu Blog

## Executive Summary

This document outlines a comprehensive analytics strategy to track user behavior, content engagement, and newsletter performance. You currently have **Umami Analytics** and **Buttondown Newsletter** - this strategy maximizes both tools while adding custom event tracking.

---

## 🎯 Key Metrics to Track

### 1. **Content Engagement Metrics**
- Time spent on articles (reading time)
- Scroll depth (% of article read)
- Bounce rate vs engaged sessions
- Most read articles
- Article completion rate
- Return visitor rate

### 2. **Newsletter Metrics**
- Modal open rate
- Modal abandonment rate
- Subscription conversion rate
- Time to subscribe (from page load)
- Subscription source (inline banner vs modal vs exit intent)
- Newsletter unsubscribe rate (from Buttondown)

### 3. **User Behavior Metrics**
- Navigation patterns (page flow)
- Search usage
- Mobile vs desktop behavior
- Click heatmaps (which links/CTAs)
- Exit pages
- Session duration

### 4. **Business Intelligence Metrics**
- Most valuable content (leads to subscriptions)
- Content that drives traffic
- Peak reading times
- User journey to subscription

---

## 🛠️ Implementation Plan

### Phase 1: Enhanced Umami Event Tracking (IMMEDIATE)

Umami supports custom events. Add these tracking events to your website:

#### **A. Article Reading Behavior**

```javascript
// Track article scroll depth
function trackScrollDepth() {
  const depths = [25, 50, 75, 100];
  depths.forEach(depth => {
    // Fire event when user reaches depth
    umami.track('article_scroll_depth', { depth: `${depth}%`, article: articleTitle });
  });
}

// Track reading time
function trackReadingTime() {
  let startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000); // seconds
    umami.track('article_reading_time', { 
      seconds: timeSpent, 
      article: articleTitle,
      completed: scrollDepth > 90 
    });
  });
}

// Track article completion
function trackArticleCompletion() {
  // When user reaches end of article
  umami.track('article_completed', { article: articleTitle });
}
```

#### **B. Newsletter Modal Tracking**

```javascript
// Track modal open
umami.track('newsletter_modal_opened', { 
  trigger: 'scroll' | 'time_delay' | 'exit_intent' | 'cta_click',
  seconds_on_page: timeOnPage
});

// Track modal close without subscribing
umami.track('newsletter_modal_abandoned', { 
  seconds_open: timeModalOpen,
  had_interaction: formTouched
});

// Track subscription success
umami.track('newsletter_subscribed', { 
  source: 'modal' | 'inline_banner',
  article: articleTitle,
  seconds_on_site: totalTime
});

// Track inline banner view
umami.track('inline_banner_viewed', { article: articleTitle });

// Track inline banner click
umami.track('inline_banner_clicked', { article: articleTitle });
```

#### **C. User Interaction Tracking**

```javascript
// Track search usage
umami.track('search_opened');
umami.track('search_query', { query: searchTerm, results: resultCount });

// Track navigation
umami.track('menu_opened', { device: 'mobile' | 'desktop' });

// Track external link clicks
umami.track('external_link_clicked', { url: linkUrl, location: 'article_body' });

// Track share button clicks
umami.track('article_shared', { platform: 'twitter' | 'facebook' | 'linkedin', article: articleTitle });
```

---

### Phase 2: Buttondown Analytics Integration

#### **Track Newsletter Performance**

Buttondown provides API access to subscriber data. Set up periodic sync:

**Metrics to pull from Buttondown API:**
- Total subscribers
- New subscribers (daily/weekly/monthly)
- Unsubscribe rate
- Email open rates
- Email click-through rates
- Most clicked content in emails
- Subscriber growth rate

**Implementation:**
- Create a scheduled job (cron) to pull Buttondown analytics weekly
- Store in a simple database or Google Sheets
- Visualize trends over time

---

### Phase 3: Custom Analytics Dashboard (OPTIONAL)

Create a simple dashboard that combines:
- Umami data (via API)
- Buttondown data (via API)
- Custom metrics

**Tools:**
- **Simple:** Google Sheets + Umami API + Buttondown API
- **Advanced:** Custom Next.js dashboard or Metabase
- **Quick:** Notion database with API integrations

---

## 📈 Recommended Tracking Events

### Priority 1 (Implement First)

| Event Name | Trigger | Properties | Purpose |
|------------|---------|------------|---------|
| `article_viewed` | Page load on article | `title`, `category`, `tags` | Track popular content |
| `article_scroll_50` | 50% scroll depth | `title`, `time_to_reach` | Measure engagement |
| `article_scroll_90` | 90% scroll depth | `title`, `time_spent` | Track completion |
| `newsletter_modal_opened` | Modal displays | `trigger_type`, `time_on_page` | Modal effectiveness |
| `newsletter_modal_dismissed` | Close button clicked | `time_open`, `interaction` | Abandonment analysis |
| `newsletter_subscribed` | Form submitted | `source`, `article`, `time_to_convert` | Conversion tracking |
| `reading_time_tracked` | Page unload | `seconds`, `scroll_depth` | Engagement depth |

### Priority 2 (Add Later)

| Event Name | Trigger | Properties | Purpose |
|------------|---------|------------|---------|
| `inline_banner_clicked` | Banner CTA click | `article`, `position` | Banner effectiveness |
| `search_performed` | Search submitted | `query`, `results` | Content discovery |
| `related_article_clicked` | Related link click | `from_article`, `to_article` | Content flow |
| `external_link_clicked` | External link click | `url`, `article` | Outbound interest |
| `mobile_menu_opened` | Menu button click | - | Mobile UX |
| `share_button_clicked` | Share click | `platform`, `article` | Social engagement |

### Priority 3 (Advanced)

| Event Name | Trigger | Properties | Purpose |
|------------|---------|------------|---------|
| `session_engaged` | 30s+ on site | `pages_viewed`, `interactions` | Quality sessions |
| `return_visitor` | 2nd+ visit | `days_since_last`, `total_visits` | Loyalty |
| `content_copied` | Text selection + copy | `article`, `text_length` | Content value |
| `video_played` | Video interaction | `article`, `duration` | Media engagement |
| `comment_submitted` | Comment posted | `article` | Community engagement |

---

## 🔧 Technical Implementation

### Step 1: Add Umami Event Tracking Helper

Create a utility file for consistent tracking:

```javascript
// lib/analytics.js

export const trackEvent = (eventName, properties = {}) => {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(eventName, properties);
  }
};

export const trackPageView = (title) => {
  trackEvent('page_view', { title });
};

export const trackArticleEvent = (eventType, articleTitle, additionalData = {}) => {
  trackEvent(`article_${eventType}`, {
    article: articleTitle,
    ...additionalData
  });
};

export const trackNewsletterEvent = (eventType, data = {}) => {
  trackEvent(`newsletter_${eventType}`, data);
};
```

### Step 2: Implement Scroll Depth Tracking

Add to your `Layout.astro` or article pages:

```javascript
// Track scroll depth on article pages
const articleTitle = document.querySelector('h1')?.textContent || 'Unknown';
const depthMarkers = { 25: false, 50: false, 75: false, 90: false, 100: false };
let maxScrollDepth = 0;

function calculateScrollDepth() {
  const articleContent = document.getElementById('article-content-end');
  if (!articleContent) return 0;
  
  const windowHeight = window.innerHeight;
  const documentHeight = articleContent.offsetTop;
  const scrollTop = window.scrollY;
  
  return Math.min(100, Math.round((scrollTop / (documentHeight - windowHeight)) * 100));
}

window.addEventListener('scroll', () => {
  const currentDepth = calculateScrollDepth();
  maxScrollDepth = Math.max(maxScrollDepth, currentDepth);
  
  // Track milestone depths
  Object.keys(depthMarkers).forEach(depth => {
    if (currentDepth >= depth && !depthMarkers[depth]) {
      depthMarkers[depth] = true;
      umami.track('article_scroll_depth', { 
        depth: `${depth}%`, 
        article: articleTitle 
      });
    }
  });
});
```

### Step 3: Track Reading Time

```javascript
let startTime = Date.now();
let isActive = true;
let totalActiveTime = 0;

// Track active vs idle time
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    totalActiveTime += Date.now() - startTime;
    isActive = false;
  } else {
    startTime = Date.now();
    isActive = true;
  }
});

// Send reading time on page unload
window.addEventListener('beforeunload', () => {
  const finalTime = isActive ? Date.now() - startTime : 0;
  const totalSeconds = Math.round((totalActiveTime + finalTime) / 1000);
  
  umami.track('reading_time', {
    article: articleTitle,
    seconds: totalSeconds,
    scroll_depth: maxScrollDepth,
    completed: maxScrollDepth >= 90
  });
});
```

### Step 4: Update Newsletter Tracking

Modify your existing newsletter code to add tracking:

```javascript
// When modal opens
function openNewsletterModal() {
  newsletterModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  // TRACK: Modal opened
  umami.track('newsletter_modal_opened', {
    trigger: currentTrigger, // 'scroll', 'time', 'exit_intent', 'cta'
    seconds_on_page: Math.round((Date.now() - pageLoadTime) / 1000),
    article: articleTitle || 'homepage'
  });
  
  modalOpenTime = Date.now();
}

// When modal closes
function closeNewsletterModal() {
  const timeOpen = Math.round((Date.now() - modalOpenTime) / 1000);
  const formTouched = document.getElementById('newsletter-email').value.length > 0;
  
  // TRACK: Modal dismissed
  umami.track('newsletter_modal_dismissed', {
    seconds_open: timeOpen,
    had_interaction: formTouched,
    article: articleTitle || 'homepage'
  });
  
  newsletterModal.classList.add('hidden');
  document.body.style.overflow = '';
}

// When subscription succeeds
if (response.ok && data.success) {
  // TRACK: Subscription success
  umami.track('newsletter_subscribed', {
    source: 'modal',
    article: articleTitle || 'homepage',
    seconds_to_convert: Math.round((Date.now() - pageLoadTime) / 1000),
    already_subscribed: data.alreadySubscribed || false
  });
}
```

---

## 📊 Analytics Dashboard Setup

### Option 1: Umami Built-in Dashboard

**Access:** `https://stats.ligadu.com`

**Custom Events to Add:**
1. Go to Settings → Events
2. Add custom event tracking for all events listed above
3. Create custom reports for:
   - Newsletter conversion funnel
   - Article engagement by category
   - User journey flows

### Option 2: Google Sheets Dashboard (Recommended)

Create a simple dashboard that pulls data from:
- Umami API (events, pageviews)
- Buttondown API (subscriber stats)

**Sheets to Create:**
1. **Content Performance:** Article views, avg time, scroll depth
2. **Newsletter Funnel:** Opens → Interactions → Subscriptions
3. **User Behavior:** Session duration, bounce rate, return rate
4. **Growth Metrics:** Weekly/monthly subscribers, unsubscribes

### Option 3: Metabase / Superset (Advanced)

For deeper analysis, connect Umami database to Metabase:
- SQL queries for custom reports
- Automated email reports
- Interactive dashboards

---

## 🎯 Key Performance Indicators (KPIs)

### Content KPIs
- **Engagement Rate:** % of visitors who scroll >50%
- **Target:** >40%
- **Completion Rate:** % who reach 90% scroll
- **Target:** >25%
- **Avg Reading Time:** Minutes per article
- **Target:** >3 minutes

### Newsletter KPIs
- **Modal Conversion Rate:** Subscriptions / Modal Opens
- **Target:** >5%
- **Overall Conversion Rate:** Subscriptions / Total Visitors
- **Target:** >2%
- **Abandonment Rate:** Modal Closes / Modal Opens
- **Target:** <80%
- **Time to Subscribe:** Avg seconds from page load
- **Benchmark:** <120 seconds

### Business KPIs
- **Subscriber Growth Rate:** New subs / Total subs (monthly)
- **Target:** >10% monthly
- **Email Open Rate:** (from Buttondown)
- **Target:** >30%
- **Click-Through Rate:** (from Buttondown)
- **Target:** >5%
- **Subscriber Lifetime:** Avg days before unsubscribe
- **Target:** >180 days

---

## 🔍 Analysis & Insights Workflow

### Weekly Review
1. **Check Umami dashboard** for:
   - Top 10 articles by views
   - Avg scroll depth per article
   - Newsletter modal performance
   
2. **Check Buttondown** for:
   - New subscribers this week
   - Unsubscribe rate
   - Last email performance

3. **Identify patterns:**
   - Which articles drive subscriptions?
   - What scroll depth correlates with subscription?
   - What trigger (time/scroll/exit) works best?

### Monthly Deep Dive
1. **Content analysis:**
   - Best performing categories
   - Articles with high engagement but low views (promote more)
   - Articles with high views but low engagement (improve content)

2. **Funnel analysis:**
   - Where do users drop off?
   - Is modal timing optimal?
   - A/B test different triggers

3. **Growth analysis:**
   - Subscriber growth trend
   - Correlation between content and subscribers
   - ROI of content categories

### Quarterly Strategy Review
1. **Content strategy:**
   - Double down on high-performing topics
   - Retire or refresh low-performing content
   - Plan content calendar based on data

2. **Newsletter optimization:**
   - Test different modal copy
   - Adjust trigger timing
   - Experiment with incentives

3. **User experience:**
   - Identify friction points
   - Improve mobile experience
   - Enhance navigation

---

## 🚀 Quick Win Actions

### This Week
1. ✅ Add scroll depth tracking to articles
2. ✅ Add newsletter modal event tracking
3. ✅ Set up custom events in Umami dashboard
4. ✅ Create a simple tracking spreadsheet

### This Month
1. ✅ Implement full reading time tracking
2. ✅ Add inline banner tracking
3. ✅ Connect Buttondown API for subscriber data
4. ✅ Create weekly analytics review habit
5. ✅ Set up automated reports (Umami → Email)

### This Quarter
1. ✅ Build comprehensive analytics dashboard
2. ✅ Implement A/B testing for newsletter modals
3. ✅ Set up cohort analysis for subscribers
4. ✅ Create content performance ranking system
5. ✅ Implement predictive analytics for content performance

---

## 🔗 Integration with Existing Tools

### Umami Analytics
- **Already integrated** ✅
- **Add:** Custom event tracking
- **Add:** Goals and conversion funnels
- **Add:** API access for data export

### Buttondown Newsletter
- **Already integrated** ✅
- **Add:** API key for data access
- **Add:** Webhook for real-time subscriber events
- **Add:** Tag subscribers by article source

### Potential Additions
1. **Hotjar / Microsoft Clarity:** Visual heatmaps (FREE)
2. **Plausible Analytics:** Privacy-first alternative to GA
3. **Fathom Analytics:** Another privacy option
4. **PostHog:** Product analytics with session recording

---

## 💰 Cost Analysis

| Tool | Cost | Value | Priority |
|------|------|-------|----------|
| Umami (current) | FREE (self-hosted) | ⭐⭐⭐⭐⭐ | Essential |
| Buttondown | FREE → $9/mo | ⭐⭐⭐⭐⭐ | Essential |
| Microsoft Clarity | FREE | ⭐⭐⭐⭐ | High |
| Google Sheets | FREE | ⭐⭐⭐⭐ | High |
| Metabase | FREE (self-hosted) | ⭐⭐⭐ | Medium |
| Hotjar | $0-$39/mo | ⭐⭐⭐ | Medium |
| PostHog | $0-$450/mo | ⭐⭐ | Low |

**Recommended Stack (FREE):**
- Umami + Custom Events
- Buttondown
- Microsoft Clarity
- Google Sheets Dashboard

---

## 📝 Next Steps

1. **Review this document** with your team
2. **Prioritize metrics** based on business goals
3. **Implement Phase 1** (Umami events) this week
4. **Create tracking spreadsheet** template
5. **Schedule weekly analytics review** meeting
6. **Set up automated reports** from Umami
7. **Document insights** and iterate

---

## 📚 Resources

- [Umami Event Tracking Docs](https://umami.is/docs/track-events)
- [Buttondown API Docs](https://buttondown.email/features/api)
- [Google Analytics Event Best Practices](https://support.google.com/analytics/answer/1033068)
- [Content Analytics Guide](https://moz.com/blog/content-analytics)
- [Newsletter Analytics Guide](https://www.litmus.com/blog/email-marketing-metrics)

---

**Document Version:** 1.0  
**Last Updated:** December 2025  
**Owner:** Marketing/Analytics Team  
**Review Cycle:** Quarterly


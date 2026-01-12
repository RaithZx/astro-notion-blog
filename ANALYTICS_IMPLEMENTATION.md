# 🔧 Analytics Implementation Guide

## Quick Start: Add These Tracking Events Today

This guide provides **copy-paste code** to implement the analytics strategy. All code is ready to integrate into your existing Astro site.

---

## 1️⃣ Create Analytics Utility File

First, create a helper file for consistent tracking:

### File: `src/lib/analytics.ts`

```typescript
/**
 * Analytics Tracking Utility
 * Wrapper for Umami event tracking
 */

export const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami.track(eventName, properties);
  } else {
    console.log('[Analytics]', eventName, properties); // Dev logging
  }
};

// Convenience methods
export const analytics = {
  // Article events
  articleViewed: (title: string, category?: string) => {
    trackEvent('article_viewed', { title, category });
  },
  
  articleScrolled: (title: string, depth: number) => {
    trackEvent('article_scroll_depth', { title, depth: `${depth}%` });
  },
  
  articleCompleted: (title: string, timeSpent: number) => {
    trackEvent('article_completed', { title, time_spent_seconds: timeSpent });
  },
  
  readingTime: (title: string, seconds: number, scrollDepth: number) => {
    trackEvent('reading_time', { 
      title, 
      seconds, 
      scroll_depth: scrollDepth,
      completed: scrollDepth >= 90 
    });
  },
  
  // Newsletter events
  newsletterModalOpened: (trigger: string, timeOnPage: number, article?: string) => {
    trackEvent('newsletter_modal_opened', { 
      trigger, 
      seconds_on_page: timeOnPage,
      article: article || 'homepage'
    });
  },
  
  newsletterModalDismissed: (timeOpen: number, hadInteraction: boolean, article?: string) => {
    trackEvent('newsletter_modal_dismissed', { 
      seconds_open: timeOpen,
      had_interaction: hadInteraction,
      article: article || 'homepage'
    });
  },
  
  newsletterSubscribed: (source: string, article: string, timeToConvert: number, alreadySubscribed: boolean) => {
    trackEvent('newsletter_subscribed', { 
      source, 
      article,
      seconds_to_convert: timeToConvert,
      already_subscribed: alreadySubscribed
    });
  },
  
  inlineBannerViewed: (article: string) => {
    trackEvent('inline_banner_viewed', { article });
  },
  
  inlineBannerClicked: (article: string) => {
    trackEvent('inline_banner_clicked', { article });
  },
  
  // User interaction events
  searchOpened: () => {
    trackEvent('search_opened');
  },
  
  searchPerformed: (query: string, resultCount: number) => {
    trackEvent('search_performed', { query, result_count: resultCount });
  },
  
  menuOpened: (device: string) => {
    trackEvent('menu_opened', { device });
  },
  
  externalLinkClicked: (url: string, article?: string) => {
    trackEvent('external_link_clicked', { url, article });
  },
  
  shareClicked: (platform: string, article: string) => {
    trackEvent('article_shared', { platform, article });
  },
  
  relatedArticleClicked: (fromArticle: string, toArticle: string) => {
    trackEvent('related_article_clicked', { from: fromArticle, to: toArticle });
  }
};
```

---

## 2️⃣ Add Article Tracking to Layout

### Update: `src/layouts/Layout.astro`

Add this script at the end of your Layout.astro, **AFTER** the newsletter tracking code:

```javascript
<!-- Article Reading & Engagement Tracking -->
<script>
  // Only track on article pages
  const isArticlePage = document.querySelector('article') !== null;
  const articleTitle = document.querySelector('h1')?.textContent?.trim() || 'Unknown';
  
  if (isArticlePage && typeof window.umami !== 'undefined') {
    // Track article view
    window.umami.track('article_viewed', { article: articleTitle });
    
    // Scroll depth tracking
    const depthMarkers = { 25: false, 50: false, 75: false, 90: false, 100: false };
    let maxScrollDepth = 0;
    
    function calculateScrollDepth() {
      const articleEnd = document.getElementById('article-content-end');
      if (!articleEnd) {
        // Fallback to page scroll
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.scrollHeight;
        const scrollTop = window.scrollY;
        return Math.min(100, Math.round(((scrollTop + windowHeight) / documentHeight) * 100));
      }
      
      const articleRect = articleEnd.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const articleHeight = articleRect.top + scrollY;
      
      return Math.min(100, Math.round((scrollY / (articleHeight - viewportHeight)) * 100));
    }
    
    // Throttled scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) return;
      
      scrollTimeout = setTimeout(() => {
        const currentDepth = calculateScrollDepth();
        maxScrollDepth = Math.max(maxScrollDepth, currentDepth);
        
        // Track milestone depths
        Object.keys(depthMarkers).forEach(depth => {
          const depthNum = parseInt(depth);
          if (currentDepth >= depthNum && !depthMarkers[depth]) {
            depthMarkers[depth] = true;
            window.umami.track('article_scroll_depth', { 
              depth: `${depth}%`, 
              article: articleTitle 
            });
            
            // Track completion at 90%
            if (depthNum === 90) {
              const timeSpent = Math.round((Date.now() - pageLoadTime) / 1000);
              window.umami.track('article_completed', { 
                article: articleTitle,
                time_spent: timeSpent
              });
            }
          }
        });
        
        scrollTimeout = null;
      }, 200);
    });
    
    // Reading time tracking
    const pageLoadTime = Date.now();
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
      
      // Only track if user spent meaningful time (>5 seconds)
      if (totalSeconds > 5) {
        window.umami.track('reading_time', {
          article: articleTitle,
          seconds: totalSeconds,
          scroll_depth: maxScrollDepth,
          completed: maxScrollDepth >= 90
        });
      }
    });
  }
</script>
```

---

## 3️⃣ Update Newsletter Tracking

### Modify Your Existing Newsletter Code in `src/layouts/Layout.astro`

Find your existing newsletter functions and **add tracking calls**:

```javascript
// Add these variables at the top of your newsletter script
let modalOpenTime = 0;
let currentTrigger = 'unknown';
const pageLoadTime = Date.now();

// MODIFY: openNewsletterModal function
function openNewsletterModal(trigger = 'unknown') {
  currentTrigger = trigger; // Store trigger type
  newsletterModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  modalOpenTime = Date.now();
  
  // ✅ TRACK: Modal opened
  if (typeof window.umami !== 'undefined') {
    window.umami.track('newsletter_modal_opened', {
      trigger: trigger,
      seconds_on_page: Math.round((Date.now() - pageLoadTime) / 1000),
      article: document.querySelector('h1')?.textContent?.trim() || 'homepage'
    });
  }
  
  // Focus on email input
  setTimeout(() => {
    document.getElementById('newsletter-email').focus();
  }, 100);
}

// MODIFY: closeNewsletterModal function  
function closeNewsletterModal() {
  const timeOpen = Math.round((Date.now() - modalOpenTime) / 1000);
  const emailInput = document.getElementById('newsletter-email');
  const formTouched = emailInput && emailInput.value.length > 0;
  
  // ✅ TRACK: Modal dismissed (only if not already subscribed)
  if (typeof window.umami !== 'undefined' && modalOpenTime > 0) {
    window.umami.track('newsletter_modal_dismissed', {
      seconds_open: timeOpen,
      had_interaction: formTouched,
      article: document.querySelector('h1')?.textContent?.trim() || 'homepage'
    });
  }
  
  newsletterModal.classList.add('hidden');
  document.body.style.overflow = '';
  newsletterForm.reset();
  modalOpenTime = 0;
}

// MODIFY: Your newsletter form submission
// Find where you handle successful subscription and add:
if (response.ok && data.success) {
  // ✅ TRACK: Subscription success
  if (typeof window.umami !== 'undefined') {
    window.umami.track('newsletter_subscribed', {
      source: 'modal',
      article: document.querySelector('h1')?.textContent?.trim() || 'homepage',
      seconds_to_convert: Math.round((Date.now() - pageLoadTime) / 1000),
      already_subscribed: data.alreadySubscribed || false
    });
  }
  
  // Your existing success code...
  showNotification(/* ... */);
  localStorage.setItem('newsletter_subscribed', 'true');
  closeNewsletterModal();
}

// UPDATE: Your trigger event listeners to pass trigger type
// Scroll trigger
if (scrollPercent > 50 && scrollPercent < 100) {
  hasShownModal = true;
  setTimeout(() => openNewsletterModal('scroll'), 500);
}

// Time delay trigger
setTimeout(() => {
  if (!hasShownModal && !isSubscribed && !isDismissed) {
    hasShownModal = true;
    openNewsletterModal('time_delay');
  }
}, 30000);

// Exit intent trigger
document.addEventListener('mouseleave', (e) => {
  if (e.clientY <= 0 && !hasShownModal && !isSubscribed && !isDismissed) {
    hasShownModal = true;
    openNewsletterModal('exit_intent');
  }
});

// CTA button triggers
ctaButtons.forEach(btn => {
  btn.addEventListener('click', () => openNewsletterModal('cta_click'));
});
```

---

## 4️⃣ Add Inline Banner Tracking

### Update: `src/components/subscribeBanner.astro`

Add tracking for the inline banner:

```javascript
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const banner = document.querySelector('.inline-newsletter-banner'); // Add this class to your banner
    const articleTitle = document.querySelector('h1')?.textContent?.trim() || 'Unknown';
    
    if (banner && typeof window.umami !== 'undefined') {
      // Track banner view when it comes into viewport
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            window.umami.track('inline_banner_viewed', { article: articleTitle });
            observer.disconnect(); // Only track once
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(banner);
      
      // Track banner click
      const bannerForm = banner.querySelector('form');
      if (bannerForm) {
        bannerForm.addEventListener('submit', () => {
          window.umami.track('inline_banner_clicked', { article: articleTitle });
        });
      }
    }
  });
</script>
```

**Also add the class to your banner HTML:**

```astro
<div class="inline-newsletter-banner bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg px-6 py-5 mt-12 mb-8">
  <!-- Your existing banner content -->
</div>
```

---

## 5️⃣ Add Search Tracking

### Update: Your search modal code

```javascript
// When search modal opens
function openSearchModal() {
  // Your existing code...
  
  // ✅ TRACK: Search opened
  if (typeof window.umami !== 'undefined') {
    window.umami.track('search_opened');
  }
}

// When search is performed
function performSearch(query) {
  // Your existing search logic...
  const results = getSearchResults(query); // Your search function
  
  // ✅ TRACK: Search performed
  if (typeof window.umami !== 'undefined') {
    window.umami.track('search_performed', {
      query: query,
      result_count: results.length
    });
  }
}
```

---

## 6️⃣ Add Mobile Menu Tracking

### Update: Mobile menu in `src/layouts/Layout.astro`

```javascript
// In your openMobileMenu function, add:
function openMobileMenu() {
  // Your existing code...
  
  // ✅ TRACK: Mobile menu opened
  if (typeof window.umami !== 'undefined') {
    window.umami.track('menu_opened', { device: 'mobile' });
  }
}
```

---

## 7️⃣ Track External Links & Shares

### Add this script to `src/layouts/Layout.astro`:

```javascript
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const articleTitle = document.querySelector('h1')?.textContent?.trim();
    
    // Track external link clicks
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      // Skip internal links
      if (link.href.includes(window.location.hostname)) return;
      
      link.addEventListener('click', () => {
        if (typeof window.umami !== 'undefined') {
          window.umami.track('external_link_clicked', {
            url: link.href,
            article: articleTitle || 'homepage'
          });
        }
      });
    });
    
    // Track share button clicks (add data-platform attribute to your share buttons)
    document.querySelectorAll('[data-share-platform]').forEach(button => {
      button.addEventListener('click', () => {
        const platform = button.getAttribute('data-share-platform');
        if (typeof window.umami !== 'undefined' && articleTitle) {
          window.umami.track('article_shared', {
            platform: platform,
            article: articleTitle
          });
        }
      });
    });
    
    // Track related article clicks
    document.querySelectorAll('.related-articles a').forEach(link => {
      link.addEventListener('click', () => {
        const toArticle = link.textContent?.trim() || link.href;
        if (typeof window.umami !== 'undefined' && articleTitle) {
          window.umami.track('related_article_clicked', {
            from: articleTitle,
            to: toArticle
          });
        }
      });
    });
  });
</script>
```

---

## 8️⃣ Verify Tracking is Working

### Test in Browser Console

1. Open your website in browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Check for tracking logs (if in dev mode)
5. Go to Network tab and filter for "umami" to see events being sent

### Test Commands:

```javascript
// Test manual tracking
window.umami.track('test_event', { test: 'data' });

// Check if Umami is loaded
console.log(typeof window.umami); // Should be 'object'
```

---

## 9️⃣ View Your Data in Umami

1. Go to: `https://stats.ligadu.com`
2. Log in to your Umami dashboard
3. Navigate to: **Events** tab
4. You should now see custom events like:
   - `article_viewed`
   - `article_scroll_depth`
   - `newsletter_modal_opened`
   - `newsletter_subscribed`
   - etc.

### Create Custom Reports:

1. Click **"Insights"** → **"Create Report"**
2. Select event type (e.g., `newsletter_modal_opened`)
3. Add filters (e.g., by `trigger` property)
4. Save report for quick access

---

## 🔟 Set Up Buttondown API Access

### Get API Key:

1. Log in to Buttondown: https://buttondown.email
2. Go to Settings → Programming
3. Copy your API key

### Store in Environment Variables:

Add to your `.env` file:

```env
BUTTONDOWN_API_KEY=your_api_key_here
```

### Create Subscriber Stats Script:

Create: `scripts/check-subscriber-stats.js`

```javascript
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.BUTTONDOWN_API_KEY;

async function getSubscriberStats() {
  try {
    // Get total subscribers
    const response = await axios.get('https://api.buttondown.email/v1/subscribers', {
      headers: {
        'Authorization': `Token ${API_KEY}`
      }
    });
    
    const subscribers = response.data.results;
    console.log('\n📊 Buttondown Subscriber Stats\n');
    console.log(`Total Subscribers: ${subscribers.length}`);
    
    // Calculate stats
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const newLast7 = subscribers.filter(s => new Date(s.creation_date) > last7Days).length;
    const newLast30 = subscribers.filter(s => new Date(s.creation_date) > last30Days).length;
    
    console.log(`New (Last 7 days): ${newLast7}`);
    console.log(`New (Last 30 days): ${newLast30}`);
    console.log(`Active Subscribers: ${subscribers.filter(s => s.subscriber_type === 'regular').length}`);
    
    // Growth rate
    const growthRate = (newLast30 / (subscribers.length - newLast30)) * 100;
    console.log(`Monthly Growth Rate: ${growthRate.toFixed(2)}%\n`);
    
  } catch (error) {
    console.error('Error fetching subscriber stats:', error.message);
  }
}

getSubscriberStats();
```

### Run Monthly:

```bash
node scripts/check-subscriber-stats.js
```

---

## ✅ Implementation Checklist

- [ ] Create `src/lib/analytics.ts` utility file
- [ ] Add article tracking script to Layout.astro
- [ ] Update newsletter modal tracking (open/close/subscribe)
- [ ] Add inline banner tracking
- [ ] Add search tracking
- [ ] Add mobile menu tracking
- [ ] Add external link tracking
- [ ] Test tracking in browser console
- [ ] Verify events in Umami dashboard
- [ ] Set up Buttondown API access
- [ ] Create subscriber stats script
- [ ] Schedule weekly analytics review

---

## 📈 Expected Results

After implementation, you'll be able to answer:

### Content Questions:
- ✅ Which articles are most engaging?
- ✅ What % of readers finish articles?
- ✅ How long do people spend on average?
- ✅ Which topics drive the most engagement?

### Newsletter Questions:
- ✅ What % of visitors see the modal?
- ✅ What % subscribe after seeing it?
- ✅ Which trigger (scroll/time/exit) works best?
- ✅ How long before people subscribe?
- ✅ Where do subscribers drop off?

### Business Questions:
- ✅ What content drives subscriptions?
- ✅ What's our conversion funnel?
- ✅ How fast are we growing?
- ✅ What's our user journey?

---

## 🚨 Troubleshooting

### Events Not Showing in Umami?

1. **Check Umami is loaded:**
   ```javascript
   console.log(window.umami);
   ```

2. **Check for errors in console**

3. **Verify website ID is correct** in your Umami script tag

4. **Wait 5-10 minutes** - sometimes there's a delay

### Tracking Code Not Running?

1. **Check script placement** - should be inside `<script>` tags
2. **Check for JavaScript errors** in console
3. **Verify page is fully loaded** before tracking fires
4. **Test with manual event:** `window.umami.track('test')`

### Need Help?

- Check Umami docs: https://umami.is/docs
- Check browser console for errors
- Verify Umami dashboard is accessible
- Test with simple manual tracking first

---

**Ready to implement?** Start with steps 1-3 today for immediate insights! 🚀



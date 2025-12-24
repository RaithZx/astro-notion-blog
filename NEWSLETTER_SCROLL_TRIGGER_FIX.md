# Newsletter Scroll Trigger Update

## Problem Fixed

**Before:** The scroll trigger calculated percentage based on the **entire page height** (including header, footer, sidebar, related articles). This meant the modal would pop up when users were at 50% of the page - often in the footer or related articles section, not while reading the article.

**After:** The scroll trigger now calculates percentage based on the **article content only**. Modal appears when user has read 50% of the actual article text.

---

## Changes Made

### 1. Added Article Content Marker

**File:** `src/pages/posts/[slug].astro` (line 133)

Added an invisible marker at the end of article content:

```astro
<PostBody blocks={blocks} />

<!-- Article end marker for scroll tracking -->
<div id="article-content-end" style="height: 1px;"></div>

<ShareButtons ... />
```

This marker tells the JavaScript exactly where the article ends.

### 2. Updated Scroll Logic

**File:** `src/layouts/Layout.astro` (lines 609-650)

New intelligent scroll detection:

```javascript
// First, try to find the article end marker (blog posts)
const articleEndMarker = document.getElementById('article-content-end');

if (articleEndMarker) {
  // For blog posts: trigger based on article content
  const articleEnd = articleEndMarker.offsetTop;
  const scrollPosition = window.scrollY + window.innerHeight;
  const articleStart = articleEndMarker.parentElement.offsetTop || 0;
  const articleHeight = articleEnd - articleStart;
  const scrolledInArticle = scrollPosition - articleStart;
  const articleScrollPercent = (scrolledInArticle / articleHeight) * 100;
  
  // Trigger at 50% of article content
  if (articleScrollPercent > 50) {
    hasShownModal = true;
    setTimeout(openNewsletterModal, 500);
  }
} else {
  // Fallback for other pages (home, about, etc.)
  // Uses main content area instead
}
```

---

## How It Works Now

### Blog Post Pages

```
┌─────────────────────────────────┐
│ Header / Navigation             │
├─────────────────────────────────┤
│ Article Title                   │
│ Date, Tags                      │
├─────────────────────────────────┤
│                                 │
│ Article Content Starts          │ ← Start point
│                                 │
│ Paragraph 1...                  │
│ Paragraph 2...                  │
│ Paragraph 3...                  │
│ Paragraph 4...                  │
│ ───────────────────── 50% ✨   │ ← MODAL TRIGGERS HERE
│ Paragraph 5...                  │
│ Paragraph 6...                  │
│ Paragraph 7...                  │
│                                 │
│ Article Content Ends            │ ← End marker
├─────────────────────────────────┤
│ Share Buttons                   │
│ Related Articles                │
│ Footer                          │ ← OLD: Would trigger here ❌
└─────────────────────────────────┘
```

### Other Pages (Home, About, etc.)

Falls back to main content area detection:
- Finds `<main>` or `[slot="main"]` element
- Calculates scroll based on that container
- Still avoids footer/navigation in calculation

---

## Benefits

✅ **Better timing** - Modal appears while user is actively reading  
✅ **More engagement** - Catches users when they're engaged with content  
✅ **Less annoying** - Not interrupting at footer or unrelated sections  
✅ **Accurate tracking** - Only counts actual article content  
✅ **Fallback support** - Works on all pages, not just blog posts  

---

## Testing

### Test the Article Scroll Trigger

1. Clear localStorage:
   ```javascript
   localStorage.clear()
   ```

2. Open a blog post

3. Scroll slowly through the article

4. Modal should appear around the **middle of the article text**, not at the bottom of the page

### Expected Behavior

| Page Type | Trigger Area |
|-----------|--------------|
| Blog post | Article content only (between PostBody start and end marker) |
| Home page | Main content area |
| About page | Main content area |

---

## Customization

### Change Trigger Percentage

Currently set to 50%. To change:

**File:** `src/layouts/Layout.astro` (line 623 and 640)

```javascript
if (articleScrollPercent > 50) {  // Change to 30, 40, 60, 75, etc.
```

### Earlier Trigger Example (30%)
```javascript
if (articleScrollPercent > 30) {
  // Triggers after reading 30% of article
}
```

### Later Trigger Example (75%)
```javascript
if (articleScrollPercent > 75) {
  // Triggers near end of article
}
```

---

## Technical Details

### Calculation Method

```javascript
articleStart = parent container top position
articleEnd = marker element top position
articleHeight = articleEnd - articleStart
scrollPosition = current scroll + viewport height
scrolledInArticle = scrollPosition - articleStart
articleScrollPercent = (scrolledInArticle / articleHeight) * 100
```

### Visual Representation

```
┌──────────────────┐
│                  │ ← Article Start (offsetTop of parent)
│   Paragraph 1    │
│   Paragraph 2    │   User scrolls...
│   Paragraph 3    │   scrollPosition moves down
│   ─────50%───    │ ← TRIGGER POINT
│   Paragraph 4    │
│   Paragraph 5    │
│                  │
│ article-content- │ ← Article End (marker offsetTop)
│      -end        │
└──────────────────┘
```

---

## Files Modified

1. ✅ `src/pages/posts/[slug].astro` - Added `article-content-end` marker
2. ✅ `src/layouts/Layout.astro` - Updated scroll detection logic

---

## Status

✅ **FIXED** - Modal now triggers while reading article content, not at page footer

**Created:** December 24, 2025  
**Issue:** Scroll trigger fired too late (at footer/related articles)  
**Solution:** Calculate scroll based on article content boundaries only


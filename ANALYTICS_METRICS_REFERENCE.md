# 📊 Ligadu Analytics - Metrics Reference & Interpretation Guide

**Purpose:** Your go-to reference for understanding what metrics are tracked and how to interpret them to detect trends and make decisions.

**Last Updated:** December 2025  
**Website:** Ligadu (https://ligadu.com)  
**Analytics Platform:** Umami (https://stats.ligadu.com)

---

## 📋 Quick Reference: All Tracked Events

| Event Name | What It Tracks | Why It Matters |
|------------|----------------|----------------|
| `article_viewed` | Someone opens an article | Measures reach & traffic |
| `article_scroll_depth` | How far down they scroll | Measures engagement quality |
| `article_completed` | Reading to 90%+ | Identifies truly engaging content |
| `reading_time` | Active time spent reading | Shows content value |
| `newsletter_modal_opened` | Newsletter popup displays | Tracks modal exposure |
| `newsletter_modal_dismissed` | User closes without subscribing | Measures rejection rate |
| `newsletter_subscribed` | Successful subscription | Your primary conversion |
| `inline_banner_viewed` | Bottom banner becomes visible | Tracks secondary CTA exposure |
| `inline_banner_clicked` | User submits banner form | Measures banner effectiveness |
| `menu_opened` | Mobile menu accessed | Mobile UX indicator |
| `external_link_clicked` | User leaves to external site | Interest in references |
| `related_article_clicked` | Navigation between articles | Content discovery pattern |

---

## 🎯 Part 1: Content Performance Metrics

### Event: `article_viewed`

**What it means:** Someone landed on and loaded an article page.

**Properties tracked:**
- `article` - Title of the article

**How to interpret:**

#### Weekly Check:
```
Go to: Umami → Events → article_viewed → Group by "article"

Look for:
✅ Top 5 most viewed articles
✅ Consistent traffic patterns
❌ Zero views = content not discoverable
```

**Trends to detect:**

| Pattern | What It Means | Action |
|---------|---------------|---------|
| Same article dominates week-over-week | You have a "hero" piece | Promote it more; create series |
| Views declining over time | Content aging | Refresh or create new content |
| Sudden spike in specific article | External traffic/viral | Investigate source; replicate success |
| Flat views across all articles | Poor traffic generation | Improve SEO, social promotion |

**Decision Framework:**
- **If article has >100 views/week:** Consider it high-performing → Create similar content
- **If article has 50-100 views/week:** Decent performer → Optimize further
- **If article has <20 views/week:** Low performer → Improve or archive

---

### Event: `article_scroll_depth`

**What it means:** User scrolled to a specific percentage of the article (25%, 50%, 75%, 90%, 100%).

**Properties tracked:**
- `depth` - Percentage reached (e.g., "50%", "90%")
- `article` - Article title

**How to interpret:**

#### Weekly Check:
```
Go to: Umami → Events → article_scroll_depth → Filter by depth

Compare:
- How many reach 25% vs 50% vs 90%
- Which articles have highest 90% rate
```

**The Scroll Depth Funnel:**
```
100 people view article
 ↓
85 scroll to 25%    (15% bounce immediately)
 ↓
65 scroll to 50%    (20 lose interest)
 ↓
45 scroll to 75%    (20 more drop off)
 ↓
30 scroll to 90%    (15 almost finish)
 ↓
25 scroll to 100%   (5 don't quite finish)

Completion Rate = 30% (30/100 readers)
```

**Trends to detect:**

| Pattern | What It Means | Action |
|---------|---------------|---------|
| Drop-off at 25% | Bad intro/hook | Rewrite opening paragraph |
| Drop-off at 50% | Content loses steam | Add subheadings, images, break up text |
| High 90%+ rate (>40%) | Excellent engagement | Replicate this content style |
| Low 90%+ rate (<15%) | Content quality issue | Revise, shorten, or improve |

**Benchmarks:**
- **Excellent:** >40% reach 90%
- **Good:** 25-40% reach 90%
- **Average:** 15-25% reach 90%
- **Poor:** <15% reach 90%

**Decision Framework:**
```
For each article, calculate:
Engagement Score = (90% completions / Total views) × 100

Example:
- Article A: 30/100 = 30% (Good)
- Article B: 10/100 = 10% (Poor - needs revision)
- Article C: 50/100 = 50% (Excellent - create more like this)
```

---

### Event: `article_completed`

**What it means:** User scrolled to 90%+ of the article (considered a "completed" read).

**Properties tracked:**
- `article` - Article title
- `time_spent` - Seconds from page load to completion

**How to interpret:**

#### Weekly Check:
```
Go to: Umami → Events → article_completed → Group by "article"

Calculate:
Completion Rate = (article_completed / article_viewed) × 100
```

**Example Analysis:**
```
Article: "AI in Healthcare"
- Views: 150
- Completions: 60
- Completion Rate: 40%
- Average time_spent: 180 seconds (3 minutes)

✅ This is EXCELLENT content (40% completion)
✅ Readers are engaged (3 min reading time)
→ Action: Create more healthcare + AI content
```

**Trends to detect:**

| Metric | Benchmark | What To Do |
|--------|-----------|------------|
| Completion Rate >30% | Excellent | Double down on this topic |
| Completion Rate 15-30% | Good | Optimize further |
| Completion Rate <15% | Poor | Revise or archive |
| Time_spent >3 min | Deep engagement | Premium content quality |
| Time_spent <1 min | Skim reading | Content too shallow or poorly structured |

**Monthly Trend Analysis:**
```
Track month-over-month:
- January: 22% avg completion rate
- February: 28% avg completion rate ↑ 
- March: 25% avg completion rate ↓

February spike? Check what you published.
Replicate those topics/formats.
```

---

### Event: `reading_time`

**What it means:** Total active time user spent on the page (excludes idle time).

**Properties tracked:**
- `article` - Article title
- `seconds` - Total active reading time
- `scroll_depth` - Maximum scroll depth reached
- `completed` - Boolean (true if reached 90%+)

**How to interpret:**

#### Weekly Check:
```
Go to: Umami → Events → reading_time

Look at:
- Average seconds across all articles
- Articles with longest reading time
- Correlation: reading_time vs completed
```

**The Reading Time Matrix:**

| Reading Time | Scroll Depth | Interpretation | Action |
|--------------|--------------|----------------|--------|
| >180s | 90%+ | 🟢 Perfect engagement | This is your best content |
| >180s | <50% | 🟡 Confused or searching | Improve structure/clarity |
| 60-180s | 90%+ | 🟢 Good quick read | Effective concise content |
| 60-180s | <50% | 🟡 Moderate interest | Add hooks to keep reading |
| <60s | 90%+ | 🟡 Very short article | Consider expanding |
| <60s | <50% | 🔴 Not engaging | Major revision needed |

**Benchmarks by Content Type:**
```
Short-form (500-1000 words):
- Target: 60-120 seconds
- Excellent: >90 seconds

Medium-form (1000-2000 words):
- Target: 120-240 seconds
- Excellent: >180 seconds

Long-form (2000+ words):
- Target: 240-480 seconds
- Excellent: >300 seconds
```

**Trend Detection - Month Over Month:**
```
Calculate Average Reading Time per Article Category:

Health Articles:
- Month 1: 145 seconds
- Month 2: 168 seconds ↑ +16%
- Month 3: 172 seconds ↑ +2%
→ Trend: Health content is gaining engagement
→ Action: Increase health content production
```

---

## 💌 Part 2: Newsletter Performance Metrics

### Event: `newsletter_modal_opened`

**What it means:** The newsletter signup popup was displayed to a user.

**Properties tracked:**
- `trigger` - How it opened: "scroll", "time_delay", "exit_intent", "cta_click"
- `seconds_on_page` - How long user was on page before modal opened
- `article` - Article they were reading (or "homepage")

**How to interpret:**

#### Weekly Check:
```
Go to: Umami → Events → newsletter_modal_opened

Check:
1. Total opens
2. Opens by trigger type
3. Average seconds_on_page
```

**Trigger Performance Comparison:**
```
Example Week Data:

Trigger          | Opens | Later Subscribed | Conversion Rate
-----------------|-------|------------------|----------------
scroll           | 120   | 18              | 15.0%  ✅ Best
cta_click        | 45    | 8               | 17.8%  ✅ Even better
time_delay       | 89    | 7               | 7.9%   ⚠️ Poor
exit_intent      | 34    | 2               | 5.9%   ⚠️ Poor

Total            | 288   | 35              | 12.2%  Overall
```

**What to do with this data:**

| Finding | Action |
|---------|--------|
| Scroll trigger converts best | Keep it, optimize timing (40% vs 50%) |
| CTA click very high | Promote CTA buttons more visibly |
| Time_delay underperforms | Reduce frequency or disable |
| Exit_intent low volume | Maybe users aren't leaving early (good!) |

**Timing Analysis:**
```
Check average "seconds_on_page" for successful conversions:

Subscribed users opened modal at: 45-90 seconds
Non-subscribed users: 15-30 seconds

Insight: Users need 45+ seconds to decide
Action: Delay triggers to 60 seconds minimum
```

**Trends to detect:**

| Pattern | Meaning | Action |
|---------|---------|--------|
| Opens declining week-over-week | More repeat visitors (already saw it) | Good sign! |
| Opens high but conversions low | Modal timing or copy issue | A/B test different copy |
| Certain articles trigger more opens | Those articles have engaged readers | Place CTAs earlier in those articles |

---

### Event: `newsletter_modal_dismissed`

**What it means:** User closed the modal without subscribing.

**Properties tracked:**
- `seconds_open` - How long modal was open before closing
- `had_interaction` - Boolean: true if they typed in email field
- `article` - What they were reading

**How to interpret:**

#### Weekly Check:
```
Go to: Umami → Events → newsletter_modal_dismissed

Calculate:
Abandonment Rate = (dismissals / opens) × 100

Interaction Rate = (had_interaction: true / total dismissals) × 100
```

**The Dismissal Analysis Matrix:**

| Seconds Open | Had Interaction | What It Means | Action |
|--------------|-----------------|---------------|--------|
| <3s | No | Instant rejection | They've seen it before OR bad timing |
| 3-10s | No | Read and rejected | Copy isn't compelling |
| 3-10s | Yes | Started but hesitated | Trust/privacy concern? |
| >10s | Yes | Almost converted | Add urgency or incentive |

**Example Analysis:**
```
Week Data:
- Total dismissals: 200
- Instant (<3s): 120 (60%) → Too many repeat visitors seeing it
- Read but rejected (3-10s, no interaction): 50 (25%) → Copy issue
- Almost converted (>10s with interaction): 30 (15%) → Close to converting!

Actions:
1. Reduce modal frequency (already subscribed are seeing it)
2. Test new modal copy (current isn't compelling)
3. Add trust signals for the "almost" group (privacy badge, unsubscribe info)
```

**Trends to detect:**

| Trend | What It Means | Action |
|-------|---------------|--------|
| High instant dismissals (>60%) | Users are annoyed or already subscribed | Check localStorage, reduce frequency |
| High "had_interaction" but still dismissed | Form friction or trust issue | Simplify form, add trust badges |
| Dismissals decrease over time | Better targeting or less repeat exposure | Keep current strategy |
| Certain articles have lower dismissal rate | Those readers are more interested | Optimize modal copy for those topics |

---

### Event: `newsletter_subscribed`

**What it means:** 🎉 Someone successfully subscribed to your newsletter!

**Properties tracked:**
- `source` - Where they subscribed: "modal" or "inline_banner"
- `article` - What content led to subscription
- `seconds_to_convert` - Time from page load to subscription
- `already_subscribed` - Boolean: if they were already in your list

**How to interpret:**

#### Weekly Check:
```
Go to: Umami → Events → newsletter_subscribed

Key metrics:
1. Total new subscribers
2. Subscribers by source (modal vs banner)
3. Top converting articles
4. Average seconds_to_convert
```

**The Conversion Funnel:**
```
100 Visitors
 ↓
30 see modal (30% exposure rate)
 ↓
3 subscribe (10% conversion rate, 3% overall)

Optimization opportunities:
- Increase exposure: 30% → 40% (show modal to more people)
- Increase conversion: 10% → 15% (better copy/design)
- Result: 100 × 0.40 × 0.15 = 6 subscribers (double!)
```

**Source Performance Analysis:**
```
Example Week:

Source         | Subscriptions | % of Total
---------------|---------------|------------
modal          | 28            | 70%
inline_banner  | 12            | 30%

Insight: Modal is your primary converter
Action: Optimize modal copy/design first
```

**Article Attribution (Most Important!):**
```
Top Converting Articles:

Article                          | Subs | Views | Conversion Rate
---------------------------------|------|-------|----------------
"AI in Healthcare Diagnosis"     | 12   | 200   | 6.0%  🏆
"Future of Medical Technology"   | 8    | 180   | 4.4%  ⭐
"Understanding DNA Sequencing"   | 6    | 250   | 2.4%  ✓
"History of Medicine"            | 2    | 180   | 1.1%  ⚠️

INSIGHT:
- Healthcare + Technology content converts 3-6x better
- Historical content doesn't drive subscriptions
- "AI in Healthcare" is your star performer

ACTION:
- Write 3 more AI + healthcare articles next month
- Reduce historical/general content
- Promote "AI in Healthcare" on social media
```

**Time-to-Convert Analysis:**
```
Average seconds_to_convert: 180 seconds (3 minutes)

Distribution:
- <60s: 15% (impulse subscribers)
- 60-180s: 45% (engaged readers)
- 180-300s: 30% (careful readers)
- >300s: 10% (very engaged)

Insight: Most people subscribe 1-3 minutes after arriving
Action: Ensure modal triggers between 60-180 seconds
```

**Monthly Trend Analysis:**
```
Month        | Subscribers | Growth Rate | Top Source  | Top Article
-------------|-------------|-------------|-------------|------------------
January      | 45          | -           | modal (75%) | AI in Healthcare
February     | 62          | +38% ↑      | modal (70%) | Future of Tech
March        | 71          | +15% ↑      | banner (45%)| DNA Sequencing

Observations:
1. Consistent growth ✅
2. Banner is catching up (30% → 45%) - good!
3. Technology content dominates conversions
4. Growth rate slowing (38% → 15%) - need new strategies
```

---

### Event: `inline_banner_viewed`

**What it means:** User scrolled to the bottom of article and the inline subscription banner became visible.

**Properties tracked:**
- `article` - Which article they were reading

**How to interpret:**

#### Weekly Check:
```
Go to: Umami → Events → inline_banner_viewed

Calculate:
Banner View Rate = (banner_viewed / article_viewed) × 100

Tells you: What % of readers reach the end of articles
```

**Example Analysis:**
```
Article: "AI in Healthcare"
- Total views: 200
- Banner viewed: 85
- View Rate: 42.5%

Interpretation:
✅ 42.5% of readers reach the end (excellent engagement!)
✅ These readers are highly engaged
→ Banner has good exposure to qualified audience
```

**Benchmarks:**
```
Banner View Rate:
- >40% = Excellent (readers love your content)
- 30-40% = Good (solid engagement)
- 20-30% = Average (typical blog performance)
- <20% = Poor (readers not finishing articles)
```

**Comparison by Article:**
```
Article                    | Views | Banner Viewed | View Rate
---------------------------|-------|---------------|----------
"AI in Healthcare"         | 200   | 85            | 42.5% ✅
"Future of Tech"           | 180   | 70            | 38.9% ✅
"History of Medicine"      | 180   | 30            | 16.7% ⚠️

Insight: 
- Healthcare/tech articles have 2.5x better view rates
- History article isn't holding attention
```

**Decision Framework:**
```
IF banner_view_rate < 25% THEN
  → Article has engagement problem
  → Check scroll_depth data
  → Revise content or consider archiving
  
IF banner_view_rate > 35% THEN
  → Excellent content
  → Promote more
  → Create similar content
```

---

### Event: `inline_banner_clicked`

**What it means:** User submitted the inline banner form (may or may not successfully subscribe).

**Properties tracked:**
- `article` - Which article

**How to interpret:**

#### Weekly Check:
```
Go to: Umami → Events → inline_banner_clicked

Calculate:
Banner Conversion Rate = (banner_clicked / banner_viewed) × 100

Tells you: How effective the banner design/copy is
```

**The Banner Funnel:**
```
200 article views
 ↓
85 banner viewed (42.5% reached bottom)
 ↓
12 banner clicked (14.1% of viewers, 6% of total visitors)
 ↓
10 successfully subscribed (83% success rate, 5% total conversion)

Optimization points:
1. Get more to bottom (42.5% → 50%)
2. Improve banner CTA (14.1% → 20%)
3. Reduce form errors (83% → 95%)
```

**Banner vs Modal Performance:**
```
Source         | Exposure | Clicks/Opens | Conversions | Conv Rate
---------------|----------|--------------|-------------|----------
Modal          | 288      | 288          | 28          | 9.7%
Inline Banner  | 180      | 25           | 12          | 48.0% 🏆

INSIGHT: 
- Modal has more exposure (more people see it)
- Banner has better conversion (people who see it are more likely to convert)
- Banner viewers are highly engaged (finished article)

STRATEGY:
- Keep both (they serve different user stages)
- Modal catches early/medium readers
- Banner catches engaged finishers
```

---

## 👤 Part 3: User Behavior Metrics

### Event: `menu_opened`

**What it means:** User opened the mobile navigation menu.

**Properties tracked:**
- `device` - Always "mobile"

**How to interpret:**

#### Weekly Check:
```
Go to: Umami → Events → menu_opened

Calculate:
Mobile Menu Usage Rate = (menu_opened / mobile_visitors) × 100
```

**What this tells you:**

| Usage Rate | Meaning | Action |
|------------|---------|--------|
| <5% | Users aren't exploring | Menu not visible or site nav is confusing |
| 5-15% | Normal usage | Mobile UX is OK |
| >15% | High exploration | Users are engaged OR navigation is confusing |

**Trend Analysis:**
```
Week 1: 50 menu opens
Week 2: 75 menu opens
Week 3: 90 menu opens

Growing usage = More mobile traffic OR users are exploring more
Check: Has mobile traffic increased? (Umami → Devices)

If mobile traffic flat but menu opens up → Good sign (more engagement)
If mobile traffic up proportionally → Normal growth
```

**Decision Framework:**
```
Low menu usage (<5%) + Low page/session:
→ Problem: Users can't find what they want
→ Action: Improve mobile navigation visibility

High menu usage (>20%) + Low page/session:
→ Problem: Users searching but not finding
→ Action: Simplify menu, add search prominence

High menu usage (>15%) + High page/session:
→ Success: Users engaged and exploring
→ Action: Keep current UX
```

---

### Event: `external_link_clicked`

**What it means:** User clicked a link that takes them away from your site.

**Properties tracked:**
- `url` - Where they went
- `article` - What they were reading

**How to interpret:**

#### Weekly Check:
```
Go to: Umami → Events → external_link_clicked

Look for:
1. Most clicked external domains
2. Which articles generate most external clicks
```

**What this reveals:**
```
Top External Links:

URL                                      | Clicks | Article
-----------------------------------------|--------|---------------------------
https://pubmed.ncbi.nlm.nih.gov/...      | 45     | "AI in Healthcare"
https://nature.com/articles/...          | 32     | "DNA Sequencing"
https://twitter.com/share?...            | 28     | Various (social shares)

INSIGHTS:
1. Readers are clicking research sources (45 clicks)
   → They want deeper information
   → They trust your content cites quality sources
   → Action: Add more primary sources

2. Social shares happening (28 clicks)
   → Content is share-worthy
   → Action: Make share buttons more prominent

3. "AI in Healthcare" drives most external engagement
   → This topic resonates deeply
   → Action: Create follow-up pieces
```

**Red Flags to Watch:**
```
IF many external clicks early in article THEN
  → Users are fact-checking you (trust issue?)
  → OR you're sending them away before they engage
  → Action: Move external links to end of article

IF external clicks to competitors THEN
  → Your content missing something
  → Action: Expand your coverage

IF very few external clicks THEN
  → Add credible sources to build trust
  → OR your links aren't visible
```

---

### Event: `related_article_clicked`

**What it means:** User clicked on a "related articles" link to read another piece.

**Properties tracked:**
- `from` - Article they were on
- `to` - Article they clicked to

**How to interpret:**

#### Weekly Check:
```
Go to: Umami → Events → related_article_clicked

Map out:
1. Most common article paths (from → to)
2. Which articles serve as "gateways"
3. Dead-end articles (no one clicks away)
```

**Content Journey Mapping:**
```
Popular Paths:

From Article                  → To Article                    | Count
------------------------------|--------------------------------|------
"AI in Healthcare"            → "Future of Medical Tech"      | 25
"DNA Sequencing"              → "CRISPR Gene Editing"         | 18
"History of Medicine"         → "AI in Healthcare"            | 12

INSIGHTS:
1. "AI in Healthcare" is a hub (25 outgoing + 12 incoming)
   → This is your "gateway" content
   → Action: Feature it prominently, always keep updated

2. Natural progression: History → AI → Future
   → Users want forward-looking content
   → Action: Structure content calendar chronologically

3. Related topics cluster: DNA → CRISPR → Gene Editing
   → Create a "series" around genetics
   → Action: Add "Part 1 of X" labels
```

**Gateway vs Dead-End Articles:**
```
Gateway Articles (many clicks away):
- "AI in Healthcare" → 35 clicks to related content
→ These keep users on your site
→ Optimize these for SEO, promote heavily

Dead-End Articles (few clicks away):
- "History of Medicine" → 3 clicks to related
→ Users leave after reading
→ Add better internal links OR accept as acquisition content
```

**Session Depth Analysis:**
```
Compare:
- Users who click related articles: 3.2 pages/session
- Users who don't: 1.1 pages/session

Impact: Related clicks increase engagement by 3x!
Action: Make related articles more prominent
```

---

## 📈 Part 4: Trend Detection Framework

### Weekly Review (15 minutes every Monday)

#### 1. **Traffic Trends**
```
Umami Dashboard → Last 7 Days

Questions to ask:
□ Total visitors vs last week? (Up/down/flat?)
□ Which article(s) had spike? (Check article_viewed)
□ Any unusual traffic source? (Check Referrers)

Red flags:
⚠️ Traffic down >20% week-over-week (investigate why)
⚠️ Single article dominating >50% of traffic (diversification needed)
⚠️ High bounce rate (>70%) (content quality issue)
```

#### 2. **Engagement Trends**
```
Check scroll depth and reading time:

□ Average scroll_depth (90%+ rate)
□ Average reading_time
□ Completion rates by article

Benchmarks:
✅ 30%+ reach 90% scroll = excellent
✅ 180+ seconds avg reading time = engaged
❌ <15% reach 90% = content issues
```

#### 3. **Conversion Trends**
```
Newsletter performance:

□ Total subscriptions this week
□ Conversion rate (subs / visitors × 100)
□ Best trigger (scroll/cta/time/exit)
□ Top converting article

Growth indicators:
✅ Conversion rate improving week-over-week
✅ Same articles consistently converting
✅ Multiple successful triggers
```

---

### Monthly Deep Dive (1 hour, first Monday of month)

#### 1. **Content Performance Matrix**

Create this table from your Umami data:

| Article | Views | 90% Scroll | Completion % | Avg Time | Subs | Conv % | Score |
|---------|-------|------------|--------------|----------|------|--------|-------|
| Article A | 500 | 200 | 40% | 220s | 25 | 5% | 🟢 85 |
| Article B | 300 | 120 | 40% | 180s | 15 | 5% | 🟢 82 |
| Article C | 400 | 80 | 20% | 90s | 3 | 0.75% | 🟡 45 |
| Article D | 200 | 25 | 12% | 60s | 0 | 0% | 🔴 20 |

**Scoring formula:**
```
Score = (Completion % × 30) + (Avg Time / 5) + (Conv % × 200)

Where:
- Completion % (0-100) weighted 30%
- Avg Time in seconds / 5 (normalized)
- Conv % (0-100) weighted heavily

Interpretation:
🟢 Score >70: Star content - do more of this
🟡 Score 40-70: Good content - optimize further
🔴 Score <40: Poor content - revise or archive
```

**Actions based on scores:**
```
For 🟢 articles (Star performers):
✅ Promote on social media
✅ Feature in newsletter
✅ Create 2-3 similar articles
✅ Update and refresh quarterly

For 🟡 articles (Solid performers):
✅ Optimize title and meta description
✅ Add internal links to star content
✅ Improve formatting (images, subheadings)

For 🔴 articles (Underperformers):
❌ Major revision required
❌ Consider archiving if >6 months old
❌ Analyze why it failed (topic, quality, timing?)
```

---

#### 2. **Newsletter Funnel Analysis**

Track these numbers monthly:

```
Month: February 2025

Total Visitors: 5,200

↓ 30% see modal
1,560 modal opened

↓ 10% convert
156 subscribed from modal

↓ Plus banner
+45 subscribed from banner

= 201 total subscriptions
= 3.87% overall conversion rate

Compare to last month:
January: 3.2% conversion → February: 3.87% (+20% improvement! 🎉)
```

**What to track monthly:**
```
Newsletter Metrics Spreadsheet:

Month | Visitors | Modal Opens | Modal Subs | Banner Subs | Total Subs | Conv %
------|----------|-------------|------------|-------------|------------|-------
Jan   | 4,800    | 1,350       | 120        | 35          | 155        | 3.23%
Feb   | 5,200    | 1,560       | 156        | 45          | 201        | 3.87%
Mar   | (TBD)    | (TBD)       | (TBD)      | (TBD)       | (TBD)      | (TBD)

Growth: +400 visitors, +46 subs, +0.64% conversion rate ✅
```

**Trigger performance over time:**
```
Trigger     | Jan Conv | Feb Conv | Trend  | Action
------------|----------|----------|--------|------------------
scroll      | 12%      | 15%      | ↑ +3%  | Keep, it's working
cta_click   | 18%      | 20%      | ↑ +2%  | Promote CTAs more
time_delay  | 8%       | 7%       | ↓ -1%  | Consider disabling
exit_intent | 6%       | 5%       | ↓ -1%  | Low volume, OK
```

---

#### 3. **Content Category Performance**

Group articles by category and compare:

```
Category: Healthcare + Technology
Articles: 8
Total views: 2,400
Avg completion rate: 38%
Total subscriptions: 95
Conversion rate: 3.96%
Score: 🟢 High Performer

Category: History & Culture  
Articles: 6
Total views: 1,200
Avg completion rate: 18%
Total subscriptions: 12
Conversion rate: 1.0%
Score: 🔴 Underperformer

DECISION:
- Increase Healthcare + Tech content by 50%
- Reduce History & Culture to 1 article/month
- Reallocate resources to winning category
```

---

### Quarterly Strategy Review (2 hours, every 3 months)

#### 1. **Growth Trajectory**
```
Q1 2025 Summary:

Metric              | Jan    | Feb    | Mar    | Q1 Total | Growth
--------------------|--------|--------|--------|----------|--------
Visitors            | 4,800  | 5,200  | 5,800  | 15,800   | +21%
Subscribers         | 155    | 201    | 234    | 590      | +51%
Avg Conversion      | 3.23%  | 3.87%  | 4.03%  | 3.73%    | +25%
Articles Published  | 8      | 9      | 10     | 27       | -
Avg Reading Time    | 165s   | 180s   | 195s   | 180s     | +18%

Overall Assessment: ✅ GROWTH QUARTER
- Visitor growth steady (+21%)
- Conversion improving (+25%)
- Engagement increasing (+18% reading time)

Action: Continue current strategy, scale up content production
```

#### 2. **Content Audit**
```
Review ALL content from last quarter:

Total articles: 27
Performance distribution:
- 🟢 Stars (score >70): 8 articles (30%)
- 🟡 Good (score 40-70): 13 articles (48%)
- 🔴 Poor (score <40): 6 articles (22%)

Actions:
✅ Identify themes in Star content (what makes them work?)
✅ Upgrade Good content (quick wins available)
❌ Archive or majorly revise Poor content

Theme Analysis of Stars:
- 6/8 are Healthcare + Technology topics
- 5/8 published on Monday/Tuesday
- 7/8 are 1,500-2,500 words (medium-form)
- All include original images/graphics

→ Replicate these success factors in future content
```

#### 3. **User Behavior Patterns**
```
Identify patterns over 3 months:

Peak traffic days: Tuesday, Wednesday
Peak traffic times: 9-11 AM, 2-4 PM (likely timezone)
Average session length: 4:30 minutes
Pages per session: 1.8 articles

User types:
- One-time readers: 65% (need better retention strategy)
- Returning readers: 35% (good, but can improve)

Reading patterns:
- Mobile: 68% of traffic, lower engagement (2:45 min avg)
- Desktop: 32% of traffic, higher engagement (7:15 min avg)

INSIGHTS:
1. Publish important content Mon-Wed morning
2. Mobile experience needs improvement (engagement gap)
3. Focus on building returning reader base (currently 35%)

ACTIONS:
- Start email newsletter to increase return visits
- Optimize mobile reading experience
- Add "bookmark" feature for mobile users
- Test push notifications
```

---

## 🎯 Part 5: Decision-Making Framework

### When You Check Analytics, Ask These Questions:

#### About Content:
```
1. What are my top 3 articles this month?
   → Create more content in those topics

2. Which articles have >30% completion rate?
   → These are your quality benchmark

3. Which articles drive most subscriptions?
   → Your "conversion champions" - promote heavily

4. What's my average reading time?
   → Increasing = good, decreasing = investigate

5. Do readers click through to related articles?
   → High click-through = good internal linking
```

#### About Newsletter:
```
1. Is my conversion rate improving month-over-month?
   → Yes = strategy working, No = need changes

2. Which trigger converts best?
   → Double down on winner, reduce losers

3. Which articles convert best?
   → Write more similar content

4. What's my modal abandonment rate?
   → >80% = major problem with timing/copy
   → <50% = good performance

5. How long before people subscribe?
   → Optimize trigger timing based on this
```

#### About Users:
```
1. Is traffic growing?
   → Yes = good, No = need marketing push

2. Are users reading longer over time?
   → Yes = content quality improving
   → No = content quality declining

3. Are users exploring multiple articles?
   → Yes = good content discovery
   → No = improve internal linking

4. What's mobile vs desktop engagement?
   → Mobile lower = mobile UX needs work

5. Are external links being clicked?
   → Yes = readers want more depth
   → No = add more credible sources
```

---

## 🚨 Red Flags - When to Act Immediately

### Critical Issues (Act within 24 hours):

| Red Flag | Threshold | What It Means | Immediate Action |
|----------|-----------|---------------|------------------|
| Traffic drops | >30% week-over-week | Site issue or SEO penalty | Check site, search console |
| Conversion drops | >50% suddenly | Technical issue with forms | Test signup flow |
| Reading time plummets | <60s average | Content quality crashed | Review recent posts |
| All scroll depths low | <10% reach 90% | Major content issue | Emergency content audit |
| No subscriptions | 0 for 3+ days | Form broken | Test forms immediately |

### Warning Signs (Act within 1 week):

| Warning | Threshold | What It Means | Action |
|---------|-----------|---------------|--------|
| Declining engagement | 2+ weeks of lower scroll depth | Content getting stale | Refresh content strategy |
| Flat growth | No visitor increase for month | Need marketing push | Launch promotion campaign |
| High abandonment | >85% modal dismissals | Modal too aggressive | Reduce frequency |
| Low completion | <15% articles at 90%+ | Content quality issue | Content audit & improvement |
| No returning visitors | <20% return rate | Not memorable | Improve unique value prop |

---

## 📊 Your Analytics Checklist

### Daily (Optional - 2 minutes):
- [ ] Check Umami real-time view (are people on site?)
- [ ] Spot-check any anomalies (traffic spike/drop)

### Weekly (Required - 15 minutes):
- [ ] Review total visitors vs last week
- [ ] Check top 3 performing articles
- [ ] Review newsletter subscriptions count
- [ ] Identify any trends or patterns
- [ ] Log numbers in tracking spreadsheet

### Monthly (Required - 1 hour):
- [ ] Full content performance analysis
- [ ] Newsletter funnel review
- [ ] Calculate scores for all articles
- [ ] Identify top and bottom performers
- [ ] Make content calendar decisions based on data
- [ ] Update team on insights

### Quarterly (Required - 2 hours):
- [ ] 3-month growth analysis
- [ ] Complete content audit
- [ ] User behavior pattern review
- [ ] Strategic planning for next quarter
- [ ] Set goals based on trends
- [ ] Present to stakeholders

---

## 🎓 Learning to Read Your Data

### Week 1: Familiarization
- [ ] Log in to Umami daily
- [ ] Click through all tabs (Pages, Events, Referrers, etc.)
- [ ] Get comfortable with the interface
- [ ] Just observe, don't analyze yet

### Week 2: Pattern Recognition
- [ ] Start noting which articles get most views
- [ ] Watch scroll depth patterns
- [ ] See when newsletters convert
- [ ] Identify your first patterns

### Week 3: Initial Insights
- [ ] Make your first decision based on data
- [ ] Example: "I'll write more about X because it performs well"
- [ ] Test one hypothesis
- [ ] Track results

### Week 4+: Data-Driven Strategy
- [ ] Use data to plan all content
- [ ] Continuously optimize based on metrics
- [ ] A/B test different approaches
- [ ] Measure impact of changes

---

## 💡 Pro Tips for Data Interpretation

### 1. Context Matters
```
❌ "Traffic is down 20%, panic!"
✅ "Traffic is down 20%, but it's holiday week - this is normal seasonal pattern"

Always compare to:
- Same day last week
- Same week last year  
- Expected seasonality
```

### 2. Look for Patterns, Not Single Data Points
```
❌ "One article performed poorly, our strategy is wrong"
✅ "5 of last 6 articles in this category underperformed, we should pivot"

Need: 3-5 data points minimum for any conclusion
```

### 3. Correlation ≠ Causation
```
❌ "We published on Tuesday and got high traffic, Tuesday is best day"
✅ "We consistently publish on Tuesday and see 20% higher traffic vs other days"

Need: Multiple instances to prove causation
```

### 4. Track Changes Over Time
```
Your baseline will improve over time:
- Month 1: 2% conversion rate
- Month 3: 3% conversion rate
- Month 6: 4% conversion rate

This is success! Don't compare Month 6 to "industry standard" 
Compare to YOUR Month 1
```

### 5. Focus on What You Can Control
```
CAN control:
✅ Content quality
✅ Newsletter timing
✅ Modal copy
✅ Publishing schedule

CAN'T control:
❌ Seasonality  
❌ Competitor actions
❌ Algorithm changes

Focus your energy on what you can improve
```

---

## 📞 Quick Reference Card

**Print this out and keep by your desk:**

```
┌─────────────────────────────────────────────────────────┐
│         LIGADU ANALYTICS QUICK REFERENCE                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📊 METRICS TO CHECK WEEKLY:                           │
│  1. Total visitors (vs last week)                       │
│  2. Top 3 articles (by views)                          │
│  3. Newsletter conversions (total count)                │
│  4. Average scroll depth (% to 90%+)                   │
│  5. Reading time (average seconds)                      │
│                                                         │
│  🎯 BENCHMARKS TO HIT:                                 │
│  • Scroll to 90%: >25% (excellent: >40%)               │
│  • Reading time: >180 seconds                           │
│  • Conversion rate: >2% (excellent: >4%)               │
│  • Modal conversion: >10%                               │
│  • Banner view rate: >30%                               │
│                                                         │
│  ⚠️  RED FLAGS TO WATCH:                               │
│  • Traffic drop >30%                                    │
│  • 0 conversions for 3+ days                           │
│  • Reading time <60s average                            │
│  • Scroll depth <10% to 90%                            │
│                                                         │
│  🚀 ACTIONS BASED ON DATA:                             │
│  • Top article? Create 2 more like it                  │
│  • Low scroll depth? Revise content                    │
│  • Best trigger? Optimize that one                     │
│  • High conversion article? Promote it                 │
│                                                         │
│  📍 WHERE TO LOOK:                                     │
│  Umami: https://stats.ligadu.com                       │
│  Events tab → Your custom events                       │
│  Pages tab → Article performance                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

**Remember:** Data is only valuable if you ACT on it. 

Every week, make ONE decision based on your analytics. That's 52 data-driven improvements per year! 🚀

---

*Last Updated: December 2025*  
*Next Review: March 2026*  
*Document Owner: Analytics/Marketing Team*


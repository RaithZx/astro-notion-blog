# Newsletter User-Facing Text for Translation

## All text visible to users (including screen reader users)

---

## Master Table - All User-Facing Strings

| # | Location | Text Type | Current Text | When/Where User Sees It |
|---|----------|-----------|--------------|-------------------------|
| 1 | Modal | Heading | Inskreve na Newsletter | Modal title at top |
| 2 | Modal | Button label (accessibility) | Fecha modal di newsletter | Screen reader announces this when close button is focused |
| 3 | Modal | Close button | ✕ | Visual close button (X symbol) |
| 4 | Modal | Form label | Email | Above email input field |
| 5 | Modal | Input placeholder | bu@email.com | Inside empty email field |
| 6 | Modal | Form label | Nome (opcional) | Above name input field |
| 7 | Modal | Input placeholder | Seu nome | Inside empty name field |
| 8 | Modal | Checkbox label | Konkordo ku a régras di privasidadi i régras di uzu i lisénsa di uzu di site | Next to privacy checkbox (includes links) |
| 9 | Modal | Link text (in checkbox) | régras di privasidadi | Clickable link to privacy policy |
| 10 | Modal | Link text (in checkbox) | régras di uzu i lisénsa di uzu di site | Clickable link to terms of use |
| 11 | Modal | Submit button | ✉ Inskreve na Newsletter | Main action button |
| 12 | Modal | Button (loading state) | Enviadu... | Button text while form is submitting |
| 13 | Modal | Footer text | Pode kansa kada momentu. Nunka spam, só kontenidu di kalidade. | Small text at bottom of form |
| 14 | Banner | Badge | Di grasa | Small badge on banner (means "Free") |
| 15 | Banner | Heading | Fika ligadu | Main banner title |
| 16 | Banner | Description | Resebe kes ultimu artigu i stórias na bu email | Banner subtitle/description |
| 17 | Banner | Input placeholder | Bu email | Inside email field |
| 18 | Banner | Submit button | Inskreve | Action button text |
| 19 | Notification | Success (new subscriber) | Obrigadu! Subscription successful! Check your email to confirm. | Green notification popup after successful subscription |
| 20 | Notification | Success (already subscribed) | Bu email ja ta inskrí! Obrigadu pa kontinua ligadu. | Green notification when email already exists |
| 21 | Notification | Error (no consent) | Por favor, konkordo ku a régras di privasidadi i régras di uzu i lisénsa di uzu di site. | Red notification when checkbox not checked |
| 22 | Notification | Error (subscription failed) | Erru durante inskrisaun. Pur favor, tenta otu vez. | Red notification for general errors |
| 23 | Notification | Error (connection) | Erru di koneksaun. Tenta otu vez. | Red notification for network problems |

---

## Organized by User Interface Section

### 1. Newsletter Modal (Popup)

#### Header Section
| Text | Current Value | Usage |
|------|---------------|-------|
| Modal title | **Inskreve na Newsletter** | Main heading users see first |
| Close button (visual) | **✕** | X icon to close modal |
| Close button (screen reader) | **Fecha modal di newsletter** | Announced to blind users |

#### Form Section
| Field | Label | Placeholder | Notes |
|-------|-------|-------------|-------|
| Email | **Email** | **bu@email.com** | Required field |
| Name | **Nome (opcional)** | **Seu nome** | Optional field |
| Privacy consent | **Konkordo ku a régras di privasidadi i régras di uzu i lisénsa di uzu di site** | - | Checkbox with 2 clickable links |

**Privacy consent links:**
- Link 1: **régras di privasidadi** (goes to /privacidade)
- Link 2: **régras di uzu i lisénsa di uzu di site** (goes to /termus)

#### Action Section
| Element | Default State | Loading State |
|---------|---------------|---------------|
| Submit button | **✉ Inskreve na Newsletter** | **Enviadu...** |

#### Footer Section
| Text | Purpose |
|------|---------|
| **Pode kansa kada momentu. Nunka spam, só kontenidu di kalidade.** | Reassurance text (can cancel anytime, no spam, only quality content) |

---

### 2. Inline Banner (Embedded in page)

| Element | Current Text | Usage |
|---------|--------------|-------|
| Badge | **Di grasa** | Small label indicating it's free |
| Heading | **Fika ligadu** | Main banner title |
| Description | **Resebe kes ultimu artigu i stórias na bu email** | Explains value (receive latest articles and stories) |
| Email placeholder | **Bu email** | Inside input field |
| Submit button | **Inskreve** | Action button |

---

### 3. Notification Messages (Popup alerts)

#### Success Messages (Green notifications)
| Scenario | Message Shown | When It Appears |
|----------|---------------|-----------------|
| New subscription | **Obrigadu! Subscription successful! Check your email to confirm.** | After user successfully subscribes for first time |
| Already subscribed | **Bu email ja ta inskrí! Obrigadu pa kontinua ligadu.** | When user tries to subscribe with email already in system |

#### Error Messages (Red notifications)
| Error Type | Message Shown | When It Appears |
|------------|---------------|-----------------|
| Missing consent | **Por favor, konkordo ku a régras di privasidadi i régras di uzu i lisénsa di uzu di site.** | User clicked submit without checking privacy box |
| Subscription failed | **Erru durante inskrisaun. Pur favor, tenta otu vez.** | General error from server or API |
| Connection error | **Erru di koneksaun. Tenta otu vez.** | Network or internet problem |

---

## Translation Notes

### Current Language Mix
- **Primary:** Cape Verdean Creole (Kriolu)
- **Secondary:** Portuguese elements
- **Tertiary:** English phrases mixed in

### Key Terms to Standardize
| Kriolu | English | Usage Context |
|--------|---------|---------------|
| Inskreve | Subscribe | Action of signing up |
| Inskrí | Subscribed | Past state, already signed up |
| Obrigadu | Thank you | Gratitude |
| Erru | Error | Problem/mistake |
| Di grasa | Free | No cost |
| Fika ligadu | Stay connected | Maintain contact |

### Tone Guidelines
- **Friendly and welcoming** - Use "bu" (your) not formal language
- **Reassuring** - Emphasize no spam, can unsubscribe
- **Clear** - Short, simple sentences
- **Respectful** - Ask permission (privacy consent)

---

## Quick Reference - By Context

### What users TYPE
- Email address
- Name (optional)

### What users READ
- Modal title: Inskreve na Newsletter
- Banner title: Fika ligadu
- Description: Resebe kes ultimu artigu i stórias na bu email
- Privacy text: Konkordo ku a régras...
- Disclaimer: Pode kansa kada momentu...

### What users CLICK
- Submit button: Inskreve na Newsletter / Inskreve
- Close button: ✕
- Privacy links: régras di privasidadi, régras di uzu...

### What users SEE after submitting
- Success: Obrigadu! Subscription successful!
- Already subscribed: Bu email ja ta inskrí!
- Errors: Erru durante inskrisaun / Erru di koneksaun

### What screen reader users HEAR
- All of the above PLUS
- Close button label: Fecha modal di newsletter

---

## Files That Will Need Translation Updates

After translation is complete, these files need to be updated:

1. **src/layouts/Layout.astro** - Newsletter modal
2. **src/components/subscribeBanner.astro** - Inline banner
3. **tek-newsletter-api/server.js** - API response messages

---

**Total User-Facing Strings:** 23  
**Visible to sighted users:** 22  
**Visible to screen reader users only:** 1  
**Export Date:** December 2025

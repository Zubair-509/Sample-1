# Hisaab — Design Document Specification

**Product:** Hisaab (حساب)  
**Version:** 1.0 — MVP  
**Date:** June 7, 2026  
**Document Type:** Design System & UI Specification  
**Applies To:** Web Application (Mobile-first, Responsive)  

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Brand Identity](#2-brand-identity)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing & Grid System](#5-spacing--grid-system)
6. [Iconography](#6-iconography)
7. [Component Library](#7-component-library)
8. [Screen Layouts & Wireframes](#8-screen-layouts--wireframes)
9. [Motion & Micro-interactions](#9-motion--micro-interactions)
10. [Responsive Design](#10-responsive-design)
11. [Accessibility Standards](#11-accessibility-standards)
12. [Design Tokens (CSS Variables)](#12-design-tokens-css-variables)
13. [Asset Specifications](#13-asset-specifications)
14. [Builder Handoff Notes](#14-builder-handoff-notes)

---

## 1. Design Philosophy

### 1.1 Core Design Principle

Hisaab is used by a 45-year-old kiryana store owner in Karachi who runs his business on WhatsApp and a paper ledger. Every design decision must pass a single test:

> **"Can Rehman figure this out in 60 seconds without reading any instructions?"**

If the answer is no, simplify.

### 1.2 Design Pillars

**Trusted** — Financial tools must feel serious and dependable. Nothing playful or experimental in data-critical moments. Colors, weights, and layout signal reliability.

**Immediate** — The dashboard is the homepage. The user should understand their financial position within three seconds of opening the app. No onboarding flows, no empty states, no friction before value.

**Warm, not cold** — Accounting software has historically been intimidating. Hisaab is built for people who have never used accounting software. The experience should feel familiar — like a well-organized bahi khata, not a corporate ERP.

**Bilingual by design** — Urdu outputs from the AI must render beautifully alongside English UI. Both scripts must coexist without visual conflict. RTL Urdu text within an LTR layout must be handled explicitly.

### 1.3 Aesthetic Direction

**Refined Utilitarian with Pakistani Warmth.**

Not the cold blue-grey of enterprise software. Not the neon gamification of fintech apps. Hisaab's aesthetic draws from the visual language of a well-kept physical ledger — clean columns, clear hierarchy, authoritative typography — infused with the warmth of the Pakistani context: deep greens, warm cream backgrounds, and subtle geometric motifs inspired by traditional Pakistani tile work.

The result should feel like a tool a professional trusts and a shopkeeper isn't afraid of.

---

## 2. Brand Identity

### 2.1 Name & Meaning

**Hisaab (حساب)** — Arabic/Urdu for "account," "reckoning," or "calculation." Used daily in Pakistani commerce: *"Hisaab karo"* (do the accounts). Zero explanation needed for the target user.

### 2.2 Tagline

**"Smart books for every Pakistani business."**

- English: Smart books for every Pakistani business
- Urdu: ہر پاکستانی کاروبار کے لیے ذہین حساب

### 2.3 Logo Concept

**Primary Mark:** The word "Hisaab" in a refined serif display font, with the Urdu "ح" (ha) used as a standalone icon mark — functioning as both a letter and a visual symbol (the open curve suggests an open ledger or a balance scale).

**Icon Mark Only (app icon, favicon):** The stylized "ح" in white on a deep forest green (#1B4332) rounded rectangle. Geometric, clean, recognizable at small sizes.

**Logo Lockup Rules:**
- Minimum size: 120px wide (full wordmark), 32px (icon only)
- Clear space: equal to the cap-height of the "H" on all sides
- Never place on a background with less than 4.5:1 contrast ratio
- Never rotate, stretch, recolor, or add effects

### 2.4 Brand Voice

| Context | Tone | Example |
|---------|------|---------|
| Dashboard labels | Neutral, precise | "Net Profit — May 2026" |
| Error messages | Calm, helpful | "We couldn't read this receipt. You can add it manually." |
| Empty states | Encouraging | "No transactions yet. Snap your first receipt to get started." |
| AI review card | Transparent | "Here's what we found. Check and confirm before saving." |
| Success states | Understated | "Added to your ledger." |

**Never:** Exclamation marks on financial data. Congratulatory language on profit ("Great job!"). Alarming language on loss. Jargon (EBITDA, amortization, accruals).

---

## 3. Color System

### 3.1 Primary Palette

```
┌─────────────────────────────────────────────────────────────┐
│  Forest Green    Leaf Green     Cream White    Charcoal     │
│  #1B4332         #40916C        #F8F4EE        #1C1C1E      │
│  ████████        ████████       ████████       ████████     │
│  Primary brand   Interactive    Background     Body text    │
└─────────────────────────────────────────────────────────────┘
```

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--color-primary-900` | `#1B4332` | 27, 67, 50 | Brand color, headers, primary buttons |
| `--color-primary-700` | `#2D6A4F` | 45, 106, 79 | Hover states on primary elements |
| `--color-primary-500` | `#40916C` | 64, 145, 108 | Interactive elements, links, active states |
| `--color-primary-300` | `#74C69D` | 116, 198, 157 | Progress indicators, subtle highlights |
| `--color-primary-100` | `#D8F3DC` | 216, 243, 220 | Income row background, success surfaces |
| `--color-primary-50` | `#F0FAF3` | 240, 250, 243 | Hover tint on income rows |

### 3.2 Semantic Colors

```
Income / Positive        Expense / Negative       Warning / Unclear
#2D6A4F (text)           #9B1C1C (text)           #92400E (text)
#D8F3DC (background)     #FEE2E2 (background)     #FEF3C7 (background)
#40916C (border)         #EF4444 (border)         #F59E0B (border)
```

| Semantic Role | Text Color | Background | Border |
|---------------|------------|------------|--------|
| Income | `#2D6A4F` | `#D8F3DC` | `#40916C` |
| Expense | `#9B1C1C` | `#FEE2E2` | `#EF4444` |
| Warning / Unclear | `#92400E` | `#FEF3C7` | `#F59E0B` |
| Neutral / Manual entry | `#374151` | `#F9FAFB` | `#D1D5DB` |

### 3.3 Neutral Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-neutral-900` | `#1C1C1E` | Primary body text |
| `--color-neutral-700` | `#374151` | Secondary text, labels |
| `--color-neutral-500` | `#6B7280` | Placeholder text, metadata |
| `--color-neutral-300` | `#D1D5DB` | Borders, dividers |
| `--color-neutral-100` | `#F3F4F6` | Alternate row background |
| `--color-neutral-50` | `#F9FAFB` | Page section background |

### 3.4 Background Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-base` | `#F8F4EE` | Main page background (warm cream) |
| `--color-bg-card` | `#FFFFFF` | Card and panel backgrounds |
| `--color-bg-sidebar` | `#1B4332` | Navigation sidebar (if used) |
| `--color-bg-overlay` | `rgba(0,0,0,0.4)` | Modal backdrop |

### 3.5 Color Usage Rules

- **Never** use green text on green background (contrast failure)
- Income and expense rows must use **both** color AND an icon/label — color alone is never the only differentiator (accessibility)
- All text/background combinations must meet **WCAG AA minimum** (4.5:1 for normal text, 3:1 for large text)
- The primary brand green `#1B4332` on white `#FFFFFF` achieves **12.6:1** contrast — use freely

---

## 4. Typography

### 4.1 Font Families

**Display Font — Playfair Display**
Used for: Dashboard monetary values, screen titles, the Hisaab wordmark.
Why: Serif authority signals financial trustworthiness. Distinctive enough to be memorable. Renders beautifully at large sizes on low-resolution screens common in Pakistan.

```css
font-family: 'Playfair Display', Georgia, serif;
```

**Body Font — DM Sans**
Used for: All UI labels, buttons, navigation, table content, form fields, body copy.
Why: Geometric humanist sans-serif — highly legible at small sizes on mobile, friendly without being playful, neutral enough to pair with Playfair.

```css
font-family: 'DM Sans', system-ui, sans-serif;
```

**Urdu Font — Noto Nastaliq Urdu**
Used for: All Urdu text output from AI (explanations, labels in Urdu). Handles Nastaliq rendering with proper ligatures.

```css
font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif;
direction: rtl;
text-align: right;
line-height: 2.2; /* Nastaliq requires extra line-height */
```

**Monospace Font — JetBrains Mono**
Used for: Currency amounts in the ledger table, account numbers, transaction IDs.
Why: Tabular figures align correctly in tables; monospace prevents amount columns from shifting.

```css
font-family: 'JetBrains Mono', 'Fira Code', monospace;
font-variant-numeric: tabular-nums;
```

### 4.2 Type Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|------------|--------|-------|
| `--text-display` | 48px / 3rem | 1.1 | 700 | Hero dashboard totals |
| `--text-title-xl` | 32px / 2rem | 1.2 | 700 | Screen titles |
| `--text-title-lg` | 24px / 1.5rem | 1.3 | 600 | Card headers, section titles |
| `--text-title-md` | 20px / 1.25rem | 1.4 | 600 | Sub-section headers |
| `--text-body-lg` | 16px / 1rem | 1.6 | 400 | Primary body text |
| `--text-body-md` | 14px / 0.875rem | 1.5 | 400 | Secondary body, table content |
| `--text-body-sm` | 12px / 0.75rem | 1.4 | 400 | Metadata, timestamps, helper text |
| `--text-label` | 11px / 0.6875rem | 1.3 | 600 | ALL CAPS category chips, column headers |
| `--text-mono-lg` | 18px / 1.125rem | 1.4 | 500 | Ledger amounts |
| `--text-mono-md` | 14px / 0.875rem | 1.4 | 400 | Secondary amounts |

### 4.3 Currency Display Rules

All monetary amounts follow this format:

```
Rs [amount with comma separators]
Examples:
  Rs 1,200       (under 10,000)
  Rs 15,000      (under 100,000)
  Rs 2,22,500    (Pakistani lakh notation for display)
  Rs 1,17,700    (Net Profit display)
```

- Always display in **JetBrains Mono** with `tabular-nums`
- Positive amounts: `--color-primary-500` (#40916C)
- Negative amounts: `#EF4444`
- "Rs" prefix in `--text-body-sm`, amount in `--text-mono-lg` or `--text-display` depending on context

### 4.4 Bilingual Text Rules

When Urdu and English text appear together (AI review card, explanation fields):

```
┌─────────────────────────────────────────────────────────────┐
│  EXPLANATION                                                │
│  ─────────────────────────────────────────────────────────  │
│  English (LTR, DM Sans, 14px):                              │
│  This is flour inventory purchased from Habib Mills.        │
│                                                             │
│  اردو (RTL, Noto Nastaliq, 16px):                         │
│  یہ حبیب ملز سے خریدا گیا آٹے کا اسٹاک ہے۔               │
└─────────────────────────────────────────────────────────────┘
```

- Use a subtle `1px` divider between English and Urdu blocks
- Urdu block always uses `direction: rtl` and `text-align: right`
- Never mix scripts in the same line
- Urdu line-height must be `2.2` minimum (Nastaliq descenders require it)

---

## 5. Spacing & Grid System

### 5.1 Base Unit

**Base unit: 4px**

All spacing values are multiples of 4px. This creates a consistent visual rhythm across the entire interface.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Icon padding, tight inline gaps |
| `--space-2` | 8px | Component internal padding (small) |
| `--space-3` | 12px | Form field internal padding |
| `--space-4` | 16px | Standard component padding |
| `--space-5` | 20px | Card padding (mobile) |
| `--space-6` | 24px | Card padding (desktop), section gaps |
| `--space-8` | 32px | Between major sections |
| `--space-10` | 40px | Screen-level padding (desktop) |
| `--space-12` | 48px | Large section separators |
| `--space-16` | 64px | Hero section vertical rhythm |

### 5.2 Layout Grid

**Mobile (< 768px):** Single column, 16px left/right padding, no gutter.

**Tablet (768px – 1024px):** 12-column grid, 24px gutter, 24px margin.

**Desktop (> 1024px):** 12-column grid, 32px gutter, 40px margin. Max content width: 1280px, centered.

### 5.3 Dashboard Grid

```
Desktop Layout:
┌──────────────────────────────────────────────────────────────┐
│  [Income]   [Expenses]   [Net Profit]   [Transactions]       │
│  3 cols     3 cols        3 cols         3 cols              │
└──────────────────────────────────────────────────────────────┘
│  [Bar Chart — 8 cols]         [Quick Actions — 4 cols]       │
└──────────────────────────────────────────────────────────────┘

Mobile Layout (stacked):
┌────────────────────┐
│  [Income]          │
│  [Expenses]        │
│  [Net Profit]      │
│  [Transactions]    │
│  [Bar Chart]       │
│  [Quick Actions]   │
└────────────────────┘
```

### 5.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Chips, badges, small tags |
| `--radius-md` | 8px | Buttons, inputs, small cards |
| `--radius-lg` | 12px | Dashboard cards |
| `--radius-xl` | 16px | Modal dialogs, upload area |
| `--radius-full` | 9999px | Pill buttons, avatar circles |

---

## 6. Iconography

### 6.1 Icon Library

Use **Lucide Icons** — consistent stroke width (1.5px), open-source, works with Bolt.new and Lovable out of the box.

### 6.2 Icon Sizes

| Size | Pixels | Usage |
|------|--------|-------|
| XS | 14px | Inline text icons, table row indicators |
| SM | 16px | Button icons, navigation items |
| MD | 20px | Card header icons |
| LG | 24px | Dashboard section icons |
| XL | 32px | Empty state illustrations |
| XXL | 48px | Upload area icon |

### 6.3 Icon Map

| Action / Concept | Lucide Icon | Usage Location |
|-----------------|-------------|---------------|
| Scan receipt | `camera` or `scan` | Primary CTA button |
| Manual entry | `pencil` or `edit` | Secondary CTA |
| Income / Money in | `arrow-down-circle` (green) | Ledger income rows |
| Expense / Money out | `arrow-up-circle` (red) | Ledger expense rows |
| Total income | `trending-up` | Dashboard card |
| Total expenses | `trending-down` | Dashboard card |
| Net profit | `scale` | Dashboard card |
| Transaction count | `receipt` | Dashboard card |
| Tax / FBR summary | `file-text` | Tax Summary tab |
| Category: Inventory | `package` | Ledger category chip |
| Category: Utilities | `zap` | Ledger category chip |
| Category: Transport | `truck` | Ledger category chip |
| Category: Equipment | `tool` | Ledger category chip |
| Category: Services | `briefcase` | Ledger category chip |
| Category: Salary | `users` | Ledger category chip |
| Category: Food | `coffee` | Ledger category chip |
| Category: Other | `more-horizontal` | Ledger category chip |
| Warning / Unclear | `alert-triangle` | AI review card warning |
| Confirm | `check-circle` | Review card confirm button |
| Discard | `x-circle` | Review card discard |
| Filter | `sliders` | Ledger filter button |
| Print | `printer` | Tax summary print |
| Month nav back | `chevron-left` | Month selector |
| Month nav forward | `chevron-right` | Month selector |

---

## 7. Component Library

### 7.1 Buttons

**Primary Button** — Used for the main CTA (Add Receipt)

```
┌──────────────────────────────┐
│  📷  Add Receipt             │
└──────────────────────────────┘

Background:   #1B4332
Text:         #FFFFFF
Icon:         #FFFFFF, 16px
Font:         DM Sans, 14px, weight 600
Padding:      12px 20px
Border-radius: 8px
Min-width:    140px

Hover:        background → #2D6A4F, translateY(-1px)
Active:       background → #1B4332, translateY(0)
Disabled:     opacity 0.5, cursor not-allowed
Focus:        2px solid #40916C outline, 2px offset
```

**Secondary Button** — Used for Manual Entry

```
┌──────────────────────────────┐
│  ✏  Add Manually            │
└──────────────────────────────┘

Background:   transparent
Text:         #1B4332
Border:       1.5px solid #1B4332
Border-radius: 8px
Font:         DM Sans, 14px, weight 600
Padding:      12px 20px

Hover:        background → #F0FAF3
```

**Destructive Button** — Used for Delete / Discard

```
Background:   transparent
Text:         #9B1C1C
Border:       1.5px solid #EF4444

Hover:        background → #FEE2E2
```

**Ghost Button** — Used for tertiary actions (Print, Filter)

```
Background:   transparent
Text:         #374151
No border

Hover:        background → #F3F4F6
```

### 7.2 Dashboard Summary Cards

```
┌──────────────────────────────────┐
│  ↑  Total Income          [icon] │
│                                  │
│  Rs 2,22,500                     │
│                                  │
│  ▲ +12% from last month          │
└──────────────────────────────────┘

Width:         Fluid (25% of grid minus gutter on desktop, 100% on mobile)
Background:    #FFFFFF
Border:        1px solid #E5E7EB
Border-radius: 12px
Padding:       24px
Box-shadow:    0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)

Label:         DM Sans, 11px, weight 600, ALL CAPS, #6B7280, letter-spacing 0.08em
Amount:        Playfair Display, 32px, weight 700, color varies by card type
Trend:         DM Sans, 12px, weight 400, green (#40916C) or red (#EF4444)
Icon:          Lucide, 20px, top-right corner, color matches card type
```

**Card Color Variants:**

| Card | Amount Color | Icon | Left Border |
|------|-------------|------|-------------|
| Total Income | `#2D6A4F` | `trending-up` green | 3px solid `#40916C` |
| Total Expenses | `#9B1C1C` | `trending-down` red | 3px solid `#EF4444` |
| Net Profit | `#1B4332` or `#9B1C1C` | `scale` | 3px solid (green/red) |
| Transactions | `#1C1C1E` | `receipt` grey | 3px solid `#6B7280` |

### 7.3 Ledger Table

```
COLUMN WIDTHS (Desktop):
Date        10%
Vendor      30%
Category    20%
Type        10%
Amount      15%
Actions     15%

ROW HEIGHT: 52px (comfortable tap target on mobile)
HEADER HEIGHT: 40px

Header:
  Background:    #F8F4EE (warm cream, matches page bg)
  Text:          DM Sans, 11px, weight 600, ALL CAPS, #6B7280
  Padding:       12px 16px
  Border-bottom: 2px solid #E5E7EB

Income Row:
  Background:    #FFFFFF (default) / #F0FAF3 (hover)
  Left border:   3px solid #40916C
  Type badge:    "Income" chip, green background

Expense Row:
  Background:    #FFFFFF (default) / #FFF5F5 (hover)
  Left border:   3px solid #EF4444
  Type badge:    "Expense" chip, red background

Alternating rows: Even rows get a very subtle #FAFAFA (almost invisible — warmth, not distraction)
```

**Amount Column (Ledger):**
```
Font:         JetBrains Mono, 14px, weight 500
Income:       +Rs 45,000  →  color: #2D6A4F
Expense:      -Rs 15,000  →  color: #9B1C1C
Alignment:    right
```

**Category Chip:**
```
Background:   #F3F4F6
Text:         #374151, DM Sans, 11px, weight 600, ALL CAPS
Border-radius: 4px
Padding:      3px 8px
Icon:         Lucide, 12px, inline-left
```

### 7.4 AI Receipt Review Card

This is the most critical component — shown after a receipt scan, before the user confirms.

```
┌─────────────────────────────────────────────────────────────┐
│  📋  Review Extracted Details                    [⚠ 1 unclear]│
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  VENDOR          DATE              CATEGORY                 │
│  [Habib Flour ▼] [2026-05-01  📅] [Inventory      ▼]       │
│                                                             │
│  TOTAL AMOUNT    TRANSACTION TYPE                           │
│  [Rs 15,000    ] [● Expense  ○ Income]                      │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  ITEMS DETECTED                                             │
│  Atta 50kg × 3    Rs 3,800 each    Rs 11,400               │
│  Delivery charge                   Rs 200                   │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  ⚠ Date could not be read clearly. Please verify.          │
│                                                             │
│  [✕ Discard]                      [✓ Confirm & Save]       │
└─────────────────────────────────────────────────────────────┘

Container:
  Background:    #FFFFFF
  Border:        1px solid #E5E7EB
  Border-radius: 16px
  Box-shadow:    0 20px 60px rgba(0,0,0,0.12)
  Max-width:     560px
  Padding:       28px

Warning Banner:
  Background:    #FEF3C7
  Border-left:   4px solid #F59E0B
  Text:          #92400E, DM Sans, 13px
  Icon:          alert-triangle, 14px, #F59E0B

Confirm Button:  Full-width Primary Button (#1B4332)
Discard Button:  Full-width Destructive Ghost Button
```

All fields in the review card are **editable inputs** — user can correct any AI extraction error before saving.

### 7.5 Form Inputs

```
Label:
  DM Sans, 12px, weight 600, #374151, ALL CAPS
  Margin-bottom: 6px
  Letter-spacing: 0.05em

Input Field:
  Background:    #FFFFFF
  Border:        1.5px solid #D1D5DB
  Border-radius: 8px
  Padding:       10px 14px
  Font:          DM Sans, 14px, #1C1C1E
  Height:        44px (comfortable tap target)

  Focus:         border-color → #40916C, box-shadow: 0 0 0 3px rgba(64,145,108,0.15)
  Error:         border-color → #EF4444, box-shadow: 0 0 0 3px rgba(239,68,68,0.1)
  Disabled:      background → #F9FAFB, color → #9CA3AF

Dropdown / Select:
  Same as Input + chevron-down icon at right (16px, #6B7280)

Amount Input:
  Font: JetBrains Mono, 16px (monospace for financial values)
  "Rs" prefix: positioned left inside the input, DM Sans, 14px, #6B7280

Error Message:
  DM Sans, 12px, #9B1C1C
  Icon: alert-circle, 12px inline-left
  Margin-top: 4px
```

### 7.6 Navigation Tabs

```
┌──────────────────────────────────────────────────────────────┐
│  [Dashboard]    [Ledger]    [Tax Summary]                    │
│       ───                                                    │
└──────────────────────────────────────────────────────────────┘

Tab container:
  Border-bottom: 1px solid #E5E7EB
  Background:    #FFFFFF

Tab item (default):
  Font:          DM Sans, 14px, weight 500, #6B7280
  Padding:       12px 20px
  Cursor:        pointer

Tab item (active):
  Font-weight:   600
  Color:         #1B4332
  Border-bottom: 2px solid #1B4332
  Margin-bottom: -1px (overlaps container border)

Tab item (hover):
  Color:         #2D6A4F
  Background:    #F0FAF3

Mobile: Tabs become a horizontal scrollable strip with no wrapping
```

### 7.7 Month Selector

```
◄  May 2026  ►

Font:          DM Sans, 14px, weight 600, #1C1C1E
Arrow buttons: Ghost button style, Lucide chevron icons
Background:    #F3F4F6
Border-radius: 8px
Padding:       8px 16px
Gap between elements: 12px

Disable "►" when current month is displayed (cannot navigate to future)
```

### 7.8 Upload / Scan Area

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              📷                                              │
│                                                              │
│         Snap a receipt or invoice                            │
│    Tap to take a photo or upload from gallery                │
│                                                              │
│           [Scan Receipt]                                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘

State: Default (no file)
  Border:        2px dashed #D1D5DB
  Border-radius: 16px
  Background:    #F9FAFB
  Padding:       40px 24px
  Icon:          camera, 48px, #6B7280
  Title:         DM Sans, 16px, weight 600, #374151
  Subtitle:      DM Sans, 14px, #6B7280

State: Drag-over
  Border:        2px dashed #40916C
  Background:    #F0FAF3

State: Processing (after upload)
  Show spinner animation (rotating ring, #40916C)
  Text: "Reading your receipt..." DM Sans, 14px, #6B7280
  Disable upload button during processing

State: Error
  Border:        2px dashed #EF4444
  Background:    #FFF5F5
  Show error message with retry option
```

### 7.9 Empty State

Shown only if demo data is removed or the user navigates to a month with no transactions.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              📋                                              │
│                                                              │
│         No transactions in this month                        │
│    Scan a receipt or add one manually to get started.        │
│                                                              │
│   [📷 Scan Receipt]    [✏ Add Manually]                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Icon:  receipt, 48px, #D1D5DB
Title: Playfair Display, 20px, weight 600, #374151
Body:  DM Sans, 14px, #6B7280
CTAs:  Both buttons side by side, Primary + Secondary style
```

### 7.10 Toast Notifications

```
Position: Bottom-center, 24px from bottom edge

┌──────────────────────────────────────────────────────────────┐
│  ✓  Transaction added to your ledger.                        │
└──────────────────────────────────────────────────────────────┘

Success toast:
  Background: #1B4332
  Text: #FFFFFF, DM Sans, 14px
  Icon: check-circle, white
  Duration: 3 seconds, then fade out
  Border-radius: 8px
  Padding: 12px 20px
  Box-shadow: 0 4px 20px rgba(0,0,0,0.15)

Error toast:
  Background: #9B1C1C
  Same structure as success

Animation: slide up from bottom (200ms ease-out), fade out (300ms ease-in)
```

---

## 8. Screen Layouts & Wireframes

### 8.1 App Header

```
Desktop:
┌──────────────────────────────────────────────────────────────┐
│  ح  Hisaab          [◄ May 2026 ►]    [✏ Manual] [📷 Scan] │
└──────────────────────────────────────────────────────────────┘

Mobile:
┌──────────────────────────────────────────────────────────────┐
│  ح  Hisaab                                          [📷 +]  │
└──────────────────────────────────────────────────────────────┘

Height:     64px
Background: #FFFFFF
Border-bottom: 1px solid #E5E7EB
Box-shadow: 0 1px 3px rgba(0,0,0,0.05)

Logo: Icon mark + wordmark, height 32px
Month selector: Centered (desktop), hidden on mobile header (moved to dashboard)
CTAs: Right-aligned (desktop), floating action button (mobile)
```

### 8.2 Dashboard Screen

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER                                                      │
├──────────────────────────────────────────────────────────────┤
│  TABS: [Dashboard*] [Ledger] [Tax Summary]                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ ↓Income  │ │ ↑Expense │ │ ⚖Profit  │ │ #Count   │       │
│  │Rs 2,22,500│ │Rs 1,04,800│ │Rs 1,17,700│ │   22     │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                              │
│  ┌────────────────────────────┐  ┌──────────────────────┐   │
│  │  EXPENSES BY CATEGORY      │  │  RECENT TRANSACTIONS  │   │
│  │  [Bar chart]               │  │  [Last 5 rows]        │   │
│  │                            │  │  View all →           │   │
│  └────────────────────────────┘  └──────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 8.3 Ledger Screen

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER + TABS                                               │
├──────────────────────────────────────────────────────────────┤
│  [Filter: All ▼]  [Type: All ▼]  [◄ May 2026 ►]  [Export] │
├──────────────────────────────────────────────────────────────┤
│  DATE      VENDOR            CATEGORY    TYPE      AMOUNT    │
│  ─────────────────────────────────────────────────────────   │
│  01 May  │ Habib Flour     │ Inventory │ Expense │ -15,000  │
│  02 May  │ National Sugar  │ Inventory │ Expense │  -8,500  │
│  07 May  │ Weekly Sales    │  Sales    │ Income  │ +45,000  │
│  ...                                                         │
│  ─────────────────────────────────────────────────────────   │
│  TOTALS                                Income   Expenses     │
│                                       2,22,500  1,04,800    │
└──────────────────────────────────────────────────────────────┘
```

### 8.4 Tax Summary Screen

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER + TABS                                               │
├──────────────────────────────────────────────────────────────┤
│  FBR Monthly Expense Summary — May 2026          [🖨 Print]  │
│  Rehman General Store                                        │
├──────────────────────────────────────────────────────────────┤
│  CATEGORY                               TOTAL (PKR)          │
│  ─────────────────────────────────────────────────────────   │
│  Inventory                              57,000               │
│  Utilities                               6,200               │
│  Services (Rent)                        25,000               │
│  Salary                                 18,000               │
│  Transport                                 500               │
│  Equipment                               1,500               │
│  Food                                      800               │
│  Other                                   2,800               │
│  ─────────────────────────────────────────────────────────   │
│  TOTAL DEDUCTIBLE EXPENSES             1,11,800              │
│  ─────────────────────────────────────────────────────────   │
│  ⓘ Share this summary with your accountant or use it        │
│    for your FBR income tax return filing.                    │
└──────────────────────────────────────────────────────────────┘
```

### 8.5 Mobile — Floating Action Button

On mobile, the primary "Scan Receipt" action becomes a floating circular button fixed to the bottom-right:

```
Position:      fixed, bottom 24px, right 24px
Size:          56px × 56px
Background:    #1B4332
Icon:          camera, 24px, #FFFFFF
Border-radius: 50%
Box-shadow:    0 4px 16px rgba(27,67,50,0.4)

Tap:           scale(0.95) on press, scale(1) on release
```

---

## 9. Motion & Micro-interactions

### 9.1 Global Transitions

```css
/* Applied globally — consistent, fast, never distracting */
transition-duration: 150ms;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); /* ease */
```

Financial data never animates unexpectedly — numbers should feel stable and trustworthy.

### 9.2 Dashboard Card Entry

On initial load, dashboard cards animate in with a staggered fade-up:

```css
/* Card 1 */
animation: fadeSlideUp 300ms ease forwards;
animation-delay: 0ms;

/* Card 2 */
animation-delay: 75ms;

/* Card 3 */
animation-delay: 150ms;

/* Card 4 */
animation-delay: 225ms;

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### 9.3 Amount Counter Animation

When a new transaction is confirmed and dashboard totals update:

```
Old value → New value: Count-up animation, 600ms, ease-out
Color flash: Briefly highlight the changed card with a subtle green pulse
(0 → 50% opacity of #D8F3DC border glow → 0, 800ms total)
```

### 9.4 Ledger Row Entry

When a new row is added to the ledger after confirmation:

```
New row slides in from top:
  animation: slideDown 250ms ease forwards
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
```

### 9.5 Scan Processing State

While the Gemini API processes the image:

```
Spinner: Rotating ring, 32px, #40916C, 1 full rotation per 800ms
Text below: "Reading your receipt..." in DM Sans, 14px, #6B7280
Pulse animation on text: opacity 1 → 0.5 → 1, 1.2s loop
```

### 9.6 Review Card Modal

```
Backdrop: fade in, 200ms, rgba(0,0,0,0) → rgba(0,0,0,0.4)
Card:     scale(0.95) + opacity(0) → scale(1) + opacity(1), 250ms ease-out

Dismiss:  reverse — scale(1) → scale(0.97) + opacity(0), 200ms ease-in
```

### 9.7 Motion Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

All animations are suppressed for users with the reduced-motion preference enabled.

---

## 10. Responsive Design

### 10.1 Breakpoints

| Name | Min-width | Description |
|------|-----------|-------------|
| `xs` | 0px | Small phones (360px minimum supported) |
| `sm` | 480px | Large phones |
| `md` | 768px | Tablets, phablets |
| `lg` | 1024px | Laptops, small desktops |
| `xl` | 1280px | Standard desktops |

### 10.2 Component Behavior by Breakpoint

| Component | Mobile (xs/sm) | Tablet (md) | Desktop (lg+) |
|-----------|---------------|-------------|---------------|
| Dashboard cards | Single column stack | 2×2 grid | 4-column row |
| Ledger table | Card-based list view | Condensed table | Full table |
| Navigation tabs | Horizontally scrollable | Full width | Full width |
| Action buttons | FAB (floating) | Inline header | Inline header |
| Month selector | Below header | In header | In header |
| Review card | Full-screen slide-up | Centered modal | Centered modal |
| Bar chart | Horizontal bars | Vertical bars | Vertical bars |

### 10.3 Ledger — Mobile Card View

On mobile, the ledger table becomes a card list (tables don't work on small screens):

```
┌──────────────────────────────────────────────────────────────┐
│  │  Habib Flour Mills                          -Rs 15,000   │
│  │  01 May 2026  ·  Inventory        [Expense chip]         │
└──────────────────────────────────────────────────────────────┘
```

Left border color indicates income (green) or expense (red). Amount is bold, right-aligned.

### 10.4 Minimum Tap Target Sizes

All interactive elements on mobile must meet **44×44px** minimum tap target. If a visual element is smaller, pad it to meet this requirement invisibly.

---

## 11. Accessibility Standards

### 11.1 Target Standard

**WCAG 2.1 Level AA** — minimum requirement for all components.

### 11.2 Color Contrast Ratios

| Combination | Ratio | Pass Level |
|-------------|-------|------------|
| `#1B4332` on `#FFFFFF` | 12.6:1 | AAA ✓ |
| `#374151` on `#FFFFFF` | 8.9:1 | AAA ✓ |
| `#6B7280` on `#FFFFFF` | 4.6:1 | AA ✓ |
| `#2D6A4F` on `#D8F3DC` | 4.7:1 | AA ✓ |
| `#9B1C1C` on `#FEE2E2` | 5.1:1 | AA ✓ |
| `#92400E` on `#FEF3C7` | 4.8:1 | AA ✓ |

### 11.3 Keyboard Navigation

- All interactive elements reachable by Tab key
- Focus order follows visual reading order (left→right, top→bottom)
- Focus ring: `2px solid #40916C`, `2px offset` — always visible, never hidden
- Escape key closes modals and review cards
- Enter/Space activates buttons

### 11.4 Screen Reader Support

- All icons that convey meaning have `aria-label` attributes
- Decorative icons have `aria-hidden="true"`
- Form inputs have associated `<label>` elements (not placeholder-only)
- Dashboard card amounts have descriptive aria-labels: `aria-label="Total income this month: 222,500 rupees"`
- Table has `<caption>` and proper `<th scope>` attributes
- Loading states announced via `aria-live="polite"`

### 11.5 Urdu Text Accessibility

```html
<!-- Urdu content must always have correct lang and dir attributes -->
<p lang="ur" dir="rtl" class="urdu-text">
  یہ حبیب ملز سے خریدا گیا آٹے کا اسٹاک ہے۔
</p>
```

---

## 12. Design Tokens (CSS Variables)

Paste this block into the root of your app's CSS. All components reference these variables — never hardcode color or size values.

```css
:root {
  /* ── BRAND COLORS ── */
  --color-primary-900: #1B4332;
  --color-primary-700: #2D6A4F;
  --color-primary-500: #40916C;
  --color-primary-300: #74C69D;
  --color-primary-100: #D8F3DC;
  --color-primary-50:  #F0FAF3;

  /* ── SEMANTIC COLORS ── */
  --color-income-text:       #2D6A4F;
  --color-income-bg:         #D8F3DC;
  --color-income-border:     #40916C;

  --color-expense-text:      #9B1C1C;
  --color-expense-bg:        #FEE2E2;
  --color-expense-border:    #EF4444;

  --color-warning-text:      #92400E;
  --color-warning-bg:        #FEF3C7;
  --color-warning-border:    #F59E0B;

  /* ── NEUTRALS ── */
  --color-neutral-900: #1C1C1E;
  --color-neutral-700: #374151;
  --color-neutral-500: #6B7280;
  --color-neutral-300: #D1D5DB;
  --color-neutral-100: #F3F4F6;
  --color-neutral-50:  #F9FAFB;

  /* ── BACKGROUNDS ── */
  --color-bg-base:    #F8F4EE;
  --color-bg-card:    #FFFFFF;
  --color-bg-overlay: rgba(0, 0, 0, 0.4);

  /* ── TYPOGRAPHY ── */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body:    'DM Sans', system-ui, sans-serif;
  --font-urdu:    'Noto Nastaliq Urdu', serif;
  --font-mono:    'JetBrains Mono', monospace;

  --text-display:   3rem;      /* 48px */
  --text-title-xl:  2rem;      /* 32px */
  --text-title-lg:  1.5rem;    /* 24px */
  --text-title-md:  1.25rem;   /* 20px */
  --text-body-lg:   1rem;      /* 16px */
  --text-body-md:   0.875rem;  /* 14px */
  --text-body-sm:   0.75rem;   /* 12px */
  --text-label:     0.6875rem; /* 11px */
  --text-mono-lg:   1.125rem;  /* 18px */
  --text-mono-md:   0.875rem;  /* 14px */

  /* ── SPACING ── */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* ── BORDER RADIUS ── */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-full: 9999px;

  /* ── SHADOWS ── */
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:  0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg:  0 20px 60px rgba(0,0,0,0.12);
  --shadow-fab: 0 4px 16px rgba(27,67,50,0.4);

  /* ── TRANSITIONS ── */
  --transition-fast:   150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow:   400ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 13. Asset Specifications

### 13.1 Favicon

| Format | Size | Usage |
|--------|------|-------|
| `favicon.ico` | 32×32, 16×16 | Browser tab |
| `icon-192.png` | 192×192 | Android home screen |
| `icon-512.png` | 512×512 | PWA splash screen |
| `apple-touch-icon.png` | 180×180 | iOS home screen |

All icons: the "ح" mark in white on `#1B4332` background, rounded rectangle.

### 13.2 Open Graph / Social Share

```
og:image size:  1200×630px
Content:        Hisaab logo centered, tagline below, green background
                "Smart books for every Pakistani business"
```

### 13.3 Font Loading

Load fonts from Google Fonts via `<link>` in the HTML `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet">
```

Use `display=swap` to prevent invisible text during font load (FOIT).

---

## 14. Builder Handoff Notes

### 14.1 First Prompt for Bolt.new / Lovable

Paste this as your opening build prompt (replace placeholders in brackets):

```
Build a professional bookkeeping web app called Hisaab for Pakistani small
businesses.

Design system:
- Background: #F8F4EE (warm cream)
- Primary color: #1B4332 (forest green)
- Cards: #FFFFFF with subtle shadow
- Income color: #2D6A4F text on #D8F3DC background
- Expense color: #9B1C1C text on #FEE2E2 background
- Display font: Playfair Display (amounts, titles)
- Body font: DM Sans (labels, navigation, table content)
- Monospace font: JetBrains Mono (currency amounts in tables)

Layout:
- Header with "Hisaab" logo (left), month selector (center), two action
  buttons — Add Manually and Scan Receipt (right)
- Tab navigation below header: Dashboard | Ledger | Tax Summary
- Dashboard: 4 summary cards in a row (Total Income, Total Expenses,
  Net Profit, Transaction Count), then a bar chart of expenses by category
  on the left and recent transactions list on the right
- Ledger: full data table with Date, Vendor, Category, Type, Amount columns
- Tax Summary: two-column table of expense categories and totals

Pre-populate with this transaction data for "Rehman General Store, May 2026":
[paste the full demo dataset table here]

Make the design mobile-responsive. The app should feel trustworthy, clean,
and professional — like a tool a Pakistani shopkeeper would trust with their
finances.
```

### 14.2 Critical Rules for Builder Prompts

- Always specify exact hex colors — never say "green" or "red"
- Specify font names exactly as they appear in the Google Fonts URL
- Ask for currency amounts in JetBrains Mono with right-alignment
- Specify `direction: rtl` on every Urdu text output field
- Ask for pre-populated data in the first prompt — never leave the dashboard empty
- Request income rows to have a left green border and expense rows a left red border (not just text color)

### 14.3 Component Build Order (Day 1 Priority)

Build in this exact order — stop after each step and verify it works before proceeding:

| Priority | Component | Why |
|----------|-----------|-----|
| 1 | Dashboard with demo data | Your safety net — this works even if AI fails |
| 2 | Tab navigation | Connects all screens |
| 3 | Ledger table with demo data | Judges will look at this during demo |
| 4 | AI receipt upload + Gemini call | The "wow" moment |
| 5 | Review card + confirm flow | Makes the AI trustworthy |
| 6 | Tax Summary tab | Judges ask about FBR — show it |
| 7 | Manual entry form | Fallback credibility |
| 8 | Toast notifications | Polish |
| 9 | Bar chart | Nice to have — only if time permits |

---

*Hisaab — Smart books for every Pakistani business*  
*Design Document Specification v1.0 | Spectrum 26 — Vibe & Pitch | June 2026*

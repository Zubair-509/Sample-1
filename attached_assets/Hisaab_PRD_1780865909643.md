# Hisaab (حساب) — Product Requirements Document

**Product Name:** Hisaab  
**Tagline:** Smart books for every Pakistani business  
**Version:** 1.0 — MVP  
**Date:** June 7, 2026  
**Status:** Draft  
**Competition:** Spectrum 26 — Vibe & Pitch, DHA Suffa University  
**Vertical:** AI & Business Solutions  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals and Non-Goals](#3-goals-and-non-goals)
4. [Target Users](#4-target-users)
5. [User Stories](#5-user-stories)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [System Architecture](#8-system-architecture)
9. [UI/UX Requirements](#9-uiux-requirements)
10. [API & Integration Requirements](#10-api--integration-requirements)
11. [Data Model](#11-data-model)
12. [Business Model & Monetization](#12-business-model--monetization)
13. [Success Metrics](#13-success-metrics)
14. [Product Roadmap](#14-product-roadmap)
15. [Risks & Mitigations](#15-risks--mitigations)
16. [Appendix](#16-appendix)

---

## 1. Executive Summary

Hisaab is an AI-powered bookkeeping web application built for micro and small businesses in Pakistan. It converts photos of physical receipts and invoices into structured ledger entries using multimodal AI (Google Gemini Vision), automatically categorizes every transaction, and generates a live profit & loss dashboard alongside an FBR-aligned monthly tax summary.

Pakistan has over five million micro-businesses operating almost entirely on paper records. No existing product in the market bridges the gap between a physical receipt and a clean financial record — automatically, from a camera, without any accounting knowledge required. Hisaab does.

---

## 2. Problem Statement

### 2.1 Background

Pakistan's informal economy is vast. Kiryana store owners, home-kitchen businesses, tailors, small suppliers, and freelancers collectively process millions of transactions daily — almost entirely on paper. The consequences compound over time:

- **Tax Filing Pain:** FBR tax filing requires expense and income documentation. Without records, businesses guess, hire expensive accountants, or avoid filing altogether and risk penalties.
- **Credit Inaccessibility:** Banks require financial history to issue business loans. Without bookkeeping, small businesses have no history to show and remain locked out of formal credit.
- **Blind Profitability:** Most owners cannot answer the question *"What was my profit last month?"* without spending hours cross-referencing paper receipts.

### 2.2 Why Existing Solutions Fall Short

| Solution | What It Does | What It Misses |
|----------|-------------|----------------|
| CreditBook / Udhaar Book | Tracks udhaar — who owes you money | Not bookkeeping — no P&L, no tax summary |
| QuickBooks / Wave | Full accounting suite | Built for Western markets, English-only, requires accounting knowledge |
| Manual spreadsheets | Flexible | Requires manual data entry, no OCR, no automation |
| Pen & paper | Zero cost | Zero insight, no FBR compliance, lost easily |

### 2.3 The Core Gap

No product in Pakistan today converts a physical receipt into a live ledger entry, profit & loss view, and tax summary — automatically, from a camera — in a way that requires zero accounting knowledge.

---

## 3. Goals and Non-Goals

### 3.1 Goals (MVP — v1.0)

- Allow users to scan a receipt or invoice photo and have the transaction extracted automatically by AI
- Maintain a running ledger of all income and expense transactions
- Display a live dashboard: total income, total expenses, net profit, and category breakdown
- Generate a monthly FBR-ready expense summary grouped by category
- Allow manual entry as a no-dependency fallback
- Be fully usable without any accounting knowledge

### 3.2 Non-Goals (MVP — explicitly out of scope)

- Mobile native app (web app only for MVP)
- Bank account integration or bank statement import
- Automated FBR e-filing
- Multi-user or multi-branch business support
- Payroll management
- Inventory tracking
- Persistent cloud storage across sessions
- Urdu-language primary UI (Urdu used in AI output; UI language is English for MVP)

> All non-goals above are explicitly roadmap items — they are deferred, not excluded permanently.

---

## 4. Target Users

### 4.1 Primary User — The Small Business Owner

| Attribute | Detail |
|-----------|--------|
| Name | Rehman |
| Age | 35–55 |
| Business | Kiryana store, Karachi |
| Tech literacy | Uses WhatsApp daily, basic smartphone comfort |
| Pain point | Box of receipts at month-end, painful manual accounting, no idea of actual profit |
| Motivation to pay | Avoid FBR penalty, eventually qualify for a business loan |

### 4.2 Secondary User — The Home Business Operator

| Attribute | Detail |
|-----------|--------|
| Name | Sana |
| Age | 25–45 |
| Business | Home-based food kitchen, 10–15 weekly orders |
| Tech literacy | Moderate — comfortable with mobile apps |
| Pain point | No record of expenses vs income; can't tell if the business is profitable |
| Motivation to pay | Wants to grow, needs financial records for a microfinance institution |

### 4.3 Tertiary User — The Freelancer / Consultant

| Attribute | Detail |
|-----------|--------|
| Name | Hassan |
| Age | 22–35 |
| Work | Freelance designer, paid via bank transfer and JazzCash |
| Pain point | FBR notices, no clean record of income and deductible expenses |
| Motivation to pay | Avoid tax trouble, present a professional financial record to clients |

---

## 5. User Stories

### 5.1 Core Stories (MVP Must-Have)

| ID | As a... | I want to... | So that... |
|----|---------|-------------|------------|
| US-01 | Business owner | Upload a photo of a receipt | It is automatically added to my ledger without any typing |
| US-02 | Business owner | See my total income, expenses, and profit on one screen | I always know where my business stands financially |
| US-03 | Business owner | See expenses broken down by category | I understand exactly where my money is going |
| US-04 | Business owner | Get a monthly tax summary | I can hand it to my accountant or file with FBR |
| US-05 | Business owner | Edit an AI-extracted transaction before confirming it | I can correct AI errors before they enter my ledger |
| US-06 | Business owner | Add a transaction manually | I can log cash transactions when there is no receipt photo |
| US-07 | Business owner | View all transactions in one ledger | I have a complete, searchable record in one place |

### 5.2 Secondary Stories (Post-MVP)

| ID | As a... | I want to... | So that... |
|----|---------|-------------|------------|
| US-08 | Business owner | Export my records as a PDF | I can share them with my accountant or a bank officer |
| US-09 | Business owner | Import my bank statement | All digital transactions are automatically captured |
| US-10 | Business owner | File directly to FBR | I do not need a separate filing process |
| US-11 | Business owner | See year-over-year profit trends | I can track business growth over time |

---

## 6. Functional Requirements

### FR-01 — Receipt Scanning and AI Extraction

- User uploads an image (JPG, PNG, or HEIC) of a receipt, invoice, or bill
- App sends image to Gemini Vision API with a structured extraction prompt
- AI returns JSON containing: vendor name, date, items, subtotal, tax amount, total, and a suggested category
- Extracted data is displayed in an editable review card before being committed to the ledger
- If the AI cannot read a field with confidence, it outputs `"Unclear — please verify"` rather than guessing
- User can edit any field in the preview card before confirming
- User either confirms the entry (adds to ledger) or discards it

### FR-02 — Transaction Ledger

- All confirmed transactions (scanned or manual) appear in a chronological ledger table
- Ledger columns: Date, Vendor/Source, Category, Type (Income/Expense), Amount (PKR)
- Rows are visually differentiated: green tint for income, red tint for expenses
- Ledger is filterable by month, category, and transaction type
- Each row is editable and deletable after entry

### FR-03 — Live Dashboard

Four summary cards update in real time as transactions are added:

- Total Income (current month)
- Total Expenses (current month)
- Net Profit / Loss (current month)
- Total Transaction Count

Supporting visuals:

- Bar chart showing expense breakdown by category
- Month selector to navigate historical months

### FR-04 — FBR Tax Summary

- Dedicated Tax Summary tab
- Shows all expense categories with their monthly totals in a clean table
- Grand total of all deductible expenses at the bottom
- Labeled clearly as "FBR Monthly Expense Summary — [Month, Year]"
- Print-friendly layout with a Print button

### FR-05 — Manual Entry

- "Add Manually" button opens a simple form
- Fields: Date, Vendor/Description, Category (dropdown of 8 categories), Type (Income/Expense), Amount
- On submit, entry is immediately added to ledger and dashboard totals update

### FR-06 — Transaction Categories

Eight fixed categories recognized by both AI and manual entry:

1. Inventory
2. Utilities
3. Transport
4. Equipment
5. Services
6. Salary
7. Food
8. Other *(default when AI is uncertain)*

---

## 7. Non-Functional Requirements

### 7.1 Performance

- Receipt AI extraction completes within **10 seconds** under normal network conditions
- Dashboard updates within **1 second** of a new transaction being confirmed
- Initial app load completes within **3 seconds**

### 7.2 Reliability

- If the Gemini API call fails, display a clear error message and surface the manual entry form — never silently drop a transaction
- All confirmed transactions persist for the duration of the session with no data loss on page refresh (cloud persistence in Phase 2)

### 7.3 Usability

- A first-time user with zero accounting knowledge must be able to scan a receipt and confirm it within **60 seconds** with no instructions
- Interface must be fully functional on a mobile browser (responsive layout)
- Font sizes and button tap targets designed for a mid-range Android phone user aged 40–55

### 7.4 Security

- Gemini API key stored server-side only — never exposed in client-side code or browser console
- Receipt images are processed and immediately discarded — not stored after extraction
- No personal user data collected at MVP stage

### 7.5 Accessibility

- All core actions operable without a mouse (keyboard accessible)
- Color is never the sole differentiator — income and expense rows use both color and an icon label

---

## 8. System Architecture

### 8.1 High-Level Flow

```
User Browser
    │
    │  Uploads receipt image
    ▼
Frontend (Bolt.new / Lovable — React + Tailwind)
    │
    │  POSTs image to backend route
    ▼
Backend / API Route
    │  Stores Gemini API key (server-side only)
    │  Constructs multipart request
    │
    │  Sends image + system prompt
    ▼
Google Gemini Vision API (gemini-1.5-flash)
    │
    │  Returns structured JSON
    ▼
Backend parses and validates JSON response
    │
    │  Returns clean transaction object
    ▼
Frontend displays editable review card
    │
    │  User confirms or edits
    ▼
React state updates (ledger + dashboard)
    │
    ▼
User sees updated dashboard in real time
```

### 8.2 Technology Stack

| Component | Technology | Reason |
|-----------|------------|--------|
| Frontend builder | Bolt.new (primary), Lovable (backup) | No-code, AI-generated, fast iteration |
| UI framework | React + Tailwind (auto-generated) | Component-based, responsive |
| AI Vision | Google Gemini 1.5 Flash | Multimodal, handles handwriting, generous free tier |
| State management | React useState | Sufficient for single-session MVP |
| Session storage | In-memory React state | No backend infrastructure needed for hackathon |
| Post-MVP storage | Supabase or Firebase | Simple hosted database with real-time sync |

---

## 9. UI/UX Requirements

### 9.1 Design Principles

- **Zero learning curve:** A shopkeeper who uses WhatsApp must be able to use Hisaab without training
- **Data first:** Dashboard is the homepage — no onboarding screens, no empty states (pre-loaded with demo data)
- **Trust through transparency:** Every AI extraction is shown for user review and approval before being committed
- **Mobile-first:** Primary users access this on mid-range Android phones

### 9.2 Color Scheme

| Element | Color |
|---------|-------|
| Primary | `#1B5E20` — Deep green (trust, money) |
| Income indicators | `#4CAF50` — Medium green |
| Expense indicators | `#C62828` — Deep red |
| Background | `#FAFAFA` — Off-white |
| Card background | `#FFFFFF` — White |
| Border/divider | `#E0E0E0` — Light grey |

### 9.3 Screen Architecture

```
╔══════════════════════════════════════╗
║  HISAAB                [Add Receipt] ║
║  Smart books for every Pakistani     ║
║  business              [Add Manually]║
╠══════════════════════════════════════╣
║  [DASHBOARD] [LEDGER] [TAX SUMMARY]  ║
╠══════════════════════════════════════╣
║  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐║
║  │Income│ │Expns │ │Profit│ │Count ║║
║  │222.5K│ │104.8K│ │117.7K│ │  22  ║║
║  └──────┘ └──────┘ └──────┘ └──────┘║
║  [Bar chart — expenses by category]  ║
║  [Month selector ◄ May 2026 ►]       ║
╠══════════════════════════════════════╣
║  DATE    VENDOR        CAT    AMOUNT ║
║  01 May  Habib Flour   Inv   -15,000 ║
║  07 May  Weekly Sales  Sales +45,000 ║
║  ...                                 ║
╚══════════════════════════════════════╝
```

### 9.4 Key UI Components

**Dashboard Cards:** Large bold numbers. Income in green, Expenses in red, Profit in green (or red if negative), with a simple directional icon.

**AI Review Card:** All extracted fields shown as editable inputs. Prominent green "Confirm" button, muted grey "Discard" button. Warning chip on any field flagged "Unclear — please verify."

**Ledger Table:** Alternating row shading. Green left-border for income rows, red left-border for expense rows. Tap/click any row to edit.

**Tax Summary:** Clean two-column table (Category, Amount). Grand total row. Minimal styling, optimized for printing.

---

## 10. API & Integration Requirements

### 10.1 Google Gemini Vision API

**Endpoint:**
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
```

**Authentication:** API key passed as query parameter — stored server-side only, never exposed to the browser.

**Request format:** Multipart request with base64-encoded image and text prompt.

### 10.2 System Prompt (Exact — do not modify)

```
You are Hisaab, a bookkeeping assistant for small businesses in Pakistan.
When given an image of a receipt, bill, or invoice, extract the financial
information and return it as JSON only.

Return:
{
  "transaction_type": "expense" | "income",
  "vendor_name": "name of the shop, supplier, or client",
  "date": "date on the receipt in YYYY-MM-DD or null if unclear",
  "items": [
    {
      "description": "item or service name",
      "quantity": number or null,
      "unit_price": number or null,
      "total": number
    }
  ],
  "subtotal": number,
  "tax_amount": number or null,
  "total_amount": number,
  "currency": "PKR",
  "category": one of: "Inventory" | "Utilities" | "Transport" |
              "Equipment" | "Services" | "Salary" | "Food" | "Other",
  "notes": "anything else relevant on the receipt"
}

If an amount is unclear, include your best estimate and add
"confidence": "low" on that field. Never invent a vendor name — if
unclear, set vendor_name to "Unknown – please check".
Output ONLY valid JSON. No preamble or explanation.
```

### 10.3 Error Handling Matrix

| Failure Mode | User-Facing Response |
|-------------|----------------------|
| HTTP 4xx / 5xx from Gemini | "Could not reach AI — please try again or add manually" |
| Malformed / non-JSON response | "AI could not read this receipt clearly — please add manually" |
| Empty response | Same as malformed response |
| Receipt too blurry / unreadable | AI returns "Unclear" on affected fields — user prompted to verify |
| Network timeout | Retry once, then surface manual entry |

---

## 11. Data Model

### 11.1 Transaction Object (Schema)

```json
{
  "id": "uuid",
  "created_at": "ISO 8601 timestamp",
  "source": "scan | manual",
  "transaction_type": "income | expense",
  "vendor_name": "string",
  "date": "YYYY-MM-DD",
  "category": "Inventory | Utilities | Transport | Equipment | Services | Salary | Food | Other",
  "total_amount": "number (PKR)",
  "items": [
    {
      "description": "string",
      "quantity": "number | null",
      "unit_price": "number | null",
      "total": "number"
    }
  ],
  "tax_amount": "number | null",
  "notes": "string | null"
}
```

### 11.2 Dashboard State (Computed — not stored)

```json
{
  "current_month": {
    "total_income": "number",
    "total_expenses": "number",
    "net_profit": "number",
    "transaction_count": "number",
    "expenses_by_category": {
      "Inventory": "number",
      "Utilities": "number",
      "Transport": "number",
      "Equipment": "number",
      "Services": "number",
      "Salary": "number",
      "Food": "number",
      "Other": "number"
    }
  }
}
```

---

## 12. Business Model & Monetization

### 12.1 Revenue Streams

**Primary — Monthly Subscription (B2C)**

| Tier | Price | Features |
|------|-------|---------|
| Free | Rs 0/month | 10 receipt scans/month, 3 months of history |
| Basic | Rs 299/month | Unlimited scans, 12 months history, Tax summary, PDF export |
| Pro | Rs 599/month | Everything in Basic + year-over-year trends, priority support, multi-category reports |

**Secondary — B2B White-Label Licensing**

Pharmacy chains, distributor networks, and microfinance institutions license Hisaab as a branded bookkeeping tool for their vendor or client base.

- Target partners: pharmacy chains, FMCG distributors, microfinance institutions (Akhuwat, NRSP)
- Pricing: Rs 50,000–150,000/month per partner depending on user volume

**Long-Term — Data Intelligence**

Anonymized and aggregated spending patterns across Pakistani SMEs have commercial value for:

- FMCG companies: distribution and inventory planning
- Banks and lenders: SME credit underwriting
- Government and policy bodies: economic data and informal-sector mapping

**Long-Term — Embedded Lending**

Hisaab holds verified transaction history that banks cannot independently access. A working-capital lending product underwritten by Hisaab bookkeeping records — for businesses that have never qualified for formal credit — is the highest-value extension and the product's genuine long-term moat.

### 12.2 Unit Economics (Illustrative — 18-Month Target)

| Metric | Value |
|--------|-------|
| Target paying subscribers | 50,000 |
| Average revenue per user (Basic tier) | Rs 299/month |
| Monthly subscription revenue | Rs 14.95M |
| AI API cost (~Rs 2/scan × 5 scans/user/month) | ~Rs 500,000 |
| Hosting and infra | ~Rs 150,000 |
| Gross margin | ~96% |

---

## 13. Success Metrics

### 13.1 Hackathon Demo (Day 2 — June 9, 2026)

| Metric | Target |
|--------|--------|
| Dashboard load time with pre-populated data | < 3 seconds |
| AI receipt scan to ledger entry | < 10 seconds |
| Dashboard totals update after new scan | < 1 second |
| Zero crashes or broken states during 5-minute demo | ✓ |
| Tax summary renders correctly | ✓ |
| Manual entry fallback works without AI | ✓ |

### 13.2 Post-Launch — 3-Month Targets

| Metric | Target |
|--------|--------|
| Monthly Active Users | 1,000 |
| Free-to-paid conversion rate | 15% |
| Receipts scanned per active user per month | 8+ |
| Monthly churn rate | < 8% |
| AI extraction accuracy (correct total amount) | > 92% |
| Net Promoter Score | > 50 |

### 13.3 12-Month Business Targets

| Metric | Target |
|--------|--------|
| Paying subscribers | 10,000 |
| Monthly recurring revenue | Rs 3M+ |
| B2B white-label partnerships | 3 |
| Active cities | 5 (Karachi, Lahore, Islamabad, Peshawar, Quetta) |

---

## 14. Product Roadmap

### Phase 1 — Hackathon MVP (Day 1, June 8, 2026)

- Receipt image upload + Gemini Vision AI extraction
- Pre-populated demo dashboard (Rehman General Store, May 2026)
- Live ledger with income/expense categorization and color coding
- Live P&L dashboard with four summary cards and category bar chart
- FBR monthly tax summary tab
- Manual entry fallback form

### Phase 2 — Post-Hackathon MVP (Month 1–2)

- User authentication via email or phone number (OTP)
- Persistent cloud database via Supabase
- PDF export of full ledger and tax summary
- Basic onboarding flow for new users
- Mobile-responsive UI refinements
- Error monitoring and logging

### Phase 3 — Growth (Month 3–6)

- WhatsApp bot integration: forward a receipt photo to a WhatsApp number → auto-logged in Hisaab
- Bank SMS parsing: auto-detect income and expenses from bank credit/debit alerts
- Multi-month historical view and profit trend charts
- Urdu-language UI toggle
- Freemium paywall and subscription billing (JazzCash, Easypaisa, card)
- Basic analytics dashboard for business owners

### Phase 4 — Scale (Month 6–12)

- Bank statement PDF import and auto-parsing
- FBR e-filing integration (IRIS API when available)
- B2B white-label partner portal
- Working capital lending pilot with a microfinance partner
- Multi-user roles: owner + accountant access
- API access tier for accountants managing multiple businesses

---

## 15. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Gemini misreads handwriting and extracts wrong amount | High | Medium | Pre-review card — user always confirms before committing. "Unclear" flag prevents wrong guesses |
| Gemini API is unavailable during the demo | Low | High | Pre-populated demo data means dashboard is fully functional without any live scan. Manual entry as second fallback |
| Users distrust AI with financial data | Medium | High | No data stored at MVP. Explicit in-app messaging: "Your receipt is processed instantly and never stored" |
| FBR tax rules or categories change | Low | Medium | Summary uses generic category groupings, not locked to a specific FBR form number — adaptable without code changes |
| Competitor launches a similar product first | Medium | Medium | First-mover data advantage and local brand equity. SME trust is relationship-based and builds slowly — hard to replicate fast |
| Low willingness to pay among target users | Medium | High | Generous free tier lowers the adoption barrier. Tax-season pain is the strongest conversion trigger. Partner channel subsidizes access for microfinance clients |
| AI extraction accuracy disappoints judges in live demo | Medium | High | Test with all three receipt photos the night before. Have backup screenshots of successful extractions ready. Never start the demo from a blank dashboard |

---

## 16. Appendix

### A — Sample AI Extraction Response

```json
{
  "transaction_type": "expense",
  "vendor_name": "Habib Flour Mills",
  "date": "2026-05-01",
  "items": [
    {
      "description": "Atta 50kg bag",
      "quantity": 3,
      "unit_price": 3800,
      "total": 11400
    },
    {
      "description": "Delivery charge",
      "quantity": null,
      "unit_price": null,
      "total": 200
    }
  ],
  "subtotal": 11600,
  "tax_amount": null,
  "total_amount": 11600,
  "currency": "PKR",
  "category": "Inventory",
  "notes": "Paid in cash. Receipt stamp dated 1 May 2026."
}
```

### B — Pre-Loaded Demo Dataset

**Business:** Rehman General Store, Karachi | **Demo Month:** May 2026

| Date | Type | Vendor | Category | Amount (PKR) |
|------|------|--------|----------|-------------|
| 01 May | Expense | Habib Flour Mills | Inventory | 15,000 |
| 02 May | Expense | National Foods — Sugar | Inventory | 8,500 |
| 03 May | Expense | KESC Electricity | Utilities | 3,200 |
| 05 May | Expense | Punjab Ghee Mills | Inventory | 12,000 |
| 07 May | Expense | SSGC Gas | Utilities | 1,800 |
| 08 May | Expense | Al-Barkat Rice | Inventory | 9,000 |
| 10 May | Expense | Rehman Plastics — Bags | Other | 2,200 |
| 12 May | Expense | Shan Foods — Spices | Inventory | 4,500 |
| 14 May | Expense | PTCL Internet | Utilities | 1,200 |
| 15 May | Expense | Store Rent | Services | 25,000 |
| 15 May | Expense | Staff Salary | Salary | 18,000 |
| 18 May | Expense | Delivery Rickshaw | Transport | 500 |
| 20 May | Expense | Shelf Repair | Equipment | 1,500 |
| 22 May | Expense | Cleaning Supplies | Other | 600 |
| 25 May | Expense | Staff Tea & Snacks | Food | 800 |
| 07 May | Income | Weekly Sales — Week 1 | Sales | 45,000 |
| 14 May | Income | Weekly Sales — Week 2 | Sales | 52,000 |
| 21 May | Income | Weekly Sales — Week 3 | Sales | 48,000 |
| 28 May | Income | Weekly Sales — Week 4 | Sales | 51,000 |
| 15 May | Income | Fatima Catering — Bulk Order | Sales | 15,000 |
| 20 May | Income | Ramadan Special Sales | Sales | 8,500 |
| 25 May | Income | Pepsi Distributor Commission | Sales | 3,000 |

**Dashboard Totals:** Total Income Rs 222,500 | Total Expenses Rs 104,800 | Net Profit Rs 117,700

### C — Judging Rubric Alignment

| Rubric Category | Weight | How Hisaab Scores |
|----------------|--------|-------------------|
| Problem & Use Case | 30% | Real, specific, massive — 5M+ Pakistani micro-businesses with no bookkeeping solution |
| Product-Market Fit | 25% | Clear paying user, FBR tailwind, B2B white-label channel, no direct local competitor |
| Product & Usability | 25% | Live demo is instant and intuitive — snap receipt, see ledger update in real time |
| Scalability & Business Sense | 20% | Subscription model, 96% gross margin at scale, embedded lending as the long-term moat |

---

*Hisaab — Smart books for every Pakistani business*  
*Spectrum 26 — Vibe & Pitch | DHA Suffa University | June 8–9, 2026*

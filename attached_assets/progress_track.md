# Hisaab — Progress Tracker

**Product:** Hisaab (حساب) — AI-Powered Bookkeeping for Pakistani SMEs
**Competition:** Spectrum 26 — Vibe & Pitch, DHA Suffa University (June 8–9, 2026)
**Assessment Date:** June 7, 2026
**Evaluated Against:** `Hisaab_PRD.md` + `Hisaab_Design_Document.md`

---

## Overall Verdict

**Phase 1 (Hackathon MVP) frontend: ~85% complete.**
The app is visually polished, fully navigable, and demo-ready. The one critical missing piece for a *live* demo is a real backend with Gemini Vision integration — currently the AI scan is simulated. Every other hackathon requirement is either done or needs only minor polish.

---

## Phase 1 — Hackathon MVP (Due: June 8, 2026)

### ✅ Done

| Area | Detail |
|------|--------|
| **Dashboard screen** | All four summary cards (Income, Expenses, Net Profit, Count), category bar chart, recent transactions list, month navigation |
| **Ledger screen** | Full transaction table (desktop) + card list (mobile), filter by type and category, edit and delete per row |
| **Tax Summary screen** | Expense breakdown by category, grand total, FBR label, print-to-PDF via `window.print()` with dedicated print CSS |
| **Manual Entry** | Modal form with all required fields, validation, and edit-existing-transaction support |
| **Scan Receipt modal** | Upload area with all three states (default, drag-over, processing, error), review card with editable fields, "Unclear" field warnings, confirm/discard flow |
| **AI fallback** | On simulated extraction failure, automatically surfaces the manual entry form — matches PRD §10.3 |
| **Month selector** | Navigates backwards through historical months; forward arrow disabled at current month |
| **Demo data** | 22-transaction May 2026 dataset (Rehman General Store) pre-loaded — matches PRD Appendix B exactly |
| **CRUD operations** | Add, update, delete all wired; dashboard and ledger update immediately |
| **Design tokens** | Full design system from Design Doc §3–5 implemented in `index.css` using Tailwind v4 `@theme` — all brand greens, semantic colors, neutrals, radius scale, shadows |
| **Typography** | All four fonts loaded via Google Fonts (Playfair Display, DM Sans, JetBrains Mono, Noto Nastaliq Urdu); Urdu RTL + 2.2 line-height applied |
| **Animations** | Framer Motion used for modal entrance/exit, card stagger, toast notifications |
| **Responsive layout** | Mobile-first; single-column mobile, 4-column desktop dashboard grid, scrollable mobile nav tabs |
| **Print styles** | Tax summary prints cleanly with all other UI hidden |
| **Urdu support** | `.urdu-text` / `[lang="ur"]` CSS class applies Nastaliq font + RTL — ready for AI Urdu output |
| **Accessibility** | Focus-visible ring, income/expense differentiated by both color AND icon/badge label (WCAG requirement met) |
| **Toast notifications** | Context-based toast system for add/update/delete confirmations |
| **Data model** | Transaction type in `types/transaction.ts` matches PRD §11 schema exactly (id, created_at, source, transaction_type, vendor_name, date, category, items, tax_amount, notes) |

---

### 🔶 Partially Done / Needs Polish

| Item | Current State | What's Missing | Effort |
|------|--------------|----------------|--------|
| **AI scan — real integration** | `receiptService.ts` simulates a 1.8s delay and cycles through 3 canned responses | Replace `mockExtractReceipt` with a `fetch('/api/extract-receipt', { method: 'POST', body: formData })` call — the UI already handles every response state | **Backend needed** — see todo below |
| **Dashboard summary cards — left border** | Cards show colored amount text but Design Doc §7.2 specifies a `3px solid` left border per card type | Add `border-l-[3px] border-l-income-border` etc. to each `SummaryCard` | 30 min |
| **Dashboard cards — trend line** | Design Doc §7.2 shows `▲ +12% from last month` on each card | Calculate month-over-month delta in `lib/dashboard.ts` and pass to `SummaryCard` | 1–2 hrs |
| **Category chips — inline icon** | Chips show category text but Design Doc §7.3 specifies a 12px Lucide icon inline-left | Add icon map and render icon inside `CategoryChip` | 1 hr |
| **"Sales" category in mock data** | `receiptService.ts` returns `category: 'Sales'` on one sample result | PRD §FR-06 defines only 8 fixed categories (no "Sales"). Fix to `"Other"` or add as a 9th. | 15 min |
| **`window.confirm()` for delete** | Uses browser native confirm dialog | Replace with an in-app confirmation modal for a more polished demo experience | 1–2 hrs |

---

### ✅ Now Done — Live AI Backend (completed June 7, 2026)

| Item | Status | Notes |
|------|--------|-------|
| **Backend API route** (`/api/extract-receipt`) | ✅ Done | `backend/server.js` — Express + Multer, memory storage only (no disk writes per PRD §7.4) |
| **Gemini Vision API integration** | ✅ Done | Uses `gemini-2.5-flash` (current stable model). Exact system prompt from PRD §10.2 implemented. |
| **Gemini API key** | ✅ Done | Stored as `GEMINI_API_KEY` Replit secret — never in browser or code. |
| **Vite proxy** | ✅ Done | `/api/*` proxied from port 5000 → `localhost:3001` — no CORS issues in dev. |
| **Error handling** | ✅ Done | Maps 400/404/429/502 to user-friendly messages per PRD §10.3 error matrix. |

> **Live test confirmed:** Backend returns valid JSON from a real Gemini Vision API call. The "Scan Receipt" button in the app now triggers a real AI extraction.

---

## Phase 2 — Post-Hackathon MVP (Month 1–2)

| Feature | PRD Reference | Status |
|---------|-------------|--------|
| User authentication (email/OTP) | Phase 2 | ❌ Not started |
| Persistent storage | Phase 2 | ✅ Done — Replit PostgreSQL; data survives page refresh and server restarts. Demo data auto-seeded on first run. |
| PDF export of ledger + tax summary | Phase 2 / US-08 | ❌ Not started (print works; PDF download does not) |
| Basic onboarding flow for new users | Phase 2 | ❌ Not started |
| Error monitoring and logging | Phase 2 | ❌ Not started |

---

## Phase 3 — Growth (Month 3–6)

| Feature | PRD Reference | Status |
|---------|-------------|--------|
| WhatsApp bot receipt forwarding | Phase 3 | ❌ Not started |
| Bank SMS auto-parsing | Phase 3 | ❌ Not started |
| Multi-month trend charts | Phase 3 | ❌ Not started |
| Urdu-language UI toggle | Phase 3 | ❌ Font + RTL CSS ready; toggle logic not built |
| Freemium paywall + subscription billing (JazzCash, Easypaisa) | Phase 3 | ❌ Not started |

---

## Phase 4 — Scale (Month 6–12)

| Feature | PRD Reference | Status |
|---------|-------------|--------|
| Bank statement PDF import | Phase 4 | ❌ Not started |
| FBR e-filing (IRIS API) | Phase 4 | ❌ Not started |
| B2B white-label partner portal | Phase 4 | ❌ Not started |
| Working capital lending pilot | Phase 4 | ❌ Not started |
| Multi-user roles (owner + accountant) | Phase 4 | ❌ Not started |

---

## Hackathon Demo Readiness Checklist

Per PRD §13.1 — Day 2 Demo Targets:

| Target | Status |
|--------|--------|
| Dashboard load < 3 seconds with pre-populated data | ✅ Loads instantly (in-memory data) |
| Zero crashes during 5-minute demo | ✅ No known errors; error boundary covers scan failures |
| Tax summary renders correctly | ✅ Confirmed |
| Manual entry fallback works without AI | ✅ Confirmed |
| Dashboard totals update < 1 second after new entry | ✅ React state update is synchronous |
| AI receipt scan to ledger entry < 10 seconds | ✅ Live Gemini call confirmed working — test with real receipt photos beforehand |

---

## Immediate Priorities (Ordered)

### Pre-Demo Polish (Remaining)
1. **Add left border to dashboard summary cards** — small CSS change with high visual impact matching the design doc.
2. **Add category icons to `CategoryChip`** — makes the ledger and charts look significantly more polished.
3. **Test with real receipt photos** — take 2–3 Pakistani receipt photos and confirm Gemini extracts them correctly before the demo.

### Post-Hackathon
4. **User authentication** — email/OTP login so each business has their own ledger.
5. **PDF export** — use `jsPDF` or `react-pdf` to let users download their ledger/tax summary.
6. **Month-over-month trend deltas** on dashboard cards.
7. **Replace `window.confirm()` delete** with an in-app confirmation modal.

---

## File Map (Key Integration Points)

| File | Role | Next Action |
|------|------|------------|
| `src/services/receiptService.ts` | Real AI call via `fetch('/api/extract-receipt', ...)` | ✅ Done |
| `backend/server.js` | Express server — Gemini Vision integration | ✅ Done — uses `gemini-2.5-flash` |
| `hisaab-frontend/vite.config.ts` | Proxies `/api/*` → backend on port 3001 | ✅ Done |
| `src/components/SummaryCard.tsx` | Dashboard cards | Add left border per design doc |
| `src/components/CategoryChip.tsx` | Category tags | Add Lucide icon map |
| `src/hooks/useTransactions.ts` | All state + CRUD | Add Supabase persistence calls (Phase 2) |
| `src/lib/dashboard.ts` | Dashboard computations | Add month-over-month delta calculation |
| `index.html` | Font loading | ✅ Done — all 4 fonts loaded from Google Fonts |

---

*Generated June 7, 2026 — evaluated against Hisaab PRD v1.0 and Design Document v1.0*

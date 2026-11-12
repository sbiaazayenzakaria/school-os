# SchoolOS — Design System & UI/UX Guidelines (STAGE 0)
## European Education Management Platform Interface Standards

**Document Version:** 3.1.0  
**Target Market:** European Educational Institutions (Primary & Secondary)  
**Accessibility Benchmark:** WCAG 2.2 Level AA  
**Status:** Approved in Principle — Final Review Adjustments Applied  
**Role:** Senior Software Architect, Education Technology Product Architect, UI/UX Designer & Technical Lead  

---

## 1. Design Philosophy

SchoolOS is an enterprise-grade, mission-critical Education Management Platform. It serves five distinct user personas across Primary and Secondary schools: **Administrators, Teachers, Support Staff, Parents, and Students**.

### Core Tenets:
1. **Persona-Adaptive Information Density:**  
   - Administrators and Bursars require high-density data tables, filtering arrays, and bulk actions.
   - Teachers require rapid-entry touchpoints (1-click morning attendance, spreadsheet gradebooks with arrow-key navigation).
   - Parents and Students require a welcoming, low-friction, mobile-optimized experience.
2. **Linguistic Elasticity:**  
   UI containers are built to flex gracefully across English, French, and German. German terminology (*Schülerverwaltung*, *Leistungsbeurteilung*) expands by 20% to 35% compared to English; layouts must never break, truncate unpredictably, or overflow.
3. **Primary & Secondary Workflow Flexibility:**  
   Components cleanly render homeroom-based generalist workflows with developmental competency rubrics (Primary) and period/subject-based specialist matrices with multi-scale grading (Secondary).
4. **Subtle Elevation & Border-First Structure:**  
   Visual hierarchy is articulated through crisp 1px borders (`slate-200`), clean typography, and subtle ambient shadows (`shadow-sm`, `shadow-md`), avoiding muddy drop shadows or distracting ornamental gradients.
5. **Universal Accessibility (WCAG 2.2 AA):**  
   Every interactive element provides visible focus rings, compliant contrast ratios ($\ge 4.5:1$ for body text), semantic HTML, and full keyboard operability.

---

## 2. Design Tokens & Styling Architecture

Built on **Tailwind CSS**, configured with semantic CSS variables and design tokens.

### 2.1 Color Palette

| Token Category | Tailwind Value | Hex Reference | Application in SchoolOS |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | `indigo-600` | `#4F46E5` | Primary buttons, active navigation, brand accents |
| **Primary Hover** | `indigo-700` | `#4338CA` | Hover state for primary interactive elements |
| **Primary Subdued** | `indigo-50` | `#EEF2FF` | Active background highlight, selected table rows |
| **Surface Base** | `white` | `#FFFFFF` | Card surfaces, modal surfaces, table body |
| **Surface Canvas** | `slate-50` | `#F8FAFC` | Main application shell background |
| **Border Neutral** | `slate-200` | `#E2E8F0` | Dividers, card outlines, table borders, inputs |
| **Border Focus** | `indigo-500` | `#6366F1` | Focus ring on accessible inputs and buttons |
| **Text Primary** | `slate-900` | `#0F172A` | Page headers, main metrics, primary titles |
| **Text Secondary** | `slate-600` | `#475569` | Body text, table cell content, input labels |
| **Text Muted** | `slate-400` | `#94A3B8` | Placeholder text, timestamps, secondary hints |
| **Success** | `emerald-600` | `#059669` | Present attendance, paid fees, French 16–20, German 1.0–1.5, *Exceeding* |
| **Success Subdued** | `emerald-50` | `#ECFDF5` | Success badge background, positive metric tiles |
| **Teal / Proficient** | `teal-600` | `#0D9488` | German 1.6–2.5 (*Gut*), French 14–15.9 (*Bien*), *Secure / Acquis* |
| **Warning** | `amber-600` | `#D97706` | Late attendance, pending invoice, German 3.6–4.0, *Developing* |
| **Warning Subdued** | `amber-50` | `#FFFBEB` | Warning badges, caution alert banners |
| **Danger / Failing** | `rose-600` | `#E11D48` | Absent (unexcused), overdue fees, failing grades, *Emerging / Non acquis* |
| **Danger Subdued** | `rose-50` | `#FFF1F2` | Error badges, destructive alert backgrounds |
| **Privacy / Protected** | `violet-700` | `#6D28D9` | GDPR special category badge (Medical/SEN, Custody alert) |
| **Privacy Subdued** | `violet-50` | `#F5F3FF` | Background for privacy badges with lock icon |
| **Legal Hold Badge** | `amber-800` | `#92400E` | Active Legal Hold warning tag on entities |
| **Legal Hold Subdued** | `amber-100` | `#FEF3C7` | Legal hold container background |

### 2.2 Typography Scale
- **Font Stack:** Modern European sans-serif hierarchy: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
- **Type Scale:**
  - `Display / Page Title:` `text-2xl` (24px / 1.5rem), `font-bold` (700), tracking tight.
  - `Section Heading / Card Title:` `text-lg` (18px / 1.125rem), `font-semibold` (600).
  - `Subheading / Modal Title:` `text-base` (16px / 1rem), `font-medium` (500).
  - `Body Text (Default):` `text-sm` (14px / 0.875rem), `font-normal` (400), line-height `leading-5`.
  - `Captions & Table Headers:` `text-xs` (12px / 0.75rem), `font-medium` (500), uppercase tracking wider.

---

## 3. Persona-Adaptive UI Patterns

### 3.1 Administrator & Staff View (High Density)
- **Navigation:** Persistent collapsible 260px Sidebar grouping 14 core modules into logical tiers (Core, Academics, Finance, System).
- **Data Tables:** Dense layout (`py-2.5 px-3.5`), multi-column sorting, sticky headers, bulk selection bar, inline action menus, and pagination controls.
- **Tenant Context Indicator:** Displays current demonstration institution (**École Démonstration Paris** or **Bavarian Demo School**) with clear campus badge.

### 3.2 Primary Assessment UI Components (Default Developmental & Narrative Model)
- **`<CompetencyBadge>`:** Renders developmental stage tags:
  - *Exceeding / Expert:* `bg-emerald-50 text-emerald-700 border-emerald-200`
  - *Secure / Acquis:* `bg-teal-50 text-teal-700 border-teal-200`
  - *Developing / En voie d'acquisition:* `bg-amber-50 text-amber-700 border-amber-200`
  - *Emerging / Non acquis:* `bg-rose-50 text-rose-700 border-rose-200`
- **Narrative Observation Card:** Component pairing student milestone progress with teacher remarks, audio/visual evidence attachments, and parent feedback indicators.

### 3.3 Secondary Assessment UI Components (Quantitative & Multi-Scale)
- **`<GradeBadge>`:** Color-coded according to the active scale:
  - *German Scale:* `1.2` (Emerald / *Sehr gut*), `2.1` (Teal / *Gut*), `3.8` (Amber / *Ausreichend*), `5.2` (Rose / *Ungenügend*).
  - *French Scale:* `17.0/20` (Emerald / *Très Bien*), `14.5/20` (Teal / *Bien*), `11.0/20` (Amber / *Passable*), `8.5/20` (Rose / *Ajourné*).
  - *Percentage & Letter:* `92% / A` (Emerald), `78% / B` (Teal), `62% / C` (Amber), `45% / F` (Rose).

### 3.4 Legal Hold & Compliance Indicators
- **`<LegalHoldBanner>`:** Prominent warning strip displayed on pupil or financial records under an active legal hold:
  `[⚠ LEGAL HOLD ACTIVE: Automated retention and deletion suspended by Legal Counsel / DPO]`.

---

## 4. Data-Heavy Component Specifications

### 4.1 Enterprise Data Table (`DataTable`)
- **Features:** Sticky header, checkbox selection, indeterminate "Select All", ascending/descending sort indicators, zebra/hover rows, zero-data empty state, and animated skeleton loading state.

### 4.2 Timetable Matrix Grid
- **Columns:** Days of the active working week (Monday through Friday).
- **Rows:** Configured bell schedule periods.
- **Cells:** Subject title, room number tag, teacher name, and collision alert badge if overlapping.

---

## 5. System State Handling & Feedback

Every interface component implements all four fundamental states:
1. **Loading State:** Animated skeleton loaders (`animate-pulse bg-slate-200`) shaped exactly to match content.
2. **Empty State:** Centered illustration/icon, descriptive explanation, and primary call-to-action button.
3. **Error State:** Structured alert container (`bg-rose-50 border-rose-200 text-rose-800`) with actionable instructions and a "Retry" button.
4. **Success State:** Ephemeral toast notifications with optional "Undo" action and auto-dismiss timer.

---

## 6. Accessibility Standards (WCAG 2.2 AA)

- **Color Contrast:** All body text achieves a contrast ratio $\ge 4.5:1$ against its background. Large headings ($\ge 18\text{px}$ bold) achieve $\ge 3:1$.
- **Focus Rings:** High-contrast focus ring: `focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none focus-visible:ring-offset-2`.
- **Screen Reader Semantics:** Semantic HTML5 (`<main>`, `<nav>`, `<table>`), ARIA tags (`aria-expanded`, `aria-haspopup`, `aria-modal="true"`).
- **Reduced Motion:** Respects `prefers-reduced-motion: reduce`.

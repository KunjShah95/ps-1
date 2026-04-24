# Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign all 8 dashboard pages with clean slate aesthetic — Command Center 2.0 "Operational Flow" paradigm. Retain functionality, refresh visual design.

**Architecture:** Update globals.css design tokens first, then redesign each dashboard page in order. Main dashboard is priority; supporting pages follow with consistent visual language.

**Tech Stack:** Next.js 15, Tailwind CSS v4, Framer Motion, Lucide React, Iconify

---

## File Inventory

### Files to Modify

| File | Purpose |
| --- | --- |
| `src/app/globals.css` | Design tokens, refined colors, typography |
| `src/app/dashboard/page.tsx` | Main Command Center (priority) |
| `src/app/dashboard/analytics/page.tsx` | Analytics page redesign |
| `src/app/dashboard/stadium/page.tsx` | Stadium view redesign |
| `src/app/dashboard/alerts/page.tsx` | Alerts page redesign |
| `src/app/dashboard/crisis/page.tsx` | Crisis page redesign |
| `src/app/dashboard/staff/page.tsx` | Staff page redesign |
| `src/app/dashboard/vendors/page.tsx` | Vendors page redesign |
| `src/app/dashboard/settings/page.tsx` | Settings page redesign |

---

## Task 1: Design Tokens — Update globals.css

**Files:** Modify: `src/app/globals.css:1-81`

- [ ] **Step 1: Update CSS variables for refined palette**

```css
:root {
  --background: #050505;
  --foreground: #ffffff;
  --primary: #3B82F6;
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  
  /* Surface refinements */
  --surface: rgba(255, 255, 255, 0.03);
  --surface-hover: rgba(255, 255, 255, 0.06);
  --border: rgba(255, 255, 255, 0.08);
  --border-focus: rgba(59, 130, 246, 0.5);
}
```

- [ ] **Step 2: Add component utility classes**

```css
@layer utilities {
  .card {
    background: var(--surface);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border);
    border-radius: 1.5rem;
  }
  
  .card-hover {
    transition: all 0.2s ease-out;
  }
  .card-hover:hover {
    background: var(--surface-hover);
    border-color: rgba(255, 255, 255, 0.12);
  }
  
  .input {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    outline: none;
    transition: border-color 0.2s;
  }
  .input:focus {
    border-color: var(--border-focus);
  }
  
  .btn-primary {
    background: var(--primary);
    color: white;
    border-radius: 0.75rem;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    transition: all 0.2s;
  }
  .btn-primary:hover {
    background: #2563EB;
  }
  
  .btn-secondary {
    background: transparent;
    border: 1px solid var(--border);
    color: rgba(255, 255, 255, 0.7);
    border-radius: 0.75rem;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    transition: all 0.2s;
  }
  .btn-secondary:hover {
    background: var(--surface);
    border-color: rgba(255, 255, 255, 0.15);
    color: white;
  }
}
```

- [ ] **Step 3: Test build**

Run: `npm run build`
Expected: PASS with no errors

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "refactor: update design tokens for clean slate aesthetic"
```

---

## Task 2: Main Dashboard Redesign

**Files:** Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Read current implementation**

Review: `src/app/dashboard/page.tsx`

- [ ] **Step 2: Apply visual refinements**

- Replace "Neural Link" terminology → "Live"
- Reduce saturation on status colors
- Add subtle shadows to cards
- Refine zone card layout
- Add global search (cmd+K)

Key changes:
- Metrics strip at top: 4 KPI cards in horizontal row
- Zone grid: 4-col responsive
- Alerts feed: collapsible drawer from right
- Remove excessive "neural" jargon

- [ ] **Step 3: Test build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Verify dev server**

Run: `npm run dev` → Check http://localhost:3000/dashboard
Expected: Page loads, zones display, no console errors

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/page.tsx
git commit -refactor: redesign main dashboard Command Center 2.0"
```

---

## Task 3: Analytics Page Redesign

**Files:** Modify: `src/app/dashboard/analytics/page.tsx`

- [ ] **Step 1: Read current implementation**

Review: `src/app/dashboard/analytics/page.tsx`

- [ ] **Step 2: Apply visual refinements**

- Match the main dashboard aesthetic
- Time range pills at top (already present)
- Metrics cards same as main dashboard
- Chart sections with subtle borders
- Data table with refined rows

- [ ] **Step 3: Test build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Verify dev server**

Run: http://localhost:3000/dashboard/analytics
Expected: Page loads, no errors

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/analytics/page.tsx
git commit -refactor: redesign analytics page"
```

---

## Task 4: Stadium Page Redesign

**Files:** Modify: `src/app/dashboard/stadium/page.tsx`

- [ ] **Step 1: Read current implementation**

Review: `src/app/dashboard/stadium/page.tsx`

- [ ] **Step 2: Apply visual refinements**

- SVG stadium with refined zone colors
- View mode pills (heat/flow/capacity)
- Zone sidebar with selection state
- Selected zone detail panel
- Gate status panel

- [ ] **Step 3: Test build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Verify dev server**

Run: http://localhost:3000/dashboard/stadium
Expected: SVG renders, zones clickable

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/stadium/page.tsx
git commit -refactor: redesign stadium view"
```

---

## Task 5: Alerts Page Redesign

**Files:** Modify: `src/app/dashboard/alerts/page.tsx`

- [ ] **Step 1: Read current implementation**

Review: `src/app/dashboard/alerts/page.tsx`

- [ ] **Step 2: Apply visual refinements**

- Summary cards for critical/high/warning
- Filter tabs
- Alert feed with type icons and colors
- Inline acknowledge

- [ ] **Step 3: Test build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Verify dev server**

Run: http://localhost:3000/dashboard/alerts
Expected: Page loads, alerts display

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/alerts/page.tsx
git commit -refactor: redesign alerts page"
```

---

## Task 6: Crisis Page Redesign

**Files:** Modify: `src/app/dashboard/crisis/page.tsx`

- [ ] **Step 1: Read current implementation**

Review: `src/app/dashboard/crisis/page.tsx`

- [ ] **Step 2: Apply visual refinements**

- Crisis banner (when active)
- Emergency broadcast input
- Scenario trigger cards
- Quick actions

- [ ] **Step 3: Test build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Verify dev server**

Run: http://localhost:3000/dashboard/crisis
Expected: Page loads, scenarios display

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/crisis/page.tsx
git commit -refactor: redesign crisis page"
```

---

## Task 7: Staff Page Redesign

**Files:** Modify: `src/app/dashboard/staff/page.tsx`

- [ ] **Step 1: Read current implementation**

Review: `src/app/dashboard/staff/page.tsx`

- [ ] **Step 2: Apply visual refinements**

- Personnel stats cards
- Search + role filter
- Staff table with status badges

- [ ] **Step 3: Test build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Verify dev server**

Run: http://localhost:3000/dashboard/staff
Expected: Page loads, staff list displays

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/staff/page.tsx
git commit -refactor: redesign staff page"
```

---

## Task 8: Vendors Page Redesign

**Files:** Modify: `src/app/dashboard/vendors/page.tsx`

- [ ] **Step 1: Read current implementation**

Review: `src/app/dashboard/vendors/page.tsx`

- [ ] **Step 2: Apply visual refinements**

- Vendor stats cards
- Search + type filter
- Vendor cards grid

- [ ] **Step 3: Test build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Verify dev server**

Run: http://localhost:3000/dashboard/vendors
Expected: Page loads, vendors display

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/vendors/page.tsx
git commit -refactor: redesign vendors page"
```

---

## Task 9: Settings Page Redesign

**Files:** Modify: `src/app/dashboard/settings/page.tsx`

- [ ] **Step 1: Read current implementation**

Review: `src/app/dashboard/settings/page.tsx`

- [ ] **Step 2: Apply visual refinements**

- Sidebar tabs styling
- Form sections with cards
- Toggle switches matching new aesthetic
- Save button with confirmation

- [ ] **Step 3: Test build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Verify dev server**

Run: http://localhost:3000/dashboard/settings
Expected: Page loads, tabs work

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/settings/page.tsx
git commit -refactor: redesign settings page"
```

---

## Execution Choice

**Plan complete and saved to `docs/superpowers/plans/2026-04-24-dashboard-redesign.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
# Dashboard Redesign Specification

**Project:** SmartFlow AI — Command Center 2.0  
**Date:** 2026-04-24  
**Status:** Design Approved — Ready for Implementation

---

## 1. Overview

Redesign all dashboard pages with a clean slate aesthetic using Command Center 2.0 "Operational Flow" paradigm. Retain all existing pages and functionality; refresh visual design only.

**Design Philosophy:** Clean, grounded, professional. No sci-fi "neural" jargon. Airport control tower aesthetic — serious and operational.

---

## 2. Layout Structure

### Main Dashboard (Home)

```
┌─────────────────────────────────────────────────────────────────┐
│ [Nav Sidebar]  │  [Metrics Strip]     Live Census • Alerts Ticker│
│   240px     │                                          [Bell] │
│             ├───────────────────────────────────────────────┤
│  Dashboard  │                                               │
│  Analytics │  [Hero: Zone Grid]                            │
│  Stadium   │    4-col responsive                          │
│  Alerts   │    Each card: status, %, quick stats           │
│  Crisis   │                                               │
│  Staff    ├───────────────────────────────────────────────┤
│  Vendors  │  [Alerts Feed] ← Expandable drawer          │
│  Settings │  (bottom or right, collapsible)             │
└─────────────────────────────────────────────────────────────────┘
```

### Supporting Pages

- **Analytics** — Time range selector, metrics cards, charts, data table
- **Stadium** — SVG heatmap view with zone sidebar
- **Alerts** — Filter tabs, alert feed, summary cards
- **Crisis** — Emergency broadcast, scenario triggers, quick actions
- **Staff** — Roster table, status filters
- **Vendors** — Vendor grid, status filters
- **Settings** — Tabbed config panels

---

## 3. Visual Language

### Color Palette (Refined)

| Token | Value | Usage |
| --- | --- | --- |
| Background | `#050505` / `#0A0A0A` | Page backgrounds |
| Surface | `rgba(255,255,255,0.03)` | Cards, panels |
| Border | `rgba(255,255,255,0.08)` | Card borders |
| Primary | `#3B82F6` (blue-500) | CTAs, active nav |
| Success | `#10B981` (emerald-500) | Low status |
| Warning | `#F59E0B` (amber-500) | High status |
| Danger | `#EF4444` (red-500) | Critical status |

### Typography

- **Headings:** Outfit (variable weights)
- **Body:** Inter
- **Mono:** System mono for metrics

### Components

| Component | Design |
| --- | --- |
| Zone Card | Rounded-2xl, subtle shadow, status border glow, click-to-expand |
| Metric Card | Icon + label + large value + trend badge |
| Alert Item | Type icon + message + timestamp + acknowledge button |
| Button Primary | Blue-500, rounded-xl, hover state |
| Button Secondary | Ghost/outline, rounded-xl |
| Input | Dark surface, light border, focus ring |

### Motion

- **Entrance:** Fade + subtle slide up (150ms)
- **Hover:** Scale 1.02 on cards, color shift on buttons
- **Transitions:** 200ms ease-out

---

## 4. Page Specifications

### 4.1 Dashboard (Main)

**Metrics Strip (Top)**
- 4 KPI cards: Live Census, Avg Wait Time, Critical Zones, Flow Rate
- Each clickable to filter zones by that metric

**Hero: Zone Grid**
- Responsive: 1 col (mobile) → 2 col (tablet) → 4 col (desktop)
- Each zone shows: name, occupancy/capacity, percentage, status badge, mini progress bar
- Click expands detail drawer with full zone stats

**Alerts Feed**
- Collapsible panel showing recent critical alerts
- Inline acknowledge button

### 4.2 Analytics

- Time range pills: 1h / 6h / 24h / 7d
- Metrics cards (same structure as dashboard)
- Zone saturation chart
- AI predictions panel
- Full data table with sorting

### 4.3 Stadium

- SVG stadium map with zone overlays
- Heat / Flow / Capacity view modes
- Zone list sidebar
- Selected zone detail panel
- Gate status panel

### 4.4 Alerts

- Summary cards: Critical / High / Warning counts
- Filter tabs
- Alert feed with type icons
- Actions: Acknowledge / Escalate / Resolve

### 4.5 Crisis

- Crisis banner (when active)
- Emergency broadcast input
- Scenario trigger buttons
- Quick action buttons

### 4.6 Staff

- Stats: Total / Active / Break / Off
- Search + filter by role
- Staff roster table

### 4.7 Vendors

- Stats: Total / Active / Busy / Revenue
- Search + filter by type
- Vendor cards grid

### 4.8 Settings

- Sidebar tabs: General / Notifications / Security / Zones / Integrations
- Form sections with toggle switches
- Save button with confirmation

---

## 5. Implementation Notes

- Retain all Firebase / data hooks (`useSimulation`)
- Use existing `ZoneData` interface
- Preserve authentication flow
- Keep API routes unchanged

---

## 6. Acceptance Criteria

- [ ] All 8 dashboard pages load without error
- [ ] Zone data displays correctly
- [ ] Critical alerts appear prominently
- [ ] Navigation between pages works
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors
- [ ] Design matches spec visual language
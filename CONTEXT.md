# SmartFlow AI – Project Context

## Project Identity

**Name:** SmartFlow AI  
**Tagline:** Real-Time Crowd Intelligence Platform  
**Stack:** Next.js 15 App Router · TypeScript · Tailwind CSS v4 · Firebase (Auth + Firestore) · Framer Motion · Lucide React · Iconify  
**Status:** Active Development — MVP Phase  
**Dev Server:** http://localhost:3000  

---

## Directory Structure

```
c:\ps 1\
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout (Inter + Outfit fonts, dark bg)
│   │   ├── globals.css              # Design tokens, Tailwind @theme, glass utility
│   │   ├── page.tsx                 # ✅ Landing / Home page
│   │   ├── SimulationEngine.ts      # useSimulation() hook — Firestore live listener
│   │   ├── dashboard/
│   │   │   └── page.tsx             # ✅ Main command-center dashboard (protected)
│   │   ├── platform/
│   │   │   └── page.tsx             # ✅ Platform overview page
│   │   ├── solutions/
│   │   │   └── page.tsx             # ✅ Solutions / use-cases page
│   │   ├── case-studies/
│   │   │   └── page.tsx             # ✅ Case studies page
│   │   ├── security/
│   │   │   └── page.tsx             # ✅ Security & compliance page
│   │   ├── auth/
│   │   │   ├── login/page.tsx       # ✅ Login page (email + Google OAuth)
│   │   │   └── register/page.tsx    # ✅ Request Access / Register page
│   │   └── api/
│   │       ├── zones/route.ts       # GET zones data
│   │       ├── auth/route.ts        # Auth token validation
│   │       └── admin/route.ts       # Admin-only routes
│   ├── lib/
│   │   ├── firebase.ts              # Firebase app init (auth, db)
│   │   ├── types.ts                 # Zone, Alert, Recommendation interfaces + ZONES[]
│   │   ├── ai-engine.ts             # AI recommendation logic
│   │   ├── data-engine.ts           # Data processing utilities
│   │   └── auth/                    # Auth helpers
│   └── middleware.ts                # API auth guard (bearer token check)
├── public/                          # Static assets
├── design.md                        # Full design specification
├── CONTEXT.md                       # This file — project context
├── firebase.json                    # Firebase hosting config
├── firestore.rules                  # Firestore security rules
└── firestore.indexes.json           # Composite indexes (created_at, acknowledged)
```

---

## Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#050505` / `#000000` | Page backgrounds |
| Surface | `rgba(255,255,255,0.05)` | Cards, panels |
| Border | `rgba(255,255,255,0.10)` | Card borders |
| Primary | `#2563EB` (blue-600) | CTAs, active nav, links |
| Accent Purple | `#7C3AED` | Gradient accents |
| Emerald | `#10B981` | Success / low-density |
| Amber | `#F59E0B` | Warning / high-density |
| Red | `#EF4444` | Critical / danger |

### Typography
- **Headings:** `Outfit` (variable: `--font-outfit`)
- **Body:** `Inter` (variable: `--font-inter`)
- **Monospace:** System mono (metrics, data values)

### Key Utilities (globals.css)
- `.glass` — glassmorphic card: `bg-white/3 backdrop-blur-md border border-white/10`
- `.text-glow` — blue glow: `text-shadow: 0 0 20px rgba(59,130,246,0.5)`
- `.animate-slow-fade` — fade-in-up animation 2s

---

## Core Data Model

### Zone
```ts
interface ZoneData {
  id: string;           // e.g. 'gate-a'
  name: string;         // e.g. 'Gate A (Main)'
  count: number;        // current people
  capacity: number;     // max capacity
  percentage: number;   // count/capacity * 100
  waitTime: number;     // minutes, capped at 30
  status: 'low' | 'medium' | 'high' | 'critical';
}
```

### Status Thresholds
| Status | Percentage | Color |
|--------|-----------|-------|
| `critical` | ≥ 85% | Red |
| `high` | ≥ 60% | Amber |
| `medium` | ≥ 30% | Blue |
| `low` | < 30% | Emerald |

### Predefined Zones (ZONES[])
| ID | Name | Capacity | Service Rate |
|----|------|----------|-------------|
| `gate-a` | Gate A (Main) | 5,000 | 150/min |
| `gate-b` | Gate B (North) | 3,000 | 100/min |
| `food-court` | Food Court Central | 2,000 | 80/min |
| `south-stand` | South Stand | 15,000 | 500/min |
| `north-stand` | North Stand | 12,000 | 400/min |

---

## useSimulation() Hook

**File:** `src/app/SimulationEngine.ts`  
**Returns:** `{ zones, recommendation, alerts, insights, isLive, setIsLive }`

- Subscribes to Firestore `zones` collection via `onSnapshot`
- Subscribes to `alerts` collection (unacknowledged, newest 5)
- Auto-computes: `percentage`, `status`, `waitTime`
- Generates AI recommendation from least-loaded zone
- Computes `insights`: totalPeople, averageWaitTime, criticalZones, throughputRate

---

## Firebase Setup

**Project ID:** `smartflow-ai`  
**Auth:** Email/Password + Google OAuth  
**Firestore Collections:**
- `zones` — real-time crowd data per zone
- `alerts` — incident alerts with `acknowledged` flag and `created_at` timestamp

**Firestore Indexes (firestore.indexes.json):**
- `alerts`: composite on `acknowledged ASC + created_at DESC`

---

## Page Map

| Route | File | Auth Required | Description |
|-------|------|--------------|-------------|
| `/` | `src/app/page.tsx` | No | Marketing landing page |
| `/platform` | `src/app/platform/page.tsx` | No | Platform features overview |
| `/solutions` | `src/app/solutions/page.tsx` | No | Use case solutions |
| `/case-studies` | `src/app/case-studies/page.tsx` | No | Customer success stories |
| `/security` | `src/app/security/page.tsx` | No | Security & compliance |
| `/auth/login` | `src/app/auth/login/page.tsx` | No | Sign in page |
| `/auth/register` | `src/app/auth/register/page.tsx` | No | Request access / sign up |
| `/dashboard` | `src/app/dashboard/page.tsx` | Yes | Real-time command center |

---

## API Routes

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/zones` | GET | Bearer token | Live zone data |
| `/api/auth` | POST | Public | Token validation |
| `/api/admin` | * | Bearer token | Admin operations |

**Middleware** (`src/middleware.ts`):
- Guards all `/api/*` routes
- Passes `Authorization: Bearer <token>` header to downstream
- Admin routes return 401 if no token

---

## Navigation Structure (Public)

```
SmartFlow AI [Logo]
  ├── Platform
  ├── Solutions
  ├── Case Studies
  └── Security
[Sign In] [Get Started →]
```

---

## Key Design Patterns

1. **Glassmorphism cards** — `bg-white/5 border border-white/10 rounded-2xl`
2. **Gradient blobs (ambient)** — `bg-blue-600/10 blur-[120px] pointer-events-none` (decorative only)
3. **Status badges** — pill with colored bg/text (e.g. `bg-red-500/10 text-red-400`)
4. **Framer Motion** — used for capacity bars (`initial={{ width: 0 }} animate={{ width: ... }}`)
5. **Iconify** — `@iconify/react` for extended icon set (mdi:robot-excited, mdi:auto-fix etc.)

---

## Development Commands

```bash
npm run dev          # Start dev server on :3000
npm run build        # Production build
npm run lint         # ESLint check
```

---

## Known Issues / Notes

- Firebase config uses **placeholder keys** (`AIzaSyD-fake-key`) — real keys must be added to `.env.local`
- `app/` directory at root is empty (dead folder — ignore)
- `lib/` directory at root mirrors `src/lib/` (dead folder — ignore)
- Dashboard has hardcoded `ProgressCircle` data — should pull from `zones`
- No `page.tsx` at root currently — landing page needs to be created

# SmartFlow AI

Real-Time Crowd Intelligence Platform for large-scale venues.

---

## Overview

SmartFlow AI monitors crowd density in stadiums, transit hubs, and event venues—providing real-time analytics, wait time predictions, and AI-powered recommendations to optimize visitor flow and enhance safety.

### Key Capabilities

- **Live Crowd Heatmaps**: Visual zone status with color-coded density indicators
- **Wait Time Prediction**: Estimated queue times based on current count and service rate
- **AI Recommendations**: Smart routing suggestions to least-crowded areas
- **Real-Time Alerts**: Instant notifications for critical capacity situations
- **Historical Analytics**: Trend tracking and throughput analysis

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | Firebase Auth (Email + Google OAuth) |
| Database | Firebase Firestore |
| Animation | Framer Motion |
| Icons | Lucide React, Iconify React |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Auth and Firestore enabled
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/smartflow-ai.git
cd smartflow-ai

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Create `.env.local` with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with fonts and providers
│   ├── page.tsx           # Landing page
│   ├── SimulationEngine.ts  # useSimulation() React hook
│   ├── dashboard/          # Protected dashboard pages
│   │   ├── page.tsx       # Command center
│   │   ├── analytics/
│   │   ├── alerts/
│   │   ├── crisis/
│   │   ├── staff/
│   │   └── vendors/
│   ├── platform/          # Platform features page
│   ├── solutions/         # Use cases page
│   ├── case-studies/       # Customer stories
│   ├── security/         # Security & compliance
│   ├── auth/            # Authentication pages
│   │   ├── login/
│   │   └── register/
│   └── api/             # API routes
│       ├── zones/
│       ├── alerts/
│       ├── analytics/
│       └── ...
├── lib/                  # Core libraries
│   ├── firebase.ts       # Firebase client init
│   ├── firebase-admin.ts  # Firebase Admin SDK
│   ├── types.ts          # TypeScript interfaces
│   ├── ai-engine.ts      # AI recommendation logic
│   ├── data-engine.ts    # Data processing utilities
│   └── simulation-service.ts
├── components/           # Reusable React components
│   ├── dashboard/        # Dashboard components
│   └── command-center/
└── middleware.ts         # API auth guard
```

---

## Pages

| Route | Description | Auth Required |
|-------|-------------|--------------|
| `/` | Landing page | No |
| `/platform` | Platform features | No |
| `/solutions` | Use cases | No |
| `/case-studies` | Customer success | No |
| `/security` | Security & compliance | No |
| `/auth/login` | Sign in | No |
| `/auth/register` | Request access | No |
| `/dashboard` | Command center | Yes |
| `/dashboard/analytics` | Analytics | Yes |
| `/dashboard/alerts` | Alert management | Yes |
| `/dashboard/staff` | Staff management | Yes |
| `/dashboard/vendors` | Vendor management | Yes |
| `/dashboard/crisis` | Crisis response | Yes |
| `/dashboard/settings` | Settings | Yes |

---

## Data Models

### Zone

```typescript
interface Zone {
  id: string;           // e.g. 'gate-a'
  name: string;         // e.g. 'Gate A (North)'
  capacity: number;     // max capacity
  serviceRate: number;  // people/min throughput
  location: { x: number; y: number; };
}
```

### ZoneData

```typescript
interface ZoneData {
  id: string;
  name: string;
  count: number;        // current people
  capacity: number;
  percentage: number;  // count/capacity * 100
  waitTime: number;    // minutes (capped at 30)
  status: 'low' | 'medium' | 'high' | 'critical';
}
```

### Status Thresholds

| Status | Percentage | Color |
|--------|-----------|-------|
| `critical` | ≥ 85% | Red (#EF4444) |
| `high` | ≥ 60% | Amber (#F59E0B) |
| `medium` | ≥ 30% | Blue (#2563EB) |
| `low` | < 30% | Emerald (#10B981) |

### Predefined Zones

| ID | Name | Capacity | Service Rate |
|----|------|----------|-------------|
| `gate-a` | Gate A (North) | 5,000 | 150/min |
| `gate-b` | Gate B (South) | 3,000 | 100/min |
| `gate-c` | Gate C (West) | 4,000 | 120/min |
| `gate-d` | Gate D (East) | 4,000 | 120/min |
| `north-stand` | North Stand | 12,000 | 400/min |
| `south-stand` | South Stand | 15,000 | 500/min |
| `east-stand` | East Stand | 10,000 | 350/min |
| `west-stand` | West Stand | 10,000 | 350/min |
| `pitch` | Pitch / Field | 0 | 0 |

---

## API Endpoints

### Public Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/auth` | POST | Token validation |

### Protected Routes (Require Bearer Token)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/zones` | GET | Get all zone data |
| `/api/zones` | POST | Update zone data |
| `/api/alerts` | GET | Get alerts |
| `/api/alerts` | POST | Create alert |
| `/api/analytics` | GET | Get analytics |
| `/api/simulation` | POST | Trigger simulation |

### Admin Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin` | * | Admin operations |

---

## Firestore Collections

### `zones`

Real-time crowd data per zone.

```typescript
{
  id: string;
  name: string;
  count: number;
  updated_at: Timestamp;
}
```

### `alerts`

Incident alerts.

```typescript
{
  id: string;
  zoneId: string;
  zoneName: string;
  type: 'critical' | 'high' | 'warning';
  message: string;
  acknowledged: boolean;
  created_at: Timestamp;
}
```

### `settings`

User and system settings.

---

## Core Features

### useSimulation() Hook

Located in `src/app/SimulationEngine.ts`, this hook provides:

- **`zones`**: Live zone data from Firestore
- **`recommendation`**: AI-generated routing suggestion
- **`alerts`**: Active unacknowledged alerts (newest 5)
- **`insights`**: Aggregated metrics (totalPeople, avgWaitTime, criticalCount, throughput)
- **`isLive`**: Connection status
- **`setIsLive`**: Toggle simulation on/off

### AI Recommendation Engine

Logic (`src/lib/ai-engine.ts`):

1. Find zone with lowest utilization %
2. If tied, pick alphabetically first
3. Generate actionable suggestion

Example output:
```
"Head to Gate B (South) — only 12% capacity"
```

### Wait Time Calculation

Formula:
```
wait_time_minutes = current_people / service_rate
```

- Capped at 30 minutes
- Rounded to nearest minute

---

## Design System

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#050505` | Page backgrounds |
| Surface | `rgba(255,255,255,0.05)` | Cards, panels |
| Border | `rgba(255,255,255,0.10)` | Card borders |
| Primary | `#2563EB` | CTAs, active nav |
| Accent Purple | `#7C3AED` | Gradient accents |
| Emerald | `#10B981` | Success states |
| Amber | `#F59E0B` | Warning states |
| Red | `#EF4444` | Critical states |

### Typography

- **Headings**: Outfit (variable: `--font-outfit`)
- **Body**: Inter (variable: `--font-inter`)
- **Monospace**: System mono for metrics

### UI Patterns

- Glassmorphism cards: `.glass` class
- Status badges: Color-coded pills
- Framer Motion animations for capacity bars

---

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Firebase Hosting

```bash
firebase deploy
```

### Docker

```bash
docker build -t smartflow-ai .
docker run -p 3000:3000 smartflow-ai
```

Or use the included Docker Compose:

```bash
docker-compose up
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Security

### Firestore Rules

Located in `firestore.rules`:
- Authenticated users can read/write their own data
- Admin users have full access
- Zone data is publicly readable for display

### API Security

The middleware (`src/middleware.ts`) guards all `/api/*` routes with Bearer token authentication.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## License

MIT License - see LICENSE file for details.

---

## Links

- **Live Demo**: [smartflow-ai.web.app](https://smartflow-ai.web.app)
- **Documentation**: [docs.smartflow.ai](https://docs.smartflow.ai)
- **Support**: support@smartflow.ai
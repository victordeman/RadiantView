# RadiantView

Cloud-Native Enterprise Imaging Platform — RIS + PACS + AI in a zero-footprint web app.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)

## Features

- **RIS Dashboard** — Worklist with searchable/filterable study table, status badges, priority labels
- **Patient Management** — Patient cards with search, detail sheets, study history
- **Scheduling** — Calendar views (month/week/day/agenda) with drag-and-drop, modality color-coding
- **Orders** — Imaging order entry with patient lookup, status tracking, priority management
- **PACS Viewer** — OHIF Viewer integration via iframe with deep linking from worklist/patients
- **Reports** — Structured reporting with 6 modality-specific templates, sign workflow, comments
- **Analytics** — Dashboard with charts (studies/day, modality breakdown, turnaround time)
- **Admin Panel** — User management, system status, audit logging
- **Global Search** — Command palette (Ctrl+K) searching across patients, studies, reports, orders
- **PWA** — Installable on mobile devices with offline fallback
- **Audit Logging** — Track user actions (report signing, user management)
- **Role-Based Access** — Middleware RBAC with 4 roles (Radiologist, Clinician, Tech, Admin)
- **Toast Notifications** — User feedback for all CRUD actions
- **Guided Tours** — Interactive walkthroughs for all major features
- **Dark Theme** — Professional medical imaging aesthetic

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + shadcn/ui (Base UI) |
| Icons | Lucide React |
| Auth | NextAuth.js v5 (Credentials + Google OAuth) |
| Database | PostgreSQL via Prisma ORM |
| Charts | Recharts |
| Calendar | react-big-calendar |
| Notifications | Sonner |
| Tours | Driver.js |
| Search | cmdk (Command Menu) |

## Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **PostgreSQL** 14+ (or use [Supabase](https://supabase.com) / [Neon](https://neon.tech) managed)
- **npm** 9+ (comes with Node.js)
- **Docker** (optional — for local PostgreSQL + Orthanc)
- **Orthanc** (optional — for DICOM/PACS integration)

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/victordeman/radiantview.git
cd radiantview
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database (PostgreSQL) — Required
DATABASE_URL="postgresql://user:password@localhost:5432/radiantview"
DIRECT_URL="postgresql://user:password@localhost:5432/radiantview"

# Authentication — Required
AUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_SECRET="same-as-AUTH_SECRET"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Orthanc DICOM Server (optional)
ORTHANC_URL="http://localhost:8042"
NEXT_PUBLIC_ORTHANC_URL="http://localhost:8042"
```

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (creates all tables)
npx prisma db push

# Seed with demo data (optional — 40 patients, 100 studies, 60 appointments, 50 orders)
npm run seed
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create an account

Navigate to `/register` and create a user. The first user defaults to CLINICIAN role. To get ADMIN access, update the role directly in the database:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

Or use Prisma Studio:

```bash
npx prisma studio
```

## Local Development with Docker

For a fully local development setup with PostgreSQL and Orthanc:

```bash
# Start PostgreSQL and Orthanc containers
docker compose up -d

# Push schema and seed
npx prisma db push
npm run seed

# Start the app
npm run dev
```

When using Docker, set these values in your `.env`:

```env
DATABASE_URL="postgresql://radiantview:radiantview@localhost:5432/radiantview"
DIRECT_URL="postgresql://radiantview:radiantview@localhost:5432/radiantview"
ORTHANC_URL="http://localhost:8042"
```

### Docker Services

| Service | Port | Description |
|---|---|---|
| PostgreSQL | 5432 | Database (user: `radiantview`, password: `radiantview`, db: `radiantview`) |
| Orthanc | 8042 (HTTP), 4242 (DICOM) | PACS server with DICOMweb enabled |

### Orthanc Web Interface

Once running, access the Orthanc Explorer at [http://localhost:8042](http://localhost:8042) to upload DICOM files and manage studies.

## Deployment

### Vercel (Recommended)

1. **Push to GitHub** and import the repository in [Vercel](https://vercel.com)

2. **Set environment variables** in Vercel > Project > Settings > Environment Variables:

   | Variable | Required | Description |
   |---|---|---|
   | `DATABASE_URL` | Yes | PostgreSQL connection string (with PgBouncer for Supabase: port 6543, `?pgbouncer=true`) |
   | `DIRECT_URL` | Yes | Direct PostgreSQL connection (port 5432, for migrations) |
   | `AUTH_SECRET` | Yes | Random secret (`openssl rand -base64 32`) |
   | `NEXTAUTH_SECRET` | Yes | Same as AUTH_SECRET |
   | `NEXT_PUBLIC_APP_URL` | Yes | Your Vercel domain (e.g., `https://radiantview.vercel.app`) |
   | `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
   | `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
   | `ORTHANC_URL` | No | Orthanc server URL (if using PACS) |
   | `NEXT_PUBLIC_ORTHANC_URL` | No | Public Orthanc URL for client-side access |

3. **Database setup** — use a managed PostgreSQL provider:
   - [Supabase](https://supabase.com) (free tier, PgBouncer included)
   - [Neon](https://neon.tech) (free tier, serverless)
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

4. **Run migrations** against production:
   ```bash
   DATABASE_URL="your-production-url" npx prisma db push
   ```

5. **Deploy** — Vercel auto-detects Next.js and runs `prisma generate && next build`

### Supabase Database Setup

If using Supabase as your PostgreSQL provider:

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings > Database > Connection string
3. Use the **Session mode** connection string (port 5432) as `DIRECT_URL`
4. Use the **Transaction mode** connection string (port 6543, append `?pgbouncer=true`) as `DATABASE_URL`
5. Run `npx prisma db push` with the `DATABASE_URL` set

## Project Structure

```
radiantview/
├── app/
│   ├── (authenticated)/       # Protected routes (sidebar + topbar layout)
│   │   ├── admin/             # Admin panel (users, system, audit log)
│   │   ├── analytics/         # Analytics dashboard with charts
│   │   ├── dashboard/         # Worklist / home page
│   │   ├── orders/            # Imaging orders
│   │   ├── patients/          # Patient management
│   │   ├── reports/           # Reports list + editor
│   │   ├── scheduling/        # Appointment calendar
│   │   └── layout.tsx         # Authenticated layout shell
│   ├── (viewer)/              # Full-screen viewer layout
│   │   └── viewer/[studyUID]/ # OHIF Viewer page
│   ├── api/                   # API routes
│   ├── error.tsx              # Global error boundary
│   ├── not-found.tsx          # Custom 404 page
│   ├── offline/               # PWA offline fallback
│   └── layout.tsx             # Root layout
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── viewer/                # Viewer toolbar, patient header, placeholder
│   └── *.tsx                  # App-level components
├── lib/                       # Utilities, server actions, helpers
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Demo data seeder
├── public/                    # Static assets, PWA manifest, service worker
├── docker-compose.yml         # Local dev (PostgreSQL + Orthanc)
├── vercel.json                # Vercel deployment config
└── .env.example               # Environment variables template
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | No | Health check (DB + Orthanc status) |
| GET | `/api/search?q=term` | Yes | Global search across all resources |
| GET/POST | `/api/patients` | Yes | List / create patients |
| GET/PUT/DELETE | `/api/patients/[id]` | Yes | Single patient operations |
| GET/POST | `/api/studies` | Yes | List studies (DB + Orthanc fallback) |
| GET/POST | `/api/appointments` | Yes | List / create appointments |
| GET/PUT/DELETE | `/api/appointments/[id]` | Yes | Single appointment operations |
| GET/POST | `/api/orders` | Yes | List / create orders |
| GET/POST | `/api/reports` | Yes | List / create reports |
| GET/PUT/DELETE | `/api/reports/[id]` | Yes | Single report operations |
| GET/POST | `/api/reports/[id]/comments` | Yes | Report comments |
| GET | `/api/analytics` | Yes | Analytics data (30-day lookback) |
| GET/POST | `/api/users` | Admin | List / create users |
| PUT/DELETE | `/api/users/[id]` | Admin | Update / delete users |
| GET | `/api/audit` | Admin | Audit log entries |

## User Roles

| Role | Dashboard | Patients | Orders | Reports | Viewer | Analytics | Admin |
|---|---|---|---|---|---|---|---|
| RADIOLOGIST | Yes | Yes | Yes | Yes | Yes | Yes | No |
| CLINICIAN | Yes | Yes | Yes | Yes | Yes | Yes | No |
| TECH | Yes | Yes | Yes | Yes | Yes | Yes | No |
| ADMIN | Yes | Yes | Yes | Yes | Yes | Yes | Yes |

## Scripts

```bash
npm run dev       # Start development server (Turbopack)
npm run build     # Production build (prisma generate + next build)
npm run start     # Start production server
npm run lint      # Run ESLint
npm run seed      # Seed database with demo data
```

## Health Check

The `/api/health` endpoint returns system status:

```json
{
  "status": "ok",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "version": "0.1.0",
  "database": {
    "status": "connected",
    "latency": "5ms"
  },
  "orthanc": {
    "status": "not_configured"
  }
}
```

## License

Private — All rights reserved.

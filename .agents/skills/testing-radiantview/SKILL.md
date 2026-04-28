# Testing RadiantView

## Prerequisites

### Dev Server
```bash
PORT=3001 npm run dev
```
The app runs on `localhost:3001` by default.

### Database
RadiantView uses Supabase PostgreSQL. Connection strings:
- `DATABASE_URL` — PgBouncer connection (port 6543)
- `DIRECT_URL` — Direct connection (port 5432)

To push schema changes: `npx prisma db push`

### Devin Secrets Needed
- `DATABASE_URL` — Supabase PgBouncer connection string
- `DIRECT_URL` — Supabase direct connection string
- `AUTH_SECRET` / `NEXTAUTH_SECRET` — NextAuth session secret

### Test Accounts
- `viewertest@test.com` / `password123` — ADMIN role (can access /admin, audit logs)
- Other users may exist from seed data (`npm run seed`)

## Testing Patterns

### Authentication
- Login at `/login` with email/password
- The app uses NextAuth.js with credentials provider
- Browser autocomplete may interfere — click fields individually when typing credentials
- After login, you're redirected to `/dashboard`

### Role-Based Access
- ADMIN users can access `/admin` (Users, System, Audit Log tabs)
- Non-admin users are redirected away from `/admin`
- Role is stored in the `User` table and exposed via NextAuth session

### Toast Notifications
- Uses Sonner library, dark theme, positioned bottom-right
- Toasts appear on: patient creation, order creation, report save/sign, user create/delete/role update
- Toasts auto-dismiss after a few seconds — capture screenshots quickly

### Global Search
- Triggered by `Ctrl+K` keyboard shortcut or clicking the search button in the topbar
- Searches across patients, studies, reports, and orders
- Requires at least 2 characters before searching
- Results show type badges (PATIENT, STUDY, REPORT, ORDER)
- Clicking a result navigates to the corresponding page

### Audit Logging
- Audit log entries are created for: user create/update/delete, report create/update/sign/delete
- View in Admin > Audit Log tab
- Each entry shows: timestamp, user, action (color-coded badge), resource, details
- Creating and deleting a test user is the easiest way to verify audit logging works

### API Endpoints
- `/api/health` — Health check (DB + Orthanc status, latency, version)
- `/api/search?q=term` — Global search (requires auth)
- `/api/audit?limit=50&offset=0` — Audit logs (admin only)
- `/manifest.json` — PWA manifest (static file)

### Error Pages
- Navigate to any non-existent route (e.g., `/nonexistent`) to see custom 404 page
- 404 page shows large "404" text, "Page Not Found", and navigation buttons
- Error boundary (`app/error.tsx`) catches runtime errors with "Try Again" button

### PWA
- Manifest at `/manifest.json` — check for valid JSON with name, icons, display mode
- Service worker at `/sw.js` — network-first caching, skips `/api/` routes
- PWA icons are programmatically generated teal rectangles (not a real logo)

## Common Issues
- **Login autocomplete**: Browser may merge email/password fields. Click each field individually before typing.
- **Toast timing**: Toasts auto-dismiss quickly. Take screenshots immediately after the action.
- **Prisma schema changes**: After modifying `prisma/schema.prisma`, run `npx prisma db push` to sync with Supabase.
- **Registration on Vercel**: Requires `DATABASE_URL` and `DIRECT_URL` set in Vercel env vars. Without them, registration returns a friendly error.

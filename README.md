# HOTEL BOOKING APP

**Link:** [booking-hotel-alpha.vercel.app](https://booking-hotel-alpha.vercel.app)

<img src="./public/readme-preview.png" alt="Hotel Booking App" width="768" height="auto">

## Project Purpose

This app allows users to browse rooms, view details, make reservations, and pay online. Admins can manage rooms, amenities, and view reservations. It demonstrates a full-stack Next.js 15 application with Auth.js, Prisma, PostgreSQL, Midtrans payments, and Vercel Blob for media.

## Tech Stack

- **Framework:** Next.js 15 (App Router), TypeScript
- **Styling:** Tailwind CSS 4
- **Authentication:** Auth.js (next-auth v5) with Google provider and Prisma Adapter
- **Database:** PostgreSQL with Prisma ORM
- **File Storage:** Vercel Blob (public uploads)
- **Payments:** Midtrans Snap API
- **Images:** next/image with remote patterns (Google avatars, Vercel Blob)
- **Deployment:** Vercel

## Key Features

- **Room Catalog**
  - List of rooms with images, price, capacity, and details
  - Room details page with amenities and description

- **Reservations & Checkout**
  - Reserve room for date range and view reservation details
  - Checkout flow integrating Midtrans Snap
  - Payment status pages: success, pending, failure

- **Authentication**
  - Google OAuth via Auth.js
  - JWT session strategy, role propagated into session

- **Admin Dashboard**
  - Manage rooms and amenities (create/edit/delete)
  - View reservations list
  - Route protection and role-based access (ADMIN)

- **Uploads**
  - Image upload to Vercel Blob with validation (type/size) and deletion endpoint

## Application Structure (high level)

- `src/app`
  - Public pages: `/`, `/about`, `/contact`, `/room`, `/room/[roomId]`
  - Auth: `/signin`
  - User: `/myreservation`, `/myreservation/[id]`
  - Checkout: `/checkout`, `/checkout/[id]`
  - Payment status: `/payment/success`, `/payment/pending`, `/payment/failure`
  - Admin: `/admin/dashboard`, `/admin/room`
  - API routes:
    - `POST /api/payment` (create Midtrans transaction token)
    - `POST /api/payment/notification` (Midtrans webhook)
    - `PUT /api/upload` and `DELETE /api/upload` (Vercel Blob)
    - `GET/POST /api/auth/[...nextauth]` (Auth.js handlers)

- `src/components`
  - UI components for cards, forms, navbar, admin tables, skeletons, etc.

- `src/lib`
  - `prisma.ts` Prisma client singleton
  - `data.ts` server-side data helpers (rooms, amenities, details)

- `src/auth.ts`
  - Auth.js configuration with PrismaAdapter and Google provider

- `src/middleware.ts`
  - Route protection (auth required) and role guard for `/admin`

## Database Models (Prisma)

- `User` (role defaults to `USER`, optional `phone`)
- `Room`, `Amenities`, `RoomAmenities` (many-to-many)
- `Reservation` (links `User` and `Room`), has optional `Payment`
- `Payment` (amount, status, method)
- `Contact`

See `prisma/schema.prisma` for full schema.

## Environment Variables

Create a `.env` file with:

```bash
# Database (Prisma)
POSTGRES_PRISMA_URL=postgresql://<user>:<pass>@<host>:<port>/<db>?schema=public
POSTGRES_URL_NON_POOLING=postgresql://<user>:<pass>@<host>:<port>/<db>?schema=public

# Auth.js (NextAuth v5)
AUTH_SECRET=your_auth_secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
# Optional, depending on hosting
NEXTAUTH_URL=http://localhost:3000

# Payments (Midtrans)
MIDTRANS_SERVER_KEY=...
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=...

# Uploads (Vercel Blob)
# If running outside Vercel or using tokens
BLOB_READ_WRITE_TOKEN=...
```

Notes:

- `MIDTRANS_SERVER_KEY` is used to verify webhook signatures and server-side Snap.
- `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` is exposed to the browser for Snap SDK.
- On Vercel, Blob may work without explicit tokens if the integration is enabled; otherwise use `BLOB_READ_WRITE_TOKEN`.
- Google OAuth requires valid OAuth credentials and authorized redirect URL (e.g., `http://localhost:3000/api/auth/callback/google`).

## Middleware & Security

- Auth-required routes: `/myreservation`, `/admin`, `/checkout` redirect to `/signin` if unauthenticated.
- Admin guard: users with `role !== "ADMIN"` are redirected from `/admin/*` to `/`.
- CORS headers added for `POST /api/payment/notification` to receive Midtrans webhooks.

## Payments Flow (Midtrans)

1. Client submits reservation, calls `POST /api/payment`.
2. Server creates a Snap transaction token using reservation `order_id` and `gross_amount`.
3. Client uses Snap token to open payment UI.
4. Midtrans sends webhook to `POST /api/payment/notification`.
5. Webhook verifies signature with `reservationId + status_code + gross_amount + MIDTRANS_SERVER_KEY`.
6. Payment status is updated in DB: `PAID`, `PENDING`, or `FAILED`.

## Uploads (Vercel Blob)

- `PUT /api/upload`: validates file (image, <4MB) and stores with public access.
- `DELETE /api/upload?imageUrl=...`: deletes file by URL.

## Development

Prerequisites: Node 18+, pnpm (recommended), PostgreSQL

1. Install deps and generate Prisma client
   ```bash
   pnpm install
   pnpm postinstall # or: pnpm prisma generate
   ```
2. Configure `.env` (see above)
3. Create database and run migrations
   ```bash
   pnpm prisma migrate dev
   ```
4. Start dev server
   ```bash
   pnpm dev
   ```
5. Open http://localhost:3000

### Admin Access

- First authenticated user will have role `USER` by default.
- To promote an admin, update the `users.role` to `ADMIN` in the database manually.

## Scripts

- `dev`: Next dev with Turbopack
- `build`: Next build with Turbopack
- `start`: Start production server
- `lint`: ESLint
- `postinstall`: `prisma generate`

## Deployment

- Recommended: Vercel
- Configure environment variables in the hosting provider (database URLs, Auth.js, Midtrans keys, Blob token if needed).
- Ensure Midtrans webhook points to: `https://<domain>/api/payment/notification`
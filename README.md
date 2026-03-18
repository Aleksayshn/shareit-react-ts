# ShareIt MVP

ShareIt MVP is a Next.js App Router frontend for discovering items, managing shared inventory, creating and reviewing bookings, and adding comments after borrowing.

## What Is Included

- item discovery on `/` via `GET /items/search`
- owner inventory on `/items`
- item details, booking request CTA, and comment flow on `/items/[id]`
- borrower bookings on `/bookings`
- owner booking requests on `/bookings/owner`
- persisted active-user header injection through `X-Sharer-User-Id`
- TanStack Query for server state and Zustand for the tiny active-user client state

## Architecture Summary

- `app/` contains thin route entrypoints and the root layout
- `src/views/` owns route-level composition and prefers Server Components
- `src/features/` owns interactive workflows like create item, create booking, approve/reject booking, filtering, and comments
- `src/entities/` owns DTOs, domain models, mappers, query keys, and API functions
- `src/widgets/` owns composed UI blocks like the app header, item list, and booking list
- `src/shared/` contains cross-cutting UI primitives, config, API client, store, error handling, hooks, and query setup

## Rendering Strategy

- route segments and page shells are Server Components by default
- query-driven content, forms, filters, mutations, and the active-user store are Client Components
- pages are split so only the interactive content becomes client-side when needed

## Environment

Use the real ShareIt backend URL in `.env.local`.

```env
NEXT_PUBLIC_APP_NAME=ShareIt
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

The app falls back to `http://localhost:8080` if `NEXT_PUBLIC_API_BASE_URL` is missing.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local`

3. Start the app:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Business Assumptions

- the backend follows the ShareIt-style REST contract used by this frontend:
  - `GET /items`
  - `GET /items/search`
  - `GET /items/{id}`
  - `POST /items`
  - `PATCH /items/{id}`
  - `POST /bookings`
  - `GET /bookings`
  - `GET /bookings/owner`
  - `PATCH /bookings/{id}?approved=true|false`
  - `POST /items/{id}/comment`
- item details may include `ownerId`, `lastBooking`, `nextBooking`, and `comments`
- booking list endpoints support `state`, `from`, and `size`
- the backend enforces business rules for comment eligibility and invalid booking windows, and returns readable error messages

## Query And State Notes

- TanStack Query owns server data, request status, caching, and invalidation
- Zustand owns only the selected active user ID persisted to localStorage
- query key factories live in entity slices where useful:
  - items use stable keys in `src/entities/item/model/item.query-keys.ts`
  - bookings use stable keys in `src/entities/booking/model/booking.query-keys.ts`
- after mutations, relevant caches are invalidated explicitly instead of relying on implicit refresh

## Minimal Manual Fixes Still Needed

- verify the backend DTO shape matches the assumed ShareIt contract exactly, especially nested booking and comment fields
- confirm the backend exposes `ownerId` on item details if owner-only UI is required
- replace the header’s manual active-user input with a proper Users flow if the project continues beyond MVP
- add automated tests once the API contract is stable

## MVP Checklist

- [x] real API client with shared error normalization
- [x] active user persistence and automatic header injection
- [x] discovery search with debounce and empty-query guard
- [x] owner item management
- [x] item details with comments and booking CTA rules
- [x] borrower and owner booking management pages
- [x] URL-driven booking filter and pagination state
- [x] shared loading, empty, and error states
- [x] consistent app header and navigation
- [x] clear public APIs through `index.ts` files in practical slices

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run start`

# ShareIt MVP

Frontend foundation for the ShareIt MVP built with Next.js App Router, TypeScript, TanStack Query, Zustand, and a lightweight Feature-Sliced Design structure.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create your local env file:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Describe

Stage 1 implements the project foundation only:

- Next.js app shell with central `AppProviders`
- shared environment config
- fetch-based API client with query param support and `X-Sharer-User-Id` injection
- normalized `AppError` model for backend and network failures
- TanStack Query client setup for server-state concerns
- persisted Zustand store for the active sharer
- minimal shared UI primitives for upcoming forms and states
- public API exports for the current FSD slices

## Architecture

- `app/` keeps the Next.js route entrypoints thin.
- `src/app/` contains application wiring such as providers.
- `src/views/` owns route-level composition.
- `src/shared/` contains reusable infrastructure: config, API, error handling, state, and UI primitives.
- `src/entities/`, `src/features/`, `src/widgets/`, and `src/processes/` are staged and ready for the next increments.

`src/views/` is used instead of `src/pages/` because `pages/` is a reserved Next.js routing directory.

## Environment

Set `NEXT_PUBLIC_API_BASE_URL` to the real ShareIt backend URL.  
If it is omitted, the app falls back to `http://localhost:8080`.

## Stage Roadmap

### Stage 2

Build the Users domain and pages:

- `entities/user`
- `features/select-user`
- `features/create-user`
- `features/update-user`
- `features/delete-user`
- `widgets/user-switcher`
- routes:
  - `/users`
  - `/users/[id]`

Rules for Stage 2:

- separate DTOs, domain models, and mappers
- use TanStack Query for queries and mutations
- use React Hook Form + Zod for create and edit forms
- support list, create, update, delete, and active-user selection
- cover loading, empty, and error states
- keep route files thin

### Stage 3

Build the Items flow next:

- `entities/item`
- `features/create-item`
- `features/update-item`
- `features/list-owned-items`
- `features/search-items`
- `widgets/item-list`
- routes:
  - `/items`
  - `/items/[id]`

Stage 3 should introduce owner-focused item management, item detail screens, and the search flow that the selected user can act through.

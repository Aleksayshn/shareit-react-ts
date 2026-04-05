# ShareIt MVP

ShareIt is a Next.js App Router marketplace for temporary item sharing. People can discover useful listings, borrow what they need for a short time, and publish their own unused items for others.

## Features

- secure authentication with register, login, logout, and server-managed session cookies
- public home page with marketplace-style hero, featured listings, and clear borrow/share calls to action
- item discovery with search, availability states, and public item detail pages
- personal listings dashboard for creating and updating shared items
- borrowing dashboard for tracking requests you sent
- lending dashboard for reviewing and managing requests on your own listings
- comments flow for eligible borrowers
- responsive UI built with Next.js App Router, TypeScript, TanStack Query, React Hook Form, and Zod

## Architecture Summary

- `app/` contains thin route entrypoints and the root layout
- `src/views/` owns route-level composition and prefers Server Components
- `src/features/` owns interactive workflows like user selection, create item, create booking, approve/reject booking, filtering, and comments
- `src/entities/` owns DTOs, domain models, mappers, query keys, and API functions
- `src/widgets/` owns composed UI blocks like the app header, item list, booking list, and user list
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
  - `GET /users`
  - `POST /users`
  - `GET /users/{id}`
  - `PATCH /users/{id}`
  - `DELETE /users/{id}`
  - `GET /items`
  - `GET /items/search?text=&from=&size=`
  - `GET /items/{id}`
  - `POST /items`
  - `PATCH /items/{id}`
  - `POST /bookings`
  - `GET /bookings`
  - `GET /bookings/{id}`
  - `GET /bookings/owner`
  - `PATCH /bookings/{id}?approved=true|false`
  - `POST /items/{id}/comment`
- item details may include `ownerId`, `lastBooking`, `nextBooking`, and `comments`
- booking list endpoints support `state`, `from`, and `size`
- discovery currently requests the first page of search results with `from=0` and `size=20`
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
- confirm whether the backend returns a useful body for `DELETE /users/{id}` or always `204 No Content`
- add optional booking detail UI later if `GET /bookings/{id}` needs to be surfaced in the product
- add automated tests once the API contract is stable

## MVP Checklist

- [x] real API client with shared error normalization
- [x] active user persistence and automatic header injection
- [x] real users CRUD and active-user selection flow
- [x] discovery search with debounce and empty-query guard
- [x] owner item management
- [x] item details with comments and booking CTA rules
- [x] borrower and owner booking management pages
- [x] URL-driven booking filter and pagination state
- [x] shared loading, empty, and error states
- [x] consistent app header and navigation
- [x] clear public APIs through `index.ts` files in practical slices

## Use Case Diagram

```mermaid
flowchart LR
    Visitor[Visitor\nUnauthenticated User]
    Member[Member\nAuthenticated User]
    Lender[Lender]
    Borrower[Borrower]

    Visitor --> Member
    Member --> Lender
    Member --> Borrower

    subgraph ShareItSystem[ShareIt Marketplace System]
        UC1((Browse Home Page))
        UC2((Search Items))
        UC3((View Item Details))

        UC4((Register))
        UC5((Login))
        UC6((Logout))

        UC7((Create Listing))
        UC8((Update Listing))
        UC9((Manage Lending Requests))

        UC10((Request to Borrow))
        UC11((Track Borrowing Requests))
        UC12((Post Comment))

        UC13((Authentication Required))
    end

    Visitor --- UC1
    Visitor --- UC2
    Visitor --- UC3
    Visitor --- UC4
    Visitor --- UC5

    Member --- UC1
    Member --- UC2
    Member --- UC3
    Member --- UC6

    Lender --- UC7
    Lender --- UC8
    Lender --- UC9

    Borrower --- UC10
    Borrower --- UC11
    Borrower --- UC12

    UC10 -. "<<include>>" .-> UC13
    UC7 -. "<<include>>" .-> UC13
    UC8 -. "<<include>>" .-> UC13
    UC9 -. "<<include>>" .-> UC13
    UC11 -. "<<include>>" .-> UC13
    UC12 -. "<<extend>>" .-> UC3

    Note1["{User must have completed a successful borrow}"]
    Note1 -.-> UC12

```

## Sequence Diagrams

### Login Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend (Next.js UI)
    participant AuthAPI as Next API Route /api/auth/login
    participant BE as ShareIt Backend API
    participant DB as Database
    participant Cookie as Session Cookie Store

    User->>FE: Submit email + password
    activate FE
    FE->>AuthAPI: POST /api/auth/login
    activate AuthAPI
    AuthAPI->>BE: POST /auth/login
    activate BE
    BE->>DB: Validate credentials
    activate DB
    DB-->>BE: User record + auth result
    deactivate DB

    alt Credentials valid
        BE-->>AuthAPI: token + user data
        AuthAPI->>Cookie: Set session cookie
        AuthAPI-->>FE: Login success
        FE-->>User: Redirect to home/dashboard
    else Credentials invalid
        BE-->>AuthAPI: 401 Unauthorized
        AuthAPI-->>FE: Error response
        FE-->>User: Show login error
    end

    deactivate BE
    deactivate AuthAPI
    deactivate FE
```

### Search and View Item Details

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Frontend (Discovery Page)
    participant Proxy as Next API Route /api/forward/*
    participant BE as ShareIt Backend API
    participant DB as Database

    User->>FE: Enter search text
    activate FE
    FE->>FE: Debounce input
    FE->>Proxy: GET /api/forward/items/search?text=drill
    activate Proxy
    Proxy->>BE: GET /items/search?text=drill
    activate BE
    BE->>DB: Query matching items
    activate DB
    DB-->>BE: Matching item list
    deactivate DB
    BE-->>Proxy: Search results
    deactivate BE
    Proxy-->>FE: Search results JSON
    deactivate Proxy
    FE-->>User: Display item list

    User->>FE: Open item details
    FE->>Proxy: GET /api/forward/items/{id}
    activate Proxy
    Proxy->>BE: GET /items/{id}
    activate BE
    BE->>DB: Load item details
    activate DB
    DB-->>BE: Item detail data
    deactivate DB
    BE-->>Proxy: Item details
    deactivate BE
    Proxy-->>FE: Item details JSON
    deactivate Proxy
    FE-->>User: Show item details page
    deactivate FE
```

### Borrow Request Flow

```mermaid
sequenceDiagram
    autonumber
    actor Borrower
    participant FE as Frontend (Item Details)
    participant Proxy as Next API Route /api/forward/*
    participant BE as ShareIt Backend API
    participant DB as Database

    Borrower->>FE: Submit borrow request form
    activate FE
    FE->>Proxy: POST /api/forward/bookings
    activate Proxy
    Proxy->>BE: POST /bookings
    activate BE
    BE->>DB: Validate availability and dates
    activate DB
    DB-->>BE: Validation data
    deactivate DB

    alt Request valid
        BE->>DB: Save booking request
        activate DB
        DB-->>BE: Booking created
        deactivate DB
        BE-->>Proxy: Success response
        Proxy-->>FE: Success response
        FE-->>Borrower: Show request sent message
    else Request invalid
        BE-->>Proxy: Validation error
        Proxy-->>FE: Error response
        FE-->>Borrower: Show error message
    end

    deactivate BE
    deactivate Proxy
    deactivate FE
```

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run start`

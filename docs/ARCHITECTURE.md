# 🏛️ IMovies - Architecture & Technical Specification

> **Project Name:** IMovies - Movie ticket booking made simple  
> **Architecture Pattern:** Client-Server, MVC (Model-View-Controller) RESTful Architecture  
> **Tech Stack:** MERN (MongoDB, Express.js, React.js, Node.js) with Bootstrap 5  

---

## 1. System Overview

IMovies is a full-stack cinema ticketing web platform engineered to deliver high-performance, real-time seat availability tracking, frictionless checkout, and digital ticket management. The application decouples presentation logic (React SPA) from business orchestration and persistence layers (Express & MongoDB) through a hardened RESTful API secured by JSON Web Tokens (JWT).

```mermaid
flowchart TD
    subgraph Client["Frontend Client (React.js + Bootstrap)"]
        UI[Cinema UI & Dark Theme]
        Context[Auth & Booking Contexts]
        AxiosClient[Axios API Client + JWT Interceptors]
    end

    subgraph Server["Backend Server (Node.js + Express.js)"]
        Router[Express Router & Endpoints]
        AuthMW[JWT Auth & Admin Middleware]
        Controllers[Auth, Movie, Show, Booking Controllers]
    end

    subgraph Database["Persistence Layer (MongoDB / Mongoose)"]
        UserCol[(Users Collection)]
        MovieCol[(Movies Collection)]
        TheaterCol[(Theaters Collection)]
        ShowCol[(Shows & Seat Layouts)]
        BookingCol[(Bookings Collection)]
    end

    UI --> Context
    Context --> AxiosClient
    AxiosClient -->|HTTPS REST Requests + Bearer Token| Router
    Router --> AuthMW
    AuthMW --> Controllers
    Controllers --> UserCol
    Controllers --> MovieCol
    Controllers --> TheaterCol
    Controllers --> ShowCol
    Controllers --> BookingCol
```

---

## 2. Core Epics & Stories Breakdown

The application fulfills the 6 core project epics:

1. **PROJECT ARCHITECTURE:** Technical documentation, component diagrams, schema modeling, and client-server contract.
2. **PROJECT SETUP AND CONFIGURATION:** Standardized project structure, dependency resolution, environment configuration, and root-level orchestration scripts.
3. **BACKEND DEVELOPMENT:** Express routing, REST endpoints, JWT authentication, and atomic seat reservation algorithms.
4. **DATABASE DEVELOPMENT:** Mongoose schemas, relational references, automated seeders with comprehensive mock data, and automatic in-memory fallback.
5. **FRONTEND DEVELOPMENT:** React components, Bootstrap responsive grid, dynamic seat selector with curved screen visualization, order summary, coupon discount calculator, and digital ticket generation.
6. **PROJECT EXECUTION:** Development build verification, production bundling, health check observability, and live testing.

---

## 3. Database Schema & Data Models

### Entity Relationship Model

```mermaid
erDiagram
    USER ||--o{ BOOKING : places
    MOVIE ||--o{ SHOW : scheduled_for
    THEATER ||--o{ SHOW : hosts
    SHOW ||--o{ BOOKING : reserves
    MOVIE ||--o{ BOOKING : displays
    THEATER ||--o{ BOOKING : takes_place_at

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string role
        string phone
        date createdAt
    }

    MOVIE {
        ObjectId _id PK
        string title
        string description
        string posterUrl
        string backdropUrl
        string[] genre
        number duration
        string language
        number rating
        string certificate
        string status
        string trailerUrl
    }

    THEATER {
        ObjectId _id PK
        string name
        string city
        string address
        string[] facilities
        array screens
    }

    SHOW {
        ObjectId _id PK
        ObjectId movie FK
        ObjectId theater FK
        string screenName
        string format
        string date
        string time
        object pricing
        object seatLayout
        string status
    }

    BOOKING {
        ObjectId _id PK
        string bookingId UK
        ObjectId user FK
        ObjectId movie FK
        ObjectId theater FK
        ObjectId show FK
        array seats
        number subtotal
        number convenienceFee
        number totalAmount
        string showDate
        string showTime
        string status
        string ticketCode
    }
```

---

## 4. Ticket Reservation Lifecycle & Concurrency Protection

To prevent double booking of seats when concurrent users attempt to reserve the same seat simultaneously:

1. **Selection:** User selects available seats in the interactive `SeatPicker` UI.
2. **Atomic Verification:** The server queries the latest `Show` document and validates that none of the selected seat identifiers exist in `seatLayout.bookedSeats`.
3. **Atomic Reservation:** Using MongoDB atomic operations (`$push`), the requested seats are appended to `show.seatLayout.bookedSeats`.
4. **Transaction Record:** A `Booking` record is created with unique reference `IMV-XXXXXX` and verification code `TKT-XXXX-XXXX`.
5. **Cancellation & Rollback:** If a booking is cancelled, an atomic `$pull` operation removes the reserved seats from `show.seatLayout.bookedSeats`, instantly freeing them for other moviegoers.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as React Client
    participant API as Express API
    participant DB as MongoDB

    User->>Frontend: Selects Seats (e.g. A4, A5)
    User->>Frontend: Clicks "Proceed to Checkout"
    Frontend->>API: POST /api/bookings { showId, seats, paymentMethod }
    API->>DB: Find Show by ID
    DB-->>API: Return Show with bookedSeats
    alt Seats Already Booked
        API-->>Frontend: 400 Bad Request: "Seats already taken"
        Frontend-->>User: Show alert & refresh seat layout
    else Seats Available
        API->>DB: Atomically append seats to show.seatLayout.bookedSeats
        API->>DB: Insert Booking document (status: confirmed)
        DB-->>API: Booking Saved
        API-->>Frontend: 201 Created: { booking, ticketCode }
        Frontend-->>User: Celebrate with Confetti & Display M-Ticket
    end
```

---

## 5. RESTful API Contract

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/auth/profile` | Private | Retrieve current user profile |
| `PUT` | `/api/auth/profile` | Private | Update user profile details |

### Movies (`/api/movies`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/movies` | Public | Get all movies with search, genre, language & status filters |
| `GET` | `/api/movies/featured` | Public | Get featured movies for carousel |
| `GET` | `/api/movies/filters` | Public | Get distinct genres & languages |
| `GET` | `/api/movies/:id` | Public | Get movie details by ID |
| `POST` | `/api/movies` | Admin | Create a new movie |
| `PUT` | `/api/movies/:id` | Admin | Update an existing movie |
| `DELETE` | `/api/movies/:id` | Admin | Delete movie from catalog |

### Shows & Showtimes (`/api/shows`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/shows` | Public | Get shows with query filters |
| `GET` | `/api/shows/movie/:movieId` | Public | Get shows grouped by theater for a date |
| `GET` | `/api/shows/:id` | Public | Get show details with up-to-date seat matrix |
| `POST` | `/api/shows` | Admin | Create show schedule |

### Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/bookings` | Private | Reserve seats and generate ticket |
| `GET` | `/api/bookings/my-bookings` | Private | Get current user's booking history |
| `GET` | `/api/bookings/:id` | Private | Get specific ticket pass by ID |
| `PUT` | `/api/bookings/:id/cancel` | Private | Cancel reservation & release seats |
| `GET` | `/api/bookings` | Admin | View all bookings across the platform |

### Admin Analytics (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Admin | Platform revenue, tickets sold, and recent bookings |

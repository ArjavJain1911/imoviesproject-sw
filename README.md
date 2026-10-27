# 🎬 IMovies - Movie Ticket Booking Made Simple

![React](https://img.shields.io/badge/React-18.x-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Secure_Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

> **IMovies** is a full-stack cinema ticketing web platform engineered to deliver real-time seat availability tracking, seamless showtime exploration, snacks add-on ordering, and instant digital cinema passes.

---

## 🌟 Key Features

* **🎭 Movie Discovery & Filters:**
  * Featured spotlight hero banner with YouTube trailer links.
  * Filter by status (*Now Showing* vs *Coming Soon*), genre, and language.
  * Real-time search by title, cast, and director.

* **🏛️ Grouped Showtimes & Theaters:**
  * Select show dates across the next 5 days.
  * View multiplexes (IMAX 3D, Dolby Atmos, 4DX) with remaining seat counters.

* **💺 Interactive Seat Matrix:**
  * Realistic curved cinema screen visualization with ambient glow.
  * Tier-based pricing: **VIP** (Rows A-B), **Premium** (Rows C-E), and **Standard** (Rows F-H).
  * Real-time booked vs available seat detection.
  * Max 8 seats reservation safeguard.

* **🍿 Checkout & Add-ons:**
  * Cinema concessions ordering (Jumbo Popcorn, Nachos, Chilled Drinks, Combos).
  * Discount coupons (`IMOVIE20` for 20% off, `WELCOME100` for ₹100 flat discount).
  * Multi-method payment simulation (Credit/Debit Card, UPI FastPay, Net Banking).

* **🎫 Digital Cinema Pass (M-Ticket):**
  * Perforated cinema ticket pass design with simulated QR code and barcode.
  * One-click print / save ticket option (`window.print()`).
  * Instant celebration confetti animation on booking confirmation.

* **📜 Booking History & Cancellations:**
  * Personal booking records dashboard.
  * Active tickets review and one-click cancellation with immediate seat release.

* **📊 Administrator Hub:**
  * Live platform metrics: Total Revenue, Total Tickets Sold, Registered Users, Active Movies.
  * Add new movies to the catalog.
  * Platform-wide booking audit table.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
* **Node.js** v16 or above (*tested on v24.14.1*)
* **npm** v8 or above (*tested on 11.21.1*)

### 2. Installation
Clone or navigate to the project directory:
```bash
cd imovies
npm run install:all
```

### 3. Start the Backend API
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```
> **Self-Contained DB:** If you do not have a local MongoDB instance running, the backend automatically spins up an in-memory MongoDB server and pre-seeds it with 7 movies, 3 theaters, 255 active shows, and 2 demo accounts!

### 4. Start the Frontend Application
In a second terminal:
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@imovies.com` | `admin123` | Full access to Admin Panel, metrics & movie creation |
| **Regular User** | `user@imovies.com` | `user123` | Ticket reservations, seat selection, booking history |

*(Quick-fill buttons are provided on the login page for testing convenience).*

---

## 📁 Project Architecture & Epics

```
imovies/
├── backend/
│   ├── config/db.js           # Resilient DB connection + MongoMemoryServer
│   ├── controllers/           # Auth, Movie, Show, Booking & Admin logic
│   ├── middleware/            # JWT auth, role guard & error handling
│   ├── models/                # User, Movie, Theater, Show & Booking schemas
│   ├── routes/                # RESTful API endpoints
│   ├── seed/                  # Seeder dataset and runner
│   └── server.js              # Express server
├── frontend/
│   ├── src/
│   │   ├── components/        # Navbar, Footer, MovieCard, SeatPicker
│   │   ├── context/           # AuthContext & BookingContext
│   │   ├── pages/             # All UI views
│   │   ├── services/api.js    # Axios client with JWT interceptor
│   │   ├── App.jsx            # Router and layout
│   │   └── index.css          # Dark cinema aesthetic
│   ├── vite.config.js
│   └── package.json
└── docs/
    ├── ARCHITECTURE.md        # Epic 1: Architectural documentation & diagrams
    └── SETUP.md               # Epic 2: Setup, configuration & hardware specs
```

For detailed specifications, see:
* [Architecture Documentation](docs/ARCHITECTURE.md)
* [Setup & Prerequisites Guide](docs/SETUP.md)

---

## 🛡️ License
This project is open-source under the [MIT License](LICENSE).

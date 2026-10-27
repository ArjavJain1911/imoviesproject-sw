# ⚙️ IMovies - Setup & Configuration Guide

This guide details the complete installation, environment configuration, and execution workflow for **IMovies - Movie ticket booking made simple**.

---

## 1. System Prerequisites

### Software Requirements
* **Operating System:** Windows 10/11, macOS, or Linux.
* **Node.js:** v16.0.0 or higher (*tested on v24.14.1*).
* **npm:** v8.0.0 or higher (*tested on 11.21.1*).
* **MongoDB:** Local MongoDB Community Server v6.0+ or MongoDB Atlas connection string.
  > **Note:** The backend includes an automated in-memory MongoDB fallback (`mongodb-memory-server`) that spins up instantly if no external MongoDB server is running.
* **Web Browser:** Google Chrome, Firefox, Safari, or Microsoft Edge (latest version).

### Hardware Specifications
* **Processor:** Intel Core i5 (8th Gen+) / AMD Ryzen 5 or better.
* **RAM:** Minimum 8 GB (16 GB recommended).
* **Storage:** At least 1 GB free disk space.
* **Display:** 1366x768 resolution or higher.

---

## 2. Directory Structure

```
imovies/
├── backend/
│   ├── config/          # Database connection & MongoMemoryServer fallback
│   ├── controllers/     # Auth, Movie, Show, Booking & Admin controllers
│   ├── middleware/      # JWT auth guard, Admin role verification, Error handling
│   ├── models/          # Mongoose models (User, Movie, Theater, Show, Booking)
│   ├── routes/          # Express route definitions
│   ├── seed/            # Seeder data & automated population script
│   ├── .env             # Environment variables
│   ├── package.json
│   └── server.js        # Express application entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, MovieCard, SeatPicker, ProtectedRoute
│   │   ├── context/     # AuthContext (JWT sessions), BookingContext (Active ticket flow)
│   │   ├── pages/       # Home, MovieDetails, SeatBooking, Checkout, Confirmation, Admin
│   │   ├── services/    # Axios API client with JWT interceptor
│   │   ├── App.jsx      # Router & provider root
│   │   ├── index.css    # Cinematic dark theme styling
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js   # Vite dev server with proxy to backend
│   └── package.json
├── docs/
│   ├── ARCHITECTURE.md  # Architectural blueprints & API specifications
│   └── SETUP.md         # Setup & configuration guide (this file)
├── package.json         # Root scripts to orchestrate client & server
└── README.md            # Comprehensive project overview
```

---

## 3. Environment Variables Configuration

In `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/imovies
JWT_SECRET=imovies_super_secret_jwt_key_2026_cinema
CLIENT_URL=http://localhost:5173
```

In `frontend/.env` (optional, defaults to `http://localhost:5000/api` or Vite proxy):

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 4. Step-by-Step Installation

### Step 1: Install Dependencies
From the root directory:
```bash
npm run install:all
```
Or individually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Step 2: Seed the Database
```bash
npm run seed
```
This populates:
* **Users:** Administrator (`admin@imovies.com`) and standard test user (`user@imovies.com`).
* **Theaters:** 3 modern multiplexes with IMAX 3D, Dolby Atmos, and 4DX screens.
* **Movies:** 7 trending and upcoming films with posters, backdrops, ratings, and cast.
* **Shows:** 255 active showtimes across the next 5 days with realistic pre-booked seats.

### Step 3: Run the Development Servers
In two separate terminals:

**Terminal 1 (Backend Server):**
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

---

## 5. Demo Accounts

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@imovies.com` | `admin123` | Full access to Admin Dashboard, Analytics, Movie Management, All Bookings |
| **Regular User** | `user@imovies.com` | `user123` | Movie browsing, seat selection, booking tickets, viewing & cancelling reservations |

*(Quick-fill buttons are conveniently available on the Sign In page for one-click authentication during evaluations).*

---

## 6. Health & API Testing

Verify backend operation:
```bash
curl http://localhost:5000/api/health
```
Expected response:
```json
{
  "status": "online",
  "platform": "IMovies - Movie Ticket Booking API",
  "uptime": 120.45
}
```

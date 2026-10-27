import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SeatBookingPage from './pages/SeatBookingPage';
import CheckoutPage from './pages/CheckoutPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import UserBookingsPage from './pages/UserBookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <div className="d-flex flex-column min-vh-100 bg-dark text-light">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movie/:id" element={<MovieDetailsPage />} />
                <Route
                  path="/seat-selection/:showId"
                  element={
                    <ProtectedRoute>
                      <SeatBookingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/confirmation/:id"
                  element={
                    <ProtectedRoute>
                      <BookingConfirmationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedRoute>
                      <UserBookingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

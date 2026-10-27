import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const setBookingSession = (show, movie) => {
    setSelectedShow(show);
    setSelectedMovie(movie);
    setSelectedSeats([]);
    setSelectedAddons([]);
  };

  const toggleSeat = (seatNumber, tier, price) => {
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.seatNumber === seatNumber);
      if (exists) {
        return prev.filter((s) => s.seatNumber !== seatNumber);
      } else {
        // Limit max seats per booking to 8
        if (prev.length >= 8) {
          alert('Maximum 8 seats can be selected per booking.');
          return prev;
        }
        return [...prev, { seatNumber, tier, price }];
      }
    });
  };

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const clearBooking = () => {
    setSelectedMovie(null);
    setSelectedShow(null);
    setSelectedSeats([]);
    setSelectedAddons([]);
  };

  const seatsSubtotal = selectedSeats.reduce((acc, s) => acc + (s.price || 0), 0);
  const addonsSubtotal = selectedAddons.reduce((acc, a) => acc + (a.price || 0), 0);
  const convenienceFee = selectedSeats.length > 0 ? selectedSeats.length * 30 : 0;
  const totalAmount = seatsSubtotal + addonsSubtotal + convenienceFee;

  const value = {
    selectedMovie,
    selectedShow,
    selectedSeats,
    selectedAddons,
    seatsSubtotal,
    addonsSubtotal,
    convenienceFee,
    totalAmount,
    setBookingSession,
    toggleSeat,
    toggleAddon,
    clearBooking,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
// components
import ShopDetailsPageWrapper from "./pages/shop-detials/ShopDetailsPageWrapper";
import BookingSummaryWrapper from "./pages/booking-summary/BookingSummaryWrapper";
import MyBookingWrapper from "./pages/my-booking/MyBookingWrapper";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/details/:id" element={<ShopDetailsPageWrapper />} />
          <Route path="/booking-success" element={<BookingSummaryWrapper />} />
          <Route path="/my-bookings" element={<MyBookingWrapper />} />
          <Route path="/booking/:id" element={<BookingSummaryWrapper />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

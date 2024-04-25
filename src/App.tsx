// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./i18n.ts";
// components
import ShopDetailsPageWrapper from "./pages/shop-detials/ShopDetailsPageWrapper";
import BookingSummaryWrapper from "./pages/booking-summary/BookingSummaryWrapper";
import MyBookingWrapper from "./pages/my-booking/MyBookingWrapper";
import BusinessAuth from "./pages/auth/BusinessAuth.tsx";
import BusinessOverview from "./pages/business-overview/BusinessOverview.tsx";
import BookingApproval from "./pages/booking-approval/BookingApproval.tsx";
import BusinessProfile from "./pages/business-profile/BusinessProfile.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* business part */}
          <Route path="/" element={<BusinessAuth />} />
          <Route path="/bussiness-profile/:id" element={<BusinessProfile />} />
          <Route path="/bussiness-overview" element={<BusinessOverview />} />
          <Route path="/booking-approval/:id" element={<BookingApproval />} />
          {/* business part */}

          {/* user part */}
          <Route path="/details/:id" element={<ShopDetailsPageWrapper />} />
          <Route path="/my-bookings" element={<MyBookingWrapper />} />
          <Route path="/booking/:id" element={<BookingSummaryWrapper />} />
          {/* user part */}
          <Route path="/booking-success" element={<BookingSummaryWrapper />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

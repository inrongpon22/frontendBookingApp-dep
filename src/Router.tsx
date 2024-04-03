import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ExplorePageWrapper from "./pages/explore/ExplorePageWrapper";
import ShopDetailsPageWrapper from "./pages/shop-detials/ShopDetailsPageWrapper";
import BookingConfirmationPageWrapper from "./pages/booking-confirmation/BookingConfirmationPageWrapper";


const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExplorePageWrapper />} />
        <Route path="/details/:id" element={<ShopDetailsPageWrapper />} />
        <Route path="/booking-confirmation" element={<BookingConfirmationPageWrapper />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
 
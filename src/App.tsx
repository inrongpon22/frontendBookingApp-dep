// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './i18n.ts';
// components
import ShopDetailsPageWrapper from "./pages/shop-detials/ShopDetailsPageWrapper";
import BookingSummaryWrapper from "./pages/booking-summary/BookingSummaryWrapper";
import MyBookingWrapper from "./pages/my-booking/MyBookingWrapper";
import CreateBusiness from "./pages/business/CreateBusiness";
// import Business from "./pages/business/Business";
import ServiceList from "./pages/business/ServiceList.tsx";
import ServiceInfo from "./pages/business/ServiceInfo.tsx";
import ServiceTime from "./pages/business/ServiceTime.tsx";
import CreateService from "./pages/business/CreateService.tsx";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/details/:id"
                        element={<ShopDetailsPageWrapper />}
                    />
                    <Route
                        path="/booking-success"
                        element={<BookingSummaryWrapper />}
                    />
                    <Route path="/my-bookings" element={<MyBookingWrapper />} />
                    <Route
                        path="/booking/:id"
                        element={<BookingSummaryWrapper />}
                    />
                    <Route
                        path="/createBusiness"
                        element={<CreateBusiness />}
                    />
                    {/* <Route path="/business" element={<Business />} /> */}
                    <Route path="/service/:businessId" element={<ServiceList />} />
                    <Route path="/serviceInfo" element={<ServiceInfo />} />
                    <Route path="/serviceTime" element={<ServiceTime />} />
                    <Route path="/createService" element={<CreateService />} />

                </Routes>
            </BrowserRouter>
        </>
    );
}
export default App;

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
import CreateBusiness from "./pages/business/CreateBusiness";
import ServiceList from "./pages/business/ServiceList.tsx";
import ServiceInfo from "./pages/business/ServiceInfo.tsx";
import ServiceTime from "./pages/business/ServiceTime.tsx";
import CreateService from "./pages/business/CreateService.tsx";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<BusinessAuth />} />
                    <Route
                        path="/bussiness-overview"
                        element={<BusinessOverview />}
                    />
                    <Route
                        path="/bussiness-profile/:id"
                        element={<BusinessProfile />}
                    />
                    <Route
                        path="/details/:id"
                        element={<ShopDetailsPageWrapper />}
                    />
                    <Route
                        path="/booking-approval/:id/:serviceId"
                        element={<BookingApproval />}
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
                        path="/createBusiness/:id"
                        element={<CreateBusiness />}
                    />
                    <Route
                        path="/service/:businessId"
                        element={<ServiceList />}
                    />
                    <Route
                        path="/serviceInfo/:businessId"
                        element={<ServiceInfo />}
                    />
                    <Route
                        path="/serviceTime/:businessId"
                        element={<ServiceTime />}
                    />
                    <Route
                        path="/createService/:businessId"
                        element={<CreateService />}
                    />
                </Routes>
            </BrowserRouter>
        </>
    );
}
export default App;

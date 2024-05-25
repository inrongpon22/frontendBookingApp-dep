import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./i18n.ts";
// components
import ShopDetailsPageWrapper from "./pages/shop-detials/ShopDetailsPageWrapper";
import BookingSummaryWrapper from "./pages/booking-summary/BookingSummaryWrapper";
import MyBookingWrapper from "./pages/my-booking/MyBookingWrapper";
import BusinessAuth from "./pages/auth/BusinessAuth.tsx";
import BusinessOverview from "./pages/business-overview/BusinessOverview.tsx";
import BookingApproval from "./pages/booking-approval/BookingApproval.tsx";
import CreateBusiness from "./pages/business/CreateBusiness";
import ServiceSetting from "./pages/service/ServiceSetting.tsx";
import ServiceDetail from "./pages/service/ServiceDetail.tsx";
import BusinessSetting from "./pages/business/BusinessSetting.tsx";
import DayOffSetting from "./pages/dayoff-setting/DayOffSetting.tsx";
import AddNewDayOff from "./pages/dayoff-setting/AddNewDayOff.tsx";
import BusinessProfile from "./pages/business-profile/BusinessProfile.tsx";
// error pages
import NotFound from "./pages/errors/404NotFound.tsx";
import Unauthorized from "./pages/errors/401Unauthorized.tsx";
import Forbidden from "./pages/errors/403Forbidden.tsx";

function App() {
    useEffect(() => {
        localStorage.setItem("lang", "th");
    }, []);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* customer */}
                    <Route
                        path="/details/:businessId"
                        element={<ShopDetailsPageWrapper />}
                    />

                    <Route
                        path="/booking-success"
                        element={<BookingSummaryWrapper />}
                    />
                    <Route path="/my-bookings" element={<MyBookingWrapper />} />
                    <Route
                        path="/booking/:bookingId"
                        element={<BookingSummaryWrapper />}
                    />

                    {/* business */}
                    <Route path="/" element={<BusinessAuth />} />
                    <Route
                        path="/business-profile/:businessId"
                        element={<BusinessProfile />}
                    />
                    <Route
                        path="/booking-approval/:businessId"
                        element={<BookingApproval />}
                    />
                    <Route
                        path="/business-overview"
                        element={<BusinessOverview />}
                    />
                    <Route
                        path="/create-business"
                        element={<CreateBusiness />}
                    />
                    <Route
                        path="/business-setting"
                        element={<BusinessSetting />}
                    />

                    {/* service */}
                    <Route
                        path="/service/:businessId"
                        element={<ServiceDetail serviceId={0} />}
                    />

                    <Route
                        path="/service-setting/:businessId"
                        element={<ServiceSetting />}
                    />
                    <Route
                        path="/service-detail/:businessId/:serviceId"
                        element={<ServiceDetail serviceId={0} />}
                    />

                    {/* day off */}
                    <Route
                        path="/dayoff-setting/:businessId"
                        element={<DayOffSetting />}
                    />
                    <Route
                        path="/dayoff-setting/:businessId/add-new"
                        element={<AddNewDayOff />}
                    />

                    {/* 401 unauthorize */}
                    <Route path="/401" element={<Unauthorized />} />
                    {/* 401 unauthorize */}
                    <Route path="/403" element={<Forbidden />} />
                    {/* 404 not found */}
                    <Route path="*" element={<Navigate to="/404" />} />
                    <Route path="/404" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
            <Toaster />
        </>
    );
}
export default App;

import { Toaster } from "react-hot-toast";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";
import "./i18n.ts";
// components
import ShopDetailsPageWrapper from "./pages/shop-detials/ShopDetailsPageWrapper";
import BookingSummaryWrapper from "./pages/booking-summary/BookingSummaryWrapper";
import MyBookingWrapper from "./pages/my-booking/MyBookingWrapper";
import BusinessAuth from "./pages/auth/BusinessAuth.tsx";
import BusinessOverview from "./pages/business-overview/BusinessOverview.tsx";
import BookingApproval from "./pages/booking-approval/BookingApproval.tsx";
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
import CallBack from "./pages/auth/CallBack.tsx";
import Noti from "./pages/notification/Noti.tsx";
import { useEffect, useState } from "react";
import Loading from "./components/dialog/Loading.tsx";
import { checkTokenValidity } from "./api/user.tsx";

function App() {
    const [isLoadding, setIsLoading] = useState<boolean>(false);

    function ProtectedRoute() {
        const navigate = useNavigate();

        useEffect(() => {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            const checkToken = async () => {
                try {
                    const response = await checkTokenValidity();
                    return response;
                } catch (error) {
                    console.error("Token validation error:", error);
                    navigate("/"); // Redirect to the login page
                    setIsLoading(false);
                }
            };

            if (token) {
                checkToken();
                setIsLoading(false);
            } else {
                console.log("Token is not valid");
                navigate("/");
                setIsLoading(false);
            }
        }, [navigate]);

        return (
            <Routes>
                <Route
                    path="/business-profile/:businessId"
                    element={<BusinessProfile />}
                />
                <Route path="/my-bookings" element={<MyBookingWrapper />} />
                <Route
                    path="/business-overview"
                    element={<BusinessOverview />}
                />
                <Route path="/create-business" element={<BusinessSetting />} />
                <Route path="/business-setting" element={<BusinessSetting />} />
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
                <Route path="/noti/:businessId" element={<Noti />} />
                <Route
                    path="/dayoff-setting/:businessId"
                    element={<DayOffSetting />}
                />
                <Route
                    path="/dayoff-setting/:businessId/add-new"
                    element={<AddNewDayOff />}
                />
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        );
    }

    return (
        <>
            <Loading openLoading={isLoadding} />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<BusinessAuth />} />
                    <Route path="/line-login" element={<CallBack />} />
                    <Route
                        path="/details/:businessId"
                        element={<ShopDetailsPageWrapper />}
                    />
                    <Route
                        path="/booking-approval/:businessId"
                        element={<BookingApproval />}
                    />
                    <Route
                        path="/booking/:bookingId"
                        element={<BookingSummaryWrapper />}
                    />
                    <Route
                        path="/booking-success"
                        element={<BookingSummaryWrapper />}
                    />
                    <Route path="/401" element={<Unauthorized />} />
                    <Route path="/403" element={<Forbidden />} />
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<ProtectedRoute />} />
                </Routes>
            </BrowserRouter>
            <Toaster />
        </>
    );
}

export default App;

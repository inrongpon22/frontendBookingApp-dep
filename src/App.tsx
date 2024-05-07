import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
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
  // const token = localStorage.getItem("token");
  useEffect(() => {
    localStorage.setItem("lang", "th")
  }, [])
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BusinessAuth />} />
          <Route path="/business-overview" element={<BusinessOverview />} />
          <Route
            path="/business-profile/:businessId"
            element={<BusinessProfile />}
          />
          <Route
            path="/details/:businessId"
            element={<ShopDetailsPageWrapper />}
          />
          <Route
            path="/booking-approval/:businessId/:serviceId"
            element={<BookingApproval />}
          />
          <Route path="/booking-success" element={<BookingSummaryWrapper />} />
          <Route path="/my-bookings" element={<MyBookingWrapper />} />
          <Route
            path="/booking/:bookingId"
            element={<BookingSummaryWrapper />}
          />

          <Route path="/createBusiness" element={<CreateBusiness />} />
          <Route path="/service/:businessId" element={<ServiceList />} />
          <Route path="/serviceInfo/:businessId" element={<ServiceInfo />} />
          <Route path="/serviceTime/:businessId" element={<ServiceTime />} />
          <Route
            path="/createService/:businessId"
            element={<CreateService />}
          />
        </Routes>
        {/* {!token && <Navigate to="/" replace={true} />} */}
      </BrowserRouter>
      <Toaster />
    </>
  );
}
export default App;

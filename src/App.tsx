import { Toaster } from "react-hot-toast";
import { createContext, useEffect } from "react";
export const TopLevelContext = createContext<any>(null); //create context to store all the data
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
import ServiceInfo from "./pages/business/ServiceInfo.tsx";
import ServiceTime from "./pages/business/ServiceTime.tsx";
import CreateService from "./pages/business/CreateService.tsx";
import ServiceSetting from "./pages/service/ServiceSetting.tsx";
import ServiceDetail from "./pages/service/ServiceDetail.tsx";
import BusinessSetting from "./pages/business-setting/BusinessSetting.tsx";

function App() {

  useEffect(() => {
    localStorage.setItem("lang", "th");
  }, []);

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
          {/* business */}
          <Route path="/createBusiness" element={<CreateBusiness />} />
          <Route
            path="/businessSetting/:businessId"
            element={<BusinessSetting />}
          />

          {/* service */}
          <Route path="/serviceInfo/:businessId" element={<ServiceInfo />} />
          <Route path="/serviceTime/:businessId" element={<ServiceTime />} />
          <Route
            path="/createService/:businessId"
            element={<CreateService />}
          />
          <Route
            path="/serviceSetting/:businessId"
            element={<ServiceSetting />}
          />
          <Route
            path="/serviceDetail/:businessId/:serviceId"
            element={<ServiceDetail />}
          />
        </Routes>
        {/* {!token && <Navigate to="/" replace={true} />} */}
      </BrowserRouter>
      <Toaster />
    </>
  );
}
export default App;

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
import ServiceInfo from "./pages/business/ServiceInfo.tsx";
import ServiceTime from "./pages/business/ServiceTime.tsx";
// import CreateService from "./pages/business/CreateService.tsx";
import ServiceSetting from "./pages/service/ServiceSetting.tsx";
import ServiceDetail from "./pages/service/ServiceDetail.tsx";
import BusinessSetting from "./pages/business-setting/BusinessSetting.tsx";
import BusinessPreview from "./pages/business-preview/BusinessPreview.tsx";

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

          <Route path="/booking-success" element={<BookingSummaryWrapper />} />
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
            path="/booking-approval/:businessId/:serviceId"
            element={<BookingApproval />}
          />
          <Route path="/business-overview" element={<BusinessOverview />} />
          <Route path="/create-business" element={<CreateBusiness />} />
          <Route
            path="/business-setting/:businessId"
            element={<BusinessSetting />}
          />
          <Route path="/business-preview" element={<BusinessPreview />} />

          {/* service */}
          <Route
            path="/service-info/:businessId"
            element={<ServiceInfo isClose={false} isEdit={false} />}
          />
          <Route path="/service-time/:businessId" element={<ServiceTime />} />
          {/* <Route
            path="/create-service/:businessId"
            element={<CreateService />}
          /> */}
          <Route
            path="/service-setting/:businessId"
            element={<ServiceSetting />}
          />
          <Route
            path="/service-detail/:businessId/:serviceId"
            element={<ServiceDetail serviceId={0} />}
          />
          <Route
            path="/service-detail/:businessId/:serviceId"
            element={<ServiceDetail serviceId={0} />}
          />
        </Routes>
        {/* {!token && <Navigate to="/" replace={true} />} */}
      </BrowserRouter>
      <Toaster />
    </>
  );
}
export default App;

/** @format */

import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
import { checkTokenValidity } from "./api/user.tsx";
import Noti from "./pages/notification/Noti.tsx";

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		localStorage.setItem("lang", "th");

		// Check for authentication status on initial render and when location changes
		const checkAuth = async () => {
			try {
				// Make a request to your backend to check authentication status
				const response = await checkTokenValidity(
					localStorage.getItem("token") ?? ""
				);
				if (response.status === 200) {
					setIsAuthenticated(true);
				} else {
					setIsAuthenticated(false);
				}
			} catch (error) {
				console.error("Error checking authentication:", error);
				setIsAuthenticated(false);
			}
		};

		if (localStorage.getItem("token")) {
			checkAuth();
		} else {
			setIsAuthenticated(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location, isAuthenticated]);

	return (
		<>
			<BrowserRouter>
				<Routes>
					{/* Protected Routes */}
					{isAuthenticated ? (
						<>
							{/* customer */}
							<Route path='/noti/:businessId' element={<Noti />} />
							<Route
								path='/details/:businessId'
								element={<ShopDetailsPageWrapper />}
							/>
							<Route
								path='/booking-success'
								element={<BookingSummaryWrapper />}
							/>
							<Route path='/my-bookings' element={<MyBookingWrapper />} />
							<Route
								path='/booking/:bookingId'
								element={<BookingSummaryWrapper />}
							/>

							{/* business */}
							<Route
								path='/business-profile/:businessId'
								element={<BusinessProfile />}
							/>
							<Route
								path='/booking-approval/:businessId'
								element={<BookingApproval />}
							/>
							<Route path='/business-overview' element={<BusinessOverview />} />
							<Route path='/create-business' element={<BusinessSetting />} />
							<Route path='/business-setting' element={<BusinessSetting />} />

							{/* service */}
							<Route
								path='/service/:businessId'
								element={<ServiceDetail serviceId={0} />}
							/>
							<Route
								path='/service-setting/:businessId'
								element={<ServiceSetting />}
							/>
							<Route
								path='/service-detail/:businessId/:serviceId'
								element={<ServiceDetail serviceId={0} />}
							/>

							{/* day off */}
							<Route
								path='/dayoff-setting/:businessId'
								element={<DayOffSetting />}
							/>
							<Route
								path='/dayoff-setting/:businessId/add-new'
								element={<AddNewDayOff />}
							/>
							{/* day off */}

							<Route path='/' element={<BusinessAuth />} />

							{/* 404 not found */}
							<Route path='*' element={<Navigate to='/404' />} />
							<Route path='/404' element={<NotFound />} />
						</>
					) : (
						<>
							<Route path='*' element={<Navigate to='/' />} />
							<Route path='/' element={<BusinessAuth />} />
							{/* login from line */}
							<Route path='/line-login' element={<CallBack />} />
							{/* login from line */}

							{/* 401 unauthorize */}
							<Route path='/401' element={<Unauthorized />} />
							{/* 401 unauthorize */}
							<Route path='/403' element={<Forbidden />} />
						</>
					)}
				</Routes>
			</BrowserRouter>
			<Toaster />
		</>
	);
}
export default App;

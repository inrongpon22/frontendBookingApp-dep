// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
// components
import ExplorePageWrapper from "./pages/explore/ExplorePageWrapper";
import ShopDetailsPageWrapper from "./pages/shop-detials/ShopDetailsPageWrapper";
import BLogin from "./pages/business/BLogin";
import OTP from "./pages/business/OTP";
import FindLocation from "./pages/business/FindLocation";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ExplorePageWrapper />} />
                    <Route
                        path="/details/:id"
                        element={<ShopDetailsPageWrapper />}
                    />
                    <Route path="/userLogin" element={<BLogin />} />
                    <Route path="/OTP" element={<OTP />} />
                    <Route path="/findLocation" element={<FindLocation />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
// components
import ShopDetailsPageWrapper from "./pages/shop-detials/ShopDetailsPageWrapper";
import CreateBusiness from "./pages/business/CreateBusiness";
import Business from "./pages/business/Business";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/details/:id"
                        element={<ShopDetailsPageWrapper />}
                    />
                    {/* <Route path="/findLocation" element={<FindLocation />} /> */}
                    <Route
                        path="/createBusiness/:page"
                        element={<CreateBusiness />}
                    />
                    <Route path="/business" element={<Business />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;

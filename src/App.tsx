// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
// components
import ShopDetailsPageWrapper from "./pages/shop-detials/ShopDetailsPageWrapper";
import FindLocation from "./pages/business/FindLocation";
import CreateBusiness from "./pages/business/CreateBusiness";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/details/:id"
                        element={<ShopDetailsPageWrapper />}
                    />
                    <Route path="/findLocation" element={<FindLocation />} />
                    <Route
                        path="/createBusiness/:page"
                        element={<CreateBusiness />}
                    />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;

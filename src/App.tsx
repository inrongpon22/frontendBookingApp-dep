// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
// components
import ExplorePageWrapper from "./pages/explore/ExplorePageWrapper";
import ShopDetailsPageWrapper from "./pages/shop-detials/ShopDetailsPageWrapper";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ExplorePageWrapper />} />
          <Route path="/details/:id" element={<ShopDetailsPageWrapper />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

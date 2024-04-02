import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ExplorePageWrapper from "./pages/explore/ExplorePageWrapper";
import ShopDetailsPageWrapper from "./pages/shop-detials/ShopDetailsPageWrapper";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExplorePageWrapper />} />
        <Route path="/details/:id" element={<ShopDetailsPageWrapper />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

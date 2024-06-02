import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import ProductList from "../pages/ProductList";

const MainLayout = ({ userData, isAuthenticated }) => (
  <div>
    <Outlet />
    <ProductList userData={userData} isAuthenticated={isAuthenticated} />
    <Footer />
  </div>
);

export default MainLayout;

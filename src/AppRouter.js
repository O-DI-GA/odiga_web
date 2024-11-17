// AppRoutes.js
import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import ShopInsert from "./page/ShopInsert";
import Login from "./page/auth/Login";
import ShopList from "./page/ShopList";
import ShopDetail from "./page/ShopDetail";
import ReserveInsert from "./page/ReserveInsert";
import ReserveEdit from "./page/ReserveEdit";
import SignUp from "./page/auth/SignUp";
import Header from "./component/Header";
import { useAccessToken } from "./store/useStore";

export default function AppRoutes() {
  const { accessToken } = useAccessToken();
  const location = useLocation();

  const showHeader = !["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route
          path="/"
          element={accessToken ? <ShopDetail /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={accessToken ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={accessToken ? <Navigate to="/" /> : <SignUp />}
        />
        <Route path="/shopStats" element={<ShopDetail />} />
        <Route path="/shopinsert" element={<ShopInsert />} />
        <Route path="/shoplist" element={<ShopList />} />
        <Route path="/reserveinsert/:storeId" element={<ReserveInsert />} />
        <Route path="/reserveedit/:storeId" element={<ReserveEdit />} />
      </Routes>
    </>
  );
}

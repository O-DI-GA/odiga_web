// AppRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import ShopInsert from "./page/ShopInsert";
import Login from "./page/auth/Login";
import ShopList from "./page/ShopList";
import ShopDetail from "./page/ShopDetail";
import ReserveInsert from "./page/ReserveInsert";
import ReserveEdit from "./page/ReserveEdit";
import SignUp from "./page/auth/SignUp";
import { useAccessToken } from "./store/useStore";

export default function AppRoutes() {
    const { accessToken } = useAccessToken();

    return (
        <Routes>
            <Route path="/" element={accessToken ? <Home /> : <Login />} />
            <Route path="/signup" element={<SignUp />} />
            {/* <Route path="/login" element={<Login />} /> */}
            <Route path="/menuinsert/:id" element={<ShopDetail />} />
            <Route path="/shopinsert" element={<ShopInsert />} />
            <Route path="/shoplist" element={<ShopList />} />
            <Route path="/reserveinsert/:storeId" element={<ReserveInsert />} />
            <Route path="/reserveedit/:storeId" element={<ReserveEdit />} />
        </Routes>
    );
}
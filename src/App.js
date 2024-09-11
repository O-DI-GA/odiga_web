import React from "react";

import Home from "./page/Home";
import ShopInsert from "./page/ShopInsert";
import Login from "./page/auth/Login";
import ShopList from "./page/ShopList";
import ShopDetail from "./page/ShopDetail";
import ReserveInsert from "./page/ReserveInsert";
import ReserveEdit from "./page/ReserveEdit";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useAccessToken } from "./store/useStore";

export const URL = "http://13.125.83.255:8080";

function App() {
  const accessToken = useAccessToken();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={accessToken ? <Home /> : <Login />} />
        {/* <Route path="/login" Component={Login} /> */}
        <Route path="/menuinsert/:id" Component={ShopDetail} />
        <Route path="/shopinsert" Component={ShopInsert} />
        <Route path="/shoplist" Component={ShopList} />
        <Route path="/reserveinsert/:storeId" Component={ReserveInsert} />
        <Route path="/reserveedit/:storeId/:timeId" Component={ReserveEdit} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

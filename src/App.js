import React from "react";

import Home from "./page/Home";
import ShopInsert from "./page/ShopInsert";
import MenuInsert from "./page/MenuInsert";
import Login from "./page/auth/Login";
import ShopList from "./page/ShopList";
import ShopDetail from "./page/ShopDetail";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export const URL = "http://13.125.83.255:8080";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/login" Component={Login} />
        <Route path="/menuinsert/:id" Component={ShopDetail} />
        <Route path="/shopinsert" Component={ShopInsert} />
        <Route path="/shoplist" Component={ShopList} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

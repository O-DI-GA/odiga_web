import React from "react";

import Home from "./page/Home";
import ShopInsert from "./page/ShopInsert";
import MenuInsert from "./page/MenuInsert";
import ShopList from "./page/ShopList";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export const URL = "http://13.125.83.255:8080";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/menuinsert" Component={MenuInsert} />
        <Route path="/shopinsert" Component={ShopInsert} />
        <Route path="/shoplist" Component={ShopList} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

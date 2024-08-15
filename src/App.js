import React from "react";

import Home from "./page/Home";
import ShopInsert from "./page/ShopInsert";
import MenuInsert from "./page/MenuInsert";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/menuinsert" Component={MenuInsert} />
        <Route path="/shopinsert" Component={ShopInsert} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

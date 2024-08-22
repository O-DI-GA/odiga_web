import React from 'react';

import Home from './page/Home';
import ShopInsert from './page/ShopInsert';
import MenuInsert from './page/MenuInsert';
import Login from './page/auth/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={Home} />
                <Route path="/login" Component={Login} />
                <Route path="/menuinsert" Component={MenuInsert} />
                <Route path="/shopinsert" Component={ShopInsert} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

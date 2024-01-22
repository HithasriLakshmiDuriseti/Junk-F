import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Coins from './pages/Coins';
import Profile from './pages/Profile';
import Products from './pages/Products';
import WasteDetails from './pages/WasteDetails/WasteDetails';
import MyWaste from './pages/MyWaste';
import Login from './authentication/Login';
import Signup from './authentication/Signup';

import 'bootstrap/dist/css/bootstrap.min.css';
import './components/Sidebar.css';
// import './pages/WasteDetails/WasteDetails.css'

const App = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/coins" element={<Coins />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/products" element={<Products />} />
            <Route path="/wastedetails/*" element={<WasteDetails />} />
            <Route path="/mywaste" element={<MyWaste/>} />
        </Routes>

    </BrowserRouter>
    
  );
};

export default App;

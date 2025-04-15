// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MyListings from "../pages/MyListings";
import SellForm from "../pages/SellForm";
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/sell" element={<SellForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
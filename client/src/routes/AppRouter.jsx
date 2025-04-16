import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Products from "../pages/Products";
import AddProduct from "../pages/add";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MyListings from "../pages/MyListings";
import SellForm from "../pages/SellForm";
import ProductDetails from "../pages/ProductDetails";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AppContent = () => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const location = useLocation();
  const hideNavbarPaths = ["/login", "/signup"];

  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className={`${darkMode ? "bg-[#121212] text-white" : "bg-[#F8F8FF] text-[#2E2E3A]"} min-h-screen`}>
      {shouldShowNavbar && <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />}
      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
        <Route path="/sell" element={<ProtectedRoute><SellForm /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/add" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

const AppRouter = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default AppRouter;

// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Products from "../pages/product";
import AddProduct from "../pages/add";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductDetails from "../pages/ProductDetails";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/add" element={<AddProduct />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
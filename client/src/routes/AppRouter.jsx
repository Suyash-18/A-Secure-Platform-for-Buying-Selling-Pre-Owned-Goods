// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Products from "../pages/product";
import AddProduct from "../pages/add";
import Login from "../pages/Login";
import Register from "../pages/Register";
<<<<<<< HEAD
import MyListings from "../pages/MyListings";
import SellForm from "../pages/SellForm";
=======
import ProductDetails from "../pages/ProductDetails";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

>>>>>>> 9507f15fb84669d07c461de5efae5593544e8ad8
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
<<<<<<< HEAD
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/sell" element={<SellForm />} />
=======
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/add" element={<AddProduct />} />

>>>>>>> 9507f15fb84669d07c461de5efae5593544e8ad8
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
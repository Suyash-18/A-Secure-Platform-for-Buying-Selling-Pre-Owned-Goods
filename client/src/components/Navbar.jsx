// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaSearch, FaPlusCircle, FaHeart, FaBell, FaUserCircle } from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth(); // Assuming logout is defined in context
  const [location, setLocation] = useState("India");
  const [language, setLanguage] = useState("EN");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

  return (
    <nav className="bg-[#9575cd] text-white p-4 shadow-md flex justify-between">
      <div className="font-bold text-xl">Fresh Exchange</div>
      <div>
        {!user ? (
          <>
            <Link to="/login" className="mr-4 hover:underline">
              Login
            </Link>
            <Link to="/signup" className="hover:underline">
              Sign Up
            </Link>
          </>
        ) : (
            <span className="font-medium">Hi, {user.fullname || user.username}</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

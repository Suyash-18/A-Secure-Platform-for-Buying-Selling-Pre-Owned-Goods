// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaSearch, FaPlusCircle, FaHeart, FaBell, FaUserCircle } from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [location, setLocation] = useState("India");
  const [language, setLanguage] = useState("EN");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white text-slate-800 p-4 shadow-md flex items-center justify-between">
      {/* Brand */}
      <Link to="/" className="text-2xl font-bold text-[#9575cd]">
        Fresh Exchange
      </Link>

      {/* Location Selector */}
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border px-2 py-1 rounded ml-4 text-sm focus:outline-none"
      >
        <option>India</option>
        <option>USA</option>
        <option>Germany</option>
        <option>France</option>
      </select>

      {/* Search Bar */}
      <div className="flex flex-1 mx-6 items-center border rounded overflow-hidden">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full px-3 py-2 focus:outline-none"
        />
        <button className="bg-[#9575cd] text-white p-2">
          <FaSearch />
        </button>
      </div>

      {/* Language Selector */}
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border px-2 py-1 rounded text-sm focus:outline-none mr-4"
      >
        <option>EN</option>
        <option>HI</option>
        <option>FR</option>
      </select>

      {/* Icons and Profile */}
      <div className="flex items-center gap-4 text-xl text-[#37474f]">
        <Link to="/products" className="hover:text-[#9575cd]">
          <FaHeart />
        </Link>
        <Link to="/notifications" className="hover:text-[#9575cd]">
          <FaBell />
        </Link>

        {/* Post Ad */}
        <Link
          to="/product/add"
          className="flex items-center gap-1 bg-[#9575cd] text-white px-3 py-1.5 rounded hover:bg-[#7e57c2]"
        >
          <FaPlusCircle />
          <span className="text-sm font-semibold">Sell</span>
        </Link>

        {/* Profile / Auth */}
        {!user ? (
          <div className="ml-2">
            <Link to="/login" className="text-sm mr-2 hover:underline">
              Login
            </Link>
            <Link to="/signup" className="text-sm hover:underline">
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="relative">
            <button onClick={toggleProfileMenu} className="text-[#9575cd]">
              <FaUserCircle />
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded z-10">
                <div className="p-2 border-b text-sm text-slate-700">
                  Hi, {user.fullname || user.username}
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  to="/my-products"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  My Listings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

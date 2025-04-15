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
    <nav className="bg-white text-gray-800 shadow-md p-3 px-6 flex items-center justify-between">
      {/* Left - Logo & Location */}
      <div className="flex items-center gap-4">
        <Link to="/" className="text-2xl font-bold text-purple-700">
          FreshExchange
        </Link>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="India">India</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Pune">Pune</option>
        </select>
      </div>

      {/* Middle - Search Bar */}
      <div className="flex-1 mx-4">
        <div className="flex bg-gray-100 rounded-md overflow-hidden">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full px-4 py-2 bg-transparent focus:outline-none"
          />
          <button className="bg-purple-600 text-white px-4">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Right - Icons, Lang, Profile */}
      <div className="flex items-center gap-4 relative">
        {/* Language */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="EN">EN</option>
          <option value="HI">HI</option>
        </select>

        {/* Favorites */}
        <Link to="/favorites" className="text-gray-600 hover:text-purple-600">
          <FaHeart size={18} />
        </Link>

        {/* Notifications */}
        <Link to="/notifications" className="text-gray-600 hover:text-purple-600">
          <FaBell size={18} />
        </Link>

        {/* Profile Dropdown */}
        <div className="relative">
          <button onClick={toggleProfileMenu} className="text-gray-600 hover:text-purple-600">
            <FaUserCircle size={22} />
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md py-2 z-50 min-w-[150px] border">
              <p className="px-4 py-2 text-sm text-gray-700">Hi, {user?.fullname || user?.username || "Guest"}</p>
              <hr />
              <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                Profile
              </Link>
              <Link to="/my-listings" className="block px-4 py-2 text-sm hover:bg-gray-100">
                My Listings
              </Link>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Sell Button */}
        <Link
          to="/sell"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm transition-all duration-200"
        >
          <FaPlusCircle /> Sell
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

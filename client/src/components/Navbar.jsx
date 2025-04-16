import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaSearch, FaPlusCircle, FaHeart, FaBell, FaUserCircle, FaMoon, FaSun } from "react-icons/fa";
import { useState } from "react";

const Navbar = ({ toggleDarkMode, darkMode }) => {
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
    <nav className={`p-4 shadow-md flex items-center justify-between ${darkMode ? "bg-[#9575cd] text-white" : "bg-white text-slate-800"}`}>
      {/* Brand */}
      <Link to="/" className={`text-2xl font-bold ${darkMode? "text-white" : "text-[#9575cd]"}`}>
        Fresh Exchange
      </Link>

      {/* Location Selector */}
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border px-2 py-1 rounded ml-4 text-sm focus:outline-none bg-transparent"
      >
        <option>India</option>
        <option>USA</option>
        <option>Germany</option>
        <option>France</option>
      </select>

      {/* Search Bar */}
      <div className="flex flex-1 mx-6 items-center border rounded overflow-hidden bg-transparent">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full px-3 py-2 focus:outline-none bg-transparent"
        />
        <button className="bg-[#9575cd] text-white p-2 hover:bg-[#7e57c2]">
          <FaSearch />
        </button>
      </div>

      {/* Language Selector */}
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border px-2 py-1 rounded text-sm focus:outline-none mr-4 bg-transparent"
      >
        <option>EN</option>
        <option>HI</option>
        <option>FR</option>
      </select>

      {/* Toggle Dark Mode */}
      <button
        onClick={toggleDarkMode}
        className="text-2xl mr-4 hover:text-[#9575cd]"
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      {/* Icons and Profile */}
      <div className="flex items-center gap-4 text-xl">
        <Link to="/products" className="hover:text-[#9575cd]">
          <FaHeart />
        </Link>
        <Link to="/notifications" className="hover:text-[#9575cd]">
          <FaBell />
        </Link>

        {/* Post Ad */}
        <Link
          to="/sell"
          className="flex items-center gap-1 bg-[#9575cd] text-white px-3 py-1.5 rounded hover:bg-[#7e57c2]"
        >
          <FaPlusCircle />
          <span className="text-sm font-semibold">Sell</span>
        </Link>

        {/* Profile / Auth */}
        {!user ? (
          <div className="ml-2 flex gap-2">
            <Link
              to="/login"
              className="px-3 py-1 bg-[#9575cd] text-white rounded hover:bg-purple-700 text-sm"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-3 py-1 bg-[#7b669f33] text-black rounded hover:bg-purple-500 text-sm"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="relative">
            <button onClick={toggleProfileMenu} className="text-[#9575cd]">
              <FaUserCircle />
            </button>
            {showProfileMenu && (
              <div className={`absolute right-0 mt-2 w-48 ${darkMode ? "bg-[#37474F] text-white" : "bg-white text-slate-700"} shadow-lg border rounded z-10`}>
                <div className="p-2 border-b text-sm">
                  Hi, {user.fullname || user.username}
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  Profile
                </Link>
                <Link
                  to="/my-products"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  My Listings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-slate-700"
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

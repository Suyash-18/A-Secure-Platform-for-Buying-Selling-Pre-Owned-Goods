import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaSearch,
  FaPlus,
  FaHeart,
  FaBell,
  FaUserCircle,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

const Navbar = ({ toggleDarkMode, darkMode, onSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const profileRef = useRef(null);

  // ✅ Close profile dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // ✅ Search functionality trigger
  const handleSearch = () => {
    if (onSearch) onSearch(searchText);
    navigate(`/products?search=${searchText}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-md shadow-sm border-b transition-colors ${
        darkMode ? "bg-gray-900/80 text-white" : "bg-white/80 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* ✅ Logo */}
        <Link to="/" className="text-2xl font-bold text-purple-600">
          Fresh<span className="text-gray-700 dark:text-gray-300">Exchange</span>
        </Link>

        {/* ✅ Search + Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {/* Search Bar */}
          <div
            className={`flex items-center px-3 py-2 rounded-full ${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <input
              type="text"
              placeholder="Search items..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="bg-transparent outline-none w-56 text-sm"
            />
            <FaSearch
              onClick={handleSearch}
              className="text-purple-600 cursor-pointer"
            />
          </div>

          {/* Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="text-xl hover:text-purple-500"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {/* Wishlist & Notifications */}
          <Link to="/wishlist">
            <FaHeart className="text-lg hover:text-purple-500" />
          </Link>
          <Link to="/notifications">
            <FaBell className="text-lg hover:text-purple-500" />
          </Link>

          {/* Sell Button */}
          <Link
            to="/sell"
            className="bg-purple-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-purple-700 transition"
          >
            <FaPlus /> Sell
          </Link>

          {/* ✅ Profile Section */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="profile"
                    className="w-9 h-9 rounded-full border border-purple-500 object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-3xl text-purple-600" />
                )}
                <span className="text-sm max-w-[140px] truncate">
                  {user.fullname || user.username}
                </span>
              </button>

              {/* Dropdown */}
              {showProfileMenu && (
                <div
                  className={`absolute top-full right-0 mt-2 w-56 rounded-lg shadow-lg border z-50 ${
                    darkMode
                      ? "bg-gray-800 text-white border-gray-700"
                      : "bg-white text-gray-800 border-gray-200"
                  }`}
                >
                  <div className="px-4 py-2 border-b text-sm">
                    Hi, <b>{user.fullname || user.username}</b>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-purple-500/10"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/my-listings"
                    className="block px-4 py-2 text-sm hover:bg-purple-500/10"
                  >
                    My Listings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="px-4 py-2 border border-purple-600 text-purple-600 rounded-full hover:bg-purple-600 hover:text-white transition">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button className="md:hidden text-xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

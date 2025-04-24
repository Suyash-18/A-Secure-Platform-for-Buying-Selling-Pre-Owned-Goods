import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaSearch, FaPlusCircle, FaHeart, FaBell, FaUserCircle, FaMoon, FaSun } from "react-icons/fa";
import { useState } from "react";

const Navbar = ({ toggleDarkMode, darkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [location, setLocation] = useState("India");
  const [condition, setCondition] = useState("New");
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
        className={`border px-2 py-1 rounded ml-4 text-sm focus:outline-none ${darkMode ? "text-white bg-[#9575cd]" : "text-black bg-transparent"}`}
      >
        <option value="">Select City</option>
        <option value="Mumbai">Mumbai</option>
        <option value="Delhi">Delhi</option>
        <option value="Bangalore">Bangalore</option>
        <option value="Hyderabad">Hyderabad</option>
        <option value="Chennai">Chennai</option>
        <option value="Kolkata">Kolkata</option>
        <option value="Pune">Pune</option>
        <option value="Ahmedabad">Ahmedabad</option>
        <option value="Jaipur">Jaipur</option>
        <option value="Lucknow">Lucknow</option>
      </select>

      {/* Search Bar */}
      <div className="flex flex-1 mx-6 items-center border rounded overflow-hidden bg-transparent">
        <input
          type="text"
          placeholder="Search products..."
          className={`w-full px-3 py-2 focus:outline-none bg-transparent ${darkMode ? "text-white" : "text-black"}`}
        />
        <button className="bg-[#9575cd] text-white p-2 hover:bg-[#7e57c2]">
          <FaSearch />
        </button>
      </div>

      {/* Language Selector */}
      <select
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
        className={`border px-2 py-1 rounded text-sm focus:outline-none mr-4 ${darkMode ? "text-white bg-[#9575cd]" : "text-black bg-transparent"}`}
      >
        <option>New</option>
        <option>Like New</option>
        <option>Used</option>
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
              className={`px-3 py-1 bg-[#7b669f33] ${darkMode ? "text-white" : "text-black"} rounded hover:bg-purple-500 text-sm`}
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="relative">
  <button onClick={toggleProfileMenu} className="text-[#9575cd]">
    {user?.avatar ? (
      <img
        src={user.avatar}
        alt="User Avatar"
        className="w-10 h-10 rounded-full object-cover border-2 border-[#9575cd]"
      />
    ) : (
      <FaUserCircle className="w-10 h-10" />
    )}
  </button>

  {showProfileMenu && (
    <div className={`absolute right-0 mt-2 w-48 ${darkMode ? "bg-[#3a2e4f] text-white" : "bg-white text-slate-700"} shadow-lg border rounded z-10`}>
      <div className="p-2 border-b text-sm">
        Hi, {user.fullname || user.username}
      </div>
      <Link
        to="/profile"
        className="block px-4 py-2 text-sm hover:bg-[#9575cd]"
      >
        Profile
      </Link>
      <Link
        to="/my-listings"
        className="block px-4 py-2 text-sm hover:bg-[#9575cd]"
      >
        My Listings
      </Link>
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#9575cd]"
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

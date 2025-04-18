import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = ({ darkMode }) => {
  return (
    <footer className={`mt-10 p-6 ${darkMode ? "bg-[#9575cd] text-white" : "bg-gray-100 text-slate-800"}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Brand & Description */}
        <div>
          <Link to="/" className={`text-2xl font-bold ${darkMode ? "text-white" : "text-[#9575cd]"}`}>
            Fresh Exchange
          </Link>
          <p className="mt-2 text-sm">
            Your trusted platform to buy and sell preloved products. Quick, safe, and community-driven.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/about" className="hover:text-[#9575cd]">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-[#9575cd]">Contact</Link></li>
            <li><Link to="/help" className="hover:text-[#9575cd]">Help Center</Link></li>
            <li><Link to="/privacy" className="hover:text-[#9575cd]">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Location & Language */}
        <div>
          <h3 className="font-semibold mb-2">Preferences</h3>
          <div className="mb-2">
            <label className="block text-sm mb-1">Location</label>
            <select className="w-full px-2 py-1 rounded text-sm bg-transparent border">
              <option>India</option>
              <option>USA</option>
              <option>Germany</option>
              <option>France</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Language</label>
            <select className="w-full px-2 py-1 rounded text-sm bg-transparent border">
              <option>EN</option>
              <option>HI</option>
              <option>FR</option>
            </select>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="font-semibold mb-2">Follow Us</h3>
          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:text-[#9575cd]"><FaFacebook /></a>
            <a href="#" className="hover:text-[#9575cd]"><FaInstagram /></a>
            <a href="#" className="hover:text-[#9575cd]"><FaTwitter /></a>
            <a href="#" className="hover:text-[#9575cd]"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-300 dark:border-slate-600" />

      <p className="text-center text-sm">
        &copy; {new Date().getFullYear()} Fresh Exchange. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

import { useState } from "react";
import Footer from "../components/Footer";
import Products from "./Products";

const categories = [
  "All",
  "Mobile",
  "Laptops",
  "Electronics",
  "Furniture",
  "Vehicles",
  "Fashion",
  "Books",
  "Sports",
];

const Home = ({ darkMode }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      {/* ✅ Hero Section */}
      <div className="bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 py-16 text-center shadow-md">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white">
          Fresh Exchange
        </h1>
        <p className="text-lg mt-3 text-gray-600 dark:text-gray-300">
          Buy & Sell Pre-Owned Products with Trust and Ease.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Electronics • Fashion • Books • Vehicles and more
        </p>
      </div>

      {/* ✅ Category Filter Bar */}
      <div className="flex flex-wrap gap-3 justify-center mt-8 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-200 
              ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-200 dark:hover:bg-purple-500 dark:hover:text-white"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ✅ Products Section (Filtered) */}
      <div className="mt-10 px-4 md:px-8">
        <Products category={selectedCategory} />
      </div>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
};

export default Home;

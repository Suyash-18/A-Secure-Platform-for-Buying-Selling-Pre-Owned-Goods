import { useState } from "react";
import Footer from "../components/Footer";
import Products from "./Products";

const Home = ({ darkMode }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
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

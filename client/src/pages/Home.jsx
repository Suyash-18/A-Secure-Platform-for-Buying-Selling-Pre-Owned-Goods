import Footer from "../components/Footer";
import Products from "./Products";

const Home = ({ darkMode }) => {
  return (
    <div>
      {/* Hero Section */}
      <div className="p-6 text-center bg-[#faf4fd]">
        <h1 className="text-4xl font-bold text-center mt-6 text-[#37474F] mb-2">
          Welcome to Fresh Exchange
        </h1>
        <p className="text-center text-[#37474F] mb-10 text-lg">
          Find or sell second-hand goods with ease and trust.
        </p>
      </div>

      {/* Sample Products */}
      <Products />

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Home;

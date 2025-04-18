import Footer from "../components/Footer";
import Products from "./Products";

const Home = ({ darkMode }) => {
  return (
    <div>
      {/* Hero Section */}
      <div className="p-6 text-center">
        <h1 className="text-3xl font-semibold mb-4">Welcome to Fresh Exchange</h1>
        <p className="text-lg mb-6">
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

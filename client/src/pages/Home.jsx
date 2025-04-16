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
      <footer className={`${darkMode ? "bg-[#1E1E1E] text-white" : "bg-[#2E2E3A] text-white"} py-8 mt-8`}>
        <div className="container mx-auto px-6 text-center">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Fresh Exchange</h3>
            <p className="text-sm">
              Buy and sell second-hand goods with ease and trust. Explore products across various categories and get the best deals.
            </p>
          </div>
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
            <ul className="text-sm">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm">© 2025 Fresh Exchange. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

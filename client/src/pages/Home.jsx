import Navbar from "../components/Navbar";

const Home = () => {
  // Array of sample products
  const products = [
    {
      id: 1,
      name: "Product 1",
      description: "Description of product 1 goes here.",
      price: "₹500",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 2,
      name: "Product 2",
      description: "Description of product 2 goes here.",
      price: "₹800",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 3,
      name: "Product 3",
      description: "Description of product 3 goes here.",
      price: "₹1200",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 4,
      name: "Product 4",
      description: "Description of product 4 goes here.",
      price: "₹1500",
      image: "https://via.placeholder.com/300",
    },
    // Add more products as needed
    {
      id: 5,
      name: "Product 5",
      description: "Description of product 5 goes here.",
      price: "₹2000",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 6,
      name: "Product 6",
      description: "Description of product 6 goes here.",
      price: "₹3500",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 7,
      name: "Product 7",
      description: "Description of product 7 goes here.",
      price: "₹4000",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 8,
      name: "Product 8",
      description: "Description of product 8 goes here.",
      price: "₹4500",
      image: "https://via.placeholder.com/300",
    },
  ];

  return (
    <div className="bg-[#F8F8FF] min-h-screen text-[#2E2E3A]">
      

      {/* Hero Section */}
      <div className="p-6 text-center">
        <h1 className="text-3xl font-semibold mb-4">Welcome to Fresh Exchange</h1>
        <p className="text-lg mb-6">
          Find or sell second-hand goods with ease and trust.
        </p>
      </div>

      {/* Sample Products */}
      <div className="px-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Loop through the products array */}
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-500 mb-2">{product.description}</p>
              <p className="font-semibold text-xl">{product.price}</p>
              <button className="w-full bg-blue-500 text-white py-2 mt-4 rounded-lg">
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#2E2E3A] text-white py-8 mt-8">
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

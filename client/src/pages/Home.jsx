import Navbar from "../components/Navbar";

const Home = () => {
  // Array of sample products
  const products = [
    {
      id: 1,
      name: "Samsung Galaxy S21",
      description: "Used Samsung Galaxy S21 in excellent condition with original box and charger.",
      price: "₹24,000",
      image: "https://images.olx.in/thumbnails/295360076-800x600.webp",
    },
    {
      id: 2,
      name: "Wooden Study Table",
      description: "Spacious wooden study table with drawers. Slight wear and tear on surface.",
      price: "₹3,500",
      image: "https://images.olx.in/thumbnails/295360077-800x600.webp",
    },
    {
      id: 3,
      name: "LG 32-inch LED TV",
      description: "Fully functional 32-inch LG TV. Wall mount included.",
      price: "₹7,800",
      image: "https://images.olx.in/thumbnails/295360078-800x600.webp",
    },
    {
      id: 4,
      name: "Bajaj Mixer Grinder",
      description: "Gently used Bajaj mixer with 3 jars. Works perfectly.",
      price: "₹1,500",
      image: "https://images.olx.in/thumbnails/295360079-800x600.webp",
    },
    {
      id: 5,
      name: "Hero Sprint Bicycle",
      description: "Hero Sprint mountain bicycle with 21 gears. Minor scratches.",
      price: "₹4,200",
      image: "https://images.olx.in/thumbnails/295360080-800x600.webp",
    },
    {
      id: 6,
      name: "Apple MacBook Air (2019)",
      description: "MacBook Air 2019, i5, 8GB RAM, 128GB SSD. Battery health 85%.",
      price: "₹35,000",
      image: "https://images.olx.in/thumbnails/295360081-800x600.webp",
    },
    {
      id: 7,
      name: "Sony PlayStation 4",
      description: "PS4 with one controller and 3 games included. Good condition.",
      price: "₹18,000",
      image: "https://images.olx.in/thumbnails/295360082-800x600.webp",
    },
    {
      id: 8,
      name: "Double Bed with Mattress",
      description: "King size wooden bed with comfortable mattress. 1 year old.",
      price: "₹6,500",
      image: "https://images.olx.in/thumbnails/295360083-800x600.webp",
    },
    {
      id: 9,
      name: "Dell Inspiron 15 Laptop",
      description: "Dell Inspiron 15, i5, 8GB RAM, 1TB HDD. Lightly used.",
      price: "₹28,000",
      image: "https://images.olx.in/thumbnails/295360084-800x600.webp",
    },
    {
      id: 10,
      name: "Whirlpool 190L Refrigerator",
      description: "Single door Whirlpool refrigerator. 2 years old.",
      price: "₹7,000",
      image: "https://images.olx.in/thumbnails/295360085-800x600.webp",
    },
    {
      id: 11,
      name: "Canon EOS 1500D Camera",
      description: "Canon DSLR with 18-55mm lens. Excellent condition.",
      price: "₹20,000",
      image: "https://images.olx.in/thumbnails/295360086-800x600.webp",
    },
    {
      id: 12,
      name: "IFB 6kg Washing Machine",
      description: "Front load IFB washing machine. Fully functional.",
      price: "₹12,000",
      image: "https://images.olx.in/thumbnails/295360087-800x600.webp",
    },
    {
      id: 13,
      name: "Yamaha F310 Acoustic Guitar",
      description: "Yamaha F310 acoustic guitar. Barely used.",
      price: "₹5,500",
      image: "https://images.olx.in/thumbnails/295360088-800x600.webp",
    },
    {
      id: 14,
      name: "HP DeskJet 2135 Printer",
      description: "All-in-one HP printer. Good working condition.",
      price: "₹2,000",
      image: "https://images.olx.in/thumbnails/295360089-800x600.webp",
    },
    {
      id: 15,
      name: "Samsung Galaxy Tab A7",
      description: "Samsung tablet with 10.4-inch display. Lightly used.",
      price: "₹12,000",
      image: "https://images.olx.in/thumbnails/295360090-800x600.webp",
    },
    {
      id: 16,
      name: "LG 1.5 Ton Split AC",
      description: "LG split AC with inverter technology. 3 years old.",
      price: "₹18,000",
      image: "https://images.olx.in/thumbnails/295360091-800x600.webp",
    },
    {
      id: 17,
      name: "Nikon D3500 DSLR Camera",
      description: "Nikon DSLR with 18-55mm lens. Excellent condition.",
      price: "₹22,000",
      image: "https://images.olx.in/thumbnails/295360092-800x600.webp",
    },
    {
      id: 18,
      name: "Godrej 3-Door Wardrobe",
      description: "Spacious Godrej wardrobe with mirror. Minor scratches.",
      price: "₹9,000",
      image: "https://images.olx.in/thumbnails/295360093-800x600.webp",
    },
    {
      id: 19,
      name: "Lenovo ThinkPad X1 Carbon",
      description: "Lenovo ThinkPad, i7, 16GB RAM, 512GB SSD. Business laptop.",
      price: "₹45,000",
      image: "https://images.olx.in/thumbnails/295360094-800x600.webp",
    },
    {
      id: 20,
      name: "Philips Air Fryer",
      description: "Philips air fryer. Hardly used.",
      price: "₹3,500",
      image: "https://images.olx.in/thumbnails/295360095-800x600.webp",
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

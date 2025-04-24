import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const MyListings = () => {
  const { user } = useAuth();
  const [myProducts, setMyProducts] = useState([]);
  const navigate = useNavigate(); // Hook for programmatic navigation

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/user/${user._id}`);
        const data = await res.json();
        setMyProducts(data.products);
      } catch (err) {
        console.error("Failed to fetch listings:", err);
      }
    };

    if (user?._id) {
      fetchMyProducts();
    }
  }, [user]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="p-6 min-h-screen bg-[#f9faf9]">
      <h2 className="text-3xl font-bold text-[#9575cd] mb-6">My Listings</h2>

      {myProducts.length === 0 ? (
        <p className="text-slate-600">You haven't listed any products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {myProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-md p-4 flex flex-col cursor-pointer" // Added cursor-pointer for visual feedback
              onClick={() => handleProductClick(product._id)} // Added onClick handler
            >
              <img
                src={product.images?.[0]?.url || 'https://via.placeholder.com/400?text=No+Image'}
                alt={product.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              <h3 className="text-lg font-semibold text-[#37474F]">{product.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{product.condition}</p>
              <p className="text-xl font-bold text-[#9575cd] mb-4">₹{product.price}</p>
              <Link
                to={`/edit-product/${product._id}`}
                className="mt-auto bg-[#9575cd] hover:bg-[#7e57c2] text-white text-sm py-2 rounded text-center"
              >
                Edit Listing
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const MyListings = () => {
  const { user } = useAuth();
  const [myProducts, setMyProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products/user/${user._id}`
        );
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
    <div className="p-6 min-h-screen bg-gradient-to-b from-[#f3e5f5] to-[#ede7f6]">
      <h2 className="text-4xl font-extrabold text-[#5e35b1] mb-10 text-center">
        My Listings
      </h2>

      {myProducts.length === 0 ? (
        <p className="text-slate-600 text-center text-lg">
          You haven't listed any products yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {myProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col"
              onClick={() => handleProductClick(product._id)}
            >
              {/* Image Container */}
             {/* Image Container */}
              <div className="relative w-full h-56 flex items-center justify-center bg-gray-100">
                <img
                  src={
                    product.images?.[0]?.url ||
                    "https://via.placeholder.com/400?text=No+Image"
                  }
                  alt={product.title}
                  className="max-h-full max-w-full object-contain transition duration-500"
                />
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-[#37474F] truncate">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{product.condition}</p>
                <p className="text-2xl font-bold text-[#7e57c2] mb-4">
                  ₹{product.price}
                </p>

                {/* Edit Button */}
                <Link
                  to={`/edit-product/${product._id}`}
                  onClick={(e) => e.stopPropagation()} // prevent navigation when clicking edit
                  className="mt-auto bg-[#7e57c2] hover:bg-[#5e35b1] text-white text-sm py-2 px-4 rounded-lg text-center shadow-md transition"
                >
                  Edit Listing
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;

// src/pages/MyListings.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";

const MyListings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [myProducts, setMyProducts] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch user's listings
  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products/user/${user._id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setMyProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch listings:", err);
      }
    };

    if (user?._id) {
      fetchMyProducts();
    }
  }, [user]);

  // ✅ Actual delete function (runs only after confirmation)
  const confirmDelete = async (productId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/products/delete/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (data.success) {
        setMyProducts((prev) =>
          prev.filter((item) => item._id !== productId)
        );
        showToast({
          type: "success",
          message: "Product deleted successfully ✅",
        });
      } else {
        showToast({
          type: "error",
          message: data.message || "Failed to delete product ❌",
        });
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast({
        type: "error",
        message: "Something went wrong while deleting ❌",
      });
    }
  };

  // ✅ This shows confirmation toast instead of window.confirm()
  const handleDelete = (productId) => {
  showToast({
    type: "warning", // Still warning type (optional)
    message: (
      <div className="bg-white shadow-lg rounded-lg border border-gray-300 p-4 w-full max-w-xs mx-auto text-gray-800">
        <p className="font-medium mb-3 text-center">
          Are you sure you want to delete this listing?
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => confirmDelete(productId)}
            className="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-700 transition"
          >
            Yes
          </button>
          <button
            onClick={() => showToast({ type: 'info', message: 'Cancelled' })}
            className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    duration: 5000,       // visible for longer
    position: "top-center", // helps make it appear like a modal
  });
};

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-[#faf7ff] to-[#f3edff]">
      <h2 className="text-4xl font-extrabold text-[#5e35b1] mb-10 text-center">
        My Listings
      </h2>

      {myProducts.length === 0 ? (
        <p className="text-slate-600 text-center text-lg">
          You haven’t listed any products yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {myProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition hover:-translate-y-1 overflow-hidden flex flex-col border border-gray-200"
            >
              {/* Product Image */}
              <div className="relative w-full h-48 flex items-center justify-center bg-gray-50">
                <img
                  src={
                    product.images?.[0]?.url ||
                    "https://via.placeholder.com/400?text=No+Image"
                  }
                  alt={product.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-500">{product.condition}</p>
                <p className="text-xl font-bold text-purple-600 mt-1">
                  ₹{product.price}
                </p>

                <div className="mt-auto pt-4 flex justify-between gap-2">
                  <Link
                    to={`/edit-productt/${product._id}`}
                    className="flex-1 text-center border border-gray-300 bg-white text-gray-700 py-1.5 rounded-md text-sm hover:bg-gray-100 transition"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 text-center border border-red-300 bg-white text-red-600 py-1.5 rounded-md text-sm hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;

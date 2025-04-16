// src/pages/Products.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);     // Error state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/all");
        if (res.data?.success) {
          setProducts(res.data.products);
        } else {
          setError("Failed to fetch products.");
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("An error occurred while fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9faf9] p-6 flex items-center justify-center">
        <p className="text-xl text-[#9575cd]">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f9faf9] p-6 flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9faf9] p-6">
      <h2 className="text-3xl font-bold mb-6 text-[#9575cd]">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <img
              src={product.images[0]?.url}
              alt={product.title}
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="text-xl mt-2 font-semibold text-[#37474F]">
              {product.title}
            </h3>
            <p className="text-[#9575cd] font-medium">₹ {product.price}</p>
            <p className="text-sm text-gray-500">
              {product.location?.city || "Unknown Location"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Products;

// src/pages/Products.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.error("Fetch error:", err);
        setError("An error occurred while fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf4fd] flex items-center justify-center">
        <p className="text-xl text-[#9575cd]">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#faf4fd] flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf4fd] p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-[#9575cd] mb-4">Products</h2>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="block break-inside-avoid bg-white p-4 rounded-2xl shadow hover:shadow-lg transition border border-[#f0e9ff]"
            >
              <img
                src={product.images[0]?.url}
                alt={product.title}
                className="w-full mb-3 object-cover rounded-xl"
              />
              <h3 className="text-lg font-semibold text-[#37474F]">
                {product.title}
              </h3>
              <p className="text-[#9575cd] font-medium text-base">
                ₹ {product.price}
              </p>
              <p className="text-sm text-gray-500">
                {product.location?.city || "Unknown Location"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;

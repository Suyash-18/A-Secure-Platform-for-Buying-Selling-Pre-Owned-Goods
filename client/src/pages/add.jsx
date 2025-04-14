import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../context/productcontext";
import { useToast } from "../contexts/ToastContext";

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useContext(ProductContext);
  const { showToast } = useToast();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setProduct({ ...product, image: files[0] });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!product.name || !product.price || !product.image) {
        showToast({ message: "Please fill all required fields", type: "error" });
        return;
      }
      
      addProduct(product);
      showToast({ message: "Product added successfully", type: "success" });
      navigate("/products");
    } catch (error) {
      showToast({ message: "Failed to add product", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f9faf9] p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-[#9575cd]">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#9575cd]"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Price *</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#9575cd]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#9575cd]"
              rows="4"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Product Image *</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#9575cd]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#9575cd] text-white py-2 px-4 rounded hover:bg-[#7e57c2] transition-colors"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

const AddProduct = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    condition: "Used",
    category: "",
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      coordinates: {
        lat: "",
        lng: "",
      },
    },
    images: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      setProduct({ ...product, images: Array.from(files) });
    } else if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setProduct({
        ...product,
        location: {
          ...product.location,
          [key]: value,
        },
      });
    } else if (name.startsWith("coordinates.")) {
      const key = name.split(".")[1];
      setProduct({
        ...product,
        location: {
          ...product.location,
          coordinates: {
            ...product.location.coordinates,
            [key]: value,
          },
        },
      });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.title || !product.price || product.images.length === 0) {
      showToast({ message: "Please fill all required fields", type: "error" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", product.title);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("condition", product.condition);
      formData.append("category", product.category);
      formData.append("location", JSON.stringify(product.location)); // 🔥 send whole object as string

      product.images.forEach((img) => formData.append("images", img));

      const res = await axios.post("/api/v1/product/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // if using cookie-based auth
      });

      if (res.data.data.success) {
        showToast({ message: "Product added successfully", type: "success" });
        navigate("/products");
      } else {
        throw new Error("Server error");
      }
    } catch (err) {
      console.error("Add Product Error:", err);
      showToast({ message: "Failed to add product", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f9faf9] p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-[#9575cd]">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Product Title *"
            value={product.title}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#9575cd]"
            required
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={product.description}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#9575cd]"
          />

          <input
            type="number"
            name="price"
            placeholder="Price *"
            value={product.price}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#9575cd]"
            required
          />

          <select
            name="condition"
            value={product.condition}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#9575cd]"
          >
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Used">Used</option>
          </select>

          <input
            type="text"
            name="category"
            placeholder="Category *"
            value={product.category}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#9575cd]"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="location.address"
              placeholder="Address"
              value={product.location.address}
              onChange={handleChange}
              className="border rounded p-2"
            />
            <input
              type="text"
              name="location.city"
              placeholder="City"
              value={product.location.city}
              onChange={handleChange}
              className="border rounded p-2"
            />
            <input
              type="text"
              name="location.state"
              placeholder="State"
              value={product.location.state}
              onChange={handleChange}
              className="border rounded p-2"
            />
            <input
              type="text"
              name="location.country"
              placeholder="Country"
              value={product.location.country}
              onChange={handleChange}
              className="border rounded p-2"
            />
            <input
              type="number"
              step="any"
              name="coordinates.lat"
              placeholder="Latitude"
              value={product.location.coordinates.lat}
              onChange={handleChange}
              className="border rounded p-2"
            />
            <input
              type="number"
              step="any"
              name="coordinates.lng"
              placeholder="Longitude"
              value={product.location.coordinates.lng}
              onChange={handleChange}
              className="border rounded p-2"
            />
          </div>

          <input
            type="file"
            name="images"
            accept="image/*"
            onChange={handleChange}
            multiple
            className="w-full border rounded p-2"
            required
          />

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

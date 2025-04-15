import React, { useState } from "react";

const SellForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "Mumbai",
    category: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Product listed successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-purple-700">Sell Your Item</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            placeholder="E.g. iPhone 12 Pro"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Describe your item..."
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            name="price"
            placeholder="E.g. 15000"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium mb-1">Location</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
          >
            <option value="Mumbai">Mumbai</option>
            <option value="Pune">Pune</option>
            <option value="Delhi">Delhi</option>
            <option value="Nagpur">Nagpur</option>
            <option value="Chennai">Chennai</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Vehicles">Vehicles</option>
            <option value="Books">Books</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-1">Upload Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-medium"
          >
            Submit Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellForm;

import React, { useState } from "react";
import axios from "axios";
import Toaster from "../components/Toaster";
import { useNavigate } from "react-router-dom"; // Add navigate for redirection

const SellForm = () => {
  const navigate = useNavigate(); // For redirect after successful form submission
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: {
      address: "",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      coordinates: {
        lat: "",
        lng: "",
      },
    },
    images: [],
  });

  const [error, setError] = useState(""); // Move error and success states outside handleSubmit
  const [success, setSuccess] = useState(""); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const keys = name.split(".");
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [keys[1]]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  const fetchCoordinates = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/geocode", {
        address: formData.location.address,
        city: formData.location.city,
        state: formData.location.state,
        country: formData.location.country,
      });

      return res.data.coordinates;
    } catch (error) {
      console.error("Failed to fetch coordinates:", error);
      throw new Error("Could not fetch coordinates. Please check the location fields.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const coordinates = await fetchCoordinates();

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("condition", formData.condition);

      const locationWithCoords = {
        ...formData.location,
        coordinates,
      };

      data.append("location", JSON.stringify(locationWithCoords));

      formData.images.forEach((img) => {
        data.append("images", img);
      });

      const response = await axios.post("http://localhost:5000/api/products/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      console.log("Created:", response.data);
      setSuccess("Product listed successfully!");      
      setTimeout(() => navigate("/"), 2000); // Redirect after success
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.response?.data?.message || "Failed to list product. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      {error && <Toaster message={error} onClose={() => setError("")} type="error" />}
      {success && <Toaster message={success} onClose={() => setSuccess("")} type="success" />}
      <h2 className="text-2xl font-bold mb-6 text-purple-700">Sell Your Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            name="location.address"
            placeholder="Address"
            value={formData.location.address}
            onChange={handleInputChange}
            required
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="location.city"
            placeholder="City"
            value={formData.location.city}
            onChange={handleInputChange}
            required
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="location.state"
            placeholder="State"
            value={formData.location.state}
            onChange={handleInputChange}
            required
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="location.country"
            placeholder="Country"
            value={formData.location.country}
            onChange={handleInputChange}
            required
            className="border px-3 py-2 rounded"
          />
        </div>

        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Books">Books</option>
          <option value="Other">Other</option>
        </select>

        <select
          name="condition"
          value={formData.condition}
          onChange={handleInputChange}
          required
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">Select Condition</option>
          <option value="New">New</option>
          <option value="Like New">Like New</option>
          <option value="Used">Used</option>
        </select>

        <div>
          <label className="block font-medium mb-1">Upload Images</label>
          <label className="border-dashed border-2 border-purple-500 w-full h-32 rounded flex items-center justify-center cursor-pointer text-purple-600">
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <span className="text-3xl">+</span>
          </label>
          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {formData.images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="h-32 w-full object-cover rounded shadow"
                  />
                  <p className="text-xs mt-1 truncate">{file.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
        >
          Submit Listing
        </button>
      </form>
    </div>
  );
};

export default SellForm;

// src/pages/EditListing.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../contexts/ToastContext";

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const imageInputRef = useRef(null);
  const billInputRef = useRef(null);

  // ✅ All fields same as AddProduct
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    condition: "Used",
    description: "",
    warranty: "",
    accessories: "",
    location: { address: "", city: "", state: "", country: "" },
  });

  // ✅ Existing images/bills from server
  const [oldImages, setOldImages] = useState([]);
  const [oldBills, setOldBills] = useState([]);

  // ✅ Newly selected (not uploaded yet)
  const [newImages, setNewImages] = useState([]);
  const [newBills, setNewBills] = useState([]);

  const [loading, setLoading] = useState(false);

  // ✅ Fetch existing product on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        if (res.data.success) {
          const prod = res.data.product;
          setFormData({
            title: prod.title || "",
            price: prod.price || "",
            category: prod.category || "",
            condition: prod.condition || "Used",
            description: prod.description || "",
            warranty: prod.warranty || "",
            accessories: prod.accessories || "",
            location: {
              address: prod.location?.address || "",
              city: prod.location?.city || "",
              state: prod.location?.state || "",
              country: prod.location?.country || "",
            },
          });

          setOldImages(prod.images || []);   // Existing product images
          setOldBills(prod.bills || []);     // Existing bills
        }
      } catch (err) {
        showToast({ type: "error", message: "Failed to load product" });
      }
    };

    fetchProduct();
  }, [id, showToast]);
  // ✅ Handle simple fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle nested location fields
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  // ✅ Add new images
  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  // ✅ Add new bills
  const handleNewBills = (e) => {
    const files = Array.from(e.target.files);
    setNewBills((prev) => [...prev, ...files]);
  };

  // ✅ Submit FormData (only add new images, old remain unchanged)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = new FormData();

      updateData.append("title", formData.title);
      updateData.append("price", formData.price);
      updateData.append("category", formData.category);
      updateData.append("condition", formData.condition);
      updateData.append("description", formData.description);
      updateData.append("warranty", formData.warranty);
      updateData.append("accessories", formData.accessories);
      updateData.append("location", JSON.stringify(formData.location));

      // ✅ Only append new images/bills
      newImages.forEach((file) => updateData.append("images", file));
      newBills.forEach((file) => updateData.append("bills", file));

      const res = await axios.put(
        `http://localhost:5000/api/products/update/${id}`,
        updateData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        showToast({ type: "success", message: "Product updated successfully!" });
       navigate("/my-listings");
      }
    } catch (error) {
      showToast({ type: "error", message: "Failed to update product!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        
        <h2 className="text-2xl font-semibold text-purple-700 mb-6">
          Edit Listing
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ✅ Basic Fields */}
          <div>
            <label className="text-gray-700 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-2 w-full border px-4 py-2 rounded-lg focus:ring-purple-500"
              required
            />
          </div>

          {/* ✅ Price & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-700 font-medium">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-2 w-full border px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-2 w-full border px-4 py-2 rounded-lg"
              />
            </div>
          </div>

          {/* ✅ Description */}
          <div>
            <label className="text-gray-700 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="mt-2 w-full border px-4 py-2 rounded-lg"
            />
          </div>

          {/* ✅ Warranty & Accessories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-700 font-medium">Warranty</label>
              <input
                name="warranty"
                value={formData.warranty}
                onChange={handleChange}
                placeholder="Optional"
                className="mt-2 w-full border px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium">Accessories</label>
              <input
                name="accessories"
                value={formData.accessories}
                onChange={handleChange}
                placeholder="Optional"
                className="mt-2 w-full border px-4 py-2 rounded-lg"
              />
            </div>
          </div>

          {/* ✅ Location */}
          <div>
            <h3 className="font-medium">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <input
                type="text"
                name="address"
                value={formData.location.address}
                onChange={handleLocationChange}
                placeholder="Address"
                className="border px-4 py-2 rounded-lg"
              />
              <input
                type="text"
                name="city"
                value={formData.location.city}
                onChange={handleLocationChange}
                placeholder="City"
                className="border px-4 py-2 rounded-lg"
              />
              <input
                type="text"
                name="state"
                value={formData.location.state}
                onChange={handleLocationChange}
                placeholder="State"
                className="border px-4 py-2 rounded-lg"
              />
              <input
                type="text"
                name="country"
                value={formData.location.country}
                onChange={handleLocationChange}
                placeholder="Country"
                className="border px-4 py-2 rounded-lg"
              />
            </div>
          </div>

          {/* ✅ Existing Images */}
          <div>
            <label className="font-medium">Existing Images</label>
            <div className="flex gap-3 mt-3">
              {oldImages.length > 0 ? oldImages.map((img, idx) => (
                <img key={idx} src={img.url} alt="" className="w-24 h-24 object-cover rounded-lg border" />
              )) : <p className="text-gray-500">No images uploaded</p>}
            </div>
          </div>

          {/* ✅ Upload New Images */}
          <div>
            <label className="font-medium">Add New Images</label>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleNewImages}
              className="mt-2 w-full text-sm"
            />
            {newImages.length > 0 && (
              <div className="flex gap-3 mt-3">
                {newImages.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt="new"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                ))}
              </div>
            )}
          </div>

          {/* ✅ Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditListing;

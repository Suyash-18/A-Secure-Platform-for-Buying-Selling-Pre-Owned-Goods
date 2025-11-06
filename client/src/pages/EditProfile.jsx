import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../contexts/ToastContext";

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    username: user?.username || "",
    email: user?.email || "",
  });

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  // ✅ Field-wise error handling
  const [errors, setErrors] = useState({
    username: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ username: "", email: "" });

    const formData = new FormData();
    formData.append("fullname", form.fullname);
    formData.append("username", form.username);
    formData.append("email", form.email);
    if (avatar) formData.append("avatar", avatar);
    if (coverImage) formData.append("coverImage", coverImage);

    try {
      await axios.put(
        "http://localhost:5000/api/v1/user/update-profile",
        formData,
        { withCredentials: true }
      );

      showToast({ message: "Profile updated successfully!", type: "success" });
      navigate("/profile");
    } catch (err) {
      const msg = err?.response?.data?.message || "Update failed!";

      if (msg.includes("Username")) {
        setErrors((prev) => ({ ...prev, username: "Username already taken!" }));
      } else if (msg.includes("Email")) {
        setErrors((prev) => ({ ...prev, email: "Email already registered!" }));
      } else {
        showToast({ message: msg, type: "error" });
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 border border-purple-100"
      >
        {/* 📌 Cover Image */}
        <div className="relative w-full h-32 bg-gray-200 rounded-lg overflow-hidden mb-16">
          <img
            src={
              coverImage
                ? URL.createObjectURL(coverImage)
                : user?.coverImage || "https://via.placeholder.com/600x200"
            }
            alt="Cover"
            className="object-cover w-full h-full"
          />
          <label className="absolute bottom-2 right-2 bg-purple-600 text-white px-3 py-1 text-sm rounded-lg shadow cursor-pointer">
            Change Cover
            <input
              type="file"
              className="hidden"
              onChange={(e) => setCoverImage(e.target.files[0])}
            />
          </label>
        </div>

        {/* 📌 Avatar */}
        <div className="flex justify-center -mt-20 mb-5">
          <div className="relative">
            <img
              src={
                avatar
                  ? URL.createObjectURL(avatar)
                  : user?.avatar || "https://via.placeholder.com/150"
              }
              alt="Avatar"
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-purple-600 text-white text-xs px-2 py-1 rounded-full cursor-pointer">
              Edit
              <input
                type="file"
                className="hidden"
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* ✅ Full Name */}
        <label className="block text-gray-600 mb-1">Full Name</label>
        <input
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          placeholder="Enter full name"
        />

        {/* ✅ Username (with inline error) */}
        <label className="block text-gray-600 mt-4 mb-1">Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none ${
            errors.username ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter username"
        />
        {errors.username && (
          <p className="text-red-500 text-xs mt-1">{errors.username}</p>
        )}

        {/* ✅ Email (with inline error) */}
        <label className="block text-gray-600 mt-4 mb-1">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter email"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}

        {/* ✅ Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="px-5 py-2 border border-gray-400 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;

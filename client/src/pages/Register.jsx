import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toaster from "../components/Toaster";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [dragOver, setDragOver] = useState({ avatar: false, cover: false });
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // ✅ Password validation function
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // ✅ Cleanup previews
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [avatarPreview, coverPreview]);

  // ✅ Text input handler
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      if (!validatePassword(value)) {
        setPasswordError("Min 8 chars, 1 uppercase, 1 number & 1 special character required.");
      } else {
        setPasswordError("");
      }
    }
  };

  // ✅ Set file and generate preview
  const setFile = (name, file) => {
    if (!file) return;
    if (!file.type?.startsWith("image/")) {
      setError("Please upload only image files.");
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: file }));
    const url = URL.createObjectURL(file);

    if (name === "avatar") {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(url);
    } else if (name === "coverImage") {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      setCoverPreview(url);
    }
  };

  // ✅ Drag & Drop Handlers
  const handleDrop = (name) => (e) => {
    e.preventDefault();
    setDragOver((d) => ({ ...d, [name]: false }));
    setFile(name, e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (name) => (e) => {
    e.preventDefault();
    setDragOver((d) => ({ ...d, [name]: true }));
  };

  const handleDragLeave = (name) => (e) => {
    e.preventDefault();
    setDragOver((d) => ({ ...d, [name]: false }));
  };

  const handlePick = (name) => (e) => setFile(name, e.target.files?.[0]);

  // ✅ Clear image preview
  const clearImage = (name) => {
    if (name === "avatar") {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
      setFormData((p) => ({ ...p, avatar: null }));
    } else {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      setCoverPreview(null);
      setFormData((p) => ({ ...p, coverImage: null }));
    }
  };

  // ✅ Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.avatar) return setError("Avatar is required.");
    if (!validatePassword(formData.password)) return setError("Invalid password format.");

    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) data.append(key, formData[key]);
    }

    try {
      await axios.post("http://localhost:5000/api/v1/user/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setSuccess("Registration successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const message = err?.response?.data?.message || "Something went wrong.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
      {error && <Toaster message={error} onClose={() => setError("")} type="error" />}
      {success && <Toaster message={success} onClose={() => setSuccess("")} type="success" />}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-purple-200 space-y-4"
        encType="multipart/form-data"
      >
        {/* Brand */}
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
            FX
          </div>
          <h2 className="text-2xl font-bold mt-3 text-gray-800">FreshExchange</h2>
          <p className="text-sm text-gray-500">Create your account</p>
        </div>

        {/* Full Name */}
        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300"
          onChange={handleTextChange}
          required
        />

        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300"
          onChange={handleTextChange}
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300"
          onChange={handleTextChange}
          required
        />

        {/* Password + Show/Hide */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className={`w-full p-3 bg-gray-50 border ${
              passwordError ? "border-red-400" : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-purple-300`}
            onChange={handleTextChange}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}

        {/* Avatar Upload (Drag + Drop) */}
        <div>
          <label className="text-sm font-medium text-gray-700">Avatar (required)</label>
          <div
            onDrop={handleDrop("avatar")}
            onDragOver={handleDragOver("avatar")}
            onDragLeave={handleDragLeave("avatar")}
            className={`mt-2 p-4 border-2 rounded-lg text-center ${
              dragOver.avatar ? "border-purple-500 bg-purple-50" : "border-dashed border-gray-300 bg-gray-50"
            }`}
          >
            <input type="file" accept="image/*" onChange={handlePick("avatar")} className="hidden" id="avatarInput" />
            <label htmlFor="avatarInput" className="cursor-pointer text-sm text-purple-600">
              Drag & drop or <span className="font-semibold">click to upload</span>
            </label>
          </div>

          {avatarPreview && (
            <div className="flex items-center gap-3 mt-3">
              <img src={avatarPreview} alt="Avatar" className="w-16 h-16 rounded-full border object-cover" />
              <button type="button" className="text-sm text-red-500" onClick={() => clearImage("avatar")}>
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="text-sm font-medium text-gray-700">Cover Image (optional)</label>
          <div
            onDrop={handleDrop("coverImage")}
            onDragOver={handleDragOver("coverImage")}
            onDragLeave={handleDragLeave("coverImage")}
            className={`mt-2 p-4 border-2 rounded-lg text-center ${
              dragOver.cover ? "border-purple-500 bg-purple-50" : "border-dashed border-gray-300 bg-gray-50"
            }`}
          >
            <input type="file" accept="image/*" onChange={handlePick("coverImage")} className="hidden" id="coverInput" />
            <label htmlFor="coverInput" className="cursor-pointer text-sm text-purple-600">
              Drag & drop or <span className="font-semibold">click to upload</span>
            </label>
          </div>

          {coverPreview && (
            <div className="mt-3">
              <img src={coverPreview} alt="Cover" className="w-full h-32 rounded-lg object-cover border" />
              <button type="button" className="text-sm text-red-500 mt-2" onClick={() => clearImage("cover")}>
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Submit */}
        <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition">
          Sign Up
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-purple-600 font-semibold hover:underline">Login here</a>
        </p>
      </form>
    </div>
  );
};

export default Register;

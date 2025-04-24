import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toaster from "../components/Toaster";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.avatar) {
      return setError("Avatar is required");
    }

    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    try {
        let res = await axios.post("http://localhost:5000/api/v1/user/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setSuccess("Registered successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const html = err?.response?.data;
      let message = "Something went wrong.";

      // Try to extract message from <pre> tag if it's HTML
      if (typeof html === "string" && html.includes("<pre>")) {
        const matches = html.match(/<pre>(.*?)<\/pre>/s);
        if (matches && matches[1]) {
          message = matches[1].split("<br>")[0].replace("Error:", "").trim(); // Extract only the first error line
        }
      } else if (err?.response?.data?.message) {
        message = err.response.data.message; // standard JSON error
    }

    setError(message); // or display it however you're doing now
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#9575cd66] relative">
      {error && <Toaster message={error} onClose={() => setError("")} type="error" />}
      {success && <Toaster message={success} onClose={() => setSuccess("")} type="success" />}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold mb-4 text-[#9575cd]">Create an Account</h2>
        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          className="w-full border border-[#9575cd] p-3 rounded"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full border border-[#9575cd] p-3 rounded"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border border-[#9575cd] p-3 rounded"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border border-[#9575cd] p-3 rounded"
          onChange={handleChange}
          required
        />
        <label className="block text-sm font-medium text-[#37474F]">Avatar (required)</label>
        <input
          type="file"
          name="avatar"
          accept="image/*"
          className="w-full border border-[#9575cd] p-2 rounded"
          onChange={handleChange}
          required
        />
        <label className="block text-sm font-medium text-[#37474F]">Cover Image (optional)</label>
        <input
          type="file"
          name="coverImage"
          accept="image/*"
          className="w-full border border-[#9575cd] p-2 rounded"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full bg-[#FF7043] text-white font-semibold py-2 px-4 rounded hover:bg-[#f26535] transition-colors"
        >
          Sign Up
        </button>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-[#9575cd] font-semibold hover:underline">
            Login here
          </a>
          </p>
      </form>
    </div>
  );
};

export default Register;

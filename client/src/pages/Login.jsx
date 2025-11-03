import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Toaster from "../components/Toaster";
import {jwtDecode} from "jwt-decode";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- GOOGLE LOGIN SETUP ---
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: "178540745723-jkllm1668tn8tjis51ishui0al180gjl.apps.googleusercontent.com", // ⬅️ Replace with your real Client ID
        callback: handleGoogleResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("googleLoginBtn"),
        { theme: "outline", size: "large", width: "100%" }
      );
    }
  }, []);

  // Handle Google login response
  const handleGoogleResponse = async (response) => {
    try {
      const decoded = jwtDecode(response.credential);
      console.log("Google User:", decoded);

      const res = await axios.post(
        "http://localhost:5000/api/v1/user/google-login",
        { token: response.credential },
        { withCredentials: true }
      );

      login(res.data.data.user);
      setSuccess("Logged in with Google");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error(err);
      setError("Google login failed");
    }
  };

  // --- NORMAL LOGIN HANDLER ---
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/login",
        credentials,
        { withCredentials: true }
      );
      login(res.data.data.user);
      setSuccess("Login successful");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      const html = err?.response?.data;
      let message = "Something went wrong.";

      if (typeof html === "string" && html.includes("<pre>")) {
        const matches = html.match(/<pre>(.*?)<\/pre>/s);
        if (matches && matches[1]) {
          message = matches[1]
            .split("<br>")[0]
            .replace("Error:", "")
            .trim();
        }
      } else if (err?.response?.data?.message) {
        message = err.response.data.message;
      }

      setError(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#9575cd66] relative">
      {error && <Toaster message={error} onClose={() => setError("")} type="error" />}
      {success && <Toaster message={success} onClose={() => setSuccess("")} type="success" />}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-[#9575cd] text-center">Welcome Back</h2>

        {/* Username Input */}
        <input
          type="text"
          name="username"
          placeholder="Username or Email"
          className="w-full border border-[#9575cd] p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#a680e9]"
          onChange={handleChange}
          required
        />

        {/* Password Input */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border border-[#9575cd] p-3 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-[#a680e9]"
          onChange={handleChange}
          required
        />

        {/* Normal Login Button */}
        <button
          type="submit"
          className="w-full bg-[#FF7043] text-white font-semibold py-2 px-4 rounded hover:bg-[#f26535] transition-colors"
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google Login Button */}
        <div id="googleLoginBtn" className="flex justify-center"></div>

        {/* Register Link */}
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-[#9575cd] font-semibold hover:underline">
            Register here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;

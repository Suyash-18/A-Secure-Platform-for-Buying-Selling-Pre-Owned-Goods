import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Toaster from "../components/Toaster";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/v1/user/login", credentials, {
        withCredentials: true,
      });
      login(res.data.data.user);
      console.log(res.message); // Removed toString()
      setSuccess("Login successful");
      setTimeout(() => navigate("/"), 1000);
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
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-[#9575cd]">Welcome Back</h2>
        <input
          type="text"
          name="username"
          placeholder="Username or Email"
          className="w-full border border-[#9575cd] p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#a680e9]"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border border-[#9575cd] p-3 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-[#a680e9]"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-[#FF7043] text-white font-semibold py-2 px-4 rounded hover:bg-[#f26535] transition-colors"
        >
          Login
        </button>
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

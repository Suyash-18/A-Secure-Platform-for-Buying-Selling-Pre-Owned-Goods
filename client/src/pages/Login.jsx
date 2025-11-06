import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Toaster from "../components/Toaster";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load Google script and render button (works on first load)
  useEffect(() => {
    const ensureGoogle = () =>
      new Promise((resolve) => {
        if (window.google?.accounts?.id) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => resolve(true);
        document.body.appendChild(script);
      });

    (async () => {
      await ensureGoogle();
      /* global google */
      google.accounts.id.initialize({
        client_id:
          "178540745723-jkllm1668tn8tjis51ishui0al180gjl.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });

      const mount = document.getElementById("googleLoginBtn");
      if (mount) {
        google.accounts.id.renderButton(mount, {
          theme: "outline",
          size: "large",
          width: "100%",
        });
      }
    })();
  }, []);

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
          message = matches[1].split("<br>")[0].replace("Error:", "").trim();
        }
      } else if (err?.response?.data?.message) {
        message = err.response.data.message;
      }
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
      {error && <Toaster message={error} onClose={() => setError("")} type="error" />}
      {success && <Toaster message={success} onClose={() => setSuccess("")} type="success" />}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-purple-100"
      >
        {/* Brand */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center justify-center shadow-md">
            <span className="font-bold">FX</span>
          </div>
          <h2 className="text-2xl font-bold mt-3 text-gray-800">FreshExchange</h2>
          <p className="text-gray-500 text-sm">Welcome back</p>
        </div>

        {/* Google */}
        <div id="googleLoginBtn" className="w-full mb-4 flex justify-center"></div>

        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <input
          type="text"
          name="username"
          placeholder="Email or Username"
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-gray-50"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-gray-50"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Login
        </button>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-purple-600 font-semibold hover:underline">
            Register here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;

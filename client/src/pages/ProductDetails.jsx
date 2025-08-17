// src/pages/ProductDetails.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { motion } from "framer-motion";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        if (res.data?.success) {
          setProduct(res.data.product);
          setMainImage(res.data.product.images?.[0]?.url || "");
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        setError("An error occurred while fetching the product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Auto-reply from seller
    setTimeout(() => {
      const reply = {
        sender: "seller",
        text: "Thanks for reaching out! I’ll get back to you shortly.",
      };
      setMessages((prev) => [...prev, reply]);
    }, 1000);
  };

  if (loading) return <p className="text-center py-20">Loading product...</p>;
  if (error || !product)
    return (
      <div className="text-center py-20">
        <h2>{error || "Product not found"}</h2>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-700 transition"
        >
          Back to Products
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8 space-y-12">
        
        {/* -------- TOP SECTION -------- */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left: Product Images */}
         {/* Left: Product Images */}
<div className="lg:w-2/3 flex flex-col items-center">
  <div className="rounded-xl overflow-hidden shadow-lg max-w-md w-full">
    <img
      src={mainImage || "https://via.placeholder.com/400?text=No+Image"}
      alt={product.title}
      className="w-full h-[280px] object-cover"
    />
  </div>
  {/* Thumbnails */}
  <div className="flex space-x-3 mt-4 overflow-x-auto pb-2">
    {product.images?.map((img, i) => (
      <img
        key={i}
        src={img.url}
        alt="thumbnail"
        onClick={() => setMainImage(img.url)}
        className={`w-20 h-20 object-cover border-2 rounded-lg cursor-pointer transition-transform 
        ${mainImage === img.url ? "border-purple-600 scale-110" : "border-gray-200 hover:border-purple-400 hover:scale-105"}`}
      />
    ))}
  </div>
</div>


          {/* Right: Chat Box */}
          <div className="lg:w-1/3 bg-gray-50 rounded-2xl p-6 shadow-inner flex flex-col border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Chat with Seller</h2>

            {!chatOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
                className="flex-1 flex items-center justify-center text-gray-500 italic"
              >
                Start Chat with Seller 💬
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col space-y-3 overflow-y-auto p-3 bg-white rounded-lg border">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl text-sm max-w-[75%] shadow-sm ${
                      msg.sender === "user"
                        ? "bg-purple-600 text-white self-end rounded-br-none"
                        : "bg-gray-200 text-gray-800 self-start rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}

            {!chatOpen ? (
              <button
                onClick={() => {
                  if (!user) {
                    showToast({ message: "Please login to chat", type: "error" });
                    navigate("/login");
                    return;
                  }
                  setChatOpen(true);
                  showToast({ message: "Chat started!", type: "success" });
                }}
                className="mt-4 bg-purple-600 text-white py-3 rounded-lg shadow hover:bg-purple-700 transition"
              >
                Start Chat
              </button>
            ) : (
              <div className="mt-4 flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-purple-600 text-white px-5 rounded-lg shadow hover:bg-purple-700 transition"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>

        {/* -------- BOTTOM SECTION -------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Bottom Left: Product Description */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
            <p className="text-2xl text-purple-600 font-semibold">₹ {product.price}</p>
            <p className="text-gray-500">{product.location?.city || "Unknown Location"}</p>

            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Description</h2>
              <p className="text-gray-600 leading-relaxed">{product.description || "No description available"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4 text-gray-700">
              <p><span className="font-medium">Condition:</span> {product.condition}</p>
              <p><span className="font-medium">Category:</span> {product.category}</p>
            </div>

            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Proof & Accessories</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Bill: {product.billAvailable ? "Available" : "Not Available"}</li>
                <li>Warranty: {product.warranty ? "Available" : "Not Available"}</li>
                <li>Accessories: {product.accessories || "Not Mentioned"}</li>
              </ul>
            </div>
          </div>

          {/* Bottom Right: Map */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Location</h2>
            <div className="rounded-xl overflow-hidden shadow">
              <iframe
                title="map"
                width="100%"
                height="320"
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  product.location?.city || "India"
                )}&output=embed`}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

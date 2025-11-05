// src/pages/ProductDetails.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { motion } from "framer-motion";
import CheckoutButton from "../components/CheckoutButton";

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

    setTimeout(() => {
      const reply = {
        sender: "seller",
        text: "Thanks for reaching out! I’ll get back to you shortly.",
      };
      setMessages((prev) => [...prev, reply]);
    }, 1000);
  };

  if (loading) return <p className="text-center py-20 text-gray-600">Loading product...</p>;

  if (error || !product)
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-semibold text-gray-700">{error || "Product not found"}</h2>
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
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-12">

        {/* ✅ TOP SECTION */}
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ✅ Left: Product Images */}
          <div className="lg:w-2/3 flex flex-col items-center">
            <div className="relative rounded-xl overflow-hidden shadow-lg max-w-md w-full group">
              <img
                src={mainImage || "https://via.placeholder.com/400?text=No+Image"}
                alt={product.title}
                className="w-full h-[350px] object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex space-x-3 mt-4 overflow-x-auto pb-2">
              {product.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt="thumbnail"
                  onClick={() => setMainImage(img.url)}
                  className={`w-20 h-20 object-cover border-2 rounded-lg cursor-pointer transition 
                    ${mainImage === img.url
                      ? "border-purple-600 scale-110"
                      : "border-gray-200 hover:border-purple-400 hover:scale-105"
                    }`}
                />
              ))}
            </div>
          </div>
          {/* ✅ Right: Chat Box */}
          <div className="lg:w-1/3 bg-gradient-to-b from-gray-50 to-white rounded-2xl p-6 shadow border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-800">Chat with Seller</h2>
              <span className="text-xs text-gray-500">
                {chatOpen ? "Online" : "Tap to start"}
              </span>
            </div>

            {!chatOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.8 }}
                className="flex-1 flex items-center justify-center text-gray-500 italic rounded-lg bg-white/70 border border-dashed border-gray-300"
              >
                Start a conversation 💬
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col space-y-3 overflow-y-auto p-3 bg-white rounded-lg border">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-2xl text-sm max-w-[75%] shadow-sm ${
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
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

        {/* ✅ BOTTOM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Product Details (2 columns wide) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700 ring-1 ring-inset ring-purple-200">
                  {product.condition}
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-200">
                  {product.category}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <p className="text-3xl text-purple-700 font-bold">₹ {product.price}</p>
              {product.createdAt && (
                <span className="text-xs text-gray-500">
                  Posted on {new Date(product.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* ✅ Payment */}
            <div className="mt-2">
              <CheckoutButton amount={product.price} productId={product._id} />
            </div>

            {/* Location short line */}
            <p className="text-gray-500">
              {product?.location?.address ? `${product.location.address}, ` : ""}
              {product?.location?.city || "Unknown City"}
            </p>

            {/* Description */}
            <div className="border rounded-2xl p-5">
              <h2 className="text-lg font-semibold mb-2 text-gray-900">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {product.description || "No description available"}
              </p>
            </div>

            {/* Specs / Meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Details</h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-500">Condition</span>
                    <span className="font-medium">{product.condition}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Category</span>
                    <span className="font-medium">{product.category}</span>
                  </li>
                  {product?.location?.state && (
                    <li className="flex justify-between">
                      <span className="text-gray-500">State</span>
                      <span className="font-medium">{product.location.state}</span>
                    </li>
                  )}
                  {product?.location?.country && (
                    <li className="flex justify-between">
                      <span className="text-gray-500">Country</span>
                      <span className="font-medium">{product.location.country}</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="rounded-2xl border p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Proof & Accessories</h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-center justify-between">
                    <span className="text-gray-500">Bills</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product?.bills?.length ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {product?.bills?.length ? "Available" : "Not Available"}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-gray-500">Warranty</span>
                    <span className="font-medium">{product.warranty || "Not Available"}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-gray-500">Accessories</span>
                    <span className="font-medium">{product.accessories || "Not Mentioned"}</span>
                  </li>
                </ul>

                {/* Bills Preview Thumbnails if available */}
                {product?.bills?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Bills</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {product.bills.map((b, i) => (
                        <a
                          key={i}
                          href={b.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-lg overflow-hidden border hover:ring-2 hover:ring-purple-300 transition"
                          title="Open bill"
                        >
                          <img
                            src={b.url}
                            alt={`bill-${i}`}
                            className="w-full h-24 object-cover"
                            onError={(e) => {
                              // fallback to icon if not an image
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          {/* If not an image, we still keep link visible */}
                          {/* Could add a generic document icon here if you prefer */}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Location Map */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">Location</h2>
            <div className="rounded-2xl overflow-hidden shadow ring-1 ring-gray-200">
              <iframe
                title="map"
                width="100%"
                height="320"
                loading="lazy"
                allowFullScreen
                src={(() => {
                  const lat = product?.location?.coordinates?.lat;
                  const lng = product?.location?.coordinates?.lng;
                  if (lat && lng) {
                    return `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`;
                  }
                  const q =
                    product?.location?.address
                      ? `${product.location.address}, ${product.location.city || ""}, ${product.location.state || ""}, ${product.location.country || ""}`
                      : product?.location?.city || "India";
                  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=12&output=embed`;
                })()}
              />
            </div>

            {/* Address block */}
            <div className="mt-4 rounded-2xl border p-4 text-sm text-gray-700 bg-white">
              <p className="font-medium text-gray-900 mb-1">Address</p>
              <p className="text-gray-700">
                {product?.location?.address ? product.location.address : "—"}
              </p>
              <p className="text-gray-700">
                {[product?.location?.city, product?.location?.state, product?.location?.country]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;

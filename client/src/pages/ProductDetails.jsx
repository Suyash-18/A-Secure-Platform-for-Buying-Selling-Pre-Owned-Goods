import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import CheckoutButton from "../components/CheckoutButton";
import ChatBox from "../components/ChatBox";
import CheckoutFlow from "../components/CheckoutFlow";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  // ✅ All states defined at top (correct order)
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [chatId, setChatId] = useState(null);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]); // ✅ Added missing state
  const chatEndRef = useRef(null);
  const [chatData, setChatData] = useState(null);

  useEffect(() => {
    if (!user) return;
    axios
      .get(`http://localhost:5000/api/chats/product/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data?.data?.chat) {
          setChatData(res.data.data); // { chat, messages }
        }
      });
  }, [id, user]);

  const handleStartChat = async () => {
    // If chat already exists, just open it
    if (chatData?.chat) return openChat(chatData.chat._id, chatData.messages);

    // Else create it
    const res = await axios.post(
      "http://localhost:5000/api/chats/get-or-create",
      { id, sellerId: product.seller._id },
      { withCredentials: true }
    );

    openChat(res.data.data.chat._id, res.data.data.messages);
  };

  // ✅ Fetch product details
  useEffect(() => {
    if (!id) return;
    console.log("🟣 Product ID from URL:", id);

    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/products/${id}`,
          { withCredentials: true }
        );
        console.log("🟢 Product fetched:", res.data.product);
        if (res.data?.success) {
          setProduct(res.data.product);
          setMainImage(res.data.product.images?.[0]?.url || "");
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("An error occurred while fetching the product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
  // ✅ Auto-load chat if it already exists
  useEffect(() => {
    const fetchExistingChat = async () => {
      if (!user || !product?._id) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/chats/product/${product._id}`,
          { withCredentials: true }
        );

        const chatData = res.data?.data;

        if (chatData?.chat?._id) {
          console.log("💬 Existing chat found:", chatData.chat._id);
          setChatId(chatData.chat._id);
          setMessages(
            chatData.messages.map((msg) => ({
              sender: msg.sender._id === user._id ? "user" : "seller",
              text: msg.text,
            }))
          );
          setChatOpen(true);
        }
      } catch (err) {
        console.error("Error loading existing chat:", err);
      }
    };

    fetchExistingChat();
  }, [user, product]);

  // ✅ Start Chat handler
  const onStartChatClick = () => setShowSafetyModal(true);

  const onContinueToChat = async () => {
    setShowSafetyModal(false);

    if (!user) {
      showToast({ message: "Please login to chat", type: "error" });
      navigate("/login");
      return;
    }

    if (!product || !product.seller?._id) {
      showToast({ message: "Seller info unavailable.", type: "error" });
      console.error("❌ Seller data missing:", product);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/chats/get-or-create",
        {
          productId: product._id,
          sellerId: product.seller._id,
        },
        { withCredentials: true }
      );

      console.log("🟢 Chat response:", res.data);

      const chatData = res.data?.data;

      if (chatData?.chat?._id) {
        const chatId = chatData.chat._id;
        const existingMessages = chatData.messages || [];

        console.log("✅ Chat created/fetched:", chatId);
        console.log("💬 Existing messages:", existingMessages);

        setChatId(chatId);

        // ✅ Load any previous messages
        setMessages(
          existingMessages.map((msg) => ({
            sender: msg.sender._id === user._id ? "user" : "seller",
            text: msg.text,
          }))
        );

        setChatOpen(true);
        showToast({ message: "Chat started successfully!", type: "success" });
      } else {
        console.warn("⚠️ Chat response missing chat data:", res.data);
        showToast({
          message: "Chat started, but no chat details received.",
          type: "warning",
        });
      }
    } catch (err) {
      console.error("Error setting up chat:", err);
      showToast({ message: "Failed to start chat.", type: "error" });
    }
  };

  if (loading)
    return (
      <p className="text-center py-20 text-gray-600">Loading product...</p>
    );

  if (error || !product)
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-semibold text-gray-700">
          {error || "Product not found"}
        </h2>
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
        {/* ==================== TOP SECTION ==================== */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* ✅ Product Images */}
          <div className="lg:w-2/3 flex flex-col items-center">
            <div className="relative rounded-xl overflow-hidden shadow-lg max-w-md w-full group">
              <img
                src={
                  mainImage || "https://via.placeholder.com/400?text=No+Image"
                }
                alt={product.title}
                className="w-full h-[350px] object-contain transition-transform duration-300 group-hover:scale-105"
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
                    ${
                      mainImage === img.url
                        ? "border-purple-600 scale-110"
                        : "border-gray-200 hover:border-purple-400 hover:scale-105"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* ✅ Chat Section */}
          <div className="lg:w-1/3 bg-gradient-to-b from-gray-50 to-white rounded-2xl p-6 shadow border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-800">
                Chat with Seller
              </h2>
              <span className="text-xs text-gray-500">
                {chatOpen ? "Online" : "Tap to start"}
              </span>
            </div>

            {user && product.seller && user._id === product.seller._id ? (
              <button
                disabled
                className="mt-4 bg-gray-400 text-white py-3 rounded-lg shadow cursor-not-allowed"
              >
                You are the Seller
              </button>
            ) : !chatOpen ? (
              <button
                onClick={onStartChatClick}
                className="mt-4 bg-purple-600 text-white py-3 rounded-lg shadow hover:bg-purple-700 transition"
              >
                Start Chat
              </button>
            ) : (
              <ChatBox
                chatId={chatId}
                messages={messages}
                setMessages={setMessages}
              />
            )}
          </div>
        </div>

        {/* ==================== PRODUCT DETAILS SECTION ==================== */}
        <ProductInfoSection product={product} user={user} />
      </div>

      {/* ==================== SAFETY MODAL ==================== */}
      <AnimatePresence>
        {showSafetyModal && (
          <SafetyModal
            onClose={() => setShowSafetyModal(false)}
            onContinue={onContinueToChat}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;

/* ------------ PRODUCT INFO SECTION ------------- */
const ProductInfoSection = ({ product, user }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
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
          <p className="text-3xl text-purple-700 font-bold">
            ₹ {product.price}
          </p>
          {product.createdAt && (
            <span className="text-xs text-gray-500">
              Posted on {new Date(product.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="mt-4">
          {user && product.seller && user._id === product.seller._id ? (
            <p className="text-red-500 font-medium">
              ⚠️ You cannot purchase your own product.
            </p>
          ) : (
            // <CheckoutButton amount={product.price} productId={product._id} />
            <CheckoutFlow
              product={product}
              amount={product.price}
              user={user}
              onComplete={(order) => {
                console.log("ORDER COMPLETED", order);
              }}
            />
          )}
        </div>

        <p className="text-gray-500">
          {product?.location?.address ? `${product.location.address}, ` : ""}
          {product?.location?.city || "Unknown City"}
        </p>

        <div className="border rounded-2xl p-5">
          <h2 className="text-lg font-semibold mb-2 text-gray-900">
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {product.description || "No description available"}
          </p>
        </div>
      </div>

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
                product?.location?.address ||
                product?.location?.city ||
                "India";
              return `https://www.google.com/maps?q=${encodeURIComponent(
                q
              )}&z=12&output=embed`;
            })()}
          />
        </div>
      </div>
    </div>
  );
};

/* ------------ SAFETY MODAL COMPONENT ------------- */
const SafetyModal = ({ onClose, onContinue }) => {
  React.useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 12 }}
        className="relative mx-auto mt-20 w-[92%] max-w-xl rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 rounded-full p-2 bg-orange-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-orange-600"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M1.43 18.57 10.3 3.98c.8-1.35 2.61-1.35 3.41 0l8.87 14.59c.82 1.35-.17 3.08-1.71 3.08H3.14c-1.54 0-2.53-1.73-1.71-3.08zM12 8c.55 0 1 .45 1 1v5a1 1 0 1 1-2 0V9c0-.55.45-1 1-1zm0 9.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5z" />
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Tips for a safe deal
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>• Don’t enter UPI PIN/OTP or scan unknown QR codes.</li>
              <li>• Never give money or product in advance.</li>
              <li>• Report suspicious users to the platform.</li>
              <li>• Don’t share personal details like IDs or photos.</li>
              <li>• Be cautious during meetings.</li>
            </ul>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onContinue}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 shadow"
              >
                Continue to chat
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

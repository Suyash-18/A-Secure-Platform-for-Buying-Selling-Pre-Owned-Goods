// src/components/CheckoutButton.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const CheckoutButton = ({ amount, productId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      return navigate("/login");
    }

    try {
      // 1. Create Razorpay order
      const res = await fetch(`${apiBase}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          productId,
          userId: user?._id || user?.id,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert("Order creation failed");
        return;
      }

      // 2. Razorpay Options
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "FreshExchange",
        description: "Purchase Payment",
        order_id: data.orderId, // Razorpay order ID

        // ✅ Runs ONLY on successful payment
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${apiBase}/api/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: data.dbOrderId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              navigate(`/payment-success/${verifyData.orderId}`);
            } else {
              navigate("/payment-failed");
            }
          } catch (err) {
            navigate("/payment-failed");
          }
        },

        // ❌ Runs when user closes/cancels payment
        modal: {
          ondismiss: function () {
            console.log("Payment cancelled by user");
            navigate("/payment-failed");
          },
        },

        prefill: {
          name: user?.username || "User",
          email: user?.email || "example@gmail.com",
        },
        theme: {
          color: "#FF7043",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      navigate("/payment-failed");
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-[#FF7043] text-white font-semibold py-2 px-4 rounded hover:bg-[#f26535]"
    >
      Pay ₹{amount}
    </button>
  );
};

export default CheckoutButton;

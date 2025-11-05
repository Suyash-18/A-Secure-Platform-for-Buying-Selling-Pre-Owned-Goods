import React from "react";

const CheckoutButton = ({ amount }) => {
  const handlePayment = async () => {
    const res = await fetch("http://localhost:5000/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();

    if (!data.success) return alert("Order failed");

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "Your App Name",
      description: "Payment for product",
      order_id: data.order.id,
      handler: function (response) {
        alert("Payment successful: " + response.razorpay_payment_id);
        // Optionally send details to backend to save in DB
      },
      theme: { color: "#FF7043" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-[#FF7043] text-white px-4 py-2 rounded hover:bg-[#f26535]"
    >
      Pay ₹{amount}
    </button>
  );
};

export default CheckoutButton;

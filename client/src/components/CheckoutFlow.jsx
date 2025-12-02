import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import CheckoutButton from "./CheckoutButton";

/**
 * CheckoutFlow.jsx
 * Single-file React component that implements a 3-step checkout flow:
 * 1) Delivery options
 * 2) Order summary
 * 3) Payment options (launches Razorpay checkout)
 *
 * Usage:
 * <CheckoutFlow product={product} amount={product.price} onComplete={(order)=>{}}
 *
 * Notes:
 * - Expects Tailwind CSS for styling (you can adapt classes to your system)
 * - Requires REACT_APP_RAZORPAY_KEY in your frontend env for Razorpay client key
 * - The component will POST to /api/payments/create-order and /api/payments/verify-payment
 *   (you can adapt URLs for your backend)
 */

const CheckoutFlow = ({ product, amount, user, onComplete = () => {} }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0); // 0=delivery,1=summary,2=payment
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderMeta, setOrderMeta] = useState(null);

  useEffect(() => {
    if (!open) {
      // reset wizard when closed
      setStep(0);
      setSelectedAddress(null);
      setNotes("");
      setOrderMeta(null);
    }
  }, [open]);

  // load user addresses (example - adapt to your API)
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        // If you have an endpoint, call it. This demo uses a fallback example address.
        // const res = await axios.get('/api/user/addresses', { withCredentials: true });
        // setAddresses(res.data.addresses || []);
        setAddresses([
          {
            id: "home",
            label: "Home",
            line1: "221B Baker Street",
            city: "London",
            pincode: "NW1 6XE",
            phone: "9999999999",
          },
        ]);
        setSelectedAddress({
          id: "home",
          label: "Home",
          line1: "221B Baker Street",
          city: "London",
          pincode: "NW1 6XE",
          phone: "9999999999",
        });
      } catch (err) {
        console.error("Could not load addresses", err);
      }
    };

    if (open) fetchAddresses();
  }, [open]);

  const openCheckout = () => setOpen(true);
  const closeCheckout = () => setOpen(false);

  const next = () => setStep((s) => Math.min(2, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <>
      <button
        onClick={openCheckout}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700"
      >
        Pay ₹{amount}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/40" onClick={closeCheckout} />

            <motion.div
              initial={{ y: 20, scale: 0.99 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.99 }}
              className="relative z-10 w-[95%] max-w-3xl bg-white rounded-2xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Checkout</h3>
                <div className="text-sm text-gray-500">Step {step + 1} of 3</div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {step === 0 && (
                    <DeliveryStep
                      addresses={addresses}
                      selectedAddress={selectedAddress}
                      setSelectedAddress={setSelectedAddress}
                      notes={notes}
                      setNotes={setNotes}
                    />
                  )}

                  {step === 1 && (
                    <SummaryStep
                      product={product}
                      amount={amount}
                      selectedAddress={selectedAddress}
                      notes={notes}
                    />
                  )}

                  {step === 2 && (
                    <PaymentStep
                      product={product}
                      amount={amount}
                      selectedAddress={selectedAddress}
                      notes={notes}
                      setOrderMeta={setOrderMeta}
                      onComplete={(meta) => {
                        setOrderMeta(meta);
                        onComplete(meta);
                        closeCheckout();
                      }}
                    />
                  )}
                </div>

                <aside className="lg:col-span-1 border rounded-2xl p-4">
                  <h4 className="text-sm font-medium text-gray-700">Order summary</h4>
                  <div className="mt-3">
                    <div className="flex justify-between text-gray-700">
                      <span>{product?.title || "Item"}</span>
                      <span>₹{amount}</span>
                    </div>

                    <div className="flex justify-between text-gray-500 text-sm mt-2">
                      <span>Delivery</span>
                      <span>Free</span>
                    </div>

                    <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{amount}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2">
                    {step > 0 && (
                      <button
                        onClick={back}
                        className="px-3 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
                      >
                        Back
                      </button>
                    )}

                    {step < 2 && (
                      <button
                        onClick={() => {
                          // validation: require address for step 1
                          if (step === 0 && !selectedAddress) {
                            alert("Please select a delivery address to continue.");
                            return;
                          }
                          next();
                        }}
                        className="px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                      >
                        Continue
                      </button>
                    )}
                  </div>
                </aside>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/** Delivery step component */
const DeliveryStep = ({ addresses, selectedAddress, setSelectedAddress, notes, setNotes }) => {
  return (
    <div>
      <h4 className="text-md font-semibold mb-3">Delivery options</h4>

      <div className="space-y-3">
        {addresses.length > 0 ? (
          addresses.map((a) => (
            <label
              key={a.id}
              className={`block p-3 rounded-lg border cursor-pointer ${selectedAddress?.id === a.id ? "ring-2 ring-purple-500" : "hover:bg-gray-50"}`}
            >
              <input
                type="radio"
                name="addr"
                className="mr-2"
                checked={selectedAddress?.id === a.id}
                onChange={() => setSelectedAddress(a)}
              />
              <div className="text-sm font-medium">{a.label}</div>
              <div className="text-xs text-gray-600">{a.line1}, {a.city} - {a.pincode}</div>
              <div className="text-xs text-gray-600">{a.phone}</div>
            </label>
          ))
        ) : (
          <div className="p-3 text-sm text-gray-600">No saved addresses. You can add one at checkout.</div>
        )}

        <div>
          <label className="text-sm font-medium">Delivery note (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Leave note for delivery (e.g. gate code, preferred time)"
            className="mt-2 w-full rounded-lg border p-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

/** Summary step component */
const SummaryStep = ({ product, amount, selectedAddress, notes }) => {
  return (
    <div>
      <h4 className="text-md font-semibold mb-3">Review and confirm</h4>

      <div className="border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <img src={product?.images?.[0]?.url || "https://via.placeholder.com/80"} alt="thumb" className="w-20 h-20 object-cover rounded-md" />
          <div>
            <div className="font-medium">{product?.title || "Product"}</div>
            <div className="text-sm text-gray-500">Qty: 1</div>
            <div className="text-sm text-gray-700 font-semibold mt-2">₹{amount}</div>
          </div>
        </div>

        <div className="mt-4">
          <h5 className="text-sm font-medium">Deliver to</h5>
          <div className="mt-1 text-sm text-gray-700">{selectedAddress ? `${selectedAddress.line1}, ${selectedAddress.city} - ${selectedAddress.pincode}` : "No address selected"}</div>
          {notes && <div className="mt-2 text-sm text-gray-500">Note: {notes}</div>}
        </div>
      </div>
    </div>
  );
};

/** Payment step component */
const PaymentStep = ({ product, amount, selectedAddress, notes, setOrderMeta, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePay = async () => {
    setLoading(true);
    try {
      // 1. Create order on server (server should return an order id and amount)
      const res = await fetch(`${apiBase}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount, productId: product?._id }),
      });

      const data = await res.json();
      console.log("/api/payment/create-order ->", data);

      if (!data.success) {
        alert(data.message || "Order creation failed");
        setLoading(false);
        return;
      }

      // 2. Ensure SDK loaded
      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Failed to load payment SDK");

      // 3. Prepare options using server response
      const options = {
        key: data.key || import.meta.env.VITE_RAZORPAY_KEY || window.__RAZORPAY_KEY__,
        amount: data.amount || data.orderAmount,
        currency: data.currency || "INR",
        name: "FreshExchange",
        description: `Purchase: ${product?.title}`,
        order_id: data.orderId || (data.order && data.order.id),

        // NOTE: -- NO server-side verification here --
        // We directly treat the payment handler as success and call onComplete.
        handler: function (response) {
          console.log("Razorpay success response (unverified):", response);
          // Build a lightweight client-side order object to pass to parent
          const clientOrder = {
            payment: response,
            productId: product?._id,
            amount,
            address: selectedAddress,
            notes,
            createdAt: new Date().toISOString(),
          };

          // set local meta and notify parent
          setOrderMeta(clientOrder);
          onComplete(clientOrder);

          // Optionally, you may still call a server route to persist the order without verifying signature
          // fetch(`${apiBase}/api/orders/create-from-payment`, { method: 'POST', headers:{'Content-Type':'application/json'}, credentials:'include', body: JSON.stringify(clientOrder) })
          //   .then(() => console.log('Order saved (no verification)'))
          //   .catch((e)=>console.warn('Failed to save order', e));
        },

        modal: {
          ondismiss: function () {
            console.log("Payment cancelled by user");
          },
        },

        prefill: {
          name: (window.__USER__ && window.__USER__.username) || "User",
          email: (window.__USER__ && window.__USER__.email) || "",
        },

        theme: { color: "#FF7043" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on && rzp.on("payment.failed", function (resp) {
        console.error("payment.failed event:", resp);
        alert("Payment failed. See console for details.");
      });

      rzp.open();
    } catch (err) {
      console.error("Payment error", err);
      alert("Payment failed to start.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="text-md font-semibold mb-3">Choose payment method</h4>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <div className="font-medium">Card / UPI / Netbanking</div>
            <div className="text-sm text-gray-500">Fast & secure (Razorpay)</div>
          </div>
         <CheckoutButton amount={amount} productId={product?._id} />
        </div>

        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <div className="font-medium">Cash on delivery</div>
            <div className="text-sm text-gray-500">Pay when the product is delivered</div>
          </div>
          <button
            onClick={() => {
              // COD: create order on your server and finish
              fetch(`${apiBase}/api/orders/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId: product?._id, amount, address: selectedAddress, notes, paymentType: "COD" }),
              })
                .then((r) => r.json())
                .then((res) => {
                  if (res.success) {
                    setOrderMeta(res.data);
                    onComplete(res.data);
                  } else {
                    alert(res.message || "Could not place COD order");
                  }
                })
                .catch((e) => {
                  console.error(e);
                  alert("Could not place COD order");
                });
            }}
            className="px-4 py-2 rounded-lg bg-gray-100"
          >
            Confirm COD
          </button>
        </div>

        <div className="text-xs text-gray-500 mt-2">You will have a chance to review your order before final submission.</div>
      </div>
    </div>
  );
};

export default CheckoutFlow;

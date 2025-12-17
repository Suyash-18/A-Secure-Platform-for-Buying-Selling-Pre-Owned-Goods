// src/pages/Profile.jsx
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [listingsRes, ordersRes] = await Promise.all([
          fetch(`http://localhost:5000/api/products/user/${user?._id}`),
          fetch(`http://localhost:5000/api/order/user/${user?._id}`),
        ]);

        const listingsData = await listingsRes.json();
        const ordersData = await ordersRes.json();

        setMyListings(listingsData.products || []);
        setMyOrders(ordersData.orders || []);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchUserData();
  }, [user]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-purple-600 font-semibold text-xl">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-10">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={user?.avatar || "https://via.placeholder.com/120?text=User"}
            alt="User Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 shadow-md"
          />
          <div className="text-center">
            <h2 className="text-2xl font-bold">{user?.fullname || user?.username}</h2>
            <p className="text-gray-500">@{user?.username}</p>
            <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => navigate("/edit-profile")}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition shadow"
            >
              Edit Profile
            </button>
            <Link
              to="/my-listings"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              View All Listings
            </Link>
          </div>
        </div>

        {/* My Listings */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-purple-700">
            My Recent Listings
          </h3>

          {myListings.length === 0 ? (
            <p className="text-gray-500">You haven’t posted any listings yet.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {myListings.slice(0, 3).map((product) => (
                <div
                  key={product._id}
                  className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4"
                >
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <h4 className="text-lg font-semibold mt-3">{product.title}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600 text-sm">{product.condition}</span>
                    <span className="text-purple-600 font-bold">₹{product.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Orders */}
        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-4 text-purple-700">
            My Orders
          </h3>

          {myOrders.length === 0 ? (
            <p className="text-gray-500">You haven’t placed any orders yet.</p>
          ) : (
            <div className="space-y-5">
              {myOrders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition"
                >
                  <div className="flex justify-between mb-2">
                    <p className="text-gray-500 text-sm">
                      Order ID: <span className="font-medium">{order._id}</span>
                    </p>
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        order.paymentInfo?.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.paymentInfo?.status || "pending"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {order.items.map((item) => (
                      <div key={item.product?._id} className="flex items-center gap-3 w-full sm:w-[48%]">
                        <img
                          src={
                            item.product?.images?.[0]?.url ||
                            "https://via.placeholder.com/80"
                          }
                          alt={item.product?.title}
                          className="w-20 h-20 rounded-lg object-cover border"
                        />
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-500">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-between text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Total:</span> ₹{order.totalAmount}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

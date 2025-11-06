// src/pages/Profile.jsx
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products/user/${user?._id}`
        );
        const data = await res.json();
        setMyListings(data.products || []);
      } catch (err) {
        console.error("Failed to fetch user listings:", err);
      }
    };

    if (user?._id) {
      fetchMyListings();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
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
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Recent Listings</h3>

          {myListings.length === 0 ? (
            <p className="text-gray-500">You haven't posted any listings yet.</p>
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
                    <span className="text-gray-600 text-sm">
                      {product.condition}
                    </span>
                    <span className="text-purple-600 font-bold">
                      ₹{product.price}
                    </span>
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

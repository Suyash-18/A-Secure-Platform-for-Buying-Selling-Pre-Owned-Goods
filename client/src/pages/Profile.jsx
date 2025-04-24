import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

const Profile = () => {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState([]);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/user/${user?._id}`);
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

  const handleEditClick = () => {
    // You can add a message or any other action here if you want to indicate
    // that the edit function is currently disabled.
    console.log("Edit function is currently disabled.");
    // You can also show an alert to the user:
    // alert("Edit functionality is temporarily disabled.");
  };

  return (
    <div className="min-h-screen bg-[#e8e8e8] p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <img
            src={user?.avatar || "https://via.placeholder.com/100?text=User"}
            alt="User Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-[#9575cd]"
          />

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              {user?.fullname || user?.username}
            </h2>
            <p className="text-gray-600 mt-1">@{user?.username}</p>
          </div>

          <div className="w-full mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={handleEditClick}
              className="bg-[#9575cd] text-white px-8 py-2 rounded-full cursor-not-allowed"
              disabled // Optionally disable the button visually
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Listings Section */}
        {myListings.length > 0 && (
          <div className="mt-10 border-t pt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Listings</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {myListings.slice(0, 2).map((product) => (
                <div key={product._id} className="bg-gray-50 p-4 rounded-xl">
                  <img
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/400?text=No+Image'}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <h4 className="font-semibold mt-4 text-gray-800">{product.title}</h4>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-600">{product.condition}</span>
                    <span className="font-bold text-[#9575cd]">₹{product.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
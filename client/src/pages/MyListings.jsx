import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const sampleListings = [
  {
    id: 1,
    title: "Used iPhone 12",
    price: "₹35,000",
    location: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52a7?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: 2,
    title: "Study Table",
    price: "₹2,000",
    location: "Pune",
    image:
      "https://images.unsplash.com/photo-1616627454049-69ba9f46e8fa?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: 3,
    title: "Mountain Bike",
    price: "₹12,500",
    location: "Nagpur",
    image:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=600&q=60",
  },
];

const MyListings = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Listings</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sampleListings.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow rounded-md overflow-hidden transition hover:shadow-lg"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {item.title}
              </h2>
              <p className="text-purple-700 font-medium">{item.price}</p>
              <p className="text-sm text-gray-500">{item.location}</p>
              <div className="flex justify-end gap-3 mt-3">
                <button className="text-blue-500 hover:text-blue-700">
                  <FaEdit />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyListings;

// src/components/MessagesIcon.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const MessagesIcon = () => {
  const [count, setCount] = useState(0);

  const fetchChats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chats", {
        withCredentials: true,
      });
      const chats = res.data?.data || [];
      setCount(chats.length); // or more advanced unread logic later
    } catch (err) {
      console.error("Error fetching chats for icon:", err);
    }
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button className="p-2 rounded-full hover:bg-gray-100">
        💬
      </button>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
          {count}
        </span>
      )}
    </div>
  );
};

export default MessagesIcon;

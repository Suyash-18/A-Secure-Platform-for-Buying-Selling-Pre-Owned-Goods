import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import ChatBox from "./ChatBox";

const API_ROOT = "http://localhost:5000/api";

const timeShort = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString()
    ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString();
};

const AvatarFallback = ({ name, size = 44 }) => {
  const initials = (name || "U").split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase();
  let hash = 0;
  for (let i=0;i<name.length;i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  const bg = `hsl(${hue} 60% 60%)`;
  return (
    <div style={{ background: bg, width: size, height: size }} className="rounded-full flex items-center justify-center text-white font-semibold">
      {initials}
    </div>
  );
};

const SellerChats = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_ROOT}/chats`, { withCredentials: true });
      const data = res.data?.data || [];
      // defensive: if API returns messages with chats, extract unread if present
      setChats(data);
    } catch (err) {
      console.error("fetchChats error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
    const id = setInterval(fetchChats, 5000);
    return () => clearInterval(id);
  }, []);

  const getOther = (chat) => (chat.participants || []).find(p => p._id !== user._id) || {};

  // universal unread getter (defensive)
  const getUnreadCount = (chat) => {
    if (typeof chat.unreadCount === "number") return chat.unreadCount;
    if (typeof chat.unread === "number") return chat.unread;
    if (typeof chat.unread_count === "number") return chat.unread_count;
    // if chat includes messages, count unseen messages not sent by current user
    if (Array.isArray(chat.messages)) {
      const cnt = chat.messages.filter(m => m.sender && m.sender._id !== user._id && !m.seen).length;
      if (cnt) return cnt;
    }
    return 0;
  };

  const openChat = async (chatId) => {
    setActiveChatId(chatId);
    // try to clear on server
    try {
      await axios.post(`${API_ROOT}/chats/${chatId}/mark-read`, {}, { withCredentials: true });
    } catch (err) {
      // ignore server failure; we'll clear locally for immediate UX
      console.warn("mark-read failed (ok to ignore in frontend):", err?.message);
    }
    // clear locally
    setChats(prev => prev.map(c => c._id === chatId ? { ...c, unreadCount: 0, unread: 0, unread_count: 0 } : c));
  };

  return (
    <div className="flex h-[720px] bg-white rounded-xl border shadow overflow-hidden">
      {/* Left: list */}
      <div className="w-[360px] border-r flex flex-col">
        <div className="p-4 border-b flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">S</div>
          <div>
            <div className="font-semibold">Chats</div>
            <div className="text-xs text-gray-500">Seller Inbox</div>
          </div>
          <div className="ml-auto text-sm text-gray-500">{chats.length}</div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && chats.length === 0 ? (
            <div className="p-4 text-gray-500">Loading...</div>
          ) : chats.length === 0 ? (
            <div className="p-6 text-center text-gray-400">No chats yet</div>
          ) : (
            chats.map(chat => {
              const other = getOther(chat);
              const unread = getUnreadCount(chat);
              const active = activeChatId === chat._id;
              return (
                <div
                  key={chat._id}
                  onClick={() => openChat(chat._id)}
                  className={`relative flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-50 transition ${active ? "bg-indigo-50" : "bg-white"}`}
                >
                  <div className="flex-shrink-0">
                    {other.avatar ? (
                      <img src={other.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <AvatarFallback name={other.fullname || "User"} size={48} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{other.fullname || "Unknown user"}</div>
                        <div className="text-xs text-gray-500 truncate">{chat.product?.title || ""}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">{timeShort(chat.updatedAt)}</div>
                        {/* unread bubble shown under time on mobile — also shown rightmost */}
                      </div>
                    </div>

                    <div className="mt-1 flex items-center justify-between">
                      <div className="text-xs text-gray-500 truncate pr-2">{chat.lastMessage || "Say hello..."}</div>

                      {/* badge positioned rightmost */}
                      <div className="flex-shrink-0 ml-3">
                        {unread > 0 && (
                          <span
                            className="inline-flex items-center justify-center bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ minWidth: 28 }}
                          >
                            {unread > 99 ? "99+" : unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right: chat box */}
      <div className="flex-1 min-h-0">
        {activeChatId ? (
          <ChatBox
            chatId={activeChatId}
            onClose={() => setActiveChatId(null)}
            markParentRead={(id) => setChats(prev => prev.map(c => c._id === id ? { ...c, unreadCount: 0, unread: 0, unread_count: 0 } : c))}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">Select a chat to view</div>
        )}
      </div>
    </div>
  );
};

export default SellerChats;

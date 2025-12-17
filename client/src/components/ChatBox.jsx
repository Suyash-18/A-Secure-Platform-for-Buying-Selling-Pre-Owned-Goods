import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const API_ROOT = "http://localhost:5000/api";

// Ticks: resilient to multiple possible fields
const Ticks = ({ msg }) => {
  // treat many possible truthy flags as "seen"
  const seen = !!(msg.seen || msg.read || msg.isRead || msg.status === "read");
  const delivered = !!(msg.delivered || msg.status === "delivered" || msg.status === "delivered_to_recipient");
  const sent = !!(msg.status === "sent" || msg.status === "queued" || msg._id);

  if (seen) return <span className="ml-2 text-xs font-bold text-blue-500">✓✓</span>;
  if (delivered) return <span className="ml-2 text-xs font-bold text-gray-500">✓✓</span>;
  if (sent) return <span className="ml-2 text-xs font-bold text-gray-400">✓</span>;
  return <span className="ml-2 text-xs font-bold text-gray-400">✓</span>;
};

const ChatBox = ({ chatId, onClose, markParentRead }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  // fetch messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_ROOT}/chats/${chatId}`, { withCredentials: true });
      // accept messages in res.data.data OR res.data.messages etc.
      const msgs = res.data?.data || res.data?.messages || [];
      setMessages(msgs);
    } catch (err) {
      console.error("fetchMessages:", err);
    }
  };

  useEffect(() => {
    if (!chatId) return;
    fetchMessages();

    // mark read on open - try server, but always mark locally
    (async () => {
      try {
        await axios.post(`${API_ROOT}/chats/${chatId}/mark-read`, {}, { withCredentials: true });
      } catch (err) {
        console.warn("mark-read failed:", err?.message);
      } finally {
        // locally mark messages as seen and notify parent to clear badge
        setMessages(prev => prev.map(m => ({ ...m, seen: true })));
        if (typeof markParentRead === "function") markParentRead(chatId);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const appendIfNew = (m) => {
    setMessages(prev => {
      if (!m) return prev;
      if (prev.some(x => x._id === m._id)) return prev;
      return [...prev, m];
    });
  };

  const send = async () => {
    const body = text.trim();
    if (!body) return;

    // optimistic msg
    const optimistic = {
      _id: `tmp-${Date.now()}`,
      chat: chatId,
      sender: { _id: user._id, fullname: user.fullname, avatar: user.avatar },
      text: body,
      createdAt: new Date().toISOString(),
      // optimistic statuses
      delivered: true,
      seen: false,
    };
    appendIfNew(optimistic);
    setText("");

    try {
      const res = await axios.post(`${API_ROOT}/chats/send`, { chatId, text: body }, { withCredentials: true });
      const saved = res.data?.data || res.data?.message;
      if (saved) {
        // replace optimistic
        setMessages(prev => {
          const filtered = prev.filter(x => x._id !== optimistic._id);
          // avoid duplicates
          if (filtered.some(x => x._id === saved._id)) return filtered;
          return [...filtered, saved];
        });
      } else {
        console.warn("send: API returned no saved message");
      }
    } catch (err) {
      console.error("send failed:", err);
      // mark optimistic as failed
      setMessages(prev => prev.map(m => m._id === optimistic._id ? { ...m, failed: true } : m));
    }
  };

  const isMine = (m) => m?.sender?._id === user._id;

  const niceTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div>
            <div className="font-medium">Conversation</div>
            <div className="text-xs text-gray-400">Product chat</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded-md hover:bg-gray-100">Close</button>
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400">No messages yet</div>
        ) : (
          messages.map(m => {
            const mine = isMine(m);
            return (
              <div key={m._id} className={`max-w-[72%] ${mine ? "ml-auto text-right" : "mr-auto text-left"}`}>
                <div className={`inline-block px-4 py-2 rounded-2xl ${mine ? "bg-purple-600 text-white" : "bg-white text-gray-800 shadow"}`}>
                  <div className="text-sm break-words">{m.text}</div>
                  <div className="text-[10px] mt-1 flex items-center justify-end text-gray-300">
                    <span>{niceTime(m.createdAt)}</span>
                    {mine && <Ticks msg={m} />}
                    {m.failed && <span className="ml-2 text-xs text-red-500">!</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div className="p-3 border-t bg-white">
        <div className="flex gap-3">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") send(); }}
            placeholder="Type a message"
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none"
          />
          <button onClick={send} className="bg-purple-600 text-white px-4 py-2 rounded-full">Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;

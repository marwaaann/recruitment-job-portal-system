import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Search,
  Send,
  X,
  User,
  MessageCircle,
  Clock,
  Shield,
  Circle,
  Wifi,
  WifiOff,
} from "lucide-react";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import {
  connect,
  disconnect,
  sendMessage as sendSocketMessage,
} from "../../services/ChatService";
function formatContactTime(dateVal) {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "";
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  const isThisYear = d.getFullYear() === now.getFullYear();
  if (isThisYear) {
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  }
  return d.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
}

export default function ChatPanel({ onClose, embedded = false }) {
  const { user: authUser } = useAuth();
  const currentUserEmail = authUser?.email?.toLowerCase() || "";

  const [users, setUsers] = useState([]);
  const [onlineMap, setOnlineMap] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingConv, setLoadingConv] = useState(false);
  const [mobileConversationOpen, setMobileConversationOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const selectedUserRef = useRef(null);
  const currentUserRef = useRef(currentUserEmail);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    currentUserRef.current = currentUserEmail;
  }, [currentUserEmail]);

  // Scroll to bottom helper
  const scrollToBottom = (behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  // 1. Fetch chat users, initial presence, and conversation snapshots
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingUsers(true);
      try {
        const [usersRes, presenceRes] = await Promise.all([
          api.get("/chat/users").catch(() => ({ data: [] })),
          api.get("/chat/presence").catch(() => ({ data: {} })),
        ]);

        const chatUsers = Array.isArray(usersRes.data)
          ? usersRes.data.filter(
              (u) => u.email && u.email.toLowerCase() !== currentUserEmail
            )
          : [];

        // Normalize presence keys to lowercase
        const presence = {};
        if (presenceRes.data && typeof presenceRes.data === "object") {
          Object.entries(presenceRes.data).forEach(([email, isOnline]) => {
            presence[email.toLowerCase()] = isOnline;
          });
        }
        setOnlineMap(presence);

        // Fetch recent conversation history for each contact in parallel
        const initialLastMsgs = {};
        const initialUnreads = {};
        const initialMessages = {};

        const results = await Promise.allSettled(
          chatUsers.map(async (u) => {
            const uEmail = (u.email || "").toLowerCase();
            try {
              const res = await api.get("/chat/conversation", {
                params: { user1: currentUserEmail, user2: uEmail },
              });
              const hist = Array.isArray(res.data) ? res.data : [];
              return { uEmail, hist };
            } catch {
              return { uEmail, hist: [] };
            }
          })
        );

        results.forEach((r) => {
          if (r.status === "fulfilled" && r.value) {
            const { uEmail, hist } = r.value;
            if (hist.length > 0) {
              initialMessages[uEmail] = hist;
              initialLastMsgs[uEmail] = hist[hist.length - 1];
              const unread = hist.filter(
                (m) => (m.receiver || "").toLowerCase() === currentUserEmail && !m.seen
              ).length;
              if (unread > 0) {
                initialUnreads[uEmail] = unread;
              }
            }
          }
        });

        setLastMessages(initialLastMsgs);
        setUnreadCounts(initialUnreads);
        setMessages((prev) => ({ ...initialMessages, ...prev }));

        // Sort users initially: newest message at top, then unread, then online
        const sorted = [...chatUsers].sort((a, b) => {
          const aEmail = (a.email || "").toLowerCase();
          const bEmail = (b.email || "").toLowerCase();

          const aLast = initialLastMsgs[aEmail];
          const bLast = initialLastMsgs[bEmail];

          const aTime = aLast ? new Date(aLast.sentAt || aLast.timestamp || 0).getTime() : 0;
          const bTime = bLast ? new Date(bLast.sentAt || bLast.timestamp || 0).getTime() : 0;

          if (aTime !== bTime) return bTime - aTime;
          if (aTime > 0 && bTime === 0) return -1;
          if (bTime > 0 && aTime === 0) return 1;

          const aUnread = initialUnreads[aEmail] || 0;
          const bUnread = initialUnreads[bEmail] || 0;
          if (aUnread !== bUnread) return bUnread - aUnread;

          const aOnline = !!presence[aEmail];
          const bOnline = !!presence[bEmail];
          if (aOnline !== bOnline) return bOnline ? 1 : -1;

          return (a.fullName || a.email || "").localeCompare(b.fullName || b.email || "");
        });

        setUsers(sorted);

        // Auto-select first user if embedded view and no user selected yet
        if (embedded && sorted.length > 0 && !selectedUserRef.current) {
          setSelectedUser(sorted[0]);
        }
      } catch (err) {
        console.error("Failed to load chat users/presence:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (currentUserEmail) {
      fetchInitialData();
    }
  }, [currentUserEmail, embedded]);

  // 2. Mark conversation as seen via API
  const markAsSeenApi = useCallback(async (senderEmail, receiverEmail) => {
    if (!senderEmail || !receiverEmail) return;
    try {
      await api.put("/chat/conversation/seen", null, {
        params: { sender: senderEmail, receiver: receiverEmail },
      });
    } catch (err) {
      console.warn("Failed to mark conversation as seen:", err);
    }
  }, []);

  // 3. Connect STOMP WebSocket
  useEffect(() => {
    if (!currentUserEmail) return;

    connect(
      currentUserEmail,
      // onMessageReceived:
      (incoming) => {
        if (!incoming) return;

        const sender = (incoming.sender || "").toLowerCase();
        const receiver = (incoming.receiver || "").toLowerCase();
        const activeUser = currentUserRef.current;
        const otherParty = sender === activeUser ? receiver : sender;

        // Add to messages map deduplicated by ID
        setMessages((prev) => {
          const list = prev[otherParty] || [];
          // If already has this message ID, update it; otherwise append
          if (incoming.id !== undefined && incoming.id !== null) {
            const idx = list.findIndex((m) => m.id === incoming.id);
            if (idx >= 0) {
              const copy = [...list];
              copy[idx] = { ...copy[idx], ...incoming };
              return { ...prev, [otherParty]: copy };
            }
          }
          return { ...prev, [otherParty]: [...list, incoming] };
        });

        // Update last message
        setLastMessages((prev) => ({ ...prev, [otherParty]: incoming }));

        // If currently viewing this conversation, mark as seen immediately
        const currentlyOpen = selectedUserRef.current?.email?.toLowerCase();
        if (currentlyOpen === otherParty) {
          setUnreadCounts((prev) => ({ ...prev, [otherParty]: 0 }));
          markAsSeenApi(otherParty, activeUser);
        } else if (sender !== activeUser) {
          // Increment unread count
          setUnreadCounts((prev) => ({
            ...prev,
            [otherParty]: (prev[otherParty] || 0) + 1,
          }));
        }

        // Auto-scroll if chatting with this user
        if (currentlyOpen === otherParty) {
          setTimeout(() => scrollToBottom("smooth"), 100);
        }
      },
      // onConnectionChange:
      (connected) => {
        setSocketConnected(connected);
      },
      // onPresenceReceived:
      (presencePayload) => {
        if (!presencePayload || typeof presencePayload !== "object") return;
        setOnlineMap((prev) => {
          const updated = { ...prev };
          Object.entries(presencePayload).forEach(([email, isOnline]) => {
            updated[email.toLowerCase()] = isOnline;
          });
          return updated;
        });
      }
    );

    return () => {
      disconnect();
      setSocketConnected(false);
    };
  }, [currentUserEmail, markAsSeenApi]);

  // 4. Load conversation history when selectedUser changes
  useEffect(() => {
    if (!selectedUser?.email || !currentUserEmail) return;

    const otherEmail = selectedUser.email.toLowerCase();

    const fetchHistory = async () => {
      setLoadingConv(true);
      try {
        const res = await api.get("/chat/conversation", {
          params: { user1: currentUserEmail, user2: otherEmail },
        });

        const history = Array.isArray(res.data) ? res.data : [];
        setMessages((prev) => ({
          ...prev,
          [otherEmail]: history,
        }));

        if (history.length > 0) {
          setLastMessages((prev) => ({
            ...prev,
            [otherEmail]: history[history.length - 1],
          }));
        }

        // Mark as seen
        markAsSeenApi(otherEmail, currentUserEmail);
        setUnreadCounts((prev) => ({ ...prev, [otherEmail]: 0 }));

        setTimeout(() => scrollToBottom("auto"), 150);
      } catch (err) {
        console.error("Failed to load conversation history:", err);
      } finally {
        setLoadingConv(false);
      }
    };

    fetchHistory();
  }, [selectedUser, currentUserEmail, markAsSeenApi]);

  // 5. Send message action
  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const text = messageText.trim();
    if (!text || !selectedUser?.email || !currentUserEmail) return;

    const receiverEmail = selectedUser.email.toLowerCase();
    const nowIso = new Date().toISOString();

    const payload = {
      sender: currentUserEmail,
      receiver: receiverEmail,
      message: text,
      timestamp: nowIso,
    };

    setMessageText("");

    // Optimistically update last message so active contact stays at top
    setLastMessages((prev) => ({
      ...prev,
      [receiverEmail]: { ...payload, sentAt: nowIso },
    }));

    try {
      if (socketConnected) {
        sendSocketMessage(payload);
      } else {
        // Fallback to REST endpoint
        await api.post("/chat/send", payload);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleSelectContact = (u) => {
    setSelectedUser(u);
    setMobileConversationOpen(true);
    if (u?.email) {
      const email = u.email.toLowerCase();
      setUnreadCounts((prev) => ({ ...prev, [email]: 0 }));
      markAsSeenApi(email, currentUserEmail);
    }
  };

  // Filtered & Real-time Sorted contacts (newest message / unread conversation at the top)
  const filteredUsers = useMemo(() => {
    let list = [...users];

    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      list = list.filter(
        (u) =>
          (u.fullName && u.fullName.toLowerCase().includes(s)) ||
          (u.email && u.email.toLowerCase().includes(s)) ||
          (u.role && u.role.toLowerCase().includes(s))
      );
    }

    return list.sort((a, b) => {
      const aEmail = (a.email || "").toLowerCase();
      const bEmail = (b.email || "").toLowerCase();

      const aLast = lastMessages[aEmail];
      const bLast = lastMessages[bEmail];

      const aTime = aLast ? new Date(aLast.sentAt || aLast.timestamp || 0).getTime() : 0;
      const bTime = bLast ? new Date(bLast.sentAt || bLast.timestamp || 0).getTime() : 0;

      // 1. Sort by latest message timestamp (newest on top)
      if (aTime !== bTime) {
        return bTime - aTime;
      }

      // If one has message history and other doesn't
      if (aTime > 0 && bTime === 0) return -1;
      if (bTime > 0 && aTime === 0) return 1;

      // 2. Unread messages prioritized
      const aUnread = unreadCounts[aEmail] || 0;
      const bUnread = unreadCounts[bEmail] || 0;
      if (aUnread !== bUnread) {
        return bUnread - aUnread;
      }

      // 3. Online users next
      const aOnline = !!onlineMap[aEmail];
      const bOnline = !!onlineMap[bEmail];
      if (aOnline !== bOnline) {
        return bOnline ? 1 : -1;
      }

      // 4. Alphabetical fallback
      const aName = a.fullName || a.email || "";
      const bName = b.fullName || b.email || "";
      return aName.localeCompare(bName);
    });
  }, [users, searchTerm, lastMessages, unreadCounts, onlineMap]);

  // Active conversation message list
  const activeMessages = useMemo(() => {
    if (!selectedUser?.email) return [];
    return messages[selectedUser.email.toLowerCase()] || [];
  }, [messages, selectedUser]);

  // Group messages by day
  const groupedMessages = useMemo(() => {
    const groups = [];
    let currentDay = null;
    let currentGroup = null;

    activeMessages.forEach((msg) => {
      const dateVal = msg.sentAt || msg.timestamp;
      const dayStr = dateVal
        ? new Date(dateVal).toDateString()
        : "Recent";

      if (dayStr !== currentDay) {
        currentDay = dayStr;
        currentGroup = { day: dayStr, items: [] };
        groups.push(currentGroup);
      }
      currentGroup.items.push(msg);
    });

    return groups;
  }, [activeMessages]);

  const selectedIsOnline =
    selectedUser?.email && !!onlineMap[selectedUser.email.toLowerCase()];

  return (
    <div
      className={
        embedded
          ? "h-[calc(100vh-8.5rem)] bg-white rounded-2xl border border-slate-200 shadow-sm flex overflow-hidden"
          : "fixed bottom-5 right-5 z-50 w-[92vw] sm:w-[420px] md:w-[750px] h-[580px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200"
      }
    >
      {/* LEFT PANE: Contacts List */}
      <div
        className={`w-full md:w-72 lg:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50 ${
          mobileConversationOpen ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Contacts Header */}
        <div className="p-3.5 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-sm">Messages</h2>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                socketConnected
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
              title={socketConnected ? "STOMP WebSocket Live" : "Connecting..."}
            >
              {socketConnected ? (
                <>
                  <Wifi className="w-2.5 h-2.5" />
                  Live
                </>
              ) : (
                <>
                  <WifiOff className="w-2.5 h-2.5" />
                  Offline
                </>
              )}
            </span>
            {!embedded && onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Contacts */}
        <div className="p-3 bg-white border-b border-slate-100">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8.5 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Contacts Scroll List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {loadingUsers ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2.5 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-28 bg-slate-200 rounded" />
                    <div className="h-2.5 w-36 bg-slate-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No contacts found
            </div>
          ) : (
            filteredUsers.map((u) => {
              const uEmail = u.email ? u.email.toLowerCase() : "";
              const isSelected = selectedUser?.email?.toLowerCase() === uEmail;
              const isOnline = !!onlineMap[uEmail];
              const unread = unreadCounts[uEmail] || 0;
              const lastMsg = lastMessages[uEmail];

              return (
                <button
                  key={u.id || u.email}
                  type="button"
                  onClick={() => handleSelectContact(u)}
                  className={`w-full text-left p-3 flex items-start gap-3 transition-colors ${
                    isSelected
                      ? "bg-indigo-50/70 border-r-2 border-indigo-600"
                      : "hover:bg-slate-100/60"
                  }`}
                >
                  {/* Avatar with Presence indicator */}
                  <div className="relative shrink-0 mt-0.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                      {u.fullName ? u.fullName.charAt(0).toUpperCase() : "U"}
                    </div>
                    {/* Real Presence Dot */}
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                        isOnline ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                      title={isOnline ? "Online" : "Offline"}
                    />
                  </div>

                  {/* Name, Role, Last Message */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className={`text-xs truncate ${unread > 0 ? "font-bold text-slate-900" : "font-semibold text-slate-800"}`}>
                        {u.fullName || u.email}
                      </h4>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {lastMsg && (
                          <span className="text-[10px] text-slate-400 font-normal">
                            {formatContactTime(lastMsg.sentAt || lastMsg.timestamp)}
                          </span>
                        )}
                        {unread > 0 && (
                          <span className="px-1.5 py-0.2 bg-indigo-600 text-white rounded-full text-[10px] font-bold">
                            {unread}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="capitalize text-[10px] font-medium text-slate-500">
                        {u.role ? u.role.toLowerCase() : "User"}
                      </span>
                      {isOnline && (
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          Online
                        </span>
                      )}
                    </div>
                    {lastMsg && (
                      <p className={`text-[11px] truncate mt-0.5 ${unread > 0 ? "font-medium text-slate-900" : "text-slate-500"}`}>
                        {lastMsg.message}
                      </p>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANE: Active Conversation */}
      <div
        className={`flex-1 flex flex-col bg-white ${
          !mobileConversationOpen ? "hidden md:flex" : "flex"
        }`}
      >
        {selectedUser ? (
          <>
            {/* Conversation Header */}
            <div className="p-3.5 border-b border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileConversationOpen(false)}
                  className="md:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    {selectedUser.fullName
                      ? selectedUser.fullName.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                      selectedIsOnline ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />
                </div>

                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                    {selectedUser.fullName || selectedUser.email}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className="capitalize">
                      {selectedUser.role
                        ? selectedUser.role.toLowerCase()
                        : "User"}
                    </span>
                    <span>&bull;</span>
                    <span
                      className={
                        selectedIsOnline
                          ? "text-emerald-600 font-semibold"
                          : "text-slate-400"
                      }
                    >
                      {selectedIsOnline ? "Active Now" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>

              {!embedded && onClose && (
                <button
                  onClick={onClose}
                  className="hidden md:inline-flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
              {loadingConv ? (
                <div className="flex items-center justify-center h-full text-xs text-slate-400">
                  Loading conversation history...
                </div>
              ) : activeMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-2">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-slate-800 text-xs sm:text-sm">
                    Direct Channel with {selectedUser.fullName || "User"}
                  </h4>
                  <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                    Send a message to start communicating in real time.
                  </p>
                </div>
              ) : (
                groupedMessages.map((group) => (
                  <div key={group.day} className="space-y-3">
                    {/* Day divider */}
                    <div className="flex items-center justify-center my-2">
                      <span className="bg-white border border-slate-200 text-slate-500 text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
                        {group.day}
                      </span>
                    </div>

                    {/* Messages in this day */}
                    {group.items.map((msg, idx) => {
                      const isMe =
                        (msg.sender || "").toLowerCase() === currentUserEmail;
                      const timeStr = msg.sentAt || msg.timestamp
                        ? new Date(msg.sentAt || msg.timestamp).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )
                        : "";

                      return (
                        <div
                          key={msg.id || `msg-${idx}`}
                          className={`flex flex-col ${
                            isMe ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-2xs ${
                              isMe
                                ? "bg-indigo-600 text-white rounded-br-xs"
                                : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">
                              {msg.message}
                            </p>
                            <div
                              className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                                isMe ? "text-indigo-200" : "text-slate-400"
                              }`}
                            >
                              <span>{timeStr}</span>
                              {isMe && (
                                <span>
                                  {msg.seen ? (
                                    <CheckCheck className="w-3 h-3 text-cyan-300" />
                                  ) : msg.delivered ? (
                                    <CheckCheck className="w-3 h-3 text-indigo-300" />
                                  ) : (
                                    <Check className="w-3 h-3 text-indigo-300" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={`Message ${selectedUser.fullName || "user"}...`}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm shrink-0"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/30">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">
              Select a conversation
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Choose a contact from the list on the left to start direct messaging.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import { X, Send } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import api from "../../services/api";

import {
  connect,
  disconnect,
  sendMessage as sendSocketMessage,
} from "../../services/ChatService";

export default function ChatPanel({ onClose }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState({});

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messageKeysRef = useRef(new Set());
  const previousSelectedEmailRef = useRef(null);
  const selectedUserRef = useRef(null);
  const usersRef = useRef([]);
  const currentUserRef = useRef(null);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const getMessageKey = (msg) => {
    if (msg.id !== undefined && msg.id !== null) {
      return `id-${msg.id}`;
    }

    return `${msg.sender}-${msg.receiver}-${msg.message}-${
      msg.sentAt || msg.timestamp || ""
    }`;
  };

  const getMessageTimestamp = (msg) => {
    const value = msg?.sentAt || msg?.timestamp;
    if (!value) return 0;

    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const formatMessageTime = (msg) => {
    const value = msg?.sentAt || msg?.timestamp;
    if (!value) return "";

    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const markConversationSeenViaApi = useCallback(async (senderEmail, receiverEmail) => {
    if (!senderEmail || !receiverEmail) return;

    try {
      await api.put("/chat/conversation/seen", null, {
        params: {
          sender: senderEmail,
          receiver: receiverEmail,
        },
      });
    } catch (error) {
      console.error(
        "Failed to mark messages as seen:",
        error.response?.data || error.message
      );
    }
  }, []);

  useEffect(() => {
    const loadUsersAndProfile = async () => {
      try {
        setLoading(true);

        const [profileResponse, usersResponse] = await Promise.all([
          api.get("/users/profile"),
          api.get("/chat/users"),
        ]);

        const profile = profileResponse.data;
        const loggedInEmail = profile.email;

        setCurrentUser(loggedInEmail);

        const backendUsers = usersResponse.data || [];

        const chatUsers = backendUsers
          .filter(
            (user) =>
              user.email &&
              user.email !== loggedInEmail &&
              user.active !== false
          )
          .map((user) => ({
            id: user.id,
            name: user.fullName,
            email: user.email,
            role: user.role,
          }));

        setUsers(chatUsers);

        const initialMessages = {};
        chatUsers.forEach((user) => {
          initialMessages[user.id] = [];
        });

        setMessages(initialMessages);

        if (chatUsers.length > 0) {
          setSelectedUser(chatUsers[0]);
        }
      } catch (error) {
        console.error(
          "Failed to load users/profile:",
          error.response?.status,
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    loadUsersAndProfile();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    connect(
      currentUser,
      (incoming) => {
        const activeCurrentUser = currentUserRef.current;
        if (!activeCurrentUser) return;

        const otherUserEmail =
          incoming.sender === activeCurrentUser
            ? incoming.receiver
            : incoming.sender;

        let user = usersRef.current.find((u) => u.email === otherUserEmail);

        if (!user) {
          user = {
            id: `dynamic-${otherUserEmail}`,
            name: otherUserEmail?.split("@")[0] || otherUserEmail,
            email: otherUserEmail,
            role: "User",
          };

          setUsers((prev) => {
            const exists = prev.some((u) => u.email === user.email);
            if (exists) return prev;
            return [...prev, user];
          });
        }

        const incomingKey = getMessageKey(incoming);
        const isDuplicate = messageKeysRef.current.has(incomingKey);
        messageKeysRef.current.add(incomingKey);

        setMessages((prev) => {
          const existing = prev[user.id] || [];
          const existingIndex = existing.findIndex(
            (msg) => getMessageKey(msg) === incomingKey
          );

          if (existingIndex >= 0) {
            const updated = [...existing];
            updated[existingIndex] = {
              ...updated[existingIndex],
              ...incoming,
            };

            return { ...prev, [user.id]: updated };
          }

          return {
            ...prev,
            [user.id]: [...existing, incoming],
          };
        });

        setLastMessages((prev) => ({
          ...prev,
          [otherUserEmail]: incoming,
        }));

        const currentlySelectedEmail = selectedUserRef.current?.email;

        if (!isDuplicate && currentlySelectedEmail !== otherUserEmail) {
          setUnreadCounts((prev) => ({
            ...prev,
            [otherUserEmail]: (prev[otherUserEmail] || 0) + 1,
          }));
        } else if (currentlySelectedEmail === otherUserEmail) {
          setUnreadCounts((prev) => ({
            ...prev,
            [otherUserEmail]: 0,
          }));

          setMessages((prev) => ({
            ...prev,
            [user.id]: (prev[user.id] || []).map((msg) =>
              msg.sender === otherUserEmail && msg.receiver === activeCurrentUser
                ? { ...msg, seen: true }
                : msg
            ),
          }));

          markConversationSeenViaApi(otherUserEmail, activeCurrentUser);
        }

        if (
          incoming.receiver === activeCurrentUser &&
          incoming.sender !== activeCurrentUser &&
          typeof window !== "undefined" &&
          typeof Notification !== "undefined" &&
          document.visibilityState !== "visible" &&
          Notification.permission === "granted"
        ) {
          new Notification(`New message from ${user.name}`, {
            body: incoming.message,
          });
        }

        if (
          incoming.receiver === activeCurrentUser &&
          incoming.sender !== activeCurrentUser
        ) {
          api
            .put("/chat/conversation/delivered", null, {
              params: { sender: incoming.sender, receiver: activeCurrentUser },
            })
            .catch((error) =>
              console.error("Failed to mark message delivered:", error)
            );
        }
      },
      (connected) => {
        setSocketConnected(connected);
      }
    );

    return () => {
      disconnect();
      setSocketConnected(false);
    };
  }, [currentUser, markConversationSeenViaApi]);

  const markConversationAsSeen = useCallback(
    async (user) => {
      if (!currentUser || !user) return;

      await markConversationSeenViaApi(user.email, currentUser);

      setMessages((prev) => ({
        ...prev,
        [user.id]: (prev[user.id] || []).map((msg) =>
          msg.sender === user.email && msg.receiver === currentUser
            ? { ...msg, seen: true }
            : msg
        ),
      }));

      setUnreadCounts((prev) => ({ ...prev, [user.email]: 0 }));
    },
    [currentUser, markConversationSeenViaApi]
  );

  useEffect(() => {
    if (!currentUser || !selectedUser) {
      return;
    }

    const loadConversation = async () => {
      try {
        const response = await api.get("/chat/conversation", {
          params: {
            user1: currentUser,
            user2: selectedUser.email,
          },
        });

        const databaseMessages = response.data || [];

        setMessages((prev) => {
          const existingMessages = prev[selectedUser.id] || [];
          const merged = [...existingMessages, ...databaseMessages];

          const uniqueMessages = [];
          const seen = new Set();

          merged.forEach((msg) => {
            const key = getMessageKey(msg);

            if (!seen.has(key)) {
              seen.add(key);
              messageKeysRef.current.add(key);
              uniqueMessages.push(msg);
            }
          });

          uniqueMessages.sort((a, b) => getMessageTimestamp(a) - getMessageTimestamp(b));

          return {
            ...prev,
            [selectedUser.id]: uniqueMessages,
          };
        });

        const newestMessage = databaseMessages[databaseMessages.length - 1];
        if (newestMessage) {
          setLastMessages((prev) => ({
            ...prev,
            [selectedUser.email]: newestMessage,
          }));
        }

        setUnreadCounts((prev) => ({
          ...prev,
          [selectedUser.email]: 0,
        }));

        await markConversationAsSeen(selectedUser);
      } catch (error) {
        console.error("Failed to load conversation:", error);
      }
    };

    loadConversation();
  }, [currentUser, selectedUser, markConversationAsSeen]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const changedConversation =
      previousSelectedEmailRef.current !== selectedUser?.email;
    previousSelectedEmailRef.current = selectedUser?.email;

    const nearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 120;

    if (changedConversation || nearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUser]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof Notification === "undefined") {
      return;
    }

    if (Notification.permission === "default") {
      Notification.requestPermission().catch(() => {
        // Ignore permission prompt errors.
      });
    }
  }, []);

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || !currentUser || !selectedUser || !socketConnected) {
      return;
    }

    const payload = {
      sender: currentUser,
      receiver: selectedUser.email,
      message: trimmedMessage,
    };

    sendSocketMessage(payload);

    // Keep sender-side contact ordering responsive before websocket echo arrives.
    setLastMessages((prev) => ({
      ...prev,
      [selectedUser.email]: {
        ...payload,
        timestamp: new Date().toISOString(),
        delivered: false,
        seen: false,
      },
    }));

    setUnreadCounts((prev) => ({
      ...prev,
      [selectedUser.email]: 0,
    }));

    setMessage("");
  };

  const sortedUsers = [...users].sort((a, b) => {
    const unreadA = unreadCounts[a.email] || 0;
    const unreadB = unreadCounts[b.email] || 0;

    if (unreadA > 0 && unreadB === 0) {
      return -1;
    }

    if (unreadA === 0 && unreadB > 0) {
      return 1;
    }

    if (unreadA !== unreadB) {
      return unreadB - unreadA;
    }

    const lastA = getMessageTimestamp(lastMessages[a.email]);
    const lastB = getMessageTimestamp(lastMessages[b.email]);

    if (lastA !== lastB) {
      return lastB - lastA;
    }

    return (a.name || a.email).localeCompare(b.name || b.email);
  });

  const filteredUsers = sortedUsers.filter((user) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    return [user.name, user.email, user.role]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  });

  if (loading) {
    return (
      <div className="fixed bottom-24 right-6 z-50 w-[900px] h-[600px] bg-white rounded-2xl shadow-2xl border flex items-center justify-center">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[900px] h-[600px] bg-white rounded-2xl shadow-2xl border flex overflow-hidden">
      <div className="w-72 border-r bg-gray-50 flex flex-col min-h-0">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-bold text-lg">Messages</h2>

          <button
            onClick={onClose}
            className="hover:bg-gray-200 rounded-full p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-3">
          <input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>

        <div className="chat-contacts-scrollbar flex-1 min-h-0 overflow-y-auto px-2 pb-2 space-y-1">
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => {
                setSelectedUser(user);
                setUnreadCounts((prev) => ({ ...prev, [user.email]: 0 }));
              }}
              className={`w-full text-left px-3 py-3 rounded-xl transition ${
                selectedUser?.id === user.id
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="min-w-0">
                  <div className="font-medium truncate">{user.name}</div>

                  <div className="text-xs text-gray-500">{user.role || "User"}</div>

                  {lastMessages[user.email] && (
                    <div className="text-xs text-gray-500 truncate mt-1">
                      {lastMessages[user.email].message}
                      <span className="ml-2">
                        {formatMessageTime(lastMessages[user.email])}
                      </span>
                    </div>
                  )}
                </div>

                {unreadCounts[user.email] > 0 && (
                  <span className="ml-2 bg-green-500 text-white text-xs font-bold rounded-full min-w-[20px] h-[20px] px-1 flex items-center justify-center">
                    {unreadCounts[user.email]}
                  </span>
                )}
              </div>
            </button>
          ))}

          {filteredUsers.length === 0 && (
            <div className="px-3 py-4 text-sm text-gray-500">No users available</div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="font-semibold">
            {selectedUser ? selectedUser.name : "Select a user"}
          </div>
        </div>

        <div
          ref={messagesContainerRef}
          className="chat-contacts-scrollbar flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50"
        >
          {selectedUser &&
            (messages[selectedUser.id] || []).map((msg, index) => (
              <div
                key={
                  msg.id ?? `${msg.sender}-${msg.receiver}-${msg.message}-${index}`
                }
                className={`flex ${
                  msg.sender === currentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl shadow text-sm max-w-xs ${
                    msg.sender === currentUser
                      ? "bg-blue-600 text-white"
                      : "bg-white"
                  }`}
                >
                  <div>{msg.message}</div>

                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                      msg.sender === currentUser
                        ? "text-blue-100"
                        : "text-gray-400"
                    }`}
                  >
                    <span>{formatMessageTime(msg)}</span>

                    {msg.sender === currentUser && (
                      <span
                        className={`font-bold ${
                          msg.seen ? "text-cyan-200" : "text-blue-100"
                        }`}
                      >
                        {msg.delivered ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

          {selectedUser && (messages[selectedUser.id] || []).length === 0 && (
            <div className="h-full flex items-center justify-center text-sm text-gray-400">
              No messages yet
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t flex items-center gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            placeholder={
              selectedUser ? "Type a message..." : "Select a user first"
            }
            disabled={!selectedUser || !socketConnected}
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />

          <button
            onClick={handleSend}
            disabled={!selectedUser || !socketConnected || !message.trim()}
            className={`w-10 h-10 rounded-full text-white flex items-center justify-center ${
              socketConnected && selectedUser && message.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

import { ArrowLeft, CheckCheck, Search, Send, X } from "lucide-react";
import { Fragment, useEffect, useState, useRef, useCallback } from "react";
import api from "../../services/api";

import {
  connect,
  disconnect,
  sendMessage as sendSocketMessage,
} from "../../services/ChatService";

export default function ChatPanel({ onClose, embedded = false }) {
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
  const [conversationLoading, setConversationLoading] = useState(false);
  const [conversationError, setConversationError] = useState("");
  const [mobileConversationOpen, setMobileConversationOpen] = useState(false);

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

  const getMessageDateKey = (msg) => {
    const timestamp = getMessageTimestamp(msg);
    return timestamp ? new Date(timestamp).toDateString() : "unknown";
  };

  const formatMessageDate = (msg) => {
    const timestamp = getMessageTimestamp(msg);
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
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
        setConversationLoading(true);
        setConversationError("");
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
        setConversationError(
          error.response?.status === 403
            ? "You do not have permission to view this conversation."
            : "Could not load this conversation."
        );
      } finally {
        setConversationLoading(false);
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

    setUnreadCounts((prev) => ({
      ...prev,
      [selectedUser.email]: 0,
    }));

    setMessage("");
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUnreadCounts((prev) => ({ ...prev, [user.email]: 0 }));
    setMobileConversationOpen(true);
  };

  const getInitials = (user) => (user?.name || user?.email || "?")
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

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

  return (
    <div className={`${embedded ? "h-full w-full" : "fixed bottom-24 right-6 z-50 h-[min(680px,calc(100vh-7rem))] w-[min(1000px,calc(100vw-3rem))]"} chat-shell chat-workspace flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl`}>
      <div className={`${mobileConversationOpen ? "hidden md:flex" : "flex"} chat-sidebar w-full shrink-0 border-r border-slate-200 bg-white md:w-[350px]`}>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center justify-between">
              <div><p className="chat-kicker">Recruitment operations</p><h2 className="mt-1 text-xl font-semibold text-slate-950">Team desk</h2></div>
            </div>
          </div>

          <div className="p-4"><label className="chat-search"><Search size={16} /><input placeholder="Find a teammate or role" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} /></label></div>

          <div className="chat-contacts-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-3">
            {loading ? <div className="space-y-2 px-1">{[1, 2, 3, 4].map((item) => <div key={item} className="chat-skeleton" />)}</div> : filteredUsers.map((user) => {
              const unread = unreadCounts[user.email] || 0;
              const preview = lastMessages[user.email];
              return <button key={user.id} type="button" onClick={() => handleSelectUser(user)} className={`chat-contact ${selectedUser?.id === user.id ? "chat-contact-active" : ""} ${unread ? "chat-contact-unread" : ""}`}>
                <span className="chat-avatar">{getInitials(user)}</span>
                <span className="min-w-0 flex-1 text-left"><strong className="block truncate">{user.name || user.email}</strong><small className="block truncate">{user.role || "User"}{preview ? `  |  ${preview.message}` : "  |  No messages yet"}</small></span>
                <span className="flex shrink-0 flex-col items-end gap-1">{preview && <time>{formatMessageTime(preview)}</time>}{unread > 0 && <b className="chat-unread-badge">{unread}</b>}</span>
              </button>;
            })}

            {!loading && filteredUsers.length === 0 && <div className="chat-empty">{users.length ? "No conversations match your search." : "No conversations available."}</div>}
          </div>
        </div>
      </div>

      <div className={`${mobileConversationOpen ? "flex" : "hidden md:flex"} min-w-0 flex-1 flex-col bg-slate-50`}>
        <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <button type="button" onClick={() => setMobileConversationOpen(false)} className="chat-icon-button md:hidden" title="Back to conversations"><ArrowLeft size={18} /></button>
          {selectedUser ? <><span className="chat-avatar chat-avatar-header">{getInitials(selectedUser)}</span><div className="min-w-0"><strong className="block truncate text-sm text-slate-950">{selectedUser.name || selectedUser.email}</strong><span className="text-xs text-slate-500">{selectedUser.role || "User"}</span></div></> : <span className="font-semibold text-slate-500">Choose a teammate</span>}
          <div className="ml-auto flex items-center gap-2"><button type="button" onClick={onClose} className="chat-icon-button" title="Close messages"><X size={18} /></button></div>
        </div>

        <div
          ref={messagesContainerRef}
          className="chat-contacts-scrollbar flex-1 space-y-3 overflow-y-auto bg-[radial-gradient(#dbe5ef_1px,transparent_1px)] bg-[size:18px_18px] p-5"
        >
          {conversationLoading && <div className="chat-empty">Loading messages...</div>}
          {conversationError && <div className="chat-error">{conversationError}</div>}
          {selectedUser &&
            !conversationLoading && (messages[selectedUser.id] || []).map((msg, index, activeMessages) => {
              const previousMessage = activeMessages[index - 1];
              const showDateSeparator = getMessageDateKey(msg) !== getMessageDateKey(previousMessage);

              return <Fragment key={msg.id ?? `${msg.sender}-${msg.receiver}-${msg.message}-${index}`}>
                {showDateSeparator && getMessageTimestamp(msg) > 0 && <div className="my-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400"><span className="h-px flex-1 bg-slate-200" />{formatMessageDate(msg)}<span className="h-px flex-1 bg-slate-200" /></div>}
                <div
                className={`flex ${
                  msg.sender === currentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[min(75%,520px)] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
                    msg.sender === currentUser
                      ? "rounded-br-md bg-blue-600 text-white"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
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
                    <span>{formatMessageTime(msg) || ""}</span>

                    {msg.sender === currentUser && (
                      <span className={msg.seen ? "text-cyan-200" : "text-blue-100"}><CheckCheck size={13} /></span>
                    )}
                  </div>
                </div>
              </div>
              </Fragment>;
            })}

          {selectedUser && !conversationLoading && !conversationError && (messages[selectedUser.id] || []).length === 0 && <div className="chat-empty h-full">No messages yet</div>}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-slate-200 bg-white p-3">
          <div className="chat-composer flex items-end gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              selectedUser ? "Type a message..." : "Select a user first"
            }
            disabled={!selectedUser || !socketConnected}
            rows={1}
            className="min-h-11 flex-1 resize-none border-0 bg-transparent px-3 py-2.5 text-sm outline-none"
          />

          <button
            onClick={handleSend}
            disabled={!selectedUser || !socketConnected || !message.trim()}
            title="Send message"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${
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
    </div>
  );
}

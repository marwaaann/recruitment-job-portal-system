import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const INITIAL_CONVERSATIONS = [
  {
    id: "convo-1",
    name: "John Smith",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDSBSmiXgPZpVYa0O-iu7KtkGNZtnDkFPxgRqzzJ7_4cvCpnOaK-qd0VFXHiBFcTq6nFUC29GU2Otneg00mvAtKjfFOMoFrD53fxccimdo1G61E-uNDkp-C1cZX17TkJku2OU2Nn4b2MK2xO2YhT_UQAnRzsvyXBppVoAbIubxkiLCxq4GaqSSn0GOI-30lPcTLHzfcovrJY_OM7OEestxgb0tYJOZe8pHPdvs5GWW-L0hJm-fMwvmP3A",
    partnerAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCOAm40LCMMtMr9EgylHiOXYSf6f3Nf8KaceniU5aFCLBUJSCiZNijLst8h3o343EawWyBif30qmXWHjwk0SRRml36Ra2gE92t96xFN6d18nP-aUDc9gbLjNswAZo5g8J8QyvVsLnuUoDMZP1OtnZ4dpn4PFJ8ewLzilD5tKBQfiUzTlJHLdSlRhhfDXjzDku9XipGWZruo6NfYAmdGdnRVBliU906NeJwT74S0bZwwpDdhw25hg_0vNg",
    partnerThumb1:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB8sVplfO17nSKXcIB9vFsqCoH-tiax0D0RtiU5eHT4Yj9SbUOJb-0ky91ueEI2u22ODggQtIpxZ5W-IW2m1zGXn5XXcU_M-JnhbW2h2vF2lskGqT_XHNI_avwN22R49GQsOHUoYA8bGlX4W1kTTeuMuBIo1T3lHPos_DLTBtGZU3_FF0tZcmECiR3ryuecKGnNFbxO6_JzAGI64zSZLIP-vsNEH7CWD6svfIKuGMaxsFXpkiKYpIQJgg",
    partnerThumb2:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCy-KbcG3qNNVF_Lg14-FV53djxOHk6fUSOQ9NMFJabV0exCLWNgT_kOFcwuN-JNZSQJ6ENnyskPC6h-2PuxYKt7KGi6NH9ko0eeUlH_73MissD0o5D35U0tJIwquU4jD-HtEa1l7D1xwZhYV4dG0h5a3h4hZPvxGa2i161zMXczP5yw5hOZ9Bsfjfl8JMD-U2Oh7APOoJZV5LrQCCMF5bOLTck1WZGMaxDY2W9LnY6GYNJ659cy2l8sA",
    agencyBadge: "Apex",
    agencyFullName: "Apex Talent Corp",
    roleTag: "Partner Agency",
    time: "10:42 AM",
    timeHighlight: true,
    preview: "I will upload the updated salary slips for Vikram now.",
    reqTag: "Req #JP-4091 • Staff Java",
    unreadBadge: "2",
    online: true,
    category: "partners",
    messages: [
      {
        id: "msg-1",
        sender: "John Smith",
        senderAvatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuB8sVplfO17nSKXcIB9vFsqCoH-tiax0D0RtiU5eHT4Yj9SbUOJb-0ky91ueEI2u22ODggQtIpxZ5W-IW2m1zGXn5XXcU_M-JnhbW2h2vF2lskGqT_XHNI_avwN22R49GQsOHUoYA8bGlX4W1kTTeuMuBIo1T3lHPos_DLTBtGZU3_FF0tZcmECiR3ryuecKGnNFbxO6_JzAGI64zSZLIP-vsNEH7CWD6svfIKuGMaxsFXpkiKYpIQJgg",
        time: "10:30 AM",
        isSelf: false,
        text: "Hello Marwan, I have vetted two senior candidates who match ABC Tech's high-concurrency Spring Boot requirements.",
      },
      {
        id: "msg-2",
        isAttachmentCard: true,
        score: "Score: 94/100",
        candidateName: "Vikram Malhotra",
        candidateRole: "Staff Java Engineer • 8+ yrs exp",
        candidateCurrent: "Current: Lead Architect @ FinServ Systems",
        skills: ["Java 21", "Spring Cloud", "Kafka", "PostgreSQL"],
        pdfSize: "PDF (2.4 MB)",
      },
      {
        id: "msg-3",
        sender: "Marwan Al-Sayed",
        time: "10:34 AM",
        isSelf: true,
        text: "Thanks John. Vikram's profile looks stellar. I have scheduled Round 1 technical evaluation for tomorrow 11:30 AM.",
        status: "Read",
      },
      {
        id: "msg-4",
        sender: "John Smith",
        senderAvatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCy-KbcG3qNNVF_Lg14-FV53djxOHk6fUSOQ9NMFJabV0exCLWNgT_kOFcwuN-JNZSQJ6ENnyskPC6h-2PuxYKt7KGi6NH9ko0eeUlH_73MissD0o5D35U0tJIwquU4jD-HtEa1l7D1xwZhYV4dG0h5a3h4hZPvxGa2i161zMXczP5yw5hOZ9Bsfjfl8JMD-U2Oh7APOoJZV5LrQCCMF5bOLTck1WZGMaxDY2W9LnY6GYNJ659cy2l8sA",
        time: "10:42 AM",
        isSelf: false,
        text: "Excellent. I will notify the candidate right away and upload his verified compensation breakdown.",
      },
    ],
  },
  {
    id: "convo-2",
    name: "Sarah Khan",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1Ilvc3DN7tH-0SrHALNzvHO48AJyyKBtwYKZibzsFVoSihU0CLS4pMHUTjSaQILV81cdVC7H8IBT5U5_SWIPkqx3i9oSMlTBv0AayA9AYcFiVcF2DUuVk19JKnmNRg9GwjUIf3UEO8li6NGQUczmMnbJDDEMMG8wMDpgGGY24gIgxXD826OwCXnGJO3r34lw3_5B6oNEKX8NeXEnq9cg5R8RW3nOq7mtK_qq16oyM4GTmH9jsGpNjyA",
    agencyBadge: "ABC Tech",
    agencyFullName: "ABC Technologies HR",
    roleTag: "Client HR",
    time: "Yesterday",
    preview: "The technical panel approved both Java leads!",
    previewIcon: "done_all",
    reqTag: "Client HR • Bangalore Center",
    reqIcon: "domain",
    online: false,
    category: "clients",
    messages: [
      {
        id: "msg-sk1",
        sender: "Sarah Khan",
        time: "Yesterday 4:15 PM",
        isSelf: false,
        text: "The technical panel approved both Java leads! Please send over the revised contract templates for client signature.",
      },
    ],
  },
  {
    id: "convo-3",
    name: "David Miller",
    initials: "DM",
    agencyBadge: "FinTech",
    agencyFullName: "FinTech Corp Talent Operations",
    roleTag: "Client Lead",
    time: "2d ago",
    preview: "Can we reschedule tomorrow's 2 PM interview?",
    reqTag: "Panel Reschedule Request",
    reqIcon: "calendar_clock",
    online: true,
    category: "clients",
    messages: [
      {
        id: "msg-dm1",
        sender: "David Miller",
        time: "2d ago 11:30 AM",
        isSelf: false,
        text: "Can we reschedule tomorrow's 2 PM interview with Elena Rostova by 30 minutes? The VP has a conflicting client review.",
      },
    ],
  },
  {
    id: "convo-4",
    name: "Anita Roy",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCMSEmTcY_R8fuwARM9Bb9r_rV2T4xzGD_SG_5TLiklLIIf1VREzKjBEhyzfrU6rITogB1p17LPpOPgMEuXXcYLWPkWzwAxzjRx9NyRYEbfjEHuxMF7GRnckD0U8Wp36_hV4kWpybUtIbddqhke1JsfoxZKRDEBsJItvxgjisuqDBFAnLB4vuuEVrHBVi4Gq9EKFQbQrrZPu6hxKGVMUW6fYJsLjpjujIO-_y9lIPgYbFTZEsbQCPcO6A",
    agencyBadge: "Admin",
    agencyFullName: "Central Operations Group",
    roleTag: "Super Admin",
    time: "Mon",
    preview: "Reviewing quarterly hiring quota reports.",
    reqTag: "Q4 Target Allocation",
    reqIcon: "query_stats",
    online: false,
    category: "admin",
    messages: [
      {
        id: "msg-ar1",
        sender: "Anita Roy",
        time: "Mon 09:15 AM",
        isSelf: false,
        text: "Reviewing quarterly hiring quota reports. All EMEA engineering requisitions have reached 82% SLA fulfillment.",
      },
    ],
  },
];

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeConvoId, setActiveConvoId] = useState("convo-1");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [chatInputText, setChatInputText] = useState("");

  const messagesScrollRef = useRef(null);

  const activeConvo = conversations.find((c) => c.id === activeConvoId) || conversations[0];

  useEffect(() => {
    if (messagesScrollRef.current) {
      messagesScrollRef.current.scrollTop = messagesScrollRef.current.scrollHeight;
    }
  }, [activeConvoId, activeConvo.messages]);

  const filteredConversations = conversations.filter((c) => {
    if (activeTab === "partners" && c.category !== "partners") return false;
    if (activeTab === "clients" && c.category !== "clients") return false;
    if (activeTab === "candidates" && c.category !== "candidates") return false;
    if (activeTab === "unread" && !c.unreadBadge) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.agencyBadge.toLowerCase().includes(q) ||
        c.reqTag.toLowerCase().includes(q) ||
        c.preview.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSendMessage = () => {
    const text = chatInputText.trim();
    if (!text) return;

    const timeString = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date());

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: user?.fullName || "Marwan Al-Sayed",
      time: timeString,
      isSelf: true,
      text,
      status: "Delivered",
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvoId) {
          return {
            ...c,
            messages: [...c.messages, newMsg],
            preview: text,
            time: "Just now",
          };
        }
        return c;
      })
    );

    setChatInputText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInsertCandidate = () => {
    setChatInputText((prev) => (prev ? `${prev} @candidate:Vikram_Malhotra ` : "@candidate:Vikram_Malhotra "));
  };

  return (
    <div className="flex flex-col w-full">
      <div className="py-space-12 flex flex-col gap-space-16">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-space-12">
          <div className="flex items-center gap-space-12">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[22px]">forum</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-8">
                <h1 className="font-headline-lg text-headline-lg text-on-surface">OmniChannel Collaboration</h1>
                <span className="inline-flex items-center gap-space-4 rounded-full bg-surface-container-high px-space-8 py-space-2 font-label-xs text-label-xs text-on-surface-variant">
                  <span className="h-1.5 w-1.5 rounded-full bg-tertiary animate-pulse"></span>
                  STOMP / SockJS Live
                </span>
              </div>
              <p className="font-caption text-caption text-on-surface-variant">
                Direct recruiter-to-partner communications with integrated pipeline context
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-8">
            <button
              onClick={() => alert("Routing Rules configure automatic channel assignment.")}
              className="inline-flex items-center gap-space-8 rounded-lg bg-surface-container-low px-space-12 py-space-8 font-body-sm-medium text-body-sm-medium text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Routing Rules</span>
            </button>
            <button
              onClick={() => alert("New discussion thread modal opened.")}
              className="inline-flex items-center gap-space-8 rounded-lg bg-primary px-space-12 py-space-8 font-body-sm-medium text-body-sm-medium text-on-primary hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add_comment</span>
              <span>New Thread</span>
            </button>
          </div>
        </div>

        {/* Main Chat Workspace Card */}
        <div
          className="relative grid grid-cols-12 gap-0 overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm"
          style={{ height: "calc(100vh - 170px)", minHeight: "640px" }}
        >
          {/* Left Pane: Conversations List (Cols 1-4) */}
          <aside className="col-span-12 flex flex-col bg-surface-container-low/60 lg:col-span-4 xl:col-span-4 h-full overflow-hidden border-r border-surface-container">
            {/* Search & Channel Type Selector */}
            <div className="p-space-16 flex flex-col gap-space-12 bg-surface-container-lowest shadow-sm z-10">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined pointer-events-none absolute left-space-12 text-on-surface-variant text-[18px]">
                  search
                </span>
                <input
                  className="w-full rounded-lg bg-surface-container-low py-space-8 pl-space-40 pr-space-12 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest transition-colors"
                  id="convo-search"
                  placeholder="Search chats, requisitions, agencies..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <kbd className="absolute right-space-8 rounded bg-surface-container-high px-space-4 py-space-2 font-data-mono text-data-mono text-on-surface-variant">
                  ⌘F
                </kbd>
              </div>

              {/* Quick Filter Tabs */}
              <div className="flex items-center gap-space-4 overflow-x-auto pb-space-2" id="filter-tabs">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`tab-btn rounded-md px-space-8 py-space-4 font-label-xs text-label-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "all"
                      ? "bg-primary-container text-on-primary"
                      : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                  }`}
                  type="button"
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab("partners")}
                  className={`tab-btn rounded-md px-space-8 py-space-4 font-label-xs text-label-xs transition-all cursor-pointer ${
                    activeTab === "partners"
                      ? "bg-primary-container text-on-primary font-semibold"
                      : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                  }`}
                  type="button"
                >
                  Partners
                </button>
                <button
                  onClick={() => setActiveTab("clients")}
                  className={`tab-btn rounded-md px-space-8 py-space-4 font-label-xs text-label-xs transition-all cursor-pointer ${
                    activeTab === "clients"
                      ? "bg-primary-container text-on-primary font-semibold"
                      : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                  }`}
                  type="button"
                >
                  Clients
                </button>
                <button
                  onClick={() => setActiveTab("candidates")}
                  className={`tab-btn rounded-md px-space-8 py-space-4 font-label-xs text-label-xs transition-all cursor-pointer ${
                    activeTab === "candidates"
                      ? "bg-primary-container text-on-primary font-semibold"
                      : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                  }`}
                  type="button"
                >
                  Candidates
                </button>
                <button
                  onClick={() => setActiveTab("unread")}
                  className={`tab-btn flex items-center gap-space-4 rounded-md px-space-8 py-space-4 font-label-xs text-label-xs font-bold cursor-pointer ${
                    activeTab === "unread"
                      ? "bg-tertiary text-on-tertiary"
                      : "bg-tertiary-fixed text-on-tertiary-fixed"
                  }`}
                  type="button"
                >
                  <span>Unread</span>
                  <span className="rounded-full bg-tertiary px-1.5 py-0.5 text-[10px] text-on-tertiary">3</span>
                </button>
              </div>
            </div>

            {/* Conversations Stream */}
            <div className="flex-1 overflow-y-auto space-y-space-2 p-space-8" id="chat-list-container">
              {filteredConversations.map((convo) => {
                const isActive = convo.id === activeConvoId;
                return (
                  <div
                    key={convo.id}
                    onClick={() => setActiveConvoId(convo.id)}
                    className={`group relative flex cursor-pointer items-start gap-space-12 rounded-xl p-space-12 transition-all ${
                      isActive
                        ? "bg-surface-container-lowest shadow-sm"
                        : "hover:bg-surface-container-lowest/80"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      {convo.avatar ? (
                        <img
                          className="h-12 w-12 rounded-full object-cover shadow-sm"
                          src={convo.avatar}
                          alt={convo.name}
                          onError={(e) => {
                            e.target.style.display = "none";
                            if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`h-12 w-12 rounded-full bg-secondary-container text-on-secondary-container font-headline-lg text-headline-lg font-bold flex items-center justify-center shadow-sm ${
                          convo.avatar ? "hidden" : "flex"
                        }`}
                      >
                        {convo.initials || convo.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-surface-container-lowest ${
                          convo.online ? "bg-tertiary" : "bg-outline-variant"
                        }`}
                      ></span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-space-4 mb-space-2">
                        <div className="flex items-center gap-space-4 min-w-0">
                          <span
                            className={`truncate font-body-sm-medium text-body-sm-medium text-on-surface ${
                              isActive ? "font-semibold" : ""
                            }`}
                          >
                            {convo.name}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.5 font-label-xs text-label-xs uppercase tracking-wider ${
                              convo.id === "convo-1"
                                ? "bg-primary-fixed font-bold text-on-primary-fixed"
                                : convo.id === "convo-4"
                                ? "bg-surface-container-high text-on-surface font-semibold"
                                : "bg-surface-container-highest text-on-surface-variant"
                            }`}
                          >
                            {convo.agencyBadge}
                          </span>
                        </div>
                        <span
                          className={`font-caption text-caption flex-shrink-0 ${
                            convo.timeHighlight ? "text-primary font-medium" : "text-on-surface-variant"
                          }`}
                        >
                          {convo.time}
                        </span>
                      </div>

                      <div className="flex items-center gap-space-4 mb-space-4">
                        {convo.previewIcon && (
                          <span className="material-symbols-outlined text-[16px] text-primary">
                            {convo.previewIcon}
                          </span>
                        )}
                        <p
                          className={`truncate font-body-sm text-body-sm ${
                            isActive ? "text-on-surface font-medium" : "text-on-surface-variant"
                          }`}
                        >
                          {convo.preview}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-space-4 font-caption text-caption text-on-surface-variant truncate">
                          <span className="material-symbols-outlined text-[14px]">
                            {convo.reqIcon || "work"}
                          </span>
                          <span className="truncate">{convo.reqTag}</span>
                        </span>
                        {convo.unreadBadge && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-tertiary px-1.5 font-data-mono text-data-mono text-on-tertiary font-bold">
                            {convo.unreadBadge}
                          </span>
                        )}
                      </div>
                    </div>

                    {isActive && (
                      <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r"></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Connection Health Footer */}
            <div className="p-space-12 bg-surface-container-lowest flex items-center justify-between border-t border-surface-container">
              <div className="flex items-center gap-space-8">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed-dim opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary"></span>
                </span>
                <span className="font-label-xs text-label-xs text-on-surface-variant font-medium">
                  Socket Connected: ws-broker-02
                </span>
              </div>
              <span className="font-data-mono text-data-mono text-on-surface-variant">24ms ping</span>
            </div>
          </aside>

          {/* Right Pane: Active Chat Window (Cols 5-12) */}
          <section className="col-span-12 flex flex-col bg-surface-container-lowest lg:col-span-8 xl:col-span-8 h-full overflow-hidden">
            {/* Chat Header Bar */}
            <header className="px-space-20 py-space-12 bg-surface-container-lowest flex flex-wrap items-center justify-between gap-space-12 shadow-sm z-10 border-b border-surface-container">
              <div className="flex items-center gap-space-12 min-w-0">
                <div className="relative flex-shrink-0">
                  {activeConvo.partnerAvatar || activeConvo.avatar ? (
                    <img
                      className="h-11 w-11 rounded-full object-cover shadow-sm"
                      src={activeConvo.partnerAvatar || activeConvo.avatar}
                      alt={activeConvo.name}
                    />
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-secondary-container text-on-secondary-container font-headline-lg text-headline-lg font-bold flex items-center justify-center shadow-sm">
                      {activeConvo.initials}
                    </div>
                  )}
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-surface-container-lowest ${
                      activeConvo.online ? "bg-tertiary" : "bg-outline-variant"
                    }`}
                  ></span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-space-8 flex-wrap">
                    <span className="font-title-md text-title-md text-on-surface font-semibold truncate">
                      {activeConvo.name}
                    </span>
                    <span className="rounded bg-primary-fixed px-space-8 py-space-2 font-label-xs text-label-xs font-bold text-on-primary-fixed uppercase tracking-wider">
                      {activeConvo.roleTag}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant hidden sm:inline">
                      • {activeConvo.agencyFullName}
                    </span>
                  </div>
                  <div className="flex items-center gap-space-8 mt-space-2 flex-wrap">
                    <span className="flex items-center gap-1 font-caption text-caption text-tertiary font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-tertiary"></span> Active now
                    </span>
                    <span className="text-outline-variant">•</span>
                    <span className="inline-flex items-center gap-space-4 rounded bg-surface-container-low px-space-8 py-0.5 font-label-xs text-label-xs text-primary font-semibold">
                      <span className="material-symbols-outlined text-[14px]">badge</span>
                      Context: Senior Java Developer (Req #JP-4091)
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Context Actions */}
              <div className="flex items-center gap-space-4">
                <button
                  onClick={() => navigate("/jobs")}
                  className="p-space-8 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors flex items-center gap-space-4 cursor-pointer"
                  title="View Requisition Details"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">assignment</span>
                  <span className="hidden xl:inline font-body-sm-medium text-body-sm-medium">Job Req</span>
                </button>
                <button
                  onClick={() => navigate("/candidates")}
                  className="p-space-8 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors flex items-center gap-space-4 cursor-pointer"
                  title="View Assigned Candidate"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">person_search</span>
                  <span className="hidden xl:inline font-body-sm-medium text-body-sm-medium">Candidates</span>
                </button>
                <button
                  onClick={() => alert(`Initiating audio call with ${activeConvo.name}...`)}
                  className="p-space-8 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                  title="Direct Audio Call"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </button>
                <button
                  className="p-space-8 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                  title="Thread Options"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">more_vert</span>
                </button>
              </div>
            </header>

            {/* Messages Conversation Area (Scrollable) */}
            <div
              ref={messagesScrollRef}
              className="flex-1 overflow-y-auto p-space-20 space-y-space-16 bg-surface"
              id="messages-scroll"
            >
              {/* System Security Notice */}
              <div className="mx-auto max-w-xl rounded-lg bg-surface-container-high/60 p-space-8 px-space-12 text-center shadow-sm">
                <p className="font-caption text-caption text-on-surface-variant flex items-center justify-center gap-space-8">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">lock</span>
                  <span>
                    End-to-end recruiter collaboration channel for{" "}
                    <strong>Req #JP-4091 (Senior Java Developer)</strong>. Backed by Spring STOMP WebSocket.
                  </span>
                </p>
              </div>

              {/* Date Separator Pill */}
              <div className="relative flex items-center justify-center">
                <span className="rounded-full bg-surface-container-high px-space-12 py-space-4 font-label-xs text-label-xs text-on-surface-variant font-semibold uppercase tracking-wider">
                  Today, October 24
                </span>
              </div>

              {/* Messages Stream */}
              {activeConvo.messages.map((msg) => {
                if (msg.isAttachmentCard) {
                  return (
                    <div key={msg.id} className="flex items-start gap-space-12 max-w-2xl ml-space-40">
                      <div className="w-full max-w-lg rounded-xl bg-surface-container-lowest p-space-16 shadow-md border border-surface-container">
                        <div className="flex items-center justify-between mb-space-12">
                          <span className="inline-flex items-center gap-space-4 rounded bg-tertiary-fixed px-space-8 py-space-2 font-label-xs text-label-xs font-bold text-on-tertiary-fixed uppercase">
                            <span className="material-symbols-outlined text-[14px]">verified</span>
                            Vetted Submission
                          </span>
                          <span className="font-data-mono text-data-mono text-on-surface-variant">
                            {msg.score}
                          </span>
                        </div>

                        <div className="flex items-start gap-space-12">
                          <div className="h-12 w-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary font-headline-lg font-bold flex-shrink-0">
                            VM
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-title-md text-title-md text-on-surface font-semibold truncate">
                              {msg.candidateName}
                            </h4>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              {msg.candidateRole}
                            </p>
                            <p className="font-caption text-caption text-on-surface-variant">
                              {msg.candidateCurrent}
                            </p>
                          </div>
                        </div>

                        {/* Skills tags */}
                        <div className="flex flex-wrap gap-space-4 mt-space-12">
                          {msg.skills?.map((skill) => (
                            <span
                              key={skill}
                              className="rounded bg-surface-container-high px-space-8 py-space-2 font-data-mono text-data-mono text-on-surface-variant"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Attachment CTA buttons */}
                        <div className="mt-space-16 flex items-center gap-space-8 pt-space-12 bg-surface-container-low/40 -mx-space-16 -mb-space-16 px-space-16 py-space-12 rounded-b-xl border-t border-surface-container">
                          <button
                            onClick={() => navigate("/candidates")}
                            className="flex-1 inline-flex items-center justify-center gap-space-4 rounded-lg bg-primary text-on-primary px-space-12 py-space-8 font-body-sm-medium text-body-sm-medium hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            <span>View ATS Profile</span>
                          </button>
                          <button
                            onClick={() => alert("Downloading verified PDF scorecard...")}
                            className="inline-flex items-center gap-space-4 rounded-lg bg-surface-container-highest text-on-surface px-space-12 py-space-8 font-body-sm-medium text-body-sm-medium hover:bg-surface-container transition-colors cursor-pointer"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[16px]">download</span>
                            <span>{msg.pdfSize}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (msg.isSelf) {
                  return (
                    <div key={msg.id} className="flex items-start justify-end gap-space-12 max-w-2xl ml-auto">
                      <div className="flex flex-col items-end gap-space-4">
                        <div className="flex items-center gap-space-8">
                          <span className="font-caption text-caption text-on-surface-variant">{msg.time}</span>
                          <span className="font-body-sm-medium text-body-sm-medium text-on-surface font-semibold">
                            {msg.sender}
                          </span>
                        </div>
                        <div className="rounded-2xl rounded-tr-sm bg-primary p-space-12 text-on-primary shadow-sm">
                          <p className="font-body-md text-body-md leading-relaxed">{msg.text}</p>
                        </div>
                        <div className="flex items-center gap-1 font-caption text-caption text-primary font-medium">
                          <span className="material-symbols-outlined text-[16px]">done_all</span>
                          <span>{msg.status || "Read"}</span>
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-body-sm-medium font-bold flex-shrink-0 mt-1">
                        M
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className="flex items-start gap-space-12 max-w-2xl">
                    <img
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0 mt-1"
                      src={msg.senderAvatar || activeConvo.partnerAvatar || activeConvo.avatar}
                      alt={msg.sender}
                    />
                    <div className="flex flex-col gap-space-4">
                      <div className="flex items-center gap-space-8">
                        <span className="font-body-sm-medium text-body-sm-medium text-on-surface font-semibold">
                          {msg.sender}
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">{msg.time}</span>
                      </div>
                      <div className="rounded-2xl rounded-tl-sm bg-surface-container p-space-12 text-on-surface shadow-sm">
                        <p className="font-body-md text-body-md leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {activeConvo.id === "convo-1" && (
                <div className="flex items-center gap-space-12 text-on-surface-variant ml-space-40">
                  <div className="flex items-center gap-1.5 rounded-full bg-surface-container px-space-12 py-space-8">
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce"></span>
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="font-caption text-caption italic">John Smith is typing...</span>
                </div>
              )}
            </div>

            {/* Bottom Message Input Composer */}
            <div className="p-space-16 bg-surface-container-lowest shadow-md z-10 flex flex-col gap-space-8 border-t border-surface-container">
              {/* Context Toolbar Strip */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-8">
                  <span className="inline-flex items-center gap-space-4 rounded bg-surface-container px-space-8 py-space-2 font-data-mono text-data-mono text-on-surface">
                    <span className="material-symbols-outlined text-[14px] text-tertiary">task_alt</span>
                    Linking to: JP-4091 (Vikram M.)
                  </span>
                  <button
                    onClick={() => alert("Context selector dialog opened")}
                    className="text-primary hover:text-primary-container font-label-xs text-label-xs font-semibold cursor-pointer"
                    type="button"
                  >
                    Change Context
                  </button>
                </div>
                <div className="hidden sm:flex items-center gap-space-12 text-on-surface-variant font-caption text-caption">
                  <span>
                    Press <strong>Enter ↵</strong> to send
                  </span>
                  <span>•</span>
                  <span>
                    <strong>Shift+Enter</strong> for new line
                  </span>
                </div>
              </div>

              {/* Input Area */}
              <div className="relative flex items-end gap-space-8 rounded-xl bg-surface-container-low p-space-8 shadow-inner focus-within:bg-surface-container-lowest transition-colors border border-surface-container">
                {/* Attachments Trigger */}
                <button
                  onClick={() => alert("Attach document dialog opened")}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                  title="Attach Resume or Documents"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[22px]">attach_file</span>
                </button>

                {/* Quick ATS Candidate Insert Pill Button */}
                <button
                  onClick={handleInsertCandidate}
                  className="flex h-10 items-center gap-space-4 px-space-8 rounded-lg text-primary bg-primary-fixed hover:bg-surface-container-high transition-colors font-label-xs text-label-xs font-semibold flex-shrink-0 cursor-pointer"
                  id="ats-candidate-btn"
                  title="Quick Insert Candidate from ATS"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  <span className="hidden md:inline">ATS Candidate</span>
                </button>

                {/* Textarea */}
                <textarea
                  className="w-full resize-none bg-transparent py-space-8 px-space-4 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none"
                  id="chat-message-input"
                  placeholder="Type a message or paste candidate reference (@)..."
                  rows={2}
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                ></textarea>

                {/* Emoji & Send Action */}
                <div className="flex items-center gap-space-4 flex-shrink-0">
                  <button
                    onClick={() => setChatInputText((prev) => prev + " 😊 ")}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                    title="Insert Emoji"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all shadow-sm cursor-pointer"
                    id="send-msg-btn"
                    type="button"
                    title="Send Message"
                  >
                    <span className="material-symbols-outlined text-[20px]">send</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

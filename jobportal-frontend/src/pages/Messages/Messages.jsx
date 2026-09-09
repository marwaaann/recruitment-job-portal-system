import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const THREADS = [
  {
    id: "thread-1",
    name: "John Smith",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDa8IX3Kc2yt6RVSjYHiJPgVpbUQEstRkZZ8eVCvBewsqABb22hmnAppajQ6TrVRF1hpFJNXT_JCUyvcZwYb9r4AhN5X5861bPYXHiaGeM0CCQLCDx8L_-c3CGX15T1JpTQ2J4btmBQYFwZovkNX1b8Qv61wv5p_6egybATu1VVjUvs2MxUBRCB8dXwDWgzCHsir-SxCMA-47pFbY4gtvX5Px7Nnj-AM-RZcXMhhRSEFPt86nT3Wj_AdA",
    agency: "APEX",
    agencyFullName: "Apex Talent Corp",
    role: "PARTNER AGENCY",
    time: "10:42 AM",
    unreadCount: 2,
    preview: "I will upload the updated salary slip...",
    contextReq: "Req #JP-4091 • Staff Java",
    online: true,
    category: "partners",
    messages: [
      {
        id: "m-1",
        sender: "John Smith",
        isSelf: false,
        time: "10:30 AM",
        text: "Hello Marwan, I have vetted two senior candidates who match ABC Tech's high-concurrency Spring Boot requirements.",
        hasCandidateCard: true,
        candidate: {
          id: "cand-1",
          initials: "VM",
          name: "Vikram Malhotra",
          score: "Score: 94/100",
          badge: "VETTED SUBMISSION",
          role: "Staff Java Engineer • 8+ yrs exp",
          currentRole: "Current: Lead Architect @ FinServ Systems",
          skills: ["Java 21", "Spring Cloud", "Kafka", "PostgreSQL"],
          pdfSize: "PDF (2.4 MB)",
        },
      },
      {
        id: "m-2",
        sender: "Marwan Al-Sayed",
        isSelf: true,
        time: "10:34 AM",
        text: "Thanks John. Vikram's profile looks stellar. I have scheduled Round 1 technical evaluation for tomorrow 11:30 AM.",
        readStatus: "Read",
      },
      {
        id: "m-3",
        sender: "John Smith",
        isSelf: false,
        time: "10:42 AM",
        text: "Excellent. I will notify the candidate right away and upload his verified compensation breakdown.",
      },
    ],
  },
  {
    id: "thread-2",
    name: "Sarah Khan",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYjDLsUc5_lkCDKS9stcJMHf_-b8I68KyXM0krXjtGHojam4gPTWzNi_m67B9dUcZcfJopun08dbngnc8d4pjTqcCHRHbHzhc1l46T91VCS-8GWn9ahE_3pzP3JLhbiF8Mop0JLT7EkYzjJoggeWtBaz83Su6C5ZNOTseTqtkmvvEYzNj1_o2DkqtjJvqik0oklVAZVaeTJSFLmnSGNbgznp-kBQ5y0mBtUua8DWFFhI8QTTgjOnpavA",
    agency: "ABC TECH",
    agencyFullName: "ABC Technologies HR",
    role: "CLIENT HR",
    time: "Yesterday",
    unreadCount: 0,
    preview: "✔✔ The technical panel approved...",
    contextReq: "Client HR • Bangalore Center",
    online: false,
    category: "clients",
    messages: [
      {
        id: "sk-1",
        sender: "Sarah Khan",
        isSelf: false,
        time: "Yesterday 4:15 PM",
        text: "The technical panel approved Devendra's Stage 2 interview. Please prepare the offer letter draft.",
      },
    ],
  },
  {
    id: "thread-3",
    name: "David Miller",
    initials: "DM",
    agency: "FINTECH",
    agencyFullName: "FinTech Corp Talent Lead",
    role: "CLIENT",
    time: "2d ago",
    unreadCount: 0,
    preview: "Can we reschedule tomorrow's 2...",
    contextReq: "Panel Reschedule Request",
    online: true,
    category: "clients",
    messages: [
      {
        id: "dm-1",
        sender: "David Miller",
        isSelf: false,
        time: "2d ago",
        text: "Can we reschedule tomorrow's 2:00 PM architectural round with Elena Rostova by 30 minutes?",
      },
    ],
  },
  {
    id: "thread-4",
    name: "Anita Roy",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzVcB-JqBELzAlTr6-saV5K6OcSttiVFYi92RmcGbaGMayfPT4EI6PWph9WfBn4vusPKE99b9sqJyJ9Ywg3YBYQq_83RH7Cca5btpJlx_ozTthO1zFIXky3mDn3gtlTws2Pc-vWBCX6e0A_vBnn_s6qr7Mr7ScPR-QJjAspPvE3UOIygb1wv1i3hRQmIsi_rqIZbka28mXN_K6Cpu0eIOQ79mznEKSmkOsZ1qBG1MviqiMvFT0Hov-jQ",
    agency: "ADMIN",
    agencyFullName: "Internal Recruiting Operations",
    role: "ADMIN",
    time: "Mon",
    unreadCount: 0,
    preview: "Reviewing quarterly hiring quota r...",
    contextReq: "Q4 Target Allocation",
    online: false,
    category: "admin",
    messages: [
      {
        id: "ar-1",
        sender: "Anita Roy",
        isSelf: false,
        time: "Mon 11:20 AM",
        text: "Reviewing quarterly hiring quota allocations for India and EMEA engineering teams.",
      },
    ],
  },
];

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeThreadId, setActiveThreadId] = useState("thread-1");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [threads, setThreads] = useState(THREADS);
  const [messageInput, setMessageInput] = useState("");

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const filteredThreads = threads.filter((t) => {
    if (filterCategory !== "all") {
      if (filterCategory === "unread" && t.unreadCount === 0) return false;
      if (filterCategory === "partners" && t.category !== "partners") return false;
      if (filterCategory === "clients" && t.category !== "clients") return false;
      if (filterCategory === "candidates" && t.category !== "candidates") return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.agency.toLowerCase().includes(q) ||
        t.contextReq.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: user?.fullName || "Marwan Al-Sayed",
      isSelf: true,
      time: "Just now",
      text: messageInput.trim(),
      readStatus: "Sent",
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            messages: [...t.messages, newMsg],
            preview: newMsg.text,
            time: "Just now",
          };
        }
        return t;
      })
    );

    setMessageInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full pb-space-32">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-space-16 pb-space-20">
        <div className="flex items-center gap-space-12">
          <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[22px]">chat</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-8">
              <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                OmniChannel Collaboration
              </h1>
              <span className="inline-flex items-center gap-space-4 px-space-8 py-0.5 rounded-full bg-tertiary-fixed text-tertiary font-data-mono text-caption font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                STOMP / SockJS Live
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Direct recruiter-to-partner communications with integrated pipeline context
            </p>
          </div>
        </div>

        <div className="flex items-center gap-space-12">
          <button
            onClick={() => alert("Routing Rules configure automated message assignment.")}
            className="inline-flex items-center gap-space-8 px-space-12 py-space-8 rounded-lg bg-surface-container text-on-surface font-body-sm-medium text-body-sm-medium hover:bg-surface-container-high transition-colors cursor-pointer shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">tune</span>
            <span>Routing Rules</span>
          </button>
          <button
            onClick={() => alert("New discussion thread initiated.")}
            className="inline-flex items-center gap-space-8 px-space-16 py-space-8 rounded-lg bg-primary text-on-primary font-body-sm-medium text-body-sm-medium hover:bg-primary-container transition-all cursor-pointer shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_box</span>
            <span>New Thread</span>
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-20 items-start">
        {/* Left Column: Thread & Channel Drawer (4 cols) */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col rounded-2xl bg-surface-container-lowest p-space-16 shadow-sm min-h-[720px]">
          {/* Search Bar */}
          <div className="relative flex items-center bg-surface-container-low rounded-lg px-space-12 py-space-8 mb-space-12">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant mr-space-8">search</span>
            <input
              className="w-full bg-transparent font-body-sm text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant"
              placeholder="Search chats, requisitions, agencies"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <kbd className="bg-surface-container-highest px-space-6 py-0.5 rounded font-data-mono text-[10px] text-on-surface-variant">
              ⌘F
            </kbd>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-space-6 pb-space-12 border-b border-surface-container overflow-x-auto">
            {["all", "partners", "clients", "candidates", "unread"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-space-12 py-space-4 rounded-full font-label-xs text-label-xs font-semibold uppercase transition-colors cursor-pointer capitalize ${
                  filterCategory === cat
                    ? "bg-primary text-on-primary shadow-xs"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
                type="button"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Thread List */}
          <div className="flex flex-col gap-space-8 pt-space-12 overflow-y-auto">
            {filteredThreads.map((thread) => {
              const isSelected = thread.id === activeThreadId;
              return (
                <div
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`p-space-12 rounded-xl transition-all cursor-pointer flex items-start gap-space-12 ${
                    isSelected
                      ? "bg-primary-fixed/40 border-l-4 border-primary shadow-xs"
                      : "hover:bg-surface-container-low"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    {thread.avatar ? (
                      <img
                        className="w-10 h-10 rounded-full object-cover shadow-sm"
                        src={thread.avatar}
                        alt={thread.name}
                        onError={(e) => {
                          e.target.style.display = "none";
                          if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-10 h-10 rounded-full bg-secondary text-on-secondary font-bold flex items-center justify-center font-headline-lg text-sm shadow-sm ${
                        thread.avatar ? "hidden" : "flex"
                      }`}
                    >
                      {thread.initials || thread.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    {thread.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-tertiary ring-2 ring-surface-container-lowest"></span>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-space-4">
                      <div className="flex items-center gap-space-6 truncate">
                        <span className="font-body-sm-medium text-body-sm-medium text-on-surface font-semibold truncate">
                          {thread.name}
                        </span>
                        <span className="px-space-6 py-0.5 rounded bg-surface-container font-label-xs text-[10px] text-on-surface-variant font-bold">
                          {thread.agency}
                        </span>
                      </div>
                      <span className="font-caption text-caption text-on-surface-variant whitespace-nowrap">
                        {thread.time}
                      </span>
                    </div>

                    <p className="font-caption text-caption text-on-surface-variant truncate mt-0.5">
                      {thread.preview}
                    </p>

                    <div className="flex items-center justify-between mt-space-6">
                      <span className="inline-flex items-center gap-space-4 font-caption text-[11px] text-on-surface-variant">
                        <span className="material-symbols-outlined text-[13px]">work</span>
                        <span className="truncate">{thread.contextReq}</span>
                      </span>
                      {thread.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-tertiary text-on-tertiary font-data-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {thread.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Thread & Conversation Canvas (8 cols) */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col rounded-2xl bg-surface-container-lowest shadow-sm overflow-hidden min-h-[720px]">
          {/* Active Thread Header */}
          <div className="flex flex-wrap items-center justify-between gap-space-12 p-space-16 border-b border-surface-container bg-surface-container-lowest">
            <div className="flex items-center gap-space-12">
              <div className="relative">
                {activeThread.avatar ? (
                  <img
                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                    src={activeThread.avatar}
                    alt={activeThread.name}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary font-bold flex items-center justify-center font-headline-lg text-sm shadow-sm">
                    {activeThread.initials}
                  </div>
                )}
                {activeThread.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-tertiary ring-2 ring-surface-container-lowest"></span>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-space-8 flex-wrap">
                  <span className="font-body-md-medium text-body-md-medium text-on-surface font-bold">
                    {activeThread.name}
                  </span>
                  <span className="px-space-8 py-0.5 rounded bg-surface-container-high text-primary font-label-xs text-[11px] font-semibold">
                    {activeThread.role} • {activeThread.agencyFullName}
                  </span>
                </div>
                <div className="flex items-center gap-space-8 mt-0.5">
                  <span className="font-caption text-caption text-tertiary flex items-center gap-space-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Active now
                  </span>
                  <span className="text-on-surface-variant font-caption text-caption">•</span>
                  <span className="font-caption text-caption text-primary flex items-center gap-space-2">
                    <span className="material-symbols-outlined text-[13px]">link</span>
                    Context: Senior Java Developer (Req #JP-4091)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-space-8">
              <button
                onClick={() => navigate("/jobs")}
                className="inline-flex items-center gap-space-4 px-space-12 py-space-6 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm-medium text-body-sm-medium transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">description</span>
                <span>Job Req</span>
              </button>
              <button
                onClick={() => navigate("/candidates")}
                className="inline-flex items-center gap-space-4 px-space-12 py-space-6 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm-medium text-body-sm-medium transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">groups</span>
                <span>Candidates</span>
              </button>
              <button
                onClick={() => alert(`Calling ${activeThread.name}...`)}
                className="p-space-8 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                type="button"
                title="Audio Call"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
              </button>
              <button
                className="p-space-8 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                type="button"
                title="Options"
              >
                <span className="material-symbols-outlined text-[18px]">more_vert</span>
              </button>
            </div>
          </div>

          {/* Conversation Feed */}
          <div className="flex-1 p-space-24 overflow-y-auto space-y-space-20 bg-background/50">
            {activeThread.messages.map((msg) => {
              if (msg.isSelf) {
                return (
                  <div key={msg.id} className="flex flex-col items-end gap-space-4">
                    <div className="flex items-center gap-space-8 mb-1">
                      <span className="font-caption text-caption text-on-surface-variant">{msg.time}</span>
                      <span className="font-body-sm-medium text-body-sm-medium text-on-surface font-semibold">
                        {msg.sender}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-primary text-on-primary font-bold text-[10px] flex items-center justify-center">
                        M
                      </div>
                    </div>
                    <div className="max-w-xl p-space-16 rounded-2xl rounded-tr-sm bg-primary text-on-primary font-body-sm text-body-sm shadow-sm">
                      {msg.text}
                    </div>
                    {msg.readStatus && (
                      <span className="font-caption text-[11px] text-primary flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-[13px]">done_all</span>
                        {msg.readStatus}
                      </span>
                    )}
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex flex-col items-start gap-space-8">
                  <div className="flex items-center gap-space-8">
                    <div className="w-6 h-6 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-[10px] flex items-center justify-center">
                      {msg.sender[0]}
                    </div>
                    <span className="font-body-sm-medium text-body-sm-medium text-on-surface font-semibold">
                      {msg.sender}
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">{msg.time}</span>
                  </div>

                  <div className="max-w-xl p-space-16 rounded-2xl rounded-tl-sm bg-surface-container-lowest text-on-surface font-body-sm text-body-sm shadow-sm border border-surface-container">
                    {msg.text}
                  </div>

                  {/* Embedded Candidate Card Widget if present */}
                  {msg.hasCandidateCard && msg.candidate && (
                    <div className="w-full max-w-xl p-space-16 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col gap-space-12 mt-space-4">
                      <div className="flex items-center justify-between">
                        <span className="px-space-8 py-0.5 rounded-full bg-tertiary-fixed text-tertiary font-label-xs text-label-xs font-bold flex items-center gap-space-4">
                          <span className="material-symbols-outlined text-[14px]">verified</span>
                          {msg.candidate.badge}
                        </span>
                        <span className="font-data-mono text-data-mono font-bold text-on-surface">
                          {msg.candidate.score}
                        </span>
                      </div>

                      <div className="flex items-center gap-space-12">
                        <div className="w-12 h-12 rounded-xl bg-primary text-on-primary font-headline-lg text-headline-lg font-bold flex items-center justify-center flex-shrink-0">
                          {msg.candidate.initials}
                        </div>
                        <div className="flex flex-col">
                          <h3 className="font-body-md-medium text-body-md-medium text-on-surface font-bold">
                            {msg.candidate.name}
                          </h3>
                          <span className="font-caption text-caption text-on-surface-variant">
                            {msg.candidate.role}
                          </span>
                          <span className="font-caption text-caption text-primary font-medium">
                            {msg.candidate.currentRole}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-space-4">
                        {msg.candidate.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-space-8 py-space-2 rounded bg-surface-container text-on-surface font-label-xs text-label-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-space-8 pt-space-8 border-t border-surface-container">
                        <button
                          onClick={() => navigate("/candidates")}
                          className="flex-1 inline-flex items-center justify-center gap-space-8 py-space-8 rounded-lg bg-primary text-on-primary font-body-sm-medium text-body-sm-medium hover:bg-primary-container transition-all cursor-pointer shadow-sm"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          <span>View ATS Profile</span>
                        </button>
                        <button
                          onClick={() => alert("Downloading verified PDF scorecard...")}
                          className="inline-flex items-center gap-space-6 px-space-16 py-space-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm-medium text-body-sm-medium transition-colors cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">file_download</span>
                          <span>{msg.candidate.pdfSize}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Live Typing Indicator */}
            {activeThread.id === "thread-1" && (
              <div className="flex items-center gap-space-8 text-on-surface-variant font-caption text-caption pt-space-8">
                <span className="flex items-center gap-1 text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-150"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-300"></span>
                </span>
                <span>John Smith is typing...</span>
              </div>
            )}
          </div>

          {/* Context Banner */}
          <div className="px-space-20 py-space-6 bg-surface-container-low border-t border-surface-container flex items-center justify-between font-caption text-caption text-on-surface-variant">
            <div className="flex items-center gap-space-8">
              <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
              <span className="text-on-surface font-medium">Linking to: JP-4091 (Vikram M.)</span>
              <button
                onClick={() => alert("Context selector opened")}
                className="text-primary font-bold hover:underline cursor-pointer ml-space-8"
                type="button"
              >
                Change Context
              </button>
            </div>
            <span>Press Enter ↵ to send • Shift+Enter for new line</span>
          </div>

          {/* Composer Input Bar */}
          <div className="p-space-16 bg-surface-container-lowest border-t border-surface-container flex items-center gap-space-8">
            <button
              onClick={() => alert("Attach candidate file dialog opened")}
              className="p-space-8 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              type="button"
              title="Attach File"
            >
              <span className="material-symbols-outlined text-[20px]">attach_file</span>
            </button>

            <button
              onClick={() => navigate("/candidates")}
              className="inline-flex items-center gap-space-6 px-space-12 py-space-6 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-body-sm-medium text-body-sm-medium transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>+ ATS Candidate</span>
            </button>

            <input
              className="flex-1 bg-surface-container-low px-space-16 py-space-10 rounded-xl font-body-sm text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant"
              placeholder="Type a message or paste candidate reference (@)..."
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button
              onClick={() => setMessageInput((prev) => prev + " 👋 ")}
              className="p-space-8 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              type="button"
              title="Insert Emoji"
            >
              <span className="material-symbols-outlined text-[20px]">mood</span>
            </button>

            <button
              onClick={handleSendMessage}
              className="p-space-10 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-all cursor-pointer shadow-sm flex items-center justify-center"
              type="button"
              title="Send Message"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Socket Status Footer */}
      <div className="flex items-center gap-space-8 mt-space-16 font-data-mono text-[11px] text-on-surface-variant">
        <span className="w-2 h-2 rounded-full bg-tertiary"></span>
        <span>Socket Connected: ws-broker-02</span>
        <span>24ms ping</span>
      </div>
    </div>
  );
}

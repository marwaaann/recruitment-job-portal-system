import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const INITIAL_PIPELINE_DATA = {
  applied: [
    {
      id: "cand-1",
      name: "Aarav Sharma",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAqAUAf5kSSXCOe51_kvJoR8cOadqMd0Mm1yPwGUF10e8e2AZ_fmJKCGpdKZvGg2WTxOnIASUfIklRPP_pADPB9g4l9UQjRnOjfEYzB-Dfwt64L9G7WhiRglB_6Pb_FGGiotpvlr5WoyKcWpfkjR4XIEbXWFpjOaLpVUFUC5l5AOA4BrFzHlAEBN9v4O3txZRqRtug0RP4kdR57RBNpslw8AhXJdWNHlI54ZgHSBKhWPZj3_UuFbLev0w",
      appliedAgo: "Applied 3d ago",
      rating: "4.8",
      role: "Senior Backend Engineer • 7.5 yrs exp",
      source: "Apex Talent",
      sourceIcon: "business_center",
      skills: ["Java 21", "Spring Boot", "Kafka", "PostgreSQL"],
      meta: "3 files",
      metaIcon: "attach_file",
      stage: "applied",
    },
    {
      id: "cand-2",
      name: "Marcus Vance",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCjHkM4K-QnOH4homyw2M25v5S_XICJVsCeV-E-c8u_gNNDzs0myq9kz-aQgg4HE-D56BnkraYNM6f0PuBcXGo8jZM8nrRuHuZ_VOC0Obk2yPwBS4ip_ilhJxJfF59bH_OYASO96LJJy4VNPMz-GIyQWCo8_mYJHfTZVBakjDIzE3wBs9g64oWsiL_o2VhaPcvGHv06hulhwu4_WdBz2A2KS7tb2NoC9sMZdRiZ7Yay7O3Fd4tx4QS9vg",
      appliedAgo: "Applied 1d ago",
      rating: "4.6",
      role: "Java Microservices Lead • 8.2 yrs exp",
      source: "Direct Portal",
      sourceIcon: "person_pin",
      skills: ["Java 17", "Kubernetes", "Redis"],
      meta: "Ready to review",
      metaIcon: "schedule",
      stage: "applied",
    },
  ],
  shortlisted: [
    {
      id: "cand-3",
      name: "Priya Patel",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCYjDLsUc5_lkCDKS9stcJMHf_-b8I68KyXM0krXjtGHojam4gPTWzNi_m67B9dUcZcfJopun08dbngnc8d4pjTqcCHRHbHzhc1l46T91VCS-8GWn9ahE_3pzP3JLhbiF8Mop0JLT7EkYzjJoggeWtBaz83Su6C5ZNOTseTqtkmvvEYzNj1_o2DkqtjJvqik0oklVAZVaeTJSFLmnSGNbgznp-kBQ5y0mBtUua8DWFFhI8QTTgjOnpavA",
      appliedAgo: "Screened 2d ago",
      rating: "4.9",
      role: "Full-Stack Java Lead • 6.8 yrs exp",
      source: "Nexus Staffing",
      sourceIcon: "handshake",
      skills: ["Java 21", "Spring Cloud", "AWS", "React"],
      statusBadge: "Recruiter Passed",
      stage: "shortlisted",
    },
  ],
  interview: [
    {
      id: "cand-4",
      name: "Elena Rostova",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ4K7rkopv8rcqanttzM8sOTiHCGGHBkO8oZHFdE9PayIHmoTo6Zlgy8-1AkwZBWXw4D1t-UmqW1ymXwg6BIRQT4_VJmXglHidIaSUvZ3Xa8faYmUjPJsZCHa1xHsv_4ThWyfe2j-MoW2njF00WsP4LXKGoa8oTgmBMWgRfM5yStfsFZ-VeQBgt9jNWcxvdBzqywskIoIA1QtGMWcUosLWOoG2HjFKSpwugPw2K6jmudRzQIMJP8SR8A",
      appliedAgo: "Stage 2 of 3",
      rating: "4.9",
      role: "Dist. Systems Engineer • 9.0 yrs exp",
      source: "Apex Talent",
      sourceIcon: "handshake",
      skills: ["Java", "gRPC", "Cassandra"],
      interviewPill: {
        title: "Tech Round 2: Today 2:00 PM",
        subtitle: "With Rajiv M. (Engineering VP)",
      },
      joinReady: true,
      stage: "interview",
    },
  ],
  offered: [
    {
      id: "cand-5",
      name: "Devon Kim",
      initials: "DK",
      appliedAgo: "Offer sent 24h ago",
      rating: "5.0",
      role: "Principal Java Architect • 11.2 yrs exp",
      source: "Global Talent Hub",
      sourceIcon: "person_search",
      skills: ["Microservices", "High Scale", "GCP"],
      offerPackage: "₹36.5 LPA + ESOPS",
      progressPct: 85,
      expectationText: "Candidate expectation met (100%)",
      expiryText: "Expiry: 48 hrs",
      stage: "offered",
    },
  ],
  hired: [
    {
      id: "cand-6",
      name: "Rohan Nair",
      initials: "RN",
      appliedAgo: "Offer Accepted",
      verified: true,
      role: "Senior Software Engineer • 7.0 yrs exp",
      source: "Apex Talent",
      sourceIcon: "handshake",
      skills: ["Java 17", "Docker", "PostgreSQL"],
      joinDateText: "Joining: July 15, 2025",
      bgcText: "BGC in progress (Clearance 90%)",
      statusText: "Contract signed",
      stage: "hired",
    },
  ],
  rejected: [
    {
      id: "cand-7",
      name: "Ananya Sen",
      initials: "AS",
      appliedAgo: "Archived 4d ago",
      role: "Java Developer • 5.0 yrs exp",
      reasonIcon: "info",
      reasonTitle: "Notice period > 60d",
      reasonSubtitle: "Immediate joiner preferred",
      skills: ["Java", "Spring Boot"],
      stage: "rejected",
    },
    {
      id: "cand-8",
      name: "Tariq Latif",
      initials: "TL",
      appliedAgo: "Archived 6d ago",
      role: "Lead Backend Dev • 8.5 yrs exp",
      reasonIcon: "payments",
      reasonTitle: "Salary mismatch",
      reasonSubtitle: "Asked ₹48 LPA (Budget: ₹35L)",
      skills: ["Java", "Microservices"],
      stage: "rejected",
    },
  ],
};

const STAGE_CONFIG = [
  { id: "applied", label: "Applied", dotColor: "bg-outline", countClass: "bg-surface-container-high text-on-surface-variant" },
  { id: "shortlisted", label: "Shortlisted", dotColor: "bg-primary-container", countClass: "bg-primary-fixed text-on-primary-fixed" },
  { id: "interview", label: "Interview", dotColor: "bg-secondary", countClass: "bg-secondary-fixed text-on-secondary-fixed" },
  { id: "offered", label: "Offered", dotColor: "bg-secondary-container", countClass: "bg-surface-container-highest text-on-surface" },
  { id: "hired", label: "Hired", dotColor: "bg-tertiary", countClass: "bg-tertiary-fixed text-on-tertiary-fixed" },
  { id: "rejected", label: "Rejected", dotColor: "bg-error", countClass: "bg-error-container text-on-error-container" },
];

export default function Pipeline() {
  const navigate = useNavigate();

  const [pipelineState, setPipelineState] = useState(INITIAL_PIPELINE_DATA);
  const [viewMode, setViewMode] = useState("kanban");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [partnerFilter, setPartnerFilter] = useState("All Partners");
  const [expFilter, setExpFilter] = useState("5 - 10 Yrs");

  const [draggedCardId, setDraggedCardId] = useState(null);
  const [draggedFromStage, setDraggedFromStage] = useState(null);

  const totalCandidatesCount = useMemo(() => {
    return Object.values(pipelineState).reduce((sum, list) => sum + list.length, 0);
  }, [pipelineState]);

  const activeCandidatesCount = useMemo(() => {
    return (
      (pipelineState.applied?.length || 0) +
      (pipelineState.shortlisted?.length || 0) +
      (pipelineState.interview?.length || 0) +
      (pipelineState.offered?.length || 0)
    );
  }, [pipelineState]);

  const archivedCandidatesCount = useMemo(() => {
    return (pipelineState.hired?.length || 0) + (pipelineState.rejected?.length || 0);
  }, [pipelineState]);

  // Drag and drop handlers
  const handleDragStart = (e, cardId, stageId) => {
    setDraggedCardId(cardId);
    setDraggedFromStage(stageId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    if (!draggedCardId || !draggedFromStage || draggedFromStage === targetStage) return;

    setPipelineState((prev) => {
      const sourceList = [...prev[draggedFromStage]];
      const targetList = [...prev[targetStage]];

      const cardIndex = sourceList.findIndex((c) => c.id === draggedCardId);
      if (cardIndex === -1) return prev;

      const [card] = sourceList.splice(cardIndex, 1);
      const updatedCard = { ...card, stage: targetStage };
      targetList.unshift(updatedCard);

      return {
        ...prev,
        [draggedFromStage]: sourceList,
        [targetStage]: targetList,
      };
    });

    setDraggedCardId(null);
    setDraggedFromStage(null);
  };

  const moveCardToStage = (cardId, fromStage, targetStage) => {
    setPipelineState((prev) => {
      const sourceList = [...prev[fromStage]];
      const targetList = [...prev[targetStage]];
      const cardIndex = sourceList.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return prev;
      const [card] = sourceList.splice(cardIndex, 1);
      targetList.unshift({ ...card, stage: targetStage });
      return {
        ...prev,
        [fromStage]: sourceList,
        [targetStage]: targetList,
      };
    });
  };

  const filterCards = (cards) => {
    if (!searchQuery.trim()) return cards;
    const q = searchQuery.toLowerCase();
    return cards.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q))
    );
  };

  return (
    <div className="flex flex-col w-full pb-space-32">
      {/* Top Requisition Banner */}
      <div className="relative w-full rounded-2xl bg-surface-container-low p-space-24 shadow-sm mb-space-24 overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-primary-fixed/40 via-surface-container/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col gap-space-20">
          <div className="flex flex-wrap items-center justify-between gap-space-16">
            <div className="flex items-center flex-wrap gap-space-12">
              <div className="flex items-center gap-space-8">
                <span className="p-space-8 rounded-lg bg-primary text-on-primary shadow-sm flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">view_kanban</span>
                </span>
                <div className="flex flex-col">
                  <span className="font-label-xs text-label-xs uppercase tracking-wider text-primary font-semibold">
                    Active Requisition
                  </span>
                  <div className="relative group">
                    <button
                      className="flex items-center gap-space-8 font-headline-xl text-headline-xl text-on-surface hover:text-primary transition-colors text-left cursor-pointer"
                      type="button"
                    >
                      <span>Senior Java Developer (ABC Technologies - Noida)</span>
                      <span className="material-symbols-outlined text-[20px] text-on-surface-variant">expand_more</span>
                    </button>
                  </div>
                </div>
              </div>
              <span className="px-space-12 py-space-4 rounded-full bg-primary-fixed text-on-primary-fixed font-label-xs text-label-xs font-semibold shadow-sm flex items-center gap-space-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                {activeCandidatesCount} active candidates in pipeline
              </span>
            </div>

            <div className="flex items-center gap-space-12">
              <div className="flex items-center p-space-2 bg-surface-container rounded-xl shadow-inner">
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`flex items-center gap-space-4 px-space-12 py-space-4 rounded-lg font-body-sm-medium text-body-sm-medium transition-all cursor-pointer ${
                    viewMode === "kanban"
                      ? "bg-surface-container-lowest text-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">view_kanban</span>
                  <span>Kanban</span>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`flex items-center gap-space-4 px-space-12 py-space-4 rounded-lg font-body-sm-medium text-body-sm-medium transition-all cursor-pointer ${
                    viewMode === "table"
                      ? "bg-surface-container-lowest text-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">table_rows</span>
                  <span>Table</span>
                </button>
                <button
                  onClick={() => setViewMode("analytics")}
                  className={`flex items-center gap-space-4 px-space-12 py-space-4 rounded-lg font-body-sm-medium text-body-sm-medium transition-all cursor-pointer ${
                    viewMode === "analytics"
                      ? "bg-surface-container-lowest text-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">analytics</span>
                  <span>Analytics</span>
                </button>
              </div>
              <button
                onClick={() => alert("Bulk Email dialog opened for active candidates")}
                className="flex items-center gap-space-8 px-space-12 py-space-8 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container font-body-sm-medium text-body-sm-medium shadow-sm transition-all cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">forward_to_inbox</span>
                <span>Bulk Email</span>
              </button>
              <button
                onClick={() => navigate("/candidates/create")}
                className="flex items-center gap-space-8 px-space-16 py-space-8 rounded-lg bg-primary-container text-on-primary font-body-sm-medium text-body-sm-medium hover:bg-primary shadow-sm transition-all cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>+ Add Candidate</span>
              </button>
            </div>
          </div>

          {/* Granular Secondary Filters */}
          <div className="flex flex-wrap items-center justify-between gap-space-12 pt-space-8">
            <div className="flex flex-wrap items-center gap-space-8">
              <div className="relative flex items-center bg-surface-container-lowest rounded-lg shadow-sm w-72">
                <span className="material-symbols-outlined absolute left-space-12 text-[18px] text-on-surface-variant">
                  search
                </span>
                <input
                  className="w-full pl-9 pr-space-12 py-space-8 rounded-lg bg-transparent text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm focus:outline-none"
                  placeholder="Search candidate name or skill..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <select
                  value={partnerFilter}
                  onChange={(e) => setPartnerFilter(e.target.value)}
                  className="appearance-none flex items-center gap-space-8 px-space-12 pr-space-32 py-space-8 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm-medium text-body-sm-medium shadow-sm hover:bg-surface-container transition-all cursor-pointer outline-none"
                >
                  <option value="All Partners">Partner: All Partners</option>
                  <option value="Apex Talent">Partner: Apex Talent</option>
                  <option value="Nexus Staffing">Partner: Nexus Staffing</option>
                  <option value="Global Talent Hub">Partner: Global Talent Hub</option>
                </select>
                <span className="material-symbols-outlined absolute right-space-8 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant pointer-events-none">
                  keyboard_arrow_down
                </span>
              </div>
              <div className="relative">
                <select className="appearance-none flex items-center gap-space-8 px-space-12 pr-space-32 py-space-8 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm-medium text-body-sm-medium shadow-sm hover:bg-surface-container transition-all cursor-pointer outline-none">
                  <option value="ABC Tech">Client: ABC Tech</option>
                  <option value="FinTech Corp">Client: FinTech Corp</option>
                  <option value="CloudScale">Client: CloudScale</option>
                </select>
                <span className="material-symbols-outlined absolute right-space-8 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant pointer-events-none">
                  keyboard_arrow_down
                </span>
              </div>
              <div className="relative">
                <select
                  value={expFilter}
                  onChange={(e) => setExpFilter(e.target.value)}
                  className="appearance-none flex items-center gap-space-8 px-space-12 pr-space-32 py-space-8 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm-medium text-body-sm-medium shadow-sm hover:bg-surface-container transition-all cursor-pointer outline-none"
                >
                  <option value="5 - 10 Yrs">Exp: 5 - 10 Yrs</option>
                  <option value="3 - 5 Yrs">Exp: 3 - 5 Yrs</option>
                  <option value="10+ Yrs">Exp: 10+ Yrs</option>
                </select>
                <span className="material-symbols-outlined absolute right-space-8 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant pointer-events-none">
                  keyboard_arrow_down
                </span>
              </div>
            </div>

            <div className="flex items-center gap-space-4 bg-surface-container p-space-4 rounded-lg">
              <button
                onClick={() => setScopeFilter("all")}
                className={`px-space-8 py-space-2 rounded font-label-xs text-label-xs font-semibold transition-colors cursor-pointer ${
                  scopeFilter === "all"
                    ? "bg-surface-container-lowest text-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                type="button"
              >
                ALL ({totalCandidatesCount})
              </button>
              <button
                onClick={() => setScopeFilter("active")}
                className={`px-space-8 py-space-2 rounded font-label-xs text-label-xs font-semibold transition-colors cursor-pointer ${
                  scopeFilter === "active"
                    ? "bg-surface-container-lowest text-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                type="button"
              >
                ACTIVE ({activeCandidatesCount})
              </button>
              <button
                onClick={() => setScopeFilter("archived")}
                className={`px-space-8 py-space-2 rounded font-label-xs text-label-xs font-semibold transition-colors cursor-pointer ${
                  scopeFilter === "archived"
                    ? "bg-surface-container-lowest text-primary shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                type="button"
              >
                ARCHIVED ({archivedCandidatesCount})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex items-start gap-space-16 overflow-x-auto pb-space-24 select-none">
        {STAGE_CONFIG.map((stage) => {
          const cardsInStage = filterCards(pipelineState[stage.id] || []);
          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
              className="w-pipeline-column-width flex-shrink-0 flex flex-col rounded-2xl bg-surface-container-low p-space-12 shadow-sm min-h-[680px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-space-12 mb-space-8">
                <div className="flex items-center gap-space-8">
                  <span className={`w-2.5 h-2.5 rounded-full ${stage.dotColor}`}></span>
                  <span className="font-title-md text-title-md text-on-surface">{stage.label}</span>
                  <span className={`px-space-8 py-space-2 rounded-full font-data-mono text-data-mono font-semibold ${stage.countClass}`}>
                    {cardsInStage.length}
                  </span>
                </div>
                <div className="flex items-center gap-space-4">
                  <button
                    onClick={() => navigate("/candidates/create")}
                    className="p-space-4 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                    type="button"
                    title="Add candidate to this stage"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                  <button
                    className="p-space-4 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                    type="button"
                    title="Column options"
                  >
                    <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                  </button>
                </div>
              </div>

              {/* Column Cards Drop Area */}
              <div className="flex flex-col gap-space-12 flex-1 drop-zone">
                {cardsInStage.map((card) => {
                  const isDragging = draggedCardId === card.id;
                  return (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, card.id, stage.id)}
                      className={`group relative flex flex-col rounded-xl bg-surface-container-lowest p-space-12 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing hover:-translate-y-0.5 ${
                        isDragging ? "opacity-40 scale-95" : ""
                      } ${stage.id === "rejected" ? "opacity-80 hover:opacity-100" : ""}`}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-space-8 mb-space-8">
                        <div className="flex items-center gap-space-8 min-w-0">
                          {card.avatar ? (
                            <img
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0 shadow-inner"
                              src={card.avatar}
                              alt={card.name}
                              onError={(e) => {
                                e.target.style.display = "none";
                                if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-caption shadow-inner flex-shrink-0 ${
                              card.avatar ? "hidden" : "flex"
                            } ${
                              stage.id === "hired"
                                ? "bg-tertiary-fixed text-on-tertiary-fixed"
                                : stage.id === "offered"
                                ? "bg-primary-fixed text-on-primary-fixed"
                                : "bg-surface-container-highest text-on-surface-variant"
                            }`}
                          >
                            {card.initials || card.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-body-sm-medium text-body-sm-medium text-on-surface truncate font-semibold">
                              {card.name}
                            </span>
                            <span
                              className={`font-caption text-caption truncate ${
                                stage.id === "hired" ? "text-tertiary font-medium" : "text-on-surface-variant"
                              }`}
                            >
                              {card.appliedAgo}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-space-2 flex-shrink-0">
                          {card.rating && (
                            <span className="flex items-center gap-space-2 px-space-4 py-space-2 rounded bg-surface-container text-on-surface-variant font-data-mono text-[11px] font-semibold">
                              <span className="material-symbols-outlined text-[12px] text-tertiary">star</span> {card.rating}
                            </span>
                          )}
                          {card.verified && (
                            <span className="material-symbols-outlined text-[18px] text-tertiary">verified</span>
                          )}
                          {stage.id === "rejected" && (
                            <span className="material-symbols-outlined text-[16px] text-error">cancel</span>
                          )}
                          <button
                            className="opacity-0 group-hover:opacity-100 p-space-2 rounded hover:bg-surface-container transition-opacity cursor-pointer"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">more_vert</span>
                          </button>
                        </div>
                      </div>

                      {/* Card Role & Partner Tag */}
                      <div className="mb-space-8">
                        <p className="font-caption text-caption text-on-surface-variant leading-snug">{card.role}</p>
                        {card.source && (
                          <div className="flex items-center gap-space-4 mt-space-4">
                            <span className="inline-flex items-center gap-space-4 px-space-8 py-space-2 rounded-full bg-surface-container text-on-surface-variant font-label-xs text-label-xs">
                              <span className="material-symbols-outlined text-[12px]">{card.sourceIcon || "business_center"}</span>
                              {card.source}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Optional: Interview Pill */}
                      {card.interviewPill && (
                        <div className="flex items-center gap-space-8 p-space-8 rounded-lg bg-secondary-fixed text-on-secondary-fixed mb-space-8">
                          <span className="material-symbols-outlined text-[16px] text-secondary">videocam</span>
                          <div className="flex flex-col min-w-0">
                            <span className="font-label-xs text-label-xs font-semibold truncate">
                              {card.interviewPill.title}
                            </span>
                            <span className="font-caption text-[11px] text-on-secondary-fixed-variant truncate">
                              {card.interviewPill.subtitle}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Optional: Offer Package Box */}
                      {card.offerPackage && (
                        <div className="p-space-8 rounded-lg bg-surface-container-high text-on-surface mb-space-8 flex flex-col gap-space-2">
                          <div className="flex items-center justify-between text-caption font-medium">
                            <span className="text-on-surface-variant">Offer Package:</span>
                            <span className="font-data-mono text-primary font-bold">{card.offerPackage}</span>
                          </div>
                          <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                            <div className="bg-tertiary h-full rounded-full" style={{ width: `${card.progressPct}%` }}></div>
                          </div>
                          <span className="font-caption text-[11px] text-on-surface-variant">{card.expectationText}</span>
                        </div>
                      )}

                      {/* Optional: Join Date Pill */}
                      {card.joinDateText && (
                        <div className="flex items-center gap-space-8 p-space-8 rounded-lg bg-tertiary-fixed/40 text-on-tertiary-fixed-variant mb-space-8">
                          <span className="material-symbols-outlined text-[16px] text-tertiary">event_available</span>
                          <div className="flex flex-col">
                            <span className="font-label-xs text-label-xs font-semibold">{card.joinDateText}</span>
                            <span className="font-caption text-[11px]">{card.bgcText}</span>
                          </div>
                        </div>
                      )}

                      {/* Optional: Rejection Reason Box */}
                      {card.reasonTitle && (
                        <div className="flex items-center gap-space-8 p-space-8 rounded-lg bg-error-container/40 text-on-error-container mb-space-8">
                          <span className="material-symbols-outlined text-[16px] text-error">{card.reasonIcon || "info"}</span>
                          <div className="flex flex-col">
                            <span className="font-label-xs text-label-xs font-semibold">{card.reasonTitle}</span>
                            <span className="font-caption text-[11px]">{card.reasonSubtitle}</span>
                          </div>
                        </div>
                      )}

                      {/* Skills Tags */}
                      {card.skills && (
                        <div className="flex flex-wrap gap-space-4 mb-space-12">
                          {card.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-space-8 py-space-2 rounded bg-surface-container-high text-on-surface-variant font-label-xs text-label-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between pt-space-8 bg-surface-container-low/50 rounded-lg p-space-8 mt-auto">
                        {stage.id === "applied" && (
                          <>
                            <span className="font-caption text-caption text-on-surface-variant flex items-center gap-space-4">
                              <span className="material-symbols-outlined text-[14px]">{card.metaIcon}</span>
                              {card.meta}
                            </span>
                            <button
                              onClick={() => moveCardToStage(card.id, "applied", "shortlisted")}
                              className="flex items-center gap-space-2 px-space-8 py-space-2 rounded bg-primary text-on-primary font-label-xs text-label-xs hover:bg-primary-container transition-colors cursor-pointer"
                              type="button"
                            >
                              <span>Shortlist</span>
                              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </button>
                          </>
                        )}

                        {stage.id === "shortlisted" && (
                          <>
                            <span className="font-caption text-caption text-primary font-medium flex items-center gap-space-4">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              {card.statusBadge}
                            </span>
                            <button
                              onClick={() => moveCardToStage(card.id, "shortlisted", "interview")}
                              className="flex items-center gap-space-2 px-space-8 py-space-2 rounded bg-secondary-container text-on-secondary-container font-label-xs text-label-xs hover:bg-secondary transition-colors cursor-pointer"
                              type="button"
                            >
                              <span>Schedule</span>
                              <span className="material-symbols-outlined text-[14px]">calendar_add_on</span>
                            </button>
                          </>
                        )}

                        {stage.id === "interview" && (
                          <>
                            <div className="flex items-center gap-space-4 text-secondary font-label-xs text-label-xs font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
                              Join link ready
                            </div>
                            <button
                              onClick={() => moveCardToStage(card.id, "interview", "offered")}
                              className="flex items-center gap-space-2 px-space-8 py-space-2 rounded bg-surface-container-highest text-on-surface hover:bg-primary-fixed transition-colors font-label-xs text-label-xs cursor-pointer"
                              type="button"
                            >
                              <span>Scorecard</span>
                              <span className="material-symbols-outlined text-[14px]">rate_review</span>
                            </button>
                          </>
                        )}

                        {stage.id === "offered" && (
                          <>
                            <span className="font-caption text-caption text-on-surface-variant flex items-center gap-space-4">
                              <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
                              {card.expiryText}
                            </span>
                            <button
                              onClick={() => moveCardToStage(card.id, "offered", "hired")}
                              className="flex items-center gap-space-2 px-space-8 py-space-2 rounded bg-tertiary text-on-tertiary font-label-xs text-label-xs hover:bg-tertiary-container transition-colors cursor-pointer"
                              type="button"
                            >
                              <span>Mark Hired</span>
                              <span className="material-symbols-outlined text-[14px]">check</span>
                            </button>
                          </>
                        )}

                        {stage.id === "hired" && (
                          <>
                            <span className="font-caption text-caption text-tertiary flex items-center gap-space-4">
                              <span className="material-symbols-outlined text-[14px]">task_alt</span>
                              {card.statusText}
                            </span>
                            <button
                              className="p-space-4 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                            </button>
                          </>
                        )}

                        {stage.id === "rejected" && (
                          <>
                            <button
                              onClick={() => moveCardToStage(card.id, "rejected", "applied")}
                              className="text-on-surface-variant hover:text-primary font-label-xs text-label-xs transition-colors flex items-center gap-space-2 cursor-pointer"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[14px]">history</span>
                              <span>Re-activate</span>
                            </button>
                            <button
                              className="p-space-4 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Sync & Requisition Health Bar */}
      <div className="flex items-center justify-between mt-space-16 p-space-12 rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="flex items-center gap-space-16 font-caption text-caption text-on-surface-variant">
          <span className="flex items-center gap-space-4">
            <span className="w-2 h-2 rounded-full bg-primary-container"></span>
            Drag cards horizontally to update candidate stage
          </span>
          <span className="flex items-center gap-space-4">
            <span className="material-symbols-outlined text-[14px]">sync</span>
            Auto-synced 2 mins ago
          </span>
        </div>
        <div className="flex items-center gap-space-12">
          <span className="font-caption text-caption text-on-surface-variant">Requisition Health:</span>
          <div className="flex items-center gap-space-4">
            <div className="w-20 bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div className="bg-tertiary h-full rounded-full" style={{ width: "78%" }}></div>
            </div>
            <span className="font-data-mono text-[11px] font-semibold text-tertiary">78% Filled</span>
          </div>
        </div>
      </div>
    </div>
  );
}

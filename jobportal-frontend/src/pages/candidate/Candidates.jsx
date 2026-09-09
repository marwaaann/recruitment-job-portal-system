import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCandidatesPage } from "../../services/candidateService";

const CANDIDATES_DATA = [
  {
    id: "cand-1",
    name: "Vikram Malhotra",
    initials: "VM",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXg-Znb6oyyerSiH7RjrGsrimcimt0700qmeDyyk4qrARVuK3uMHObNQcXzdfikFWfOHlYhSc0osGeaFEzHqSbXaowH3hlZWM-wecKzb1JCshBrEbxgnKhg0KUix2O5dKMgnO3t8XnlvpmRAYyS5vGCDcPgosyk4ORCtRjtqAKy_1Kojz5TCDtouJ15b-qdiElVnNzXRkOJvQynLKVyasCcEsVq9aZI9bmazSEq5Zzh86eXYKqK5Ky-Q",
    role: "Staff Java Engineer @ Razorpay",
    detailedRole: "Staff Java Engineer @ Razorpay (Core Payments Orchestration)",
    stage: "SHORTLISTED",
    targetBadge: "L6 TARGET",
    email: "vikram.malhotra@engineering.io",
    phone: "+91 98765-43210",
    location: "Bengaluru, India (Open to Hybrid)",
    source: "Apex Talent",
    appliedAgo: "Applied 4d ago",
    aiFit: "9.4/10 AI Fit",
    matchPercentage: 94,
    skills: ["Java", "Distributed Systems", "Kafka"],
    verifiedTech: [
      { name: "Java 17/21", primary: true },
      { name: "Spring Boot 3.x", primary: true },
      { name: "Microservices", primary: true },
      { name: "Kubernetes (EKS)", secondary: true },
      { name: "AWS (DynamoDB, SQS)", secondary: true },
      { name: "Redis Distributed Cache" },
      { name: "Apache Kafka" },
      { name: "PostgreSQL" },
    ],
    experienceYears: "9.5 Years Total",
    experiences: [
      {
        title: "Staff Software Engineer (Payments Gateway)",
        company: "Razorpay Software Ltd • Bengaluru, India",
        period: "2021 — PRESENT",
        bullets: [
          "Led the core checkout ledger service re-architecture to ultra-low latency Java 21 microservices handling 45,000 requests/sec at peak.",
          "Designed idempotent distributed transaction rollback mechanism across 7 acquiring banks, reducing failed settle states by 99.4%.",
          "Directly managed a pod of 8 senior engineers and defined observability guidelines across Prometheus & OpenTelemetry.",
        ],
      },
      {
        title: "Senior Backend Engineer",
        company: "Ola Mobility • Bengaluru, India",
        period: "2018 — 2021",
        bullets: [
          "Constructed real-time driver geohashing pipeline with Redis clusters, shrinking dispatch latencies from 320ms to 48ms.",
          "Spearheaded zero-downtime migration from monolithic VM setups to self-healing Kubernetes clusters in AWS ap-south-1.",
        ],
      },
    ],
    education: {
      degree: "B.Tech in Computer Science",
      institution: "National Institute of Technology (NIT) Karnataka • 8.8 CGPA",
    },
    certifications: {
      title: "AWS Certified Solutions Architect",
      detail: "CKA (Certified Kubernetes Admin) • Valid thru 2027",
    },
    targetJobTitle: "Principal Platform Architect - Fintech",
    lifecycleStage: 4,
  },
  {
    id: "cand-2",
    name: "Ananya Rao",
    initials: "AR",
    avatar: null,
    role: "Lead Backend Architect @ Swiggy",
    detailedRole: "Lead Backend Architect @ Swiggy (Logistics & Fleet Engine)",
    stage: "SHORTLISTED",
    targetBadge: "L5 TARGET",
    email: "ananya.rao@swiggy.in",
    phone: "+91 98450-12345",
    location: "Bengaluru, India (Remote Eligible)",
    source: "Direct Sourced",
    appliedAgo: "Applied 6d ago",
    aiFit: "9.1/10 AI Fit",
    matchPercentage: 91,
    skills: ["Golang", "AWS EKS", "gRPC"],
    verifiedTech: [
      { name: "Golang", primary: true },
      { name: "Kubernetes (EKS)", primary: true },
      { name: "gRPC Microservices", primary: true },
      { name: "AWS (DynamoDB, SNS)", secondary: true },
      { name: "Apache Cassandra" },
      { name: "Envoy Proxy" },
    ],
    experienceYears: "7.8 Years Total",
    experiences: [
      {
        title: "Lead Backend Architect",
        company: "Swiggy • Bengaluru, India",
        period: "2021 — PRESENT",
        bullets: [
          "Architected real-time routing algorithms serving 1.2M daily active delivery partners.",
          "Decreased API p99 latency by 42% through Golang microservices modernization.",
        ],
      },
    ],
    education: {
      degree: "B.E. in Information Science",
      institution: "BMS College of Engineering, Bengaluru • 9.1 CGPA",
    },
    certifications: {
      title: "AWS Certified DevOps Professional",
      detail: "Kubernetes Cloud Native Associate • Valid thru 2026",
    },
    targetJobTitle: "Lead Infrastructure Architect",
    lifecycleStage: 3,
  },
  {
    id: "cand-3",
    name: "Devendra Kulkarni",
    initials: "DK",
    avatar: null,
    role: "Principal Platform Eng @ PhonePe",
    detailedRole: "Principal Platform Eng @ PhonePe (UPI Core Settlement)",
    stage: "SHORTLISTED",
    targetBadge: "L6 TARGET",
    email: "devendra.k@phonepe.com",
    phone: "+91 99801-67890",
    location: "Bengaluru / Pune (Hybrid)",
    source: "Quantum Recruiters",
    appliedAgo: "Applied 1w ago",
    aiFit: "8.9/10 AI Fit",
    matchPercentage: 89,
    skills: ["Java Core", "High Throughput", "Aerospike"],
    verifiedTech: [
      { name: "Java Core 21", primary: true },
      { name: "Spring Cloud", primary: true },
      { name: "Aerospike Distributed DB", secondary: true },
      { name: "Kafka Event Bus" },
      { name: "Docker & K8s" },
    ],
    experienceYears: "11.2 Years Total",
    experiences: [
      {
        title: "Principal Platform Engineer",
        company: "PhonePe • Bengaluru, India",
        period: "2020 — PRESENT",
        bullets: [
          "Designed multi-datacenter active-active replication pipeline for UPI core transactions.",
          "Supervised platform engineering teams across zero-trust service mesh.",
        ],
      },
    ],
    education: {
      degree: "M.Tech in Software Engineering",
      institution: "IIT Kharagpur",
    },
    certifications: {
      title: "Certified Kubernetes Security Specialist (CKS)",
      detail: "Oracle Certified Master Java SE",
    },
    targetJobTitle: "Core Banking Principal Engineer",
    lifecycleStage: 4,
  },
];

const STAGE_PILLS = [
  { id: "ALL", label: "ALL", count: "1,428" },
  { id: "NEW", label: "NEW", count: "84" },
  { id: "SCREENING", label: "SCREENING", count: "42" },
  { id: "SHORTLISTED", label: "SHORTLISTED", count: "19", primary: true },
  { id: "INTERVIEW", label: "INTERVIEW", count: "38" },
  { id: "OFFERED", label: "OFFERED", count: "6" },
  { id: "HIRED", label: "HIRED", count: "112" },
  { id: "REJECTED", label: "REJECTED", count: "1,127" },
];

export default function Candidates() {
  const navigate = useNavigate();

  const [selectedStage, setSelectedStage] = useState("SHORTLISTED");
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedCandidateId, setSelectedCandidateId] = useState("cand-1");
  const [searchQuery, setSearchQuery] = useState("Java, Spring Boot, K8s");
  const [partnerFilter, setPartnerFilter] = useState("Apex Talent Partners");
  const [experienceFilter, setExperienceFilter] = useState("8+ to 12 Years");
  const [locationQuery, setLocationQuery] = useState("Bengaluru / Remote");

  const [notes, setNotes] = useState([
    {
      id: 1,
      author: "Marwan Al-Sayed",
      authorInitials: "MA",
      badge: "SUPER ADMIN",
      badgeColor: "bg-primary-fixed text-on-primary-fixed",
      time: "Yesterday at 4:12 PM",
      text: "Candidate current notice period is officially 60 days, but Razorpay has agreed to early buy-out if client clears round tomorrow. Expect compensation package around ₹75L CTC.",
    },
    {
      id: 2,
      author: "Siddharth Sen (Apex Talent)",
      authorInitials: "AT",
      badge: "PARTNER",
      badgeColor: "bg-tertiary-fixed text-on-tertiary-fixed",
      time: "15 Oct 2026",
      text: "Confirmed candidate has tested positive for high interest in the FinTech cloud migration track. All references from his Ola stint were verified cleanly.",
    },
  ]);
  const [newNoteText, setNewNoteText] = useState("");

  const selectedCandidate = useMemo(() => {
    return CANDIDATES_DATA.find((c) => c.id === selectedCandidateId) || CANDIDATES_DATA[0];
  }, [selectedCandidateId]);

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    setNotes([
      {
        id: Date.now(),
        author: "Marwan Al-Sayed",
        authorInitials: "MA",
        badge: "SUPER ADMIN",
        badgeColor: "bg-primary-fixed text-on-primary-fixed",
        time: "Just now",
        text: newNoteText.trim(),
      },
      ...notes,
    ]);
    setNewNoteText("");
  };

  const handleResetFilters = () => {
    setSelectedStage("ALL");
    setSearchQuery("");
    setLocationQuery("");
  };

  return (
    <div className="flex flex-col w-full pb-space-48">
      <div className="flex flex-col gap-space-16 pt-space-20">
        {/* Screen Context & Master Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-space-16 pb-space-8">
          <div className="flex flex-col gap-space-2">
            <div className="flex items-center gap-space-12">
              <span className="font-headline-xl text-headline-xl text-on-surface">Candidate Directory</span>
              <span className="px-space-12 py-space-2 rounded-full bg-surface-container-high text-primary font-data-mono text-data-mono font-semibold">
                1,428 Profiles
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Active talent pipelines, agency submissions, and fast-track interview tracks
            </p>
          </div>
          <div className="flex items-center gap-space-12">
            <button
              onClick={() => alert("Bulk import modal opened")}
              className="inline-flex items-center gap-space-8 px-space-12 py-space-8 rounded-lg bg-surface-container text-on-surface font-body-sm-medium text-body-sm-medium hover:bg-surface-container-high shadow-sm transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">file_upload</span>
              <span>Bulk Import</span>
            </button>
            <button
              onClick={() => navigate("/candidates/create")}
              className="inline-flex items-center gap-space-8 px-space-16 py-space-8 rounded-lg bg-primary text-on-primary font-body-sm-medium text-body-sm-medium shadow-sm hover:bg-primary-container transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Add New Candidate</span>
            </button>
          </div>
        </div>

        {/* Filter Strip & Multi-Select Criteria */}
        <div className="p-space-16 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-16">
          <div className="flex flex-wrap items-center justify-between gap-space-16">
            {/* Status Filter Pills */}
            <div className="flex flex-wrap items-center gap-space-8">
              <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant mr-space-4">
                Stage:
              </span>
              {STAGE_PILLS.map((pill) => {
                const isActive = selectedStage === pill.id;
                let pillStyle = "bg-surface-container-low text-on-surface-variant hover:bg-surface-container";
                if (isActive) {
                  if (pill.id === "SHORTLISTED") pillStyle = "bg-primary text-on-primary shadow-sm";
                  else if (pill.id === "INTERVIEW") pillStyle = "bg-secondary-fixed text-on-secondary-fixed";
                  else if (pill.id === "OFFERED") pillStyle = "bg-tertiary-fixed text-on-tertiary-fixed";
                  else if (pill.id === "HIRED") pillStyle = "bg-surface-container-low text-tertiary font-bold";
                  else if (pill.id === "REJECTED") pillStyle = "bg-surface-container-low text-error font-bold";
                  else pillStyle = "bg-surface-container text-on-surface font-bold";
                }
                return (
                  <button
                    key={pill.id}
                    onClick={() => setSelectedStage(pill.id)}
                    className={`px-space-12 py-space-4 rounded-full font-label-xs text-label-xs font-semibold transition-colors cursor-pointer ${pillStyle}`}
                    type="button"
                  >
                    {pill.label} ({pill.count})
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-space-8">
              <button
                onClick={handleResetFilters}
                className="px-space-8 py-space-4 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface font-body-sm-medium text-body-sm-medium flex items-center gap-space-4 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Reset Filters</span>
              </button>
            </div>
          </div>

          {/* Granular Secondary Search Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-space-12 pt-space-4">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-space-12 text-[18px] text-on-surface-variant">
                manage_search
              </span>
              <input
                className="w-full pl-space-40 pr-space-12 py-space-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm outline-none focus:bg-surface-container-lowest focus:shadow-sm transition-all"
                placeholder="Tech stack, skills, roles..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-space-12 text-[18px] text-on-surface-variant">
                handshake
              </span>
              <select
                value={partnerFilter}
                onChange={(e) => setPartnerFilter(e.target.value)}
                className="w-full pl-space-40 pr-space-24 py-space-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm outline-none appearance-none cursor-pointer"
              >
                <option value="Apex Talent Partners">Partner: Apex Talent Partners</option>
                <option value="Quantum Recruiters">Partner: Quantum Recruiters</option>
                <option value="Direct Sourced">Partner: Direct Sourced</option>
                <option value="Nexus Executive">Partner: Nexus Executive</option>
              </select>
              <span className="material-symbols-outlined absolute right-space-8 text-[18px] pointer-events-none text-on-surface-variant">
                expand_more
              </span>
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-space-12 text-[18px] text-on-surface-variant">
                timeline
              </span>
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="w-full pl-space-40 pr-space-24 py-space-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm outline-none appearance-none cursor-pointer"
              >
                <option value="8+ to 12 Years">Experience: 8+ to 12 Years</option>
                <option value="3 to 5 Years">Experience: 3 to 5 Years</option>
                <option value="5 to 8 Years">Experience: 5 to 8 Years</option>
                <option value="12+ Years">Experience: 12+ Years (Leadership)</option>
              </select>
              <span className="material-symbols-outlined absolute right-space-8 text-[18px] pointer-events-none text-on-surface-variant">
                expand_more
              </span>
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-space-12 text-[18px] text-on-surface-variant">
                pin_drop
              </span>
              <input
                className="w-full pl-space-40 pr-space-12 py-space-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm outline-none"
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Master-Detail Core Split Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-20 items-start">
          {/* Left Column: Compact Candidate Selection Feed (4 Cols) */}
          <div className="xl:col-span-4 flex flex-col gap-space-12">
            <div className="flex items-center justify-between px-space-4">
              <span className="font-label-xs text-label-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Queue: {selectedStage} (19)
              </span>
              <span className="font-caption text-caption text-on-surface-variant">Sorted by Match Score</span>
            </div>

            {/* Candidate Cards List */}
            {CANDIDATES_DATA.map((candidate) => {
              const isSelected = candidate.id === selectedCandidateId;
              return (
                <div
                  key={candidate.id}
                  onClick={() => setSelectedCandidateId(candidate.id)}
                  className={`p-space-16 rounded-xl bg-surface-container-lowest transition-all cursor-pointer relative overflow-hidden ${
                    isSelected ? "shadow-md" : "shadow-sm hover:shadow-md"
                  }`}
                >
                  {isSelected && <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary"></div>}
                  <div className="flex items-start justify-between gap-space-12">
                    <div className="flex items-center gap-space-12">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-headline-lg text-headline-lg font-bold ${
                          candidate.id === "cand-1"
                            ? "bg-primary-fixed text-on-primary-fixed"
                            : candidate.id === "cand-2"
                            ? "bg-secondary-fixed text-on-secondary-fixed"
                            : "bg-surface-container-highest text-primary"
                        }`}
                      >
                        {candidate.initials}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-space-8">
                          <span className="font-body-md-medium text-body-md-medium text-on-surface font-semibold">
                            {candidate.name}
                          </span>
                          {candidate.id === "cand-1" && (
                            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                          )}
                        </div>
                        <span className="font-caption text-caption text-on-surface-variant">
                          {candidate.role}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-space-8 py-space-2 rounded font-label-xs text-label-xs font-bold uppercase ${
                        isSelected
                          ? "bg-primary-fixed text-on-primary-fixed"
                          : "bg-surface-container-high text-on-surface"
                      }`}
                    >
                      {candidate.stage}
                    </span>
                  </div>
                  <div className="mt-space-12 flex flex-wrap gap-space-4">
                    {candidate.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-space-8 py-space-2 rounded-md bg-surface-container text-on-surface font-caption text-caption"
                      >
                        {skill}
                      </span>
                    ))}
                    <span className="px-space-8 py-space-2 rounded-md bg-surface-container-high text-primary font-data-mono text-caption font-semibold">
                      {candidate.aiFit}
                    </span>
                  </div>
                  <div className="mt-space-12 pt-space-8 flex items-center justify-between text-on-surface-variant font-caption text-caption">
                    <span className="flex items-center gap-space-4">
                      <span className="material-symbols-outlined text-[14px]">
                        {candidate.source === "Direct Sourced" ? "public" : "apartment"}
                      </span>
                      {candidate.source}
                    </span>
                    <span>{candidate.appliedAgo}</span>
                  </div>
                </div>
              );
            })}

            {/* Quick Pagination / Footnote */}
            <div className="p-space-12 rounded-xl bg-surface-container-low flex items-center justify-between text-on-surface-variant font-caption text-caption">
              <span>Showing 3 of 19 candidates</span>
              <button
                onClick={() => setSelectedStage("ALL")}
                className="text-primary font-semibold hover:underline cursor-pointer"
              >
                View full queue →
              </button>
            </div>
          </div>

          {/* Right Column: Candidate Profile Deep-Dive (8 Cols) */}
          <div className="xl:col-span-8 flex flex-col gap-space-20">
            {/* Master Candidate Hero Card */}
            <div className="p-space-24 rounded-2xl bg-surface-container-lowest shadow-md flex flex-col gap-space-20 relative overflow-hidden">
              {/* Background Decorative Accent */}
              <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-gradient-to-br from-primary-fixed/30 to-secondary-fixed/20 pointer-events-none"></div>

              {/* Top Row: Avatar & Profile Info */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-16 z-10">
                <div className="flex items-start md:items-center gap-space-20">
                  <div className="relative">
                    {selectedCandidate.avatar ? (
                      <img
                        className="w-20 h-20 rounded-2xl object-cover shadow-md"
                        src={selectedCandidate.avatar}
                        alt={selectedCandidate.name}
                        onError={(e) => {
                          e.target.style.display = "none";
                          if (e.target.nextSibling) {
                            e.target.nextSibling.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-20 h-20 rounded-2xl bg-primary-fixed text-on-primary-fixed font-headline-xl font-bold flex items-center justify-center shadow-md ${
                        selectedCandidate.avatar ? "hidden" : "flex"
                      }`}
                    >
                      {selectedCandidate.initials}
                    </div>
                    <span className="absolute -bottom-1 -right-1 px-space-8 py-0.5 rounded-full bg-tertiary text-on-tertiary font-label-xs text-label-xs font-bold shadow-sm">
                      ACTIVE
                    </span>
                  </div>
                  <div className="flex flex-col gap-space-4">
                    <div className="flex flex-wrap items-center gap-space-12">
                      <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                        {selectedCandidate.name}
                      </h1>
                      <span className="px-space-8 py-space-2 rounded-md bg-primary-fixed text-on-primary-fixed font-label-xs text-label-xs font-bold uppercase tracking-wide">
                        {selectedCandidate.stage}
                      </span>
                      <span className="px-space-8 py-space-2 rounded-md bg-tertiary-fixed text-on-tertiary-fixed font-label-xs text-label-xs font-semibold">
                        {selectedCandidate.targetBadge}
                      </span>
                    </div>
                    <p className="font-body-md-medium text-body-md-medium text-on-surface font-medium">
                      {selectedCandidate.detailedRole}
                    </p>

                    {/* Micro Details Bar */}
                    <div className="flex flex-wrap items-center gap-x-space-16 gap-y-space-4 pt-space-4 text-on-surface-variant font-caption text-caption">
                      <span className="flex items-center gap-space-4">
                        <span className="material-symbols-outlined text-[16px]">mail</span>
                        {selectedCandidate.email}
                      </span>
                      <span className="flex items-center gap-space-4">
                        <span className="material-symbols-outlined text-[16px]">call</span>
                        {selectedCandidate.phone}
                      </span>
                      <span className="flex items-center gap-space-4">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        {selectedCandidate.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* External Profiles & Socials */}
                <div className="flex items-center gap-space-8 self-end md:self-auto">
                  <a
                    className="p-space-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    title="LinkedIn Profile"
                  >
                    <span className="material-symbols-outlined text-[20px]">share</span>
                  </a>
                  <a
                    className="p-space-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    title="GitHub Repository"
                  >
                    <span className="material-symbols-outlined text-[20px]">code</span>
                  </a>
                  <button
                    onClick={() => alert(`Downloading contact card for ${selectedCandidate.name}`)}
                    className="p-space-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
                    title="Download VCF"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">contact_page</span>
                  </button>
                </div>
              </div>

              {/* Quick Action CTA Buttons Bar */}
              <div className="flex flex-wrap items-center gap-space-12 pt-space-12 z-10">
                <button
                  onClick={() => navigate("/interviews")}
                  className="inline-flex items-center gap-space-8 px-space-16 py-space-8 rounded-lg bg-primary text-on-primary font-body-sm-medium text-body-sm-medium hover:bg-primary-container shadow-sm transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">event_available</span>
                  <span>Schedule Interview</span>
                </button>
                <button
                  onClick={() => navigate("/offers")}
                  className="inline-flex items-center gap-space-8 px-space-16 py-space-8 rounded-lg bg-tertiary text-on-tertiary font-body-sm-medium text-body-sm-medium hover:bg-tertiary-container shadow-sm transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">price_check</span>
                  <span>Generate Offer</span>
                </button>
                <button
                  onClick={() => navigate("/pipeline")}
                  className="inline-flex items-center gap-space-8 px-space-12 py-space-8 rounded-lg bg-surface-container-high text-on-surface font-body-sm-medium text-body-sm-medium hover:bg-surface-container-highest transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">assignment_ind</span>
                  <span>Assign to Job</span>
                </button>
                <button
                  onClick={() => navigate("/chat")}
                  className="inline-flex items-center gap-space-8 px-space-12 py-space-8 rounded-lg bg-surface-container-high text-on-surface font-body-sm-medium text-body-sm-medium hover:bg-surface-container-highest transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Send Message</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Reject ${selectedCandidate.name}?`)) {
                      alert(`Candidate ${selectedCandidate.name} moved to Rejected queue.`);
                    }
                  }}
                  className="inline-flex items-center gap-space-8 px-space-12 py-space-8 rounded-lg bg-surface-container text-error hover:bg-error-container hover:text-on-error-container font-body-sm-medium text-body-sm-medium transition-colors ml-auto cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">person_off</span>
                  <span>Reject Candidate</span>
                </button>
              </div>
            </div>

            {/* Tabbed Navigation Bar */}
            <div className="flex items-center gap-space-8 bg-surface-container-lowest p-space-8 rounded-xl shadow-sm overflow-x-auto">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-space-16 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
                type="button"
              >
                Profile &amp; Resume
              </button>
              <button
                onClick={() => setActiveTab("applications")}
                className={`px-space-16 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium transition-colors whitespace-nowrap flex items-center gap-space-6 cursor-pointer ${
                  activeTab === "applications"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
                type="button"
              >
                <span>Applications</span>
                <span className="px-space-8 py-0.5 rounded-full bg-surface-container-high text-on-surface font-data-mono text-label-xs">
                  2
                </span>
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`px-space-16 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === "timeline"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
                type="button"
              >
                Recruitment Timeline
              </button>
              <button
                onClick={() => setActiveTab("feedback")}
                className={`px-space-16 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium transition-colors whitespace-nowrap flex items-center gap-space-6 cursor-pointer ${
                  activeTab === "feedback"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
                type="button"
              >
                <span>Interview Feedback</span>
                <span className="px-space-8 py-0.5 rounded-full bg-surface-container-high text-on-surface font-data-mono text-label-xs">
                  3
                </span>
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`px-space-16 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === "notes"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
                type="button"
              >
                Internal Notes
              </button>
            </div>

            {/* Tab Content Master Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-20">
              {/* Left Inner Pane: Resume Card (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-space-20">
                <div className="p-space-20 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-16">
                  {/* Resume Header & Original Download */}
                  <div className="flex items-center justify-between pb-space-12 bg-surface-container-lowest">
                    <div className="flex items-center gap-space-8">
                      <span className="material-symbols-outlined text-primary text-[22px]">description</span>
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">Resume Digest</span>
                    </div>
                    <button
                      onClick={() => alert(`Downloading verified resume for ${selectedCandidate.name}`)}
                      className="inline-flex items-center gap-space-6 px-space-12 py-space-6 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm-medium text-body-sm-medium transition-all shadow-sm cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">file_download</span>
                      <span>Download Original PDF</span>
                    </button>
                  </div>

                  {/* Technical Skill Cloud */}
                  <div className="flex flex-col gap-space-8">
                    <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                      Verified Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-space-6">
                      {selectedCandidate.verifiedTech.map((tech) => {
                        let badgeClass = "bg-surface-container-high text-on-surface";
                        if (tech.primary) badgeClass = "bg-primary-fixed text-on-primary-fixed font-bold";
                        else if (tech.secondary) badgeClass = "bg-secondary-fixed text-on-secondary-fixed font-bold";
                        return (
                          <span
                            key={tech.name}
                            className={`px-space-12 py-space-4 rounded-lg font-data-mono text-data-mono ${badgeClass}`}
                          >
                            {tech.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Professional Experience Narrative */}
                  <div className="flex flex-col gap-space-12 pt-space-8">
                    <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                      Career Experience ({selectedCandidate.experienceYears})
                    </span>
                    {selectedCandidate.experiences.map((exp, idx) => (
                      <div key={idx} className="p-space-16 rounded-xl bg-surface-container-low flex flex-col gap-space-8">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-body-md-medium text-body-md-medium text-on-surface font-bold">
                              {exp.title}
                            </h4>
                            <p className="font-caption text-caption text-primary font-medium">{exp.company}</p>
                          </div>
                          <span className="font-data-mono text-caption text-on-surface-variant bg-surface-container-highest px-space-8 py-space-2 rounded">
                            {exp.period}
                          </span>
                        </div>
                        <ul className="font-body-sm text-body-sm text-on-surface-variant space-y-space-4 list-disc pl-space-16">
                          {exp.bullets.map((bullet, bIdx) => (
                            <li key={bIdx}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Education & Certifications Mosaic */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-12 pt-space-4">
                    <div className="p-space-12 rounded-xl bg-surface-container flex flex-col gap-space-4">
                      <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                        Education
                      </span>
                      <p className="font-body-sm-medium text-body-sm-medium text-on-surface font-bold">
                        {selectedCandidate.education.degree}
                      </p>
                      <span className="font-caption text-caption text-on-surface-variant">
                        {selectedCandidate.education.institution}
                      </span>
                    </div>
                    <div className="p-space-12 rounded-xl bg-surface-container flex flex-col gap-space-4">
                      <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                        Certifications
                      </span>
                      <p className="font-body-sm-medium text-body-sm-medium text-on-surface font-bold">
                        {selectedCandidate.certifications.title}
                      </p>
                      <span className="font-caption text-caption text-on-surface-variant">
                        {selectedCandidate.certifications.detail}
                      </span>
                    </div>
                  </div>

                  {/* System Match Score Card Visual */}
                  <div className="p-space-16 rounded-xl bg-surface-container-high flex items-center justify-between gap-space-16">
                    <div className="flex items-center gap-space-12">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
                        <span className="material-symbols-outlined text-[20px]">psychology</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-body-sm-medium text-body-sm-medium text-on-surface font-bold">
                          Kinetic Match Index: {selectedCandidate.matchPercentage}% Strong Alignment
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">
                          Matches 8 of 8 required skills for '{selectedCandidate.targetJobTitle}'
                        </span>
                      </div>
                    </div>
                    {/* Inline SVG Circular Progress Gauge */}
                    <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-surface-container-highest"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                        />
                        <path
                          className="text-primary"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeDasharray={`${selectedCandidate.matchPercentage}, 100`}
                          strokeLinecap="round"
                          strokeWidth="3.5"
                        />
                      </svg>
                      <span className="absolute font-data-mono text-[10px] font-bold text-on-surface">
                        {selectedCandidate.matchPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Inner Pane: Recruitment Lifecycle Timeline & Recruiter Stream (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-space-20">
                {/* Recruitment Timeline Widget */}
                <div className="p-space-20 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-16">
                  <div className="flex items-center justify-between pb-space-8">
                    <div className="flex items-center gap-space-8">
                      <span className="material-symbols-outlined text-secondary text-[22px]">route</span>
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
                        Recruitment Lifecycle
                      </span>
                    </div>
                    <span className="px-space-8 py-space-2 rounded bg-secondary-fixed text-on-secondary-fixed font-data-mono text-label-xs font-bold">
                      STAGE 4 OF 6
                    </span>
                  </div>

                  {/* Vertical Timeline Chain */}
                  <div className="relative flex flex-col gap-space-16 pl-space-12">
                    {/* Vertical Line Connector */}
                    <div className="absolute top-3 left-[23px] bottom-3 w-0.5 bg-surface-container-highest"></div>

                    {/* Step 1: Completed */}
                    <div className="relative flex items-start gap-space-16 z-10">
                      <div className="w-6 h-6 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary shadow-sm flex-shrink-0">
                        <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-space-8">
                          <span className="font-body-sm-medium text-body-sm-medium text-on-surface font-bold">
                            Application Submitted
                          </span>
                          <span className="font-data-mono text-caption text-tertiary font-semibold">Completed</span>
                        </div>
                        <p className="font-caption text-caption text-on-surface-variant">
                          By Partner Agency 'Apex Talent' (Ref #APX-9812)
                        </p>
                        <span className="font-data-mono text-caption text-on-surface-variant">
                          12 Oct 2026 • 10:45 AM
                        </span>
                      </div>
                    </div>

                    {/* Step 2: Completed */}
                    <div className="relative flex items-start gap-space-16 z-10">
                      <div className="w-6 h-6 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary shadow-sm flex-shrink-0">
                        <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-space-8">
                          <span className="font-body-sm-medium text-body-sm-medium text-on-surface font-bold">
                            Resume Screened &amp; Shortlisted
                          </span>
                          <span className="font-data-mono text-caption text-tertiary font-semibold">Completed</span>
                        </div>
                        <p className="font-caption text-caption text-on-surface-variant">
                          Screened by Senior Recruiter (Marwan Al-Sayed)
                        </p>
                        <span className="font-data-mono text-caption text-on-surface-variant">
                          14 Oct 2026 • 03:15 PM
                        </span>
                      </div>
                    </div>

                    {/* Step 3: Completed with Scorecard */}
                    <div className="relative flex items-start gap-space-16 z-10">
                      <div className="w-6 h-6 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary shadow-sm flex-shrink-0">
                        <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-space-8">
                          <span className="font-body-sm-medium text-body-sm-medium text-on-surface font-bold">
                            Technical Round 1: Lead Architect
                          </span>
                          <span className="font-data-mono text-caption text-tertiary font-semibold">Completed</span>
                        </div>
                        <div className="mt-space-4 p-space-8 rounded-lg bg-surface-container flex flex-col gap-space-2">
                          <div className="flex items-center justify-between">
                            <span className="font-label-xs text-label-xs font-bold text-on-surface">
                              Score: 4.5 / 5.0
                            </span>
                            <span className="font-caption text-caption text-tertiary font-bold">Strong Yes</span>
                          </div>
                          <p className="font-caption text-caption text-on-surface italic">
                            "Exceptional mastery over JVM internals, memory compaction models, and concurrency hazards
                            under high throughput."
                          </p>
                        </div>
                        <span className="font-data-mono text-caption text-on-surface-variant pt-space-2">
                          16 Oct 2026 • 05:00 PM
                        </span>
                      </div>
                    </div>

                    {/* Step 4: In Progress */}
                    <div className="relative flex items-start gap-space-16 z-10">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm ring-4 ring-primary-fixed flex-shrink-0">
                        <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-space-8">
                          <span className="font-body-sm-medium text-body-sm-medium text-primary font-bold">
                            Client Cultural &amp; Leadership Round
                          </span>
                          <span className="px-space-6 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-data-mono text-label-xs font-bold">
                            IN PROGRESS
                          </span>
                        </div>
                        <div className="mt-space-4 p-space-8 rounded-lg bg-surface-container-high flex items-center justify-between">
                          <div className="flex items-center gap-space-8">
                            <span className="material-symbols-outlined text-[18px] text-primary">video_camera_front</span>
                            <span className="font-caption text-caption text-on-surface font-medium">
                              Tomorrow, 11:30 AM IST
                            </span>
                          </div>
                          <button
                            onClick={() => window.open("https://meet.google.com", "_blank")}
                            className="font-caption text-caption text-primary font-bold hover:underline cursor-pointer"
                          >
                            Launch Meet
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Step 5: Pending */}
                    <div className="relative flex items-start gap-space-16 z-10 opacity-70">
                      <div className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant flex-shrink-0">
                        <span className="material-symbols-outlined text-[14px]">lock_clock</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-body-sm-medium text-body-sm-medium text-on-surface font-semibold">
                          Offer Generation
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">
                          Pending Step 4 sign-off
                        </span>
                      </div>
                    </div>

                    {/* Step 6: Upcoming */}
                    <div className="relative flex items-start gap-space-16 z-10 opacity-40">
                      <div className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant flex-shrink-0">
                        <span className="material-symbols-outlined text-[14px]">flag</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-body-sm-medium text-body-sm-medium text-on-surface">
                          Onboarding &amp; Contract Finalization
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">
                          Expected target start: 01 Dec 2026
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes & Partner Activity Stream */}
                <div className="p-space-20 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-16">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-8">
                      <span className="material-symbols-outlined text-tertiary text-[22px]">forum</span>
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
                        Activity &amp; Collaboration
                      </span>
                    </div>
                    <button
                      onClick={() => document.getElementById("recruiter-note-input")?.focus()}
                      className="font-caption text-caption text-primary font-bold hover:underline cursor-pointer"
                      type="button"
                    >
                      + New Note
                    </button>
                  </div>

                  {/* Quick Comment Input Box */}
                  <div className="flex flex-col gap-space-8 p-space-12 rounded-xl bg-surface-container-low">
                    <textarea
                      id="recruiter-note-input"
                      className="w-full bg-transparent font-body-sm text-body-sm text-on-surface outline-none resize-none placeholder:text-on-surface-variant"
                      placeholder="Leave an internal recruiter comment or partner instruction..."
                      rows="2"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                    ></textarea>
                    <div className="flex items-center justify-between pt-space-4">
                      <div className="flex items-center gap-space-8">
                        <button
                          type="button"
                          className="text-on-surface-variant hover:text-primary cursor-pointer"
                          title="Attach file"
                        >
                          <span className="material-symbols-outlined text-[18px]">attach_file</span>
                        </button>
                        <button
                          type="button"
                          className="text-on-surface-variant hover:text-primary cursor-pointer"
                          title="Mention colleague"
                        >
                          <span className="material-symbols-outlined text-[18px]">alternate_email</span>
                        </button>
                        <span className="font-caption text-caption text-on-surface-variant">
                          Visible to Recruiter &amp; Super Admin
                        </span>
                      </div>
                      <button
                        onClick={handleAddNote}
                        className="px-space-12 py-space-4 rounded-lg bg-primary text-on-primary font-body-sm-medium text-body-sm-medium hover:bg-primary-container transition-all cursor-pointer"
                        type="button"
                      >
                        Post
                      </button>
                    </div>
                  </div>

                  {/* Stream Comments */}
                  <div className="flex flex-col gap-space-12">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-space-12 rounded-xl bg-surface-container flex flex-col gap-space-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-space-8">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-on-primary font-data-mono text-[10px] font-bold ${
                                note.authorInitials === "AT" ? "bg-tertiary text-on-tertiary" : "bg-primary"
                              }`}
                            >
                              {note.authorInitials}
                            </div>
                            <span className="font-body-sm-medium text-body-sm-medium text-on-surface font-bold">
                              {note.author}
                            </span>
                            <span
                              className={`px-space-6 py-0.5 rounded font-label-xs text-[10px] font-semibold ${note.badgeColor}`}
                            >
                              {note.badge}
                            </span>
                          </div>
                          <span className="font-caption text-caption text-on-surface-variant">{note.time}</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface">{note.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

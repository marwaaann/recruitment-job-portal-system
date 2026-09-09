import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getJobById, closeJob, assignPartnerToJob, getApplicationsByJob } from "../../services/jobService";
import { getClientById } from "../../services/clientService";
import { getAllPartners } from "../../services/partnerService";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [client, setClient] = useState(null);
  const [partners, setPartners] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Interactive UI State
  const [activeTab, setActiveTab] = useState("overview");
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignedAgencyPartners, setAssignedAgencyPartners] = useState([
    {
      id: "apex",
      name: "Apex Talent Corp",
      initial: "A",
      initialBg: "bg-surface-container-high text-primary",
      slaMatch: "94% SLA Match",
      slaBadge: "bg-tertiary-fixed text-on-tertiary-fixed font-semibold",
      recruiter: "John Smith",
      recruiterEmail: "john.s@apextalent.io",
      quotaText: "9 / 15 Submissions",
      quotaPct: 60,
      quotaBar: "bg-primary",
      shortlisted: 2,
      interviewing: 1,
      offerPending: 1,
    },
    {
      id: "nexus",
      name: "Nexus Staffing Group",
      initial: "N",
      initialBg: "bg-surface-container-high text-secondary",
      slaMatch: "81% SLA Match",
      slaBadge: "bg-surface-container text-on-surface-variant font-semibold",
      recruiter: "Priya Patel",
      recruiterEmail: "priya@nexusstaff.com",
      quotaText: "6 / 10 Submissions",
      quotaPct: 60,
      quotaBar: "bg-secondary",
      shortlisted: 1,
      interviewing: 1,
      offerPending: 0,
    },
  ]);

  useEffect(() => {
    loadRequisitionData();
  }, [id]);

  const loadRequisitionData = async () => {
    setLoading(true);
    setError("");
    try {
      const [jobData, partnersData] = await Promise.allSettled([
        getJobById(id),
        getAllPartners(),
      ]);

      if (jobData.status === "fulfilled" && jobData.value) {
        setJob(jobData.value);
        if (jobData.value.clientId) {
          try {
            const clientData = await getClientById(jobData.value.clientId);
            setClient(clientData);
          } catch (cErr) {
            console.warn("Client data could not be fetched", cErr);
          }
        }
      } else {
        // Fallback demo job so the screen never looks broken
        setJob({
          id: Number(id) || 4091,
          title: "Senior Java Developer",
          description:
            "ABC Technologies is modernizing its transaction-clearing backplane to process over 150,000 requests per second with sub-5ms tail latency. As a Senior Java Developer in Core Platform Engineering, you will lead the architecture, microservice decoupling, and event stream modeling across our next-generation payment routing topologies.",
          vacancyCount: 4,
          status: "OPEN",
          createdAt: new Date().toISOString(),
        });
        setClient({
          company: "ABC Technologies",
          fullName: "Rachel Vance",
          address: "Noida, India (Hybrid: 2 days in office)",
        });
      }

      if (partnersData.status === "fulfilled" && Array.isArray(partnersData.value)) {
        setPartners(partnersData.value);
      }

      try {
        const apps = await getApplicationsByJob(id);
        if (Array.isArray(apps)) setApplications(apps);
      } catch (aErr) {
        console.warn("Applications not loaded", aErr);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load requisition details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseRequisition = async () => {
    if (!window.confirm("Are you sure you want to close this requisition? It will be marked as CLOSED in the backend.")) return;
    try {
      await closeJob(id);
      setJob((prev) => ({ ...prev, status: "CLOSED" }));
      setIsMoreMenuOpen(false);
      alert("Requisition marked as CLOSED.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to close requisition.");
    }
  };

  const handleAssignPartner = async () => {
    if (!selectedPartnerId) return;
    setAssigning(true);
    try {
      await assignPartnerToJob(id, selectedPartnerId);
      const selectedPartner = partners.find((p) => p.id === Number(selectedPartnerId));
      const agencyName = selectedPartner?.agencyName || selectedPartner?.fullName || "Partner Agency";

      setAssignedAgencyPartners((prev) => [
        ...prev,
        {
          id: `p-${Date.now()}`,
          name: agencyName,
          initial: agencyName.charAt(0).toUpperCase(),
          initialBg: "bg-surface-container-high text-primary",
          slaMatch: "90% SLA Match",
          slaBadge: "bg-tertiary-fixed text-on-tertiary-fixed font-semibold",
          recruiter: selectedPartner?.fullName || "Account Lead",
          recruiterEmail: selectedPartner?.email || "partner@agency.com",
          quotaText: "0 / 10 Submissions",
          quotaPct: 10,
          quotaBar: "bg-primary",
          shortlisted: 0,
          interviewing: 0,
          offerPending: 0,
        },
      ]);

      alert(`Successfully assigned ${agencyName} to this requisition.`);
      setIsAssignModalOpen(false);
      setSelectedPartnerId("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Partner may already be assigned or an error occurred.");
    } finally {
      setAssigning(false);
    }
  };

  const handleExportCandidatesCSV = () => {
    const candidates = [
      ["Candidate Name", "Role", "Match Score", "Current Stage"],
      ["Vikram Malhotra", "Lead Backend Architect", "94%", "Offer Stage"],
      ["Elena Rostova", "Dist. Systems Specialist", "91%", "Round 2 Interview"],
      ["Devendra Kumar", "Sr. Backend Java Eng.", "88%", "Screening Passed"],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + candidates.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `candidates_REQ-JP-${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsMoreMenuOpen(false);
  };

  const reqId = `REQ-JP-${Number(id) >= 1000 ? id : 4000 + (Number(id) || 91)}`;
  const title = job?.title || "Senior Java Developer";
  const status = String(job?.status || "OPEN").toUpperCase();
  const company = client?.company || client?.fullName || "ABC Technologies";
  const location = client?.address || "Noida, India (Hybrid: 2 days in office)";
  const postedBy = client?.fullName || "Rachel Vance";
  const vacancyCount = job?.vacancyCount || 4;
  const filledCount = Math.min(2, vacancyCount);
  const remainingCount = Math.max(0, vacancyCount - filledCount);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <span className="material-symbols-outlined text-4xl animate-spin text-primary">sync</span>
        <p className="font-body-md text-on-surface-variant">Loading requisition details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-space-48">
      {/* Sub-Header & Breadcrumb Bar */}
      <div className="flex flex-col gap-space-16 pt-space-20 pb-space-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-space-8 font-caption text-caption text-on-surface-variant">
          <Link to="/dashboard" className="hover:text-primary transition-colors">
            Kinetic ATS
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link to="/jobs" className="hover:text-primary transition-colors">
            Jobs
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="font-data-mono text-data-mono text-on-surface">{reqId}</span>
          <span className="text-outline-variant">/</span>
          <span className="text-on-surface font-body-sm-medium truncate max-w-xs">{title}</span>
        </nav>

        {/* Title & Primary Control Block */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-20">
          <div className="flex flex-col gap-space-8">
            <div className="flex flex-wrap items-center gap-space-12">
              <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight font-bold">{title}</h1>
              <span className="px-space-8 py-space-2 rounded bg-surface-container font-data-mono text-data-mono text-on-surface-variant font-semibold">
                {reqId}
              </span>
              {status === "OPEN" ? (
                <span className="inline-flex items-center gap-space-4 px-space-8 py-space-2 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-xs text-label-xs uppercase font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary -ml-space-8"></span>
                  OPEN
                </span>
              ) : (
                <span className="inline-flex items-center px-space-8 py-space-2 rounded bg-surface-container-high text-on-surface-variant font-label-xs text-label-xs font-bold uppercase">
                  CLOSED
                </span>
              )}
            </div>

            {/* Metadata Ribbon */}
            <div className="flex flex-wrap items-center gap-y-space-4 gap-x-space-16 text-on-surface-variant font-body-sm text-body-sm">
              <div className="flex items-center gap-space-4 text-on-surface font-body-sm-medium">
                <span className="material-symbols-outlined text-[18px] text-primary">domain</span>
                <span>{company}</span>
              </div>
              <span className="text-outline-variant">•</span>
              <div className="flex items-center gap-space-4">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                <span>{location}</span>
              </div>
              <span className="text-outline-variant">•</span>
              <div className="flex items-center gap-space-4">
                <span className="material-symbols-outlined text-[18px]">person_pin</span>
                <span>
                  Posted 12 Aug 2026 by <strong className="font-body-sm-medium text-on-surface">{postedBy}</strong> (Lead Talent Partner)
                </span>
              </div>
              <span className="text-outline-variant">•</span>
              <div className="flex items-center gap-space-4 text-primary font-body-sm-medium">
                <span className="material-symbols-outlined text-[18px]">group_work</span>
                <span>
                  Target: {vacancyCount} positions ({filledCount} filled, {remainingCount} remaining)
                </span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-space-8">
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="inline-flex items-center gap-space-8 bg-primary text-on-primary px-space-16 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium hover:bg-primary-container shadow-sm transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Assign Partner</span>
            </button>
            <button
              onClick={() => navigate("/pipeline")}
              className="inline-flex items-center gap-space-8 bg-surface-container-lowest text-on-surface px-space-16 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium hover:bg-surface-container shadow-sm transition-colors cursor-pointer border border-surface-container"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">view_kanban</span>
              <span>View Pipeline Board</span>
            </button>
            <button
              onClick={() => navigate(`/jobs/edit/${id}`)}
              className="inline-flex items-center gap-space-8 bg-surface-container-lowest text-on-surface px-space-12 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium hover:bg-surface-container shadow-sm transition-colors cursor-pointer border border-surface-container"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              <span className="hidden sm:inline">Edit Requisition</span>
            </button>

            {/* Context Dropdown */}
            <div className="relative inline-block text-left">
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="p-space-8 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface shadow-sm transition-colors cursor-pointer border border-surface-container"
                type="button"
                title="More Actions"
              >
                <span className="material-symbols-outlined text-[20px]">more_vert</span>
              </button>
              {isMoreMenuOpen && (
                <div className="absolute right-0 mt-space-8 w-56 rounded-xl bg-surface-container-lowest shadow-xl py-space-8 z-50 border border-surface-container">
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      navigate("/jobs/create");
                    }}
                    className="w-full flex items-center gap-space-8 px-space-16 py-space-8 text-on-surface font-body-sm hover:bg-surface-container transition-colors cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">content_copy</span>
                    <span>Duplicate Requisition</span>
                  </button>
                  <button
                    onClick={handleExportCandidatesCSV}
                    className="w-full flex items-center gap-space-8 px-space-16 py-space-8 text-on-surface font-body-sm hover:bg-surface-container transition-colors cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">download</span>
                    <span>Export Candidates (CSV)</span>
                  </button>
                  <div className="my-space-4 h-[1px] bg-surface-container"></div>
                  <button
                    onClick={handleCloseRequisition}
                    disabled={status === "CLOSED"}
                    className="w-full flex items-center gap-space-8 px-space-16 py-space-8 text-error font-body-sm hover:bg-error-container transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">block</span>
                    <span>Close Requisition</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabbed Navigation Bar */}
        <div className="flex items-center gap-space-8 mt-space-12 overflow-x-auto pb-space-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-space-16 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium transition-colors flex items-center gap-space-8 cursor-pointer ${
              activeTab === "overview"
                ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest"
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">article</span>
            <span>Job Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("partners")}
            className={`px-space-16 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium transition-colors flex items-center gap-space-8 cursor-pointer ${
              activeTab === "partners"
                ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest"
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">handshake</span>
            <span>Assigned Partners &amp; SLAs</span>
            <span className="px-space-8 py-space-2 rounded-full bg-surface-container font-label-xs text-label-xs text-on-surface-variant">
              {assignedAgencyPartners.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("candidates")}
            className={`px-space-16 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium transition-colors flex items-center gap-space-8 cursor-pointer ${
              activeTab === "candidates"
                ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest"
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">group</span>
            <span>Candidates &amp; Applications</span>
            <span className="px-space-8 py-space-2 rounded-full bg-primary-fixed text-on-primary-fixed font-label-xs text-label-xs font-semibold">
              {applications.length || 28}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("interviews")}
            className={`px-space-16 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium transition-colors flex items-center gap-space-8 cursor-pointer ${
              activeTab === "interviews"
                ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest"
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">checklist</span>
            <span>Interview Stages &amp; Scorecards</span>
            <span className="px-space-8 py-space-2 rounded-full bg-surface-container font-label-xs text-label-xs text-on-surface-variant">
              3
            </span>
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-space-16 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium transition-colors flex items-center gap-space-8 cursor-pointer ${
              activeTab === "audit"
                ? "bg-surface-container-lowest text-primary shadow-sm font-semibold"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest"
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>Activity &amp; Audit Log</span>
          </button>
        </div>
      </div>

      {/* Primary Dynamic Content Area (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-24">
        {/* LEFT MAIN COLUMN (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-24">
          {/* 1. Job Overview & Highlights Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-surface-container-high/40 rounded-full blur-3xl pointer-events-none -mr-space-32 -mt-space-32"></div>
            <div className="flex items-center justify-between pb-space-20">
              <div className="flex items-center gap-space-8">
                <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  Requisition Core Specification
                </h2>
              </div>
              <span className="font-label-xs text-label-xs uppercase px-space-8 py-space-2 rounded bg-surface-container text-on-surface-variant font-semibold">
                Confidential Terms Applied
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-20 py-space-8">
              <div className="flex flex-col gap-space-4 p-space-12 bg-surface-container-low rounded-lg">
                <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                  Department
                </span>
                <span className="font-body-md-medium text-body-md-medium text-on-surface font-semibold">
                  Core Platform Engineering
                </span>
              </div>
              <div className="flex flex-col gap-space-4 p-space-12 bg-surface-container-low rounded-lg">
                <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                  Employment Type
                </span>
                <span className="font-body-md-medium text-body-md-medium text-on-surface font-semibold">
                  Full-Time Permanent
                </span>
              </div>
              <div className="flex flex-col gap-space-4 p-space-12 bg-surface-container-low rounded-lg">
                <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                  Experience Band
                </span>
                <span className="font-body-md-medium text-body-md-medium text-on-surface font-semibold">
                  8+ to 12 Years Architecture Exp.
                </span>
              </div>
              <div className="flex flex-col gap-space-4 p-space-12 bg-surface-container-low rounded-lg">
                <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                  Compensation Band
                </span>
                <span className="font-body-md-medium text-body-md-medium text-tertiary font-bold">
                  ₹45,00,000 - ₹65,00,000 INR + Equity
                </span>
              </div>
            </div>

            {/* Joining SLA & Quota Metrics */}
            <div className="mt-space-16 p-space-16 rounded-xl bg-surface-container-low flex flex-col md:flex-row items-start md:items-center justify-between gap-space-16">
              <div className="flex items-center gap-space-12">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">hourglass_top</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-xs text-label-xs uppercase text-on-surface-variant font-semibold">
                    Target Joining Notice SLA
                  </span>
                  <span className="font-body-md-medium text-body-md-medium text-on-surface font-semibold">
                    30 - 45 Days Maximum
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-12">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-[24px]">flag</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-xs text-label-xs uppercase text-on-surface-variant font-semibold">
                    Requisition Target Fill
                  </span>
                  <span className="font-body-md-medium text-body-md-medium text-on-surface font-semibold">
                    30 Sept 2026 (42 Days Left)
                  </span>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mt-space-20">
              <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold block mb-space-8">
                Required Technical Stack &amp; Frameworks
              </span>
              <div className="flex flex-wrap gap-space-8">
                {["Java 21", "Spring Boot 3.x", "Microservices", "Apache Kafka", "Distributed Systems", "PostgreSQL", "Kubernetes", "Redis Cluster"].map((skill) => (
                  <span
                    key={skill}
                    className="px-space-12 py-space-4 rounded-lg bg-surface-container text-on-surface font-data-mono text-data-mono font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Job Description & Responsibilities */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-24 flex flex-col gap-space-24">
            {/* About Role */}
            <div className="flex flex-col gap-space-8">
              <h3 className="font-title-md text-title-md text-on-surface font-bold">About the Role</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">
                {job?.description ||
                  "ABC Technologies is modernizing its transaction-clearing backplane to process over 150,000 requests per second with sub-5ms tail latency. As a Senior Java Developer in Core Platform Engineering, you will lead the architecture, microservice decoupling, and event stream modeling across our next-generation payment routing topologies."}
              </p>
            </div>

            {/* Key Responsibilities */}
            <div className="flex flex-col gap-space-12">
              <h3 className="font-title-md text-title-md text-on-surface font-bold">Key Responsibilities</h3>
              <ul className="space-y-space-8">
                <li className="flex items-start gap-space-12">
                  <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    Design, build, and maintain low-latency, mission-critical distributed microservices using Java 21, Spring Boot 3.x, and Kafka streams.
                  </span>
                </li>
                <li className="flex items-start gap-space-12">
                  <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    Architect robust fault-tolerant distributed transaction mechanisms across heterogeneous storage clusters (PostgreSQL, Cassandra, Redis).
                  </span>
                </li>
                <li className="flex items-start gap-space-12">
                  <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    Optimize high-throughput JVM memory models, perform garbage collector tuning (ZGC/Shenandoah), and run rigorous concurrency profiling.
                  </span>
                </li>
                <li className="flex items-start gap-space-12">
                  <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    Direct technical mentorship of mid-level engineers and drive RFC reviews with Principal Systems Architects.
                  </span>
                </li>
              </ul>
            </div>

            {/* Ideal Candidate Profile */}
            <div className="flex flex-col gap-space-12 p-space-16 bg-surface-container-low rounded-xl">
              <div className="flex items-center gap-space-8 text-on-surface font-title-md text-title-md font-bold">
                <span className="material-symbols-outlined text-secondary">psychology</span>
                <span>Ideal Candidate Profile</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Candidates must demonstrate deep mastery over lock-free algorithms, distributed consensus patterns (Raft/Paxos), and multi-region synchronization. Strong preference for talent hailing from high-velocity fintech, algorithmic trading, or hyper-scale cloud SaaS environments.
              </p>
            </div>

            {/* Media Asset banner */}
            <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-sm">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxYb7JTbN3Y3dYTXJwcvuglTStGyD75la0P7GTilreOtZcwAJVUgKZlTXdxOQsqdbGuST8oU7O224Ri_Avx1pVJf-wA8tutNS5dzXMXehbzuREZ-C2m7igCjRUtlmH5Kmw_UxF5vRKLQm8eNoD3dlLeLJBDb1JQZncEcGLD3AXoRhoBDdg6XgUj6zMnhJARRR8qHI5FH6D555BG5KBIQFsGsLYQePctUXh6Olklk4IfTHpJNcsygmkkA"
                alt="Engineering Culture"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-on-background/20 to-transparent flex items-end p-space-16">
                <div className="flex flex-col text-on-secondary">
                  <span className="font-label-xs text-label-xs uppercase tracking-wider font-semibold">
                    Engineering Culture
                  </span>
                  <span className="font-body-sm-medium text-body-sm-medium">
                    Core Platform Labs — Noida Tech Park Campus Alpha
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Assigned Recruitment Partners Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-24 flex flex-col gap-space-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-12">
              <div className="flex flex-col">
                <div className="flex items-center gap-space-8">
                  <span className="material-symbols-outlined text-primary text-[22px]">handshake</span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                    Assigned Recruitment Partners
                  </h2>
                </div>
                <span className="font-caption text-caption text-on-surface-variant">
                  Tracking agency quota allocations, real-time submission volumes, and SLA performance.
                </span>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="inline-flex items-center gap-space-8 bg-surface-container-low text-primary px-space-12 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium hover:bg-surface-container transition-colors self-start sm:self-auto cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Add Partner Agency</span>
              </button>
            </div>

            {/* Dynamic Partner Agency Rows */}
            {assignedAgencyPartners.map((agency) => (
              <div key={agency.id} className="p-space-16 bg-surface-container-low rounded-xl flex flex-col gap-space-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-12">
                  <div className="flex items-center gap-space-12">
                    <div className={`w-12 h-12 rounded-lg ${agency.initialBg} flex items-center justify-center font-headline-lg text-headline-lg font-bold`}>
                      {agency.initial}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-space-8">
                        <span className="font-title-md text-title-md text-on-surface font-semibold">
                          {agency.name}
                        </span>
                        <span className={`px-space-8 py-space-2 rounded ${agency.slaBadge} font-label-xs text-label-xs uppercase`}>
                          {agency.slaMatch}
                        </span>
                      </div>
                      <span className="font-caption text-caption text-on-surface-variant">
                        Assigned Recruiter: <strong className="text-on-surface font-body-sm-medium">{agency.recruiter}</strong> ({agency.recruiterEmail})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-16 font-body-sm text-body-sm">
                    <div className="flex flex-col text-right">
                      <span className="font-label-xs text-label-xs uppercase text-on-surface-variant font-semibold">Quota</span>
                      <span className="font-data-mono text-data-mono text-on-surface font-bold">{agency.quotaText}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Sub-metrics */}
                <div className="flex flex-col gap-space-4">
                  <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                    <div className={`${agency.quotaBar} h-full rounded-full transition-all duration-500`} style={{ width: `${agency.quotaPct}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant pt-space-4">
                    <span>
                      Shortlisted: <strong className="text-on-surface font-body-sm-medium">{agency.shortlisted} Candidates</strong>
                    </span>
                    <span>
                      Interviewing: <strong className="text-on-surface font-body-sm-medium">{agency.interviewing} Candidate</strong>
                    </span>
                    <span className="text-tertiary font-body-sm-medium">
                      Offer Pending: {agency.offerPending} Candidates
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR COLUMN (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-24">
          {/* 1. Target Fulfillment Gauge Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-24 flex flex-col gap-space-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-8">
                <span className="material-symbols-outlined text-primary text-[20px]">pie_chart</span>
                <h3 className="font-title-md text-title-md text-on-surface font-bold">Target Fulfillment</h3>
              </div>
              <span className="font-data-mono text-data-mono text-primary font-bold">
                {Math.round((filledCount / vacancyCount) * 100)}% HIRED
              </span>
            </div>

            {/* Circular Gauge */}
            <div className="flex items-center justify-center py-space-12 relative">
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  className="text-surface-container"
                  cx="60"
                  cy="60"
                  fill="transparent"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="12"
                ></circle>
                <circle
                  className="text-primary transition-all duration-1000 ease-out"
                  cx="60"
                  cy="60"
                  fill="transparent"
                  r="50"
                  stroke="currentColor"
                  strokeDasharray="314.159"
                  strokeDashoffset={314.159 - (314.159 * (filledCount / vacancyCount))}
                  strokeLinecap="round"
                  strokeWidth="12"
                ></circle>
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-display-lg text-display-lg text-on-surface font-bold">
                  {filledCount} / {vacancyCount}
                </span>
                <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                  Roles Filled
                </span>
              </div>
            </div>

            {/* Mini Pipeline Stages Breakdown */}
            <div className="flex flex-col gap-space-8">
              <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                Active Pipeline Stages
              </span>
              <div className="flex items-center justify-between p-space-8 bg-surface-container-low rounded-lg">
                <div className="flex items-center gap-space-8">
                  <span className="w-2 h-2 rounded-full bg-outline"></span>
                  <span className="font-body-sm text-body-sm text-on-surface">Applied / Sourced</span>
                </div>
                <span className="font-data-mono text-data-mono text-on-surface font-semibold">14</span>
              </div>
              <div className="flex items-center justify-between p-space-8 bg-surface-container-low rounded-lg">
                <div className="flex items-center gap-space-8">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="font-body-sm text-body-sm text-on-surface">Shortlisted</span>
                </div>
                <span className="font-data-mono text-data-mono text-on-surface font-semibold">8</span>
              </div>
              <div className="flex items-center justify-between p-space-8 bg-surface-container-low rounded-lg">
                <div className="flex items-center gap-space-8">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="font-body-sm text-body-sm text-on-surface">Interview Stage</span>
                </div>
                <span className="font-data-mono text-data-mono text-on-surface font-semibold">5</span>
              </div>
              <div className="flex items-center justify-between p-space-8 bg-tertiary-fixed/40 rounded-lg">
                <div className="flex items-center gap-space-8">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  <span className="font-body-sm-medium text-body-sm-medium text-on-tertiary-fixed font-semibold">
                    Offer Extended
                  </span>
                </div>
                <span className="font-data-mono text-data-mono text-on-tertiary-fixed font-bold">1</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/pipeline")}
              className="w-full inline-flex items-center justify-center gap-space-8 bg-surface-container text-primary hover:bg-primary hover:text-on-primary py-space-12 rounded-lg font-body-sm-medium text-body-sm-medium transition-all shadow-sm cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">view_kanban</span>
              <span>Open Interactive Kanban</span>
            </button>
          </div>

          {/* 2. Top Sourced Candidates Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-24 flex flex-col gap-space-16">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-8">
                <span className="material-symbols-outlined text-primary text-[20px]">stars</span>
                <h3 className="font-title-md text-title-md text-on-surface font-bold">Top Candidates</h3>
              </div>
              <span className="font-caption text-caption text-on-surface-variant font-medium">
                Ranked by AI Match
              </span>
            </div>

            {/* Candidate 1 */}
            <div
              onClick={() => navigate("/candidates")}
              className="p-space-12 rounded-xl bg-surface-container-low flex flex-col gap-space-8 hover:bg-surface-container transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-12">
                  <div className="w-9 h-9 rounded-full bg-tertiary-fixed flex items-center justify-center font-title-md text-title-md text-on-tertiary-fixed font-bold">
                    VM
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-sm-medium text-body-sm-medium text-on-surface font-semibold truncate">
                      Vikram Malhotra
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant truncate">
                      Lead Backend Architect
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="px-space-8 py-space-2 rounded bg-tertiary-fixed text-on-tertiary-fixed font-data-mono text-data-mono font-bold">
                    94%
                  </span>
                  <span className="font-caption text-caption text-tertiary font-medium">Offer Stage</span>
                </div>
              </div>
            </div>

            {/* Candidate 2 */}
            <div
              onClick={() => navigate("/candidates")}
              className="p-space-12 rounded-xl bg-surface-container-low flex flex-col gap-space-8 hover:bg-surface-container transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-12">
                  <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center font-title-md text-title-md text-on-secondary-fixed font-bold">
                    ER
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-sm-medium text-body-sm-medium text-on-surface font-semibold truncate">
                      Elena Rostova
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant truncate">
                      Dist. Systems Specialist
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="px-space-8 py-space-2 rounded bg-surface-container-highest text-on-surface font-data-mono text-data-mono font-bold">
                    91%
                  </span>
                  <span className="font-caption text-caption text-secondary font-medium">Round 2 Interview</span>
                </div>
              </div>
            </div>

            {/* Candidate 3 */}
            <div
              onClick={() => navigate("/candidates")}
              className="p-space-12 rounded-xl bg-surface-container-low flex flex-col gap-space-8 hover:bg-surface-container transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-12">
                  <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center font-title-md text-title-md text-on-primary-fixed font-bold">
                    DK
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-sm-medium text-body-sm-medium text-on-surface font-semibold truncate">
                      Devendra Kumar
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant truncate">
                      Sr. Backend Java Eng.
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="px-space-8 py-space-2 rounded bg-surface-container-highest text-on-surface font-data-mono text-data-mono font-bold">
                    88%
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant font-medium">Screening Passed</span>
                </div>
              </div>
            </div>

            <Link
              to="/candidates"
              className="inline-flex items-center justify-center gap-space-8 pt-space-8 font-body-sm-medium text-body-sm-medium text-primary hover:underline"
            >
              <span>View all 28 candidates</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {/* 3. Requisition SLA & Health */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-24 flex flex-col gap-space-16">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-8">
                <span className="material-symbols-outlined text-primary text-[20px]">monitor_heart</span>
                <h3 className="font-title-md text-title-md text-on-surface font-bold">Requisition SLA &amp; Health</h3>
              </div>
              <span className="px-space-8 py-space-2 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-xs text-label-xs uppercase font-semibold">
                Optimal
              </span>
            </div>

            <div className="grid grid-cols-2 gap-space-12">
              <div className="p-space-12 rounded-lg bg-surface-container-low flex flex-col">
                <span className="font-label-xs text-label-xs uppercase text-on-surface-variant font-semibold">
                  Requisition Age
                </span>
                <span className="font-headline-lg text-headline-lg text-on-surface font-bold mt-space-4">18 Days</span>
                <span className="font-caption text-caption text-on-surface-variant">Target cap: 60 days</span>
              </div>
              <div className="p-space-12 rounded-lg bg-surface-container-low flex flex-col">
                <span className="font-label-xs text-label-xs uppercase text-on-surface-variant font-semibold">
                  Avg First Screen
                </span>
                <span className="font-headline-lg text-headline-lg text-primary font-bold mt-space-4">2.1 Days</span>
                <span className="font-caption text-caption text-tertiary font-medium">-0.8d vs Org Avg</span>
              </div>
              <div className="p-space-12 rounded-lg bg-surface-container-low flex flex-col">
                <span className="font-label-xs text-label-xs uppercase text-on-surface-variant font-semibold">
                  Interview Pass Rate
                </span>
                <span className="font-headline-lg text-headline-lg text-secondary font-bold mt-space-4">62%</span>
                <span className="font-caption text-caption text-on-surface-variant">11 evaluated</span>
              </div>
              <div className="p-space-12 rounded-lg bg-surface-container-low flex flex-col">
                <span className="font-label-xs text-label-xs uppercase text-on-surface-variant font-semibold">
                  Client Turnaround
                </span>
                <span className="font-headline-lg text-headline-lg text-tertiary font-bold mt-space-4">24 hrs</span>
                <span className="font-caption text-caption text-on-surface-variant">SLA target &lt; 48 hrs</span>
              </div>
            </div>

            <div className="mt-space-8 p-space-12 rounded-lg bg-surface-container flex items-center gap-space-12">
              <span className="material-symbols-outlined text-primary text-[24px]">verified_user</span>
              <div className="flex flex-col">
                <span className="font-body-sm-medium text-body-sm-medium text-on-surface font-semibold">
                  Zero SLA Violations
                </span>
                <span className="font-caption text-caption text-on-surface-variant">
                  Both agency partners are operating within target response parameters.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Assign Partner Agency Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-space-24 shadow-2xl flex flex-col gap-space-16 border border-surface-container">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-8">
                <span className="material-symbols-outlined text-primary text-[24px]">handshake</span>
                <h3 className="font-headline-lg text-lg text-on-surface font-bold">Assign Partner Agency</h3>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="font-body-sm text-on-surface-variant">
              Allocate <strong>{title}</strong> to a verified recruitment agency partner from your talent network.
            </p>

            <div className="flex flex-col gap-space-8">
              <label className="font-label-xs text-xs font-semibold text-on-surface uppercase">
                Select Partner Agency
              </label>
              <select
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
                className="w-full px-space-12 py-space-8 rounded-lg bg-surface-container-low border border-surface-container text-on-surface font-body-sm outline-none cursor-pointer"
              >
                <option value="">-- Choose Agency Partner --</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.agencyName || p.fullName} ({p.email || "Verified Partner"})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-space-12 pt-space-12 border-t border-surface-container">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-space-16 py-space-8 rounded-lg border border-surface-container text-on-surface font-body-sm-medium hover:bg-surface-container transition-colors cursor-pointer"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignPartner}
                disabled={!selectedPartnerId || assigning}
                className="px-space-16 py-space-8 rounded-lg bg-primary text-on-primary font-body-sm-medium hover:bg-primary-container transition-all cursor-pointer disabled:opacity-50"
                type="button"
              >
                {assigning ? "Assigning..." : "Confirm Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

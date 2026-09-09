import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllJobs, closeJob, assignPartnerToJob } from "../../services/jobService";
import { getAllClients } from "../../services/clientService";
import { getAllPartners } from "../../services/partnerService";

const FALLBACK_JOBS = [
  {
    id: 4091,
    title: "Senior Java Developer",
    reqId: "REQ-JP-4091",
    jobType: "Full-Time",
    location: "Noida / Hybrid",
    clientCompany: "ABC Technologies",
    accountManager: "Rachel Vance",
    department: "Core Platform",
    level: "L6 Staff Engineer",
    filled: 2,
    vacancyCount: 4,
    pipelineCount: 28,
    pipelineBreakdown: { appl: 14, short: 8, int: 5, offer: 1 },
    assignedPartners: ["Apex Talent", "Nexus Staffing"],
    status: "OPEN",
    icon: "business",
    iconBg: "bg-surface-container-high text-primary",
  },
  {
    id: 4088,
    title: "Lead DevOps & SRE Architect",
    reqId: "REQ-JP-4088",
    jobType: "Full-Time",
    location: "Bengaluru / Hybrid",
    clientCompany: "FinTech Corp",
    accountManager: "Tarun Mathur",
    department: "Infrastructure",
    level: "Principal Architect",
    filled: 1,
    vacancyCount: 2,
    pipelineCount: 19,
    pipelineBreakdown: { appl: 9, short: 6, int: 4, offer: 0 },
    assignedPartners: ["Global Devs"],
    status: "OPEN",
    icon: "account_balance",
    iconBg: "bg-surface-container-high text-secondary",
  },
  {
    id: 4075,
    title: "React Platform Architect",
    reqId: "REQ-JP-4075",
    jobType: "Full-Time",
    location: "Remote",
    clientCompany: "CloudScale Global",
    accountManager: "Priya Sharma",
    department: "Frontend Engineering",
    level: "L7 Architect",
    filled: 0,
    vacancyCount: 1,
    pipelineCount: 14,
    pipelineBreakdown: { appl: 8, short: 4, int: 2, offer: 0 },
    assignedPartners: ["Apex Talent"],
    status: "OPEN",
    icon: "cloud",
    iconBg: "bg-surface-container-high text-primary",
  },
  {
    id: 4062,
    title: "Product Design Lead",
    reqId: "REQ-JP-4062",
    jobType: "Full-Time",
    location: "Hyderabad",
    clientCompany: "MatrixLabs",
    accountManager: "Rachel Vance",
    department: "Design & UX",
    level: "Staff Product Designer",
    filled: 1,
    vacancyCount: 1,
    pipelineCount: 32,
    pipelineBreakdown: { concl: 32 },
    assignedPartners: ["Direct Inbound"],
    status: "CLOSED",
    icon: "design_services",
    iconBg: "bg-surface-container-high text-on-surface-variant",
  },
  {
    id: 4099,
    title: "Distributed Systems Go Engineer",
    reqId: "REQ-JP-4099",
    jobType: "Full-Time",
    location: "Bengaluru",
    clientCompany: "NeoBank Systems",
    accountManager: "Sarah Lin",
    department: "Core Banking",
    level: "L5 Senior",
    filled: 0,
    vacancyCount: 3,
    pipelineCount: 8,
    pipelineBreakdown: { screen: 8, int: 0 },
    assignedPartners: [],
    status: "CLOSED",
    icon: "payments",
    iconBg: "bg-surface-container-high text-primary",
  },
];

export default function Jobs() {
  const navigate = useNavigate();

  const [backendJobs, setBackendJobs] = useState([]);
  const [clients, setClients] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [clientFilter, setClientFilter] = useState("ALL");
  const [partnerFilter, setPartnerFilter] = useState("ALL");

  // Dropdown open state
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Assign Partner Modal state
  const [assignModalJob, setAssignModalJob] = useState(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState("");
  const [assigning, setAssigning] = useState(false);

  // Pagination state
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsData, clientsData, partnersData] = await Promise.allSettled([
        getAllJobs(),
        getAllClients(),
        getAllPartners(),
      ]);

      const loadedJobs = jobsData.status === "fulfilled" && Array.isArray(jobsData.value) ? jobsData.value : [];
      const loadedClients = clientsData.status === "fulfilled" && Array.isArray(clientsData.value) ? clientsData.value : [];
      const loadedPartners = partnersData.status === "fulfilled" && Array.isArray(partnersData.value) ? partnersData.value : [];

      setBackendJobs(loadedJobs);
      setClients(loadedClients);
      setPartners(loadedPartners);
    } catch (err) {
      console.error("Failed to load jobs data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Merge backend jobs with clients mapping, or fallback
  const combinedJobs = useMemo(() => {
    if (backendJobs.length === 0) {
      return FALLBACK_JOBS;
    }

    const clientMap = new Map(clients.map((c) => [c.id, c]));

    return backendJobs.map((bJob, index) => {
      const matchedClient = clientMap.get(bJob.clientId);
      const reqNumber = bJob.id >= 1000 ? bJob.id : 4000 + bJob.id;
      return {
        id: bJob.id,
        title: bJob.title || "Untitled Position",
        reqId: `REQ-JP-${reqNumber}`,
        jobType: "Full-Time",
        location: matchedClient?.address || "Bengaluru / Hybrid",
        clientCompany: matchedClient?.company || matchedClient?.fullName || `Client #${bJob.clientId}`,
        accountManager: matchedClient?.fullName || "Account Lead",
        department: "Engineering",
        level: "Senior",
        filled: Math.min(1, bJob.vacancyCount || 1),
        vacancyCount: bJob.vacancyCount || 1,
        pipelineCount: 12 + index * 4,
        pipelineBreakdown: { appl: 6 + index, short: 3, int: 2, offer: 1 },
        assignedPartners: partners.slice(0, 2).map((p) => p.agencyName || p.fullName),
        status: String(bJob.status || "OPEN").toUpperCase(),
        icon: "business",
        iconBg: "bg-surface-container-high text-primary",
      };
    });
  }, [backendJobs, clients, partners]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return combinedJobs.filter((job) => {
      if (statusFilter !== "ALL" && job.status !== statusFilter) return false;
      if (clientFilter !== "ALL" && job.clientCompany !== clientFilter) return false;
      if (locationFilter !== "ALL" && !job.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      if (deptFilter !== "ALL" && !job.department.toLowerCase().includes(deptFilter.toLowerCase())) return false;
      if (partnerFilter !== "ALL" && !job.assignedPartners.includes(partnerFilter)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          job.title.toLowerCase().includes(q) ||
          job.reqId.toLowerCase().includes(q) ||
          job.clientCompany.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [combinedJobs, statusFilter, clientFilter, locationFilter, deptFilter, partnerFilter, searchQuery]);

  // Summary Metrics
  const openCount = useMemo(() => combinedJobs.filter((j) => j.status === "OPEN").length, [combinedJobs]);
  const closedCount = useMemo(() => combinedJobs.filter((j) => j.status === "CLOSED").length, [combinedJobs]);

  // Handle closing a requisition via backend
  const handleCloseJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to close this job requisition? It will be marked as CLOSED.")) return;
    try {
      await closeJob(jobId);
      setBackendJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: "CLOSED" } : j))
      );
      setOpenDropdownId(null);
      alert("Job requisition closed successfully.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to close requisition.");
    }
  };

  // Handle assigning partner
  const handleConfirmAssign = async () => {
    if (!selectedPartnerId || !assignModalJob) return;
    setAssigning(true);
    try {
      await assignPartnerToJob(assignModalJob.id, selectedPartnerId);
      const assignedPartner = partners.find((p) => p.id === Number(selectedPartnerId));
      const partnerName = assignedPartner?.agencyName || assignedPartner?.fullName || "Partner";

      setBackendJobs((prev) =>
        prev.map((j) => {
          if (j.id === assignModalJob.id) {
            return {
              ...j,
              assignedPartners: [...(j.assignedPartners || []), partnerName],
            };
          }
          return j;
        })
      );
      alert(`Partner assigned to ${assignModalJob.title} successfully.`);
      setAssignModalJob(null);
      setSelectedPartnerId("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to assign partner. They may already be assigned.");
    } finally {
      setAssigning(false);
    }
  };

  // Export Data to CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Title", "Client", "Department", "Openings", "Filled", "Status"];
    const rows = filteredJobs.map((j) => [
      j.reqId,
      `"${j.title}"`,
      `"${j.clientCompany}"`,
      `"${j.department}"`,
      j.vacancyCount,
      j.filled,
      j.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `jobs_requisitions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setDeptFilter("ALL");
    setLocationFilter("ALL");
    setClientFilter("ALL");
    setPartnerFilter("ALL");
  };

  // Pagination Slice
  const totalPages = Math.ceil(filteredJobs.length / pageSize) || 1;
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col w-full pb-space-32">
      {/* Top Banner & Action Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-16 pt-space-24 pb-space-20">
        <div className="flex flex-col gap-space-4">
          <div className="flex items-center gap-space-8">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
              Jobs &amp; Requisitions
            </h1>
            <span className="px-space-8 py-space-2 rounded-full bg-primary-fixed text-on-primary-fixed font-data-mono text-data-mono font-semibold">
              {combinedJobs.length} Total
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Manage active requisitions, client assignments, partner allocations, and hiring targets across operational hubs.
          </p>
        </div>
        <div className="flex items-center gap-space-12 flex-shrink-0">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-space-8 bg-surface-container-lowest text-on-surface px-space-16 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium shadow-sm hover:bg-surface-container transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">file_download</span>
            <span>Export Data</span>
          </button>
          <button
            onClick={() => navigate("/jobs/create")}
            className="inline-flex items-center gap-space-8 bg-primary-container text-on-primary px-space-16 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium shadow-sm hover:bg-primary transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Create Requisition</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-16 mb-space-24">
        {/* Card 1: Open Requisitions */}
        <div className="bg-surface-container-lowest rounded-xl p-space-16 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-xs text-label-xs uppercase tracking-wider font-semibold">Open Requisitions</span>
            <span className="material-symbols-outlined text-primary text-[20px]">assignment_turned_in</span>
          </div>
          <div className="flex items-baseline gap-space-8 mt-space-12">
            <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">
              {openCount}
            </span>
            <span className="font-body-sm text-body-sm text-tertiary font-medium">active hiring</span>
          </div>
          <div className="flex items-center gap-space-8 mt-space-8 pt-space-8 bg-surface-container-low px-space-8 py-space-4 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-caption text-caption text-on-surface-variant">
              {closedCount} requisitions closed / archived
            </span>
          </div>
        </div>

        {/* Card 2: Total Sourced */}
        <div className="bg-surface-container-lowest rounded-xl p-space-16 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-xs text-label-xs uppercase tracking-wider font-semibold">Total Sourced</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">groups</span>
          </div>
          <div className="flex items-baseline gap-space-8 mt-space-12">
            <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">1,428</span>
            <span className="font-body-sm text-body-sm text-tertiary font-medium">+14.2%</span>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5 mt-space-8 overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: "78%" }}></div>
          </div>
        </div>

        {/* Card 3: Avg Days to Fill */}
        <div className="bg-surface-container-lowest rounded-xl p-space-16 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-xs text-label-xs uppercase tracking-wider font-semibold">Avg Days to Fill</span>
            <span className="material-symbols-outlined text-tertiary text-[20px]">timer</span>
          </div>
          <div className="flex items-baseline gap-space-8 mt-space-12">
            <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">21.4</span>
            <span className="font-caption text-caption text-on-surface-variant">days</span>
          </div>
          <div className="flex items-center justify-between mt-space-8 text-on-surface-variant">
            <span className="font-caption text-caption">Target: 25.0 days</span>
            <span className="font-label-xs text-label-xs font-semibold text-tertiary bg-tertiary-fixed px-space-8 py-space-2 rounded">
              -3.6d beat
            </span>
          </div>
        </div>

        {/* Card 4: Partner Submissions */}
        <div className="bg-surface-container-lowest rounded-xl p-space-16 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-label-xs text-label-xs uppercase tracking-wider font-semibold">
              Partner Submissions
            </span>
            <span className="material-symbols-outlined text-primary-container text-[20px]">handshake</span>
          </div>
          <div className="flex items-baseline gap-space-8 mt-space-12">
            <span className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">
              {partners.length ? partners.length * 10 + 4 : 84}
            </span>
            <span className="font-body-sm text-body-sm text-tertiary font-medium">this week</span>
          </div>
          <div className="flex items-center gap-space-4 mt-space-8">
            <span className="material-symbols-outlined text-tertiary text-[16px]">trending_up</span>
            <span className="font-caption text-caption text-on-surface-variant">
              {partners.length || 8} agencies actively delivering
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-surface-container-lowest rounded-xl p-space-16 shadow-sm mb-space-20 flex flex-col gap-space-12">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-space-12">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-space-12 top-2.5 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              className="w-full pl-10 pr-space-12 py-space-8 bg-surface-container-low rounded-lg text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest shadow-sm"
              placeholder="Search job title, req ID, client, or keyword... (⌘K)"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-space-8">
            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-surface-container-low text-on-surface pl-space-12 pr-space-32 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL">Status: All</option>
                <option value="OPEN">OPEN</option>
                <option value="CLOSED">CLOSED</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2 top-2.5 text-on-surface-variant text-[16px]">
                arrow_drop_down
              </span>
            </div>

            {/* Department Dropdown */}
            <div className="relative">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="appearance-none bg-surface-container-low text-on-surface pl-space-12 pr-space-32 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL">Department: All</option>
                <option value="Engineering">Engineering</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Design">Design &amp; UX</option>
                <option value="Core Banking">Core Banking</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2 top-2.5 text-on-surface-variant text-[16px]">
                arrow_drop_down
              </span>
            </div>

            {/* Location Dropdown */}
            <div className="relative">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="appearance-none bg-surface-container-low text-on-surface pl-space-12 pr-space-32 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL">Location: All</option>
                <option value="Noida">Noida</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Remote">Remote</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2 top-2.5 text-on-surface-variant text-[16px]">
                arrow_drop_down
              </span>
            </div>

            {/* Client Dropdown (Populated from Backend) */}
            <div className="relative">
              <select
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="appearance-none bg-surface-container-low text-on-surface pl-space-12 pr-space-32 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL">Client: All Clients</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.company || c.fullName}>
                    {c.company || c.fullName}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2 top-2.5 text-on-surface-variant text-[16px]">
                arrow_drop_down
              </span>
            </div>

            {/* Partner Dropdown (Populated from Backend) */}
            <div className="relative">
              <select
                value={partnerFilter}
                onChange={(e) => setPartnerFilter(e.target.value)}
                className="appearance-none bg-surface-container-low text-on-surface pl-space-12 pr-space-32 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL">Partner: All Partners</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.agencyName || p.fullName}>
                    {p.agencyName || p.fullName}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2 top-2.5 text-on-surface-variant text-[16px]">
                arrow_drop_down
              </span>
            </div>

            <button
              onClick={clearAllFilters}
              className="p-space-8 bg-surface-container-low hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors cursor-pointer"
              title="Clear all filters"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(statusFilter !== "ALL" || deptFilter !== "ALL" || clientFilter !== "ALL" || locationFilter !== "ALL" || partnerFilter !== "ALL") && (
          <div className="flex items-center gap-space-8 pt-space-8 flex-wrap">
            <span className="font-caption text-caption text-on-surface-variant">Active Filters:</span>
            {statusFilter !== "ALL" && (
              <span className="inline-flex items-center gap-space-4 px-space-8 py-space-2 rounded-full bg-primary-fixed text-on-primary-fixed font-body-sm-medium text-body-sm-medium">
                <span>Status: {statusFilter}</span>
                <span
                  onClick={() => setStatusFilter("ALL")}
                  className="material-symbols-outlined text-[14px] cursor-pointer hover:opacity-75"
                >
                  close
                </span>
              </span>
            )}
            {deptFilter !== "ALL" && (
              <span className="inline-flex items-center gap-space-4 px-space-8 py-space-2 rounded-full bg-surface-container-high text-on-surface font-body-sm-medium text-body-sm-medium">
                <span>{deptFilter}</span>
                <span
                  onClick={() => setDeptFilter("ALL")}
                  className="material-symbols-outlined text-[14px] cursor-pointer hover:opacity-75"
                >
                  close
                </span>
              </span>
            )}
            {clientFilter !== "ALL" && (
              <span className="inline-flex items-center gap-space-4 px-space-8 py-space-2 rounded-full bg-surface-container-high text-on-surface font-body-sm-medium text-body-sm-medium">
                <span>Client: {clientFilter}</span>
                <span
                  onClick={() => setClientFilter("ALL")}
                  className="material-symbols-outlined text-[14px] cursor-pointer hover:opacity-75"
                >
                  close
                </span>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-primary font-body-sm-medium text-body-sm-medium hover:underline ml-space-8 cursor-pointer"
              type="button"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Jobs Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden mb-space-24">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant">
                <th className="py-space-12 px-space-16 font-label-xs text-label-xs uppercase tracking-wider font-semibold">
                  Requisition &amp; ID
                </th>
                <th className="py-space-12 px-space-16 font-label-xs text-label-xs uppercase tracking-wider font-semibold">
                  Client
                </th>
                <th className="py-space-12 px-space-16 font-label-xs text-label-xs uppercase tracking-wider font-semibold">
                  Department &amp; Level
                </th>
                <th className="py-space-12 px-space-16 font-label-xs text-label-xs uppercase tracking-wider font-semibold">
                  Target / Openings
                </th>
                <th className="py-space-12 px-space-16 font-label-xs text-label-xs uppercase tracking-wider font-semibold">
                  Pipeline Velocity
                </th>
                <th className="py-space-12 px-space-16 font-label-xs text-label-xs uppercase tracking-wider font-semibold">
                  Assigned Partners
                </th>
                <th className="py-space-12 px-space-16 font-label-xs text-label-xs uppercase tracking-wider font-semibold">
                  Status
                </th>
                <th className="py-space-12 px-space-16 font-label-xs text-label-xs uppercase tracking-wider font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-0">
              {paginatedJobs.map((job) => {
                const isDropdownOpen = openDropdownId === job.id;
                const fillPct = Math.round((job.filled / (job.vacancyCount || 1)) * 100);

                return (
                  <tr
                    key={job.id}
                    className={`transition-colors ${
                      job.id === 4091 ? "bg-primary-fixed/20 hover:bg-primary-fixed/30" : "hover:bg-surface-container-low"
                    }`}
                  >
                    {/* Requisition & ID */}
                    <td className="py-space-16 px-space-16 align-top">
                      <div className="flex flex-col gap-space-4">
                        <div className="flex items-center gap-space-8">
                          <Link
                            to={`/jobs/${job.id}`}
                            className="font-title-md text-title-md text-primary font-semibold hover:underline"
                          >
                            {job.title}
                          </Link>
                          <span className="px-space-8 py-space-2 rounded bg-surface-container-highest font-data-mono text-data-mono font-medium text-on-surface-variant">
                            {job.reqId}
                          </span>
                        </div>
                        <div className="flex items-center gap-space-8 text-on-surface-variant font-caption text-caption">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">schedule</span> {job.jobType}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">location_on</span> {job.location}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Client */}
                    <td className="py-space-16 px-space-16 align-top">
                      <div className="flex items-center gap-space-8">
                        <div className={`w-8 h-8 rounded-lg ${job.iconBg || "bg-surface-container-high text-primary"} flex items-center justify-center flex-shrink-0`}>
                          <span className="material-symbols-outlined text-[18px]">{job.icon || "business"}</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-body-sm-medium text-body-sm-medium text-on-surface font-semibold truncate">
                            {job.clientCompany}
                          </span>
                          <span className="font-caption text-caption text-on-surface-variant truncate">
                            AM: {job.accountManager}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Department & Level */}
                    <td className="py-space-16 px-space-16 align-top">
                      <div className="flex flex-col">
                        <span className="font-body-sm-medium text-body-sm-medium text-on-surface font-medium">
                          {job.department}
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">{job.level}</span>
                      </div>
                    </td>

                    {/* Target / Openings */}
                    <td className="py-space-16 px-space-16 align-top">
                      <div className="flex flex-col gap-space-4 w-36">
                        <div className="flex justify-between font-caption text-caption">
                          <span className="font-semibold text-on-surface">
                            {job.filled} of {job.vacancyCount} Filled
                          </span>
                          <span className={`${fillPct > 0 ? "text-tertiary font-bold" : "text-on-surface-variant font-bold"}`}>
                            {fillPct}%
                          </span>
                        </div>
                        <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`${fillPct > 0 ? "bg-tertiary" : "bg-primary"} h-full rounded-full`}
                            style={{ width: `${fillPct}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Pipeline Velocity */}
                    <td className="py-space-16 px-space-16 align-top">
                      <div className="flex flex-col gap-space-4">
                        <span className="font-body-sm-medium text-body-sm-medium text-on-surface font-semibold">
                          {job.pipelineCount} in Pipeline
                        </span>
                        <div className="flex items-center gap-space-4 font-caption text-caption text-on-surface-variant flex-wrap">
                          {job.pipelineBreakdown?.appl !== undefined && (
                            <>
                              <span className="px-space-4 py-0.5 rounded bg-surface-container">
                                {job.pipelineBreakdown.appl} Appl
                              </span>
                              <span>›</span>
                            </>
                          )}
                          {job.pipelineBreakdown?.short !== undefined && (
                            <>
                              <span className="px-space-4 py-0.5 rounded bg-surface-container">
                                {job.pipelineBreakdown.short} Short
                              </span>
                              <span>›</span>
                            </>
                          )}
                          {job.pipelineBreakdown?.int !== undefined && (
                            <>
                              <span className="px-space-4 py-0.5 rounded bg-surface-container">
                                {job.pipelineBreakdown.int} Int
                              </span>
                              <span>›</span>
                            </>
                          )}
                          {job.pipelineBreakdown?.offer !== undefined && (
                            <span className="px-space-4 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-bold">
                              {job.pipelineBreakdown.offer} Offer
                            </span>
                          )}
                          {job.pipelineBreakdown?.concl !== undefined && (
                            <span className="px-space-4 py-0.5 rounded bg-surface-container">
                              {job.pipelineBreakdown.concl} Concluded
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Assigned Partners */}
                    <td className="py-space-16 px-space-16 align-top">
                      {job.assignedPartners?.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-space-4">
                          {job.assignedPartners.map((partner) => (
                            <span
                              key={partner}
                              className="px-space-8 py-space-2 rounded-full bg-surface-container-low text-on-surface font-label-xs text-label-xs font-medium"
                            >
                              {partner}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="font-caption text-caption text-outline italic">None assigned yet</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-space-16 px-space-16 align-top">
                      {job.status === "OPEN" ? (
                        <span className="inline-flex items-center gap-1.5 px-space-8 py-space-2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-xs text-label-xs font-bold uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                          OPEN
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-space-8 py-space-2 rounded-full bg-surface-container-high text-on-surface-variant font-label-xs text-label-xs font-bold uppercase">
                          CLOSED
                        </span>
                      )}
                    </td>

                    {/* Action Dropdown Menu */}
                    <td className="py-space-16 px-space-16 align-top text-right">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => setOpenDropdownId(isDropdownOpen ? null : job.id)}
                          className="p-space-4 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded transition-colors cursor-pointer"
                          type="button"
                          title="Actions menu"
                        >
                          <span className="material-symbols-outlined text-[20px]">more_vert</span>
                        </button>

                        {isDropdownOpen && (
                          <div className="absolute right-0 mt-space-4 w-44 bg-surface-container-lowest rounded-xl shadow-xl z-30 py-space-4 text-left border border-surface-container">
                            <button
                              onClick={() => {
                                setOpenDropdownId(null);
                                navigate(`/jobs/${job.id}`);
                              }}
                              className="w-full flex items-center gap-space-8 px-space-12 py-space-8 font-body-sm text-body-sm text-on-surface hover:bg-surface-container cursor-pointer"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[16px]">visibility</span>
                              <span>View Details</span>
                            </button>
                            <button
                              onClick={() => {
                                setOpenDropdownId(null);
                                setAssignModalJob(job);
                              }}
                              className="w-full flex items-center gap-space-8 px-space-12 py-space-8 font-body-sm text-body-sm text-on-surface hover:bg-surface-container cursor-pointer"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[16px]">person_add</span>
                              <span>Assign Partner</span>
                            </button>
                            <button
                              onClick={() => {
                                setOpenDropdownId(null);
                                navigate("/pipeline");
                              }}
                              className="w-full flex items-center gap-space-8 px-space-12 py-space-8 font-body-sm text-body-sm text-on-surface hover:bg-surface-container cursor-pointer"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[16px]">view_kanban</span>
                              <span>View Pipeline</span>
                            </button>
                            <button
                              onClick={() => {
                                setOpenDropdownId(null);
                                navigate(`/jobs/edit/${job.id}`);
                              }}
                              className="w-full flex items-center gap-space-8 px-space-12 py-space-8 font-body-sm text-body-sm text-on-surface hover:bg-surface-container cursor-pointer"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                              <span>Edit Requisition</span>
                            </button>
                            <div className="h-px bg-surface-container my-space-4"></div>
                            <button
                              onClick={() => handleCloseJob(job.id)}
                              disabled={job.status === "CLOSED"}
                              className="w-full flex items-center gap-space-8 px-space-12 py-space-8 font-body-sm text-body-sm text-error hover:bg-error-container cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[16px]">cancel</span>
                              <span>Close Req</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="px-space-16 py-space-12 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-12">
          <div className="flex items-center gap-space-8">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Showing{" "}
              <strong className="text-on-surface">
                {filteredJobs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, filteredJobs.length)}
              </strong>{" "}
              of <strong className="text-on-surface">{filteredJobs.length}</strong> Requisitions
            </span>
            <span className="text-outline">|</span>
            <div className="flex items-center gap-space-4">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-surface-container-lowest text-on-surface text-body-sm rounded px-space-8 py-space-2 focus:outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Page Selector */}
          <div className="flex items-center gap-space-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-space-4 rounded text-outline hover:bg-surface-container disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-8 h-8 rounded font-body-sm-medium text-body-sm-medium flex items-center justify-center cursor-pointer ${
                  currentPage === pg
                    ? "bg-primary-container text-on-primary font-bold shadow-xs"
                    : "hover:bg-surface-container text-on-surface"
                }`}
                type="button"
              >
                {pg}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-space-4 rounded text-on-surface-variant hover:bg-surface-container disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Assign Partner Modal */}
      {assignModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-space-24 shadow-2xl flex flex-col gap-space-16 border border-surface-container">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-8">
                <span className="material-symbols-outlined text-primary text-[24px]">handshake</span>
                <h3 className="font-headline-lg text-lg text-on-surface font-bold">Assign Partner Agency</h3>
              </div>
              <button
                onClick={() => setAssignModalJob(null)}
                className="text-on-surface-variant hover:text-on-surface"
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="font-body-sm text-on-surface-variant">
              Allocate <strong>{assignModalJob.title}</strong> to a verified recruitment agency partner from your talent network.
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
                    {p.agencyName || p.fullName} ({p.email || "Verified"})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-space-12 pt-space-12 border-t border-surface-container">
              <button
                onClick={() => setAssignModalJob(null)}
                className="px-space-16 py-space-8 rounded-lg border border-surface-container text-on-surface font-body-sm-medium hover:bg-surface-container transition-colors cursor-pointer"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssign}
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
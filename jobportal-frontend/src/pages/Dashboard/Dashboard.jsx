import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getAllJobs } from "../../services/jobService";
import { getCandidatesPage } from "../../services/candidateService";
import { getAllClients } from "../../services/clientService";
import { getAllPartners } from "../../services/partnerService";

const MOCK_APPLICANTS = [
  {
    id: "cand-1",
    name: "Devendra Kumar",
    email: "d.kumar@engineers.tech",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlxO8Bgtm-fGJwxjfW6s-oKf2eoTi3WDOpCs_tNL8ecaQ_2n8VRLfePk0ONNK5lfZWXNA095-kqltQf721Eghiod88laaROdHzRkhrQ7TwWkZPpsgKFDbbMfX9kbqj6ehEC3SQRKOA8bcZPVY8WsZ6VNlppO_SWRvPg7ix0Pr1P-h_CoEzzo0PlAPO9gSGSTQ0bt2ubpmrm5Fq0IMaD4qDIUJe1c2ehjGZI4upfKp-q5mRAUP31vA31w",
    role: "Sr. Java Architect",
    department: "Core Banking Engine",
    source: "Apex Talent",
    sourceColor: "bg-primary",
    appliedTime: "Today, 08:42",
    stage: "INTERVIEW_L2",
    stageColor: "bg-secondary-fixed text-on-secondary-fixed",
  },
  {
    id: "cand-2",
    name: "Elena Rostova",
    email: "elena.rostova@cloudscale.io",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzVcB-JqBELzAlTr6-saV5K6OcSttiVFYi92RmcGbaGMayfPT4EI6PWph9WfBn4vusPKE99b9sqJyJ9Ywg3YBYQq_83RH7Cca5btpJlx_ozTthO1zFIXky3mDn3gtlTws2Pc-vWBCX6e0A_vBnn_s6qr7Mr7ScPR-QJjAspPvE3UOIygb1wv1i3hRQmIsi_rqIZbka28mXN_K6Cpu0eIOQ79mznEKSmkOsZ1qBG1MviqiMvFT0Hov-jQ",
    role: "Lead DevOps Engineer",
    department: "Infrastructure & SRE",
    source: "Nexus Staffing",
    sourceColor: "bg-secondary",
    appliedTime: "Yesterday",
    stage: "OFFER_PENDING",
    stageColor: "bg-tertiary-fixed text-tertiary",
  },
  {
    id: "cand-3",
    name: "Tariq Mansour",
    email: "tariq.m@matrixlabs.ae",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFwDJQL43U2OJemLQXLwERJ2DE4okbg9tCyqPDLImjqUSMLQM8D7a14OXcD8i5MGM4xmMS0Jz-5yOEsuWA4P-6dNrfChzan1hrYNUvKIxbo477vGOJJXdNOuNwbBI99NFjXpfhGph4fOvFaHl4Y6h3erg6rWWp_p3XYcXYaa7uVABidFNqim0XrVwTaZbyephSqHMIyQbmHuRAfO0B6CD7xFGzb3XGBgNAFUewjK0k7J3PxNlgmrs8kw",
    role: "React Architect",
    department: "Frontend Platform",
    source: "Direct Inbound",
    sourceColor: "bg-primary-container",
    appliedTime: "Aug 18, 2024",
    stage: "SCREENING",
    stageColor: "bg-primary-fixed text-on-primary-fixed",
  },
  {
    id: "cand-4",
    name: "Aisha Moreau",
    email: "aisha.moreau@finnet.fr",
    initials: "AM",
    role: "Product Design Lead",
    department: "Design Systems",
    source: "Global Devs",
    sourceColor: "bg-tertiary",
    appliedTime: "Aug 17, 2024",
    stage: "PARTNER_INT",
    stageColor: "bg-surface-container-high text-on-surface",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeChannel, setActiveChannel] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dbCounts, setDbCounts] = useState({ jobs: 24, candidates: 1428, clients: 14, partners: 8 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [jobs, candidatesPage, clients, partners] = await Promise.allSettled([
          getAllJobs(),
          getCandidatesPage(0, 1),
          getAllClients(),
          getAllPartners(),
        ]);

        setDbCounts((prev) => ({
          jobs: jobs.status === "fulfilled" && Array.isArray(jobs.value) && jobs.value.length > 0 ? jobs.value.length : prev.jobs,
          candidates: candidatesPage.status === "fulfilled" && candidatesPage.value?.totalElements ? candidatesPage.value.totalElements : prev.candidates,
          clients: clients.status === "fulfilled" && Array.isArray(clients.value) && clients.value.length > 0 ? clients.value.length : prev.clients,
          partners: partners.status === "fulfilled" && Array.isArray(partners.value) && partners.value.length > 0 ? partners.value.length : prev.partners,
        }));
      } catch (err) {
        console.warn("Using default metric data:", err);
      }
    }
    fetchStats();
  }, []);

  const filteredApplicants = useMemo(() => {
    if (!searchTerm.trim()) return MOCK_APPLICANTS;
    const term = searchTerm.toLowerCase();
    return MOCK_APPLICANTS.filter(
      (a) =>
        a.name.toLowerCase().includes(term) ||
        a.role.toLowerCase().includes(term) ||
        a.email.toLowerCase().includes(term) ||
        a.source.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const firstName = user?.fullName?.split(" ")[0] || "Marwan";

  return (
    <div className="flex flex-col w-full pb-space-40 gap-space-24">
      {/* Top Welcome & Global Actions Banner */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-16 bg-surface-container-lowest rounded-xl p-space-24 shadow-sm relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary-fixed-dim/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col gap-space-4 z-10">
          <div className="flex items-center gap-space-8">
            <span className="font-headline-xl text-headline-xl text-on-surface">Good morning, {firstName}</span>
            <span className="text-2xl animate-pulse">👋</span>
            <span className="px-space-8 py-space-2 rounded bg-tertiary-fixed text-tertiary font-label-xs text-label-xs font-semibold">
              Q3 LIVE
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Here’s what’s happening with your recruitment pipeline today across{" "}
            <span className="font-body-md-medium text-body-md-medium text-on-surface">
              {dbCounts.clients} active clients
            </span>{" "}
            and{" "}
            <span className="font-body-md-medium text-body-md-medium text-on-surface">
              {dbCounts.partners} partner agencies
            </span>
            .
          </p>
        </div>
        <div className="flex items-center gap-space-12 flex-wrap z-10">
          <div className="inline-flex items-center bg-surface-container-low rounded-lg px-space-12 py-space-8 gap-space-8 text-on-surface cursor-pointer">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">calendar_month</span>
            <span className="font-body-sm-medium text-body-sm-medium">Last 30 days</span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
          </div>
          <button
            onClick={() => navigate("/pipeline")}
            className="inline-flex items-center gap-space-8 bg-surface-container hover:bg-surface-container-high px-space-12 py-space-8 rounded-lg text-on-surface font-body-sm-medium text-body-sm-medium transition-all shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Filter Pipeline</span>
          </button>
          <button
            onClick={() => navigate("/jobs/create")}
            className="inline-flex items-center gap-space-8 bg-primary-container text-on-primary px-space-16 py-space-8 rounded-lg font-body-sm-medium text-body-sm-medium hover:bg-primary transition-all shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Post New Job</span>
          </button>
        </div>
      </section>

      {/* Key Metric KPI Cards (6-column responsive grid) */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-space-16">
        {/* Active Jobs */}
        <div className="bg-surface-container-lowest p-space-16 rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-space-12">
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              Active Jobs
            </span>
            <div className="w-7 h-7 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
              <span className="material-symbols-outlined text-[16px]">work</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display-lg text-display-lg text-on-surface">{dbCounts.jobs}</span>
            <span className="inline-flex items-center gap-space-2 px-space-8 py-space-2 rounded-full bg-primary-fixed text-on-primary-fixed font-label-xs text-label-xs font-semibold">
              <span className="material-symbols-outlined text-[12px]">trending_up</span> +12.5%
            </span>
          </div>
          <span className="font-caption text-caption text-on-surface-variant mt-space-8">vs last month</span>
        </div>

        {/* Total Candidates Pool */}
        <div className="bg-surface-container-lowest p-space-16 rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-space-12">
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              Total Pool
            </span>
            <div className="w-7 h-7 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[16px]">groups</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display-lg text-display-lg text-on-surface">{dbCounts.candidates.toLocaleString()}</span>
            <span className="inline-flex items-center gap-space-2 px-space-8 py-space-2 rounded-full bg-tertiary-fixed text-tertiary font-label-xs text-label-xs font-semibold">
              <span className="material-symbols-outlined text-[12px]">trending_up</span> +8.2%
            </span>
          </div>
          <span className="font-caption text-caption text-on-surface-variant mt-space-8">vs last month</span>
        </div>

        {/* Applications */}
        <div className="bg-surface-container-lowest p-space-16 rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-space-12">
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              Applications
            </span>
            <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[16px]">inbox</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display-lg text-display-lg text-on-surface">386</span>
            <span className="inline-flex items-center gap-space-2 px-space-8 py-space-2 rounded-full bg-tertiary-fixed text-tertiary font-label-xs text-label-xs font-semibold">
              <span className="material-symbols-outlined text-[12px]">trending_up</span> +24%
            </span>
          </div>
          <span className="font-caption text-caption text-on-surface-variant mt-space-8">89 inbound today</span>
        </div>

        {/* Interviews */}
        <div className="bg-surface-container-lowest p-space-16 rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-space-12">
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              Interviews
            </span>
            <div className="w-7 h-7 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[16px]">video_camera_front</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display-lg text-display-lg text-on-surface">41</span>
            <span className="px-space-8 py-space-2 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-xs text-label-xs font-semibold">
              Week 34
            </span>
          </div>
          <span className="font-caption text-caption text-on-surface-variant mt-space-8">Scheduled this week</span>
        </div>

        {/* Offers Extended */}
        <div className="bg-surface-container-lowest p-space-16 rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-space-12">
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              Offers Made
            </span>
            <div className="w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[16px]">mark_email_read</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display-lg text-display-lg text-on-surface">18</span>
            <span className="px-space-8 py-space-2 rounded-full bg-surface-container-high text-on-surface font-label-xs text-label-xs font-semibold">
              4 Pending
            </span>
          </div>
          <span className="font-caption text-caption text-on-surface-variant mt-space-8">Avg $145k Base</span>
        </div>

        {/* Hired This Month */}
        <div className="bg-surface-container-lowest p-space-16 rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-space-12">
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              Hired (MTD)
            </span>
            <div className="w-7 h-7 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[16px]">celebration</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-display-lg text-display-lg text-on-surface">12</span>
            <span className="px-space-8 py-space-2 rounded-full bg-tertiary-fixed text-tertiary font-label-xs text-label-xs font-semibold">
              92% Acc.
            </span>
          </div>
          <span className="font-caption text-caption text-on-surface-variant mt-space-8">Target: 15 hires</span>
        </div>
      </section>

      {/* Urgent Action Items Strip */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-space-16">
        <div className="bg-surface-container-lowest p-space-16 rounded-xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-space-12">
            <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
            </div>
            <div>
              <span className="font-body-md-medium text-body-md-medium text-on-surface block">
                3 candidate offers awaiting client signature
              </span>
              <span className="font-caption text-caption text-on-surface-variant">
                CloudScale &amp; Apex Fintech • Target SLA: 48 hours
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/offers")}
            className="px-space-12 py-space-4 bg-surface-container hover:bg-surface-container-high rounded text-on-surface font-body-sm-medium text-body-sm-medium transition-all cursor-pointer"
            type="button"
          >
            Expedite
          </button>
        </div>

        <div className="bg-surface-container-lowest p-space-16 rounded-xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-space-12">
            <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center text-error flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">rate_review</span>
            </div>
            <div>
              <span className="font-body-md-medium text-body-md-medium text-on-surface block">
                2 interviews require feedback submission
              </span>
              <span className="font-caption text-caption text-on-surface-variant">
                Round 2 Technical: Lead DevOps &amp; React Architect
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/interviews")}
            className="px-space-12 py-space-4 bg-error text-on-error hover:bg-on-error-container rounded font-body-sm-medium text-body-sm-medium transition-all cursor-pointer"
            type="button"
          >
            Submit Now
          </button>
        </div>
      </section>

      {/* Main Split Canvas: Left Core Analytics & Applications vs Right Schedule & Performance */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-24">
        {/* Left Column (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-space-24">
          {/* Recruitment Conversion Funnel & Velocity Widget */}
          <div className="bg-surface-container-lowest p-space-24 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-16 gap-space-8">
              <div>
                <h3 className="font-headline-lg text-headline-lg text-on-surface">Recruitment Pipeline Conversion</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Velocity from initial pipeline entry to final contract signing
                </p>
              </div>
              <div className="flex items-center gap-space-8">
                <span className="font-data-mono text-data-mono bg-surface-container px-space-8 py-space-4 rounded text-on-surface-variant">
                  AVG 21.4 DAYS CYCLE
                </span>
              </div>
            </div>

            {/* Funnel Stages Bar Graphic */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-space-8 py-space-8">
              {/* Stage 1 */}
              <div className="flex flex-col bg-surface-container-low p-space-12 rounded-lg">
                <div className="flex items-center justify-between text-on-surface-variant mb-space-4">
                  <span className="font-label-xs text-label-xs uppercase">Applied</span>
                  <span className="font-data-mono text-data-mono text-primary font-bold">100%</span>
                </div>
                <span className="font-headline-xl text-headline-xl text-on-surface">386</span>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-space-8 overflow-hidden">
                  <div className="bg-primary h-full w-full"></div>
                </div>
                <span className="font-caption text-caption text-on-surface-variant mt-space-4">1.2d avg review</span>
              </div>

              {/* Stage 2 */}
              <div className="flex flex-col bg-surface-container-low p-space-12 rounded-lg">
                <div className="flex items-center justify-between text-on-surface-variant mb-space-4">
                  <span className="font-label-xs text-label-xs uppercase">Shortlisted</span>
                  <span className="font-data-mono text-data-mono text-primary font-bold">49.7%</span>
                </div>
                <span className="font-headline-xl text-headline-xl text-on-surface">192</span>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-space-8 overflow-hidden">
                  <div className="bg-primary h-full w-[49.7%]"></div>
                </div>
                <span className="font-caption text-caption text-on-surface-variant mt-space-4">3.4d to phone</span>
              </div>

              {/* Stage 3 */}
              <div className="flex flex-col bg-surface-container-low p-space-12 rounded-lg">
                <div className="flex items-center justify-between text-on-surface-variant mb-space-4">
                  <span className="font-label-xs text-label-xs uppercase">Tech Screen</span>
                  <span className="font-data-mono text-data-mono text-primary font-bold">21.8%</span>
                </div>
                <span className="font-headline-xl text-headline-xl text-on-surface">84</span>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-space-8 overflow-hidden">
                  <div className="bg-primary h-full w-[21.8%]"></div>
                </div>
                <span className="font-caption text-caption text-on-surface-variant mt-space-4">5.8d test SLA</span>
              </div>

              {/* Stage 4 */}
              <div className="flex flex-col bg-surface-container-low p-space-12 rounded-lg">
                <div className="flex items-center justify-between text-on-surface-variant mb-space-4">
                  <span className="font-label-xs text-label-xs uppercase">Partner Int.</span>
                  <span className="font-data-mono text-data-mono text-primary font-bold">10.6%</span>
                </div>
                <span className="font-headline-xl text-headline-xl text-on-surface">41</span>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-space-8 overflow-hidden">
                  <div className="bg-primary h-full w-[10.6%]"></div>
                </div>
                <span className="font-caption text-caption text-on-surface-variant mt-space-4">4.1d interview</span>
              </div>

              {/* Stage 5 */}
              <div className="flex flex-col bg-surface-container-low p-space-12 rounded-lg">
                <div className="flex items-center justify-between text-on-surface-variant mb-space-4">
                  <span className="font-label-xs text-label-xs uppercase">Offer Sent</span>
                  <span className="font-data-mono text-data-mono text-secondary font-bold">4.7%</span>
                </div>
                <span className="font-headline-xl text-headline-xl text-on-surface">18</span>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-space-8 overflow-hidden">
                  <div className="bg-secondary h-full w-[4.7%]"></div>
                </div>
                <span className="font-caption text-caption text-on-surface-variant mt-space-4">2.2d negotiation</span>
              </div>

              {/* Stage 6 */}
              <div className="flex flex-col bg-surface-container-low p-space-12 rounded-lg">
                <div className="flex items-center justify-between text-on-surface-variant mb-space-4">
                  <span className="font-label-xs text-label-xs uppercase">Signed Hire</span>
                  <span className="font-data-mono text-data-mono text-tertiary font-bold">3.1%</span>
                </div>
                <span className="font-headline-xl text-headline-xl text-tertiary">12</span>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-space-8 overflow-hidden">
                  <div className="bg-tertiary h-full w-[3.1%]"></div>
                </div>
                <span className="font-caption text-caption text-tertiary font-semibold mt-space-4">Target Achieved</span>
              </div>
            </div>
          </div>

          {/* Sourcing Inflow Distribution Visualization */}
          <div className="bg-surface-container-lowest p-space-24 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-16 pb-space-20">
              <div>
                <h3 className="font-headline-lg text-headline-lg text-on-surface">Sourcing Inflow Distribution</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Weekly candidate throughput across distinct acquisition channels
                </p>
              </div>
              <div className="flex items-center gap-space-4 bg-surface-container-low p-space-4 rounded-lg">
                <button
                  onClick={() => setActiveChannel("all")}
                  className={`px-space-8 py-space-4 rounded font-body-sm-medium text-body-sm-medium transition-colors ${
                    activeChannel === "all"
                      ? "bg-surface-container-lowest text-on-surface shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  type="button"
                >
                  All Channels
                </button>
                <button
                  onClick={() => setActiveChannel("partners")}
                  className={`px-space-8 py-space-4 rounded font-body-sm-medium text-body-sm-medium transition-colors ${
                    activeChannel === "partners"
                      ? "bg-surface-container-lowest text-on-surface shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  type="button"
                >
                  Agency Partners
                </button>
                <button
                  onClick={() => setActiveChannel("direct")}
                  className={`px-space-8 py-space-4 rounded font-body-sm-medium text-body-sm-medium transition-colors ${
                    activeChannel === "direct"
                      ? "bg-surface-container-lowest text-on-surface shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  type="button"
                >
                  Direct Inbound
                </button>
                <button
                  onClick={() => setActiveChannel("referrals")}
                  className={`px-space-8 py-space-4 rounded font-body-sm-medium text-body-sm-medium transition-colors ${
                    activeChannel === "referrals"
                      ? "bg-surface-container-lowest text-on-surface shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                  type="button"
                >
                  Referrals
                </button>
              </div>
            </div>

            {/* Rich Inline SVG Vector Chart */}
            <div className="w-full h-56 pt-space-8">
              <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 700 180">
                {/* Grid Guides */}
                <line stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="160" y2="160" />
                <line stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="110" y2="110" />
                <line stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="60" y2="60" />
                <line stroke="#dae2fd" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="10" y2="10" />

                {/* Area Gradients */}
                <defs>
                  <linearGradient id="primaryArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="tertiaryArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#006e4c" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#006e4c" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Agency Track Path */}
                {(activeChannel === "all" || activeChannel === "partners") && (
                  <>
                    <path
                      d="M0,130 C70,110 140,80 210,95 C280,110 350,60 420,45 C490,30 560,70 630,35 L700,20 L700,160 L0,160 Z"
                      fill="url(#primaryArea)"
                    />
                    <path
                      d="M0,130 C70,110 140,80 210,95 C280,110 350,60 420,45 C490,30 560,70 630,35 L700,20"
                      stroke="#3525cd"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                    />
                    <circle cx="210" cy="95" fill="#faf8ff" r="4" stroke="#3525cd" strokeWidth="2" />
                    <circle cx="420" cy="45" fill="#faf8ff" r="5" stroke="#3525cd" strokeWidth="2.5" />
                    <circle cx="630" cy="35" fill="#faf8ff" r="4" stroke="#3525cd" strokeWidth="2" />
                  </>
                )}

                {/* Referral Path */}
                {(activeChannel === "all" || activeChannel === "referrals") && (
                  <>
                    <path
                      d="M0,150 C70,140 140,130 210,120 C280,110 350,115 420,95 C490,75 560,90 630,65 L700,50 L700,160 L0,160 Z"
                      fill="url(#tertiaryArea)"
                    />
                    <path
                      d="M0,150 C70,140 140,130 210,120 C280,110 350,115 420,95 C490,75 560,90 630,65 L700,50"
                      stroke="#005338"
                      strokeDasharray="3 3"
                      strokeWidth="2"
                    />
                    <circle cx="420" cy="95" fill="#faf8ff" r="4" stroke="#005338" strokeWidth="2" />
                  </>
                )}
              </svg>
            </div>

            <div className="flex items-center justify-between text-on-surface-variant font-data-mono text-data-mono pt-space-8">
              <span>Wk 31 (Jul 29)</span>
              <span>Wk 32 (Aug 05)</span>
              <span>Wk 33 (Aug 12)</span>
              <span>Wk 34 (Aug 19)</span>
              <span>Current Week</span>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-space-24 mt-space-16 pt-space-12 border-t-0 flex-wrap">
              <div className="flex items-center gap-space-8">
                <span className="w-3 h-3 rounded bg-primary"></span>
                <span className="font-body-sm text-body-sm text-on-surface">Partner Agencies (218 apps)</span>
              </div>
              <div className="flex items-center gap-space-8">
                <span className="w-3 h-3 rounded bg-tertiary"></span>
                <span className="font-body-sm text-body-sm text-on-surface">Client Referrals (112 apps)</span>
              </div>
              <div className="flex items-center gap-space-8">
                <span className="w-3 h-3 rounded bg-surface-container-highest"></span>
                <span className="font-body-sm text-body-sm text-on-surface">Direct Career Site (56 apps)</span>
              </div>
            </div>
          </div>

          {/* Recent Applications High-Density Table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-space-20 flex flex-col sm:flex-row sm:items-center justify-between gap-space-12">
              <div className="flex items-center gap-space-12">
                <h3 className="font-headline-lg text-headline-lg text-on-surface">Active Pipeline Candidate Feed</h3>
                <span className="px-space-8 py-space-2 rounded-full bg-surface-container-high text-on-surface font-label-xs text-label-xs font-semibold">
                  Live Review
                </span>
              </div>
              <div className="flex items-center gap-space-8">
                <div className="flex items-center bg-surface-container-low px-space-12 py-space-4 rounded-lg gap-space-8">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">search</span>
                  <input
                    className="bg-transparent font-body-sm text-body-sm outline-none text-on-surface placeholder:text-outline w-36 sm:w-44"
                    placeholder="Search applicant..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => navigate("/candidates")}
                  className="p-space-8 hover:bg-surface-container rounded-lg text-on-surface-variant cursor-pointer"
                  type="button"
                  title="View full filters"
                >
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-on-surface">
                <thead className="bg-surface-container-low text-on-surface-variant font-label-xs text-label-xs uppercase tracking-wider">
                  <tr>
                    <th className="py-space-12 px-space-16">Candidate</th>
                    <th className="py-space-12 px-space-16">Target Role</th>
                    <th className="py-space-12 px-space-16">Source / Agency</th>
                    <th className="py-space-12 px-space-16">Applied</th>
                    <th className="py-space-12 px-space-16">Current Stage</th>
                    <th className="py-space-12 px-space-16 text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-0 font-body-sm text-body-sm">
                  {filteredApplicants.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="py-space-12 px-space-16">
                        <div className="flex items-center gap-space-12">
                          {applicant.avatar ? (
                            <img
                              className="w-9 h-9 rounded-full object-cover shadow-sm flex-shrink-0"
                              src={applicant.avatar}
                              alt={applicant.name}
                              onError={(e) => {
                                e.target.style.display = "none";
                                if (e.target.nextSibling) {
                                  e.target.nextSibling.style.display = "flex";
                                }
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-9 h-9 rounded-full bg-secondary-fixed text-secondary font-bold flex items-center justify-center font-label-xs text-label-xs flex-shrink-0 ${
                              applicant.avatar ? "hidden" : "flex"
                            }`}
                          >
                            {applicant.initials || applicant.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-body-sm-medium text-body-sm-medium text-on-surface truncate">
                              {applicant.name}
                            </span>
                            <span className="font-caption text-caption text-on-surface-variant truncate">
                              {applicant.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-space-12 px-space-16">
                        <div className="flex flex-col">
                          <span className="font-body-sm-medium text-body-sm-medium text-on-surface">
                            {applicant.role}
                          </span>
                          <span className="font-caption text-caption text-on-surface-variant">
                            {applicant.department}
                          </span>
                        </div>
                      </td>
                      <td className="py-space-12 px-space-16">
                        <span className="inline-flex items-center gap-space-4 px-space-8 py-space-2 rounded bg-surface-container font-label-xs text-label-xs text-on-surface">
                          <span className={`w-1.5 h-1.5 rounded-full ${applicant.sourceColor}`}></span>
                          {applicant.source}
                        </span>
                      </td>
                      <td className="py-space-12 px-space-16 font-data-mono text-data-mono text-on-surface-variant">
                        {applicant.appliedTime}
                      </td>
                      <td className="py-space-12 px-space-16">
                        <span
                          className={`inline-flex items-center px-space-8 py-space-2 rounded font-label-xs text-label-xs uppercase font-bold ${applicant.stageColor}`}
                        >
                          {applicant.stage}
                        </span>
                      </td>
                      <td className="py-space-12 px-space-16 text-right">
                        <div className="flex items-center justify-end gap-space-4">
                          <button
                            onClick={() => navigate("/interviews")}
                            className="p-space-4 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded transition-colors cursor-pointer"
                            title="Schedule Interview"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
                          </button>
                          <button
                            onClick={() => navigate("/candidates")}
                            className="p-space-4 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded transition-colors cursor-pointer"
                            title="Review CV"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                          <button
                            onClick={() => navigate("/candidates")}
                            className="p-space-4 text-on-surface-variant hover:text-on-surface rounded transition-colors cursor-pointer"
                            title="Action Menu"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">more_vert</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-space-16 bg-surface-container-lowest flex items-center justify-between font-caption text-caption text-on-surface-variant">
              <span>Showing {filteredApplicants.length} of 386 active applicants</span>
              <Link
                to="/candidates"
                className="font-body-sm-medium text-body-sm-medium text-primary hover:underline flex items-center gap-space-4"
              >
                <span>View Full Recruitment Database</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-space-24">
          {/* Today's Interview Schedule Widget */}
          <div className="bg-surface-container-lowest p-space-24 rounded-xl shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-space-16">
              <div className="flex items-center gap-space-8">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-ping"></span>
                <h3 className="font-headline-lg text-headline-lg text-on-surface">Today's Schedule</h3>
              </div>
              <span className="font-label-xs text-label-xs uppercase px-space-8 py-space-2 rounded bg-surface-container text-on-surface font-semibold">
                3 SESSIONS
              </span>
            </div>

            {/* Schedule Timeline Cards */}
            <div className="space-y-space-12">
              {/* Session 1 */}
              <div className="p-space-12 bg-surface-container-low hover:bg-surface-container rounded-lg transition-colors flex flex-col gap-space-8 relative">
                <div className="flex items-center justify-between">
                  <span className="font-data-mono text-data-mono text-primary font-bold bg-primary-fixed px-space-8 py-space-2 rounded">
                    10:30 AM (45m)
                  </span>
                  <span className="font-label-xs text-label-xs uppercase text-tertiary font-semibold flex items-center gap-space-2">
                    <span className="material-symbols-outlined text-[14px]">videocam</span> Google Meet
                  </span>
                </div>
                <div>
                  <span className="font-body-md-medium text-body-md-medium text-on-surface block">
                    Senior Java Developer
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant">
                    Devendra Kumar • with ABC Technologies
                  </span>
                </div>
                <div className="flex items-center justify-between pt-space-4">
                  <div className="flex items-center gap-space-4">
                    <span className="text-on-surface-variant font-caption text-caption">Panel:</span>
                    <span className="font-body-sm-medium text-body-sm-medium text-on-surface">M. Al-Sayed, R. Vance</span>
                  </div>
                  <button
                    onClick={() => window.open("https://meet.google.com", "_blank")}
                    className="px-space-8 py-space-2 bg-primary text-on-primary rounded font-label-xs text-label-xs font-semibold hover:bg-primary-container transition-all cursor-pointer"
                    type="button"
                  >
                    Join Room
                  </button>
                </div>
              </div>

              {/* Session 2 */}
              <div className="p-space-12 bg-surface-container-low hover:bg-surface-container rounded-lg transition-colors flex flex-col gap-space-8 relative">
                <div className="flex items-center justify-between">
                  <span className="font-data-mono text-data-mono text-secondary font-bold bg-secondary-fixed px-space-8 py-space-2 rounded">
                    02:00 PM (60m)
                  </span>
                  <span className="font-label-xs text-label-xs uppercase text-on-surface-variant font-semibold flex items-center gap-space-2">
                    <span className="material-symbols-outlined text-[14px]">call</span> Zoom Tech
                  </span>
                </div>
                <div>
                  <span className="font-body-md-medium text-body-md-medium text-on-surface block">
                    Lead DevOps Engineer
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant">
                    Elena Rostova • with FinTech Corp
                  </span>
                </div>
                <div className="flex items-center justify-between pt-space-4">
                  <div className="flex items-center gap-space-4">
                    <span className="text-on-surface-variant font-caption text-caption">Stage:</span>
                    <span className="font-body-sm-medium text-body-sm-medium text-on-surface">
                      System Architecture Deep-Dive
                    </span>
                  </div>
                  <button
                    onClick={() => navigate("/interviews")}
                    className="px-space-8 py-space-2 bg-surface-container-highest text-primary rounded font-label-xs text-label-xs font-semibold hover:bg-surface-container transition-all cursor-pointer"
                    type="button"
                  >
                    Prepare Notes
                  </button>
                </div>
              </div>

              {/* Session 3 */}
              <div className="p-space-12 bg-surface-container-low hover:bg-surface-container rounded-lg transition-colors flex flex-col gap-space-8 relative">
                <div className="flex items-center justify-between">
                  <span className="font-data-mono text-data-mono text-on-surface font-bold bg-surface-container-high px-space-8 py-space-2 rounded">
                    04:15 PM (30m)
                  </span>
                  <span className="font-label-xs text-label-xs uppercase text-on-surface-variant font-semibold flex items-center gap-space-2">
                    <span className="material-symbols-outlined text-[14px]">groups</span> Onsite HQ
                  </span>
                </div>
                <div>
                  <span className="font-body-md-medium text-body-md-medium text-on-surface block">React Architect</span>
                  <span className="font-caption text-caption text-on-surface-variant">
                    Tariq Mansour • with CloudScale Global
                  </span>
                </div>
                <div className="flex items-center justify-between pt-space-4">
                  <div className="flex items-center gap-space-4">
                    <span className="text-on-surface-variant font-caption text-caption">Host:</span>
                    <span className="font-body-sm-medium text-body-sm-medium text-on-surface">
                      Executive VP Engineering
                    </span>
                  </div>
                  <button
                    onClick={() => navigate("/interviews")}
                    className="px-space-8 py-space-2 bg-surface-container-highest text-on-surface rounded font-label-xs text-label-xs font-semibold hover:bg-surface-container transition-all cursor-pointer"
                    type="button"
                  >
                    Passcard Ready
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/interviews")}
              className="mt-space-16 w-full py-space-8 text-center bg-surface-container-low hover:bg-surface-container rounded-lg font-body-sm-medium text-body-sm-medium text-on-surface transition-colors flex items-center justify-center gap-space-8 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_view_day</span>
              <span>Open Full Calendar Sync</span>
            </button>
          </div>

          {/* Sourcing Partner Performance Leaderboard */}
          <div className="bg-surface-container-lowest p-space-24 rounded-xl shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-space-16">
              <div>
                <h3 className="font-headline-lg text-headline-lg text-on-surface">Agency Leaderboard</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Fulfillment quality &amp; speed ratio</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">leaderboard</span>
            </div>

            {/* Leaderboard List */}
            <div className="space-y-space-16">
              {/* Agency 1 */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-space-12 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-label-xs text-label-xs font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="min-w-0">
                    <span className="font-body-sm-medium text-body-sm-medium text-on-surface truncate block">
                      Apex Talent Partners
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">42 submitted • 9 hires</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-data-mono text-data-mono text-tertiary font-bold">21.4% conv</span>
                  <span className="font-caption text-caption text-on-surface-variant">4.1 days avg SLA</span>
                </div>
              </div>

              {/* Agency 2 */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-space-12 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center font-label-xs text-label-xs font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="min-w-0">
                    <span className="font-body-sm-medium text-body-sm-medium text-on-surface truncate block">
                      Nexus Staffing Group
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">38 submitted • 6 hires</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-data-mono text-data-mono text-primary font-bold">15.7% conv</span>
                  <span className="font-caption text-caption text-on-surface-variant">5.6 days avg SLA</span>
                </div>
              </div>

              {/* Agency 3 */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-space-12 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center font-label-xs text-label-xs font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="min-w-0">
                    <span className="font-body-sm-medium text-body-sm-medium text-on-surface truncate block">
                      Global Devs Network
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">29 submitted • 4 hires</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-data-mono text-data-mono text-on-surface font-bold">13.8% conv</span>
                  <span className="font-caption text-caption text-on-surface-variant">6.2 days avg SLA</span>
                </div>
              </div>

              {/* Agency 4 */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-space-12 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center font-label-xs text-label-xs font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="min-w-0">
                    <span className="font-body-sm-medium text-body-sm-medium text-on-surface truncate block">
                      Hyperion Executive
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">18 submitted • 2 hires</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-data-mono text-data-mono text-on-surface font-bold">11.1% conv</span>
                  <span className="font-caption text-caption text-on-surface-variant">7.8 days avg SLA</span>
                </div>
              </div>
            </div>

            <div className="mt-space-20 p-space-12 bg-surface-container-low rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-space-8">
                <span className="material-symbols-outlined text-[18px] text-tertiary">handshake</span>
                <span className="font-body-sm-medium text-body-sm-medium text-on-surface">Tier 1 Commission Pool</span>
              </div>
              <span className="font-data-mono text-data-mono text-tertiary font-bold">$184,200</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

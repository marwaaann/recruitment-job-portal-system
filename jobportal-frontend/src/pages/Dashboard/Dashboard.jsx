import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Handshake,
  Plus,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getAllJobs } from "../../services/jobService";
import { getCandidatesPage } from "../../services/candidateService";
import { getAllClients } from "../../services/clientService";
import { getAllPartners } from "../../services/partnerService";

const roleLabels = {
  SUPER_ADMIN: "Super admin",
  ADMIN: "Administrator",
  PARTNER: "Recruitment partner",
  CLIENT: "Client workspace",
};

const formatDate = (value) => {
  if (!value) return "Recently added";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently added";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
};

const getJobStatus = (job) => String(job.status || "OPEN").toUpperCase();

function StatCard({ icon: Icon, label, value, detail, tone }) {
  return (
    <div className="dashboard-stat">
      <div className={`dashboard-stat-icon ${tone}`}><Icon size={20} /></div>
      <div className="min-w-0">
        <p className="dashboard-eyebrow">{label}</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{detail}</p>
      </div>
    </div>
  );
}

function EmptyState({ children }) {
  return <div className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">{children}</div>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [workspace, setWorkspace] = useState({ jobs: [], candidates: [], clients: [], partners: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWorkspace = async () => {
    setLoading(true);
    setError("");

    try {
      const [jobs, candidatesPage, clients, partners] = await Promise.all([
        getAllJobs(),
        getCandidatesPage(0, 5, "createdAt", "desc"),
        getAllClients(),
        getAllPartners(),
      ]);

      setWorkspace({
        jobs: Array.isArray(jobs) ? jobs : [],
        candidates: candidatesPage?.content || [],
        clients: Array.isArray(clients) ? clients : [],
        partners: Array.isArray(partners) ? partners : [],
      });
    } catch (loadError) {
      console.error("Failed to load dashboard:", loadError);
      setError(loadError.response?.status === 403
        ? "Your account does not have permission to view one or more workspace metrics."
        : "We could not load the latest workspace data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, []);

  const openJobs = workspace.jobs.filter((job) => !["CLOSED", "CLOSE"].includes(getJobStatus(job))).length;
  const displayName = user?.fullName?.split(" ")[0] || "there";
  const recentJobs = workspace.jobs.slice(0, 5);
  const recentCandidates = workspace.candidates.slice(0, 5);

  return (
    <div className="dashboard-page">
      <section className="dashboard-intro">
        <div>
          <div className="dashboard-kicker"><Sparkles size={14} /> Live operations view</div>
          <h1>Good morning, {displayName}.</h1>
          <p>Keep your hiring desk moving with a clear view of jobs, candidates, and partners.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={loadWorkspace} className="dashboard-quiet-button" disabled={loading} title="Refresh workspace">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link to="/jobs/create" className="dashboard-primary-button"><Plus size={17} /> Create job</Link>
        </div>
      </section>

      <section className="dashboard-hero">
        <div>
          <p className="dashboard-hero-label">{roleLabels[user?.role] || "Recruitment workspace"}</p>
          <h2>Your hiring desk, in one view.</h2>
          <p>Review live records from your backend and jump straight into the next action.</p>
        </div>
        <div className="dashboard-hero-mark"><BriefcaseBusiness size={28} /><span>Workspace<br />overview</span></div>
      </section>

      {error && (
        <div className="dashboard-alert" role="alert"><CircleAlert size={18} /><span>{error}</span><button type="button" onClick={loadWorkspace}>Try again</button></div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BriefcaseBusiness} label="Open jobs" value={loading ? "-" : openJobs} detail={`${workspace.jobs.length} total jobs`} tone="dashboard-stat-blue" />
        <StatCard icon={Users} label="Candidates" value={loading ? "-" : workspace.candidates.length} detail="Latest page loaded" tone="dashboard-stat-coral" />
        <StatCard icon={Building2} label="Clients" value={loading ? "-" : workspace.clients.length} detail="Active accounts in workspace" tone="dashboard-stat-green" />
        <StatCard icon={Handshake} label="Partners" value={loading ? "-" : workspace.partners.length} detail="Recruitment partners" tone="dashboard-stat-amber" />
      </section>

      <section className="dashboard-grid mt-6">
        <div className="dashboard-panel dashboard-panel-wide">
          <div className="dashboard-panel-heading">
            <div><p className="dashboard-eyebrow">Latest records</p><h2>Open positions</h2></div>
            <Link to="/jobs" className="dashboard-link">View all <ArrowRight size={15} /></Link>
          </div>
          {loading ? <div className="dashboard-skeleton-list"><span /><span /><span /></div> : recentJobs.length === 0 ? <EmptyState>No jobs have been created yet.</EmptyState> : (
            <div className="divide-y divide-slate-100">
              {recentJobs.map((job) => (
                <Link to={`/jobs/${job.id}`} key={job.id} className="dashboard-list-row">
                  <div className="dashboard-row-icon"><BriefcaseBusiness size={18} /></div>
                  <div className="min-w-0 flex-1"><p className="truncate font-semibold text-slate-900">{job.title || "Untitled position"}</p><p className="mt-1 text-xs text-slate-500">{job.location || "Location not specified"} <span className="mx-1 text-slate-300">|</span> {formatDate(job.createdAt)}</p></div>
                  <span className={`dashboard-status ${getJobStatus(job) === "CLOSED" ? "dashboard-status-muted" : "dashboard-status-good"}`}>{getJobStatus(job)}</span><ChevronRight size={16} className="text-slate-300" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-panel-heading"><div><p className="dashboard-eyebrow">Candidate desk</p><h2>Recent candidates</h2></div><Link to="/candidates" className="dashboard-icon-link" title="View candidates"><ArrowRight size={17} /></Link></div>
          {loading ? <div className="dashboard-skeleton-list"><span /><span /><span /></div> : recentCandidates.length === 0 ? <EmptyState>No candidates on the latest page.</EmptyState> : (
            <div className="space-y-2">
              {recentCandidates.map((candidate) => <Link to={`/candidates/${candidate.id}`} key={candidate.id} className="dashboard-candidate-row"><span className="dashboard-avatar">{(candidate.fullName || "?").charAt(0).toUpperCase()}</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm text-slate-900">{candidate.fullName || "Unnamed candidate"}</strong><small className="block truncate text-xs text-slate-500">{candidate.email || "No email"}</small></span><ChevronRight size={15} className="text-slate-300" /></Link>)}
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.25fr_.75fr]">
        <div className="dashboard-panel">
          <div className="dashboard-panel-heading"><div><p className="dashboard-eyebrow">Next actions</p><h2>Move the pipeline forward</h2></div><CheckCircle2 className="text-emerald-500" size={20} /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link to="/candidates/create" className="dashboard-action"><span className="dashboard-action-icon dashboard-stat-coral"><Users size={17} /></span><span><strong>Add candidate</strong><small>Register a new profile</small></span><ArrowRight size={16} /></Link>
            <Link to="/clients/create" className="dashboard-action"><span className="dashboard-action-icon dashboard-stat-green"><Building2 size={17} /></span><span><strong>Add client</strong><small>Open a client account</small></span><ArrowRight size={16} /></Link>
            <Link to="/partners/create" className="dashboard-action"><span className="dashboard-action-icon dashboard-stat-amber"><Handshake size={17} /></span><span><strong>Add partner</strong><small>Connect a recruiting team</small></span><ArrowRight size={16} /></Link>
            <Link to="/chat" className="dashboard-action"><span className="dashboard-action-icon dashboard-stat-blue"><Users size={17} /></span><span><strong>Open conversations</strong><small>Coordinate with your team</small></span><ArrowRight size={16} /></Link>
          </div>
        </div>
        <div className="dashboard-panel dashboard-note-panel"><p className="dashboard-eyebrow">Workspace note</p><h2>One source of truth</h2><p>Counts on this screen come from the current backend records, so the next action is always grounded in what is actually saved.</p><Link to="/jobs" className="dashboard-link mt-5">Manage workspace <ArrowRight size={15} /></Link></div>
      </section>
    </div>
  );
}

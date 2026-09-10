import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  Building2,
  Handshake,
  Plus,
  ArrowRight,
  RefreshCw,
  Clock,
  Layers,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { getAllJobs } from "../../services/jobService";
import { getCandidatesPage } from "../../services/candidateService";
import { getAllClients } from "../../services/clientService";
import { getAllPartners } from "../../services/partnerService";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Card, { CardHeader, CardTitle, CardContent } from "../../components/common/Card";
import { StatSkeleton, TableSkeleton } from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";

export default function Dashboard() {
  const { user, isAdmin, isPartner, isClient } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    jobs: [],
    candidates: [],
    totalCandidates: 0,
    clients: [],
    partners: [],
  });

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      // Execute role-aware parallel queries with graceful fallbacks
      const promises = [
        getAllJobs().catch((e) => {
          console.warn("Could not fetch jobs:", e.message);
          return [];
        }),
        getCandidatesPage(0, 5, "createdAt", "desc").catch((e) => {
          console.warn("Could not fetch candidates:", e.message);
          return { content: [], totalElements: 0 };
        }),
      ];

      // Clients and partners list are accessible by SuperAdmin/Admin
      if (isAdmin) {
        promises.push(
          getAllClients().catch(() => []),
          getAllPartners().catch(() => [])
        );
      } else {
        promises.push(Promise.resolve([]), Promise.resolve([]));
      }

      const [jobsRes, candidatesRes, clientsRes, partnersRes] = await Promise.all(promises);

      setData({
        jobs: Array.isArray(jobsRes) ? jobsRes : [],
        candidates: candidatesRes?.content || [],
        totalCandidates: candidatesRes?.totalElements || 0,
        clients: Array.isArray(clientsRes) ? clientsRes : [],
        partners: Array.isArray(partnersRes) ? partnersRes : [],
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Unable to load latest dashboard metrics. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [isAdmin]);

  // Greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const openJobsCount = data.jobs.filter((j) => (j.status || "OPEN").toUpperCase() === "OPEN").length;
  const recentJobs = data.jobs.slice(0, 5);
  const recentCandidates = data.candidates.slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-8 rounded-3xl text-white shadow-xl shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/20">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Live Operations Overview
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {getGreeting()}, {user?.fullName || "Recruiter"} 👋
          </h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Here is your live workspace status. Review active requisitions,
            candidate applications, and coordinate team operations with real-time updates.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            icon={RefreshCw}
            className="!bg-white/10 !text-white !border-white/20 hover:!bg-white/20"
            disabled={loading}
          >
            Refresh
          </Button>

          {(isAdmin || isClient) && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => navigate("/jobs/create")}
            >
              Post Job
            </Button>
          )}

          {isPartner && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => navigate("/candidates/create")}
            >
              Add Candidate
            </Button>
          )}
        </div>
      </div>

      {/* Error alert if any */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadDashboardData}
            className="font-bold underline hover:text-rose-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Real KPI Cards */}
      {loading ? (
        <StatSkeleton count={isAdmin ? 4 : 2} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Jobs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Open Positions
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {openJobsCount}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {data.jobs.length} total requisitions
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Candidates */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Talent Pool
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {data.totalCandidates}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Registered profiles in database
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Clients (Admin only) */}
          {isAdmin && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Client Accounts
                </p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  {data.clients.length}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Active hiring companies
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
            </div>
          )}

          {/* Card 4: Partners (Admin only) */}
          {isAdmin && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Partner Agencies
                </p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  {data.partners.length}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Connected recruiting partners
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Handshake className="w-6 h-6" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Jobs (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Job Requisitions</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest job openings from your database
                </p>
              </div>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                View all jobs
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              {loading ? (
                <div className="p-6">
                  <TableSkeleton rows={4} cols={4} />
                </div>
              ) : recentJobs.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    title="No jobs created yet"
                    description="Get started by creating your first job requisition."
                    actionLabel="Create Job"
                    actionTo="/jobs/create"
                    actionIcon={Plus}
                  />
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="p-5 flex items-center justify-between hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {job.title || "Untitled Position"}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span>
                              {job.vacancyCount || 1} {job.vacancyCount === 1 ? "vacancy" : "vacancies"}
                            </span>
                            {job.createdAt && (
                              <>
                                <span>&bull;</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge status={job.status || "OPEN"}>
                          {job.status || "OPEN"}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Recent Candidates & Next Steps (1 col) */}
        <div className="space-y-6">
          {/* Recent Candidates */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Candidates</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest profiles in talent directory
                </p>
              </div>
              <Link
                to="/candidates"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                View all
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              {loading ? (
                <div className="p-6">
                  <TableSkeleton rows={3} cols={2} />
                </div>
              ) : recentCandidates.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    title="No candidates added"
                    description="Add candidate profiles to start managing pipeline."
                    actionLabel="Add Candidate"
                    actionTo="/candidates/create"
                    actionIcon={Plus}
                  />
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentCandidates.map((c) => {
                    const initials = (c.fullName || "C")
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase();

                    return (
                      <div
                        key={c.id}
                        onClick={() => navigate(`/candidates/${c.id}`)}
                        className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {c.fullName || "Unnamed Candidate"}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {c.email || c.nationality || "No contact info"}
                            </p>
                          </div>
                        </div>

                        <Badge size="sm" status={c.canonicalStatus || "ACTIVE"}>
                          {c.canonicalStatus || "ACTIVE"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Navigation</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Jump directly to essential workspace tools
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                to="/pipeline"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/60 hover:border-indigo-200 transition-all text-xs font-semibold text-slate-800 hover:text-indigo-600"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Recruitment Pipeline</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/messages"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/60 hover:border-indigo-200 transition-all text-xs font-semibold text-slate-800 hover:text-indigo-600"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Team Messages & Chat</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {isAdmin && (
                <Link
                  to="/partners"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/60 hover:border-indigo-200 transition-all text-xs font-semibold text-slate-800 hover:text-indigo-600"
                >
                  <div className="flex items-center gap-2.5">
                    <Handshake className="w-4 h-4 text-amber-600" />
                    <span>Manage Partner Agencies</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

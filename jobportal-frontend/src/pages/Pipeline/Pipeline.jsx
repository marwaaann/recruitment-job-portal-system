import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Layers,
  Briefcase,
  Users,
  Search,
  Filter,
  ArrowRight,
  UserPlus,
  ExternalLink,
  ChevronDown,
  Building2,
  Calendar,
  AlertCircle,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import {
  getAllJobs,
  getJobApplications,
  updateApplicationStatus,
  applyJob,
} from "../../services/jobService";
import { getAllCandidates } from "../../services/candidateService";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Card, { CardHeader, CardTitle, CardContent } from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import Select from "../../components/common/Select";
import { TableSkeleton } from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";
import { useToast } from "../../components/common/Toast";

const PIPELINE_COLUMNS = [
  { key: "APPLIED", label: "Applied", color: "border-blue-500", bg: "bg-blue-50/50" },
  { key: "SHORTLISTED", label: "Shortlisted", color: "border-purple-500", bg: "bg-purple-50/50" },
  { key: "INTERVIEW", label: "Interview", color: "border-indigo-500", bg: "bg-indigo-50/50" },
  { key: "OFFERED", label: "Offered", color: "border-amber-500", bg: "bg-amber-50/50" },
  { key: "HIRED", label: "Hired", color: "border-emerald-500", bg: "bg-emerald-50/50" },
  { key: "REJECTED", label: "Rejected", color: "border-rose-500", bg: "bg-rose-50/50" },
];

export default function Pipeline() {
  const navigate = useNavigate();
  const { user, isAdmin, isClient, isPartner } = useAuth();
  const { success, error: toastError } = useToast();

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [applications, setApplications] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [viewMode, setViewMode] = useState("kanban"); // "kanban" | "list"
  const [search, setSearch] = useState("");

  // Move Stage Modal
  const [moveModalApp, setMoveModalApp] = useState(null);
  const [targetStage, setTargetStage] = useState("");
  const [updatingStage, setUpdatingStage] = useState(false);

  // Submit Candidate Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitCandidateId, setSubmitCandidateId] = useState("");
  const [submittingCandidate, setSubmittingCandidate] = useState(false);

  // 1. Load initial jobs and candidates
  useEffect(() => {
    const init = async () => {
      setLoadingJobs(true);
      try {
        const [jobsData, candsData] = await Promise.all([
          getAllJobs().catch(() => []),
          getAllCandidates().catch(() => []),
        ]);

        const jobList = Array.isArray(jobsData) ? jobsData : [];
        setJobs(jobList);
        setCandidates(Array.isArray(candsData) ? candsData : []);

        if (jobList.length > 0) {
          setSelectedJobId(String(jobList[0].id));
        }
      } catch (err) {
        console.error("Failed to initialize pipeline:", err);
        toastError("Failed to load recruitment pipeline data.");
      } finally {
        setLoadingJobs(false);
      }
    };

    init();
  }, []);

  // 2. Load applications when selectedJobId changes
  useEffect(() => {
    if (!selectedJobId) {
      setApplications([]);
      return;
    }

    const fetchApps = async () => {
      setLoadingApps(true);
      try {
        const apps = await getJobApplications(selectedJobId);
        setApplications(Array.isArray(apps) ? apps : []);
      } catch (err) {
        console.error("Failed to load applications for job:", err);
        setApplications([]);
      } finally {
        setLoadingApps(false);
      }
    };

    fetchApps();
  }, [selectedJobId]);

  // Currently active job object
  const activeJob = useMemo(() => {
    return jobs.find((j) => String(j.id) === String(selectedJobId)) || null;
  }, [jobs, selectedJobId]);

  // Handle Stage Update
  const handleStageChange = async () => {
    if (!moveModalApp || !targetStage) return;
    setUpdatingStage(true);
    try {
      await updateApplicationStatus(moveModalApp.id, targetStage);
      setApplications((prev) =>
        prev.map((a) =>
          a.id === moveModalApp.id ? { ...a, status: targetStage } : a
        )
      );
      success(`Candidate moved to ${targetStage} stage.`);
      setMoveModalApp(null);
    } catch (err) {
      toastError(
        err.response?.data?.message || "Failed to update pipeline stage."
      );
    } finally {
      setUpdatingStage(false);
    }
  };

  // Handle Candidate Submission to Current Job
  const handleSubmitCandidate = async () => {
    if (!submitCandidateId || !selectedJobId) {
      toastError("Please select a candidate to submit.");
      return;
    }
    setSubmittingCandidate(true);
    try {
      const partnerIdParam = isPartner && user?.id ? user.id : null;
      await applyJob(
        Number(selectedJobId),
        Number(submitCandidateId),
        partnerIdParam
      );
      success("Candidate successfully entered into pipeline!");
      setShowSubmitModal(false);
      setSubmitCandidateId("");
      // Refresh applications
      const updated = await getJobApplications(selectedJobId).catch(() => []);
      setApplications(Array.isArray(updated) ? updated : []);
    } catch (err) {
      toastError(
        err.response?.data?.message ||
          "Failed to submit candidate. They may already be in the pipeline."
      );
    } finally {
      setSubmittingCandidate(false);
    }
  };

  // Filtered applications
  const filteredApplications = useMemo(() => {
    if (!search.trim()) return applications;
    const s = search.toLowerCase();
    return applications.filter(
      (a) =>
        (a.candidateName && a.candidateName.toLowerCase().includes(s)) ||
        (a.email && a.email.toLowerCase().includes(s)) ||
        (a.phone && a.phone.includes(s))
    );
  }, [applications, search]);

  if (loadingJobs) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <EmptyState
          icon={Layers}
          title="No Active Job Requisitions"
          description="Create a job requisition first to begin tracking candidate hiring pipelines."
          actionLabel="Create First Job"
          onAction={() => navigate("/jobs/create")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Recruitment Pipeline
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time candidate progression through verified interview and hiring stages.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
                viewMode === "kanban"
                  ? "bg-white text-slate-900 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
                viewMode === "list"
                  ? "bg-white text-slate-900 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              Table
            </button>
          </div>

          {activeJob && activeJob.status !== "CLOSED" && (
            <Button
              variant="primary"
              icon={UserPlus}
              onClick={() => setShowSubmitModal(true)}
            >
              Submit Candidate
            </Button>
          )}
        </div>
      </div>

      {/* Requisition Selector Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 max-w-md">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Active Requisition
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 truncate"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} (REQ-#{j.id}) &bull; {j.status || "OPEN"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Stats on Selected Requisition */}
          {activeJob && (
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-500" />
                <span>
                  Vacancies: <strong>{activeJob.vacancyCount || 1}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-slate-400" />
                <span>
                  Pipeline: <strong>{applications.length} Candidates</strong>
                </span>
              </div>
              <Badge status={activeJob.status || "OPEN"} />
            </div>
          )}
        </div>
      </div>

      {/* Filter / Search Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate in pipeline..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Pipeline View: Kanban Mode */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
          {PIPELINE_COLUMNS.map((col) => {
            const colApps = filteredApplications.filter(
              (a) => String(a.status).toUpperCase() === col.key
            );

            return (
              <div
                key={col.key}
                className="bg-slate-50/70 border border-slate-200 rounded-xl overflow-hidden flex flex-col min-h-[450px]"
              >
                {/* Column Header */}
                <div
                  className={`p-3 border-t-4 ${col.color} bg-white border-b border-slate-200 flex items-center justify-between`}
                >
                  <span className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
                    {col.label}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                    {colApps.length}
                  </span>
                </div>

                {/* Candidate Cards Container */}
                <div className="p-2.5 space-y-2.5 flex-1 overflow-y-auto">
                  {loadingApps ? (
                    <div className="space-y-2 py-2">
                      <div className="h-20 bg-white rounded-lg animate-pulse border border-slate-100" />
                      <div className="h-20 bg-white rounded-lg animate-pulse border border-slate-100" />
                    </div>
                  ) : colApps.length === 0 ? (
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-xs font-medium">
                      No candidates
                    </div>
                  ) : (
                    colApps.map((app) => (
                      <div
                        key={app.id}
                        className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow-md transition-shadow group relative"
                      >
                        {/* Candidate Name & Link */}
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <Link
                            to={
                              app.candidateId
                                ? `/candidates/${app.candidateId}`
                                : "#"
                            }
                            className="font-semibold text-xs text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                          >
                            {app.candidateName || `Candidate #${app.candidateId}`}
                          </Link>
                          {app.candidateId && (
                            <Link
                              to={`/candidates/${app.candidateId}`}
                              className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="View Profile"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>

                        {/* Experience / Contacts */}
                        <div className="text-[11px] text-slate-500 space-y-0.5">
                          {app.experience && (
                            <p className="font-medium text-slate-700">
                              {app.experience} Yrs Experience
                            </p>
                          )}
                          <p className="truncate text-slate-400">
                            {app.email || app.phone || "No contact info"}
                          </p>
                        </div>

                        {/* Action Toolbar */}
                        {(isAdmin || isClient) && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            <button
                              type="button"
                              onClick={() => {
                                setMoveModalApp(app);
                                setTargetStage(app.status || "APPLIED");
                              }}
                              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded transition"
                            >
                              Move Stage
                              <ChevronDown className="w-3 h-3" />
                            </button>
                            <span className="text-slate-400 text-[10px]">
                              {app.createdAt
                                ? new Date(app.createdAt).toLocaleDateString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                  })
                                : ""}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Pipeline View: Table Mode */
        <Card>
          <CardContent className="p-0">
            {loadingApps ? (
              <div className="p-6">
                <TableSkeleton rows={5} cols={5} />
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-10">
                <EmptyState
                  icon={Users}
                  title="No Candidates in Pipeline"
                  description="No candidate applications match this requisition or search."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Experience</th>
                      <th className="py-3 px-4">Current Stage</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4">
                          <Link
                            to={
                              app.candidateId
                                ? `/candidates/${app.candidateId}`
                                : "#"
                            }
                            className="font-semibold text-slate-900 hover:text-indigo-600 transition"
                          >
                            {app.candidateName || `Candidate #${app.candidateId}`}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-500">
                          {app.email || app.phone || "-"}
                        </td>
                        <td className="py-3 px-4 text-xs font-medium text-slate-700">
                          {app.experience ? `${app.experience} Yrs` : "Entry Level"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge status={app.status || "APPLIED"} />
                        </td>
                        <td className="py-3 px-4 text-right">
                          {(isAdmin || isClient) && (
                            <button
                              type="button"
                              onClick={() => {
                                setMoveModalApp(app);
                                setTargetStage(app.status || "APPLIED");
                              }}
                              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded transition"
                            >
                              Change Stage
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Move Stage Modal */}
      <Modal
        isOpen={!!moveModalApp}
        onClose={() => setMoveModalApp(null)}
        title="Update Candidate Pipeline Stage"
        description={`Update recruitment stage for ${moveModalApp?.candidateName || "candidate"}.`}
      >
        <div className="space-y-4">
          <Select
            label="Target Stage *"
            value={targetStage}
            onChange={(e) => setTargetStage(e.target.value)}
            disabled={updatingStage}
          >
            {PIPELINE_COLUMNS.map((col) => (
              <option key={col.key} value={col.key}>
                {col.label} ({col.key})
              </option>
            ))}
          </Select>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setMoveModalApp(null)}
              disabled={updatingStage}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleStageChange}
              loading={updatingStage}
            >
              Update Stage
            </Button>
          </div>
        </div>
      </Modal>

      {/* Submit Candidate to Current Job Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Candidate to Pipeline"
        description={`Add a candidate from your talent pool into the pipeline for ${activeJob?.title || "this position"}.`}
      >
        <div className="space-y-4">
          <Select
            label="Candidate *"
            value={submitCandidateId}
            onChange={(e) => setSubmitCandidateId(e.target.value)}
            disabled={submittingCandidate}
          >
            <option value="">-- Choose Candidate --</option>
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName} ({c.email || c.phoneNormalized || `ID #${c.id}`})
              </option>
            ))}
          </Select>

          {candidates.length === 0 && (
            <p className="text-xs text-amber-600">
              No candidates in your talent pool. Please create a candidate first.
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setShowSubmitModal(false)}
              disabled={submittingCandidate}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmitCandidate}
              loading={submittingCandidate}
              icon={UserPlus}
            >
              Add to Pipeline
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

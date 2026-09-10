import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Briefcase,
  ArrowLeft,
  Building2,
  Users,
  Calendar,
  Clock,
  Pencil,
  XCircle,
  UserPlus,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import {
  getJobById,
  closeJob,
  assignPartner,
  getJobApplications,
  applyJob,
  updateApplicationStatus,
} from "../../services/jobService";
import { getClientById } from "../../services/clientService";
import { getAllPartners } from "../../services/partnerService";
import { getAllCandidates } from "../../services/candidateService";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Select from "../../components/common/Select";
import { TableSkeleton, CardSkeleton } from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";
import { useToast } from "../../components/common/Toast";

const PIPELINE_STATUSES = [
  "APPLIED",
  "SHORTLISTED",
  "INTERVIEW",
  "OFFERED",
  "HIRED",
  "REJECTED",
];

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isPartner, isClient } = useAuth();
  const { success, error: toastError } = useToast();

  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [client, setClient] = useState(null);
  const [applications, setApplications] = useState([]);
  const [partners, setPartners] = useState([]);
  const [candidates, setCandidates] = useState([]);

  // Modals & Action States
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [closing, setClosing] = useState(false);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState("");
  const [assigning, setAssigning] = useState(false);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [submittingCandidate, setSubmittingCandidate] = useState(false);

  const [statusModalApp, setStatusModalApp] = useState(null);
  const [targetStatus, setTargetStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Application table filter
  const [appStatusFilter, setAppStatusFilter] = useState("ALL");

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobData, appsData, partnersData, candidatesData] = await Promise.all([
        getJobById(id),
        getJobApplications(id).catch(() => []),
        getAllPartners().catch(() => []),
        getAllCandidates().catch(() => []),
      ]);

      setJob(jobData);
      setApplications(Array.isArray(appsData) ? appsData : []);
      setPartners(Array.isArray(partnersData) ? partnersData : []);
      setCandidates(Array.isArray(candidatesData) ? candidatesData : []);

      if (jobData?.clientId) {
        try {
          const clientData = await getClientById(jobData.clientId);
          setClient(clientData);
        } catch (cErr) {
          console.warn("Client data could not be fetched", cErr);
        }
      }
    } catch (err) {
      console.error("Failed to load requisition:", err);
      toastError("Unable to load job requisition details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Handle Close Requisition
  const handleCloseJob = async () => {
    setClosing(true);
    try {
      await closeJob(id);
      setJob((prev) => ({ ...prev, status: "CLOSED" }));
      success("Job requisition closed.");
      setShowCloseDialog(false);
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to close requisition.");
    } finally {
      setClosing(false);
    }
  };

  // Handle Assign Partner
  const handleAssignPartner = async () => {
    if (!selectedPartnerId) {
      toastError("Please select a partner agency.");
      return;
    }
    setAssigning(true);
    try {
      await assignPartner(id, Number(selectedPartnerId));
      success("Partner assigned to this requisition successfully.");
      setShowAssignModal(false);
      setSelectedPartnerId("");
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to assign partner.");
    } finally {
      setAssigning(false);
    }
  };

  // Handle Submit Candidate Application
  const handleApplyCandidate = async () => {
    if (!selectedCandidateId) {
      toastError("Please select a candidate to submit.");
      return;
    }
    setSubmittingCandidate(true);
    try {
      const partnerIdParam = isPartner && user?.id ? user.id : null;
      await applyJob(id, Number(selectedCandidateId), partnerIdParam);
      success("Candidate submitted to requisition pipeline!");
      setShowApplyModal(false);
      setSelectedCandidateId("");
      // Refresh applications
      const apps = await getJobApplications(id).catch(() => []);
      setApplications(Array.isArray(apps) ? apps : []);
    } catch (err) {
      toastError(
        err.response?.data?.message ||
          "Failed to submit candidate. They may already be applied."
      );
    } finally {
      setSubmittingCandidate(false);
    }
  };

  // Handle Status Update
  const handleUpdateStatus = async () => {
    if (!statusModalApp || !targetStatus) return;
    setUpdatingStatus(true);
    try {
      await updateApplicationStatus(statusModalApp.id, targetStatus);
      setApplications((prev) =>
        prev.map((a) =>
          a.id === statusModalApp.id ? { ...a, status: targetStatus } : a
        )
      );
      success(`Candidate status updated to ${targetStatus}`);
      setStatusModalApp(null);
    } catch (err) {
      toastError(
        err.response?.data?.message || "Failed to update application status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Filtered applications
  const filteredApplications = useMemo(() => {
    if (appStatusFilter === "ALL") return applications;
    return applications.filter(
      (a) => String(a.status).toUpperCase() === appStatusFilter
    );
  }, [applications, appStatusFilter]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-36 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CardSkeleton rows={4} />
            <TableSkeleton rows={4} cols={4} />
          </div>
          <div>
            <CardSkeleton rows={5} />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Requisition Not Found
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          The requested position does not exist or has been removed.
        </p>
        <Button variant="primary" onClick={() => navigate("/jobs")}>
          Return to Requisitions
        </Button>
      </div>
    );
  }

  const isClosed = job.status === "CLOSED";

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar / Breadcrumb */}
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Requisitions
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {job.title || "Untitled Position"}
                </h1>
                <Badge status={job.status || "OPEN"} />
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm text-slate-500">
                <span className="font-mono">REQ-#{job.id}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "Recently"}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  {job.vacancyCount || 1} Open{" "}
                  {job.vacancyCount === 1 ? "Vacancy" : "Vacancies"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {!isClosed && (
              <Button
                variant="primary"
                icon={UserPlus}
                onClick={() => setShowApplyModal(true)}
              >
                Submit Candidate
              </Button>
            )}

            {isAdmin && !isClosed && (
              <Button
                variant="outline"
                icon={Users}
                onClick={() => setShowAssignModal(true)}
              >
                Assign Partner
              </Button>
            )}

            {(isAdmin || isClient) && (
              <Button
                variant="outline"
                icon={Pencil}
                onClick={() => navigate(`/jobs/edit/${job.id}`)}
              >
                Edit
              </Button>
            )}

            {isAdmin && !isClosed && (
              <Button
                variant="danger"
                icon={XCircle}
                onClick={() => setShowCloseDialog(true)}
              >
                Close Job
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Description & Applications Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <Card>
            <CardHeader>
              <CardTitle>Role Description & Scope</CardTitle>
              <CardDescription>
                Detailed requirements and expectations published for this opening.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-100">
                <p className="text-sm sm:text-base text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {job.description || "No description provided for this job position."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Applications Pipeline Card */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span>Candidate Pipeline</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {applications.length}
                  </span>
                </CardTitle>
                <CardDescription>
                  Candidates submitted to this requisition.
                </CardDescription>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
                <button
                  onClick={() => setAppStatusFilter("ALL")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    appStatusFilter === "ALL"
                      ? "bg-white text-slate-900 shadow-sm font-semibold"
                      : "hover:text-slate-900"
                  }`}
                >
                  All ({applications.length})
                </button>
                {PIPELINE_STATUSES.map((st) => {
                  const count = applications.filter(
                    (a) => String(a.status).toUpperCase() === st
                  ).length;
                  return (
                    <button
                      key={st}
                      onClick={() => setAppStatusFilter(st)}
                      className={`px-2 py-1 rounded-md transition-all ${
                        appStatusFilter === st
                          ? "bg-white text-slate-900 shadow-sm font-semibold"
                          : "hover:text-slate-900"
                      }`}
                    >
                      {st} ({count})
                    </button>
                  );
                })}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {filteredApplications.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    icon={Users}
                    title="No candidates in this stage"
                    description={
                      applications.length === 0
                        ? "No candidates have been submitted for this position yet."
                        : "No candidate matches the selected stage filter."
                    }
                    actionLabel={
                      !isClosed && applications.length === 0
                        ? "Submit First Candidate"
                        : undefined
                    }
                    onAction={() => setShowApplyModal(true)}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 border-y border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Candidate</th>
                        <th className="py-3 px-4">Experience</th>
                        <th className="py-3 px-4">Submitted</th>
                        <th className="py-3 px-4">Stage</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredApplications.map((app) => (
                        <tr
                          key={app.id}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-semibold flex items-center justify-center text-xs shrink-0">
                                {app.candidateName
                                  ? app.candidateName.charAt(0).toUpperCase()
                                  : "C"}
                              </div>
                              <div className="min-w-0">
                                <Link
                                  to={
                                    app.candidateId
                                      ? `/candidates/${app.candidateId}`
                                      : "#"
                                  }
                                  className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors truncate block"
                                >
                                  {app.candidateName || `Candidate #${app.candidateId}`}
                                </Link>
                                <p className="text-xs text-slate-400 truncate">
                                  {app.email || app.phone || "No contact"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-medium text-slate-700 text-xs">
                            {app.experience
                              ? `${app.experience} yrs`
                              : "Not specified"}
                          </td>

                          <td className="py-3 px-4 text-xs text-slate-500">
                            {app.createdAt
                              ? new Date(app.createdAt).toLocaleDateString()
                              : "-"}
                          </td>

                          <td className="py-3 px-4">
                            <Badge status={app.status || "APPLIED"} />
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {(isAdmin || isClient) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setStatusModalApp(app);
                                    setTargetStatus(app.status || "APPLIED");
                                  }}
                                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded transition"
                                >
                                  Change Stage
                                </button>
                              )}
                              {app.candidateId && (
                                <Link
                                  to={`/candidates/${app.candidateId}`}
                                  className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                                  title="View Candidate Profile"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Client & Requisition Info */}
        <div className="space-y-6">
          {/* Client Organization Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                Client Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {client ? (
                <>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base">
                      {client.company || client.companyName || client.fullName}
                    </h3>
                    {client.industry && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {client.industry}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    {client.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/clients/${client.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      View Client Profile
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-xs text-slate-500 py-2">
                  <p>Client ID: #{job.clientId}</p>
                  <p className="mt-1">Full profile unavailable.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Requisition Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Requisition Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Requisition ID</span>
                <span className="font-mono font-semibold text-slate-800">
                  #{job.id}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Requisition Status</span>
                <Badge status={job.status || "OPEN"} />
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Open Vacancies</span>
                <span className="font-semibold text-slate-800">
                  {job.vacancyCount || 1}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Total Applicants</span>
                <span className="font-semibold text-slate-800">
                  {applications.length}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Posted On</span>
                <span className="font-medium text-slate-800">
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "Recently"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Close Requisition Dialog */}
      <ConfirmDialog
        isOpen={showCloseDialog}
        onClose={() => setShowCloseDialog(false)}
        onConfirm={handleCloseJob}
        title="Close Job Requisition"
        message="Are you sure you want to close this job position? No further candidates can be submitted once closed."
        confirmLabel="Close Position"
        variant="danger"
        loading={closing}
      />

      {/* Assign Partner Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Partner Agency"
        description="Select a partner recruiting agency to assign to this open position."
      >
        <div className="space-y-4">
          <Select
            label="Partner Agency *"
            value={selectedPartnerId}
            onChange={(e) => setSelectedPartnerId(e.target.value)}
            disabled={assigning}
          >
            <option value="">-- Choose a partner agency --</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.agencyName || p.fullName} (ID: #{p.id})
              </option>
            ))}
          </Select>

          {partners.length === 0 && (
            <p className="text-xs text-amber-600">
              No registered partners available.
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setShowAssignModal(false)}
              disabled={assigning}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAssignPartner}
              loading={assigning}
            >
              Assign Partner
            </Button>
          </div>
        </div>
      </Modal>

      {/* Submit Candidate Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Submit Candidate to Position"
        description="Select a candidate from your talent pool to submit for this requisition."
      >
        <div className="space-y-4">
          <Select
            label="Select Candidate *"
            value={selectedCandidateId}
            onChange={(e) => setSelectedCandidateId(e.target.value)}
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
              No candidates in your talent pool. Please create a candidate profile
              first.
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setShowApplyModal(false)}
              disabled={submittingCandidate}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleApplyCandidate}
              loading={submittingCandidate}
              icon={UserPlus}
            >
              Submit Application
            </Button>
          </div>
        </div>
      </Modal>

      {/* Change Application Stage Modal */}
      <Modal
        isOpen={!!statusModalApp}
        onClose={() => setStatusModalApp(null)}
        title="Update Candidate Pipeline Stage"
        description={`Update hiring stage for ${statusModalApp?.candidateName || "this candidate"}.`}
      >
        <div className="space-y-4">
          <Select
            label="Pipeline Stage *"
            value={targetStatus}
            onChange={(e) => setTargetStatus(e.target.value)}
            disabled={updatingStatus}
          >
            {PIPELINE_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </Select>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setStatusModalApp(null)}
              disabled={updatingStatus}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateStatus}
              loading={updatingStatus}
            >
              Update Stage
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

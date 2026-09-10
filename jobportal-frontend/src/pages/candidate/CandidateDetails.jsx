import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Users,
  ArrowLeft,
  Mail,
  Phone,
  CreditCard,
  Globe,
  Calendar,
  Briefcase,
  GraduationCap,
  Clock,
  FileText,
  Download,
  Trash2,
  RotateCcw,
  Pencil,
  Send,
  AlertCircle,
  ExternalLink,
  Building2,
  CheckCircle2,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import {
  getCandidateById,
  getCandidateDocuments,
  deleteCandidate,
  restoreCandidate,
} from "../../services/candidateService";
import {
  getApplicationsByCandidate,
  getAllJobs,
  applyJob,
} from "../../services/jobService";
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
import { CardSkeleton, TableSkeleton } from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";
import { useToast } from "../../components/common/Toast";

export default function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isPartner } = useAuth();
  const { success, error: toastError } = useToast();

  const [candidate, setCandidate] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Submit to Job Requisition Modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [submittingToJob, setSubmittingToJob] = useState(false);

  // Archive / Restore Confirmations
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [candData, docsData, appsData, jobsData] = await Promise.all([
        getCandidateById(id),
        getCandidateDocuments(id).catch(() => []),
        getApplicationsByCandidate(id).catch(() => []),
        getAllJobs().catch(() => []),
      ]);

      setCandidate(candData);
      setDocuments(Array.isArray(docsData) ? docsData : []);
      setApplications(Array.isArray(appsData) ? appsData : []);
      setJobs(Array.isArray(jobsData) ? jobsData : []);
    } catch (err) {
      console.error("Failed to load candidate details:", err);
      toastError("Unable to retrieve candidate details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Handle Submit Candidate to Job
  const handleApplyToJob = async () => {
    if (!selectedJobId) {
      toastError("Please choose an open job requisition.");
      return;
    }
    setSubmittingToJob(true);
    try {
      const partnerIdParam = isPartner && user?.id ? user.id : null;
      await applyJob(Number(selectedJobId), Number(id), partnerIdParam);
      success("Candidate submitted to job requisition pipeline!");
      setShowApplyModal(false);
      setSelectedJobId("");
      // Refresh applications
      const updatedApps = await getApplicationsByCandidate(id).catch(() => []);
      setApplications(Array.isArray(updatedApps) ? updatedApps : []);
    } catch (err) {
      console.error("Apply to job error:", err);
      toastError(
        err.response?.data?.message ||
          "Failed to submit candidate. They may already be applied to this job."
      );
    } finally {
      setSubmittingToJob(false);
    }
  };

  // Handle Archive Candidate
  const handleDeleteCandidate = async () => {
    setDeleting(true);
    try {
      await deleteCandidate(id);
      success("Candidate moved to archived list.");
      setShowDeleteConfirm(false);
      loadData();
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to archive candidate.");
    } finally {
      setDeleting(false);
    }
  };

  // Handle Restore Candidate
  const handleRestoreCandidate = async () => {
    setRestoring(true);
    try {
      await restoreCandidate(id);
      success("Candidate successfully restored to active talent pool.");
      setShowRestoreConfirm(false);
      loadData();
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to restore candidate.");
    } finally {
      setRestoring(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-36 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CardSkeleton rows={5} />
            <TableSkeleton rows={3} cols={4} />
          </div>
          <CardSkeleton rows={4} />
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Candidate Not Found
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Candidate record #{id} does not exist or has been removed.
        </p>
        <Button variant="primary" onClick={() => navigate("/candidates")}>
          Return to Candidates
        </Button>
      </div>
    );
  }

  // Parse notice period if JSON
  let noticePeriod = "30 Days";
  if (candidate.customFields) {
    try {
      const parsed = JSON.parse(candidate.customFields);
      if (parsed?.noticePeriod) noticePeriod = parsed.noticePeriod;
    } catch {
      noticePeriod = candidate.customFields;
    }
  }

  const isArchived = candidate.canonicalStatus === "DELETED";

  // Job ID to Title Lookup
  const jobMap = {};
  jobs.forEach((j) => {
    jobMap[j.id] = j.title;
  });

  // Filter open jobs for application modal
  const openJobs = jobs.filter((j) => j.status !== "CLOSED");

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar / Back Link */}
      <div>
        <Link
          to="/candidates"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Candidates
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-2xl shadow-md shrink-0">
              {candidate.fullName ? candidate.fullName.charAt(0).toUpperCase() : "C"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {candidate.fullName}
                </h1>
                <Badge status={candidate.canonicalStatus || "ACTIVE"} />
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm text-slate-500">
                <span className="font-mono">ID: #{candidate.id}</span>
                <span>&bull;</span>
                <span>
                  Passport: <strong>{candidate.passportNumber || "Not recorded"}</strong>
                </span>
                <span>&bull;</span>
                <span>
                  Registered:{" "}
                  {candidate.createdAt
                    ? new Date(candidate.createdAt).toLocaleDateString()
                    : "Recently"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {!isArchived && (
              <Button
                variant="primary"
                icon={Send}
                onClick={() => setShowApplyModal(true)}
              >
                Submit to Requisition
              </Button>
            )}

            {!isArchived && (isAdmin || isPartner) && (
              <Button
                variant="outline"
                icon={Pencil}
                onClick={() => navigate(`/candidates/edit/${candidate.id}`)}
              >
                Edit
              </Button>
            )}

            {isArchived && isAdmin ? (
              <Button
                variant="outline"
                icon={RotateCcw}
                onClick={() => setShowRestoreConfirm(true)}
              >
                Restore Candidate
              </Button>
            ) : (
              isAdmin && (
                <Button
                  variant="danger"
                  icon={Trash2}
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Archive
                </Button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Details & Application History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal & Professional Profile Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>
                Verified contact channels and credential records.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Contact Channels
                  </h4>
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{candidate.email || "No email"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{candidate.phoneNormalized || "No phone"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Passport: {candidate.passportNumber || "-"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Demographics & Qualifications
                  </h4>
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Nationality: {candidate.nationality || "Unspecified"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        DOB:{" "}
                        {candidate.dob
                          ? new Date(candidate.dob).toLocaleDateString()
                          : "Unspecified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        Experience:{" "}
                        <strong>
                          {candidate.experience
                            ? `${candidate.experience} Years`
                            : "Entry Level"}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Notice Period: {noticePeriod}</span>
                    </div>
                  </div>
                </div>

                {candidate.education && (
                  <div className="sm:col-span-2 pt-4 border-t border-slate-100">
                    <div className="flex items-start gap-2.5">
                      <GraduationCap className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Education & Credentials
                        </p>
                        <p className="text-sm font-medium text-slate-800 mt-0.5">
                          {candidate.education}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Requisition Application History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Application History</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {applications.length}
                </span>
              </CardTitle>
              <CardDescription>
                Requisitions this candidate has been submitted to.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {applications.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    icon={Briefcase}
                    title="No Applications Recorded"
                    description="This candidate has not yet been submitted to any job requisition pipeline."
                    actionLabel={!isArchived ? "Submit to Requisition" : undefined}
                    onAction={() => setShowApplyModal(true)}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 border-y border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Job Requisition</th>
                        <th className="py-3 px-4">Submitted Date</th>
                        <th className="py-3 px-4">Stage Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {applications.map((app) => (
                        <tr
                          key={app.id}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div>
                              <Link
                                to={`/jobs/${app.jobId}`}
                                className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                              >
                                {jobMap[app.jobId] || `Requisition #${app.jobId}`}
                              </Link>
                              <p className="text-xs text-slate-400 font-mono">
                                REQ-#{app.jobId}
                              </p>
                            </div>
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
                            <Link
                              to={`/jobs/${app.jobId}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                              View Requisition
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
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

        {/* Right Column (1 Col): Documents & Metadata */}
        <div className="space-y-6">
          {/* Documents Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                Attached Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">
                  No documents or resumes attached to this profile.
                </p>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate">
                            {doc.fileName || `Document #${doc.id}`}
                          </p>
                          <p className="text-slate-400 capitalize">
                            {doc.documentType || "Attachment"}
                          </p>
                        </div>
                      </div>

                      {doc.fileUrl && (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition"
                          title="Download Document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Candidate Meta Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Record Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Record ID</span>
                <span className="font-mono font-semibold text-slate-800">
                  #{candidate.id}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Status</span>
                <Badge status={candidate.canonicalStatus || "ACTIVE"} />
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Active Applications</span>
                <span className="font-semibold text-slate-800">
                  {applications.length}
                </span>
              </div>
              {candidate.createdByPartnerId && (
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Sponsoring Partner</span>
                  <span className="font-medium text-slate-800">
                    Partner #{candidate.createdByPartnerId}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Last Modified</span>
                <span className="font-medium text-slate-800">
                  {candidate.updatedAt
                    ? new Date(candidate.updatedAt).toLocaleDateString()
                    : candidate.createdAt
                    ? new Date(candidate.createdAt).toLocaleDateString()
                    : "Recently"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit to Requisition Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Submit Candidate to Requisition"
        description={`Submit ${candidate.fullName} to an open requisition pipeline.`}
      >
        <div className="space-y-4">
          <Select
            label="Job Requisition *"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            disabled={submittingToJob}
          >
            <option value="">-- Choose Open Job Requisition --</option>
            {openJobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} (ID #{j.id}) &bull; {j.vacancyCount || 1} Vacancies
              </option>
            ))}
          </Select>

          {openJobs.length === 0 && (
            <p className="text-xs text-amber-600">
              No open job requisitions currently available.
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setShowApplyModal(false)}
              disabled={submittingToJob}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleApplyToJob}
              loading={submittingToJob}
              icon={Send}
            >
              Submit Application
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteCandidate}
        title="Archive Candidate"
        message="Are you sure you want to archive this candidate? They will be removed from active talent searches but can be restored at any time."
        confirmLabel="Archive Candidate"
        variant="danger"
        loading={deleting}
      />

      {/* Restore Confirmation */}
      <ConfirmDialog
        isOpen={showRestoreConfirm}
        onClose={() => setShowRestoreConfirm(false)}
        onConfirm={handleRestoreCandidate}
        title="Restore Candidate"
        message="Restore this candidate profile back into active circulation?"
        confirmLabel="Restore Candidate"
        variant="primary"
        loading={restoring}
      />
    </div>
  );
}
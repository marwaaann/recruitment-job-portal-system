import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Handshake,
  ArrowLeft,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Users,
  ShieldAlert,
  Trash2,
  Pencil,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import {
  getPartnerById,
  deletePartner,
  blockPartner,
} from "../../services/partnerService";
import {
  getJobsForPartner,
  getApplicationsByPartner,
} from "../../services/jobService";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/common/Card";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { CardSkeleton, TableSkeleton } from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";
import { useToast } from "../../components/common/Toast";

export default function PartnerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [partner, setPartner] = useState(null);
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Confirmations
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [blocking, setBlocking] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [partnerData, jobsData, appsData] = await Promise.all([
        getPartnerById(id),
        getJobsForPartner(id).catch(() => []),
        getApplicationsByPartner(id).catch(() => []),
      ]);

      setPartner(partnerData);
      setAssignedJobs(Array.isArray(jobsData) ? jobsData : []);
      setApplications(Array.isArray(appsData) ? appsData : []);
    } catch (err) {
      console.error("Failed to load partner details:", err);
      toastError("Unable to retrieve partner profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleDeletePartner = async () => {
    setDeleting(true);
    try {
      await deletePartner(id);
      success("Partner agency deleted successfully.");
      navigate("/partners");
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to delete partner.");
    } finally {
      setDeleting(false);
    }
  };

  const handleBlockPartner = async () => {
    setBlocking(true);
    try {
      await blockPartner(id);
      success("Partner status updated.");
      setShowBlockConfirm(false);
      loadData();
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to toggle partner status.");
    } finally {
      setBlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-36 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CardSkeleton rows={4} />
            <TableSkeleton rows={3} cols={4} />
          </div>
          <CardSkeleton rows={4} />
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Partner Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          Partner record #{id} does not exist or has been removed.
        </p>
        <Button variant="primary" onClick={() => navigate("/partners")}>
          Return to Partners
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <Link
          to="/partners"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Partners
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-2xl shadow-sm shrink-0">
              {partner.companyName ? partner.companyName.charAt(0).toUpperCase() : "P"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {partner.companyName || "Unnamed Agency"}
                </h1>
                <Badge status={partner.active ? "ACTIVE" : "BLOCKED"} />
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm text-slate-500">
                <span className="font-mono">PARTNER-#{partner.id}</span>
                <span>&bull;</span>
                <span>Contact: <strong>{partner.contactPerson || "-"}</strong></span>
                <span>&bull;</span>
                <span>{assignedJobs.length} Assigned Requisitions</span>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                icon={Pencil}
                onClick={() => navigate(`/partners/edit/${partner.id}`)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                icon={ShieldAlert}
                onClick={() => setShowBlockConfirm(true)}
              >
                {partner.active ? "Block Agency" : "Activate Agency"}
              </Button>
              <Button
                variant="danger"
                icon={Trash2}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Partner Details & Coordinates</CardTitle>
              <CardDescription>Official contacts and registered operational info.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <Mail className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 font-semibold uppercase">Email Address</p>
                    <p className="font-medium text-slate-800 truncate">{partner.email || "-"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <Phone className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Phone Number</p>
                    <p className="font-medium text-slate-800">{partner.phone || "Unspecified"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <Globe className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 font-semibold uppercase">Website</p>
                    {partner.website ? (
                      <a
                        href={partner.website.startsWith("http") ? partner.website : `https://${partner.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-indigo-600 hover:underline truncate block"
                      >
                        {partner.website}
                      </a>
                    ) : (
                      <p className="font-medium text-slate-800">Unspecified</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 font-semibold uppercase">Headquarters</p>
                    <p className="font-medium text-slate-800 truncate">{partner.address || "Unspecified"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Jobs Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Assigned Requisitions</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {assignedJobs.length}
                </span>
              </CardTitle>
              <CardDescription>
                Job requisitions this partner is authorized to source candidates for.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {assignedJobs.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    icon={Briefcase}
                    title="No Assigned Requisitions"
                    description="This partner is not currently assigned to any open job positions."
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-y border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Position</th>
                        <th className="py-3 px-4">Vacancies</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {assignedJobs.map((j) => (
                        <tr key={j.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3 px-4">
                            <Link
                              to={`/jobs/${j.id}`}
                              className="font-semibold text-slate-900 hover:text-indigo-600 transition"
                            >
                              {j.title}
                            </Link>
                          </td>
                          <td className="py-3 px-4 text-xs font-medium text-slate-700">
                            {j.vacancyCount || 1}
                          </td>
                          <td className="py-3 px-4">
                            <Badge status={j.status || "OPEN"} />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link
                              to={`/jobs/${j.id}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                              View
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

        {/* Right Column: Performance Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Agency Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Partner ID</span>
                <span className="font-mono font-semibold text-slate-800">#{partner.id}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Account Status</span>
                <Badge status={partner.active ? "ACTIVE" : "BLOCKED"} />
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Assigned Positions</span>
                <span className="font-semibold text-slate-800">{assignedJobs.length}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Total Submissions</span>
                <span className="font-semibold text-slate-800">{applications.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeletePartner}
        title="Delete Partner Agency"
        message="Are you sure you want to delete this agency? All user logins linked to this partner will be deactivated."
        confirmLabel="Delete Partner"
        variant="danger"
        loading={deleting}
      />

      {/* Block Confirmation */}
      <ConfirmDialog
        isOpen={showBlockConfirm}
        onClose={() => setShowBlockConfirm(false)}
        onConfirm={handleBlockPartner}
        title="Toggle Partner Status"
        message={`Are you sure you want to ${partner.active ? "block" : "unblock"} this partner agency?`}
        confirmLabel="Confirm"
        variant="warning"
        loading={blocking}
      />
    </div>
  );
}
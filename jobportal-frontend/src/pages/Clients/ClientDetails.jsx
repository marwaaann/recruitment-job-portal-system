import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Building2,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ShieldAlert,
  Trash2,
  Pencil,
  Plus,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import {
  getClientById,
  deleteClient,
  blockClient,
} from "../../services/clientService";
import { getAllJobs } from "../../services/jobService";
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

export default function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [client, setClient] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Confirmations
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [blocking, setBlocking] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [clientData, allJobs] = await Promise.all([
        getClientById(id),
        getAllJobs().catch(() => []),
      ]);

      setClient(clientData);
      const clientJobs = Array.isArray(allJobs)
        ? allJobs.filter((j) => String(j.clientId) === String(id))
        : [];
      setJobs(clientJobs);
    } catch (err) {
      console.error("Failed to load client profile:", err);
      toastError("Unable to retrieve client organization details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleDeleteClient = async () => {
    setDeleting(true);
    try {
      await deleteClient(id);
      success("Client organization removed.");
      navigate("/clients");
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to delete client.");
    } finally {
      setDeleting(false);
    }
  };

  const handleBlockClient = async () => {
    setBlocking(true);
    try {
      await blockClient(id);
      success("Client account status updated.");
      setShowBlockConfirm(false);
      loadData();
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to update client status.");
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

  if (!client) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Client Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          Client record #{id} does not exist or has been removed.
        </p>
        <Button variant="primary" onClick={() => navigate("/clients")}>
          Return to Clients
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <Link
          to="/clients"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Clients
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 font-bold flex items-center justify-center text-2xl shadow-sm shrink-0">
              {client.company ? client.company.charAt(0).toUpperCase() : "C"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {client.company || client.fullName || "Unnamed Organization"}
                </h1>
                <Badge status={client.active ? "ACTIVE" : "BLOCKED"} />
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm text-slate-500">
                <span className="font-mono">CLIENT-#{client.id}</span>
                <span>&bull;</span>
                <span>Contact: <strong>{client.fullName || "-"}</strong></span>
                <span>&bull;</span>
                <span>{jobs.length} Open Requisitions</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => navigate("/jobs/create")}
            >
              Post Job
            </Button>
            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  icon={Pencil}
                  onClick={() => navigate(`/clients/edit/${client.id}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  icon={ShieldAlert}
                  onClick={() => setShowBlockConfirm(true)}
                >
                  {client.active ? "Block Client" : "Activate Client"}
                </Button>
                <Button
                  variant="danger"
                  icon={Trash2}
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Contacts</CardTitle>
              <CardDescription>Primary corporate representative & communications.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <User className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Authorized Representative</p>
                    <p className="font-medium text-slate-800">{client.fullName || "-"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <Mail className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 font-semibold uppercase">Email Address</p>
                    <p className="font-medium text-slate-800 truncate">{client.email || "-"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <Phone className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Contact Phone</p>
                    <p className="font-medium text-slate-800">{client.phone || "Unspecified"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 font-semibold uppercase">Headquarters</p>
                    <p className="font-medium text-slate-800 truncate">{client.address || "Unspecified"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Openings for this Client */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span>Active Requisitions</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {jobs.length}
                  </span>
                </CardTitle>
                <CardDescription>
                  Job positions published under this client account.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={() => navigate("/jobs/create")}
              >
                Create Job
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {jobs.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    icon={Briefcase}
                    title="No Job Openings"
                    description="No positions have been posted for this client yet."
                    actionLabel="Publish First Job"
                    onAction={() => navigate("/jobs/create")}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-y border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Position Title</th>
                        <th className="py-3 px-4">Vacancies</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {jobs.map((j) => (
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

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organization Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Account ID</span>
                <span className="font-mono font-semibold text-slate-800">#{client.id}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Account Status</span>
                <Badge status={client.active ? "ACTIVE" : "BLOCKED"} />
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Total Positions</span>
                <span className="font-semibold text-slate-800">{jobs.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteClient}
        title="Delete Client Organization"
        message="Are you sure you want to delete this client? All client user accounts and associations will be revoked."
        confirmLabel="Delete Client"
        variant="danger"
        loading={deleting}
      />

      {/* Block Confirmation */}
      <ConfirmDialog
        isOpen={showBlockConfirm}
        onClose={() => setShowBlockConfirm(false)}
        onConfirm={handleBlockClient}
        title="Toggle Client Status"
        message={`Are you sure you want to ${client.active ? "block" : "activate"} this client account?`}
        confirmLabel="Confirm"
        variant="warning"
        loading={blocking}
      />
    </div>
  );
}
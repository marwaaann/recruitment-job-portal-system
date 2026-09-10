import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Shield,
  ArrowLeft,
  Mail,
  Trash2,
  Pencil,
  AlertCircle,
  User,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { getAdminById, deleteAdmin } from "../../services/adminService";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/common/Card";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { CardSkeleton } from "../../components/common/SkeletonLoader";
import { useToast } from "../../components/common/Toast";

export default function AdminDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadAdmin = async () => {
    setLoading(true);
    try {
      const data = await getAdminById(id);
      setAdmin(data);
    } catch (err) {
      console.error("Failed to load admin:", err);
      toastError("Unable to retrieve administrator profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmin();
  }, [id]);

  const handleDeleteAdmin = async () => {
    setDeleting(true);
    try {
      await deleteAdmin(id);
      success("Administrator account removed.");
      navigate("/admins");
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to delete administrator.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-6 w-36 bg-slate-200 rounded animate-pulse" />
        <CardSkeleton rows={4} />
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Admin Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          Administrator record #{id} does not exist or has been removed.
        </p>
        <Button variant="primary" onClick={() => navigate("/admins")}>
          Return to Administrators
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <Link
          to="/admins"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Administrators
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 font-bold flex items-center justify-center text-2xl shadow-sm shrink-0">
              {admin.fullName ? admin.fullName.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {admin.fullName || "Administrator"}
                </h1>
                <Badge role={admin.role || "ADMIN"} />
                <Badge status={admin.active ? "ACTIVE" : "INACTIVE"} />
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm text-slate-500">
                <span className="font-mono">ADMIN-#{admin.id}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {admin.email}
                </span>
              </div>
            </div>
          </div>

          {isSuperAdmin && (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                icon={Pencil}
                onClick={() => navigate(`/admins/edit/${admin.id}`)}
              >
                Edit
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

      {/* Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Administrative Credentials</CardTitle>
          <CardDescription>Account permissions and parameters.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-semibold uppercase block text-xs">Full Name</span>
              <span className="font-medium text-slate-900 mt-1 block">{admin.fullName || "-"}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-semibold uppercase block text-xs">Email Address</span>
              <span className="font-medium text-slate-900 mt-1 block">{admin.email || "-"}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-semibold uppercase block text-xs">System Role</span>
              <div className="mt-1">
                <Badge role={admin.role || "ADMIN"} />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-semibold uppercase block text-xs">Account Status</span>
              <div className="mt-1">
                <Badge status={admin.active ? "ACTIVE" : "INACTIVE"} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAdmin}
        title="Delete Administrator"
        message="Are you sure you want to delete this administrator account? All administrative privileges will be revoked immediately."
        confirmLabel="Delete Admin"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
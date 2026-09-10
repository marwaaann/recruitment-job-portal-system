import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  UserCircle,
  ArrowLeft,
  Mail,
  Shield,
  Clock,
  ShieldAlert,
  Trash2,
  Pencil,
  AlertCircle,
  Calendar,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import {
  getUserById,
  deleteUser,
  activateUser,
} from "../../services/userService";
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

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSuperAdmin, isAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);
  const [toggling, setToggling] = useState(false);

  const loadUser = async () => {
    setLoading(true);
    try {
      const data = await getUserById(id);
      setUser(data);
    } catch (err) {
      console.error("Failed to load user:", err);
      toastError("Unable to retrieve user account profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  const handleDeleteUser = async () => {
    setDeleting(true);
    try {
      await deleteUser(id);
      success("User account deleted.");
      navigate("/users");
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to delete user account.");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleUser = async () => {
    setToggling(true);
    try {
      await activateUser(id);
      success("User activation status updated.");
      setShowToggleConfirm(false);
      loadUser();
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to update user status.");
    } finally {
      setToggling(false);
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

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">User Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          User record #{id} does not exist or has been removed.
        </p>
        <Button variant="primary" onClick={() => navigate("/users")}>
          Return to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <Link
          to="/users"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </Link>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-2xl shadow-sm border border-indigo-100 shrink-0">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {user.fullName || "System User"}
                </h1>
                <Badge role={user.role} />
                <Badge status={user.active ? "ACTIVE" : "INACTIVE"} />
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm text-slate-500">
                <span className="font-mono">USER-#{user.id}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user.email}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {(isSuperAdmin || isAdmin) && (
              <>
                <Button
                  variant="outline"
                  icon={Pencil}
                  onClick={() => navigate(`/users/edit/${user.id}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  icon={ShieldAlert}
                  onClick={() => setShowToggleConfirm(true)}
                >
                  {user.active ? "Deactivate" : "Activate"}
                </Button>
              </>
            )}
            {isSuperAdmin && (
              <Button
                variant="danger"
                icon={Trash2}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>System access permissions and account parameters.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-semibold uppercase block text-xs">Full Name</span>
              <span className="font-medium text-slate-900 mt-1 block">{user.fullName || "-"}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-semibold uppercase block text-xs">Email Address</span>
              <span className="font-medium text-slate-900 mt-1 block">{user.email || "-"}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-semibold uppercase block text-xs">Authorization Role</span>
              <div className="mt-1">
                <Badge role={user.role} />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 font-semibold uppercase block text-xs">Account Status</span>
              <div className="mt-1">
                <Badge status={user.active ? "ACTIVE" : "INACTIVE"} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteUser}
        title="Delete User Account"
        message="Are you sure you want to permanently delete this user? Their login access will be immediately terminated."
        confirmLabel="Delete User"
        variant="danger"
        loading={deleting}
      />

      {/* Toggle Active Confirmation */}
      <ConfirmDialog
        isOpen={showToggleConfirm}
        onClose={() => setShowToggleConfirm(false)}
        onConfirm={handleToggleUser}
        title="Toggle Account Status"
        message={`Are you sure you want to ${user.active ? "deactivate" : "activate"} this user account?`}
        confirmLabel="Confirm"
        variant="warning"
        loading={toggling}
      />
    </div>
  );
}
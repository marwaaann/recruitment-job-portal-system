import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserCircle,
  Plus,
  Search,
  Mail,
  Shield,
  Eye,
  Edit2,
  Trash2,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import {
  getAllUsers,
  deleteUser,
  activateUser,
} from "../../services/userService";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Card, { CardContent } from "../../components/common/Card";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { TableSkeleton } from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";
import { useToast } from "../../components/common/Toast";

const ROLES = ["ALL", "SUPER_ADMIN", "ADMIN", "PARTNER", "CLIENT", "CANDIDATE"];

export default function Users() {
  const navigate = useNavigate();
  const { isSuperAdmin, isAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Actions
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toggleId, setToggleId] = useState(null);
  const [toggling, setToggling] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load users:", err);
      toastError("Failed to retrieve user accounts directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteUser(deleteId);
      success("User account deleted successfully.");
      setDeleteId(null);
      fetchUsers();
    } catch (err) {
      console.error("Delete user error:", err);
      toastError(err.response?.data?.message || "Failed to delete user account.");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActiveConfirm = async () => {
    if (!toggleId) return;
    setToggling(true);
    try {
      await activateUser(toggleId);
      success("User activation status updated.");
      setToggleId(null);
      fetchUsers();
    } catch (err) {
      console.error("Toggle user error:", err);
      toastError(err.response?.data?.message || "Failed to update user status.");
    } finally {
      setToggling(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        `${u.fullName || ""} ${u.email || ""} ${u.role || ""}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            User Accounts
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            System identity management and authorization role assignments.
          </p>
        </div>

        {(isSuperAdmin || isAdmin) && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate("/users/create")}
          >
            Create User
          </Button>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Role Filters */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                roleFilter === r
                  ? "bg-white text-slate-900 shadow-sm font-semibold"
                  : "hover:text-slate-900"
              }`}
            >
              {r.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Users Table Card */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={5} cols={5} />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12">
              <EmptyState
                icon={UserCircle}
                title="No Users Found"
                description={
                  search || roleFilter !== "ALL"
                    ? "No user accounts matched the applied filters."
                    : "No system users registered."
                }
                actionLabel={isAdmin ? "Create First User" : undefined}
                onAction={() => navigate("/users/create")}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">User</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">System Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right sm:pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-sm shrink-0 border border-slate-200">
                            {u.fullName ? u.fullName.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div className="min-w-0">
                            <Link
                              to={`/users/${u.id}`}
                              className="font-semibold text-slate-900 hover:text-indigo-600 transition truncate block"
                            >
                              {u.fullName || "Unnamed User"}
                            </Link>
                            <span className="text-xs text-slate-400 font-mono">
                              USER-#{u.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{u.email}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge role={u.role} />
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge status={u.active ? "ACTIVE" : "INACTIVE"} />
                      </td>

                      <td className="py-3.5 px-4 text-right sm:pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Eye}
                            onClick={() => navigate(`/users/${u.id}`)}
                            title="View User"
                          />
                          {(isSuperAdmin || isAdmin) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Edit2}
                              onClick={() => navigate(`/users/edit/${u.id}`)}
                              title="Edit User"
                            />
                          )}
                          {(isSuperAdmin || isAdmin) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={ShieldAlert}
                              onClick={() => setToggleId(u.id)}
                              title={u.active ? "Deactivate User" : "Activate User"}
                              className={
                                u.active
                                  ? "text-amber-600 hover:text-amber-800"
                                  : "text-emerald-600 hover:text-emerald-800"
                              }
                            />
                          )}
                          {isSuperAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Trash2}
                              onClick={() => setDeleteId(u.id)}
                              title="Delete User"
                              className="text-rose-500 hover:text-rose-700"
                            />
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

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete User Account"
        message="Are you sure you want to permanently delete this user account? All access tokens and history will be cleared."
        confirmLabel="Delete User"
        variant="danger"
        loading={deleting}
      />

      {/* Toggle Status Dialog */}
      <ConfirmDialog
        isOpen={!!toggleId}
        onClose={() => setToggleId(null)}
        onConfirm={handleToggleActiveConfirm}
        title="Toggle Account Activation"
        message="Are you sure you want to toggle this user's active status?"
        confirmLabel="Confirm"
        variant="warning"
        loading={toggling}
      />
    </div>
  );
}
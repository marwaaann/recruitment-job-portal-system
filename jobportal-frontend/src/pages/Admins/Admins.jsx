import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield,
  Plus,
  Search,
  Mail,
  User,
  Eye,
  Edit2,
  Trash2,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { getAllAdmins, deleteAdmin } from "../../services/adminService";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Card, { CardContent } from "../../components/common/Card";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { TableSkeleton } from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";
import { useToast } from "../../components/common/Toast";

export default function Admins() {
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await getAllAdmins();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load admins:", err);
      toastError("Failed to retrieve administrators directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteAdmin(deleteId);
      success("Administrator account deleted successfully.");
      setDeleteId(null);
      fetchAdmins();
    } catch (err) {
      console.error("Delete admin error:", err);
      toastError(err.response?.data?.message || "Failed to delete administrator.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredAdmins = useMemo(() => {
    if (!search.trim()) return admins;
    const s = search.toLowerCase();
    return admins.filter(
      (a) =>
        (a.fullName && a.fullName.toLowerCase().includes(s)) ||
        (a.email && a.email.toLowerCase().includes(s))
    );
  }, [admins, search]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Administrator Accounts
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Super administrative access controls and governance operators.
          </p>
        </div>

        {isSuperAdmin && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate("/admins/create")}
          >
            Create Administrator
          </Button>
        )}
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search administrator name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Total Administrators: {admins.length}
        </div>
      </div>

      {/* Table Card */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={4} cols={4} />
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="p-12">
              <EmptyState
                icon={Shield}
                title="No Administrators Found"
                description={
                  search
                    ? `No administrator matching "${search}".`
                    : "No administrator records registered."
                }
                actionLabel={isSuperAdmin ? "Create Administrator" : undefined}
                onAction={() => navigate("/admins/create")}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Administrator</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right sm:pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAdmins.map((a) => (
                    <tr
                      key={a.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold text-sm shrink-0">
                            {a.fullName ? a.fullName.charAt(0).toUpperCase() : "A"}
                          </div>
                          <div className="min-w-0">
                            <Link
                              to={`/admins/${a.id}`}
                              className="font-semibold text-slate-900 hover:text-indigo-600 transition truncate block"
                            >
                              {a.fullName || "Administrator"}
                            </Link>
                            <span className="text-xs text-slate-400 font-mono">
                              ADMIN-#{a.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{a.email}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge role={a.role || "ADMIN"} />
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge status={a.active ? "ACTIVE" : "INACTIVE"} />
                      </td>

                      <td className="py-3.5 px-4 text-right sm:pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Eye}
                            onClick={() => navigate(`/admins/${a.id}`)}
                            title="View Administrator"
                          />
                          {isSuperAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Edit2}
                              onClick={() => navigate(`/admins/edit/${a.id}`)}
                              title="Edit Administrator"
                            />
                          )}
                          {isSuperAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Trash2}
                              onClick={() => setDeleteId(a.id)}
                              title="Delete Administrator"
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
        title="Delete Administrator Account"
        message="Are you sure you want to permanently delete this administrator? All administrative permissions will be revoked."
        confirmLabel="Delete Admin"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
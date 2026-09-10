import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Building2,
  Plus,
  Search,
  Mail,
  Phone,
  User,
  Eye,
  Edit2,
  Trash2,
  ShieldAlert,
  MapPin,
  Briefcase,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import {
  getAllClients,
  deleteClient,
  blockClient,
} from "../../services/clientService";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Card, { CardContent } from "../../components/common/Card";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { TableSkeleton } from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";
import { useToast } from "../../components/common/Toast";

export default function Clients() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Actions state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [blockId, setBlockId] = useState(null);
  const [blocking, setBlocking] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await getAllClients();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load clients:", err);
      toastError("Failed to retrieve client organization directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteClient(deleteId);
      success("Client organization removed successfully.");
      setDeleteId(null);
      fetchClients();
    } catch (err) {
      console.error("Delete client error:", err);
      toastError(err.response?.data?.message || "Failed to delete client.");
    } finally {
      setDeleting(false);
    }
  };

  const handleBlockConfirm = async () => {
    if (!blockId) return;
    setBlocking(true);
    try {
      await blockClient(blockId);
      success("Client account status updated.");
      setBlockId(null);
      fetchClients();
    } catch (err) {
      console.error("Block client error:", err);
      toastError(err.response?.data?.message || "Failed to update client status.");
    } finally {
      setBlocking(false);
    }
  };

  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients;
    const s = search.toLowerCase();
    return clients.filter(
      (c) =>
        (c.company && c.company.toLowerCase().includes(s)) ||
        (c.fullName && c.fullName.toLowerCase().includes(s)) ||
        (c.email && c.email.toLowerCase().includes(s)) ||
        (c.phone && c.phone.includes(s))
    );
  }, [clients, search]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Client Accounts
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Employer organizations authorized to publish requisitions and review candidate pools.
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate("/clients/create")}
          >
            Create Client
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company, contact name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Total Clients: {clients.length}
        </div>
      </div>

      {/* Table Card */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={5} cols={5} />
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="p-12">
              <EmptyState
                icon={Building2}
                title="No Clients Found"
                description={
                  search
                    ? `No clients matching "${search}".`
                    : "No client organizations have been added yet."
                }
                actionLabel={isAdmin ? "Create First Client" : undefined}
                onAction={() => navigate("/clients/create")}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Company / Organization</th>
                    <th className="py-3.5 px-4">Contact Person</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4">Address</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right sm:pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClients.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-sm shrink-0">
                            {c.company ? c.company.charAt(0).toUpperCase() : "C"}
                          </div>
                          <div className="min-w-0">
                            <Link
                              to={`/clients/${c.id}`}
                              className="font-semibold text-slate-900 hover:text-indigo-600 transition truncate block"
                            >
                              {c.company || c.fullName || "Unnamed Client"}
                            </Link>
                            <span className="text-xs text-slate-400 font-mono">
                              CLIENT-#{c.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-800 font-medium">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{c.fullName || "-"}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-xs">
                          {c.email && (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[170px]">{c.email}</span>
                            </div>
                          )}
                          {c.phone && (
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{c.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {c.address ? (
                          <span className="truncate max-w-[160px] block">
                            {c.address}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge status={c.active ? "ACTIVE" : "BLOCKED"} />
                      </td>

                      <td className="py-3.5 px-4 text-right sm:pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Eye}
                            onClick={() => navigate(`/clients/${c.id}`)}
                            title="View Client Details"
                          />
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Edit2}
                              onClick={() => navigate(`/clients/edit/${c.id}`)}
                              title="Edit Client"
                            />
                          )}
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={ShieldAlert}
                              onClick={() => setBlockId(c.id)}
                              title={c.active ? "Block Client" : "Activate Client"}
                              className={
                                c.active
                                  ? "text-amber-600 hover:text-amber-800"
                                  : "text-emerald-600 hover:text-emerald-800"
                              }
                            />
                          )}
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Trash2}
                              onClick={() => setDeleteId(c.id)}
                              title="Delete Client"
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

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Client Organization"
        message="Are you sure you want to delete this client account? All linked access credentials will be revoked."
        confirmLabel="Delete Client"
        variant="danger"
        loading={deleting}
      />

      {/* Confirm Block Dialog */}
      <ConfirmDialog
        isOpen={!!blockId}
        onClose={() => setBlockId(null)}
        onConfirm={handleBlockConfirm}
        title="Toggle Client Status"
        message="Are you sure you want to toggle this client's active account status?"
        confirmLabel="Confirm"
        variant="warning"
        loading={blocking}
      />
    </div>
  );
}
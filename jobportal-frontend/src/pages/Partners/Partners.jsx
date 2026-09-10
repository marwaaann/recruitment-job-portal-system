import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Handshake,
  Plus,
  Search,
  Mail,
  Phone,
  Building2,
  Globe,
  Eye,
  Edit2,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  MapPin,
  ExternalLink,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import {
  getAllPartners,
  deletePartner,
  blockPartner,
} from "../../services/partnerService";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Card, { CardContent } from "../../components/common/Card";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { TableSkeleton } from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";
import { useToast } from "../../components/common/Toast";

export default function Partners() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Block & Delete dialogs
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [blockId, setBlockId] = useState(null);
  const [blocking, setBlocking] = useState(false);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const data = await getAllPartners();
      setPartners(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load partners:", err);
      toastError("Failed to retrieve partner agency directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deletePartner(deleteId);
      success("Partner agency deleted successfully.");
      setDeleteId(null);
      fetchPartners();
    } catch (err) {
      console.error("Delete partner error:", err);
      toastError(err.response?.data?.message || "Failed to delete partner.");
    } finally {
      setDeleting(false);
    }
  };

  const handleBlockConfirm = async () => {
    if (!blockId) return;
    setBlocking(true);
    try {
      await blockPartner(blockId);
      success("Partner account status toggled.");
      setBlockId(null);
      fetchPartners();
    } catch (err) {
      console.error("Block partner error:", err);
      toastError(err.response?.data?.message || "Failed to update partner status.");
    } finally {
      setBlocking(false);
    }
  };

  const filteredPartners = useMemo(() => {
    if (!search.trim()) return partners;
    const s = search.toLowerCase();
    return partners.filter(
      (p) =>
        (p.companyName && p.companyName.toLowerCase().includes(s)) ||
        (p.contactPerson && p.contactPerson.toLowerCase().includes(s)) ||
        (p.email && p.email.toLowerCase().includes(s)) ||
        (p.phone && p.phone.includes(s))
    );
  }, [partners, search]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Partner Agencies
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Recruitment vendor partners authorized to submit candidate profiles.
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate("/partners/create")}
          >
            Register Partner
          </Button>
        )}
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company, contact person, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Total Partners: {partners.length}
        </div>
      </div>

      {/* Table Card */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={5} cols={5} />
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="p-12">
              <EmptyState
                icon={Handshake}
                title="No Partners Found"
                description={
                  search
                    ? `No partner agencies matching "${search}".`
                    : "No recruitment partners have been registered yet."
                }
                actionLabel={isAdmin ? "Register First Partner" : undefined}
                onAction={() => navigate("/partners/create")}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Partner Agency</th>
                    <th className="py-3.5 px-4">Contact Person</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right sm:pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPartners.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold text-sm shrink-0">
                            {p.companyName
                              ? p.companyName.charAt(0).toUpperCase()
                              : "P"}
                          </div>
                          <div className="min-w-0">
                            <Link
                              to={`/partners/${p.id}`}
                              className="font-semibold text-slate-900 hover:text-indigo-600 transition truncate block"
                            >
                              {p.companyName || "Unnamed Partner"}
                            </Link>
                            {p.website && (
                              <a
                                href={
                                  p.website.startsWith("http")
                                    ? p.website
                                    : `https://${p.website}`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-slate-400 hover:text-indigo-500 flex items-center gap-1 mt-0.5 truncate"
                              >
                                <Globe className="w-3 h-3" />
                                {p.website.replace(/^https?:\/\//, "")}
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-800 text-xs">
                          {p.contactPerson || "-"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-xs">
                          {p.email && (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[170px]">{p.email}</span>
                            </div>
                          )}
                          {p.phone && (
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{p.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {p.address ? (
                          <span className="truncate max-w-[150px] block">
                            {p.address}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge status={p.active ? "ACTIVE" : "BLOCKED"} />
                      </td>

                      <td className="py-3.5 px-4 text-right sm:pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Eye}
                            onClick={() => navigate(`/partners/${p.id}`)}
                            title="View Partner Details"
                          />
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Edit2}
                              onClick={() => navigate(`/partners/edit/${p.id}`)}
                              title="Edit Partner"
                            />
                          )}
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={ShieldAlert}
                              onClick={() => setBlockId(p.id)}
                              title={p.active ? "Block Partner" : "Unblock Partner"}
                              className={
                                p.active
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
                              onClick={() => setDeleteId(p.id)}
                              title="Delete Partner"
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
        title="Delete Partner Agency"
        message="Are you sure you want to delete this partner agency? All associated access credentials will be invalidated."
        confirmLabel="Delete Partner"
        variant="danger"
        loading={deleting}
      />

      {/* Confirm Block Dialog */}
      <ConfirmDialog
        isOpen={!!blockId}
        onClose={() => setBlockId(null)}
        onConfirm={handleBlockConfirm}
        title="Toggle Partner Account Status"
        message="Are you sure you want to toggle the active status of this partner agency?"
        confirmLabel="Confirm"
        variant="warning"
        loading={blocking}
      />
    </div>
  );
}
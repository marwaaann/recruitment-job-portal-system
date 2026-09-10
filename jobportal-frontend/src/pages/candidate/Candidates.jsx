import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Eye,
  Edit2,
  Trash2,
  RotateCcw,
  Globe,
  Briefcase,
  Calendar,
  AlertCircle,
  FileText,
  Filter,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import {
  getCandidatesPage,
  getDeletedCandidates,
  searchCandidatesPage,
  deleteCandidate,
  restoreCandidate,
} from "../../services/candidateService";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Card, { CardContent } from "../../components/common/Card";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Pagination from "../../components/common/Pagination";
import { TableSkeleton } from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";
import { useToast } from "../../components/common/Toast";

export default function Candidates() {
  const navigate = useNavigate();
  const { isAdmin, isPartner } = useAuth();
  const { success, error: toastError } = useToast();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);

  // Pagination & Sorting State
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState("desc");

  // Actions
  const [deleteCandidateId, setDeleteCandidateId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [restoreCandidateId, setRestoreCandidateId] = useState(null);
  const [restoring, setRestoring] = useState(false);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      let res;
      if (showDeleted) {
        res = await getDeletedCandidates(page, size, sortBy, direction);
      } else if (search.trim() !== "") {
        res = await searchCandidatesPage(search.trim(), page, size, sortBy, direction);
      } else {
        res = await getCandidatesPage(page, size, sortBy, direction);
      }

      setCandidates(res?.content || []);
      setTotalPages(res?.totalPages || 0);
      setTotalElements(res?.totalElements || 0);
    } catch (err) {
      console.error("Failed to load candidates:", err);
      toastError("Failed to fetch candidate directory.");
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [page, size, search, showDeleted, sortBy, direction]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidateId) return;
    setDeleting(true);
    try {
      await deleteCandidate(deleteCandidateId);
      success("Candidate moved to archived/deleted list.");
      setDeleteCandidateId(null);
      fetchCandidates();
    } catch (err) {
      console.error("Delete candidate error:", err);
      toastError(err.response?.data?.message || "Failed to delete candidate.");
    } finally {
      setDeleting(false);
    }
  };

  const handleRestoreConfirm = async () => {
    if (!restoreCandidateId) return;
    setRestoring(true);
    try {
      await restoreCandidate(restoreCandidateId);
      success("Candidate successfully restored to active talent pool.");
      setRestoreCandidateId(null);
      fetchCandidates();
    } catch (err) {
      console.error("Restore candidate error:", err);
      toastError(err.response?.data?.message || "Failed to restore candidate.");
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Talent Pool
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Central repository of candidate profiles, qualifications, and recruitment history.
          </p>
        </div>

        {(isAdmin || isPartner) && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate("/candidates/create")}
          >
            Add Candidate
          </Button>
        )}
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Mode Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => {
              setShowDeleted(false);
              setPage(0);
            }}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              !showDeleted
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Active Candidates {!showDeleted && `(${totalElements})`}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowDeleted(true);
              setPage(0);
            }}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              showDeleted
                ? "bg-white text-rose-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Archived / Deleted {showDeleted && `(${totalElements})`}
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-9.5 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="createdAt">Date Added</option>
              <option value="fullName">Full Name</option>
              <option value="experience">Experience</option>
            </select>

            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={6} cols={6} />
            </div>
          ) : candidates.length === 0 ? (
            <div className="p-12">
              <EmptyState
                icon={Users}
                title={showDeleted ? "No archived candidates" : "No candidates found"}
                description={
                  search
                    ? `No candidates matching "${search}". Try adjusting your search query.`
                    : showDeleted
                    ? "There are no deleted or archived candidates."
                    : "Your candidate talent pool is currently empty."
                }
                actionLabel={
                  !showDeleted && (isAdmin || isPartner) ? "Add First Candidate" : undefined
                }
                onAction={() => navigate("/candidates/create")}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Candidate</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Experience & Skills</th>
                    <th className="py-3.5 px-4">Nationality</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right sm:pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Candidate Avatar & Name */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-semibold flex items-center justify-center text-sm shadow-sm shrink-0">
                            {c.fullName ? c.fullName.charAt(0).toUpperCase() : "C"}
                          </div>
                          <div className="min-w-0">
                            <Link
                              to={`/candidates/${c.id}`}
                              className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors truncate block"
                            >
                              {c.fullName}
                            </Link>
                            <span className="text-xs text-slate-400 font-mono">
                              ID: #{c.id}
                              {c.passportNumber && ` • Pass: ${c.passportNumber}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-xs">
                          {c.email && (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[180px]">{c.email}</span>
                            </div>
                          )}
                          {c.phoneNormalized && (
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{c.phoneNormalized}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Experience & Education */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs">
                          <span className="font-semibold text-slate-800">
                            {c.experience ? `${c.experience} Years` : "Entry Level"}
                          </span>
                          {c.education && (
                            <p className="text-slate-500 truncate max-w-[200px] mt-0.5">
                              {c.education}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Nationality */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          {c.nationality || "-"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <Badge status={c.canonicalStatus || "ACTIVE"} />
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right sm:pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Eye}
                            onClick={() => navigate(`/candidates/${c.id}`)}
                            title="View Candidate Profile"
                          />

                          {!showDeleted && (isAdmin || isPartner) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Edit2}
                              onClick={() => navigate(`/candidates/edit/${c.id}`)}
                              title="Edit Candidate"
                            />
                          )}

                          {showDeleted && isAdmin && (
                            <Button
                              variant="outline"
                              size="sm"
                              icon={RotateCcw}
                              onClick={() => setRestoreCandidateId(c.id)}
                            >
                              Restore
                            </Button>
                          )}

                          {!showDeleted && isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Trash2}
                              onClick={() => setDeleteCandidateId(c.id)}
                              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                              title="Archive Candidate"
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

          {/* Pagination Footer */}
          {!loading && totalElements > 0 && (
            <div className="border-t border-slate-100 p-4">
              <Pagination
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                size={size}
                onPageChange={(newPage) => setPage(newPage)}
                onSizeChange={(newSize) => {
                  setSize(newSize);
                  setPage(0);
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteCandidateId}
        onClose={() => setDeleteCandidateId(null)}
        onConfirm={handleDeleteConfirm}
        title="Archive Candidate"
        message="Are you sure you want to archive this candidate? They will be removed from active searches but can be restored later."
        confirmLabel="Archive Candidate"
        variant="danger"
        loading={deleting}
      />

      {/* Restore Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!restoreCandidateId}
        onClose={() => setRestoreCandidateId(null)}
        onConfirm={handleRestoreConfirm}
        title="Restore Candidate"
        message="Restore this candidate back into the active talent pool?"
        confirmLabel="Restore Candidate"
        variant="primary"
        loading={restoring}
      />
    </div>
  );
}

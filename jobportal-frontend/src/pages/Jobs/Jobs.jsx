import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Plus,
  Search,
  Building2,
  Users,
  Eye,
  Edit2,
  XCircle,
  UserPlus,
  Calendar,
  AlertCircle,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { getAllJobs, closeJob, assignPartner } from "../../services/jobService";
import { getAllClients } from "../../services/clientService";
import { getAllPartners } from "../../services/partnerService";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { TableSkeleton } from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";
import { useToast } from "../../components/common/Toast";

export default function Jobs() {
  const navigate = useNavigate();
  const { user, isAdmin, isClient } = useAuth();
  const { success, error: toastError } = useToast();

  const [jobs, setJobs] = useState([]);
  const [clients, setClients] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Close Job Dialog
  const [closeJobId, setCloseJobId] = useState(null);
  const [closing, setClosing] = useState(false);

  // Assign Partner Modal
  const [assignJobId, setAssignJobId] = useState(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState("");
  const [assigning, setAssigning] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsData, clientsData, partnersData] = await Promise.all([
        getAllJobs().catch(() => []),
        getAllClients().catch(() => []),
        getAllPartners().catch(() => []),
      ]);

      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setClients(Array.isArray(clientsData) ? clientsData : []);
      setPartners(Array.isArray(partnersData) ? partnersData : []);
    } catch (err) {
      console.error("Failed to load jobs data:", err);
      toastError("Failed to fetch jobs records from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Client map for quick lookup by ID
  const clientMap = useMemo(() => {
    const map = {};
    clients.forEach((c) => {
      map[c.id] = c.company || c.fullName;
    });
    return map;
  }, [clients]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const jobStatus = String(job.status || "OPEN").toUpperCase();
      const clientName = clientMap[job.clientId] || "";
      const matchesSearch =
        `${job.title || ""} ${job.description || ""} ${clientName}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || jobStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter, clientMap]);

  // Handle Close Job Confirmation
  const handleConfirmClose = async () => {
    if (!closeJobId) return;
    setClosing(true);
    try {
      await closeJob(closeJobId);
      setJobs((prev) =>
        prev.map((j) => (j.id === closeJobId ? { ...j, status: "CLOSED" } : j))
      );
      success("Job requisition closed successfully.");
      setCloseJobId(null);
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to close job.");
    } finally {
      setClosing(false);
    }
  };

  // Handle Assign Partner
  const handleConfirmAssign = async () => {
    if (!assignJobId || !selectedPartnerId) {
      toastError("Please select a partner agency.");
      return;
    }
    setAssigning(true);
    try {
      await assignPartner(assignJobId, Number(selectedPartnerId));
      success("Partner agency assigned to job requisition successfully.");
      setAssignJobId(null);
      setSelectedPartnerId("");
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to assign partner.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Jobs &amp; Requisitions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage all active hiring positions, client mandates, and agency allocations
          </p>
        </div>

        {(isAdmin || isClient) && (
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => navigate("/jobs/create")}
          >
            Create Job
          </Button>
        )}
      </div>

      {/* Toolbar: Search & Filter Tabs */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative w-full md:w-80">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search title, description, client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 bg-white"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/80 w-full md:w-auto overflow-x-auto">
            {["ALL", "OPEN", "CLOSED", "PAUSED"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                {st === "ALL" ? "All Jobs" : st}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Jobs Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} cols={6} />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Briefcase}
              title={search || statusFilter !== "ALL" ? "No matching jobs" : "No jobs found"}
              description={
                search || statusFilter !== "ALL"
                  ? "Try adjusting your search criteria or clearing your filters."
                  : "No job openings have been created in this workspace yet."
              }
              actionLabel={isAdmin || isClient ? "Create First Job" : undefined}
              actionTo={isAdmin || isClient ? "/jobs/create" : undefined}
              actionIcon={Plus}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-5">Position</th>
                  <th className="py-3.5 px-4">Client / Company</th>
                  <th className="py-3.5 px-4 text-center">Vacancies</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map((job) => {
                  const clientName = clientMap[job.clientId] || "Direct Mandate";
                  const isClosed = (job.status || "OPEN").toUpperCase() === "CLOSED";

                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Job Title & Summary */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span
                              onClick={() => navigate(`/jobs/${job.id}`)}
                              className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer block truncate"
                            >
                              {job.title || "Untitled Position"}
                            </span>
                            <span className="text-[11px] text-slate-500 block truncate max-w-xs mt-0.5">
                              {job.description ? job.description.slice(0, 60) + "..." : "No description provided"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Client */}
                      <td className="py-4 px-4 text-slate-700">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{clientName}</span>
                        </div>
                      </td>

                      {/* Vacancies */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-700">
                          {job.vacancyCount || 1}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <Badge status={job.status || "OPEN"}>
                          {job.status || "OPEN"}
                        </Badge>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {job.createdAt
                              ? new Date(job.createdAt).toLocaleDateString()
                              : "—"}
                          </span>
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View */}
                          <button
                            type="button"
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="View Requisition & Applications"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit (Admin or Client) */}
                          {(isAdmin || isClient) && (
                            <button
                              type="button"
                              onClick={() => navigate(`/jobs/edit/${job.id}`)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              title="Edit Job"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Assign Partner (SuperAdmin / Admin) */}
                          {isAdmin && !isClosed && (
                            <button
                              type="button"
                              onClick={() => setAssignJobId(job.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                              title="Assign Partner Agency"
                            >
                              <UserPlus className="w-4 h-4" />
                            </button>
                          )}

                          {/* Close Job (SuperAdmin / Admin) */}
                          {isAdmin && !isClosed && (
                            <button
                              type="button"
                              onClick={() => setCloseJobId(job.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Close Job"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Confirm Close Job Dialog */}
      <ConfirmDialog
        isOpen={Boolean(closeJobId)}
        onClose={() => setCloseJobId(null)}
        onConfirm={handleConfirmClose}
        loading={closing}
        title="Close Requisition"
        message="Are you sure you want to close this job position? It will be marked as CLOSED and candidates will no longer be considered for open slots."
        confirmLabel="Close Position"
        variant="danger"
      />

      {/* Assign Partner Modal */}
      <Modal
        isOpen={Boolean(assignJobId)}
        onClose={() => {
          setAssignJobId(null);
          setSelectedPartnerId("");
        }}
        title="Assign Partner Agency"
        description="Allocate this requisition to an external recruiting partner for candidate sourcing."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Partner Agency
            </label>
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
            >
              <option value="">-- Choose Partner Agency --</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.companyName} ({p.contactPerson || p.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAssignJobId(null);
                setSelectedPartnerId("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={assigning}
              disabled={!selectedPartnerId}
              onClick={handleConfirmAssign}
            >
              Confirm Assignment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
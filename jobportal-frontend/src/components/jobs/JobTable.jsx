import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobStatusBadge from "./JobStatusBadge";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
};

export default function JobTable({ jobs, loading, onClose }) {
  const navigate = useNavigate();

  if (loading) return <div className="page-empty">Loading jobs...</div>;
  if (!jobs?.length) return <div className="page-empty">No jobs found.</div>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[760px]">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
          <tr><th className="p-4">Position</th><th className="p-4">Client ID</th><th className="p-4">Vacancies</th><th className="p-4">Status</th><th className="p-4">Created</th><th className="p-4 text-right">Actions</th></tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-t border-slate-100 transition hover:bg-slate-50">
              <td className="p-4"><strong className="block text-slate-900">{job.title || "Untitled position"}</strong><span className="mt-1 block max-w-sm truncate text-xs text-slate-500">{job.description || "No description"}</span></td>
              <td className="p-4 text-sm text-slate-600">#{job.clientId ?? "-"}</td>
              <td className="p-4 text-sm text-slate-600">{job.vacancyCount ?? 0}</td>
              <td className="p-4"><JobStatusBadge status={job.status || "UNKNOWN"} /></td>
              <td className="p-4 text-sm text-slate-500">{formatDate(job.createdAt)}</td>
              <td className="p-4 text-right"><div className="flex justify-end gap-1"><button type="button" onClick={() => navigate(`/jobs/${job.id}`)} className="table-action table-action-view action-tooltip" aria-label="View job" data-tooltip="View job"><Eye size={16} /><span className="sr-only">View job</span></button><button type="button" onClick={() => navigate(`/jobs/edit/${job.id}`)} className="table-action table-action-edit action-tooltip" aria-label="Edit job" data-tooltip="Edit job"><Pencil size={16} /><span className="sr-only">Edit job</span></button>{job.status !== "CLOSED" && <button type="button" onClick={() => onClose(job.id)} className="table-action table-action-delete action-tooltip" aria-label="Close job" data-tooltip="Close job"><Trash2 size={16} /><span className="sr-only">Close job</span></button>}</div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

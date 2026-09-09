import { ArrowLeft, BriefcaseBusiness, CalendarDays, FileText, Hash, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { closeJob, getJobById } from "../../services/jobService";
import JobStatusBadge from "../../components/jobs/JobStatusBadge";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
};

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  const handleClose = async () => {
    if (!window.confirm("Close this job? It will remain stored but will no longer be open.")) return;
    try {
      const updatedJob = await closeJob(id);
      setJob(updatedJob);
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.response?.data?.message || "The job could not be closed.");
    }
  };

  useEffect(() => {
    getJobById(id).then(setJob).catch((requestError) => {
      console.error(requestError);
      setError("This job could not be loaded.");
    });
  }, [id]);

  if (error) return <div className="page-empty">{error}</div>;
  if (!job) return <div className="page-empty">Loading job...</div>;

  return (
    <div className="w-full">
      <Link to="/jobs" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"><ArrowLeft size={16} /> Back to jobs</Link>
      <div className="page-header"><div><p className="page-eyebrow">Job details</p><h1>{job.title || "Untitled position"}</h1><p>Backend record #{job.id}</p></div><div className="flex items-center gap-3"><JobStatusBadge status={job.status || "UNKNOWN"} />{job.status !== "CLOSED" && <button type="button" onClick={handleClose} className="page-danger-button">Close job</button>}</div></div>
      <div className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
        <section className="dashboard-panel"><div className="mb-5 flex items-center gap-3"><div className="dashboard-row-icon"><FileText size={20} /></div><h2 className="text-lg font-semibold">Description</h2></div><p className="whitespace-pre-wrap leading-7 text-slate-600">{job.description || "No description provided."}</p></section>
        <section className="dashboard-panel"><h2 className="mb-5 text-lg font-semibold">Position data</h2><div className="space-y-4"><div className="settings-value"><span className="flex items-center gap-2"><Hash size={15} /> Job ID</span><strong>{job.id}</strong></div><div className="settings-value"><span className="flex items-center gap-2"><UserRound size={15} /> Client ID</span><strong>{job.clientId ?? "-"}</strong></div><div className="settings-value"><span className="flex items-center gap-2"><BriefcaseBusiness size={15} /> Vacancies</span><strong>{job.vacancyCount ?? 0}</strong></div><div className="settings-value"><span className="flex items-center gap-2"><CalendarDays size={15} /> Created</span><strong>{formatDate(job.createdAt)}</strong></div><div className="settings-value"><span>Updated</span><strong>{formatDate(job.updatedAt)}</strong></div><div className="settings-value"><span>Created by</span><strong>{job.createdBy ?? "-"}</strong></div></div></section>
      </div>
    </div>
  );
}

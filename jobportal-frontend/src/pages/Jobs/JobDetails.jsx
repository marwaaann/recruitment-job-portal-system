import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  FileText,
  Mail,
  MapPin,
  Pencil,
  Phone,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { getJobById, closeJob } from "../../services/jobService";
import { getClientById } from "../../services/clientService";
import JobStatusBadge from "../../components/jobs/JobStatusBadge";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadJobDetails();
  }, [id]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const jobData = await getJobById(id);
      setJob(jobData);

      if (jobData?.clientId) {
        try {
          const clientData = await getClientById(jobData.clientId);
          setClient(clientData);
        } catch (clientErr) {
          console.warn("Client details could not be loaded", clientErr);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load job details. The job may not exist.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    if (!window.confirm("Are you sure you want to close this job position?")) return;
    try {
      setClosing(true);
      const updated = await closeJob(id);
      setJob((prev) => ({ ...prev, ...updated, status: "CLOSED" }));
      alert("Job closed successfully.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to close job.");
    } finally {
      setClosing(false);
    }
  };

  const formatDate = (val) => {
    if (!val) return "-";
    const d = new Date(val);
    return Number.isNaN(d.getTime())
      ? "-"
      : d.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  if (loading) {
    return <div className="p-8 text-xl font-semibold text-slate-600">Loading Job Details...</div>;
  }

  if (error || !job) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow p-8">
          <p className="text-xl font-semibold text-slate-800 mb-2">{error || "Job not found."}</p>
          <p className="text-slate-500 mb-6 text-sm">Please return to the jobs list to view available openings.</p>
          <button
            onClick={() => navigate("/jobs")}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <ArrowLeft size={16} />
            Back to jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/jobs")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
      >
        <ArrowLeft size={18} />
        Back to jobs
      </button>

      {/* Main card */}
      <div className="bg-white rounded-2xl shadow p-8">
        {/* Header section with Icon, Title, Status, and Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl font-bold shadow-sm">
              <Briefcase size={32} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900">{job.title || "Untitled Position"}</h1>
                <JobStatusBadge status={job.status || "OPEN"} />
              </div>
              <p className="text-slate-500 text-sm mt-1">
                Job ID: #{job.id} &bull; Posted on {formatDate(job.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/jobs/edit/${job.id}`}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              <Pencil size={16} />
              Edit Job
            </Link>

            {job.status !== "CLOSED" && (
              <button
                type="button"
                onClick={handleClose}
                disabled={closing}
                className="inline-flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-lg font-medium transition disabled:opacity-50"
              >
                <XCircle size={16} />
                {closing ? "Closing..." : "Close Job"}
              </button>
            )}
          </div>
        </div>

        {/* 2-column info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          {/* Position Details */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-5 flex items-center gap-2">
              <Briefcase size={20} className="text-blue-600" />
              Position Details
            </h2>

            <div className="space-y-4 text-slate-700">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-slate-400 shrink-0" />
                <span className="text-slate-500 w-32 shrink-0">Vacancies:</span>
                <span className="font-semibold text-slate-900">{job.vacancyCount ?? 1} openings</span>
              </div>

              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-slate-400 shrink-0" />
                <span className="text-slate-500 w-32 shrink-0">Created Date:</span>
                <span className="font-medium">{formatDate(job.createdAt)}</span>
              </div>

              <div className="flex items-center gap-3">
                <Clock size={18} className="text-slate-400 shrink-0" />
                <span className="text-slate-500 w-32 shrink-0">Last Updated:</span>
                <span className="font-medium">{formatDate(job.updatedAt)}</span>
              </div>

              <div className="flex items-center gap-3">
                <User size={18} className="text-slate-400 shrink-0" />
                <span className="text-slate-500 w-32 shrink-0">Created By ID:</span>
                <span className="font-medium">#{job.createdBy ?? "-"}</span>
              </div>
            </div>
          </div>

          {/* Client Details */}
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-5 flex items-center gap-2">
              <Building2 size={20} className="text-blue-600" />
              Client Information
            </h2>

            <div className="space-y-4 text-slate-700">
              <div className="flex items-center gap-3">
                <Building2 size={18} className="text-slate-400 shrink-0" />
                <span className="text-slate-500 w-32 shrink-0">Company:</span>
                <span className="font-semibold text-slate-900">
                  {client?.company || client?.companyName || `Client #${job.clientId}`}
                </span>
              </div>

              {client?.fullName && (
                <div className="flex items-center gap-3">
                  <User size={18} className="text-slate-400 shrink-0" />
                  <span className="text-slate-500 w-32 shrink-0">Contact Person:</span>
                  <span className="font-medium">{client.fullName}</span>
                </div>
              )}

              {client?.email && (
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-slate-400 shrink-0" />
                  <span className="text-slate-500 w-32 shrink-0">Email:</span>
                  <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">
                    {client.email}
                  </a>
                </div>
              )}

              {client?.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-slate-400 shrink-0" />
                  <span className="text-slate-500 w-32 shrink-0">Phone:</span>
                  <span>{client.phone}</span>
                </div>
              )}

              {client?.address && (
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-slate-400 shrink-0 mt-1" />
                  <span className="text-slate-500 w-32 shrink-0">Address:</span>
                  <span>{client.address}</span>
                </div>
              )}

              {!client && (
                <div className="text-sm text-slate-500 italic">
                  Client ID: #{job.clientId} (Full client profile not loaded)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Job Description section */}
        <div className="mt-8 pt-8 border-t">
          <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            Job Description & Requirements
          </h2>
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
            <p className="whitespace-pre-wrap leading-relaxed text-slate-700">
              {job.description || "No description provided for this job position."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

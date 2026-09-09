import { ArrowLeft, BriefcaseBusiness, CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createJob } from "../../services/jobService";
import { getAllClients } from "../../services/clientService";

export default function CreateJob() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({ clientId: "", title: "", description: "", vacancyCount: "" });
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllClients()
      .then((data) => setClients(Array.isArray(data) ? data : []))
      .catch(() => setError("Clients could not be loaded. You can still return to the jobs list."))
      .finally(() => setLoadingClients(false));
  }, []);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.clientId || !formData.title.trim() || !formData.description.trim() || Number(formData.vacancyCount) < 1) {
      setError("Choose a client and complete all required fields before publishing.");
      return;
    }

    setLoading(true);
    try {
      await createJob({
        clientId: Number(formData.clientId),
        title: formData.title.trim(),
        description: formData.description.trim(),
        vacancyCount: Number(formData.vacancyCount),
      });
      navigate("/jobs");
    } catch (submitError) {
      console.error("Failed to create job:", submitError);
      setError(submitError.response?.data?.message || "The job could not be created. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Link to="/jobs" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"><ArrowLeft size={16} /> Back to jobs</Link>
      <div className="mb-7 flex items-start gap-4">
        <div className="dashboard-row-icon"><BriefcaseBusiness size={21} /></div>
        <div><p className="dashboard-kicker">Jobs workspace</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Create a new position</h1><p className="mt-2 text-slate-500">Publish the details that the recruitment team will work from.</p></div>
      </div>

      <form onSubmit={handleSubmit} className="page-form sm:p-8" >
        {error && <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><CircleAlert size={17} />{error}</div>}
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="sm:col-span-2"><span className="form-label">Job title *</span><input name="title" value={formData.title} onChange={handleChange} className="form-input" placeholder="Senior Java Developer" required /></label>
          <label><span className="form-label">Client *</span><select name="clientId" value={formData.clientId} onChange={handleChange} className="form-input" required disabled={loadingClients}><option value="">{loadingClients ? "Loading clients..." : "Select a client"}</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.companyName || client.company || client.fullName || `Client #${client.id}`}</option>)}</select></label>
          <label><span className="form-label">Vacancies *</span><input name="vacancyCount" type="number" min="1" value={formData.vacancyCount} onChange={handleChange} className="form-input" placeholder="5" required /></label>
          <label className="sm:col-span-2"><span className="form-label">Description *</span><textarea name="description" rows="8" value={formData.description} onChange={handleChange} className="form-input resize-y" placeholder="Describe the role, responsibilities, and what success looks like..." required /></label>
        </div>
        <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-6 sm:flex-row"><Link to="/jobs" className="rounded-lg border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-600">Cancel</Link><button type="submit" disabled={loading} className="dashboard-primary-button justify-center disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Publishing..." : "Publish position"}</button></div>
      </form>
    </div>
  );
}

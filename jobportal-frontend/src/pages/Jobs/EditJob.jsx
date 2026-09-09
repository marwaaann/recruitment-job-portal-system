import { ArrowLeft, BriefcaseBusiness, CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getJobById, updateJob } from "../../services/jobService";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", vacancyCount: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getJobById(id)
      .then((job) => setForm({ title: job.title || "", description: job.description || "", vacancyCount: job.vacancyCount ?? "" }))
      .catch((requestError) => {
        console.error(requestError);
        setError("This job could not be loaded.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim() || Number(form.vacancyCount) < 1) {
      setError("Complete the title, description, and vacancy count.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await updateJob(id, { title: form.title.trim(), description: form.description.trim(), vacancyCount: Number(form.vacancyCount) });
      navigate(`/jobs/${id}`);
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.response?.data?.message || "The job could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-empty">Loading job...</div>;
  if (error && !form.title) return <div className="page-empty">{error}</div>;

  return (
    <div className="w-full">
      <Link to={`/jobs/${id}`} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"><ArrowLeft size={16} /> Back to job</Link>
      <div className="mb-7 flex items-start gap-4"><div className="dashboard-row-icon"><BriefcaseBusiness size={21} /></div><div><p className="page-eyebrow">Jobs workspace</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Edit job</h1><p className="mt-2 text-slate-500">Update the fields supported by the backend job contract.</p></div></div>
      <form onSubmit={handleSubmit} className="page-form">
        {error && <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><CircleAlert size={17} />{error}</div>}
        <div className="grid gap-6">
          <label><span className="form-label">Job title *</span><input name="title" value={form.title} onChange={handleChange} className="form-input" required /></label>
          <label><span className="form-label">Vacancies *</span><input name="vacancyCount" type="number" min="1" value={form.vacancyCount} onChange={handleChange} className="form-input" required /></label>
          <label><span className="form-label">Description *</span><textarea name="description" rows="10" value={form.description} onChange={handleChange} className="form-input resize-y" required /></label>
        </div>
        <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6"><Link to={`/jobs/${id}`} className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600">Cancel</Link><button type="submit" disabled={saving} className="page-primary-button disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving..." : "Save changes"}</button></div>
      </form>
    </div>
  );
}

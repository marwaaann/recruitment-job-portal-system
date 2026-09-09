import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Briefcase, Building2, CircleAlert } from "lucide-react";
import { getJobById, updateJob } from "../../services/jobService";
import { getAllClients } from "../../services/clientService";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    vacancyCount: "",
    clientId: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [jobData, clientList] = await Promise.all([
        getJobById(id),
        getAllClients().catch(() => []),
      ]);

      setClients(Array.isArray(clientList) ? clientList : []);
      setForm({
        title: jobData.title || "",
        description: jobData.description || "",
        vacancyCount: jobData.vacancyCount ?? 1,
        clientId: jobData.clientId || "",
      });
    } catch (err) {
      console.error(err);
      setError("Unable to load job details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || Number(form.vacancyCount) < 1) {
      setError("Please fill in all required fields (title, vacancies, and description).");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateJob(id, {
        title: form.title.trim(),
        description: form.description.trim(),
        vacancyCount: Number(form.vacancyCount),
      });

      alert("Job updated successfully!");
      navigate(`/jobs/${id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update job position.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-xl font-semibold text-slate-600">Loading Job...</div>;
  }

  const linkedClient = clients.find((c) => String(c.id) === String(form.clientId));

  return (
    <div className="max-w-4xl mx-auto py-6">
      <button
        onClick={() => navigate(`/jobs/${id}`)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium transition"
      >
        <ArrowLeft size={18} />
        Back to job details
      </button>

      <div className="bg-white rounded-2xl shadow p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
            <Briefcase size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Edit Job Position</h1>
            <p className="text-slate-500 text-sm mt-1">Update job title, vacancies, and requirement details</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <CircleAlert size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 text-slate-900 focus:outline-blue-500"
                placeholder="e.g. Senior Java Backend Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Number of Vacancies *
              </label>
              <input
                type="number"
                name="vacancyCount"
                min="1"
                value={form.vacancyCount}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 text-slate-900 focus:outline-blue-500"
                placeholder="e.g. 5"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Associated Client / Company
              </label>
              <div className="w-full border rounded-lg p-3 bg-slate-50 text-slate-700 flex items-center gap-3">
                <Building2 size={18} className="text-blue-600 shrink-0" />
                <span className="font-medium">
                  {linkedClient?.company || linkedClient?.companyName || linkedClient?.fullName || `Client #${form.clientId || "N/A"}`}
                </span>
                {linkedClient?.email && (
                  <span className="text-slate-400 text-sm">({linkedClient.email})</span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Client reference is set when creating the position to preserve audit history.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Job Description & Requirements *
              </label>
              <textarea
                name="description"
                rows={8}
                value={form.description}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 text-slate-900 focus:outline-blue-500 resize-y leading-relaxed"
                placeholder="Describe role, responsibilities, technical requirements, qualifications, and benefits..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Link
              to={`/jobs/${id}`}
              className="px-6 py-2.5 rounded-lg border border-slate-300 font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {saving ? "Saving Changes..." : "Update Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

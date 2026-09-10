import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Briefcase,
  ArrowLeft,
  Building2,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { getJobById, updateJob } from "../../services/jobService";
import { getAllClients } from "../../services/clientService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Badge from "../../components/common/Badge";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/common/Card";
import { CardSkeleton } from "../../components/common/SkeletonLoader";
import { useToast } from "../../components/common/Toast";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [job, setJob] = useState(null);
  const [client, setClient] = useState(null);

  const [form, setForm] = useState({
    title: "",
    vacancyCount: "1",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const loadJobAndClient = async () => {
      setLoading(true);
      try {
        const [jobData, clientList] = await Promise.all([
          getJobById(id),
          getAllClients().catch(() => []),
        ]);

        setJob(jobData);
        setForm({
          title: jobData?.title || "",
          vacancyCount: String(jobData?.vacancyCount ?? 1),
          description: jobData?.description || "",
        });

        if (jobData?.clientId && Array.isArray(clientList)) {
          const matched = clientList.find(
            (c) => String(c.id) === String(jobData.clientId)
          );
          if (matched) setClient(matched);
        }
      } catch (err) {
        console.error("Failed to load job details:", err);
        toastError("Unable to retrieve job requisition details.");
      } finally {
        setLoading(false);
      }
    };

    loadJobAndClient();
  }, [id]);

  const validate = () => {
    const errors = {};
    if (!form.title.trim()) {
      errors.title = "Job title is required.";
    }
    if (!form.vacancyCount || Number(form.vacancyCount) < 1) {
      errors.vacancyCount = "Vacancies must be at least 1.";
    }
    if (!form.description.trim()) {
      errors.description = "Job description is required.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        vacancyCount: Number(form.vacancyCount),
        description: form.description.trim(),
      };

      await updateJob(id, payload);
      success("Job requisition updated successfully!");
      navigate(`/jobs/${id}`);
    } catch (err) {
      console.error("Failed to update job:", err);
      toastError(
        err.response?.data?.message ||
          "Failed to update requisition. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-6 w-36 bg-slate-200 rounded animate-pulse" />
        <CardSkeleton rows={5} />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Requisition Not Found
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          The requested job position ID #{id} does not exist or has been removed.
        </p>
        <Button variant="primary" onClick={() => navigate("/jobs")}>
          Return to Requisitions
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back Link */}
      <div>
        <Link
          to={`/jobs/${id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Requisition #{id}
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Edit Requisition
              </h1>
              <Badge status={job.status || "OPEN"} />
            </div>
            <p className="text-sm text-slate-500">
              Requisition #{job.id} &bull; Created{" "}
              {job.createdAt
                ? new Date(job.createdAt).toLocaleDateString()
                : "Recently"}
            </p>
          </div>
        </div>

        {client && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>
              Client: <strong>{client.company || client.companyName || client.fullName}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Requisition Specifications</CardTitle>
            <CardDescription>
              Modify title, open vacancies, and position scope.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <Input
                  label="Job Title *"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  error={formErrors.title}
                  icon={Briefcase}
                  required
                />
              </div>

              {/* Vacancy Count */}
              <div>
                <Input
                  label="Number of Vacancies *"
                  name="vacancyCount"
                  type="number"
                  min="1"
                  value={form.vacancyCount}
                  onChange={handleChange}
                  error={formErrors.vacancyCount}
                  icon={Users}
                  required
                />
              </div>

              {/* Associated Client Info (Read only) */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Associated Client
                </label>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-sm">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium truncate">
                    {client?.company ||
                      client?.companyName ||
                      client?.fullName ||
                      `Client ID: #${job.clientId || "N/A"}`}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Client association is immutable once requisition is published.
                </p>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <Textarea
                  label="Job Description & Requirements *"
                  name="description"
                  rows={8}
                  value={form.description}
                  onChange={handleChange}
                  error={formErrors.description}
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/jobs/${id}`)}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              loading={saving}
              icon={CheckCircle2}
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

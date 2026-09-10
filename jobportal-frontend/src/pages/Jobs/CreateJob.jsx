import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Briefcase,
  ArrowLeft,
  Building2,
  Users,
  FileText,
  AlertCircle,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { createJob } from "../../services/jobService";
import { getAllClients } from "../../services/clientService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Textarea from "../../components/common/Textarea";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/common/Card";
import { useToast } from "../../components/common/Toast";

export default function CreateJob() {
  const navigate = useNavigate();
  const { user, isClient } = useAuth();
  const { success, error: toastError } = useToast();

  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    clientId: "",
    vacancyCount: "1",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getAllClients();
        const clientList = Array.isArray(data) ? data : [];
        setClients(clientList);

        // If logged-in user is a client, auto-select matching client account
        if (isClient && user) {
          const matched = clientList.find(
            (c) =>
              c.email === user.email ||
              c.userId === user.id ||
              String(c.id) === String(user.id)
          );
          if (matched) {
            setForm((prev) => ({ ...prev, clientId: String(matched.id) }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch clients:", err);
        toastError("Failed to load client accounts list.");
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, [isClient, user]);

  const validate = () => {
    const errors = {};
    if (!form.title.trim()) {
      errors.title = "Job title is required.";
    }
    if (!form.clientId) {
      errors.clientId = "Please select a client company.";
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

    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        clientId: Number(form.clientId),
        vacancyCount: Number(form.vacancyCount),
        description: form.description.trim(),
      };

      const res = await createJob(payload);
      success("Job requisition created successfully!");
      navigate(res?.id ? `/jobs/${res.id}` : "/jobs");
    } catch (err) {
      console.error("Failed to create job:", err);
      toastError(
        err.response?.data?.message ||
          "Failed to create job requisition. Please check your inputs."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Breadcrumb / Back Link */}
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Requisitions
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
          <Briefcase className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Job Requisition
          </h1>
          <p className="text-sm text-slate-500">
            Publish a new open position linked to an authorized client
            organization.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>
              All fields are backed directly by the recruitment service.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div className="md:col-span-2">
                <Input
                  label="Job Title *"
                  name="title"
                  placeholder="e.g. Senior Full Stack Engineer"
                  value={form.title}
                  onChange={handleChange}
                  error={formErrors.title}
                  icon={Briefcase}
                  required
                />
              </div>

              {/* Client Selection */}
              <div>
                <Select
                  label="Client Organization *"
                  name="clientId"
                  value={form.clientId}
                  onChange={handleChange}
                  error={formErrors.clientId}
                  icon={Building2}
                  disabled={loadingClients}
                  required
                >
                  <option value="">
                    {loadingClients
                      ? "Loading clients list..."
                      : "-- Select Client Organization --"}
                  </option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company || c.companyName || c.fullName} (ID: #{c.id})
                    </option>
                  ))}
                </Select>
                {clients.length === 0 && !loadingClients && (
                  <p className="mt-1.5 text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    No clients registered yet. Please register a client first.
                  </p>
                )}
              </div>

              {/* Vacancies */}
              <div>
                <Input
                  label="Number of Vacancies *"
                  name="vacancyCount"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={form.vacancyCount}
                  onChange={handleChange}
                  error={formErrors.vacancyCount}
                  icon={Users}
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <Textarea
                  label="Job Description & Requirements *"
                  name="description"
                  rows={8}
                  placeholder="Detail the position scope, responsibilities, technical prerequisites, and candidate expectations..."
                  value={form.description}
                  onChange={handleChange}
                  error={formErrors.description}
                  helperText="Clear requirements reduce screening time and improve partner candidate match accuracy."
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/jobs")}
              disabled={submitting}
            >
              Cancel
            </Button>
            <div className="flex items-center gap-3">
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                icon={Briefcase}
              >
                {submitting ? "Creating..." : "Publish Requisition"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

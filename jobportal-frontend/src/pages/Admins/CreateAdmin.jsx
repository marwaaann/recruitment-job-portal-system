import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield,
  ArrowLeft,
  User,
  Mail,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { createAdmin } from "../../services/adminService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/common/Card";
import { useToast } from "../../components/common/Toast";

export default function CreateAdmin() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = "Full name is required.";
    if (!form.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Invalid email format.";
    }
    if (!form.password.trim() || form.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
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
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
      };

      const res = await createAdmin(payload);
      success("Administrator account created successfully!");
      navigate(res?.id ? `/admins/${res.id}` : "/admins");
    } catch (err) {
      console.error("Create admin error:", err);
      toastError(
        err.response?.data?.message ||
          "Failed to create administrator. Email may already exist."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <Link
          to="/admins"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Administrators
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Administrator
          </h1>
          <p className="text-sm text-slate-500">
            Provision a new operational administrator account with system governance privileges.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Administrator Profile</CardTitle>
            <CardDescription>
              Assign the primary administrator credentials.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              label="Full Name *"
              name="fullName"
              placeholder="e.g. Elena Rostova"
              value={form.fullName}
              onChange={handleChange}
              error={formErrors.fullName}
              icon={User}
              required
            />

            <Input
              label="Email Address *"
              name="email"
              type="email"
              placeholder="admin@jobportal.com"
              value={form.email}
              onChange={handleChange}
              error={formErrors.email}
              icon={Mail}
              required
            />

            <Input
              label="Initial Password *"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              error={formErrors.password}
              icon={Lock}
              required
            />
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admins")}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              icon={CheckCircle2}
            >
              {submitting ? "Creating..." : "Create Administrator"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
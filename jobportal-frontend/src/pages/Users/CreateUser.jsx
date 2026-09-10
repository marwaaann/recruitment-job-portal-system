import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserCircle,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Shield,
  CheckCircle2,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { createUser } from "../../services/userService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/common/Card";
import { useToast } from "../../components/common/Toast";

export default function CreateUser() {
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "ADMIN",
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
    if (!form.role) errors.role = "Role is required.";
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
        role: form.role,
      };

      const res = await createUser(payload);
      success("User account registered successfully!");
      navigate(res?.id ? `/users/${res.id}` : "/users");
    } catch (err) {
      console.error("Create user error:", err);
      toastError(
        err.response?.data?.message ||
          "Failed to create user. Email may already be in use."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <Link
          to="/users"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
          <UserCircle className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create System User
          </h1>
          <p className="text-sm text-slate-500">
            Provision user identity credentials and assign authorization roles.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Assign the appropriate role corresponding to the user's operational duties.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              label="Full Name *"
              name="fullName"
              placeholder="e.g. Jordan Lee"
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
              placeholder="user@example.com"
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

            <Select
              label="System Role *"
              name="role"
              value={form.role}
              onChange={handleChange}
              error={formErrors.role}
              icon={Shield}
              required
            >
              {isSuperAdmin && (
                <option value="SUPER_ADMIN">Super Administrator</option>
              )}
              <option value="ADMIN">Administrator</option>
              <option value="PARTNER">Partner Recruiter</option>
              <option value="CLIENT">Client Organization</option>
              <option value="CANDIDATE">Candidate</option>
            </Select>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/users")}
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
              {submitting ? "Creating..." : "Create User"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
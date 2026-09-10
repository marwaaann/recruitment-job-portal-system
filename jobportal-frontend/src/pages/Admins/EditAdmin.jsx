import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Shield,
  ArrowLeft,
  User,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { getAdminById, updateAdmin } from "../../services/adminService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
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

export default function EditAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [admin, setAdmin] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      try {
        const data = await getAdminById(id);
        setAdmin(data);
        setForm({
          fullName: data?.fullName || "",
          email: data?.email || "",
          password: "",
        });
      } catch (err) {
        console.error("Failed to load admin:", err);
        toastError("Unable to retrieve administrator account.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [id]);

  const validate = () => {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = "Full name is required.";
    if (!form.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Invalid email format.";
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
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password ? form.password : undefined,
      };

      await updateAdmin(id, payload);
      success("Administrator profile updated successfully!");
      navigate(`/admins/${id}`);
    } catch (err) {
      console.error("Update admin error:", err);
      toastError(
        err.response?.data?.message || "Failed to update administrator profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="h-6 w-36 bg-slate-200 rounded animate-pulse" />
        <CardSkeleton rows={4} />
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Admin Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          Administrator record #{id} does not exist or has been removed.
        </p>
        <Button variant="primary" onClick={() => navigate("/admins")}>
          Return to Administrators
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <Link
          to={`/admins/${id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Profile
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Edit Administrator
              </h1>
              <Badge role={admin.role || "ADMIN"} />
            </div>
            <p className="text-sm text-slate-500">
              Admin #{admin.id} &bull; {admin.fullName}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Administrator Details</CardTitle>
            <CardDescription>
              Update name, email address, or update credentials.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              label="Full Name *"
              name="fullName"
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
              value={form.email}
              onChange={handleChange}
              error={formErrors.email}
              icon={Mail}
              required
            />

            <Input
              label="New Password (Optional)"
              name="password"
              type="password"
              placeholder="Leave blank to keep existing password"
              value={form.password}
              onChange={handleChange}
              icon={Lock}
            />
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/admins/${id}`)}
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
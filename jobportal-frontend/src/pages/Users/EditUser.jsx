import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  UserCircle,
  ArrowLeft,
  User,
  Mail,
  Shield,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { getUserById, updateUser } from "../../services/userService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
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

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "ADMIN",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await getUserById(id);
        setUser(data);
        setForm({
          fullName: data?.fullName || "",
          email: data?.email || "",
          role: data?.role || "ADMIN",
        });
      } catch (err) {
        console.error("Failed to load user:", err);
        toastError("Unable to retrieve user account.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const validate = () => {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = "Full name is required.";
    if (!form.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Invalid email format.";
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

    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        role: form.role,
      };

      await updateUser(id, payload);
      success("User profile updated successfully!");
      navigate(`/users/${id}`);
    } catch (err) {
      console.error("Update user error:", err);
      toastError(err.response?.data?.message || "Failed to update user profile.");
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

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">User Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          User record #{id} does not exist or has been removed.
        </p>
        <Button variant="primary" onClick={() => navigate("/users")}>
          Return to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <Link
          to={`/users/${id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to User Details
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
            <UserCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Edit User Account
              </h1>
              <Badge role={user.role} />
            </div>
            <p className="text-sm text-slate-500">
              User ID #{user.id} &bull; {user.fullName}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Identity & Authorization</CardTitle>
            <CardDescription>
              Modify user display name, login email, and system authorization role.
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
              onClick={() => navigate(`/users/${id}`)}
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
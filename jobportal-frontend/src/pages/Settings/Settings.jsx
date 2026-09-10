import { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Mail,
  Shield,
  KeyRound,
  CheckCircle2,
  Lock,
  Server,
  Info,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { changePassword } from "../../services/adminService";
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
import { useToast } from "../../components/common/Toast";

export default function Settings() {
  const { user, isSuperAdmin, isAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!form.oldPassword) errors.oldPassword = "Current password is required.";
    if (!form.newPassword || form.newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters.";
    }
    if (form.newPassword !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await changePassword(form.oldPassword, form.newPassword);
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      success("Password successfully updated!");
    } catch (err) {
      console.error("Change password error:", err);
      toastError(
        err.response?.data?.message ||
          "Failed to update password. Please check your current password."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Account & Security Settings
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your personal profile, credentials, and system configuration parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              User Profile
            </CardTitle>
            <CardDescription>
              Authenticated session information loaded from backend.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-14 h-14 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xl shadow-sm">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-base">
                  {user?.fullName || "Authenticated User"}
                </h3>
                <p className="text-xs text-slate-500">{user?.email || "-"}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge role={user?.role || "ADMIN"} />
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active Session
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 pt-2">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Account User ID</span>
                <span className="font-mono font-semibold text-slate-800">
                  #{user?.id || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">System Role</span>
                <span className="font-medium text-slate-800">{user?.role || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Security Access</span>
                <span className="font-semibold text-indigo-600">
                  {isSuperAdmin
                    ? "Full Root SuperAdmin"
                    : isAdmin
                    ? "Administrative Level"
                    : "Standard Operational"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        {(isSuperAdmin || isAdmin) ? (
          <Card>
            <form onSubmit={handlePasswordSubmit}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-indigo-600" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your authentication credentials securely.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Current Password *"
                  name="oldPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={form.oldPassword}
                  onChange={handleChange}
                  error={formErrors.oldPassword}
                  icon={Lock}
                  required
                />

                <Input
                  label="New Password *"
                  name="newPassword"
                  type="password"
                  placeholder="At least 6 characters"
                  value={form.newPassword}
                  onChange={handleChange}
                  error={formErrors.newPassword}
                  icon={Lock}
                  required
                />

                <Input
                  label="Confirm New Password *"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  error={formErrors.confirmPassword}
                  icon={Lock}
                  required
                />
              </CardContent>
              <CardFooter className="flex justify-end border-t border-slate-100 bg-slate-50/50 p-4">
                <Button
                  type="submit"
                  variant="primary"
                  loading={saving}
                  icon={KeyRound}
                >
                  {saving ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Card className="flex flex-col justify-center text-center p-8">
            <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">
              Security Managed by Administrator
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Password changes for your role account are managed directly by your organization's system administrator.
            </p>
          </Card>
        )}

        {/* System & Connection Environment Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-600" />
              Environment & Connection Parameters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-semibold uppercase block">Backend Service</span>
                <span className="font-mono text-slate-800 mt-1 block font-medium">
                  {import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-semibold uppercase block">WebSocket Protocol</span>
                <span className="font-mono text-slate-800 mt-1 block font-medium">
                  STOMP over SockJS
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-semibold uppercase block">Session Storage</span>
                <span className="text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Encrypted Bearer JWT
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { CheckCircle2, KeyRound, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { changePassword } from "../../services/adminService";

export default function Settings() {
  const { user } = useAuth();
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [saving, setSaving] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (form.newPassword.length < 8) {
      setStatus({ type: "error", message: "The new password must contain at least 8 characters." });
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: "error", message: "The new passwords do not match." });
      return;
    }

    setSaving(true);
    try {
      await changePassword(form.oldPassword, form.newPassword);
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setStatus({ type: "success", message: "Password updated successfully." });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Password could not be updated.",
      });
    } finally {
      setSaving(false);
    }
  };

  const role = user?.role?.replaceAll("_", " ") || "Unknown";

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="dashboard-kicker">Account workspace</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">Settings</h1>
        <p className="mt-2 text-slate-500">Manage the account details and security options supported by this portal.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
        <section className="dashboard-panel h-fit">
          <div className="mb-6 flex items-center gap-3">
            <div className="dashboard-row-icon"><UserRound size={20} /></div>
            <div><h2 className="text-lg font-semibold text-slate-950">Account information</h2><p className="text-sm text-slate-500">Loaded from your authenticated session.</p></div>
          </div>
          <div className="space-y-4">
            <div className="settings-value"><span>Name</span><strong>{user?.fullName || "-"}</strong></div>
            <div className="settings-value"><span>Email</span><strong>{user?.email || "-"}</strong></div>
            <div className="settings-value"><span>Role</span><strong className="capitalize">{role.toLowerCase()}</strong></div>
            <div className="settings-value"><span>Status</span><strong className="inline-flex items-center gap-1.5 text-emerald-600"><CheckCircle2 size={15} /> Active</strong></div>
          </div>
        </section>

        {user?.role === "SUPER_ADMIN" ? (
          <section className="dashboard-panel">
            <div className="mb-6 flex items-center gap-3">
              <div className="dashboard-action-icon dashboard-stat-blue"><KeyRound size={18} /></div>
              <div><h2 className="text-lg font-semibold text-slate-950">Change password</h2><p className="text-sm text-slate-500">Update your password securely.</p></div>
            </div>
            {status.message && <div className={`mb-5 rounded-lg border p-3 text-sm ${status.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>{status.message}</div>}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <label><span className="form-label">Current password</span><input className="form-input" type="password" name="oldPassword" value={form.oldPassword} onChange={updateField} required /></label>
              <label><span className="form-label">New password</span><input className="form-input" type="password" name="newPassword" value={form.newPassword} onChange={updateField} minLength={8} required /></label>
              <label><span className="form-label">Confirm new password</span><input className="form-input" type="password" name="confirmPassword" value={form.confirmPassword} onChange={updateField} minLength={8} required /></label>
              <button type="submit" disabled={saving} className="dashboard-primary-button mt-2 disabled:cursor-not-allowed disabled:opacity-60"><ShieldCheck size={17} />{saving ? "Updating..." : "Update password"}</button>
            </form>
          </section>
        ) : (
          <section className="dashboard-panel flex min-h-52 items-center justify-center text-center"><div><ShieldCheck className="mx-auto mb-3 text-slate-400" size={28} /><h2 className="font-semibold text-slate-900">Security managed by an administrator</h2><p className="mt-1 max-w-sm text-sm text-slate-500">Password changes for this role are not exposed by the current backend contract.</p></div></section>
        )}
      </div>
    </div>
  );
}

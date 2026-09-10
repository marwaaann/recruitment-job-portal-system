import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Building2,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "../../services/clientService";
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

export default function CreateClient() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    company: "",
    address: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!form.company.trim()) errors.company = "Company / Organization name is required.";
    if (!form.fullName.trim()) errors.fullName = "Contact person name is required.";
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
        phone: form.phone.trim() || null,
        company: form.company.trim(),
        address: form.address.trim() || null,
      };

      const res = await createClient(payload);
      success("Client organization registered successfully!");
      navigate(res?.id ? `/clients/${res.id}` : "/clients");
    } catch (err) {
      console.error("Create client error:", err);
      toastError(
        err.response?.data?.message ||
          "Failed to register client organization. Email may already exist."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <Link
          to="/clients"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Clients
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Client Account
          </h1>
          <p className="text-sm text-slate-500">
            Register an employer organization with requisition publishing privileges.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Organization & Representative Details</CardTitle>
            <CardDescription>
              All registered details are persisted in the central database.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Company / Organization Name *"
                  name="company"
                  placeholder="e.g. Acme Innovations Corp"
                  value={form.company}
                  onChange={handleChange}
                  error={formErrors.company}
                  icon={Building2}
                  required
                />
              </div>

              <div>
                <Input
                  label="Contact Person Name *"
                  name="fullName"
                  placeholder="e.g. Robert Smith"
                  value={form.fullName}
                  onChange={handleChange}
                  error={formErrors.fullName}
                  icon={User}
                  required
                />
              </div>

              <div>
                <Input
                  label="Official Email Address *"
                  name="email"
                  type="email"
                  placeholder="robert@acme.com"
                  value={form.email}
                  onChange={handleChange}
                  error={formErrors.email}
                  icon={Mail}
                  required
                />
              </div>

              <div>
                <Input
                  label="Initial Account Password *"
                  name="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  error={formErrors.password}
                  icon={Lock}
                  required
                />
              </div>

              <div>
                <Input
                  label="Phone Number"
                  name="phone"
                  placeholder="+1-555-0188"
                  value={form.phone}
                  onChange={handleChange}
                  icon={Phone}
                />
              </div>

              <div>
                <Input
                  label="Office / Billing Address"
                  name="address"
                  placeholder="100 Silicon Way, Austin, TX"
                  value={form.address}
                  onChange={handleChange}
                  icon={MapPin}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/clients")}
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
              {submitting ? "Creating..." : "Create Client Account"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
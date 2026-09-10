import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Handshake,
  ArrowLeft,
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  Globe,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { createPartner } from "../../services/partnerService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/common/Card";
import { useToast } from "../../components/common/Toast";

export default function CreatePartner() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    password: "",
    phone: "",
    website: "",
    address: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!form.companyName.trim()) errors.companyName = "Agency name is required.";
    if (!form.contactPerson.trim()) errors.contactPerson = "Contact person is required.";
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
        companyName: form.companyName.trim(),
        contactPerson: form.contactPerson.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || null,
        website: form.website.trim() || null,
        address: form.address.trim() || null,
      };

      const res = await createPartner(payload);
      success("Partner agency registered successfully!");
      navigate(res?.id ? `/partners/${res.id}` : "/partners");
    } catch (err) {
      console.error("Create partner error:", err);
      toastError(
        err.response?.data?.message ||
          "Failed to register partner. Email may already be in use."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <Link
          to="/partners"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Partners
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
          <Handshake className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Register Partner Agency
          </h1>
          <p className="text-sm text-slate-500">
            Create an authorized agency profile and issue login credentials.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Agency & Credentials</CardTitle>
            <CardDescription>
              All registered information will be immediately accessible in the backend.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Agency / Company Name *"
                  name="companyName"
                  placeholder="e.g. Apex Recruitment Partners"
                  value={form.companyName}
                  onChange={handleChange}
                  error={formErrors.companyName}
                  icon={Building2}
                  required
                />
              </div>

              <div>
                <Input
                  label="Primary Contact Person *"
                  name="contactPerson"
                  placeholder="e.g. Sarah Connor"
                  value={form.contactPerson}
                  onChange={handleChange}
                  error={formErrors.contactPerson}
                  icon={User}
                  required
                />
              </div>

              <div>
                <Input
                  label="Official Email Address *"
                  name="email"
                  type="email"
                  placeholder="partner@agency.com"
                  value={form.email}
                  onChange={handleChange}
                  error={formErrors.email}
                  icon={Mail}
                  required
                />
              </div>

              <div>
                <Input
                  label="Account Password *"
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
                  label="Contact Phone"
                  name="phone"
                  placeholder="+1-555-0199"
                  value={form.phone}
                  onChange={handleChange}
                  icon={Phone}
                />
              </div>

              <div>
                <Input
                  label="Agency Website"
                  name="website"
                  placeholder="https://apexrecruitment.com"
                  value={form.website}
                  onChange={handleChange}
                  icon={Globe}
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Office Physical Address"
                  name="address"
                  placeholder="Suite 400, Financial District, New York, NY"
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
              onClick={() => navigate("/partners")}
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
              {submitting ? "Registering..." : "Register Partner"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
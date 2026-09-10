import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Handshake,
  ArrowLeft,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { getPartnerById, updatePartner } from "../../services/partnerService";
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

export default function EditPartner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [partner, setPartner] = useState(null);

  const [form, setForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    address: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchPartner = async () => {
      setLoading(true);
      try {
        const data = await getPartnerById(id);
        setPartner(data);
        setForm({
          companyName: data?.companyName || "",
          contactPerson: data?.contactPerson || "",
          email: data?.email || "",
          phone: data?.phone || "",
          website: data?.website || "",
          address: data?.address || "",
        });
      } catch (err) {
        console.error("Failed to load partner:", err);
        toastError("Unable to retrieve partner agency details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [id]);

  const validate = () => {
    const errors = {};
    if (!form.companyName.trim()) errors.companyName = "Agency name is required.";
    if (!form.contactPerson.trim()) errors.contactPerson = "Contact person is required.";
    if (!form.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Invalid email address.";
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
        companyName: form.companyName.trim(),
        contactPerson: form.contactPerson.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        website: form.website.trim() || null,
        address: form.address.trim() || null,
      };

      await updatePartner(id, payload);
      success("Partner agency updated successfully!");
      navigate(`/partners/${id}`);
    } catch (err) {
      console.error("Update partner error:", err);
      toastError(
        err.response?.data?.message || "Failed to update partner details."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-6 w-36 bg-slate-200 rounded animate-pulse" />
        <CardSkeleton rows={5} />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Partner Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          Partner record #{id} does not exist or has been removed.
        </p>
        <Button variant="primary" onClick={() => navigate("/partners")}>
          Return to Partners
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <Link
          to={`/partners/${id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Partner Details
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
            <Handshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Edit Partner Agency
              </h1>
              <Badge status={partner.active ? "ACTIVE" : "BLOCKED"} />
            </div>
            <p className="text-sm text-slate-500">
              Partner #{partner.id} &bull; {partner.companyName}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Agency Profile & Settings</CardTitle>
            <CardDescription>
              Update business name, contact information, and coordinates.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Agency / Company Name *"
                  name="companyName"
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
                  value={form.email}
                  onChange={handleChange}
                  error={formErrors.email}
                  icon={Mail}
                  required
                />
              </div>

              <div>
                <Input
                  label="Contact Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  icon={Phone}
                />
              </div>

              <div>
                <Input
                  label="Agency Website"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  icon={Globe}
                />
              </div>

              <div>
                <Input
                  label="Office Physical Address"
                  name="address"
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
              onClick={() => navigate(`/partners/${id}`)}
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
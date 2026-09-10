import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Users,
  ArrowLeft,
  User,
  Mail,
  Phone,
  CreditCard,
  Globe,
  Calendar,
  Briefcase,
  GraduationCap,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import {
  getCandidateById,
  updateCandidate,
  checkDuplicate,
} from "../../services/candidateService";
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

export default function EditCandidate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [candidate, setCandidate] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNormalized: "",
    passportNumber: "",
    dob: "",
    nationality: "",
    experience: "",
    education: "",
    noticePeriod: "30 Days",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchCandidate = async () => {
      setLoading(true);
      try {
        const data = await getCandidateById(id);
        setCandidate(data);

        // Parse noticePeriod from customFields if present
        let parsedNotice = "30 Days";
        if (data?.customFields) {
          try {
            const parsed = JSON.parse(data.customFields);
            if (parsed?.noticePeriod) parsedNotice = parsed.noticePeriod;
          } catch {
            parsedNotice = data.customFields;
          }
        }

        setForm({
          fullName: data?.fullName || "",
          email: data?.email || "",
          phoneNormalized: data?.phoneNormalized || "",
          passportNumber: data?.passportNumber || "",
          dob: data?.dob || "",
          nationality: data?.nationality || "",
          experience: data?.experience || "",
          education: data?.education || "",
          noticePeriod: parsedNotice || "30 Days",
        });
      } catch (err) {
        console.error("Failed to load candidate:", err);
        toastError("Unable to retrieve candidate details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  const validate = () => {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = "Full name is required.";
    if (!form.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Please provide a valid email format.";
    }
    if (!form.phoneNormalized.trim()) {
      errors.phoneNormalized = "Contact phone number is required.";
    }
    if (!form.passportNumber.trim()) {
      errors.passportNumber = "Passport / National ID is required.";
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
        phoneNormalized: form.phoneNormalized.trim(),
        passportNumber: form.passportNumber.trim(),
        dob: form.dob || null,
        nationality: form.nationality.trim() || null,
        experience: form.experience.trim() || null,
        education: form.education.trim() || null,
        noticePeriod: form.noticePeriod,
      };

      await updateCandidate(id, payload);
      success("Candidate profile updated successfully!");
      navigate(`/candidates/${id}`);
    } catch (err) {
      console.error("Failed to update candidate:", err);
      toastError(
        err.response?.data?.message ||
          "Failed to update candidate profile. Please check your inputs."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-6 w-36 bg-slate-200 rounded animate-pulse" />
        <CardSkeleton rows={6} />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Candidate Not Found
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          The requested candidate record ID #{id} could not be located.
        </p>
        <Button variant="primary" onClick={() => navigate("/candidates")}>
          Return to Candidates
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back Link */}
      <div>
        <Link
          to={`/candidates/${id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Candidate Profile
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Edit Candidate Profile
              </h1>
              <Badge status={candidate.canonicalStatus || "ACTIVE"} />
            </div>
            <p className="text-sm text-slate-500">
              Candidate #{candidate.id} &bull; Registered{" "}
              {candidate.createdAt
                ? new Date(candidate.createdAt).toLocaleDateString()
                : "Recently"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Biographical & Identification Details</CardTitle>
            <CardDescription>
              Update legal identifiers and primary contact channels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Full Legal Name *"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  error={formErrors.fullName}
                  icon={User}
                  required
                />
              </div>

              <div>
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
              </div>

              <div>
                <Input
                  label="Phone Number *"
                  name="phoneNormalized"
                  value={form.phoneNormalized}
                  onChange={handleChange}
                  error={formErrors.phoneNormalized}
                  icon={Phone}
                  required
                />
              </div>

              <div>
                <Input
                  label="Passport / National ID Number *"
                  name="passportNumber"
                  value={form.passportNumber}
                  onChange={handleChange}
                  error={formErrors.passportNumber}
                  icon={CreditCard}
                  required
                />
              </div>

              <div>
                <Input
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  icon={Calendar}
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Nationality"
                  name="nationality"
                  value={form.nationality}
                  onChange={handleChange}
                  icon={Globe}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Credentials</CardTitle>
            <CardDescription>
              Qualifications, tenure, and availability timeline.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Years of Experience"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  icon={Briefcase}
                />
              </div>

              <div>
                <Select
                  label="Notice Period / Availability"
                  name="noticePeriod"
                  value={form.noticePeriod}
                  onChange={handleChange}
                  icon={Clock}
                >
                  <option value="Immediate">Immediate Availability</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days</option>
                  <option value="60 Days">60 Days</option>
                  <option value="90 Days">90 Days</option>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Highest Education / Degrees"
                  name="education"
                  value={form.education}
                  onChange={handleChange}
                  icon={GraduationCap}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/candidates/${id}`)}
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
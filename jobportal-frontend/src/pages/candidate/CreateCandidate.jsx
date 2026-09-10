import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Building2,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import {
  createCandidate,
  checkDuplicate,
} from "../../services/candidateService";
import { getAllPartners } from "../../services/partnerService";
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

export default function CreateCandidate() {
  const navigate = useNavigate();
  const { user, isAdmin, isPartner } = useAuth();
  const { success, error: toastError, warning } = useToast();

  const [partners, setPartners] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(null);

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
    partnerId: isPartner && user?.id ? String(user.id) : "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAdmin) {
      getAllPartners()
        .then((data) => setPartners(Array.isArray(data) ? data : []))
        .catch(() => {});
    }
  }, [isAdmin]);

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

  // Live duplicate check on blur of email, phone, or passport
  const handleCheckDuplicate = async () => {
    if (!form.email && !form.phoneNormalized && !form.passportNumber) return;
    try {
      setCheckingDuplicate(true);
      const res = await checkDuplicate(
        form.email.trim() || undefined,
        form.phoneNormalized.trim() || undefined,
        form.passportNumber.trim() || undefined
      );

      if (res?.duplicate) {
        setDuplicateWarning({
          candidateId: res.candidateId,
          message:
            res.message ||
            "A duplicate candidate matching this email, phone, or passport was detected.",
        });
        warning("Possible duplicate candidate identified.");
      } else {
        setDuplicateWarning(null);
      }
    } catch (err) {
      console.warn("Duplicate check error:", err);
    } finally {
      setCheckingDuplicate(false);
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
        phoneNormalized: form.phoneNormalized.trim(),
        passportNumber: form.passportNumber.trim(),
        dob: form.dob || null,
        nationality: form.nationality.trim() || null,
        experience: form.experience.trim() || null,
        education: form.education.trim() || null,
        noticePeriod: form.noticePeriod,
        partnerId: form.partnerId ? Number(form.partnerId) : null,
      };

      const created = await createCandidate(payload);
      success("Candidate profile registered successfully!");
      navigate(created?.id ? `/candidates/${created.id}` : "/candidates");
    } catch (err) {
      console.error("Create candidate error:", err);
      toastError(
        err.response?.data?.message ||
          "Failed to create candidate. Please check the information provided."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back Link */}
      <div>
        <Link
          to="/candidates"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Candidates
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Register Candidate
          </h1>
          <p className="text-sm text-slate-500">
            Add a new candidate profile to your talent pipeline with verified
            identities.
          </p>
        </div>
      </div>

      {/* Duplicate Warning Banner */}
      {duplicateWarning && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm flex-1">
            <p className="font-semibold text-amber-900">
              Potential Duplicate Match Found
            </p>
            <p className="mt-0.5 text-amber-800">{duplicateWarning.message}</p>
            {duplicateWarning.candidateId && (
              <div className="mt-2">
                <Link
                  to={`/candidates/${duplicateWarning.candidateId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline hover:text-amber-950 text-xs inline-flex items-center gap-1"
                >
                  View Existing Candidate (#{duplicateWarning.candidateId})
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic & Identity */}
        <Card>
          <CardHeader>
            <CardTitle>Personal & Identity Information</CardTitle>
            <CardDescription>
              Basic biographical data and legal identification records.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Full Legal Name *"
                  name="fullName"
                  placeholder="e.g. Alex Morgan"
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
                  placeholder="candidate@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleCheckDuplicate}
                  error={formErrors.email}
                  icon={Mail}
                  required
                />
              </div>

              <div>
                <Input
                  label="Phone Number *"
                  name="phoneNormalized"
                  placeholder="+1-555-0199"
                  value={form.phoneNormalized}
                  onChange={handleChange}
                  onBlur={handleCheckDuplicate}
                  error={formErrors.phoneNormalized}
                  icon={Phone}
                  required
                />
              </div>

              <div>
                <Input
                  label="Passport / National ID Number *"
                  name="passportNumber"
                  placeholder="e.g. A12345678"
                  value={form.passportNumber}
                  onChange={handleChange}
                  onBlur={handleCheckDuplicate}
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

              <div>
                <Input
                  label="Nationality"
                  name="nationality"
                  placeholder="e.g. Canadian"
                  value={form.nationality}
                  onChange={handleChange}
                  icon={Globe}
                />
              </div>

              {isAdmin && (
                <div>
                  <Select
                    label="Associated Partner Agency"
                    name="partnerId"
                    value={form.partnerId}
                    onChange={handleChange}
                    icon={Building2}
                  >
                    <option value="">-- None (Direct Registration) --</option>
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.agencyName || p.fullName} (ID #{p.id})
                      </option>
                    ))}
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Qualifications & Experience */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Background & Qualifications</CardTitle>
            <CardDescription>
              Work experience, educational credentials, and availability.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Years of Experience"
                  name="experience"
                  placeholder="e.g. 5"
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
                  placeholder="e.g. B.S. in Computer Science - University of Toronto"
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
              onClick={() => navigate("/candidates")}
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
              {submitting ? "Registering..." : "Register Candidate"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

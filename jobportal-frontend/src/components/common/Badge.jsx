export default function Badge({
  children,
  variant,
  status,
  size = "md",
  className = "",
}) {
  const getVariant = () => {
    if (variant) return variant;

    const normalized = String(status || children || "").toUpperCase().trim();

    switch (normalized) {
      case "OPEN":
      case "ACTIVE":
      case "HIRED":
      case "SUCCESS":
        return "emerald";

      case "SHORTLISTED":
      case "INTERVIEW":
        return "indigo";

      case "OFFERED":
      case "SUPER_ADMIN":
        return "purple";

      case "APPLIED":
      case "ADMIN":
        return "blue";

      case "PAUSED":
      case "MERGED":
      case "PARTNER":
      case "WARNING":
        return "amber";

      case "CLIENT":
        return "teal";

      case "CANDIDATE":
        return "sky";

      case "CLOSED":
      case "REJECTED":
      case "DELETED":
      case "INACTIVE":
      case "BLOCKED":
      case "ERROR":
        return "rose";

      default:
        return "slate";
    }
  };

  const currentVariant = getVariant();

  const variantStyles = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/60 ring-emerald-600/10",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200/60 ring-indigo-600/10",
    purple: "bg-purple-50 text-purple-700 border-purple-200/60 ring-purple-600/10",
    blue: "bg-blue-50 text-blue-700 border-blue-200/60 ring-blue-600/10",
    sky: "bg-sky-50 text-sky-700 border-sky-200/60 ring-sky-600/10",
    teal: "bg-teal-50 text-teal-700 border-teal-200/60 ring-teal-600/10",
    amber: "bg-amber-50 text-amber-700 border-amber-200/60 ring-amber-600/10",
    rose: "bg-rose-50 text-rose-700 border-rose-200/60 ring-rose-600/10",
    slate: "bg-slate-100 text-slate-700 border-slate-200 ring-slate-600/10",
  };

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-0.5",
    lg: "text-sm px-3 py-1",
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ring-1 ring-inset ${
        sizeStyles[size] || sizeStyles.md
      } ${variantStyles[currentVariant] || variantStyles.slate} ${className}`}
    >
      {children}
    </span>
  );
}

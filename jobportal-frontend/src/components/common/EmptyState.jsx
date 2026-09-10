import { FolderOpen } from "lucide-react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = "No data found",
  description = "There are no records to display at this moment.",
  actionLabel,
  onAction,
  actionTo,
  actionIcon,
  className = "",
}) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionTo) {
      navigate(actionTo);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-base font-bold text-slate-900 tracking-tight">
        {title}
      </h3>

      <p className="mt-1.5 text-xs text-slate-500 max-w-sm leading-relaxed">
        {description}
      </p>

      {(actionLabel && (onAction || actionTo)) && (
        <div className="mt-6">
          <Button
            variant="primary"
            size="md"
            icon={actionIcon}
            onClick={handleAction}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

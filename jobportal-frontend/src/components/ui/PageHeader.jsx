import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function PageHeader({ eyebrow, title, description, actionLabel, actionTo }) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <p className="page-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="page-primary-button">
          <Plus size={17} />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const rawPath = location.pathname.split("/")[1] || "dashboard";
  const pageTitle = rawPath.charAt(0).toUpperCase() + rawPath.slice(1);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container z-40 flex items-center justify-between px-6">
      {/* Left: Breadcrumb & Search */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <span className="font-semibold text-on-surface">Kinetic ATS</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="capitalize text-on-surface-variant">{pageTitle}</span>
        </div>

        <div className="hidden md:flex items-center bg-surface-container-low rounded-lg px-3 py-1.5 gap-2 w-72 text-on-surface-variant border border-surface-container">
          <span className="material-symbols-outlined text-[18px]">search</span>
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent text-xs outline-none flex-1 text-on-surface placeholder:text-outline"
          />
          <kbd className="bg-surface-container-highest px-2 py-0.5 rounded font-mono text-[10px] text-on-surface-variant">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Controls & Profile */}
      <div className="flex items-center gap-4">
        <button
          className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg hover:bg-surface-container text-on-surface transition-colors text-xs font-medium border border-surface-container"
          type="button"
        >
          <span className="w-2 h-2 rounded-full bg-tertiary"></span>
          <span>Organization HQ</span>
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">unfold_more</span>
        </button>

        <button
          onClick={() => navigate("/jobs/create")}
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-primary-container transition-all shadow-sm"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Quick Action</span>
        </button>

        <button
          className="relative p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
          type="button"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full bg-error text-white text-[10px] font-bold leading-none">
            4
          </span>
        </button>

        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shadow-sm">
          {user?.fullName?.charAt(0).toUpperCase() || (
            <span className="material-symbols-outlined text-[18px]">person</span>
          )}
        </div>
      </div>
    </header>
  );
}
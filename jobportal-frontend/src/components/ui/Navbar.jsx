import useAuth from "../../hooks/useAuth";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Menu, Plus, ChevronRight, Briefcase, Users } from "lucide-react";
import Button from "../common/Button";

export default function Navbar({ onToggleMobileSidebar }) {
  const { user, isAdmin, isPartner, isClient } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse path segments for clean breadcrumbs
  const pathParts = location.pathname.split("/").filter(Boolean);
  const rootSegment = pathParts[0] || "dashboard";

  const getBreadcrumbTitle = (segment) => {
    switch (segment.toLowerCase()) {
      case "dashboard":
        return "Dashboard";
      case "jobs":
        return "Jobs & Requisitions";
      case "candidates":
        return "Talent Directory";
      case "pipeline":
        return "Recruitment Pipeline";
      case "partners":
        return "Recruitment Partners";
      case "clients":
        return "Client Accounts";
      case "users":
        return "User Management";
      case "admins":
        return "System Administrators";
      case "messages":
        return "OmniChannel Messages";
      case "settings":
        return "Settings & Preferences";
      case "create":
        return "Create New";
      case "edit":
        return "Edit Record";
      default:
        return segment;
    }
  };

  const userInitial = (user?.fullName || "U").charAt(0).toUpperCase();

  return (
    <header className="bg-white/95 backdrop-blur-md h-16 border-b border-slate-200/80 px-6 flex justify-between items-center z-30 sticky top-0 flex-shrink-0">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link
            to="/dashboard"
            className="hover:text-indigo-600 transition-colors hidden sm:inline"
          >
            Portal
          </Link>

          {pathParts.length > 0 && (
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          )}

          {pathParts.map((part, index) => {
            const isLast = index === pathParts.length - 1;
            const routeTo = `/${pathParts.slice(0, index + 1).join("/")}`;

            return (
              <div key={part} className="flex items-center gap-2">
                {isLast ? (
                  <span className="font-bold text-slate-900 text-sm tracking-tight">
                    {getBreadcrumbTitle(part)}
                  </span>
                ) : (
                  <>
                    <Link
                      to={routeTo}
                      className="hover:text-indigo-600 transition-colors"
                    >
                      {getBreadcrumbTitle(part)}
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Right: Quick Action & User Info */}
      <div className="flex items-center gap-3">
        {/* Role-aware Quick Actions */}
        {(isAdmin || isClient) && (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate("/jobs/create")}
            className="hidden sm:inline-flex"
          >
            Create Job
          </Button>
        )}

        {isPartner && (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate("/candidates/create")}
            className="hidden sm:inline-flex"
          >
            Add Candidate
          </Button>
        )}

        {/* User Avatar Circle */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {userInitial}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 leading-tight">
              {user?.fullName || "User"}
            </span>
            <span className="text-[10px] font-medium text-slate-500">
              {(user?.role || "GUEST").replace("_", " ")}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { logout as logoutApi } from "../../services/authService";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.log(error);
    }
    logout();
    navigate("/");
  };

  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const isAdminOrSuper = ["SUPER_ADMIN", "ADMIN"].includes(user?.role);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-container-lowest flex flex-col z-50 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-surface-container">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between bg-surface-container-lowest border-b border-surface-container">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm">
            <span className="material-symbols-outlined text-[20px]">hub</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-headline-lg text-lg tracking-tight text-on-surface truncate font-bold">
              Kinetic
            </span>
            <span className="text-[11px] tracking-wider uppercase text-primary font-bold leading-none">
              ATS Engine
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[10px] tracking-wide uppercase font-semibold">
          {user?.role === "SUPER_ADMIN" ? "SUPER ADMIN" : user?.role || "ADMIN"}
        </span>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {/* Main */}
        <nav className="space-y-1">
          <div className="px-2 pb-1 text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">
            Main
          </div>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary-container text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
            <span>Dashboard</span>
          </NavLink>
        </nav>

        {/* Recruitment */}
        <nav className="space-y-1">
          <div className="px-2 pb-1 text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">
            Recruitment
          </div>
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary-container text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">work_outline</span>
            <span>Jobs</span>
          </NavLink>
          <NavLink
            to="/candidates"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary-container text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">group</span>
            <span>Candidates</span>
          </NavLink>
          <NavLink
            to="/jobs"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">description</span>
            <span>Applications</span>
          </NavLink>
          <NavLink
            to="/pipeline"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary-container text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">view_kanban</span>
            <span>Pipeline</span>
          </NavLink>
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            <span>Interviews</span>
          </NavLink>
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">verified</span>
            <span>Offers</span>
          </NavLink>
        </nav>

        {/* People */}
        <nav className="space-y-1">
          <div className="px-2 pb-1 text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">
            People
          </div>
          <NavLink
            to="/partners"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary-container text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">handshake</span>
            <span>Partners</span>
          </NavLink>
          <NavLink
            to="/clients"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary-container text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">domain</span>
            <span>Clients</span>
          </NavLink>
          {isSuperAdmin && (
            <>
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary-container text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`
                }
              >
                <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                <span>Users</span>
              </NavLink>
              <NavLink
                to="/admins"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary-container text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`
                }
              >
                <span className="material-symbols-outlined text-[20px]">shield</span>
                <span>Admins</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Communication */}
        <nav className="space-y-1">
          <div className="px-2 pb-1 text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">
            Communication
          </div>
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary-container text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">chat</span>
              <span>Messages</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[11px] font-semibold">
              3
            </span>
          </NavLink>
        </nav>

        {/* Reports */}
        <nav className="space-y-1">
          <div className="px-2 pb-1 text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">
            Reports
          </div>
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">analytics</span>
            <span>Analytics</span>
          </NavLink>
        </nav>

        {/* Administration */}
        {isAdminOrSuper && (
          <nav className="space-y-1">
            <div className="px-2 pb-1 text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">
              Administration
            </div>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary-container text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span>Settings</span>
            </NavLink>
          </nav>
        )}
      </div>

      {/* User Footer Card */}
      <div className="p-3 bg-surface-container-low mx-3 mb-4 rounded-xl flex items-center justify-between border border-surface-container">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {user?.fullName?.charAt(0).toUpperCase() || (
                <span className="material-symbols-outlined text-[18px]">person</span>
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-tertiary ring-2 ring-surface-container-lowest"></span>
          </div>
          <div className="min-w-0 flex flex-col">
            <span className="text-xs text-on-surface truncate font-semibold">
              {user?.fullName || "Marwan Al-Sayed"}
            </span>
            <span className="text-[11px] text-on-surface-variant truncate">
              {user?.role === "SUPER_ADMIN" ? "Super Admin" : user?.role || "Administrator"}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container rounded transition-colors"
          title="Sign out"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
        </button>
      </div>
    </aside>
  );
}
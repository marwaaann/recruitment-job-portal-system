import {
  LayoutDashboard,
  Briefcase,
  Users,
  Layers,
  Building2,
  Handshake,
  Shield,
  UserCircle,
  Settings,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { logout as logoutApi } from "../../services/authService";
import Badge from "../common/Badge";

export default function Sidebar({ mobileOpen = false, onCloseMobile }) {
  const navigate = useNavigate();
  const { user, logout, isSuperAdmin, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout API error:", error);
    }
    logout();
    navigate("/");
  };

  const navSections = [
    {
      title: "MAIN",
      items: [
        {
          title: "Dashboard",
          icon: LayoutDashboard,
          path: "/dashboard",
          allowed: true,
        },
      ],
    },
    {
      title: "RECRUITMENT",
      items: [
        {
          title: "Jobs",
          icon: Briefcase,
          path: "/jobs",
          allowed: true,
        },
        {
          title: "Candidates",
          icon: Users,
          path: "/candidates",
          allowed: true,
        },
        {
          title: "Pipeline",
          icon: Layers,
          path: "/pipeline",
          allowed: true,
        },
      ],
    },
    {
      title: "PEOPLE",
      items: [
        {
          title: "Partners",
          icon: Handshake,
          path: "/partners",
          allowed: isAdmin,
        },
        {
          title: "Clients",
          icon: Building2,
          path: "/clients",
          allowed: isAdmin,
        },
        {
          title: "Users",
          icon: UserCircle,
          path: "/users",
          allowed: isAdmin,
        },
        {
          title: "Admins",
          icon: Shield,
          path: "/admins",
          allowed: isSuperAdmin,
        },
      ],
    },
    {
      title: "COMMUNICATION",
      items: [
        {
          title: "Messages",
          icon: MessageCircle,
          path: "/messages",
          allowed: true,
        },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        {
          title: "Settings",
          icon: Settings,
          path: "/settings",
          allowed: isAdmin,
        },
      ],
    },
  ];

  const userInitials = (user?.fullName || "User")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800/80 transition-transform duration-200 lg:translate-x-0 lg:static ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/60 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-indigo-500/20">
            K
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-base tracking-tight leading-none">
              Job Portal
            </span>
            <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase mt-1">
              Recruitment ATS
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 select-none scrollbar-thin scrollbar-thumb-slate-800">
          {navSections.map((section) => {
            const visibleItems = section.items.filter((item) => item.allowed);
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title}>
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {section.title}
                </p>
                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onCloseMobile}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                            isActive
                              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                              : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                          }`
                        }
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.title}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User Account Footer */}
        <div className="p-3 border-t border-slate-800/60 flex-shrink-0">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                {userInitials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {user?.fullName || "User Account"}
                </p>
                <div className="mt-0.5">
                  <Badge size="sm" status={user?.role || "GUEST"}>
                    {(user?.role || "GUEST").replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  Handshake,
  Shield,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { logout as logoutApi } from "../../services/authService";
const menus = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Jobs",
    icon: Briefcase,
    path: "/jobs",
  },
  {
    title: "Candidates",
    icon: Users,
    path: "/candidates",
  },
  {
    title: "Clients",
    icon: Building2,
    path: "/clients",
  },
  {
    title: "Partners",
    icon: Handshake,
    path: "/partners",
  },
  {
    title: "Admins",
    icon: Shield,
    path: "/admins",
  },
  {
    title: "Users",
    icon: UserCircle,
    path: "/users",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar() {

  const navigate = useNavigate();

const { logout } = useAuth();

const handleLogout = async () => {

    try {

        await logoutApi();

    } catch (error) {

        console.log(error);

    }

    logout();

    navigate("/");

};


  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-xl">

      {/* Logo */}

      <div className="h-20 flex items-center justify-center border-b border-slate-800">

        <h1 className="text-2xl font-bold tracking-wide">

          Job Portal

        </h1>

      </div>

      {/* Navigation */}

      <nav className="flex-1 mt-6 px-3">

        {menus.map((menu) => {

          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.title}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "hover:bg-slate-800 text-slate-300"
                }`
              }
            >
              <Icon size={22} />

              <span className="font-medium">
                {menu.title}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}

      <div className="p-4 border-t border-slate-800">

        <button
    onClick={handleLogout}
    className="flex items-center gap-4 w-full px-4 py-3 rounded-xl hover:bg-red-600 transition"
>

    <LogOut size={22} />

    Logout

</button>

      </div>

    </aside>
  );
}
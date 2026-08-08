import { useState } from "react";
import {
  User,
  Shield,
  Bell,
  Lock,
  Globe,
  Save,
  LogOut,
  Trash2,
  Server,
  Database,
  Monitor,
} from "lucide-react";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    alerts: true,
    candidates: false,
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your account, security, notifications, and system preferences.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 shadow-sm">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="xl:col-span-2 space-y-6">
          {/* Profile */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
                <p className="text-sm text-gray-500">
                  Update your personal information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Marwan Shafi"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="marwan@gmail.com"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="text-red-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Security</h2>
                <p className="text-sm text-gray-500">
                  Change password and manage sessions
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700">
                <Lock size={16} />
                Update Password
              </button>

              <button className="flex items-center gap-2 border border-gray-300 px-4 py-2.5 rounded-xl hover:bg-gray-50">
                <LogOut size={16} />
                Logout All Devices
              </button>

              <button className="flex items-center gap-2 border border-red-300 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-50">
                <Trash2 size={16} />
                Revoke Sessions
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Bell className="text-yellow-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Notifications
                </h2>
                <p className="text-sm text-gray-500">
                  Choose what you want to be notified about
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                ["Email notifications", "email"],
                ["System alerts", "alerts"],
                ["New candidate alerts", "candidates"],
              ].map(([label, key]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="text-sm text-gray-500">
                      Receive updates related to {label.toLowerCase()}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setNotifications({
                        ...notifications,
                        [key]: !notifications[key],
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      notifications[key] ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notifications[key] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Account */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-green-100 rounded-lg">
                <Globe className="text-green-600" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Account</h2>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Role</span>
                <span className="font-medium text-gray-900">SUPER_ADMIN</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Member since</span>
                <span className="font-medium text-gray-900">Aug 2026</span>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              System Health
            </h2>

            <div className="space-y-4">
              {[
                {
                  icon: Server,
                  label: "Backend API",
                  status: "Connected",
                  color: "text-green-600",
                },
                {
                  icon: Database,
                  label: "Database",
                  status: "Online",
                  color: "text-green-600",
                },
                {
                  icon: Monitor,
                  label: "Frontend",
                  status: "Healthy",
                  color: "text-green-600",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className="text-gray-600" />
                    <span className="font-medium text-gray-900">
                      {item.label}
                    </span>
                  </div>

                  <span className={`text-sm font-medium ${item.color}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* App Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Application
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Version</span>
                <span className="font-medium text-gray-900">v1.0.0</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Environment</span>
                <span className="font-medium text-gray-900">Production</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Build</span>
                <span className="font-medium text-gray-900">2026.08.08</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
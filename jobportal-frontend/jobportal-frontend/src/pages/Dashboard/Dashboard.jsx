import {
  Briefcase,
  Users,
  UserCheck,
  Building2,
  ArrowUpRight,
  Clock3,
  Plus,
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Active Jobs",
      value: "24",
      change: "+12%",
      icon: Briefcase,
      color: "bg-blue-500",
    },
    {
      title: "Candidates",
      value: "1,248",
      change: "+8.2%",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Clients",
      value: "18",
      change: "+3.1%",
      icon: Building2,
      color: "bg-emerald-500",
    },
    {
      title: "Placements",
      value: "96",
      change: "+18.4%",
      icon: UserCheck,
      color: "bg-orange-500",
    },
  ];

  const recentCandidates = [
    { name: "Ankur Sharma", role: "AI Engineer", status: "Interview" },
    { name: "Shizin K", role: "Java Developer", status: "Screening" },
    { name: "Sai Kumar", role: "ML Engineer", status: "Shortlisted" },
    { name: "Rishabh M", role: "Backend Developer", status: "Hired" },
  ];

  const jobs = [
    { title: "Senior Java Developer", company: "Microsoft", applicants: 42 },
    { title: "React Frontend Engineer", company: "Google", applicants: 31 },
    { title: "DevOps Engineer", company: "Amazon", applicants: 27 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, Marwan 👋
          </h1>
          <p className="text-gray-500 mt-2">
            Here’s what’s happening with your recruitment pipeline today.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2.5 rounded-xl hover:bg-gray-50">
            <Clock3 size={18} />
            Last 30 days
          </button>

          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 shadow-sm">
            <Plus size={18} />
            Create Job
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white mb-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-3">
              Recruitment performance is up 18.4%
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Your team shortlisted 42 candidates and completed 8 interviews this week.
              Keep the momentum going with faster screening and automated follow-ups.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 min-w-[220px]">
            <div className="text-sm text-blue-100 mb-1">Open positions</div>
            <div className="text-4xl font-bold mb-4">24</div>
            <div className="flex items-center gap-2 text-sm">
              <ArrowUpRight size={16} />
              <span>+5 this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>

              <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                <stat.icon size={22} />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 font-semibold">{stat.change}</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Side */}
        <div className="xl:col-span-2 space-y-6">
          {/* Pipeline */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Candidate Pipeline
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Current hiring funnel across all active jobs
                </p>
              </div>

              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View report
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Applied", value: 324, color: "bg-blue-100 text-blue-700" },
                { label: "Screening", value: 96, color: "bg-yellow-100 text-yellow-700" },
                { label: "Interview", value: 42, color: "bg-purple-100 text-purple-700" },
                { label: "Hired", value: 18, color: "bg-green-100 text-green-700" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${item.color}`}>
                    {item.label}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mt-4">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Jobs */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Active Jobs</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Roles receiving the most applicants
                </p>
              </div>

              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Manage jobs
              </button>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.title}
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{job.company}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-900">{job.applicants}</p>
                    <p className="text-sm text-gray-500">Applicants</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {[
                "Add Candidate",
                "Create Job",
                "Add Client",
                "Add Partner",
              ].map((action) => (
                <button
                  key={action}
                  className="p-4 rounded-2xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm font-medium text-gray-700"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Candidates */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Candidates
              </h2>

              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </button>
            </div>

            <div className="space-y-4">
              {recentCandidates.map((candidate) => (
                <div
                  key={candidate.name}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                      {candidate.name.charAt(0)}
                    </div>

                    <div>
                      <p className="font-medium text-gray-900">{candidate.name}</p>
                      <p className="text-sm text-gray-500">{candidate.role}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      candidate.status === "Hired"
                        ? "bg-green-100 text-green-700"
                        : candidate.status === "Interview"
                        ? "bg-purple-100 text-purple-700"
                        : candidate.status === "Shortlisted"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {candidate.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
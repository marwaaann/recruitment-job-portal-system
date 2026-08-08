import {
    Briefcase,
    Users,
    Building2,
    FileText,
} from "lucide-react";

import StatCard from "./StatCard";

export default function DashboardStats() {

    // Temporary dummy data
    // Later we'll replace this with backend API data

    const stats = [
        {
            title: "Total Jobs",
            value: 125,
            icon: <Briefcase className="text-white" size={28} />,
            color: "bg-blue-600",
        },
        {
            title: "Candidates",
            value: 532,
            icon: <Users className="text-white" size={28} />,
            color: "bg-green-600",
        },
        {
            title: "Companies",
            value: 41,
            icon: <Building2 className="text-white" size={28} />,
            color: "bg-purple-600",
        },
        {
            title: "Applications",
            value: 982,
            icon: <FileText className="text-white" size={28} />,
            color: "bg-orange-500",
        },
    ];

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {stats.map((item, index) => (

                <StatCard
                    key={index}
                    title={item.title}
                    value={item.value}
                    icon={item.icon}
                    color={item.color}
                />

            ))}

        </div>

    );

}
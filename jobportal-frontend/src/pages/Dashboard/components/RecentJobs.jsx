import {
    MapPin,
    CalendarDays,
    Briefcase
} from "lucide-react";

const jobs = [
    {
        id: 1,
        title: "Java Developer",
        company: "Google",
        location: "Bangalore",
        date: "Today"
    },
    {
        id: 2,
        title: "React Developer",
        company: "Microsoft",
        location: "Hyderabad",
        date: "Yesterday"
    },
    {
        id: 3,
        title: "Spring Boot Engineer",
        company: "Amazon",
        location: "Chennai",
        date: "2 days ago"
    }
];

export default function RecentJobs() {

    return (

        <div className="bg-white rounded-xl shadow-md p-6">

            <div className="flex items-center gap-2 mb-6">

                <Briefcase className="text-blue-600"/>

                <h2 className="text-xl font-semibold">
                    Recent Jobs
                </h2>

            </div>

            <div className="space-y-5">

                {jobs.map(job => (

                    <div
                        key={job.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition"
                    >

                        <h3 className="font-semibold">
                            {job.title}
                        </h3>

                        <p className="text-sm text-gray-500">
                            {job.company}
                        </p>

                        <div className="flex justify-between mt-3 text-sm text-gray-500">

                            <div className="flex items-center gap-1">

                                <MapPin size={15}/>

                                {job.location}

                            </div>

                            <div className="flex items-center gap-1">

                                <CalendarDays size={15}/>

                                {job.date}

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}
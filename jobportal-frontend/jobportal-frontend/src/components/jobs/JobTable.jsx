import {
    Pencil,
    Trash2,
    Eye
} from "lucide-react";
import JobStatusBadge from "./JobStatusBadge";
import { useNavigate } from "react-router-dom";

export default function JobTable({ jobs, loading }) {
     const navigate = useNavigate();

    if (loading) {
    return (
        <div className="bg-white rounded-xl shadow p-10 text-center">
            Loading Jobs...
        </div>
    );
}

if (!jobs || jobs.length === 0) {
    return (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
            No Jobs Found
        </div>
    );
}

    return(

        <div className="bg-white rounded-xl shadow">

            <table className="w-full">

                <thead>

                    <tr className="border-b bg-gray-50">

                        <th className="p-4 text-left">Job</th>

                        <th>Company</th>

                        <th>Location</th>

                        <th>Type</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        jobs.map(job=>(

                            <tr
                                key={job.id}
                                className="border-b hover:bg-gray-50"
                            >

                                <td className="p-4 font-semibold">

                                    {job.title}

                                </td>

                                <td>Client #{job.clientId}</td>

                                <td>-</td>

                                <td>{job.vacancyCount} Vacancies</td>

                                <td>

                                    <JobStatusBadge
                                        status={
                                          job.status === "OPEN"
                                         ? "Active"
                                          : job.status === "CLOSED"
                                          ? "Closed"
                                          : "Draft"
                                     }/>

                                </td>

                                <td>

                                    <div className="flex gap-3 justify-center">

                                        <Eye
    size={18}
    className="cursor-pointer text-blue-600"
    onClick={() => navigate(`/jobs/${job.id}`)}
/>

                                        <Pencil
                                            size={18}
                                            className="cursor-pointer text-orange-500"
                                        />

                                        <Trash2
                                            size={18}
                                            className="cursor-pointer text-red-600"
                                        />

                                    </div>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}
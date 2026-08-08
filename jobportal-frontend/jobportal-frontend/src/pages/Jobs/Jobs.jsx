import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobTable from "../../components/jobs/JobTable";
import { useEffect, useState } from "react";
import { getAllJobs } from "../../services/jobService";
export default function Jobs() {

    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

    const [type, setType] = useState("");





    useEffect(() => {

        loadJobs();

    }, []);

    const loadJobs = async () => {

        try {

            const data = await getAllJobs();

            setJobs(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

        const data = await getAllJobs();

console.log(data);

setJobs(data);

    };



    if (loading) {

    return (
        <div className="text-center p-10">
            Loading Jobs...
        </div>
    );

}



  

    return (

        <div>

            {/* Header */}

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-3xl font-bold">

                        Job Management

                    </h1>

                    <p className="text-gray-500">

                        Manage all available jobs

                    </p>

                </div>

                <button
                    onClick={() => navigate("/jobs/create")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2"
                >

                    <Plus size={18} />

                    Create Job

                </button>

            </div>

            {/* Filters */}

            <div className="bg-white rounded-xl shadow p-5 mb-6">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    {/* Search */}

                    <div className="relative">

                        <Search
                            className="absolute left-3 top-3 text-gray-400"
                            size={18}
                        />

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search jobs..."
                            className="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {/* Status */}

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    >

                        <option value="">All Status</option>

                        <option>Active</option>

                        <option>Draft</option>

                        <option>Closed</option>

                    </select>

                    {/* Type */}

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    >

                        <option value="">All Types</option>

                        <option>Full Time</option>

                        <option>Part Time</option>

                        <option>Remote</option>

                        <option>Hybrid</option>

                    </select>

                    <div className="flex items-center justify-end">

                        <span className="text-gray-500">

                            Showing

                            <span className="font-bold ml-2 text-black">
    {jobs.length} Jobs
</span>

                        </span>

                    </div>

                </div>

            </div>

            <JobTable jobs={jobs} loading={loading} />

        </div>

    );

}
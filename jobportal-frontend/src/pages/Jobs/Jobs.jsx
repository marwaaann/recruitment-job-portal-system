import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobTable from "../../components/jobs/JobTable";
import { useEffect, useState } from "react";
import { closeJob, getAllJobs } from "../../services/jobService";
import PageHeader from "../../components/ui/PageHeader";
import ListToolbar from "../../components/ui/ListToolbar";
export default function Jobs() {

    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

    const handleClose = async (id) => {
        if (!window.confirm("Close this job? It will remain stored but will no longer be open.")) return;
        try {
            await closeJob(id);
            setJobs((current) => current.map((job) => job.id === id ? { ...job, status: "CLOSED" } : job));
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Unable to close job.");
        }
    };

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        getAllJobs()
            .then((data) => mounted && setJobs(Array.isArray(data) ? data : []))
            .catch((error) => console.error("Failed to load jobs:", error))
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, []);

    const filteredJobs = jobs.filter((job) => {
        const jobStatus = String(job.status || "OPEN").toUpperCase();
        const matchesSearch = `${job.title || ""} ${job.description || ""}`.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !status || jobStatus === status;
        return matchesSearch && matchesStatus;
    });


    if (loading) {

    return (
        <div className="text-center p-10">
            Loading Jobs...
        </div>
    );

}



  

    return (

        <div>

            <PageHeader eyebrow="Recruitment workspace" title="Job management" description="Manage open positions and hiring demand." actionLabel="Create job" actionTo="/jobs/create" />

            <ListToolbar value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search jobs...">

                    {/* Status */}

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    >

                        <option value="">All Status</option>

                        <option value="OPEN">Open</option>

                        <option value="CLOSED">Closed</option>

                    </select>
                    <span className="text-sm text-slate-500">{filteredJobs.length} jobs</span>
            </ListToolbar>

            <JobTable jobs={filteredJobs} loading={loading} onClose={handleClose} />

        </div>

    );

}
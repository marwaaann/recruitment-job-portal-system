import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../../services/jobService";

export default function JobDetails() {

    const { id } = useParams();

    const [job, setJob] = useState(null);

    useEffect(() => {

        loadJob();

    }, []);

    const loadJob = async () => {

        const data = await getJobById(id);

        setJob(data);

    };

    if (!job) {

        return <h2>Loading...</h2>;

    }

    return (

        <div>

            <h1>{job.title}</h1>

            <p>{job.description}</p>

            <p>Status : {job.status}</p>

            <p>Client : {job.clientId}</p>

            <p>Vacancies : {job.vacancyCount}</p>

        </div>

    );

}
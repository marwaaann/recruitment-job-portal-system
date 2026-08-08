import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createJob } from "../../services/jobService";

export default function CreateJob() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

const [formData, setFormData] = useState({
    clientId: 1, // Temporary (later we'll fetch real clients)
    title: "",
    description: "",
    vacancyCount: "",
    company: "",
    department: "",
    location: "",
    employmentType: "Full Time",
    experience: "",
    salary: "",
    deadline: "",
    status: "Active",
    skills: "",
});





const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    });
};

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setLoading(true);

        await createJob({
            clientId: Number(formData.clientId),
            title: formData.title,
            description: formData.description,
            vacancyCount: Number(formData.vacancyCount),
        });

        alert("Job Created Successfully");

        navigate("/jobs");

    } catch (err) {

        console.error(err);

        alert("Failed to create Job");

    } finally {

        setLoading(false);

    }
};




    return (

        <div>

            {/* Header */}

            <div className="flex justify-between items-center mb-8">

                <div>

                    <button
                        onClick={() => navigate("/jobs")}
                        className="flex items-center gap-2 text-blue-600 mb-3"
                    >
                        <ArrowLeft size={18} />
                        Back to Jobs
                    </button>

                    <h1 className="text-3xl font-bold">
                        Create New Job
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Fill in the details below to publish a new job.
                    </p>

                </div>

            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">

                <div className="grid grid-cols-2 gap-6">

                    <div>
                        <label className="font-medium">
                            Job Title
                        </label>

                        <input
    name="title"
    value={formData.title}
    onChange={handleChange}
    className="w-full mt-2 border rounded-lg p-3"
    placeholder="Java Developer"
/>
                    </div>

                    <div>
                        <label className="font-medium">
                            Company
                        </label>

                        <input
                            className="w-full mt-2 border rounded-lg p-3"
                            placeholder="Google"
                        />
                    </div>

                    <div>
                        <label className="font-medium">
                            Department
                        </label>

                        <input
                            className="w-full mt-2 border rounded-lg p-3"
                            placeholder="Engineering"
                        />
                    </div>

                    <div>
                        <label className="font-medium">
                            Location
                        </label>

                        <input
                            className="w-full mt-2 border rounded-lg p-3"
                            placeholder="Bangalore"
                        />
                    </div>

                    <div>
                        <label className="font-medium">
                            Employment Type
                        </label>

                        <select className="w-full mt-2 border rounded-lg p-3">

                            <option>Full Time</option>

                            <option>Part Time</option>

                            <option>Remote</option>

                            <option>Hybrid</option>

                        </select>

                    </div>

                    <div>

                        <label className="font-medium">
                            Experience
                        </label>

                        <input
                            className="w-full mt-2 border rounded-lg p-3"
                            placeholder="2-5 Years"
                        />

                    </div>

                    <div>

                        <label className="font-medium">
                            Salary
                        </label>

                        <input
                            className="w-full mt-2 border rounded-lg p-3"
                            placeholder="₹10 LPA"
                        />

                    </div>

                    <div>

                        <label className="font-medium">
                            Vacancies
                        </label>

                        <input
    type="number"
    name="vacancyCount"
    value={formData.vacancyCount}
    onChange={handleChange}
    className="w-full mt-2 border rounded-lg p-3"
    placeholder="5"
/>

                    </div>

                    <div>

                        <label className="font-medium">
                            Deadline
                        </label>

                        <input
                            type="date"
                            className="w-full mt-2 border rounded-lg p-3"
                        />

                    </div>

                    <div>

                        <label className="font-medium">
                            Status
                        </label>

                        <select className="w-full mt-2 border rounded-lg p-3">

                            <option>Active</option>

                            <option>Draft</option>

                            <option>Closed</option>

                        </select>

                    </div>

                </div>

                <div className="mt-6">

                    <label className="font-medium">
                        Job Description
                    </label>

                    <textarea
    rows="6"
    name="description"
    value={formData.description}
    onChange={handleChange}
    className="w-full mt-2 border rounded-lg p-3"
    placeholder="Enter detailed job description..."
/>

                </div>

                <div className="mt-6">

                    <label className="font-medium">
                        Required Skills
                    </label>

                    <textarea
                        rows="4"
                        className="w-full mt-2 border rounded-lg p-3"
                        placeholder="Java, Spring Boot, PostgreSQL..."
                    />

                </div>

                <div className="flex justify-end gap-4 mt-8">

                    <button
                        type="button"
                        onClick={() => navigate("/jobs")}
                        className="px-6 py-3 rounded-lg border"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
                    >
                        {loading ? "Publishing..." : "Publish Job"}
                    </button>

                </div>

            </form>

        </div>

    );

}
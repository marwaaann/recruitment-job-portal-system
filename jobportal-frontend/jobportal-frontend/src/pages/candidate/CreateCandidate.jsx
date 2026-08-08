import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { createCandidate } from "../../services/candidateService";

export default function CreateCandidate() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({

        fullName: "",
        email: "",
        phoneNormalized: "",
        passportNumber: "",
        passportHash: "",
        dob: "",
        nationality: "",
        experience: "",
        education: "",
        noticePeriod: "30 Days",

        

        partnerId: ""

    });

    const handleChange = (e) => {

        setFormData({

            ...formData,
            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !formData.fullName ||
            !formData.email ||
            !formData.phoneNormalized ||
            !formData.passportNumber
        ) {

            alert("Please fill all required fields.");
            return;

        }

        try {

            setLoading(true);

            await createCandidate(formData);

            alert("Candidate created successfully!");

            navigate("/candidates");

        } catch (error) {

            console.error(error);

            alert("Unable to create candidate.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="max-w-5xl mx-auto">

            {/* Header */}

            <div className="flex items-center justify-between mb-8">

                <div>

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-blue-600 mb-3"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <h1 className="text-4xl font-bold">
                        Create Candidate
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Register a new candidate into the Job Portal.
                    </p>

                </div>

            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-lg p-8"
            >

                {/* Personal Information */}

<div className="mb-10">

    <h2 className="text-2xl font-semibold mb-6 border-b pb-3">
        Personal Information
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Full Name */}

        <div>

            <label className="block mb-2 font-medium">
                Full Name *
            </label>

            <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
            />

        </div>

        {/* Email */}

        <div>

            <label className="block mb-2 font-medium">
                Email *
            </label>

            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
            />

        </div>

        {/* Phone */}

        <div>

            <label className="block mb-2 font-medium">
                Phone *
            </label>

            <input
                type="text"
                name="phoneNormalized"
                value={formData.phoneNormalized}
                onChange={handleChange}
                placeholder="+919876543210"
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
            />

        </div>

        {/* Passport Number */}

        <div>

            <label className="block mb-2 font-medium">
                Passport Number *
            </label>

            <input
                type="text"
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleChange}
                placeholder="A12345678"
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
            />

        </div>

        {/* Passport Hash */}

        <div>

            <label className="block mb-2 font-medium">
                Passport Hash
            </label>

            <input
                type="text"
                name="passportHash"
                value={formData.passportHash}
                onChange={handleChange}
                placeholder="hash123456"
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

        </div>

        {/* DOB */}

        <div>

            <label className="block mb-2 font-medium">
                Date of Birth
            </label>

            <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

        </div>

        {/* Nationality */}

        <div className="md:col-span-2">

            <label className="block mb-2 font-medium">
                Nationality
            </label>

            <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                placeholder="Indian"
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

        </div>

    </div>

</div>

{/* Professional Information */}

<div>

    <h2 className="text-2xl font-semibold mb-6 border-b pb-3">
        Professional Information
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Experience */}

        <div>

            <label className="block mb-2 font-medium">
                Experience
            </label>

            <textarea
                name="experience"
                rows="4"
                value={formData.experience}
                onChange={handleChange}
                placeholder="3 years Java Developer..."
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

        </div>

        {/* Education */}

        <div>

            <label className="block mb-2 font-medium">
                Education
            </label>

            <textarea
                name="education"
                rows="4"
                value={formData.education}
                onChange={handleChange}
                placeholder="B.Tech Computer Science"
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

        </div>

        {/* Notice Period */}

        <div>

            <label className="block mb-2 font-medium">
                Notice Period
            </label>

            <select
                name="noticePeriod"
                value={formData.noticePeriod}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            >

                <option>Immediate</option>
                <option>15 Days</option>
                <option>30 Days</option>
                <option>45 Days</option>
                <option>60 Days</option>
                <option>90 Days</option>

            </select>

        </div>


        <div>

    <label className="block mb-2 font-medium">
        Partner ID
    </label>

    <input
        type="number"
        name="partnerId"
        value={formData.partnerId}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
    />

</div>








    </div>

</div>

{/* Buttons */}

<div className="flex justify-end gap-4 mt-10 border-t pt-6">

    <button
        type="button"
        onClick={() => navigate("/candidates")}
        className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100"
    >
        Cancel
    </button>

    <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
    >

        {loading ? "Creating..." : "Create Candidate"}

    </button>

</div>

</form>

</div>

);
}

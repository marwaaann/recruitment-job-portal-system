import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getCandidateById,
    updateCandidate,
} from "../../services/candidateService";

export default function EditCandidate() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

    });

    useEffect(() => {
        loadCandidate();
    }, []);

    const loadCandidate = async () => {

        try {

            const candidate = await getCandidateById(id);

            setFormData({

                fullName: candidate.fullName || "",
                email: candidate.email || "",
                phoneNormalized: candidate.phoneNormalized || "",
                passportNumber: candidate.passportNumber || "",
                passportHash: candidate.passportHash || "",
                dob: candidate.dob || "",
                nationality: candidate.nationality || "",

                experience: candidate.experience || "",
                education: candidate.education || "",

                noticePeriod:
                    candidate.customFields
                        ? JSON.parse(candidate.customFields).noticePeriod
                        : "30 Days",

            });

        } catch (error) {

            console.error(error);
            alert("Unable to load candidate.");

        } finally {

            setLoading(false);

        }

    };

    const handleChange = (e) => {

        setFormData({

            ...formData,
            [e.target.name]: e.target.value,

        });

    };


    const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        setSaving(true);

        await updateCandidate(id, {

            fullName: formData.fullName,
            email: formData.email,
            phoneNormalized: formData.phoneNormalized,
            passportNumber: formData.passportNumber,
            passportHash: formData.passportHash,
            dob: formData.dob,
            nationality: formData.nationality,
            experience: formData.experience,
            education: formData.education,

            customFields: JSON.stringify({
                noticePeriod: formData.noticePeriod,
            }),

        });

        alert("Candidate Updated Successfully!");

        navigate("/candidates");

    } catch (error) {

        console.error(error);

        alert("Failed to update candidate.");

    } finally {

        setSaving(false);

    }

};

    if (loading) {

        return (
            <div className="p-10 text-xl font-semibold">
                Loading Candidate...
            </div>
        );

    }



    return (

<div className="max-w-5xl mx-auto py-8">

    <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:text-blue-800 mb-6"
    >
        ← Back
    </button>

    <div className="bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-4xl font-bold">
            Edit Candidate
        </h1>

        <p className="text-gray-500 mb-8">
            Update Candidate Information
        </p>

        {/* Personal Information */}

        <h2 className="text-2xl font-semibold mb-4">
            Personal Information
        </h2>

        <div className="grid grid-cols-2 gap-6">

            <div>

                <label className="block mb-2">
                    Full Name *
                </label>

                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                />

            </div>

            <div>

                <label className="block mb-2">
                    Email *
                </label>

                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                />

            </div>

            <div>

                <label className="block mb-2">
                    Phone
                </label>

                <input
                    type="text"
                    name="phoneNormalized"
                    value={formData.phoneNormalized}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                />

            </div>

            <div>

                <label className="block mb-2">
                    Passport Number
                </label>

                <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                />

            </div>

            <div>

                <label className="block mb-2">
                    Passport Hash
                </label>

                <input
                    type="text"
                    name="passportHash"
                    value={formData.passportHash}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                />

            </div>

            <div>

                <label className="block mb-2">
                    Date of Birth
                </label>

                <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                />

            </div>

            <div className="col-span-2">

                <label className="block mb-2">
                    Nationality
                </label>

                <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                />

            </div>

        </div>

        {/* Professional Information */}

        <h2 className="text-2xl font-semibold mt-10 mb-4">
            Professional Information
        </h2>

        <div className="grid grid-cols-2 gap-6">

            <div>

                <label className="block mb-2">
                    Experience
                </label>

                <textarea
                    rows={4}
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                />

            </div>

            <div>

                <label className="block mb-2">
                    Education
                </label>

                <textarea
                    rows={4}
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                />

            </div>

            <div>

                <label className="block mb-2">
                    Notice Period
                </label>

                <select
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                >
                    <option>Immediate</option>
                    <option>15 Days</option>
                    <option>30 Days</option>
                    <option>45 Days</option>
                    <option>60 Days</option>
                    <option>90 Days</option>
                </select>

            </div>

        </div>

        <div className="flex justify-end gap-4 mt-10">

            <button
                onClick={() => navigate("/candidates")}
                className="px-6 py-3 rounded-lg border"
            >
                Cancel
            </button>

            <button
    onClick={handleSubmit}
    disabled={saving}
    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
>
    {saving ? "Updating..." : "Update Candidate"}
</button>

        </div>

    </div>

</div>

    );
}
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, User, Globe, Calendar } from "lucide-react";
import { getCandidateById } from "../../services/candidateService";

export default function CandidateDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCandidate();
    }, []);

    const loadCandidate = async () => {
        try {
            const data = await getCandidateById(id);
            setCandidate(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-xl font-semibold">
                Loading Candidate...
            </div>
        );
    }

    if (!candidate) {
        return (
            <div className="p-8">
                Candidate not found.
            </div>
        );
    }

    return (
        <div className="p-8">

            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-blue-600 mb-6"
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <div className="bg-white rounded-xl shadow p-8">

                <div className="flex items-center gap-5 mb-8">

                    <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
                        {candidate.fullName?.charAt(0)}
                    </div>

                    <div>

                        <h1 className="text-3xl font-bold">
                            {candidate.fullName}
                        </h1>

                        <p className="text-gray-500">
                            Candidate Profile
                        </p>

                    </div>

                </div>

                <div className="grid grid-cols-2 gap-8">

                    <div>

                        <h3 className="font-bold mb-4 text-lg">
                            Personal Information
                        </h3>

                        <div className="space-y-4">

                            <p className="flex items-center gap-3">
                                <Mail size={18}/>
                                {candidate.email}
                            </p>

                            <p className="flex items-center gap-3">
                                <Phone size={18}/>
                                {candidate.phoneNormalized}
                            </p>

                            <p className="flex items-center gap-3">
                                <User size={18}/>
                                Passport :
                                {candidate.passportNumber}
                            </p>

                            <p className="flex items-center gap-3">
                                <Globe size={18}/>
                                {candidate.nationality}
                            </p>

                            <p className="flex items-center gap-3">
                                <Calendar size={18}/>
                                {candidate.dob}
                            </p>

                        </div>

                    </div>

                    <div>

                        <h3 className="font-bold mb-4 text-lg">
                            Professional Information
                        </h3>

                        <div className="space-y-4">

                            <p>
                                <strong>Experience :</strong>
                                <br />
                                {candidate.experience}
                            </p>

                            <p>
                                <strong>Education :</strong>
                                <br />
                                {candidate.education}
                            </p>

                            <p>
                                <strong>Status :</strong>
                                <br />
                                {candidate.canonicalStatus}
                            </p>

                            <p>
                                <strong>Created By User :</strong>
                                <br />
                                {candidate.createdByUserId}
                            </p>

                            <p>
                                <strong>Partner :</strong>
                                <br />
                                {candidate.createdByPartnerId ?? "-"}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}
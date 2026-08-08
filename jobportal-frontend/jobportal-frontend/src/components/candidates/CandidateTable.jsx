import { Eye, Pencil, Trash2 } from "lucide-react";
import CandidateStatusBadge from "./CandidateStatusBadge";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { RotateCcw } from "lucide-react";
export default function CandidateTable({

    candidates,

    onDelete,

    onRestore,

    showDeleted

}) {

    const navigate = useNavigate();

    if (!candidates || candidates.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
                No Candidates Found
            </div>
        );
    }

    return (

        <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full">

                <thead>

                    <tr className="bg-gray-50 border-b">

                        <th className="p-4 text-left">Candidate</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Experience</th>
                        <th>Nationality</th>
                        <th>Status</th>
                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {candidates.map((candidate) => (

                        <tr
                            key={candidate.id}
                            className="border-b hover:bg-gray-50"
                        >

                            <td className="p-4 font-semibold">
                                {candidate.fullName}
                            </td>

                            <td>{candidate.email}</td>

                            <td>{candidate.phoneNormalized}</td>

                            <td>{candidate.experience}</td>

                            <td>{candidate.nationality}</td>

                            <td>

                                <CandidateStatusBadge
                                    status={candidate.canonicalStatus}
                                />

                            </td>

                           <td>

    <div className="flex justify-center gap-3 items-center">

        {

            showDeleted ? (

                <button

                    onClick={() => onRestore(candidate.id)}

                    className="text-green-600 hover:text-green-800 font-semibold"

                >

                    Restore

                </button>

            ) : (

                <>

                    <Eye
                        size={18}
                        className="cursor-pointer text-blue-600"
                        onClick={() => navigate(`/candidates/${candidate.id}`)}
                    />

                    <Link to={`/candidates/edit/${candidate.id}`}>
                        <Pencil
                            size={16}
                            className="text-orange-500 hover:text-orange-700"
                        />
                    </Link>

                    <Trash2
                        size={18}
                        className="text-red-600 cursor-pointer hover:text-red-800"
                        onClick={() => onDelete(candidate.id)}
                    />

                </>

            )

        }

    </div>

</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}
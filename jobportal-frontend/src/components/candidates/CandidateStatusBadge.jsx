export default function CandidateStatusBadge({ status }) {

    const colors = {
        ACTIVE: "bg-green-100 text-green-700",
        DELETED: "bg-red-100 text-red-600",
        PENDING: "bg-yellow-100 text-yellow-700",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                colors[status] || "bg-gray-100 text-gray-700"
            }`}
        >
            {status}
        </span>
    );

}
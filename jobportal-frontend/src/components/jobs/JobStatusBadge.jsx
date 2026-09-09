export default function JobStatusBadge({ status }) {

    const labels = { OPEN: "OPEN", CLOSED: "CLOSED", PAUSED: "PAUSED" };
    const colors = {
        OPEN: "bg-green-100 text-green-700",
        CLOSED: "bg-red-100 text-red-700",
        PAUSED: "bg-amber-100 text-amber-700",
    };

    return (

        <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
                colors[status] || "bg-gray-100 text-gray-700"
            }`}
        >

            {labels[status] || status}

        </span>

    );

}
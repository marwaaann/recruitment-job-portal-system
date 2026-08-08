export default function JobStatusBadge({ status }) {

    const colors = {

        Active: "bg-green-100 text-green-700",

        Draft: "bg-yellow-100 text-yellow-700",

        Closed: "bg-red-100 text-red-700",

        Paused: "bg-blue-100 text-blue-700",

    };

    return (

        <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
                colors[status] || "bg-gray-100 text-gray-700"
            }`}
        >

            {status}

        </span>

    );

}
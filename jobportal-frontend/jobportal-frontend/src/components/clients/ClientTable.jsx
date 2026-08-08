import {
    Eye,
    Pencil,
    Trash2
} from "lucide-react";

export default function ClientTable({ clients }) {

    if (!clients || clients.length === 0) {

        return (

            <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">

                No Clients Found

            </div>

        );

    }

    return (

        <div className="bg-white rounded-xl shadow overflow-x-auto">

            <table className="w-full">

                <thead>

                    <tr className="border-b bg-gray-50">

                        <th className="p-4 text-left">
                            Client
                        </th>

                        <th>Email</th>

                        <th>Phone</th>

                        <th>Company</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        clients.map(client => (

                            <tr
                                key={client.id}
                                className="border-b hover:bg-gray-50"
                            >

                                <td className="p-4 font-semibold">

                                    {client.name || client.fullName || "-"}

                                </td>

                                <td>

                                    {client.email || "-"}

                                </td>

                                <td>

                                    {client.phone || "-"}

                                </td>

                                <td>

                                    {client.companyName || "-"}

                                </td>

                                <td>

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            client.isActive === false
                                                ? "bg-red-100 text-red-600"
                                                : "bg-green-100 text-green-600"
                                        }`}
                                    >

                                        {client.isActive === false ? "Inactive" : "Active"}

                                    </span>

                                </td>

                                <td>

                                    <div className="flex justify-center gap-3">

                                        <Eye
                                            size={18}
                                            className="cursor-pointer text-blue-600"
                                        />

                                        <Pencil
                                            size={18}
                                            className="cursor-pointer text-orange-500"
                                        />

                                        <Trash2
                                            size={18}
                                            className="cursor-pointer text-red-600"
                                        />

                                    </div>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}
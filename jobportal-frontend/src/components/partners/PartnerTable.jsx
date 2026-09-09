import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PartnerTable({

    partners,

    onDelete,

}) {

    const navigate = useNavigate();

    if (!partners.length) {

        return (

            <div className="bg-white rounded-xl shadow p-10 text-center">

                No Partners Found

            </div>

        );

    }

    return (

        <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full">

                <thead>

                    <tr className="border-b">

                        <th className="text-left p-4">Company</th>

                        <th className="text-left p-4">Contact Person</th>

                        <th className="text-left p-4">Email</th>

                        <th className="text-left p-4">Phone</th>

                        <th className="text-left p-4">Status</th>

                        <th className="text-center p-4">Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {partners.map((partner) => (

                        <tr

                            key={partner.id}

                            className="border-b hover:bg-gray-50"

                        >

                            <td className="p-4">

                                {partner.companyName}

                            </td>

                            <td className="p-4">

                                {partner.contactPerson}

                            </td>

                            <td className="p-4">

                                {partner.email}

                            </td>

                            <td className="p-4">

                                {partner.phone}

                            </td>

                            <td className="p-4">

                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        partner.active
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >

                                    {partner.active ? "ACTIVE" : "BLOCKED"}

                                </span>

                            </td>

                            <td className="p-4">

                                <div className="flex justify-center gap-4">

                                    <Eye

                                        size={16}

                                        className="table-action table-action-view"

                                        onClick={() =>

                                            navigate(`/partners/${partner.id}`)

                                        }

                                    />

                                    <Pencil

                                        size={16}

                                        className="table-action table-action-edit"

                                        onClick={() =>

                                            navigate(`/partners/edit/${partner.id}`)

                                        }

                                    />

                                    <Trash2

                                        size={16}

                                        className="table-action table-action-delete"

                                        onClick={() =>

                                            onDelete(partner.id)

                                        }

                                    />

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}
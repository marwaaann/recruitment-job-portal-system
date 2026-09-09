import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminTable({ admins, onDelete }) {
  const navigate = useNavigate();

  if (admins.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
        No Admins Found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-white">
          <tr className="border-b">
            <th className="text-left p-4 font-semibold">Name</th>
            <th className="text-left p-4 font-semibold">Email</th>
            <th className="text-left p-4 font-semibold">Role</th>
            <th className="text-left p-4 font-semibold">Status</th>
            <th className="text-right p-4 font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="p-4 font-medium">{admin.fullName}</td>

              <td className="p-4 text-gray-700">{admin.email}</td>

              <td className="p-4">{admin.role}</td>

              <td className="p-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  ACTIVE
                </span>
              </td>

              <td className="p-4">
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => navigate(`/admins/${admin.id}`)}
                    className="table-action table-action-view"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => navigate(`/admins/edit/${admin.id}`)}
                    className="table-action table-action-edit"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(admin.id)}
                    className="table-action table-action-delete"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
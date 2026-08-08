import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserTable({ users, onDelete }) {
  const navigate = useNavigate();

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
        No Users Found
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
          {users.map((user) => (
            <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="p-4 font-medium">{user.fullName}</td>
              <td className="p-4 text-gray-700">{user.email}</td>
              <td className="p-4">{user.role}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {user.active ? "ACTIVE" : "INACTIVE"}
                </span>
              </td>

              <td className="p-4">
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => navigate(`/users/${user.id}`)}
                    className="text-blue-600 hover:text-blue-800"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => navigate(`/users/edit/${user.id}`)}
                    className="text-orange-500 hover:text-orange-700"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(user.id)}
                    className="text-red-600 hover:text-red-800"
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
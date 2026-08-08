import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, deleteUser } from "../../services/userService";
import UserTable from "../../components/users/UserTable";

export default function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await deleteUser(id);
    await loadUsers();
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold">User Management</h1>
          <p className="text-gray-500">Manage all system users</p>
        </div>

        <button
          onClick={() => navigate("/users/create")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create User
        </button>
      </div>

      <UserTable users={users} onDelete={handleDelete} />
    </div>
  );
}
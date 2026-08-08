import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAdmins, deleteAdmin } from "../../services/adminService";
import AdminTable from "../../components/admins/AdminTable";

export default function Admins() {
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const data = await getAllAdmins();
      setAdmins(data.filter((a) => a.active));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this admin?")) return;

    await deleteAdmin(id);
    await loadAdmins();
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold">Admin Management</h1>
          <p className="text-gray-500">Manage all administrators</p>
        </div>

        <button
          onClick={() => navigate("/admins/create")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create Admin
        </button>
      </div>

      <AdminTable
        admins={admins}
        onDelete={handleDelete}
      />
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { getAllClients, deleteClient } from "../../services/clientService";

export default function Clients() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await getAllClients();
      setClients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this client?")) return;

    try {
      await deleteClient(id);
      loadClients();
    } catch (err) {
      console.error(err);
      alert("Unable to delete client");
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold">Client Management</h1>
          <p className="text-gray-500">Manage all registered clients</p>
        </div>

        <button
          onClick={() => navigate("/clients/create")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create Client
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Company</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{client.fullName}</td>
                <td className="p-4 text-gray-700">{client.email}</td>
                <td className="p-4">{client.phone}</td>
                <td className="p-4">{client.company}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    client.active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {client.active ? "ACTIVE" : "BLOCKED"}
                  </span>
                </td>

                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => navigate(`/clients/${client.id}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => navigate(`/clients/edit/${client.id}`)}
                      className="text-orange-500 hover:text-orange-700"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(client.id)}
                      className="text-red-500 hover:text-red-700"
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
    </div>
  );
}
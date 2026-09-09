import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { getAllClients, deleteClient } from "../../services/clientService";
import PageHeader from "../../components/ui/PageHeader";
import ListToolbar from "../../components/ui/ListToolbar";

export default function Clients() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
      setClients((currentClients) =>
        currentClients.filter((client) => client.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Unable to delete client");
    }
  };

  if (loading) return <h2>Loading...</h2>;

  const visibleClients = clients.filter((client) => {
    if (client.active === false) return false;
    return `${client.fullName || ""} ${client.email || ""} ${client.phone || ""} ${client.company || ""}`.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <PageHeader eyebrow="Accounts" title="Client management" description="Manage registered client accounts." actionLabel="Create client" actionTo="/clients/create" />
      <ListToolbar value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search clients by name, email, or company..." />

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
            {visibleClients.map((client) => (
              <tr key={client.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{client.fullName || "-"}</td>
                <td className="p-4 text-gray-700">{client.email || "-"}</td>
                <td className="p-4">{client.phone || "-"}</td>
                <td className="p-4">{client.company || "-"}</td>
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
                      className="table-action table-action-view"
                      title="View client"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => navigate(`/clients/edit/${client.id}`)}
                      className="table-action table-action-edit"
                      title="Edit client"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(client.id)}
                      className="table-action table-action-delete"
                      title="Delete client"
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAdmins, deleteAdmin } from "../../services/adminService";
import AdminTable from "../../components/admins/AdminTable";
import PageHeader from "../../components/ui/PageHeader";
import ListToolbar from "../../components/ui/ListToolbar";

export default function Admins() {
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const visibleAdmins = admins.filter((admin) => `${admin.fullName || ""} ${admin.email || ""}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHeader eyebrow="Access control" title="Admin management" description="Manage administrators and their access." actionLabel="Create admin" actionTo="/admins/create" />
      <ListToolbar value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search administrators..." />

      <AdminTable
        admins={visibleAdmins}
        onDelete={handleDelete}
      />
    </div>
  );
}
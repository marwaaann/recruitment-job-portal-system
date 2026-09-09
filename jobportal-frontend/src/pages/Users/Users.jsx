import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, deleteUser } from "../../services/userService";
import UserTable from "../../components/users/UserTable";
import PageHeader from "../../components/ui/PageHeader";
import ListToolbar from "../../components/ui/ListToolbar";

export default function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const visibleUsers = users.filter((user) => `${user.fullName || ""} ${user.email || ""} ${user.role || ""}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHeader eyebrow="People" title="User management" description="Manage all system users." actionLabel="Create user" actionTo="/users/create" />
      <ListToolbar value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users by name, email, or role..." />

      <UserTable users={visibleUsers} onDelete={handleDelete} />
    </div>
  );
}
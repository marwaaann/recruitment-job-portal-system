import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../../services/userService";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "ADMIN",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const data = await getUserById(id);

      setForm({
        fullName: data.fullName || "",
        email: data.email || "",
        role: data.role || "ADMIN",
      });
    } catch (err) {
      console.error(err);
      alert("Unable to load user.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateUser(id, form);

      alert("User updated successfully.");

      navigate(`/users/${id}`);
    } catch (err) {
      console.error(err);
      alert("Unable to update user.");
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
      <h1 className="text-4xl font-bold mb-2">Edit User</h1>
      <p className="text-gray-500 mb-8">Update user information</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-2">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">Role *</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="ADMIN">ADMIN</option>
            <option value="PARTNER">PARTNER</option>
            <option value="CLIENT">CLIENT</option>
            <option value="CANDIDATE">CANDIDATE</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Update User
          </button>

          <button
            type="button"
            onClick={() => navigate(`/users/${id}`)}
            className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
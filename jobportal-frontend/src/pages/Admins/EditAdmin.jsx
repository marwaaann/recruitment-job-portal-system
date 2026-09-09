import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminById, updateAdmin } from "../../services/adminService";

export default function EditAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdmin();
  }, [id]);

  const loadAdmin = async () => {
    try {
      const data = await getAdminById(id);

      setForm({
        fullName: data.fullName || "",
        email: data.email || "",
        password: "",
      });
    } catch (err) {
      console.error(err);
      alert("Unable to load admin.");
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
      await updateAdmin(id, form);

      alert("Admin updated successfully.");

      navigate(`/admins/${id}`);
    } catch (err) {
      console.error(err);
      alert("Unable to update admin.");
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
      <h1 className="text-4xl font-bold mb-2">Edit Admin</h1>
      <p className="text-gray-500 mb-8">Update administrator information</p>

      <form onSubmit={handleSubmit} className="page-form space-y-6">
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

        <div>
          <label className="block font-medium mb-2">New Password (optional)</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Update Admin
          </button>

          <button
            type="button"
            onClick={() => navigate(`/admins/${id}`)}
            className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
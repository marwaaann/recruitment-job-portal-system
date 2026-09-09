import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAdmin } from "../../services/adminService";

export default function CreateAdmin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createAdmin(form);

      alert("Admin created successfully");

      navigate("/admins");
    } catch (err) {
      console.error(err);
      alert("Unable to create admin");
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">Create Admin</h1>

      <form onSubmit={handleSubmit} className="page-form space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Admin
        </button>
      </form>
    </div>
  );
}
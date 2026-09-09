import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClientById, updateClient } from "../../services/clientService";

export default function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    company: "",
    address: "",
  });

  useEffect(() => {
    loadClient();
  }, []);

  const loadClient = async () => {
    const data = await getClientById(id);

    setForm({
      fullName: data.fullName || "",
      email: data.email || "",
      password: "",
      phone: data.phone || "",
      company: data.company || "",
      address: data.address || "",
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateClient(id, form);
      alert("Client updated successfully");
      navigate("/clients");
    } catch (err) {
      console.error(err);
      alert("Unable to update client");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
      <h1 className="text-4xl font-bold mb-2">Edit Client</h1>
      <p className="text-gray-500 mb-8">Update client information</p>

      <form onSubmit={handleSubmit} className="page-form space-y-6">
        <div className="grid md:grid-cols-2 gap-5">
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Leave blank to keep same password"
            className="border rounded-lg px-4 py-3"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
          />
        </div>

        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />

        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          rows={4}
          className="w-full border rounded-lg px-4 py-3"
        />

        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Update Client
        </button>
      </form>
    </div>
  );
}
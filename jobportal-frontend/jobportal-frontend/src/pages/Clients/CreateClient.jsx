import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "../../services/clientService";

export default function CreateClient() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    company: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createClient(form);
      alert("Client created successfully");
      navigate("/clients");
    } catch (err) {
      console.error(err);
      alert("Unable to create client");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
      <h1 className="text-4xl font-bold mb-2">Create Client</h1>
      <p className="text-gray-500 mb-8">Add a new client account</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2 font-medium">Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Company</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Create Client
        </button>
      </form>
    </div>
  );
}
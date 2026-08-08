import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Mail, Phone, Building2, MapPin } from "lucide-react";
import { getClientById } from "../../services/clientService";

export default function ClientDetails() {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    loadClient();
  }, []);

  const loadClient = async () => {
    const data = await getClientById(id);
    setClient(data);
  };

  if (!client) return <h2>Loading...</h2>;

  return (
    <div className="space-y-6">
      <Link to="/clients" className="text-blue-600 hover:underline">
        ← Back
      </Link>

      <div className="bg-white rounded-2xl shadow p-8">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            {client.fullName?.charAt(0)}
          </div>

          <div>
            <h1 className="text-3xl font-bold">{client.fullName}</h1>
            <p className="text-gray-500">Client Profile</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">Contact Information</h2>

            <div className="flex items-center gap-3">
              <Mail size={20} />
              <span>{client.email}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={20} />
              <span>{client.phone}</span>
            </div>
          </div>

          <div className="space-y-5">
            <h2 className="text-xl font-semibold">Company Information</h2>

            <div className="flex items-center gap-3">
              <Building2 size={20} />
              <span>{client.company}</span>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={20} className="mt-1" />
              <span>{client.address}</span>
            </div>

            <div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                client.active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {client.active ? "ACTIVE" : "BLOCKED"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
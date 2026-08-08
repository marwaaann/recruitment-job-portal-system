import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminById } from "../../services/adminService";
import { Mail, Shield, CheckCircle, User } from "lucide-react";

export default function AdminDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdmin();
  }, [id]);

  const loadAdmin = async () => {
    try {
      const data = await getAdminById(id);
      setAdmin(data);
    } catch (err) {
      console.error(err);
      alert("Unable to load admin details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2>Loading...</h2>;

  if (!admin) return <h2>Admin not found</h2>;

  return (
    <div>
      <button
        onClick={() => navigate("/admins")}
        className="text-blue-600 hover:underline mb-6 flex items-center gap-2"
      >
        ← Back
      </button>

      <div className="bg-white rounded-2xl shadow p-8">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            {admin.fullName?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-3xl font-bold">{admin.fullName}</h1>
            <p className="text-gray-500">Administrator Profile</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <span>{admin.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <span>{admin.fullName}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>

            <div className="space-y-5">
              <div>
                <p className="font-semibold flex items-center gap-2 mb-1">
                  <Shield className="w-5 h-5 text-gray-500" />
                  Role
                </p>
                <p className="text-gray-700 ml-7">{admin.role}</p>
              </div>

              <div>
                <p className="font-semibold flex items-center gap-2 mb-1">
                  <CheckCircle className="w-5 h-5 text-gray-500" />
                  Status
                </p>
                <span className="inline-block ml-7 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {admin.active ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
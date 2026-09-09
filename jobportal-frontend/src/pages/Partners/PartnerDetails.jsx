import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPartnerById } from "../../services/partnerService";

export default function PartnerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [partner, setPartner] = useState(null);

  useEffect(() => {
    loadPartner();
  }, []);

  const loadPartner = async () => {
    try {
      const data = await getPartnerById(id);
      setPartner(data);
    } catch (err) {
      alert("Unable to load partner.");
    }
  };

  if (!partner) return <h2>Loading...</h2>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Partner Details</h1>

        <button
          onClick={() => navigate("/partners")}
          className="border px-4 py-2 rounded-lg hover:bg-gray-100"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-500 text-sm">Company Name</p>
          <p className="font-semibold text-lg">{partner.companyName}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Contact Person</p>
          <p className="font-semibold text-lg">{partner.contactPerson}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Email</p>
          <p className="font-semibold text-lg">{partner.email}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Phone</p>
          <p className="font-semibold text-lg">{partner.phone}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Website</p>
          <a
            href={partner.website}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            {partner.website || "-"}
          </a>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Status</p>
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
              partner.active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {partner.active ? "ACTIVE" : "BLOCKED"}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-gray-500 text-sm mb-2">Address</p>
        <div className="border rounded-lg p-4 bg-gray-50">
          {partner.address || "-"}
        </div>
      </div>
    </div>
  );
}
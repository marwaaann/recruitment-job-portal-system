import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAllPartners,
    deletePartner,
} from "../../services/partnerService";

import PartnerTable from "../../components/partners/PartnerTable";
import PageHeader from "../../components/ui/PageHeader";
import ListToolbar from "../../components/ui/ListToolbar";

export default function Partners() {

    const navigate = useNavigate();

    const [partners, setPartners] = useState([]);

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const loadPartners = async () => {

        try {

            const data = await getAllPartners();

            setPartners(data);

        } catch (err) {

            console.error(err);

            alert("Unable to load partners.");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadPartners();

    }, []);

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this partner?")) {

            return;

        }

        try {

            await deletePartner(id);

            alert("Partner deleted successfully.");

            loadPartners();

        } catch (err) {

            console.error(err);

            alert("Unable to delete partner.");

        }

    };

    if (loading) {

        return <h2>Loading...</h2>;

    }

    const visiblePartners = partners.filter((partner) => `${partner.companyName || ""} ${partner.contactPerson || ""} ${partner.email || ""} ${partner.phone || ""}`.toLowerCase().includes(search.toLowerCase()));

    return (

        <div>

            <PageHeader eyebrow="Recruiting network" title="Partner management" description="Manage registered recruitment partners." actionLabel="Create partner" actionTo="/partners/create" />
            <ListToolbar value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search partners by company, contact, or email..." />

            {/* Legacy page header replaced by the shared header above. */}
            <div className="hidden">

                <div>

                    <h1 className="text-4xl font-bold">

                        Partner Management

                    </h1>

                    <p className="text-gray-500">

                        Manage all registered partners

                    </p>

                </div>

                <button

                    onClick={() => navigate("/partners/create")}

                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"

                >

                    + Create Partner

                </button>

            </div>

            <PartnerTable

                partners={visiblePartners}

                onDelete={handleDelete}

            />

        </div>

    );

}
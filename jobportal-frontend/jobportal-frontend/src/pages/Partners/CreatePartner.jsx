import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPartner } from "../../services/partnerService";


export default function CreatePartner() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        companyName: "",

        contactPerson: "",

        email: "",

        password: "",

        phone: "",

        website: "",

        address: ""

    });

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await createPartner(form);

            alert("Partner created successfully.");

            navigate("/partners");

        } catch (err) {

            console.error(err);

            alert("Unable to create partner.");

        }

    };

    return (

        <div className="max-w-5xl mx-auto">

            <h1 className="text-4xl font-bold mb-2">

                Create Partner

            </h1>

            <p className="text-gray-500 mb-8">

                Register a new recruitment partner

            </p>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow p-8 grid grid-cols-2 gap-6"
            >

                <div>

                    <label>Company Name</label>

                    <input

                        name="companyName"

                        value={form.companyName}

                        onChange={handleChange}

                        className="w-full border rounded-lg px-4 py-2 mt-1"

                        required

                    />

                </div>

                <div>

                    <label>Contact Person</label>

                    <input

                        name="contactPerson"

                        value={form.contactPerson}

                        onChange={handleChange}

                        className="w-full border rounded-lg px-4 py-2 mt-1"

                        required

                    />

                </div>

                <div>

                    <label>Email</label>

                    <input

                        type="email"

                        name="email"

                        value={form.email}

                        onChange={handleChange}

                        className="w-full border rounded-lg px-4 py-2 mt-1"

                        required

                    />

                </div>

                <div>

                    <label>Password</label>

                    <input

                        type="password"

                        name="password"

                        value={form.password}

                        onChange={handleChange}

                        className="w-full border rounded-lg px-4 py-2 mt-1"

                        required

                    />

                </div>

                <div>

                    <label>Phone</label>

                    <input

                        name="phone"

                        value={form.phone}

                        onChange={handleChange}

                        className="w-full border rounded-lg px-4 py-2 mt-1"

                    />

                </div>

                <div>

                    <label>Website</label>

                    <input

                        name="website"

                        value={form.website}

                        onChange={handleChange}

                        className="w-full border rounded-lg px-4 py-2 mt-1"

                    />

                </div>

                <div className="col-span-2">

                    <label>Address</label>

                    <textarea

                        name="address"

                        value={form.address}

                        onChange={handleChange}

                        rows="4"

                        className="w-full border rounded-lg px-4 py-2 mt-1"

                    />

                </div>

                <div className="col-span-2 flex justify-end gap-4">

                    <button

                        type="button"

                        onClick={() => navigate("/partners")}

                        className="px-6 py-2 border rounded-lg"

                    >

                        Cancel

                    </button>

                    <button

                        type="submit"

                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"

                    >

                        Create Partner

                    </button>

                </div>

            </form>

        </div>

    );

}
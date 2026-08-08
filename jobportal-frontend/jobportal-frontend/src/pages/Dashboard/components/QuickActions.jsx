import { Link } from "react-router-dom";

export default function QuickActions() {

    return (

        <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-semibold mb-5">

                Quick Actions

            </h2>

            <div className="grid grid-cols-4 gap-4">

                <Link
                    to="/jobs/create"
                    className="bg-blue-600 text-white rounded-xl p-4 text-center"
                >
                    Create Job
                </Link>

                <Link
                    to="/candidate/create"
                    className="bg-green-600 text-white rounded-xl p-4 text-center"
                >
                    Add Candidate
                </Link>

                <Link
                    to="/client/create"
                    className="bg-orange-500 text-white rounded-xl p-4 text-center"
                >
                    Add Client
                </Link>

                <Link
                    to="/partner/create"
                    className="bg-purple-600 text-white rounded-xl p-4 text-center"
                >
                    Add Partner
                </Link>

            </div>

        </div>

    );

}
import useAuth from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";

export default function Navbar() {

    const { user } = useAuth();
    const location = useLocation();
    const pageTitle = location.pathname.split("/")[1] || "dashboard";

    return (

        <header className="bg-white h-20 shadow-sm flex justify-between items-center px-8">

            <div>

                <h2 className="text-2xl font-bold">

                    {pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)}

                </h2>

            </div>

            <div className="flex items-center gap-5">

                <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">

                        {user?.fullName?.charAt(0).toUpperCase()}

                    </div>

                    <div>

                        <p className="font-semibold">

                            {user?.fullName}

                        </p>

                        <small className="text-gray-500">

                            {user?.role?.replace("_", " ")}

                        </small>

                    </div>

                </div>

            </div>

        </header>

    );

}
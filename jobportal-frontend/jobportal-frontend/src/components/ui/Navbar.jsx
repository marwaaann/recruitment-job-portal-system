import { Bell } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {

    const { user } = useAuth();

    return (

        <header className="bg-white h-20 shadow-sm flex justify-between items-center px-8">

            <div>

                <h2 className="text-2xl font-bold">

                    Dashboard

                </h2>

            </div>

            <div className="flex items-center gap-5">

                <button className="relative">

                    <Bell size={22} />

                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>

                </button>

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
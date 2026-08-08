import { Bell } from "lucide-react";
import useAuth from "../../../hooks/useAuth";

export default function DashboardHeader() {

    const { user } = useAuth();

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";

    return (

        <div className="flex justify-between items-center mb-8">

            <div>

                <h1 className="text-3xl font-bold">

                    {greeting}, {user?.fullName} 👋

                </h1>

                <p className="text-gray-500 mt-1">

                    Welcome to your Job Portal Dashboard

                </p>

            </div>

            <button className="bg-white shadow rounded-xl p-3">

                <Bell size={20} />

            </button>

        </div>

    );

}
import {
    User,
    Mail,
    Briefcase
} from "lucide-react";

const candidates = [
    {
        id: 1,
        name: "Marwan Shafi",
        email: "marwan@gmail.com",
        skill: "Java Developer"
    },
    {
        id: 2,
        name: "Rahul Sharma",
        email: "rahul@gmail.com",
        skill: "React Developer"
    },
    {
        id: 3,
        name: "Sneha Reddy",
        email: "sneha@gmail.com",
        skill: "UI/UX Designer"
    }
];

export default function RecentCandidates() {

    return (

        <div className="bg-white rounded-xl shadow-md p-6">

            <div className="flex items-center gap-2 mb-6">

                <User className="text-green-600"/>

                <h2 className="text-xl font-semibold">
                    Recent Candidates
                </h2>

            </div>

            <div className="space-y-5">

                {candidates.map((candidate) => (

                    <div
                        key={candidate.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition"
                    >

                        <h3 className="font-semibold">
                            {candidate.name}
                        </h3>

                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">

                            <Mail size={15}/>

                            {candidate.email}

                        </div>

                        <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">

                            <Briefcase size={15}/>

                            {candidate.skill}

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}
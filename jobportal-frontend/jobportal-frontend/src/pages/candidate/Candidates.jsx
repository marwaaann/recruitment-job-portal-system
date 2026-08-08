import { useEffect, useState } from "react";
import {
    getCandidatesPage,
    searchCandidatesPage,
    deleteCandidate,
    getDeletedCandidates,
    restoreCandidate
} from "../../services/candidateService";

import CandidateTable from "../../components/candidates/CandidateTable";
import { useNavigate } from "react-router-dom";

export default function Candidates() {

    const navigate = useNavigate();

    const [candidates, setCandidates] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [showDeleted, setShowDeleted] = useState(false);

    const [page, setPage] = useState(0);

    const [sortBy, setSortBy] = useState("createdAt");

const [direction, setDirection] = useState("desc");

    

const [size, setSize] = useState(10);

const [totalPages, setTotalPages] = useState(0);

const [totalElements, setTotalElements] = useState(0);

   useEffect(() => {

    loadCandidates(page, size);

}, [page, size, search, showDeleted, sortBy, direction]);
const loadCandidates = async (
    currentPage = page,
    currentSize = size
) => {

    try {

        let data;

        if (showDeleted) {

    data = await getDeletedCandidates(
        currentPage,
        currentSize,
        sortBy,
        direction
    );

} else if (search.trim() !== "") {

            data = await searchCandidatesPage(
                search,
                 currentPage,
                 currentSize,
                 sortBy,
                 direction
            );

        } else {

            data = await getCandidatesPage(
                currentPage,
                currentSize,
                sortBy,
                direction
            );

        }

        setCandidates(data.content);

        setTotalPages(data.totalPages);

        setTotalElements(data.totalElements);

        setPage(data.number);

    } finally {

        setLoading(false);

    }

};


  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this candidate?"
    );

    if (!confirmDelete) return;

    try {

        await deleteCandidate(id);

        alert("Candidate deleted successfully.");

        await loadCandidates(page, size);

    } catch (err) {

        console.error(err);

        alert("Unable to delete candidate.");

    }

};



const handleRestore = async (id) => {

    if (!window.confirm("Restore this candidate?")) {

        return;

    }

    try {

        await restoreCandidate(id);

        alert("Candidate restored successfully.");

        await loadCandidates();

    } catch (err) {

        console.error(err);

        alert("Unable to restore.");

    }

};

   const handleSearch = async (e) => {

    const value = e.target.value;

    setSearch(value);

    setPage(0);

    if (value.trim() === "") {

        loadCandidates(0, size);

        return;

    }

    try {

        const data =
            await searchCandidatesPage(
                 value,
                 0,
                 size,
                sortBy,
                direction
            );

        setCandidates(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setPage(data.number);

    } catch (err) {

        console.error(err);

    }

};





    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <div>

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-4xl font-bold">
                        Candidate Management
                    </h1>

                    <p className="text-gray-500">
                        Manage all registered candidates
                    </p>

                </div>

                <button
                    onClick={() => navigate("/candidates/create")}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Create Candidate
                </button>

            </div>


            <div className="flex gap-3 mb-5">

    <button

        onClick={() => {

            setShowDeleted(false);

            setSearch("");
            setPage(0);

        }}

        className={`px-5 py-2 rounded-lg ${
            !showDeleted
                ? "bg-blue-600 text-white"
                : "border"
        }`}
    >

        Active Candidates

    </button>

    <button

        onClick={() => {

            setShowDeleted(true);
            setSearch("");

            setPage(0);

        }}

        className={`px-5 py-2 rounded-lg ${
            showDeleted
                ? "bg-red-600 text-white"
                : "border"
        }`}
    >

        Deleted Candidates

    </button>

</div>



{/*sorting UI   */}

            <div className="flex flex-wrap gap-4 mb-6">

    <div>

        <label className="block text-sm mb-1">
            Sort By
        </label>

        <select

            value={sortBy}

            onChange={(e) => {

                setSortBy(e.target.value);

                setPage(0);

            }}

            className="border rounded px-3 py-2"

        >

            <option value="createdAt">Created Date</option>

            <option value="fullName">Name</option>

            <option value="email">Email</option>

            <option value="nationality">Nationality</option>

        </select>

    </div>

    <div>

        <label className="block text-sm mb-1">
            Direction
        </label>

        <select

            value={direction}

            onChange={(e) => {

                setDirection(e.target.value);

                setPage(0);

            }}

            className="border rounded px-3 py-2"

        >

            <option value="asc">Ascending</option>

            <option value="desc">Descending</option>

        </select>

    </div>

</div>







            {/* Search Box */}

            <div className="mb-6">

                <input
                    type="text"
                    placeholder="Search by Name, Email, Phone or Passport..."
                    value={search}
                    onChange={handleSearch}
                    className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

            </div>

           <CandidateTable

    candidates={candidates}

    onDelete={handleDelete}

    onRestore={handleRestore}

    showDeleted={showDeleted}

/>


<div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">

    <div className="text-gray-600">

        Showing{" "}

        {totalElements === 0
            ? 0
            : page * size + 1}

        -

        {Math.min((page + 1) * size, totalElements)}

        {" "}of{" "}

        {totalElements} candidates

    </div>

    <div className="flex items-center gap-3">

        <span>Rows:</span>

        <select
            value={size}
            onChange={(e) => {

                setSize(Number(e.target.value));

                setPage(0);

            }}
            className="border rounded px-2 py-1"
        >

            <option value={10}>10</option>

            <option value={20}>20</option>

            <option value={50}>50</option>

        </select>

        <button

            disabled={page === 0}

            onClick={() => setPage(page - 1)}

            className={`px-3 py-1 rounded border ${
                page === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
            }`}
        >

            Previous

        </button>

        {
            [...Array(totalPages)].map((_, index) => (

                <button

                    key={index}

                    onClick={() => setPage(index)}

                    className={`w-9 h-9 rounded ${
                        page === index
                            ? "bg-blue-600 text-white"
                            : "border hover:bg-gray-100"
                    }`}

                >

                    {index + 1}

                </button>

            ))
        }

        <button

            disabled={page === totalPages - 1}

            onClick={() => setPage(page + 1)}

            className={`px-3 py-1 rounded border ${
                page === totalPages - 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100"
            }`}
        >

            Next

        </button>

    </div>

</div>

        </div>

    );

}
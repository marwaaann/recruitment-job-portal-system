import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteCandidate,
  getCandidatesPage,
  getDeletedCandidates,
  restoreCandidate,
  searchCandidatesPage,
} from "../../services/candidateService";
import CandidateTable from "../../components/candidates/CandidateTable";
import PageHeader from "../../components/ui/PageHeader";
import ListToolbar from "../../components/ui/ListToolbar";

export default function Candidates() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const loadCandidates = async (currentPage = page, currentSize = size) => {
    setLoading(true);
    try {
      let data;
      if (showDeleted) {
        data = await getDeletedCandidates(currentPage, currentSize);
      } else if (search.trim()) {
        data = await searchCandidatesPage(search, currentPage, currentSize);
      } else {
        data = await getCandidatesPage(currentPage, currentSize);
      }
      setCandidates(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setPage(data.number || 0);
    } catch (error) {
      console.error("Failed to load candidates:", error);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates(page, size);
  }, [page, size, search, showDeleted]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    try {
      await deleteCandidate(id);
      await loadCandidates(page, size);
    } catch (error) {
      console.error(error);
      alert("Unable to delete candidate.");
    }
  };

  const handleRestore = async (id) => {
    if (!window.confirm("Restore this candidate?")) return;
    try {
      await restoreCandidate(id);
      await loadCandidates(page, size);
    } catch (error) {
      console.error(error);
      alert("Unable to restore candidate.");
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Talent network" title="Candidate management" description="Search and manage candidate profiles." actionLabel="Create candidate" actionTo="/candidates/create" />
      <div className="mb-4 flex gap-2">
        <button type="button" onClick={() => { setShowDeleted(false); setSearch(""); setPage(0); }} className={`list-toggle ${!showDeleted ? "list-toggle-active" : ""}`}>Active candidates</button>
        <button type="button" onClick={() => { setShowDeleted(true); setSearch(""); setPage(0); }} className={`list-toggle ${showDeleted ? "list-toggle-danger" : ""}`}>Deleted candidates</button>
      </div>
      <ListToolbar value={search} onChange={handleSearch} placeholder="Search name, email, phone, or passport..." />
      {loading ? <div className="page-empty">Loading candidates...</div> : <CandidateTable candidates={candidates} onDelete={handleDelete} onRestore={handleRestore} showDeleted={showDeleted} />}
      <div className="list-pagination">
        <span>Showing {totalElements === 0 ? 0 : page * size + 1}-{Math.min((page + 1) * size, totalElements)} of {totalElements} candidates</span>
        <div className="flex items-center gap-3"><label>Rows <select value={size} onChange={(event) => { setSize(Number(event.target.value)); setPage(0); }} className="list-select"><option value={10}>10</option><option value={25}>25</option><option value={50}>50</option></select></label><button type="button" disabled={page === 0} onClick={() => setPage((current) => current - 1)} className="list-page-button">Previous</button><span>{page + 1} / {Math.max(totalPages, 1)}</span><button type="button" disabled={page + 1 >= totalPages} onClick={() => setPage((current) => current + 1)} className="list-page-button">Next</button></div>
      </div>
    </div>
  );
}

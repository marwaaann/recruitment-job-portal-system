import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page = 0,
  totalPages = 0,
  totalElements = 0,
  size = 10,
  onPageChange,
  onSizeChange,
  sizeOptions = [10, 25, 50],
  className = "",
}) {
  const startItem = totalElements === 0 ? 0 : page * size + 1;
  const endItem = Math.min((page + 1) * size, totalElements);

  // Generate numbered pages (max 5 visible buttons with ellipses)
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(0, page - 2);
      let end = Math.min(totalPages - 1, start + maxButtons - 1);

      if (end - start < maxButtons - 1) {
        start = Math.max(0, end - maxButtons + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-xs text-slate-600 select-none ${className}`}
    >
      {/* Elements counter */}
      <div>
        Showing <span className="font-semibold text-slate-900">{startItem}</span>{" "}
        to <span className="font-semibold text-slate-900">{endItem}</span> of{" "}
        <span className="font-semibold text-slate-900">{totalElements}</span> results
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Page size picker */}
        {onSizeChange && (
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Rows:</span>
            <select
              value={size}
              onChange={(e) => onSizeChange(Number(e.target.value))}
              className="rounded-lg border border-slate-300 bg-white py-1 px-2 text-xs text-slate-700 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            >
              {sizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Previous button */}
        <button
          type="button"
          disabled={page <= 0}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Numbered buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                page === p
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {p + 1}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          type="button"
          disabled={page >= totalPages - 1 || totalPages === 0}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

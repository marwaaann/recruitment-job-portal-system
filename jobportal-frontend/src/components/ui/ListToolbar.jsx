import { Search } from "lucide-react";

export default function ListToolbar({ value, onChange, placeholder = "Search...", children }) {
  return (
    <div className="list-toolbar">
      <label className="list-search">
        <Search size={17} />
        <input value={value} onChange={onChange} placeholder={placeholder} />
      </label>
      {children}
    </div>
  );
}

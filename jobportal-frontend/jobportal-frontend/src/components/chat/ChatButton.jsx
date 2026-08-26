import { MessageCircle } from "lucide-react";

export default function ChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 flex items-center justify-center transition-all duration-200"
    >
      <MessageCircle size={26} />
    </button>
  );
}
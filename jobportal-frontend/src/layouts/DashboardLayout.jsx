import { useState } from "react";
import Sidebar from "../components/ui/Sidebar";
import Navbar from "../components/ui/Navbar";
import { Outlet } from "react-router-dom";
import ChatButton from "../components/chat/ChatButton";
import ChatPanel from "../components/chat/ChatPanel";

export default function DashboardLayout() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>

      {/* Chat popup */}
      {chatOpen && (
        <ChatPanel onClose={() => setChatOpen(false)} />
      )}

      {/* Floating button */}
      <ChatButton onClick={() => setChatOpen(true)} />
    </div>
  );
}
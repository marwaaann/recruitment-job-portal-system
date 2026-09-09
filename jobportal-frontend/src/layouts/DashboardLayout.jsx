import { useState } from "react";
import Sidebar from "../components/ui/Sidebar";
import Navbar from "../components/ui/Navbar";
import { Outlet } from "react-router-dom";
import ChatButton from "../components/chat/ChatButton";
import ChatPanel from "../components/chat/ChatPanel";

export default function DashboardLayout() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased">
      <Sidebar />

      <div className="pl-64">
        <Navbar />

        <main className="pt-16 min-h-screen w-full px-6 py-6">
          <Outlet />
        </main>
      </div>

      {/* Chat popup */}
      {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}

      {/* Floating button */}
      <ChatButton onClick={() => setChatOpen(true)} />
    </div>
  );
}
import { useState } from "react";
import Sidebar from "../components/ui/Sidebar";
import Navbar from "../components/ui/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import ChatButton from "../components/chat/ChatButton";
import ChatPanel from "../components/chat/ChatPanel";

export default function DashboardLayout() {
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const isMessagesPage = location.pathname.startsWith("/messages") || location.pathname.startsWith("/chat");

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar with responsive state */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Floating Chat Modal (suppressed when already on messages screen) */}
      {!isMessagesPage && (
        <>
          {chatOpen && (
            <ChatPanel onClose={() => setChatOpen(false)} />
          )}
          <ChatButton onClick={() => setChatOpen(true)} />
        </>
      )}
    </div>
  );
}
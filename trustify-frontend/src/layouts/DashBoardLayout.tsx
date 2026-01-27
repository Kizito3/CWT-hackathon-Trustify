import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/Topbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen w-full bg-[#F0F7FF] overflow-hidden">
      {/* 1. FIXED SIDEBAR */}
      <aside className="w-20 lg:w-50 bg-white border-r border-slate-100 flex flex-col items-center py-8">
        <Sidebar />
      </aside>

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* TOPBAR (Search and User Profile) */}
        <header className="h-20 bg-white flex items-center px-8 border-b border-slate-50">
          <TopBar />
        </header>

        {/* 3. SCROLLABLE ROUTE AREA */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-400 mx-auto">
            {/* This is where your Dashboard, Wallet, 
                and Settings pages will render! 
            */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

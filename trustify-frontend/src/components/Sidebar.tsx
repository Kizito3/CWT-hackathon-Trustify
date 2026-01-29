import { NavLink } from "react-router-dom";
import { LayoutPanelLeft } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="flex flex-col items-center justify-between h-full py-8">
      {/* Branding Section */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-[#1F4FD8] font-bold lg:text-[30px] text-sm tracking-tight">
          Trustify
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-8 flex-1 justify-center">
        <SidebarLink to="/dashboard" icon={<LayoutPanelLeft size={24} />} />
        {/* <SidebarLink to="/dashboard/wallet" icon={<Wallet size={24} />} />
        <SidebarLink to="/dashboard/grid" icon={<LayoutGrid size={24} />} /> */}
      </nav>

      {/* Bottom Profile/Settings Placeholder (Optional) */}
      <div className="w-10 h-10 bg-slate-100 rounded-full cursor-pointer hover:bg-slate-200 transition-colors" />
    </div>
  );
};

// Helper component for styled NavLinks
const SidebarLink = ({ to, icon }: { to: string; icon: React.ReactNode }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `p-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
            : "text-blue-500 hover:bg-blue-50"
        }`
      }
    >
      {icon}
    </NavLink>
  );
};

export default Sidebar;

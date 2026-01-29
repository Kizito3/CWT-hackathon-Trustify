import { useAuth } from "@/context/AuthContext";
import { Search } from "lucide-react";

const TopBar = () => {
  const { user } = useAuth();
  return (
    <div className="flex items-center justify-between w-full h-full">
      {/* 1. SEARCH BAR (Centered) */}
      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-2xl">
          <span className="absolute  hidden inset-y-0 left-0 lg:flex items-center pl-4 text-blue-500">
            <Search size={20} />
          </span>
          <input
            type="text"
            className="w-full hidden lg:block bg-white border border-slate-200 py-3 pl-12 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            placeholder="Search transactions and categories"
          />
        </div>
      </div>

      {/* 2. USER ACTIONS (Right Side) */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        {/* <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
        </button> */}

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
              {user?.email}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden shadow-sm">
            <img
              src="https://i.pravatar.cc/150?u=ethan"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

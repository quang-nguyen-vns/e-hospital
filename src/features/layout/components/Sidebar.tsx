import React from "react";
import {
  LayoutDashboard,
  Search,
  History,
  Building2,
  LogOut,
  Users,
  BookOpen,
} from "lucide-react";
import { User } from "@/types";

export const Sidebar = ({
  activeTab,
  setActiveTab,
  user,
}: {
  activeTab: string;
  setActiveTab: (t: string) => void;
  user: User;
}) => {
  const menuItems = [
    {
      id: "dashboard",
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: "hospitals",
      label: "Hospitals",
      icon: Building2,
      hidden: user.role !== "admin",
    },
    { id: "search", label: "Policy Search", icon: Search },
    { id: "history", label: "Claims", icon: History },
    {
      id: "users",
      label: "User Management",
      icon: Users,
    },
    {
      id: "knowledge",
      label: "Knowledge Base",
      icon: BookOpen,
      hidden: user.role !== "hospital_admin" && user.role !== "admin",
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-6 border-bottom border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <img
            src="images/logo.svg"
            alt="Generali logo"
            className="h-8 w-auto"
          />
          <span className="font-bold text-lg text-generali-red">E-Hospital</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems
          .filter((i) => !i.hidden)
          .map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                ? "bg-generali-red text-white shadow-lg shadow-generali-red/20"
                : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
            Hospital
          </p>
          <p className="text-sm font-bold text-slate-800 truncate">
            {user.hospital}
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

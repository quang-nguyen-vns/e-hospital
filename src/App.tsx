import React, { useState, useEffect } from "react";
import { Menu, X, Building2, Bell, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { User, Insured } from "@/types";
import { LoginPage } from "@/features/auth/components/LoginPage";
import { Sidebar } from "@/features/layout/components/Sidebar";
import { Dashboard } from "@/features/dashboard/components/Dashboard";
import { SearchPage } from "@/features/claims/components/SearchPage";
import { ClaimBookingPage } from "@/features/claims/components/ClaimBookingPage";
import { HistoryPage } from "@/features/claims/components/HistoryPage";
import { HospitalUserManagement } from "@/features/users/components/HospitalUserManagement";
import { KnowledgeBasePage } from "@/features/knowledge/components/KnowledgeBasePage";
import { AdminDashboard, HospitalManagement, GeneraliUserManagement } from "@/features/admin/components/AdminPanel";
import { ProductTour } from "@/features/onboarding/components/ProductTour";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedInsured, setSelectedInsured] = useState<Insured | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (user) {
      // Show tour on every login
      setShowTour(true);
    }
  }, [user]);

  const handleTourComplete = () => {
    setShowTour(false);
  };

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  const renderContent = () => {
    if (selectedInsured) {
      return (
        <ClaimBookingPage
          insured={selectedInsured}
          onBack={() => setSelectedInsured(null)}
          onComplete={() => {
            setSelectedInsured(null);
            setActiveTab("history");
          }}
        />
      );
    }

    switch (activeTab) {
      case "dashboard":
        return user.role === 'admin' ? <AdminDashboard /> : <Dashboard onSearchClick={() => setActiveTab("search")} />;
      case "hospitals":
        return <HospitalManagement onSelectHospital={() => { }} />;
      case "search":
        return <SearchPage onSelectInsured={setSelectedInsured} />;
      case "history":
        return <HistoryPage user={user} />;
      case "users":
        return user.role === 'admin' ? <GeneraliUserManagement /> : <HospitalUserManagement />;
      case "knowledge":
        return <KnowledgeBasePage />;
      default:
        return user.role === 'admin' ? <AdminDashboard /> : <Dashboard onSearchClick={() => setActiveTab("search")} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {showTour && <ProductTour onComplete={handleTourComplete} />}
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-generali-red text-white rounded-full shadow-xl flex items-center justify-center"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {!isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(true)}
        />
      )}

      <div
        className={`${!isSidebarOpen ? "-translate-x-full" : "translate-x-0"} lg:translate-x-0 transition-transform duration-300 fixed lg:static inset-y-0 left-0 z-40`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(t) => {
            setActiveTab(t);
            setSelectedInsured(null);
            if (window.innerWidth < 1024) setIsSidebarOpen(false); // Close on mobile after selection
          }}
          user={user}
        />
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            {user.role === "hospital_admin" && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="p-1.5 bg-generali-red/10 rounded-lg">
                  <Building2 className="w-4 h-4 text-generali-red" />
                </div>
                <span className="font-bold text-slate-800 text-sm whitespace-nowrap">{user.hospital}</span>
                <span className="w-px h-5 bg-slate-200 mx-1"></span>
              </div>
            )}
            <h2 className="font-bold text-slate-600 capitalize text-sm whitespace-nowrap">
              {activeTab === "users" ? "User Management" : activeTab === "knowledge" ? "Knowledge Base" : activeTab.replace(/([A-Z])/g, ' $1').replace("-", " ")}
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors p-2">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute top-1.5 right-1.5 sm:top-1 sm:right-1 w-2 h-2 bg-generali-red rounded-full border-2 border-white"></span>
            </button>
            <div className="hidden sm:block h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 truncate max-w-[120px]">
                  {user.username}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {user.role === "hospital_admin" ? "Hospital Admin" : user.role}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-generali-red/10 rounded-full flex items-center justify-center border border-generali-red/20 flex-shrink-0">
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-generali-red" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (selectedInsured ? "-booking" : "")}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

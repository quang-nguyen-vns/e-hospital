import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Search,
  History,
  User as UserIcon,
  LogOut,
  Bell,
  ChevronRight,
  FileText,
  ShieldCheck,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Clock,
  Menu,
  X,
  ArrowLeft,
  Download,
  Upload,
  File,
  Building2,
  Users,
  BookOpen,
  Star,
  AlertTriangle,
  TrendingUp,
  Edit2,
  Trash2,
  UserPlus,
  Filter,
  Video,
  FileImage,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactECharts from 'echarts-for-react';
import {
  User,
  Insured,
  Policy,
  Claim,
  ClaimDocument,
  Announcement,
  HospitalUser,
} from "./types";
import { storageService, initStorage } from "./services/storageService";

// Initialize storage
initStorage();

// --- Types ---
// (Types moved to types.ts)

const CLAIM_STATUSES = {
  SUBMITTED: {
    label: "Submitted",
    color: "blue",
    description:
      "The claim has been successfully submitted and is awaiting review.",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "indigo",
    description: "The claim is currently being assessed by the insurer.",
  },
  PENDING_DOCUMENTS: {
    label: "Pending Documents",
    color: "amber",
    description: "The insurer requires additional documents or clarification.",
  },
  RESUBMITTED: {
    label: "Resubmitted",
    color: "purple",
    description: "Missing information has been provided and is back in review.",
  },
  APPROVED: {
    label: "Approved",
    color: "emerald",
    description: "The claim has been approved according to policy terms.",
  },
  REJECTED: {
    label: "Rejected",
    color: "red",
    description:
      "The claim has been declined due to exclusions or other reasons.",
  },
  PAID: {
    label: "Paid",
    color: "teal",
    description: "Payment has been successfully processed and transferred.",
  },
  CLOSED: {
    label: "Closed",
    color: "slate",
    description: "The claim lifecycle is fully completed.",
  },
};

// --- Components ---

const LoginPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [tempUser, setTempUser] = useState<User | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await storageService.login(username, password);
    if (data.success) {
      setTempUser(data.user!);
      setShowOtp(true);
    } else {
      setError(data.message!);
    }
  };

  const handleVerifyOtp = () => {
    // Simulate OTP verification
    if (otp === "123456" && tempUser) {
      onLogin(tempUser);
    } else {
      setError("Invalid OTP (Try 123456)");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8 text-center border-b border-slate-200">
          <div className="flex flex-col items-center justify-center">
            <div className="flex justify-center mb-4">
              <img
                src="images/logo.svg"
                alt="Generali logo"
                className="h-32 w-auto p-2"
              />
            </div>
            <h1 className="text-4xl font-bold text-generali-red">E-Hospital</h1>
            <p className="text-generali-red text-md mt-1">
              Secure Provider Portal
            </p>
          </div>
        </div>

        <div className="p-8">
          {!showOtp ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  className="generali-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="generali-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                className="generali-btn-primary w-full py-3"
              >
                Sign In
              </button>
              <div className="text-center">
                <a
                  href="#"
                  className="text-sm text-generali-red hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-slate-600 mb-4">
                  An OTP has been sent to your registered email.
                </p>
                <div className="flex justify-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    className="w-full text-center text-2xl tracking-widest py-3 border-2 border-slate-200 rounded-xl focus:border-generali-red outline-none"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                  />
                </div>
              </div>
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}
              <button
                onClick={handleVerifyOtp}
                className="generali-btn-primary w-full py-3"
              >
                Verify & Access
              </button>
              <button
                onClick={() => setShowOtp(false)}
                className="w-full text-sm text-slate-500 hover:text-slate-700"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const Sidebar = ({
  activeTab,
  setActiveTab,
  user,
}: {
  activeTab: string;
  setActiveTab: (t: string) => void;
  user: User;
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "search", label: "Policy Search", icon: Search },
    { id: "history", label: "Claim History", icon: History },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      hidden: user.role !== "hospital_admin",
    },
    {
      id: "knowledge",
      label: "Knowledge Base",
      icon: BookOpen,
      hidden: user.role !== "hospital_admin" && user.role !== "admin",
    },
    {
      id: "admin",
      label: "Administration",
      icon: UserIcon,
      hidden: user.role !== "admin",
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

const Dashboard = ({ onSearchClick }: { onSearchClick: () => void }) => {
  const [stats, setStats] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    storageService.getDashboardData().then((data) => {
      setStats(data.stats);
      setAnnouncements(data.announcements);
    });
  }, []);

  if (!stats) return <div className="p-8">Loading...</div>;

  // --- Mock chart data ---
  const claimTypeChart = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: '0%', left: 'center', itemGap: 12, textStyle: { fontSize: 11 } },
    color: ['#3b82f6', '#8b5cf6', '#f97316', '#10b981'],
    series: [{
      name: 'Claim Types',
      type: 'pie',
      radius: ['45%', '72%'],
      center: ['50%', '44%'],
      avoidLabelOverlap: false,
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
      data: [
        { value: 142, name: 'OPD' },
        { value: 95, name: 'IPD' },
        { value: 61, name: 'ER' },
        { value: 41, name: 'Dental' },
      ],
    }],
  };

  const monthlyTrendChart = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], axisLine: { lineStyle: { color: '#e2e8f0' } }, axisLabel: { color: '#94a3b8', fontSize: 11 } },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8', fontSize: 11 }, splitLine: { lineStyle: { color: '#f1f5f9' } } },
    color: ['#ef4444', '#3b82f6'],
    series: [
      { name: 'Submitted', type: 'line', smooth: true, areaStyle: { opacity: 0.08 }, data: [48, 62, 55, 71, 83, 62], lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 6 },
      { name: 'Approved', type: 'line', smooth: true, areaStyle: { opacity: 0.08 }, data: [40, 55, 48, 64, 75, 58], lineStyle: { width: 2 }, symbol: 'circle', symbolSize: 6 },
    ],
    legend: { data: ['Submitted', 'Approved'], bottom: 0, textStyle: { fontSize: 11 } },
  };

  const vipCasesChart = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['OPD', 'IPD', 'ER', 'Dental'], axisLabel: { color: '#94a3b8', fontSize: 11 }, axisLine: { lineStyle: { color: '#e2e8f0' } } },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8', fontSize: 11 }, splitLine: { lineStyle: { color: '#f1f5f9' } } },
    color: ['#f59e0b'],
    series: [{ name: 'VIP Cases', type: 'bar', barWidth: '50%', data: [18, 34, 12, 5], itemStyle: { borderRadius: [6, 6, 0, 0] } }],
    legend: { data: ['VIP Cases'], bottom: 0, textStyle: { fontSize: 11 } },
  };

  const overSlaChart = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '8%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', axisLabel: { color: '#94a3b8', fontSize: 11 }, splitLine: { lineStyle: { color: '#f1f5f9' } } },
    yAxis: { type: 'category', data: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'], axisLabel: { color: '#94a3b8', fontSize: 11 }, axisLine: { lineStyle: { color: '#e2e8f0' } } },
    color: ['#ef4444'],
    series: [{ name: 'Over-SLA', type: 'bar', barWidth: '50%', data: [7, 12, 5, 9, 4], itemStyle: { borderRadius: [0, 6, 6, 0] }, label: { show: true, position: 'right', color: '#64748b', fontSize: 11 } }],
    legend: { data: ['Over-SLA'], bottom: 0, textStyle: { fontSize: 11 } },
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back!</h1>
          <p className="text-slate-500 mt-1">
            Here's what's happening with your claims today.
          </p>
        </div>
        <button onClick={onSearchClick} className="generali-btn-primary">
          <PlusCircle className="w-5 h-5" />
          New Claim Inquiry
        </button>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Claims", value: stats.total.count + 339, icon: FileText, trend: "+12% from last month", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-500" },
          { label: "Pending Review", value: stats.pending.count + 37, icon: Clock, trend: "Avg. 2.4h response", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-500" },
          { label: "Approved", value: stats.approved.count + 276, icon: CheckCircle2, trend: "94% success rate", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-500" },
          { label: "Rejected", value: stats.rejected.count + 26, icon: AlertCircle, trend: "-2% from last month", bg: "bg-red-50", text: "text-red-600", border: "border-red-500" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
            className={`generali-card p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-b-4 ${stat.border}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.text} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.trend}</span>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
            </div>
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.bg}/50 rounded-full blur-2xl group-hover:scale-150 transition-transform`}></div>
          </motion.div>
        ))}
      </div>

      {/* VIP & Over-SLA highlight cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="generali-card p-6 flex items-center gap-5 border-l-4 border-amber-400">
          <div className="p-4 bg-amber-50 rounded-2xl"><Star className="w-7 h-7 text-amber-500" /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">VIP Cases (This Month)</p>
            <p className="text-3xl font-bold text-amber-600">69</p>
            <p className="text-xs text-slate-400 mt-0.5">+8 from last month</p>
          </div>
        </div>
        <div className="generali-card p-6 flex items-center gap-5 border-l-4 border-red-400">
          <div className="p-4 bg-red-50 rounded-2xl"><AlertTriangle className="w-7 h-7 text-red-500" /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Over-SLA Claims</p>
            <p className="text-3xl font-bold text-red-600">37</p>
            <p className="text-xs text-slate-400 mt-0.5">Target: &lt;10% of total</p>
          </div>
        </div>
        <div className="generali-card p-6 flex items-center gap-5 border-l-4 border-teal-400">
          <div className="p-4 bg-teal-50 rounded-2xl"><TrendingUp className="w-7 h-7 text-teal-500" /></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Avg. Processing Time</p>
            <p className="text-3xl font-bold text-teal-600">2.4h</p>
            <p className="text-xs text-slate-400 mt-0.5">SLA target: 4h</p>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="generali-card p-6">
          <h2 className="font-bold text-lg mb-1">Claim Types Distribution</h2>
          <p className="text-xs text-slate-400 mb-4">Breakdown by claim category — last 30 days</p>
          <ReactECharts option={claimTypeChart} style={{ height: 260 }} />
        </div>
        <div className="generali-card p-6">
          <h2 className="font-bold text-lg mb-1">Monthly Claims Trend</h2>
          <p className="text-xs text-slate-400 mb-4">Submitted vs. Approved — last 6 months</p>
          <ReactECharts option={monthlyTrendChart} style={{ height: 260 }} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="generali-card p-6">
          <h2 className="font-bold text-lg mb-1">VIP Cases by Type</h2>
          <p className="text-xs text-slate-400 mb-4">VIP patient claims by claim category</p>
          <ReactECharts option={vipCasesChart} style={{ height: 220 }} />
        </div>
        <div className="generali-card p-6">
          <h2 className="font-bold text-lg mb-1">Over-SLA Claims by Week</h2>
          <p className="text-xs text-slate-400 mb-4">Claims exceeding 48h resolution — current month</p>
          <ReactECharts option={overSlaChart} style={{ height: 220 }} />
        </div>
      </div>

      {/* Announcements & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="generali-card">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-lg">Recent Announcements</h2>
              <button className="text-sm text-generali-red font-medium hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-100">
              {announcements.map((ann, i) => (
                <div key={i} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${ann.type === "Maintenance" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{ann.type}</span>
                    <span className="text-xs text-slate-400">{new Date(ann.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 group-hover:text-generali-red transition-colors">{ann.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="generali-card p-6 bg-generali-red">
            <h2 className="font-bold text-lg mb-2">Need Help?</h2>
            <p className="text-sm mb-6">Access our training videos and user manuals to get the most out of the system.</p>
            <div className="space-y-3">
              <button className="w-full bg-white/20 hover:bg-white/30 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-between transition-all">User Guide (PDF)<Download className="w-4 h-4" /></button>
              <button className="w-full bg-white/20 hover:bg-white/30 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-between transition-all">Training Videos<ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="generali-card p-6">
            <h2 className="font-bold text-lg mb-4">System Status</h2>
            <div className="space-y-4">
              {[['Claim Backend', true], ['Policy DB', true], ['MFA Service', true]].map(([name, ok]) => (
                <div key={String(name)} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{String(name)}</span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>ONLINE
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};




const SearchPage = ({
  onSelectInsured,
}: {
  onSelectInsured: (i: Insured) => void;
}) => {
  const [query, setQuery] = useState("");
  const [dob, setDob] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [results, setResults] = useState<Insured[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<Insured | null>(null);
  const [policyData, setPolicyData] = useState<{
    policy: Policy;
    insured: Insured;
  } | null>(null);
  const [fetchingPolicy, setFetchingPolicy] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSelectedResult(null);
    setPolicyData(null);
    try {
      const data = await storageService.searchInsured(query, searchType, dob);
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMember = async (insured: Insured) => {
    setSelectedResult(insured);
    setFetchingPolicy(true);
    try {
      const data = await storageService.getPolicyDetails(insured.policy_no);
      setPolicyData(data);
    } finally {
      setFetchingPolicy(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">
          Policy & Benefit Inquiry
        </h1>
        <p className="text-slate-500 mt-1">
          Search for insured members to verify coverage and start a claim.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="generali-card p-8">
            <h2 className="font-bold text-lg mb-6">Search Criteria</h2>
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Search By
                </label>
                <select
                  className="generali-input"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value="name">Name & DOB</option>
                  <option value="id">ID Card / Passport</option>
                  <option value="policy">Policy Number</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Search Query
                </label>
                <input
                  type="text"
                  className="generali-input"
                  placeholder={
                    searchType === "name"
                      ? "First/Last Name"
                      : searchType === "id"
                        ? "ID Card Number"
                        : "Policy Number"
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  required
                />
              </div>

              {searchType === "name" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="generali-input"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="generali-btn-primary w-full py-3"
              >
                {loading ? "Searching..." : "Search Member"}
              </button>
            </form>
          </div>

          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="generali-card overflow-hidden"
            >
              <div className="p-4 bg-slate-50 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Search Results ({results.length})
                </h3>
              </div>
              <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                {results.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => handleSelectMember(res)}
                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group ${selectedResult?.id === res.id ? "bg-slate-50 ring-1 ring-inset ring-generali-red/20" : ""}`}
                  >
                    <div>
                      <p className="font-bold text-slate-800">
                        {res.first_name} {res.last_name}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {res.policy_no}
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-300 group-hover:text-generali-red transition-colors ${selectedResult?.id === res.id ? "text-generali-red" : ""}`}
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-2">
          {!selectedResult ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                <Search className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                No Member Selected
              </h3>
              <p className="text-slate-500 mt-2 max-w-xs">
                Search and select a member from the list to view their policy
                details and start a claim.
              </p>
            </div>
          ) : fetchingPolicy ? (
            <div className="h-full min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-generali-red rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 font-medium">
                  Fetching policy details...
                </p>
              </div>
            </div>
          ) : (
            policyData && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="generali-card p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                        <UserIcon className="w-10 h-10" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                          {selectedResult.first_name} {selectedResult.last_name}
                        </h2>
                        <p className="text-slate-500">
                          Member ID:{" "}
                          <span className="font-mono">
                            {selectedResult.id_card}
                          </span>
                        </p>
                        <div className="flex gap-4 mt-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                            {selectedResult.gender}
                          </span>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                            DOB: {selectedResult.dob}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                      ACTIVE COVERAGE
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                          Policy Information
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600">
                              Policy Number
                            </span>
                            <span className="font-mono font-bold text-slate-900">
                              {policyData.policy.policy_no}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600">Plan Name</span>
                            <span className="font-bold text-generali-red">
                              {policyData.policy.plan_name}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600">Status</span>
                            <span className="text-emerald-600 font-bold">
                              {policyData.policy.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                          Benefit Limits
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600">OPD Limit</span>
                            <span className="font-bold text-slate-900">
                              ฿{policyData.policy.opd_limit.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600">IPD Limit</span>
                            <span className="font-bold text-slate-900">
                              ฿{policyData.policy.ipd_limit.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600">Dental Limit</span>
                            <span className="font-bold text-slate-900">
                              ฿{policyData.policy.dental_limit.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                            <span className="text-slate-600">Co-payment</span>
                            <span className="font-bold text-slate-900">
                              {policyData.policy.co_payment}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex justify-end gap-4">
                    <button
                      onClick={() => setSelectedResult(null)}
                      className="generali-btn-secondary px-8"
                    >
                      Clear Selection
                    </button>
                    <button
                      onClick={() => onSelectInsured(selectedResult)}
                      className="generali-btn-primary px-12 py-3 shadow-lg shadow-generali-red/20"
                    >
                      Start Cashless Claim
                    </button>
                  </div>
                </div>

                <div className="generali-card p-6 bg-slate-900">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-xl">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">
                        Pre-Authorization Required
                      </h4>
                      <p className="text-sm leading-relaxed">
                        For IPD treatments exceeding ฿50,000, please ensure
                        pre-authorization is obtained before admission to
                        guarantee cashless payment.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

const ClaimBookingPage = ({
  insured,
  onBack,
  onComplete,
}: {
  insured: Insured;
  onBack: () => void;
  onComplete: () => void;
}) => {
  const [policyData, setPolicyData] = useState<{
    policy: Policy;
    insured: Insured;
  } | null>(null);
  const [claimType, setClaimType] = useState("OPD");
  const [diagnosis, setDiagnosis] = useState("");
  const [amount, setAmount] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [physicianName, setPhysicianName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    storageService
      .getPolicyDetails(insured.policy_no)
      .then((data) => setPolicyData(data));
  }, [insured.policy_no]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const claimData = {
        insured_id: insured.id,
        claim_type: claimType,
        diagnosis,
        amount: parseFloat(amount),
        admission_date: admissionDate,
        discharge_date: dischargeDate,
        physician_name: physicianName,
        symptoms,
        treatment_plan: treatmentPlan,
        hospital_id: 1, // Mock hospital ID
      };

      const res = await storageService.submitClaim(claimData);

      if (res.success && selectedFiles.length > 0) {
        // Fake upload: just simulate progress and success
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const uploadPromises = selectedFiles.map((file) => {
          return storageService.uploadDocument(res.claimId, {
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            file_data: "FAKE_DATA_FOR_DEMO", // Just fake the data
          });
        });
        await Promise.all(uploadPromises);
      }

      onComplete();
    } finally {
      setSubmitting(false);
    }
  };

  if (!policyData) return <div className="p-8">Loading policy details...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Search
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="generali-card p-6">
            <h2 className="font-bold text-lg mb-4">Member Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Full Name
                </p>
                <p className="font-bold text-slate-800">
                  {insured.first_name} {insured.last_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Policy Number
                </p>
                <p className="font-mono text-slate-800">{insured.policy_no}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Plan Name
                </p>
                <p className="font-bold text-generali-red">
                  {policyData.policy.plan_name}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                  COVERAGE ACTIVE
                </span>
              </div>
            </div>
          </div>

          <div className="generali-card p-6">
            <h2 className="font-bold text-lg mb-4">Benefit Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">OPD Limit</span>
                <span className="text-sm font-bold">
                  ฿{policyData.policy.opd_limit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">IPD Limit</span>
                <span className="text-sm font-bold">
                  ฿{policyData.policy.ipd_limit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Dental Limit</span>
                <span className="text-sm font-bold">
                  ฿{policyData.policy.dental_limit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="text-sm text-slate-600">Co-payment</span>
                <span className="text-sm font-bold">
                  {policyData.policy.co_payment}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="generali-card p-8">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-2xl text-slate-900">
                  New Claim Submission
                </h2>
                <p className="text-slate-500 mt-1">
                  Please provide accurate medical details for adjudication.
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Claiming For
                </p>
                <p className="font-bold text-slate-800">
                  {insured.first_name} {insured.last_name}
                </p>
                <p className="text-xs text-generali-red font-mono">
                  {insured.policy_no}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Claim Type
                  </label>
                  <select
                    className="generali-input"
                    value={claimType}
                    onChange={(e) => setClaimType(e.target.value)}
                  >
                    <option value="OPD">OPD (Outpatient)</option>
                    <option value="IPD">IPD (Inpatient)</option>
                    <option value="ER">Emergency Room</option>
                    <option value="DENTAL">Dental</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Treatment Amount (THB)
                  </label>
                  <input
                    type="number"
                    className="generali-input"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Attending Physician
                  </label>
                  <input
                    type="text"
                    className="generali-input"
                    placeholder="Dr. Name"
                    value={physicianName}
                    onChange={(e) => setPhysicianName(e.target.value)}
                    required
                  />
                </div>
                {claimType === "IPD" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Admission Date
                      </label>
                      <input
                        type="date"
                        className="generali-input"
                        value={admissionDate}
                        onChange={(e) => setAdmissionDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Discharge Date (Est.)
                      </label>
                      <input
                        type="date"
                        className="generali-input"
                        value={dischargeDate}
                        onChange={(e) => setDischargeDate(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Symptoms & Clinical Signs
                </label>
                <textarea
                  className="generali-input min-h-[80px]"
                  placeholder="Describe patient symptoms..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Diagnosis / ICD-10
                </label>
                <textarea
                  className="generali-input min-h-[80px]"
                  placeholder="Enter diagnosis details or ICD-10 codes..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Treatment Plan
                </label>
                <textarea
                  className="generali-input min-h-[80px]"
                  placeholder="Describe the treatment provided or planned..."
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-slate-700">
                    Supporting Documents
                  </label>
                  <label className="generali-btn-secondary px-3 py-1 text-xs flex items-center gap-2 cursor-pointer">
                    <Upload className="w-3 h-3" />
                    Add Document
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          setSelectedFiles([
                            ...selectedFiles,
                            ...Array.from(e.target.files),
                          ]);
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <FileText className="w-4 h-4 text-generali-red" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium text-slate-700 truncate">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedFiles(
                            selectedFiles.filter((_, i) => i !== idx),
                          )
                        }
                        className="p-1 text-slate-400 hover:text-generali-red transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {selectedFiles.length === 0 && (
                    <div className="col-span-full py-4 text-center border-2 border-dashed border-slate-100 rounded-xl">
                      <p className="text-xs text-slate-400">
                        No documents selected. Please attach medical
                        certificates or invoices.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-slate-400 mt-0.5" />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    By submitting this claim, you certify that the information
                    provided is accurate and supported by medical records.
                    Supporting documents (Invoices, Medical Certificates) should
                    be attached to ensure faster processing.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="generali-btn-secondary px-8"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="generali-btn-primary px-12"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Claim"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const HistoryPage = ({ user }: { user: User }) => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [documents, setDocuments] = useState<ClaimDocument[]>([]);
  const [newStatus, setNewStatus] = useState("");
  const [adminComments, setAdminComments] = useState("");
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showStatusTips, setShowStatusTips] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const fetchClaims = () => {
    storageService.getClaimHistory().then((data) => setClaims(data));
  };

  const fetchDocuments = (claimId: number) => {
    storageService.getDocuments(claimId).then((data) => setDocuments(data));
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  useEffect(() => {
    if (selectedClaim) {
      fetchDocuments(selectedClaim.id);
    }
  }, [selectedClaim]);

  const handleUpdateStatus = async () => {
    if (!selectedClaim) return;
    setUpdating(true);
    try {
      const res = await storageService.updateClaim(
        selectedClaim.id,
        newStatus,
        adminComments,
      );
      if (res.success) {
        setSelectedClaim(null);
        fetchClaims();
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedClaim) return;

    setUploading(true);
    try {
      // Fake upload: just simulate progress and success
      await new Promise((resolve) => setTimeout(resolve, 800));
      const res = await storageService.uploadDocument(selectedClaim.id, {
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_data: "FAKE_DATA_FOR_DEMO",
      });
      if (res.success) {
        fetchDocuments(selectedClaim.id);
      }
    } finally {
      setUploading(false);
    }
  };

  const downloadDocument = async (docId: number, fileName: string) => {
    // In client-only mode, we just simulate a download
    alert(`Downloading ${fileName} (Simulated)`);
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Claim History</h1>
          <p className="text-slate-500 mt-1">
            Review and track the status of all submitted claims.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowStatusTips(!showStatusTips)}
            className="generali-btn-secondary"
          >
            <AlertCircle className="w-4 h-4" />
            Status Definitions
          </button>
          <button className="generali-btn-secondary">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </header>

      {showStatusTips && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {Object.entries(CLAIM_STATUSES).map(([key, value]) => (
            <div key={key} className="generali-card p-4 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-2 h-2 rounded-full bg-${value.color}-500`}
                ></div>
                <span className="font-bold text-xs uppercase tracking-wider">
                  {value.label}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </motion.div>
      )}

      <div className="generali-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Claim ID
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {claims.map((claim) => {
              const statusInfo = (CLAIM_STATUSES as any)[claim.status] || {
                label: claim.status,
                color: "slate",
              };
              return (
                <tr
                  key={claim.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">
                    #{claim.id.toString().padStart(6, "0")}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">
                      {claim.first_name} {claim.last_name}
                    </p>
                    <p className="text-xs text-slate-500">{claim.policy_no}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                      {claim.claim_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {claim.treatment_date}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">
                    ฿{claim.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`flex items-center gap-1.5 text-xs font-bold text-${statusInfo.color}-600`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full bg-${statusInfo.color}-500`}
                      ></div>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedClaim(claim);
                        setNewStatus(claim.status);
                        setAdminComments(claim.admin_comments || "");
                        setIsReviewing(false);
                      }}
                      className="text-slate-400 hover:text-generali-red transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedClaim && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Claim Details
                  </h2>
                  <p className="text-sm text-slate-500 font-mono">
                    #{selectedClaim.id.toString().padStart(6, "0")}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Member Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-slate-800">
                        {selectedClaim.first_name} {selectedClaim.last_name}
                      </p>
                      <p className="text-sm text-slate-600">
                        Policy:{" "}
                        <span className="font-mono">
                          {selectedClaim.policy_no}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Treatment Details
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">
                        Type:{" "}
                        <span className="font-bold text-slate-800">
                          {selectedClaim.claim_type}
                        </span>
                      </p>
                      <p className="text-sm text-slate-600">
                        Physician:{" "}
                        <span className="font-bold text-slate-800">
                          {selectedClaim.physician_name || "N/A"}
                        </span>
                      </p>
                      <p className="text-sm text-slate-600">
                        Date:{" "}
                        <span className="font-bold text-slate-800">
                          {selectedClaim.treatment_date}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Financials
                    </h3>
                    <div className="space-y-2">
                      <p className="text-lg font-bold text-generali-red">
                        ฿{selectedClaim.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">
                        Submitted:{" "}
                        {new Date(selectedClaim.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Symptoms & Diagnosis
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Symptoms
                        </p>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {selectedClaim.symptoms || "No symptoms recorded."}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Diagnosis
                        </p>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                          {selectedClaim.diagnosis}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Treatment Plan
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {selectedClaim.treatment_plan ||
                          "No treatment plan recorded."}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedClaim.admin_comments && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Insurer Comments
                    </h3>
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                      <p className="text-sm text-amber-800 leading-relaxed italic">
                        "{selectedClaim.admin_comments}"
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Supporting Documents
                    </h3>
                    {user.role !== "admin" && (
                      <label className="generali-btn-secondary px-3 py-1 text-xs flex items-center gap-2 cursor-pointer">
                        <Upload className="w-3 h-3" />
                        {uploading ? "Uploading..." : "Upload Document"}
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={uploading}
                        />
                      </label>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {documents.length === 0 ? (
                      <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
                        <File className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">
                          No documents uploaded yet.
                        </p>
                      </div>
                    ) : (
                      documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <FileText className="w-4 h-4 text-generali-red" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-medium text-slate-700 truncate">
                                {doc.file_name}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {(doc.file_size / 1024).toFixed(1)} KB •{" "}
                                {new Date(doc.uploaded_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              downloadDocument(doc.id, doc.file_name)
                            }
                            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {user.role === "admin" && (
                  <div className="pt-8 border-t border-slate-100 space-y-6">
                    {!isReviewing ? (
                      <div className="flex justify-between items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            Review Action
                          </h3>
                          <p className="text-sm text-slate-500">
                            Update the status of this claim and provide
                            feedback.
                          </p>
                        </div>
                        <button
                          onClick={() => setIsReviewing(true)}
                          className="generali-btn-primary px-8"
                        >
                          Change Status
                        </button>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-inner"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-slate-900">
                            Update Claim Status
                          </h3>
                          <button
                            onClick={() => setIsReviewing(false)}
                            className="text-sm text-slate-400 hover:text-slate-600 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              New Status
                            </label>
                            <select
                              className="generali-input"
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                            >
                              {Object.entries(CLAIM_STATUSES).map(
                                ([key, value]) => (
                                  <option key={key} value={key}>
                                    {value.label}
                                  </option>
                                ),
                              )}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Review Comments
                            </label>
                            <textarea
                              className="generali-input min-h-[100px]"
                              placeholder="Add internal notes or feedback for the hospital..."
                              value={adminComments}
                              onChange={(e) => setAdminComments(e.target.value)}
                            ></textarea>
                          </div>
                        </div>
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={handleUpdateStatus}
                            className="generali-btn-primary px-12"
                            disabled={updating}
                          >
                            {updating ? "Updating..." : "Submit Review"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Hospital User Management ---

type HospitalUserRole = 'receptionist' | 'nurse_coordinator' | 'billing_staff' | 'it_admin' | 'doctor';

const ROLE_LABELS: Record<HospitalUserRole, string> = {
  receptionist: 'Receptionist',
  nurse_coordinator: 'Nurse Coordinator',
  billing_staff: 'Billing Staff',
  it_admin: 'IT Admin',
  doctor: 'Doctor',
};

const ROLE_COLORS: Record<HospitalUserRole, string> = {
  receptionist: 'bg-blue-100 text-blue-700',
  nurse_coordinator: 'bg-purple-100 text-purple-700',
  billing_staff: 'bg-amber-100 text-amber-700',
  it_admin: 'bg-slate-100 text-slate-700',
  doctor: 'bg-emerald-100 text-emerald-700',
};

const HospitalUserManagement = () => {

  const [users, setUsers] = useState<HospitalUser[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<HospitalUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [form, setForm] = useState({ name: '', email: '', username: '', role: 'receptionist' as HospitalUserRole, department: '' });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchUsers = () => { storageService.getHospitalUsers().then(setUsers); };
  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => { setEditingUser(null); setForm({ name: '', email: '', username: '', role: 'receptionist', department: '' }); setShowModal(true); };
  const openEdit = (u: HospitalUser) => { setEditingUser(u); setForm({ name: u.name, email: u.email, username: u.username, role: u.role, department: u.department }); setShowModal(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingUser) {
        await storageService.updateHospitalUser(editingUser.id, form);
      } else {
        await storageService.createHospitalUser({ ...form, status: 'active' });
      }
      fetchUsers(); setShowModal(false);
    } finally { setSaving(false); }
  };

  const handleToggleStatus = async (u: HospitalUser) => {
    await storageService.deactivateHospitalUser(u.id, u.status === 'active' ? 'inactive' : 'active');
    fetchUsers();
  };

  const handleDelete = async (id: number) => {
    await storageService.deleteHospitalUser(id);
    setDeleteConfirm(null); fetchUsers();
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const formatDate = (d: string) => d === 'Never' ? 'Never' : new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">Manage hospital staff accounts and role-based access.</p>
        </div>
        <button onClick={openCreate} className="generali-btn-primary">
          <UserPlus className="w-5 h-5" /> Add User
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, color: 'text-slate-800', bg: 'bg-white' },
          { label: 'Active', value: users.filter(u => u.status === 'active').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Inactive', value: users.filter(u => u.status === 'inactive').length, color: 'text-slate-500', bg: 'bg-slate-50' },
          { label: 'Roles', value: [...new Set(users.map(u => u.role))].length, color: 'text-generali-red', bg: 'bg-red-50' },
        ].map((s, i) => (
          <div key={i} className={`generali-card p-5 ${s.bg}`}>
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by name or email..." className="generali-input pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <select className="generali-input max-w-[200px]" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          <option value="all">All Roles</option>
          {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span className="text-sm text-slate-400 ml-auto">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="generali-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['User', 'Role', 'Department', 'Status', 'Last Login', 'Actions'].map(h => (
                <th key={h} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(u => (
              <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${u.status === 'inactive' ? 'opacity-60' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-generali-red/20 to-generali-red/5 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-generali-red">{u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${ROLE_COLORS[u.role]}`}>{ROLE_LABELS[u.role]}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{u.department}</td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 text-xs font-bold w-fit ${u.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                    {u.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{formatDate(u.lastLogin)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(u)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleToggleStatus(u)} className={`p-1.5 rounded-lg transition-colors text-xs font-bold px-2 ${u.status === 'active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`} title={u.status === 'active' ? 'Deactivate' : 'Reactivate'}>
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => setDeleteConfirm(u.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-400"><Users className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>No users found.</p></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-bold text-slate-900">{editingUser ? 'Edit User' : 'Add New User'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
              </div>
              <div className="p-6 space-y-5">
                {[
                  { label: 'Full Name', key: 'name', type: 'text', placeholder: 'e.g. Somchai Phongsakorn' },
                  { label: 'Email', key: 'email', type: 'email', placeholder: 'e.g. somchai@hospital.th' },
                  { label: 'Username', key: 'username', type: 'text', placeholder: 'e.g. somchai.p' },
                  { label: 'Department', key: 'department', type: 'text', placeholder: 'e.g. Outpatient Registration' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
                    <input type={f.type} className="generali-input" placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <select className="generali-input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as HospitalUserRole })}>
                    {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="generali-btn-secondary px-6">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.name || !form.email} className="generali-btn-primary px-8">{saving ? 'Saving...' : editingUser ? 'Save Changes' : 'Create User'}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8 text-red-600" /></div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete User?</h3>
              <p className="text-slate-500 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="generali-btn-secondary flex-1">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2 px-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Knowledge Base / Documents ---
const MOCK_DOCUMENTS = [
  { id: 1, title: 'E-Hospital User Guide v2.1', description: 'Complete user manual for hospital staff covering all portal features and workflows.', category: 'user_manual', fileType: 'pdf', fileSize: '4.2 MB', version: 'v2.1', updatedAt: '2026-02-15', downloadCount: 342 },
  { id: 2, title: 'Cashless Claim Policy 2025', description: 'Official policy document covering eligibility, limits, and procedures for cashless claims.', category: 'policy', fileType: 'pdf', fileSize: '1.8 MB', version: 'v3.0', updatedAt: '2026-01-01', downloadCount: 891 },
  { id: 3, title: 'IPD Admission Form (TH/EN)', description: 'Bilingual form required for all inpatient department admission and cashless pre-authorization.', category: 'form', fileType: 'pdf', fileSize: '512 KB', version: 'v1.4', updatedAt: '2025-11-20', downloadCount: 2104 },
  { id: 4, title: 'OPD Claim Submission Training', description: 'Walk-through video tutorial for submitting outpatient claims through the portal.', category: 'training', fileType: 'video', fileSize: '245 MB', version: 'v1.0', updatedAt: '2026-01-10', downloadCount: 178 },
  { id: 5, title: 'Dental Claim Checklist', description: 'Required documentation checklist for dental treatment claims and pre-authorizations.', category: 'form', fileType: 'pdf', fileSize: '320 KB', version: 'v1.1', updatedAt: '2025-12-05', downloadCount: 567 },
  { id: 6, title: 'SLA & Claims Processing Guidelines', description: 'Service level agreement document detailing response times, escalation paths, and KPIs.', category: 'policy', fileType: 'pdf', fileSize: '950 KB', version: 'v2.2', updatedAt: '2026-01-15', downloadCount: 423 },
  { id: 7, title: 'RBAC & Portal Security Policy', description: 'Information security policy covering user access, password policy, and audit logging.', category: 'policy', fileType: 'pdf', fileSize: '780 KB', version: 'v1.3', updatedAt: '2026-02-01', downloadCount: 210 },
  { id: 8, title: 'Hospital Admin Quick Start Guide', description: 'A concise guide for hospital administrators on onboarding, user setup, and first steps.', category: 'user_manual', fileType: 'pdf', fileSize: '1.1 MB', version: 'v1.0', updatedAt: '2026-02-20', downloadCount: 95 },
  { id: 9, title: 'Claim Status Tracking Tutorial', description: 'Step-by-step training video showing how to track claim statuses and respond to queries.', category: 'training', fileType: 'video', fileSize: '189 MB', version: 'v1.0', updatedAt: '2025-10-30', downloadCount: 143 },
  { id: 10, title: 'ER Pre-Authorization Form', description: 'Emergency room pre-authorization request form for cases exceeding standard thresholds.', category: 'form', fileType: 'pdf', fileSize: '280 KB', version: 'v1.2', updatedAt: '2025-09-15', downloadCount: 733 },
  { id: 11, title: '2026 Benefit Schedule & Fee Table', description: 'Updated fee schedule and benefit limits applicable for all plans starting January 2026.', category: 'policy', fileType: 'doc', fileSize: '2.4 MB', version: 'v2026.1', updatedAt: '2026-01-01', downloadCount: 654 },
  { id: 12, title: 'System Admin & User Role Training', description: 'Training module for IT administrators on user provisioning, roles, and system settings.', category: 'training', fileType: 'video', fileSize: '320 MB', version: 'v1.0', updatedAt: '2026-02-25', downloadCount: 62 },
];

type DocCategory = 'all' | 'user_manual' | 'policy' | 'form' | 'training';
const CATEGORY_LABELS: Record<DocCategory, string> = { all: 'All', user_manual: 'User Manuals', policy: 'Policies', form: 'Forms', training: 'Training' };
const FILE_COLORS: Record<string, string> = { pdf: 'bg-red-100 text-red-600', doc: 'bg-blue-100 text-blue-600', video: 'bg-purple-100 text-purple-600', xlsx: 'bg-green-100 text-green-600' };

const KnowledgeBasePage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<DocCategory>('all');

  const filtered = MOCK_DOCUMENTS.filter(d => {
    const matchCat = category === 'all' || d.category === category;
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const FileIcon = ({ type }: { type: string }) => {
    if (type === 'video') return <Video className="w-6 h-6" />;
    if (type === 'doc') return <FileText className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Knowledge Base</h1>
          <p className="text-slate-500 mt-1">Access user manuals, policy documents, forms, and training materials.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">{filtered.length} document{filtered.length !== 1 ? 's' : ''}</p>
          <p className="text-xs text-slate-400">Last updated: Mar 3, 2026</p>
        </div>
      </header>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input type="text" placeholder="Search documents..." className="generali-input pl-12 py-3 text-base" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(CATEGORY_LABELS) as DocCategory[]).map(cat => {
          const count = cat === 'all' ? MOCK_DOCUMENTS.length : MOCK_DOCUMENTS.filter(d => d.category === cat).length;
          return (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${category === cat ? 'bg-generali-red text-white shadow-lg shadow-generali-red/20' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
              {CATEGORY_LABELS[cat]} <span className="ml-1 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Document Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(doc => (
          <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="generali-card p-6 flex flex-col gap-4 group hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl flex-shrink-0 ${FILE_COLORS[doc.fileType] || 'bg-slate-100 text-slate-600'}`}>
                <FileIcon type={doc.fileType} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${doc.category === 'policy' ? 'bg-amber-100 text-amber-700' : doc.category === 'form' ? 'bg-green-100 text-green-700' : doc.category === 'training' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{CATEGORY_LABELS[doc.category as DocCategory]}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{doc.version}</span>
                </div>
                <h3 className="font-bold text-slate-800 group-hover:text-generali-red transition-colors leading-snug">{doc.title}</h3>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{doc.description}</p>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
              <span>{doc.fileSize} • Updated {doc.updatedAt}</span>
              <span className="flex items-center gap-1"><Download className="w-3 h-3" />{doc.downloadCount.toLocaleString()}</span>
            </div>
            <button onClick={() => alert(`Downloading: ${doc.title} (Simulated)`)} className="w-full py-2 rounded-xl border-2 border-slate-200 text-sm font-bold text-slate-600 hover:border-generali-red hover:text-generali-red hover:bg-generali-red/5 transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download
            </button>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No documents found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- ProductTour ---
const ProductTour = ({ onComplete }: { onComplete: () => void }) => {

  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "Welcome to Generali E-Hospital",
      content:
        "This portal allows you to manage cashless claims efficiently. Let's take a quick tour of the main features.",
      icon: ShieldCheck,
      highlight: "Welcome",
    },
    {
      title: "Real-time Dashboard",
      content:
        "Monitor claim statistics, system status, and stay updated with the latest announcements from Generali.",
      icon: LayoutDashboard,
      highlight: "Dashboard",
    },
    {
      title: "Smart Policy Search",
      content:
        "Search for insured members using Name & DOB, ID Card, or Policy Number to verify coverage instantly.",
      icon: Search,
      highlight: "Search",
    },
    {
      title: "Comprehensive Claim History",
      content:
        "Track every claim from submission to payment. Review detailed medical records and insurer feedback.",
      icon: History,
      highlight: "History",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
      >
        <div className="h-2 bg-slate-100 w-full">
          <motion.div
            className="h-full bg-generali-red"
            initial={{ width: "0%" }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-generali-red/10 rounded-xl">
              {React.createElement(steps[step].icon, {
                className: "w-8 h-8 text-generali-red",
              })}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Step {step + 1} of {steps.length}
              </p>
              <h2 className="text-xl font-bold text-slate-900">
                {steps[step].title}
              </h2>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            {steps[step].content}
          </p>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={onComplete}
              className="text-sm text-slate-400 font-medium hover:text-slate-600 transition-colors"
            >
              Skip Tutorial
            </button>
            <div className="flex gap-3">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={() =>
                  step < steps.length - 1 ? setStep(step + 1) : onComplete()
                }
                className="generali-btn-primary px-8 py-2.5 rounded-xl shadow-lg shadow-generali-red/20"
              >
                {step === steps.length - 1 ? "Finish" : "Next Step"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Decorative pulse to simulate "interaction" with the background */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-generali-red/5 rounded-full -z-10 blur-3xl"
      />
    </div>
  );
};

// --- Main App ---

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
        return <Dashboard onSearchClick={() => setActiveTab("search")} />;
      case "search":
        return <SearchPage onSelectInsured={setSelectedInsured} />;
      case "history":
        return <HistoryPage user={user} />;
      case "users":
        return <HospitalUserManagement />;
      case "knowledge":
        return <KnowledgeBasePage />;
      case "admin":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-slate-500">
              User management and system configuration.
            </p>
          </div>
        );
      default:
        return <Dashboard onSearchClick={() => setActiveTab("search")} />;
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

      <div
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 fixed lg:static inset-y-0 left-0 z-40`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(t) => {
            setActiveTab(t);
            setSelectedInsured(null);
          }}
          user={user}
        />
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            {user.role === "hospital_admin" && (
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-generali-red/10 rounded-lg">
                  <Building2 className="w-4 h-4 text-generali-red" />
                </div>
                <span className="font-bold text-slate-800 text-sm">{user.hospital}</span>
                <span className="w-px h-5 bg-slate-200 mx-1"></span>
              </div>
            )}
            <h2 className="font-bold text-slate-600 capitalize text-sm">
              {activeTab === "users" ? "User Management" : activeTab === "knowledge" ? "Knowledge Base" : activeTab.replace("-", " ")}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-generali-red rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">
                  {user.username}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {user.role === "hospital_admin" ? "Hospital Admin" : user.role}
                </p>
              </div>
              <div className="w-10 h-10 bg-generali-red/10 rounded-full flex items-center justify-center border border-generali-red/20">
                <UserIcon className="w-5 h-5 text-generali-red" />
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

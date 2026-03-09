import React, { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Building2,
    Users,
    User as UserIcon,
    Edit2,
    Trash2,
    UserPlus,
    ArrowLeft,
    Activity,
    FileText,
    CreditCard
} from "lucide-react";
import ReactECharts from "echarts-for-react";
import { Hospital, GeneraliUser } from "@/types";
import { storageService } from "@/services/storageService";
import { HospitalUserManagement } from "@/features/users/components/HospitalUserManagement";
import { Button, Card, Input, Badge } from "@/components/ui";

export const AdminDashboard = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        storageService.getAdminDashboardData().then(setData);
    }, []);

    if (!data) return <div className="p-8">Loading dashboard...</div>;

    const claimByHospitalChart = {
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        legend: { bottom: '0%', left: 'center' },
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            data: data.claimsByHospital.map((h: any) => ({ value: h.count, name: h.hospital })),
            emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
        }]
    };

    const hospitalSuccessChart = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: ['Approved', 'Rejected'], bottom: 0 },
        grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
        xAxis: { type: 'category', data: data.claimsByHospital.map((h: any) => h.hospital) },
        yAxis: { type: 'value' },
        series: [
            { name: 'Approved', type: 'bar', stack: 'total', data: data.claimsByHospital.map((h: any) => h.approved), itemStyle: { color: '#10b981' } },
            { name: 'Rejected', type: 'bar', stack: 'total', data: data.claimsByHospital.map((h: any) => h.rejected), itemStyle: { color: '#ef4444' } }
        ]
    };

    const financialChart = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: ['Amount (THB)'], bottom: 0 },
        xAxis: { type: 'value' },
        yAxis: { type: 'category', data: data.claimsByHospital.map((h: any) => h.hospital) },
        series: [
            { name: 'Amount (THB)', type: 'bar', data: data.claimsByHospital.map((h: any) => h.amount), itemStyle: { color: '#3b82f6' } }
        ]
    };

    return (
        <div className="p-8 space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">System Dashboard</h1>
                <p className="text-slate-500 mt-1">Cross-hospital claim metrics and performance.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Claims</p>
                    <p className="text-3xl font-bold text-slate-900">{data.totalClaims}</p>
                </Card>
                <Card className="border-l-4 border-l-emerald-500">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Approved</p>
                    <p className="text-3xl font-bold text-emerald-600">{data.approvedClaims}</p>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Payout</p>
                    <p className="text-3xl font-bold text-blue-600">฿{data.totalAmount.toLocaleString()}</p>
                </Card>
                <Card className="border-l-4 border-l-generali-red">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Hospitals</p>
                    <p className="text-3xl font-bold text-slate-900">{data.claimsByHospital.length}</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="flex items-center gap-4 bg-white border-l-4 border-l-amber-400">
                    <div className="p-3 bg-amber-50 rounded-xl">
                        <Building2 className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Hospital Claim</p>
                        <p className="text-lg font-bold text-slate-800">Bumrungrad International</p>
                        <p className="text-xs text-slate-500">124 claims this month</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 bg-white border-l-4 border-l-blue-400">
                    <div className="p-3 bg-blue-50 rounded-xl">
                        <Users className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top User Claim</p>
                        <p className="text-lg font-bold text-slate-800">Somchai R. (Admin)</p>
                        <p className="text-xs text-slate-500">42 claims processed</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <h2 className="font-bold text-lg mb-4">Claim Volume by Hospital</h2>
                    <ReactECharts option={claimByHospitalChart} style={{ height: 300 }} />
                </Card>
                <Card>
                    <h2 className="font-bold text-lg mb-4">Success Rate by Hospital</h2>
                    <ReactECharts option={hospitalSuccessChart} style={{ height: 300 }} />
                </Card>
                <Card className="lg:col-span-2">
                    <h2 className="font-bold text-lg mb-4">Financial Payout by Hospital</h2>
                    <ReactECharts option={financialChart} style={{ height: 300 }} />
                </Card>
            </div>
        </div>
    );
};

const HospitalDetailView = ({ hospital, onBack }: { hospital: Hospital, onBack: () => void }) => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        storageService.getAdminDashboardData().then(DashboardData => {
            const hData = DashboardData.claimsByHospital.find((h: any) => h.hospital === hospital.name) || { count: 0, approved: 0, rejected: 0, amount: 0 };
            setData(hData);
        });
    }, [hospital]);

    if (!data) return <div className="p-8">Loading details...</div>;

    const approvalRate = data.count > 0 ? Math.round((data.approved / data.count) * 100) : 0;

    return (
        <div className="flex flex-col space-y-8 bg-slate-50 min-h-full">
            <div className="px-8 pt-8">
                <Button variant="ghost" onClick={onBack} className="mb-6 -ml-4 flex items-center gap-2 text-slate-500 hover:text-slate-900">
                    <ArrowLeft className="w-4 h-4" /> Back to Hospitals
                </Button>

                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-slate-900">{hospital.name}</h1>
                            <Badge color={hospital.status === 'active' ? 'emerald' : 'slate'} variant="solid">
                                {hospital.status.toUpperCase()}
                            </Badge>
                        </div>
                        <p className="text-slate-500 flex items-center gap-2">
                            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-sm">{hospital.code}</span>
                            • {hospital.address}
                        </p>
                    </div>
                </div>

                {/* Dashboard Metrics */}
                <h2 className="text-xl font-bold mb-4">Hospital Performance Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-white border-l-4 border-l-blue-500">
                        <div className="flex items-center justify-between pb-2">
                            <p className="text-sm font-medium text-slate-500">Total Claims</p>
                            <FileText className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-3xl font-bold text-slate-900">{data.count}</p>
                    </Card>

                    <Card className="bg-white border-l-4 border-l-emerald-500">
                        <div className="flex items-center justify-between pb-2">
                            <p className="text-sm font-medium text-slate-500">Approved</p>
                            <Activity className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-3xl font-bold text-emerald-600">{data.approved}</p>
                        <p className="text-xs text-emerald-600/80 mt-1 font-medium">{approvalRate}% approval rate</p>
                    </Card>

                    <Card className="bg-white border-l-4 border-l-red-500">
                        <div className="flex items-center justify-between pb-2">
                            <p className="text-sm font-medium text-slate-500">Rejected</p>
                            <Activity className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-3xl font-bold text-red-600">{data.rejected}</p>
                    </Card>

                    <Card className="bg-white border-l-4 border-l-generali-red">
                        <div className="flex items-center justify-between pb-2">
                            <p className="text-sm font-medium text-slate-500">Total Payout</p>
                            <CreditCard className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-3xl font-bold text-blue-600">฿{data.amount.toLocaleString()}</p>
                    </Card>
                </div>
            </div>

            {/* Embedded User Management */}
            <div className="border-t border-slate-200 bg-white shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.05)]">
                <HospitalUserManagement hospitalId={hospital.id} />
            </div>
        </div>
    );
};

export const HospitalManagement = ({ onSelectHospital }: { onSelectHospital: (h: Hospital) => void }) => {
    const [selectedHospitalForDetail, setSelectedHospitalForDetail] = useState<Hospital | null>(null);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
    const [form, setForm] = useState({ name: '', code: '', address: '', status: 'active' as 'active' | 'inactive' });

    const fetchHospitals = () => storageService.getHospitals().then(setHospitals);
    useEffect(() => { fetchHospitals(); }, []);

    const openCreate = () => { setEditingHospital(null); setForm({ name: '', code: '', address: '', status: 'active' }); setShowModal(true); };
    const openEdit = (e: React.MouseEvent, h: Hospital) => {
        e.stopPropagation();
        setEditingHospital(h);
        setForm({ name: h.name, code: h.code, address: h.address, status: h.status });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (editingHospital) await storageService.updateHospital(editingHospital.id, form);
        else await storageService.createHospital(form);
        fetchHospitals(); setShowModal(false);
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (confirm('Delete hospital?')) { await storageService.deleteHospital(id); fetchHospitals(); }
    };

    if (selectedHospitalForDetail) {
        return <HospitalDetailView hospital={selectedHospitalForDetail} onBack={() => setSelectedHospitalForDetail(null)} />;
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Partner Hospitals</h2>
                <Button variant="primary" onClick={openCreate} className="shadow-sm text-sm" size="sm">
                    <Building2 className="w-4 h-4 mr-2" />Add Hospital
                </Button>
            </div>
            <Card noPadding className="overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Code</th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Hospital Name</th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {hospitals.map(h => (
                            <tr key={h.id} className="hover:bg-slate-50 cursor-pointer group" onClick={() => setSelectedHospitalForDetail(h)}>
                                <td className="px-6 py-4 font-mono text-sm text-slate-500">{h.code}</td>
                                <td className="px-6 py-4 font-bold text-slate-800 group-hover:text-generali-red transition-colors">{h.name}</td>
                                <td className="px-6 py-4">
                                    <Badge color={h.status === 'active' ? 'emerald' : 'slate'} variant="solid">
                                        {h.status.toUpperCase()}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={(e) => openEdit(e, h)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-2"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={(e) => handleDelete(e, h.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="font-bold text-xl mb-4">{editingHospital ? 'Edit Hospital' : 'Add Hospital'}</h3>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium mb-1">Code</label><Input type="text" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} /></div>
                            <div><label className="block text-sm font-medium mb-1">Name</label><Input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                            <div><label className="block text-sm font-medium mb-1">Address</label><Input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-generali-red focus:border-transparent outline-none transition-all" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
                                    <option value="active">Active</option><option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="ghost" onClick={() => setShowModal(false)} className="px-4 py-2">Cancel</Button>
                            <Button variant="primary" onClick={handleSave} className="px-6 py-2">Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const GeneraliUserManagement = () => {
    const [users, setUsers] = useState<GeneraliUser[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<GeneraliUser | null>(null);
    const [form, setForm] = useState({ name: '', email: '', username: '', role: 'admin' as const, department: '', status: 'active' as 'active' | 'inactive' });

    const fetchUsers = () => storageService.getGeneraliUsers().then(setUsers);
    useEffect(() => { fetchUsers(); }, []);

    const openCreate = () => { setEditingUser(null); setForm({ name: '', email: '', username: '', role: 'admin', department: '', status: 'active' }); setShowModal(true); };
    const openEdit = (u: GeneraliUser) => { setEditingUser(u); setForm({ name: u.name, email: u.email, username: u.username, role: u.role, department: u.department, status: u.status }); setShowModal(true); };

    const handleSave = async () => {
        if (editingUser) await storageService.updateGeneraliUser(editingUser.id, form);
        else await storageService.createGeneraliUser(form);
        fetchUsers(); setShowModal(false);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Delete user?')) { await storageService.deleteGeneraliUser(id); fetchUsers(); }
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Generali Internal Users</h2>
                <Button variant="primary" onClick={openCreate} className="shadow-sm text-sm" size="sm">
                    <UserPlus className="w-4 h-4 mr-2 inline" />Add Admin
                </Button>
            </div>
            <Card noPadding className="overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">User</th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Department</th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-800">{u.name}</p>
                                    <p className="text-xs text-slate-500">{u.email}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{u.department}</td>
                                <td className="px-6 py-4">
                                    <Badge color={u.status === 'active' ? 'emerald' : 'slate'} variant="solid">
                                        {u.status.toUpperCase()}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => openEdit(u)} className="text-blue-600 hover:text-blue-800 mr-3"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="font-bold text-xl mb-4">{editingUser ? 'Edit User' : 'Add User'}</h3>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium mb-1">Name</label><Input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                            <div><label className="block text-sm font-medium mb-1">Email</label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                            <div><label className="block text-sm font-medium mb-1">Username</label><Input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></div>
                            <div><label className="block text-sm font-medium mb-1">Department</label><Input type="text" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} /></div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="ghost" onClick={() => setShowModal(false)} className="px-4 py-2">Cancel</Button>
                            <Button variant="primary" onClick={handleSave} className="px-6 py-2">Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const AdminPanel = () => {
    const [tab, setTab] = useState('dashboard');
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

    // Reset selected hospital when tab changes
    useEffect(() => {
        setSelectedHospital(null);
    }, [tab]);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="bg-white border-b border-slate-200 px-8 py-4 flex gap-6">
                {[
                    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { id: 'hospitals', label: 'Hospitals', icon: Building2 },
                    { id: 'hospital_users', label: 'Hospital Users', icon: Users },
                    { id: 'internal_users', label: 'Generali Admins', icon: UserIcon }
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${tab === t.id ? 'bg-generali-red text-white shadow-md shadow-generali-red/20' : 'text-slate-500 hover:bg-slate-100'}`}
                    >
                        <t.icon className="w-4 h-4" /> {t.label}
                    </button>
                ))}
            </div>
            <div className="flex-1 overflow-auto">
                {tab === 'dashboard' && <AdminDashboard />}
                {tab === 'hospitals' && (
                    selectedHospital ? (
                        <HospitalDetailView
                            hospital={selectedHospital}
                            onBack={() => setSelectedHospital(null)}
                        />
                    ) : (
                        <HospitalManagement onSelectHospital={setSelectedHospital} />
                    )
                )}
                {tab === 'hospital_users' && <HospitalUserManagement />}
                {tab === 'internal_users' && <GeneraliUserManagement />}
            </div>
        </div>
    );
};

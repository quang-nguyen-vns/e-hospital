import React, { useState, useEffect } from "react";
import { Search, UserPlus, Edit2, Trash2, Users, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { HospitalUser } from "@/types";
import { storageService } from "@/services/storageService";
import { Button, Card, Input, Badge } from "@/components/ui";

type HospitalUserRole = 'receptionist' | 'nurse_coordinator' | 'billing_staff' | 'it_admin' | 'doctor';

const ROLE_LABELS: Record<HospitalUserRole, string> = {
    receptionist: 'Receptionist',
    nurse_coordinator: 'Nurse Coordinator',
    billing_staff: 'Billing Staff',
    it_admin: 'IT Admin',
    doctor: 'Doctor',
};

interface HospitalUserManagementProps {
    hospitalId?: number;
}

export const HospitalUserManagement: React.FC<HospitalUserManagementProps> = ({ hospitalId }) => {
    const [users, setUsers] = useState<HospitalUser[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<HospitalUser | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [form, setForm] = useState({ name: '', email: '', username: '', role: 'receptionist' as HospitalUserRole, department: '', hospital_id: hospitalId || 0 });
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const fetchUsers = () => { storageService.getHospitalUsers().then(setUsers); };
    useEffect(() => { fetchUsers(); }, []);

    const openCreate = () => { setEditingUser(null); setForm({ name: '', email: '', username: '', role: 'receptionist', department: '', hospital_id: hospitalId || 0 }); setShowModal(true); };
    const openEdit = (u: HospitalUser) => { setEditingUser(u); setForm({ name: u.name, email: u.email, username: u.username, role: u.role, department: u.department, hospital_id: u.hospital_id }); setShowModal(true); };

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
        if (hospitalId && u.hospital_id !== hospitalId) return false;
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
                <Button variant="primary" onClick={openCreate} className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" /> Add User
                </Button>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Users', value: filtered.length, color: 'text-slate-800', bg: 'bg-white' },
                    { label: 'Active', value: filtered.filter(u => u.status === 'active').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Inactive', value: filtered.filter(u => u.status === 'inactive').length, color: 'text-slate-500', bg: 'bg-slate-50' },
                    { label: 'Roles', value: [...new Set(filtered.map(u => u.role))].length, color: 'text-generali-red', bg: 'bg-red-50' },
                ].map((s, i) => (
                    <Card key={i} className={`${s.bg}`} noPadding>
                        <div className="p-5">
                            <p className="text-sm text-slate-500">{s.label}</p>
                            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        icon={<Search className="w-4 h-4 text-slate-400" />}
                    />
                </div>
                <select
                    className="w-full max-w-[200px] px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-generali-red focus:border-transparent outline-none transition-all"
                    value={filterRole}
                    onChange={e => setFilterRole(e.target.value)}
                >
                    <option value="all">All Roles</option>
                    {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <span className="text-sm text-slate-400 ml-auto">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Table */}
            <Card noPadding className="overflow-hidden">
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
                                    <Badge color={
                                        u.role === 'receptionist' ? 'blue' :
                                            u.role === 'nurse_coordinator' ? 'purple' :
                                                u.role === 'billing_staff' ? 'amber' :
                                                    u.role === 'it_admin' ? 'slate' : 'emerald'
                                    } variant="subtle">
                                        {ROLE_LABELS[u.role]}
                                    </Badge>
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
            </Card>

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
                                        <Input
                                            type={f.type}
                                            placeholder={f.placeholder}
                                            value={(form as any)[f.key]}
                                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                    <select
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-generali-red focus:border-transparent outline-none transition-all"
                                        value={form.role}
                                        onChange={e => setForm({ ...form, role: e.target.value as HospitalUserRole })}
                                    >
                                        {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                                <Button variant="secondary" onClick={() => setShowModal(false)} className="px-6">Cancel</Button>
                                <Button
                                    variant="primary"
                                    onClick={handleSave}
                                    disabled={saving || !form.name || !form.email}
                                    className="px-8"
                                >
                                    {saving ? 'Saving...' : editingUser ? 'Save Changes' : 'Create User'}
                                </Button>
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
                                <Button variant="secondary" onClick={() => setDeleteConfirm(null)} className="flex-1">Cancel</Button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 py-2 px-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

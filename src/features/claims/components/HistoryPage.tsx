import React, { useState, useEffect } from "react";
import { Download, Search, AlertCircle, ChevronRight, X, FileText, File, Upload } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User, Claim, ClaimDocument, Hospital } from "@/types";
import { storageService } from "@/services/storageService";
import { Button, Card, Input } from "@/components/ui";

const CLAIM_STATUSES = {
    SUBMITTED: { label: "Submitted", color: "blue", description: "The claim has been successfully submitted and is awaiting review." },
    UNDER_REVIEW: { label: "Under Review", color: "indigo", description: "The claim is currently being assessed by the insurer." },
    PENDING_DOCUMENTS: { label: "Pending Documents", color: "amber", description: "The insurer requires additional documents or clarification." },
    RESUBMITTED: { label: "Resubmitted", color: "purple", description: "Missing information has been provided and is back in review." },
    APPROVED: { label: "Approved", color: "emerald", description: "The claim has been approved according to policy terms." },
    REJECTED: { label: "Rejected", color: "red", description: "The claim has been declined due to exclusions or other reasons." },
    PAID: { label: "Paid", color: "teal", description: "Payment has been successfully processed and transferred." },
    CLOSED: { label: "Closed", color: "slate", description: "The claim lifecycle is fully completed." },
};

export const HistoryPage = ({ user }: { user: User }) => {
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

    const [hospitals, setHospitals] = useState<Hospital[]>([]);

    useEffect(() => {
        fetchClaims();
        storageService.getHospitals().then(data => setHospitals(data));
    }, []);

    useEffect(() => {
        if (selectedClaim) {
            fetchDocuments(selectedClaim.id);
        }
    }, [selectedClaim]);

    // Filtering and Sorting States
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [filterType, setFilterType] = useState("ALL");
    const [filterHospital, setFilterHospital] = useState("ALL");
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });

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

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedClaims = claims
        .filter((claim) => {
            // Search
            const searchStr = searchTerm.toLowerCase();
            const matchesSearch =
                `${claim.first_name} ${claim.last_name}`.toLowerCase().includes(searchStr) ||
                claim.policy_no.toLowerCase().includes(searchStr);

            // Filters
            const matchesStatus = filterStatus === "ALL" || claim.status === filterStatus;
            const matchesType = filterType === "ALL" || claim.claim_type === filterType;
            const matchesHospital = filterHospital === "ALL" || claim.hospital_id?.toString() === filterHospital;

            return matchesSearch && matchesStatus && matchesType && matchesHospital;
        })
        .sort((a, b) => {
            let aVal: any = '';
            let bVal: any = '';

            if (sortConfig.key === 'id') {
                aVal = a.id; bVal = b.id;
            } else if (sortConfig.key === 'member') {
                aVal = `${a.first_name} ${a.last_name}`.toLowerCase();
                bVal = `${b.first_name} ${b.last_name}`.toLowerCase();
            } else if (sortConfig.key === 'type') {
                aVal = a.claim_type; bVal = b.claim_type;
            } else if (sortConfig.key === 'date') {
                aVal = new Date(a.treatment_date).getTime();
                bVal = new Date(b.treatment_date).getTime();
            } else if (sortConfig.key === 'amount') {
                aVal = a.amount; bVal = b.amount;
            } else if (sortConfig.key === 'status') {
                aVal = a.status; bVal = b.status;
            }

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

    return (
        <div className="p-8 space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Claims</h1>
                    <p className="text-slate-500 mt-1">
                        Review and track the status of all submitted claims.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => setShowStatusTips(!showStatusTips)}
                        className="flex items-center gap-2"
                    >
                        <AlertCircle className="w-4 h-4" />
                        Status Definitions
                    </Button>
                    <Button variant="secondary" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                </div>
            </header>

            <Card className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 min-w-[200px] relative">
                    <Input
                        type="text"
                        placeholder="Search by Member or Policy No..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={<Search className="h-5 w-5 text-slate-400" />}
                    />
                </div>

                <select
                    className="md:w-48 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-generali-red focus:border-transparent outline-none transition-all"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="ALL">All Statuses</option>
                    {Object.keys(CLAIM_STATUSES).map(status => (
                        <option key={status} value={status}>{(CLAIM_STATUSES as any)[status].label}</option>
                    ))}
                </select>

                <select
                    className="md:w-48 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-generali-red focus:border-transparent outline-none transition-all"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="ALL">All Types</option>
                    <option value="OPD">OPD</option>
                    <option value="IPD">IPD</option>
                    <option value="DENTAL">Dental</option>
                    <option value="ER">ER</option>
                </select>

                {(user.role === 'admin' || user.role === 'generali_user') && (
                    <select
                        className="md:w-48 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-generali-red focus:border-transparent outline-none transition-all"
                        value={filterHospital}
                        onChange={(e) => setFilterHospital(e.target.value)}
                    >
                        <option value="ALL">All Hospitals</option>
                        {hospitals.map(h => (
                            <option key={h.id} value={h.id.toString()}>{h.name}</option>
                        ))}
                    </select>
                )}
            </Card>

            {showStatusTips && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {Object.entries(CLAIM_STATUSES).map(([key, value]) => (
                        <Card key={key} className="p-4" noPadding>
                            <div className="p-4">
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
                        </Card>
                    ))}
                </motion.div>
            )}

            <Card noPadding className="overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th onClick={() => requestSort('id')} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100">
                                Claim ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => requestSort('member')} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100">
                                Member {sortConfig.key === 'member' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => requestSort('type')} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100">
                                Type {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            {(user.role === 'admin' || user.role === 'generali_user') && (
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Hospital
                                </th>
                            )}
                            <th onClick={() => requestSort('date')} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100">
                                Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => requestSort('amount')} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100">
                                Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => requestSort('status')} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100">
                                Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredAndSortedClaims.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                                    No claims found matching your filters.
                                </td>
                            </tr>
                        ) : filteredAndSortedClaims.map((claim) => {
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
                                    {(user.role === 'admin' || user.role === 'generali_user') && (
                                        <td className="px-6 py-4 text-sm text-slate-600 truncate max-w-[150px]">
                                            {claim.hospital_name}
                                        </td>
                                    )}
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
            </Card>

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
                                            <label className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 px-3 py-1 text-xs cursor-pointer">
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
                                                <Button
                                                    variant="primary"
                                                    onClick={() => setIsReviewing(true)}
                                                    className="px-8"
                                                >
                                                    Change Status
                                                </Button>
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
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                                            New Status
                                                        </label>
                                                        <select
                                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-generali-red focus:border-transparent outline-none transition-all"
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
                                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-generali-red focus:border-transparent outline-none transition-all min-h-[100px]"
                                                            placeholder="Add internal notes or feedback for the hospital..."
                                                            value={adminComments}
                                                            onChange={(e) => setAdminComments(e.target.value)}
                                                        ></textarea>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-4">
                                                    <Button
                                                        variant="primary"
                                                        onClick={handleUpdateStatus}
                                                        className="px-12"
                                                        disabled={updating}
                                                    >
                                                        {updating ? "Updating..." : "Submit Review"}
                                                    </Button>
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

import React, { useState } from "react";
import { Search, FileText, Video, BookOpen, Download } from "lucide-react";
import { motion } from "motion/react";
import { Button, Card, Input, Badge } from "@/components/ui";

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

export const KnowledgeBasePage = () => {
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
                <Input
                    type="text"
                    placeholder="Search documents..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    icon={<Search className="w-5 h-5 text-slate-400" />}
                />
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(doc => (
                    <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="flex flex-col gap-4 group hover:shadow-xl transition-all duration-300 h-full">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl flex-shrink-0 ${FILE_COLORS[doc.fileType] || 'bg-slate-100 text-slate-600'}`}>
                                    <FileIcon type={doc.fileType} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <Badge color={doc.category === 'policy' ? 'amber' : doc.category === 'form' ? 'emerald' : doc.category === 'training' ? 'purple' : 'blue'} variant="subtle" size="sm">
                                            {CATEGORY_LABELS[doc.category as DocCategory]}
                                        </Badge>
                                        <span className="text-[10px] text-slate-400 font-mono">{doc.version}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 group-hover:text-generali-red transition-colors leading-snug">{doc.title}</h3>
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{doc.description}</p>
                            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 mt-auto">
                                <span>{doc.fileSize} • Updated {doc.updatedAt}</span>
                                <span className="flex items-center gap-1"><Download className="w-3 h-3" />{doc.downloadCount.toLocaleString()}</span>
                            </div>
                            <Button variant="outline" onClick={() => alert(`Downloading: ${doc.title} (Simulated)`)} className="w-full flex items-center justify-center gap-2">
                                <Download className="w-4 h-4" /> Download
                            </Button>
                        </Card>
                    </motion.div>
                ))}
            </div>
            {filtered.length === 0 && (
                <div className="py-16 text-center">
                    <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">No documents found.</p>
                </div>
            )}
        </div>
    );
};

import React, { useState } from "react";
import { Search, ChevronRight, User as UserIcon, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { Insured, Policy } from "@/types";
import { storageService } from "@/services/storageService";
import { Button, Card, Input, Badge } from "@/components/ui";

export const SearchPage = ({
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
                    <Card className="p-8">
                        <h2 className="font-bold text-lg mb-6">Search Criteria</h2>
                        <form onSubmit={handleSearch} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Search By
                                </label>
                                <select
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-generali-red focus:border-transparent outline-none transition-all"
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
                                <Input
                                    type="text"
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
                                    <Input
                                        type="date"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                className="py-3"
                            >
                                {loading ? "Searching..." : "Search Member"}
                            </Button>
                        </form>
                    </Card>

                    {results.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card noPadding>
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
                            </Card>
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
                                <Card className="p-8">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex items-center gap-4">
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
                                                    <Badge color="slate" variant="subtle">
                                                        {selectedResult.gender}
                                                    </Badge>
                                                    <Badge color="slate" variant="subtle">
                                                        DOB: {selectedResult.dob}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge color="emerald" variant="subtle" size="md">
                                            ACTIVE COVERAGE
                                        </Badge>
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
                                        <Button
                                            variant="secondary"
                                            onClick={() => setSelectedResult(null)}
                                            className="px-8"
                                        >
                                            Clear Selection
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={() => onSelectInsured(selectedResult)}
                                            className="px-12 py-3 shadow-lg shadow-generali-red/20"
                                        >
                                            Start Cashless Claim
                                        </Button>
                                    </div>
                                </Card>

                                <Card className="bg-slate-900">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-white/10 rounded-xl">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1 border-0 text-white">
                                                Pre-Authorization Required
                                            </h4>
                                            <p className="text-sm leading-relaxed text-white">
                                                For IPD treatments exceeding ฿50,000, please ensure
                                                pre-authorization is obtained before admission to
                                                guarantee cashless payment.
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

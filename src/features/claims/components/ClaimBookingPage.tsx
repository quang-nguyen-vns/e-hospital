import React, { useState, useEffect } from "react";
import { ArrowLeft, FileText, Upload, X, AlertCircle } from "lucide-react";
import { Insured, Policy, ClaimDocument } from "@/types";
import { storageService } from "@/services/storageService";
import { Button, Card, Input, Badge } from "@/components/ui";

export const ClaimBookingPage = ({
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
                    <Card>
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
                                <Badge color="emerald" variant="subtle">
                                    COVERAGE ACTIVE
                                </Badge>
                            </div>
                        </div>
                    </Card>

                    <Card>
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
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <Card className="p-8">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Claim Type
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-generali-red focus:border-transparent outline-none transition-all"
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
                                    <Input
                                        type="number"
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
                                    <Input
                                        type="text"
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
                                            <Input
                                                type="date"
                                                value={admissionDate}
                                                onChange={(e) => setAdmissionDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Discharge Date (Est.)
                                            </label>
                                            <Input
                                                type="date"
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
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-generali-red focus:border-transparent outline-none transition-all min-h-[80px]"
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
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-generali-red focus:border-transparent outline-none transition-all min-h-[80px]"
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
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-generali-red focus:border-transparent outline-none transition-all min-h-[80px]"
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
                                    <label className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 px-3 py-1 text-xs cursor-pointer">
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
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={onBack}
                                    className="px-8"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="px-12"
                                    disabled={submitting}
                                >
                                    {submitting ? "Submitting..." : "Submit Claim"}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

import React, { useState } from "react";
import { ShieldCheck, LayoutDashboard, Search, History } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui";

export const ProductTour = ({ onComplete }: { onComplete: () => void }) => {
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
                            <Button
                                variant="primary"
                                onClick={() =>
                                    step < steps.length - 1 ? setStep(step + 1) : onComplete()
                                }
                                className="px-8 shadow-lg shadow-generali-red/20"
                            >
                                {step === steps.length - 1 ? "Finish" : "Next Step"}
                            </Button>
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

import React, { useState } from "react";
import { motion } from "motion/react";
import { User } from "@/types";
import { storageService } from "@/services/storageService";
import { Button, Input } from "@/components/ui";

export const LoginPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
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
                                <Input
                                    type="text"
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
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            {error && <p className="text-red-600 text-sm">{error}</p>}
                            <Button
                                type="submit"
                                fullWidth
                                className="py-3"
                            >
                                Sign In
                            </Button>
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
                            <Button
                                onClick={handleVerifyOtp}
                                fullWidth
                                className="py-3"
                            >
                                Verify & Access
                            </Button>
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

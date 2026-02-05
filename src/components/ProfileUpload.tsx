"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Camera, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function ProfileUpload() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setMessage({ type: "error", text: "Please select an image file." });
            return;
        }

        // Validate size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: "error", text: "Image must be less than 2MB." });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            // Convert to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = reader.result as string;

                const response = await fetch("/api/user/profile", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: base64 }),
                });

                if (response.ok) {
                    const data = await response.json();
                    // Update NextAuth session
                    await update({ image: base64 });
                    setMessage({ type: "success", text: "Hero uniform updated!" });
                } else {
                    setMessage({ type: "error", text: "Failed to upload image." });
                }
                setLoading(false);
            };
        } catch (error) {
            console.error("Upload error:", error);
            setMessage({ type: "error", text: "Something went wrong." });
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/50">
            <div className="flex flex-col items-center text-center">
                <h4 className="text-xl font-black uppercase tracking-tighter mb-2">Hero Profile</h4>
                <p className="text-slate-400 text-sm font-medium mb-8">Upload your avatar to be recognized across the academy!</p>

                <div className="relative group">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 overflow-hidden border-4 border-white shadow-xl group-hover:border-sky-100 transition-all">
                        {session?.user?.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={session.user.image}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl font-black text-slate-300">
                                {session?.user?.name?.charAt(0).toUpperCase()}
                            </div>
                        )}

                        {loading && (
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                        )}
                    </div>

                    <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:bg-sky-500 hover:scale-110 transition-all border-4 border-white">
                        <Camera className="w-5 h-5" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={loading} />
                    </label>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-6 flex items-center gap-2 px-4 py-2 rounded-xl border ${message.type === "success"
                                ? "bg-green-50 text-green-700 border-green-100"
                                : "bg-red-50 text-red-700 border-red-100"
                            }`}
                    >
                        {message.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{message.text}</span>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

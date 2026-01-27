"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, Gamepad2, CheckCircle2, RefreshCcw, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

interface Item {
    id: string;
    name: string;
    category: "Hygiene" | "Durability" | "Accessibility";
}

const gameData: Item[] = [
    { id: "1", name: "Touchless Faucet", category: "Hygiene" },
    { id: "2", name: "Braille Signage", category: "Accessibility" },
    { id: "3", name: "Quartz Countertops", category: "Durability" },
    { id: "4", name: "Automatic Hand Dryer", category: "Hygiene" },
    { id: "5", name: "60-inch Turning Radius", category: "Accessibility" },
    { id: "6", name: "Porcelain Tiles", category: "Durability" },
];

const categories = ["Hygiene", "Accessibility", "Durability"] as const;

export default function ActivityGamePage() {
    const params = useParams();
    const moduleId = params.id as string;

    const [items, setItems] = useState<Item[]>([]);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [feedback, setFeedback] = useState<{ id: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        // Shuffle items on mount
        setItems([...gameData].sort(() => Math.random() - 0.5));
    }, []);

    const handleDragEnd = (itemId: string, category: string) => {
        const item = gameData.find(i => i.id === itemId);
        if (item && item.category === category) {
            setScore(prev => prev + 1);
            setItems(prev => prev.filter(i => i.id !== itemId));
            setFeedback({ id: itemId, type: "success" });

            if (items.length === 1) {
                setCompleted(true);
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#38bdf8', '#4ade80', '#fbbf24']
                });
            }
        } else {
            setFeedback({ id: itemId, type: "error" });
        }

        setTimeout(() => setFeedback(null), 1000);
    };

    const bubbleVariants: Variants = {
        animate: {
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden relative">
            {/* --- Floating Background Decorations --- */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    variants={bubbleVariants}
                    animate="animate"
                    className="absolute top-20 left-[5%] w-64 h-64 bg-sky-50 rounded-full blur-3xl opacity-50"
                />
                <motion.div
                    variants={bubbleVariants}
                    animate="animate"
                    style={{ transitionDelay: "1s" }}
                    className="absolute bottom-40 right-[10%] w-96 h-96 bg-yellow-50 rounded-full blur-3xl opacity-50"
                />
            </div>

            {/* Navigation Header */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <Link
                        href={`/modules/${moduleId}`}
                        className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Briefing
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end mr-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 leading-none mb-1">Academy Drill</span>
                            <span className="text-[8px] font-black uppercase tracking-[0.1em] text-sky-500">Operation Hygiene</span>
                        </div>
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                            <Gamepad2 className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <header className="mb-16 text-center max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex py-2 px-4 bg-sky-50 text-sky-500 rounded-full font-black text-[10px] uppercase tracking-widest border border-sky-100 mb-6"
                    >
                        Skill Simulation
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6 uppercase leading-none">
                        Category <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">Calibration</span>
                    </h1>
                    <p className="text-slate-400 text-lg font-medium">
                        Drag each component into its correct operational category to secure its placement.
                    </p>
                </header>

                {completed ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-[3rem] p-16 shadow-2xl shadow-sky-100 border border-slate-50 text-center max-w-2xl mx-auto relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-green-500 shadow-inner">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <h2 className="text-4xl font-black mb-4 text-slate-900 uppercase tracking-tighter">Perfect Scan!</h2>
                            <p className="text-slate-400 font-medium text-lg mb-10">You have successfully categorized all academy features.</p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-10 py-5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 transition-all border border-slate-100"
                                >
                                    <RefreshCcw className="w-5 h-5" />
                                    Recalibrate
                                </button>
                                <Link
                                    href={`/quizzes/${moduleId}`}
                                    className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-sky-500 transition-all shadow-xl"
                                >
                                    Proceed to Exam
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                        {/* Decor */}
                        <div className="absolute top-0 right-0 p-8 scale-[4] opacity-5 pointer-events-none">
                            <ShieldCheck className="w-16 h-16" />
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
                        {/* Items Source */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1 h-4 bg-sky-500 rounded-full" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Units</h3>
                            </div>
                            <div className="relative min-h-[400px] flex flex-col gap-4">
                                <AnimatePresence>
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            whileDrag={{ scale: 1.05, rotate: 2, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                                            drag
                                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                            dragSnapToOrigin
                                            onDragEnd={(e, info) => {
                                                const targets = document.querySelectorAll(".category-drop-zone");
                                                targets.forEach(target => {
                                                    const rect = target.getBoundingClientRect();
                                                    if (
                                                        info.point.x > rect.left &&
                                                        info.point.x < rect.right &&
                                                        info.point.y > rect.top &&
                                                        info.point.y < rect.bottom
                                                    ) {
                                                        handleDragEnd(item.id, target.getAttribute("data-category")!);
                                                    }
                                                });
                                            }}
                                            className="cursor-move p-6 bg-white border border-slate-100 rounded-[2rem] shadow-lg shadow-slate-100/50 hover:border-sky-300 hover:shadow-xl transition-all select-none group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-lg filter grayscale group-hover:grayscale-0 transition-all">
                                                    📦
                                                </div>
                                                <span className="font-black text-xs uppercase tracking-widest text-slate-700">{item.name}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {items.length === 0 && !completed && (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-300 py-12">
                                        <div className="animate-spin mb-4">⚙️</div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Processing...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Drop Zones */}
                        <div className="lg:col-span-3 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {categories.map((cat) => (
                                    <div
                                        key={cat}
                                        data-category={cat}
                                        className="category-drop-zone h-64 bg-white border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center gap-6 transition-all hover:border-sky-500 hover:bg-sky-50/20 group relative overflow-hidden"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-sky-100 transition-colors shadow-inner">
                                            <span className="text-3xl opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all">
                                                {cat === "Hygiene" ? "🧼" : cat === "Accessibility" ? "♿" : "🛡️"}
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <h4 className="font-black text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-widest text-[10px] mb-1">
                                                {cat}
                                            </h4>
                                            <p className="text-[8px] text-slate-300 uppercase tracking-[0.2em] font-black">Drop Interface</p>
                                        </div>
                                        {/* Background ID */}
                                        <div className="absolute -bottom-4 -right-4 text-slate-50 font-black text-6xl pointer-events-none group-hover:text-sky-500/10 transition-colors">
                                            {cat[0]}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Score Display */}
                            <div className="bg-slate-900 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative shadow-2xl shadow-sky-900/10">
                                <div className="relative z-10 flex-shrink-0">
                                    <h3 className="text-slate-500 uppercase tracking-[0.3em] font-black text-[10px] mb-3">Calibration Progress</h3>
                                    <p className="text-5xl font-black tracking-tighter">
                                        {score} <span className="text-slate-700 text-3xl mx-1">/</span> <span className="text-slate-700 text-3xl font-black">{gameData.length}</span>
                                    </p>
                                </div>
                                <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden relative z-10 shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(score / gameData.length) * 100}%` }}
                                        transition={{ type: "spring", stiffness: 50 }}
                                        className="h-full bg-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.7)]"
                                    />
                                </div>
                                {/* Background Decor */}
                                <div className="absolute top-0 right-0 p-8 text-sky-500/5 scale-[6] pointer-events-none uppercase font-black tracking-tighter select-none">
                                    HERO
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="py-20 border-t border-slate-50 bg-white">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3 opacity-30">
                        <ShieldCheck className="text-slate-900 w-5 h-5" />
                        <span className="font-black text-[10px] uppercase tracking-widest text-slate-900">Toilet Hero Academy</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-200">© 2026 Simulation Systems</p>
                </div>
            </footer>
        </div>
    );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Gamepad2, CheckCircle2, RefreshCcw } from "lucide-react";
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
                    colors: ['#2563eb', '#10b981', '#f59e0b']
                });
            }
        } else {
            setFeedback({ id: itemId, type: "error" });
        }

        setTimeout(() => setFeedback(null), 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Navigation Header */}
            <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link
                        href={`/modules/${moduleId}`}
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Module</span>
                    </Link>
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                        <Gamepad2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Activity</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <header className="mb-12 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4"
                    >
                        Sort the Features
                    </motion.h1>
                    <p className="text-slate-500 max-w-lg mx-auto">
                        Categorize the restroom features correctly to complete the activity.
                    </p>
                </header>

                {completed ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-3xl p-12 shadow-2xl shadow-blue-100 border border-blue-50 text-center max-w-2xl mx-auto"
                    >
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-slate-900">Great Job!</h2>
                        <p className="text-slate-600 mb-8">You've successfully categorized all restroom features.</p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                            >
                                <RefreshCcw className="w-5 h-5" />
                                Play Again
                            </button>
                            <Link
                                href={`/quizzes/${moduleId}`}
                                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-200"
                            >
                                Next to Quiz
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        {/* Items Source */}
                        <div className="lg:col-span-1 space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Pending Items</h3>
                            <div className="relative min-h-[400px]">
                                <AnimatePresence>
                                    {items.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            whileDrag={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
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
                                            className="cursor-move p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-400 hover:shadow-md transition-shadow select-none mb-3"
                                        >
                                            <span className="font-bold text-slate-700">{item.name}</span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {items.length === 0 && !completed && (
                                    <div className="flex items-center justify-center h-full text-slate-300 italic">
                                        Loading items...
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Drop Zones */}
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {categories.map((cat) => (
                                <div
                                    key={cat}
                                    data-category={cat}
                                    className="category-drop-zone h-48 bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all hover:border-blue-300 hover:bg-blue-50/30 group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                        <span className="text-2xl opacity-50 text-slate-400 group-hover:opacity-100 group-hover:text-blue-500 transition-opacity">
                                            {cat === "Hygiene" ? "🧼" : cat === "Accessibility" ? "♿" : "🛡️"}
                                        </span>
                                    </div>
                                    <h4 className="font-extrabold text-slate-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest text-xs">
                                        {cat}
                                    </h4>
                                    <p className="text-[10px] text-slate-300 uppercase font-medium">Drop here</p>
                                </div>
                            ))}

                            {/* Score Display */}
                            <div className="sm:col-span-2 bg-slate-900 rounded-3xl p-8 text-white flex items-center justify-between overflow-hidden relative">
                                <div className="relative z-10">
                                    <h3 className="text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-1">Your Progress</h3>
                                    <p className="text-3xl font-black">
                                        {score} <span className="text-slate-600 text-xl">/ {gameData.length}</span>
                                    </p>
                                </div>
                                <div className="w-1/2 h-2 bg-slate-800 rounded-full overflow-hidden relative z-10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(score / gameData.length) * 100}%` }}
                                        className="h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                                    />
                                </div>
                                {/* Background Decor */}
                                <div className="absolute top-0 right-0 p-8 text-blue-500/10 scale-[5] pointer-events-none uppercase font-black tracking-tighter">
                                    GAME
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

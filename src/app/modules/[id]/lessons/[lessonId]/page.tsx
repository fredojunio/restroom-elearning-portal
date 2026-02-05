"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    PlayCircle,
    Gamepad2,
    HelpCircle,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    MonitorPlay,
    RotateCcw,
    Trophy,
    Send,
    Target,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

// --- Types & Dummy Data ---

interface Question {
    id: string;
    type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "MULTIPLE_SELECT" | "TEXT_INPUT";
    question: string;
    options?: string[];
}

interface Slide {
    id: string;
    type: "title" | "content" | "image" | "video" | "game" | "quiz";
    title: string;
    subtitle?: string;
    content?: string;
    image?: string;
    videoUrl?: string;
    gameType?: string;
    questions?: Question[];
    order: number;
    mascot?: string;
}

const dummySlides: Slide[] = [
    {
        id: "slide-1",
        type: "title",
        title: "Welcome to Toilet Heroes",
        subtitle: "Clean Toilets Keep Us Healthy",
        content: "Meet our friendly mascot guide who explains that toilets are shared spaces. To keep everyone healthy, we all have a part to play!",
        order: 1
    },
    {
        id: "slide-2",
        type: "content",
        title: "Hi there, Hero",
        content: "Meet our friendly mascot guide who explains that toilets are shared spaces. To keep everyone healthy, we all have a part to play!",
        order: 2,
        mascot: "/mascots/mascot-greeting.png"
    },
    {
        id: "slide-3",
        type: "content",
        title: "Meet the Invisible Germs",
        content: "• Germs are invisible but real\n• They love wet surfaces\n• They can live on faucet handles for hours\n• But we have a secret weapon: Hygiene!",
        order: 3,
        mascot: "/mascots/mascot-pointing.png"
    },
    {
        id: "slide-4",
        type: "game",
        title: "Germ Hunter Game",
        gameType: "Drag to Disinfect",
        content: "Drag all 6 invisible germs into the 'Sanitizer' portal to clear the restroom!",
        order: 4
    },
    {
        id: "slide-5",
        type: "image",
        title: "How Germs Travel",
        image: "🦠",
        content: "Germs often gather on door handles and light switches. Look closely!",
        order: 5,
        mascot: "/mascots/mascot-pointing.png"
    },
    {
        id: "slide-germ-story",
        type: "game",
        title: "Tiny Germs, Big Impact",
        gameType: "Story Interaction",
        content: "A simple story: Toilet → Hands → Face. Children see the animated germ moving and must tap \"Wash Hands\" to stop it in its tracks!\n\nOutcome: Empowers children to see handwashing as a shield.",
        order: 6,
        mascot: "/mascots/mascot-scared.png"
    },
    {
        id: "slide-6",
        type: "quiz",
        title: "Master Knowledge Review",
        content: "Prove you're a Toilet Hero by passing this quick check!",
        questions: [
            {
                id: "q1",
                type: "MULTIPLE_CHOICE",
                question: "What is the most important tool for a Toilet Hero?",
                options: ["A cape", "Soap and Water", "A fast car", "A loud whistle"]
            },
            {
                id: "q2",
                type: "TRUE_FALSE",
                question: "Germs can be seen with the naked eye.",
                options: ["True", "False"]
            },
            {
                id: "q3",
                type: "TEXT_INPUT",
                question: "Describe one way you can help keep your school restroom clean."
            }
        ],
        order: 7
    },
    {
        id: "slide-7",
        type: "title",
        title: "🎉 Legendary Toilet Hero!",
        subtitle: "You've mastered the fundamentals of restroom hygiene. Go forth and shine!",
        order: 8
    }
];

// --- Specialized Game Component ---

const GermHunterGame = ({ onComplete }: { onComplete: () => void }) => {
    const [germs, setGerms] = useState([
        { id: 1, x: 50, y: 100 },
        { id: 2, x: 250, y: 50 },
        { id: 3, x: 450, y: 150 },
        { id: 4, x: 100, y: 300 },
        { id: 5, x: 350, y: 350 },
        { id: 6, x: 550, y: 250 },
    ]);
    const [isWon, setIsWon] = useState(false);
    const portalRef = useRef<HTMLDivElement>(null);

    const checkCollision = (id: number, point: { x: number, y: number }) => {
        if (!portalRef.current) return;
        const rect = portalRef.current.getBoundingClientRect();
        if (
            point.x > rect.left &&
            point.x < rect.right &&
            point.y > rect.top &&
            point.y < rect.bottom
        ) {
            setGerms(prev => {
                const remaining = prev.filter(g => g.id !== id);
                if (remaining.length === 0) {
                    setIsWon(true);
                    onComplete();
                    confetti({ particleCount: 100, spread: 50 });
                }
                return remaining;
            });
        }
    };

    return (
        <div className="relative w-full h-[500px] bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem] overflow-hidden flex items-center justify-center shadow-inner">
            {/* Background Info */}
            <div className="absolute top-8 left-8 text-left">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Restroom Area</h4>
                <p className="text-xs text-slate-300 font-bold">Germs Detected: {germs.length}</p>
            </div>

            {/* The Sanitizer Portal */}
            <div
                ref={portalRef}
                className={`w-40 h-40 rounded-full border-8 transition-all flex flex-col items-center justify-center gap-2 ${isWon ? 'bg-green-500 border-green-200 scale-110' : 'bg-blue-600 border-blue-400 animate-pulse'
                    }`}
            >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white">
                    <RotateCcw className={`w-8 h-8 ${!isWon && 'animate-spin-slow'}`} />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">Sanitizer</span>
            </div>

            {/* The Germs */}
            <AnimatePresence mode="popLayout">
                {germs.map((germ) => (
                    <motion.div
                        key={germ.id}
                        layout
                        drag
                        dragSnapToOrigin
                        onDragEnd={(e, info) => checkCollision(germ.id, info.point)}
                        whileDrag={{ scale: 1.2, rotate: 180 }}
                        className="absolute cursor-grab active:cursor-grabbing w-16 h-16 bg-orange-100 border-2 border-orange-300 rounded-2xl flex items-center justify-center text-3xl shadow-lg ring-4 ring-orange-100/50"
                        style={{ left: germ.x, top: germ.y }}
                    >
                        🦠
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Success Modal */}
            {isWon && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8"
                >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-2">Restroom Disinfected!</h3>
                    <p className="text-slate-500 font-medium mb-8">You found every germ. You may now proceed.</p>
                    <span className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl">Slide Unlocked</span>
                </motion.div>
            )}
        </div>
    );
};

// --- Germ Story Component ---

const GermStoryGame = ({ onComplete }: { onComplete: () => void }) => {
    const [germPos, setGermPos] = useState(0); // 0: Toilet, 1: Hands, 2: Face
    const [isShielded, setIsShielded] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (isFinished || isShielded) return;

        const interval = setInterval(() => {
            setGermPos((prev) => {
                if (prev < 2) return prev + 1;
                return 0; // Loop back for animation effect
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [isFinished, isShielded]);

    const handleWash = () => {
        setIsShielded(true);
        setTimeout(() => {
            setIsFinished(true);
            onComplete();
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#0ea5e9', '#ffffff']
            });
        }, 1000);
    };

    return (
        <div className="relative w-full max-w-4xl h-[500px] bg-sky-50/50 backdrop-blur-sm border-4 border-white rounded-[3rem] overflow-hidden flex flex-col items-center justify-center p-8">
            <div className="absolute top-8 left-8 text-left">
                <h4 className="text-sm font-black text-blue-900/40 uppercase tracking-widest mb-1">Story Mode</h4>
                <p className="text-xs text-blue-900/30 font-bold italic">See how germs travel...</p>
            </div>

            <div className="grid grid-cols-3 gap-12 w-full max-w-3xl items-center relative py-20">
                {/* Connection Lines */}
                <div className="absolute top-1/2 left-[15%] right-[15%] h-1 bg-blue-100 -translate-y-1/2 z-0">
                    <div className="absolute top-0 left-0 bottom-0 bg-blue-400 w-full animate-pulse" />
                </div>

                {/* Path Points */}
                <div className="flex flex-col items-center gap-6 relative z-10 transition-all duration-500">
                    <div className="w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center text-6xl border-4 border-blue-50">
                        🚽
                    </div>
                    <span className="text-sm font-black text-blue-900 uppercase tracking-widest bg-white/80 px-4 py-1.5 rounded-full shadow-sm">Toilet</span>
                </div>

                <div className="flex flex-col items-center gap-6 relative z-10 transition-all duration-500">
                    <div className="w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center text-6xl border-4 border-blue-50 relative">
                        🤲
                        {isShielded && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1.4, opacity: 1 }}
                                className="absolute -inset-4 bg-sky-500/20 rounded-full border-4 border-sky-500 flex items-center justify-center backdrop-blur-sm z-50 shadow-[0_0_30px_rgba(14,165,233,0.5)]"
                            >
                                <ShieldCheck className="w-16 h-16 text-sky-600" />
                            </motion.div>
                        )}
                    </div>
                    <span className="text-sm font-black text-blue-900 uppercase tracking-widest bg-white/80 px-4 py-1.5 rounded-full shadow-sm">Hands</span>
                </div>

                <div className="flex flex-col items-center gap-6 relative z-10 transition-all duration-500">
                    <div className="w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center text-6xl border-4 border-blue-50">
                        👧
                    </div>
                    <span className="text-sm font-black text-blue-900 uppercase tracking-widest bg-white/80 px-4 py-1.5 rounded-full shadow-sm">Face</span>
                </div>

                {/* The Moving Germ */}
                {!isShielded && (
                    <motion.div
                        animate={{
                            x: germPos === 0 ? '-100%' : germPos === 1 ? '0%' : '100%',
                            opacity: [0, 1, 1, 0],
                            scale: [1, 1.2, 1.2, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-6xl pointer-events-none drop-shadow-lg"
                    >
                        🦠
                    </motion.div>
                )}
            </div>

            <div className="mt-8 flex flex-col items-center gap-6">
                {!isFinished ? (
                    <button
                        onClick={handleWash}
                        className="px-12 py-5 bg-sky-600 text-white rounded-[2rem] font-black text-xl shadow-[0_15px_30px_rgba(14,165,233,0.3)] hover:bg-sky-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
                    >
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                            🧼
                        </div>
                        WASH HANDS!
                    </button>
                ) : (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-green-100 text-green-700 px-10 py-4 rounded-3xl flex items-center gap-3 font-black uppercase tracking-widest shadow-inner border border-green-200"
                    >
                        <CheckCircle className="w-6 h-6" />
                        Mission Accomplished!
                    </motion.div>
                )}
                <p className="text-blue-900/50 font-medium text-center max-w-md bg-white/40 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/40">
                    Stop germs from reaching your face! Use the shield of hygiene.
                </p>
            </div>
        </div>
    );
};

// --- Sub-Components (Standard Slides) ---

const TitleSlide = ({ title, subtitle }: Partial<Slide>) => (
    <div className="flex flex-col items-center justify-center text-center h-full space-y-8 relative">

        <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="mb-4 drop-shadow-2xl"
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mascots/mascot-pose.png" alt="Mascot" className="w-56 h-auto" />
        </motion.div>
        <h1 className="font-nerko tracking-wide text-6xl md:text-8xl font-black tracking-tighter text-blue-900 drop-shadow-sm leading-none pb-2 uppercase text-center">
            {title}
        </h1>
        <p className="text-2xl text-slate-400 font-black uppercase tracking-[0.3em] max-w-2xl leading-relaxed">
            {subtitle}
        </p>
    </div>
);

const ContentSlide = ({ title, content, mascot }: Partial<Slide>) => (
    <div className="flex flex-col h-full max-w-5xl mx-auto py-6 relative">
        <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl rotate-3">
                <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-blue-900 uppercase">
                {title}
            </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:items-start lg:items-center lg:justify-center relative z-10">
            <div className="flex-1 text-xl md:text-2xl leading-relaxed text-slate-500 space-y-6 whitespace-pre-line font-medium border-l-4 border-sky-100 pl-10 ml-8">
                {content}
            </div>

            {mascot && (
                <div className="hidden lg:block flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mascot} alt="Mascot" className="w-80 h-auto drop-shadow-2xl" />
                </div>
            )}
        </div>

        {!mascot && (
            <div className="absolute -right-16 bottom-0 hidden lg:block pointer-events-none opacity-20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/mascots/mascot-sitting.png" alt="Studying Hero" className="w-64" />
            </div>
        )}
    </div>
);

const ImageSlide = ({ title, image, content, mascot }: Partial<Slide>) => (
    <div className="flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto space-y-10 relative">
        {/* Mascot Decoration */}
        <div className="absolute -right-16 bottom-0 hidden lg:block pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mascot || "/mascots/mascot-sitting.png"} alt="Studying Hero" className="w-64 -scale-x-100" />
        </div>
        <div className="w-80 h-80 bg-white rounded-[4rem] border-2 border-slate-100 flex items-center justify-center text-[10rem] shadow-2xl relative group">
            <motion.span
                animate={{
                    rotate: [0, 5, -5, 5, 0],
                    scale: [1, 1.05, 1],
                    y: [0, -5, 0]
                }}
                transition={{ repeat: Infinity, duration: 4 }}
            >
                {image}
            </motion.span>
            {/* Decor */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-12">
                <ShieldCheck className="w-6 h-6" />
            </div>
        </div>
        <div>
            <h2 className="text-5xl font-black tracking-tighter text-blue-900 mb-4 uppercase">{title}</h2>
            <p className="text-2xl text-slate-500 font-medium leading-relaxed">{content}</p>
        </div>
    </div>
);

const VideoSlide = ({ title, content }: Partial<Slide>) => (
    <div className="flex flex-col h-full max-w-5xl mx-auto py-8 space-y-10 text-center">
        <h2 className="text-5xl font-black tracking-tighter text-blue-900 leading-tight uppercase">{title}</h2>
        <div className="aspect-video w-full bg-slate-900 rounded-[4rem] overflow-hidden shadow-2xl shadow-sky-900/10 relative group flex items-center justify-center border-8 border-white">
            <MonitorPlay className="w-32 h-32 text-white/5" />
            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-all" />
            <button className="absolute inset-0 flex items-center justify-center group-hover:bg-black/10 transition-all">
                <div className="p-10 bg-white rounded-full shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                    <PlayCircle className="w-16 h-16 text-sky-500" />
                </div>
            </button>
        </div>
        <p className="text-xl text-slate-400 font-bold uppercase tracking-[0.2em]">{content}</p>
    </div>
);

const GameLauncherSlide = ({ title, gameType, content, onStart }: any) => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 max-w-3xl mx-auto">
        <div className="p-12 bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-orange-100/50 relative overflow-hidden group">
            {/* Texture */}
            <div className="absolute top-0 right-0 p-8 text-orange-500/5 scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                <Gamepad2 className="w-64 h-64" />
            </div>

            <div className="relative z-10 font-sans">
                <div className="w-24 h-24 bg-orange-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl rotate-3">
                    <Gamepad2 className="w-12 h-12" />
                </div>
                <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                    {gameType}
                </span>
                <h2 className="text-4xl font-black text-blue-900 mb-4">{title}</h2>
                <p className="text-xl text-slate-600 font-medium mb-10 max-w-sm mx-auto leading-relaxed">{content}</p>
                <button
                    onClick={onStart}
                    className="px-12 py-5 bg-orange-600 text-white rounded-3xl font-black text-xl shadow-xl shadow-orange-200 hover:bg-orange-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto"
                >
                    <Target className="w-6 h-6" />
                    Begin Challenge
                </button>
            </div>
        </div>
    </div>
);

const QuizLauncherSlide = ({ title, content, mascot, onStart }: any) => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 max-w-3xl mx-auto font-sans">
        <div className="p-12 bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-purple-100/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-purple-500/5 scale-150 -rotate-12 group-hover:-rotate-45 transition-transform duration-1000">
                <HelpCircle className="w-64 h-64" />
            </div>

            {/* Mascot */}
            <div className="absolute -right-4 bottom-0 hidden sm:block pointer-events-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mascot || "/mascots/mascot-scared.png"} alt="Nervous Hero" className="w-32 rotate-12" />
            </div>

            <div className="relative z-10">
                <div className="w-24 h-24 bg-purple-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl -rotate-3">
                    <HelpCircle className="w-12 h-12" />
                </div>
                <h2 className="text-4xl font-black text-blue-900 mb-4">{title}</h2>
                <p className="text-xl text-slate-600 font-medium mb-10 max-w-sm mx-auto leading-relaxed">{content}</p>
                <button
                    onClick={onStart}
                    className="px-12 py-5 bg-purple-600 text-white rounded-3xl font-black text-xl shadow-xl shadow-purple-200 hover:bg-purple-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto"
                >
                    <Send className="w-6 h-6" />
                    Review Knowledge
                </button>
            </div>
        </div>
    </div>
);

// --- Sub-Components (Quiz Flow) ---

const InlineQuizFlow = ({ questions, onComplete }: { questions: Question[], onComplete: () => void }) => {
    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const q = questions[idx];

    const handleNext = () => {
        if (idx < questions.length - 1) {
            setIdx(idx + 1);
        } else {
            onComplete();
            confetti({ particleCount: 150, spread: 70, colors: ['#9333ea', '#6366f1'] });
        }
    };

    const isAnswered = answers[q.id] !== undefined && answers[q.id] !== "";

    return (
        <div className="w-full max-w-2xl mx-auto py-12">
            <motion.div
                key={idx}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="space-y-8"
            >
                <div className="flex items-center justify-between mb-8">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {q.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Step {idx + 1} of {questions.length}</span>
                </div>

                <h2 className="text-3xl font-black text-slate-900 leading-tight">
                    {q.question}
                </h2>

                <div className="space-y-4">
                    {q.type === "MULTIPLE_CHOICE" && q.options?.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => setAnswers({ ...answers, [q.id]: i })}
                            className={`w-full p-6 text-left rounded-3xl border-2 font-bold text-lg transition-all ${answers[q.id] === i ? 'bg-purple-600 border-purple-600 text-white shadow-xl rotate-1' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-purple-300'
                                }`}
                        >
                            {opt}
                        </button>
                    ))}

                    {q.type === "TRUE_FALSE" && (
                        <div className="grid grid-cols-2 gap-4">
                            {["True", "False"].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                                    className={`p-10 rounded-3xl border-2 font-black text-xl transition-all ${answers[q.id] === opt ? 'bg-purple-600 border-purple-600 text-white shadow-xl' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-purple-300'
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    )}

                    {q.type === "TEXT_INPUT" && (
                        <textarea
                            value={answers[q.id] || ""}
                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                            placeholder="Think about it and write here..."
                            className="w-full h-48 p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] focus:border-purple-500 outline-none font-medium text-lg transition-all"
                        />
                    )}
                </div>

                <div className="pt-8 flex justify-end">
                    <button
                        disabled={!isAnswered}
                        onClick={handleNext}
                        className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
                    >
                        {idx === questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// --- Main Page Component ---

export default function LessonDetailPage() {
    const params = useParams();
    const router = useRouter();
    const moduleId = params.id as string;

    const [currentIdx, setCurrentIdx] = useState(0);
    const [direction, setDirection] = useState(0);
    const [complete, setComplete] = useState(false); // Lesson final modal
    const [isMarked, setIsMarked] = useState(false); // API call status

    // Game states
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'completed'>('idle');
    // Quiz states
    const [quizState, setQuizState] = useState<'idle' | 'playing' | 'completed'>('idle');

    const slides = dummySlides;
    const totalSlides = slides.length;
    const currentSlide = slides[currentIdx];

    const handleNext = () => {
        if (currentIdx < totalSlides - 1) {
            setDirection(1);
            setCurrentIdx(currentIdx + 1);
            // Reset interaction states for next slide
            setGameState('idle');
            setQuizState('idle');
        }
    };

    const handlePrev = () => {
        if (currentIdx > 0) {
            setDirection(-1);
            setCurrentIdx(currentIdx - 1);
            setGameState('idle');
            setQuizState('idle');
        }
    };

    const jumpToSlide = (idx: number) => {
        setDirection(idx > currentIdx ? 1 : -1);
        setCurrentIdx(idx);
        setGameState('idle');
        setQuizState('idle');
    };

    const handleComplete = async () => {
        setIsMarked(true);
        confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
        setTimeout(() => setComplete(true), 1500);
    };

    // Logic to lock navigation
    const isSlideLocked =
        (currentSlide.type === "game" && gameState !== "completed") ||
        (currentSlide.type === "quiz" && quizState !== "completed");

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

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.95,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.92,
            transition: { duration: 0.3 }
        }),
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
            {/* 1. Header (Sticky) */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link
                        href={`/modules/${moduleId}`}
                        className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-all group"
                    >
                        <div className="p-2 bg-slate-50 group-hover:bg-sky-50 rounded-xl transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="hidden sm:inline font-black text-[10px] uppercase tracking-widest">End Mission</span>
                    </Link>

                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-500 mb-0.5 ml-1 leading-none">Hero Intel</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900">Step {currentIdx + 1}</span>
                            <span className="text-xs text-slate-300 font-bold">/</span>
                            <span className="text-xs text-slate-400 font-bold">{totalSlides}</span>
                        </div>
                    </div>

                    <div className="min-w-[150px] flex justify-end">
                        {isMarked ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-500 rounded-2xl border border-green-100 font-black text-[10px] uppercase tracking-widest">
                                <CheckCircle className="w-4 h-4" />
                                Secured
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Completion</p>
                                    <p className="text-[10px] font-black text-slate-900 uppercase leading-none">{Math.round(((currentIdx + 1) / totalSlides) * 100)}%</p>
                                </div>
                                <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg">
                                    {Math.round(((currentIdx + 1) / totalSlides) * 100)}%
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Progress Bar */}
                <div className="h-1.5 w-full bg-slate-50/50 overflow-hidden relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIdx + 1) / totalSlides) * 100}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="h-full bg-sky-500 shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                    />
                </div>
            </header>

            {/* 3. Main Slide Content Area */}
            <main className="relative pt-16 pb-24 h-screen flex items-center justify-center overflow-hidden">
                {/* --- Background Image --- */}
                <div
                    className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
                    style={{ backgroundImage: `url('${(currentIdx >= 2 && currentIdx <= 5) ? '/images/lesson-bg-germs.jpg' : '/images/lesson-bg.jpg'}')` }}
                />
                <div className="fixed inset-0 z-0 bg-white/5 backdrop-blur-[1px]" />

                {/* --- Floating Background Decorations --- */}
                <div className="fixed inset-0 pointer-events-none z-10">
                    <motion.div
                        variants={bubbleVariants}
                        animate="animate"
                        className="absolute top-20 left-[5%] w-64 h-64 bg-sky-100 rounded-full blur-3xl opacity-20"
                    />
                    <motion.div
                        variants={bubbleVariants}
                        animate="animate"
                        style={{ transitionDelay: "1s" }}
                        className="absolute bottom-40 right-[10%] w-96 h-96 bg-yellow-100 rounded-full blur-3xl opacity-20"
                    />
                </div>

                <div className="max-w-6xl w-full px-6 flex items-center justify-center relative z-20">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentIdx}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 35 },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.3 }
                            }}
                            className="w-full bg-white/20 backdrop-blur shadow-[0_0_50px_rgba(0,0,0,0.05)] rounded-[4rem] p-8 md:p-12 border border-white/40 max-h-[calc(100vh-200px)] flex items-center justify-center relative overflow-hidden"
                        >
                            {/* Dynamic Slide Switcher */}
                            <div className="w-full">
                                {currentSlide.type === "title" && <TitleSlide {...currentSlide} />}
                                {currentSlide.type === "content" && <ContentSlide {...currentSlide} />}
                                {currentSlide.type === "image" && <ImageSlide {...currentSlide} />}
                                {currentSlide.type === "video" && <VideoSlide {...currentSlide} />}

                                {/* Game Logic */}
                                {currentSlide.type === "game" && (
                                    gameState === "playing" ? (
                                        currentSlide.gameType === "Story Interaction" ? (
                                            <GermStoryGame onComplete={() => setGameState('completed')} />
                                        ) : (
                                            <GermHunterGame onComplete={() => setGameState('completed')} />
                                        )
                                    ) : (
                                        <GameLauncherSlide
                                            {...currentSlide}
                                            onStart={() => setGameState('playing')}
                                        />
                                    )
                                )}

                                {/* Quiz Logic */}
                                {currentSlide.type === "quiz" && (
                                    quizState === "playing" ? (
                                        <InlineQuizFlow
                                            questions={currentSlide.questions || []}
                                            onComplete={() => setQuizState('completed')}
                                        />
                                    ) : (
                                        <QuizLauncherSlide
                                            {...currentSlide}
                                            onStart={() => setQuizState('playing')}
                                        />
                                    )
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* 4. Navigation Footer */}
            <footer className="fixed bottom-0 left-0 right-0 z-30 bg-white/60 backdrop-blur-md p-5 border-t border-slate-200/50">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

                    <button
                        onClick={handlePrev}
                        disabled={currentIdx === 0 || gameState === "playing" || quizState === "playing"}
                        className="group flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 text-slate-400 rounded-3xl font-black text-xs uppercase tracking-widest hover:text-slate-900 hover:border-slate-300 transition-all disabled:opacity-0 disabled:pointer-events-none shadow-sm shadow-slate-200/50"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Previous
                    </button>

                    {/* Dot Navigation */}
                    <div className="flex items-center gap-3 bg-slate-50/50 p-3 rounded-full border border-slate-100">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => !isSlideLocked && jumpToSlide(i)}
                                disabled={isSlideLocked}
                                className={`transition-all duration-700 rounded-full ${currentIdx === i
                                    ? "w-10 h-3 bg-slate-900 shadow-[0_0_15px_rgba(15,23,42,0.2)]"
                                    : "w-3 h-3 bg-slate-200 hover:bg-slate-300"
                                    } ${isSlideLocked && 'cursor-not-allowed opacity-50'}`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>

                    <div className="min-w-[200px] flex justify-end">
                        {currentIdx === totalSlides - 1 ? (
                            <button
                                onClick={handleComplete}
                                disabled={isMarked}
                                className={`group relative w-full px-10 py-5 ${isMarked ? 'bg-green-600' : 'bg-slate-900'} text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 overflow-hidden shadow-2xl transition-all hover:scale-105 active:scale-95`}
                            >
                                <span className="relative z-10">{isMarked ? 'Completed' : 'Mark Complete'}</span>
                                {!isMarked && <CheckCircle className="relative z-10 w-5 h-5" />}
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={isSlideLocked}
                                className={`group w-full px-10 py-5 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl transition-all ${isSlideLocked
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                    : 'bg-slate-900 shadow-xl shadow-slate-200 hover:bg-sky-500 hover:scale-105 active:scale-95'
                                    }`}
                            >
                                <span>{isSlideLocked ? 'Locked Slide' : 'Continue Mission'}</span>
                                {!isSlideLocked && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        )}
                    </div>
                </div>
            </footer>

            {/* Completion Success Overlay */}
            <AnimatePresence>
                {complete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white max-w-lg w-full rounded-[3.5rem] p-16 text-center shadow-2xl border border-slate-100 relative overflow-visible"
                        >
                            {/* Mascot Celebration */}
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: -60, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="absolute -top-24 left-1/2 -translate-x-1/2 pointer-events-none"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/mascots/mascot-winning.png" alt="Winner" className="w-48 drop-shadow-2xl" />
                            </motion.div>

                            <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner rotate-3 relative z-10">
                                <Trophy className="w-12 h-12" />
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter relative z-10">Congratulations!</h2>
                            <p className="text-xl text-slate-400 font-medium mb-12 leading-relaxed relative z-10">
                                You've successfully mastered this module through games, quizzes, and study. Your progress is saved!
                            </p>
                            <div className="space-y-4 relative z-10">
                                <Link
                                    href={`/modules/${moduleId}`}
                                    className="block w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black shadow-xl hover:bg-slate-800 transition-all uppercase tracking-widest text-sm"
                                >
                                    Return to Module
                                </Link>
                                <button
                                    onClick={() => router.push(`/dashboard`)}
                                    className="block w-full py-4 text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] hover:text-blue-600 transition-all"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
        body {
          background-color: white;
          overflow-x: hidden;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}

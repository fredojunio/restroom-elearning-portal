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
    ShieldCheck,
    Star,
    XCircle
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import PlayfulButton from "@/components/PlayfulButton";
import { moduleTwoSlides, Module2Slide } from "@/data/module-2";

// --- Types & Dummy Data ---

interface Question {
    id: string;
    type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "MULTIPLE_SELECT" | "TEXT_INPUT" | "DRAG_AND_DROP";
    question: string;
    options?: string[];
    correctAnswer?: string;
    description?: string;
}

interface Slide {
    id: string;
    type: "title" | "content" | "image" | "video" | "game" | "quiz" | "comparison" | "celebration";
    title: string;
    subtitle?: string;
    content?: string;
    image?: string;
    videoUrl?: string;
    gameType?: string;
    questions?: Question[];
    order: number;
    mascot?: string;
    background?: string;
    invertChoices?: boolean;
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
        content: "Spot the animated germ moving from the toilet to the hand? Quickly tap to scrub it away, then press the 'Wash' button to clean the hands and stop the germ from reaching the face!",
        order: 6,
        mascot: "/mascots/mascot-scared.png"
    },
    {
        id: "slide-toilet-choice",
        type: "comparison",
        title: "Clean Toilets, Happy Friends",
        order: 7
    },
    {
        id: "slide-6",
        type: "quiz",
        title: "Fun Quiz Time!",
        content: "Prove you're a Toilet Hero by passing this quick check!",
        questions: [
            {
                id: "q1",
                type: "DRAG_AND_DROP",
                question: "True or False?",
                description: "Germs are so small we cannot see them. Is this true?",
                options: ["TRUE!", "FALSE!"],
                correctAnswer: "TRUE!"
            },
            {
                id: "q2",
                type: "DRAG_AND_DROP",
                question: "The Best Cleaner",
                description: "What removes germs best from our soapy hands?",
                options: ["Soap + Water!", "Wiping on clothes!"],
                correctAnswer: "Soap + Water!"
            }
        ],
        order: 8
    },
    {
        id: "slide-7",
        type: "celebration",
        title: "What a Toilet Hero!",
        content: "Students receive praise from the mascot and a 'Health Defender' badge.\n\nThis creates a sense of achievement and motivates them to continue to Module B.",
        mascot: "/mascots/mascot-hero.png",
        background: "/images/celebration-bg.jpg",
        order: 9
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
            const audio = new Audio('/sfx/germ.mp3');
            audio.play().catch(e => console.warn("Germ sfx play failed:", e));

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
        <div className="relative w-full h-[500px] border-4 border-dashed border-slate-200 rounded-[3rem] overflow-hidden flex items-center justify-center shadow-inner">
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

// --- Handwashing Game Component ---

const HandwashingGame = ({ onComplete }: { onComplete: () => void }) => {
    const [phase, setPhase] = useState<1 | 2 | 3>(1); // 1: Wet, 2: Soap/Scrub, 3: Rinse
    const [germs, setGerms] = useState([
        { id: 1, x: "90%", y: "40%", opacity: 1 },
        { id: 2, x: "30%", y: "50%", opacity: 1 },
        { id: 3, x: "50%", y: "30%", opacity: 1 },
        { id: 4, x: "20%", y: "45%", opacity: 1 },
        { id: 5, x: "65%", y: "45%", opacity: 1 },
        { id: 6, x: "40%", y: "60%", opacity: 1 },
    ]);
    const [isScrubbing, setIsScrubbing] = useState(false);
    const [scrubProgress, setScrubProgress] = useState(0);
    const [hasPlayedSfx, setHasPlayedSfx] = useState(false);

    const handleScrub = (id: number) => {
        if (phase !== 2) return;

        // Play scrubbing sound once per game
        if (!hasPlayedSfx) {
            const audio = new Audio('/sfx/washing.mp3');
            audio.volume = 0.4;
            audio.play().catch(e => console.warn("Washing sfx play failed:", e));
            setHasPlayedSfx(true);
        }

        setGerms(prev => prev.map(g => {
            if (g.id === id && g.opacity > 0) {
                const newOpacity = Math.max(0, g.opacity - 0.2);
                if (newOpacity === 0 && g.opacity > 0) {
                    setScrubProgress(curr => curr + 1);
                }
                return { ...g, opacity: newOpacity };
            }
            return g;
        }));
    };

    useEffect(() => {
        if (phase === 2 && scrubProgress === germs.length) {
            setTimeout(() => setPhase(3), 1000);
        }
    }, [scrubProgress, phase, germs.length]);

    const handleComplete = () => {
        onComplete();
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0ea5e9', '#ffffff', '#fbbf24']
        });
    };

    return (
        <div className="relative w-full max-w-4xl h-auto bg-sky-50/50 backdrop-blur-sm border-4 border-white rounded-3xl md:rounded-[4rem] overflow-hidden flex flex-col items-center justify-center p-4 md:p-8">
            {/* Phase Indicator */}
            <div className="w-full flex justify-between items-center mb-6">
                <div>
                    <h4 className="text-xs md:text-sm font-black text-blue-900/40 uppercase tracking-widest mb-1">Soap & Water Superheroes</h4>
                    <p className="text-[10px] md:text-xs text-blue-900/30 font-bold italic">
                        {phase === 1 && "Start by wetting your hands!"}
                        {phase === 2 && "Apply soap and scrub those germs!"}
                        {phase === 3 && "Almost done! Rinse away the bubbles."}
                    </p>
                </div>
                <div className="flex gap-1.5 md:gap-2">
                    {[1, 2, 3].map((p) => (
                        <div
                            key={p}
                            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${phase >= p ? 'bg-sky-500' : 'bg-sky-200'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Game Canvas */}
            <div className="relative w-full aspect-square md:aspect-video max-w-2xl bg-white rounded-2xl md:rounded-[3rem] shadow-2xl border-4 border-sky-100 flex items-center justify-center overflow-hidden">
                {/* Background (Sink/Water effect) */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-16 md:h-20 bg-slate-200 rounded-b-3xl border-x-4 border-b-4 border-slate-300" />
                </div>

                {/* The Hands */}
                <motion.div
                    animate={phase === 2 ? { x: [0, 5, -5, 5, 0], y: [0, -2, 2, -1, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                    className="relative text-[8rem] md:text-[12rem] select-none flex items-center justify-center pt-4 md:pt-8"
                >
                    🤲
                    {/* Water/Bubble Overlay */}
                    <AnimatePresence>
                        {phase === 1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.4 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-sky-300 rounded-full blur-xl mix-blend-overlay"
                            />
                        )}
                        {phase >= 2 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 0.6, scale: 1 }}
                                className="absolute inset-0 flex flex-wrap justify-center gap-1 p-8 pointer-events-none z-20"
                            >
                                {[...Array(12)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            y: [0, -10, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 2 + Math.random(),
                                            delay: Math.random()
                                        }}
                                        className="w-4 h-4 bg-white rounded-full opacity-60 blur-[1px]"
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* The Germs (Inside hand container to stay centered) */}
                    <AnimatePresence>
                        {phase < 3 && germs.map((germ) => (
                            <motion.div
                                key={germ.id}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: germ.opacity,
                                    scale: 1,
                                }}
                                exit={{ scale: 0, opacity: 0 }}
                                onMouseEnter={() => handleScrub(germ.id)}
                                onTouchStart={() => handleScrub(germ.id)}
                                className={`absolute text-3xl md:text-4xl cursor-pointer pointer-events-auto filter transition-all duration-300 z-30 ${phase === 1 ? 'grayscale opacity-50' : 'drop-shadow-lg'}`}
                                style={{
                                    left: germ.x,
                                    top: germ.y,
                                    margin: '-20px' // Center the 4xl text
                                }}
                            >
                                🦠
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Rinse Effect (Phase 3) */}
                <AnimatePresence>
                    {phase === 3 && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "100%" }}
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-16 md:w-24 bg-sky-200/40 backdrop-blur-[2px] z-10"
                        >
                            <div className="absolute bottom-0 w-full h-12 bg-sky-400/20 animate-pulse" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Interaction Button */}
            <div className="mt-6 md:mt-10">
                <AnimatePresence mode="wait">
                    {phase === 1 && (
                        <motion.div
                            key="wet"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <PlayfulButton
                                onClick={() => setPhase(2)}
                                color="blue"
                                className="px-8 py-3 md:px-12 md:py-5"
                            >
                                <div className="flex items-center gap-3 md:gap-4">
                                    <span className="text-xl md:text-2xl">💧</span>
                                    WET HANDS
                                </div>
                            </PlayfulButton>
                        </motion.div>
                    )}
                    {phase === 2 && (
                        <motion.div
                            key="soap"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className="px-4 py-1.5 md:px-6 md:py-2 bg-white/50 rounded-full border border-white text-blue-900/60 font-black text-[10px] uppercase tracking-widest">
                                Scrub Progress: {Math.round((scrubProgress / germs.length) * 100)}%
                            </div>
                            <div className="w-48 md:w-64 h-2 bg-sky-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-sky-500"
                                    animate={{ width: `${(scrubProgress / germs.length) * 100}%` }}
                                />
                            </div>
                            <p className="mt-2 text-blue-900/40 font-bold text-xs md:text-sm">Move your mouse/tap on the germs!</p>
                        </motion.div>
                    )}
                    {phase === 3 && (
                        <motion.div
                            key="rinse"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <PlayfulButton
                                onClick={handleComplete}
                                color="green"
                                className="px-8 py-3 md:px-12 md:py-5"
                            >
                                <div className="flex items-center gap-3 md:gap-4">
                                    <span className="text-xl md:text-2xl">✨</span>
                                    RINSE & FINISH!
                                </div>
                            </PlayfulButton>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};


const WhosNextGame = ({ onComplete }: { onComplete: () => void }) => {
    return (
        <div className="flex flex-col items-center justify-center p-10 bg-purple-50 rounded-[3rem] border-4 border-purple-200">
            <h3 className="text-2xl font-black text-purple-900 mb-4">Who's Next?</h3>
            <p className="text-purple-700 mb-8 text-center max-w-md">
                Game logic coming soon! Imagine a line of people waiting...
            </p>
            <PlayfulButton onClick={onComplete} color="purple">
                Finish Game
            </PlayfulButton>
        </div>
    );
};

const HeroOrOopsGame = ({ onComplete, invertChoices }: { onComplete: () => void, invertChoices?: boolean }) => {
    const [scenarios] = useState([
        { id: 1, title: "Flushing after use", isHero: true, image: "🚽" },
        { id: 2, title: "Leaving tissues on the floor", isHero: false, image: "🧻" },
        { id: 3, title: "Washing hands with soap", isHero: true, image: "🧼" },
    ]);
    const [currentStep, setCurrentStep] = useState(0);
    const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

    const handleChoice = (choice: boolean) => {
        if (choice === scenarios[currentStep].isHero) {
            setFeedback('correct');
            const audio = new Audio('/sfx/correct.mp3');
            audio.play().catch(e => console.warn("Correct sfx play failed:", e));
            confetti({ particleCount: 30, spread: 40 });
            setTimeout(() => {
                if (currentStep < scenarios.length - 1) {
                    setCurrentStep(currentStep + 1);
                    setFeedback('none');
                } else {
                    onComplete();
                }
            }, 1000);
        } else {
            setFeedback('wrong');
            const audio = new Audio('/sfx/wrong.mp3');
            audio.play().catch(e => console.warn("Wrong sfx play failed:", e));
            setTimeout(() => setFeedback('none'), 1000);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-sky-50 rounded-[3rem] border-4 border-sky-200 w-full max-w-md mx-auto relative">
            <div className="mb-4 flex flex-col items-center">
                <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-2">Progress: {currentStep + 1}/{scenarios.length}</span>
                <div className="w-48 h-2 bg-sky-100 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-sky-500" animate={{ width: `${((currentStep + 1) / scenarios.length) * 100}%` }} />
                </div>
            </div>

            <div className="w-40 h-40 bg-white rounded-3xl flex items-center justify-center text-8xl shadow-xl mb-8">
                {scenarios[currentStep].image}
            </div>

            <h3 className="text-2xl font-black text-slate-800 mb-2 text-center">{scenarios[currentStep].title}</h3>
            <p className="text-slate-500 font-bold mb-8 text-center">Is this a Toilet Hero choice?</p>

            <div className={`flex gap-4 w-full ${invertChoices ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* 
                    NOTE: True (Hero) is green, False (Oops) is red.
                    If invertChoices is false (Module 1): Oops (Red) Left, Hero (Green) Right. -> flex-row-reverse
                    If invertChoices is true (Module 2): Hero (Green) Left, Oops (Red) Right. -> flex-row
                */}
                <button
                    onClick={() => handleChoice(true)}
                    className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-2"
                >
                    <span>👍 Toilet Hero</span>
                </button>
                <button
                    onClick={() => handleChoice(false)}
                    className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-2"
                >
                    <span>👎 Oops</span>
                </button>
            </div>

            <AnimatePresence>
                {feedback !== 'none' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className={`absolute inset-0 flex items-center justify-center rounded-[3rem] backdrop-blur-sm z-10 ${feedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'}`}
                    >
                        <div className={`p-10 rounded-full shadow-2xl text-white text-6xl ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}>
                            {feedback === 'correct' ? '✨' : '❌'}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const CleanupChallengeGame = ({ onComplete, background }: { onComplete: () => void, background?: string }) => {
    const [messes, setMesses] = useState([
        { id: 1, type: 'tissue', x: '25%', y: '65%', fixed: false },
        { id: 2, type: 'spill', x: '75%', y: '75%', fixed: false },
        { id: 3, type: 'unflushed', x: '60%', y: '45%', fixed: false },
    ]);
    const [activeTool, setActiveTool] = useState<'none' | 'bin' | 'wipe' | 'flush'>('none');
    const [score, setScore] = useState(0);

    const handleMessClick = (messId: number, messType: string) => {
        if (
            (messType === 'tissue' && activeTool === 'bin') ||
            (messType === 'spill' && activeTool === 'wipe') ||
            (messType === 'unflushed' && activeTool === 'flush')
        ) {
            // Play SFX
            const sfxMap: Record<string, string> = {
                'tissue': '/sfx/correct.mp3',
                'spill': '/sfx/correct.mp3',
                'unflushed': '/sfx/correct.mp3'
            };

            const audio = new Audio(sfxMap[messType]);
            audio.play().catch(e => console.warn("Audio play failed:", e));

            setMesses(prev => prev.map(m => m.id === messId ? { ...m, fixed: true } : m));
            setScore(s => s + 100);
            confetti({ particleCount: 20, spread: 30 });
        }
    };

    useEffect(() => {
        if (messes.every(m => m.fixed)) {
            setTimeout(onComplete, 1500);
        }
    }, [messes, onComplete]);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
            <div className="w-full flex justify-between items-center mb-6 px-4">
                <div className="px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-sm">SCORE: {score}</div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-green-500" animate={{ width: `${(messes.filter(m => m.fixed).length / messes.length) * 100}%` }} />
                    </div>
                </div>
            </div>

            {/* Mission Briefing */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mb-6 px-6 py-4 bg-white rounded-4xl shadow-sm flex items-start gap-4"
            >
                <div className="p-3 bg-yellow-100 rounded-2xl text-2xl">📝</div>
                <div className="space-y-1">
                    <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Mission Briefing:</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-bold text-slate-500">
                        <div className="flex items-center gap-2"><span className="w-5 h-5 flex items-center justify-center bg-slate-900 text-white rounded-full text-[10px]">1</span> Pick a tool below</div>
                        <div className="flex items-center gap-2"><span className="w-5 h-5 flex items-center justify-center bg-slate-900 text-white rounded-full text-[10px]">2</span> Clean the mess according the tool</div>
                    </div>
                </div>
            </motion.div>

            <div className="relative w-full aspect-video bg-sky-50 rounded-[3rem] border-4 border-white shadow-2xl overflow-hidden mb-8">
                {/* Scenario background */}
                {background ? (
                    <img src={background} alt="Cleanup Challenge" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[15rem] opacity-20 select-none">🚽</div>
                )}

                {messes.map(mess => !mess.fixed && (
                    <motion.button
                        key={mess.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleMessClick(mess.id, mess.type)}
                        className="absolute text-6xl p-4 cursor-pointer hover:drop-shadow-xl transition-all"
                        style={{ left: mess.x, top: mess.y }}
                    >
                        {mess.type === 'tissue' && <img src="/images/paper.png" alt="paper" className="w-20 h-auto drop-shadow-lg group-hover:scale-110 transition-transform" />}
                        {mess.type === 'spill' && <img src="/images/spill.png" alt="spill" className="w-24 h-auto drop-shadow-lg group-hover:scale-110 transition-transform" />}
                        {mess.type === 'unflushed' && '💩'}
                    </motion.button>
                ) || mess.fixed && mess.type === 'unflushed' && (
                    <div className="absolute inset-0 flex items-center justify-center text-[15rem] opacity-40 animate-pulse pointer-events-none">✨</div>
                ))}
            </div>

            <div className="flex gap-6">
                {[
                    { id: 'bin' as const, label: 'Pick Up', icon: '🗑️', color: 'yellow' },
                    { id: 'wipe' as const, label: 'Wipe', icon: '🧽', color: 'orange' },
                    { id: 'flush' as const, label: 'Flush', icon: '🔘', color: 'yellow' }
                ].map((tool) => (
                    <motion.button
                        key={tool.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTool(tool.id)}
                        className={`relative w-28 md:w-32 aspect-square flex flex-col items-center justify-center gap-2 rounded-4xl border-[6px] border-white transition-all 
                            ${activeTool === tool.id
                                ? 'bg-linear-to-b from-yellow-300 to-yellow-500 scale-110 shadow-[0_12px_0_#ca8a04]'
                                : 'bg-linear-to-b from-yellow-400 to-orange-400 shadow-[0_8px_0_#b45309] opacity-90'
                            }`}
                    >
                        <span className="text-3xl md:text-4xl filter drop-shadow-sm">{tool.icon}</span>
                        <span className="font-black text-white text-[10px] md:text-xs uppercase tracking-widest drop-shadow-[0_2px_1px_rgba(0,0,0,0.5)]">
                            {tool.label}
                        </span>

                        {/* Shine Effect */}
                        <div className="absolute top-2 left-4 right-4 h-4 bg-white/20 rounded-full blur-[1px] pointer-events-none" />
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

const PledgeSlide = ({ title, subtitle, content }: Partial<Slide>) => {
    const pledgeItems = content?.split('\n').map(item => item.replace('• ', '').trim()) || [];
    const [checkedItems, setCheckedItems] = useState<number[]>([]);

    const toggleItem = (index: number) => {
        if (checkedItems.includes(index)) {
            setCheckedItems(checkedItems.filter(i => i !== index));
        } else {
            setCheckedItems([...checkedItems, index]);
            const audio = new Audio('/sfx/cring.mp3');
            audio.play().catch(e => console.warn("Cring sfx play failed:", e));
            confetti({
                particleCount: 15,
                spread: 30,
                origin: { y: 0.8 },
                colors: ['#fbbf24', '#ffffff']
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-6xl mx-auto p-4">
            <h2 className="text-4xl md:text-6xl font-black text-blue-900 mb-4 tracking-tighter uppercase">{title}</h2>
            <p className="text-xl md:text-2xl text-slate-500 font-bold mb-12 uppercase tracking-widest">"{subtitle}"</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12">
                {pledgeItems.map((item, i) => {
                    const isChecked = checkedItems.includes(i);
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => toggleItem(i)}
                            className={`cursor-pointer p-8 rounded-[2rem] border-4 transition-all group flex flex-col items-center justify-center text-center ${isChecked
                                ? "bg-yellow-50 border-yellow-400 shadow-xl scale-105"
                                : "bg-white/80 border-slate-100 hover:border-yellow-200"
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${isChecked ? "bg-yellow-400 text-white" : "bg-yellow-100 text-yellow-500"
                                }`}>
                                <Star className={`w-6 h-6 ${isChecked ? "fill-current" : ""}`} />
                            </div>
                            <p className={`font-black leading-tight uppercase text-sm transition-colors ${isChecked ? "text-yellow-700" : "text-slate-700"
                                }`}>{item}</p>
                        </motion.div>
                    );
                })}
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <PlayfulButton
                    color={checkedItems.length === pledgeItems.length ? "orange" : "blue"}
                    className="px-12 py-6"
                    disabled={checkedItems.length !== pledgeItems.length}
                    onClick={() => {
                        confetti({
                            particleCount: 200,
                            spread: 100,
                            origin: { y: 0.6 }
                        });
                    }}
                >
                    {checkedItems.length === pledgeItems.length ? "I am a Toilet Hero!" : "Complete the Pledge First!"}
                </PlayfulButton>
            </motion.div>
        </div>
    );
};

// --- Sub-Components (Standard Slides) ---

const TitleSlide = ({ title, subtitle }: Partial<Slide>) => (
    <div className="flex flex-col items-center justify-center text-center h-full space-y-6 md:space-y-8 relative">

        <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="mb-2 md:mb-4 drop-shadow-2xl"
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mascots/mascot-pose.png" alt="Mascot" className="w-40 md:w-56 h-auto" />
        </motion.div>
        <h1 className="font-nerko tracking-wide text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter text-blue-900 drop-shadow-sm leading-none pb-2 uppercase text-center max-w-4xl">
            {title}
        </h1>
        <p className="text-lg md:text-2xl text-blue-900 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] max-w-2xl leading-relaxed px-4">
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

// --- Toilet Comparison Component ---

const ToiletComparisonSlide = ({ onComplete, invertChoices }: { onComplete: () => void, invertChoices?: boolean }) => {
    const [choice, setChoice] = useState<'none' | 'dirty' | 'clean'>('none');

    const handleChoice = (type: 'dirty' | 'clean') => {
        setChoice(type);
        if (type === 'clean') {
            onComplete();
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    return (
        <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center">
            {/* Content Layer */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center p-4 md:p-12">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/90 backdrop-blur px-6 py-3 rounded-2xl shadow-xl mb-6 md:mb-12 border border-blue-100 max-w-[90%]"
                >
                    <h3 className="text-lg md:text-2xl font-black text-blue-900 uppercase tracking-widest text-center">
                        Which toilet would you choose?
                    </h3>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-12 w-full max-w-4xl px-4">
                    {/* Happy Option */}
                    <div className={invertChoices ? 'order-1' : 'order-2'}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleChoice('clean')}
                            className={`group relative w-full p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-4 transition-all overflow-hidden ${choice === 'clean'
                                ? 'bg-green-50 border-green-500 shadow-2xl scale-105'
                                : 'bg-white/60 backdrop-blur-md border-transparent hover:border-green-200'
                                }`}
                        >
                            <div className="relative z-10 flex flex-col items-center gap-4 md:gap-6">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-2xl flex items-center justify-center text-4xl md:text-5xl shadow-inner">
                                    😁
                                </div>
                                <div className="text-center">
                                    <h4 className="text-xl md:text-2xl font-black text-green-700 mb-2">The Happy Toilet</h4>
                                    <p className="text-green-900/60 font-bold leading-tight text-sm md:text-base">
                                        Keeping it clean means everyone stays strong and ready to play.
                                    </p>
                                </div>
                            </div>
                            {choice === 'clean' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-green-500/10 pointer-events-none"
                                />
                            )}
                        </motion.button>
                    </div>

                    {/* Dirty Option */}
                    <div className={invertChoices ? 'order-2' : 'order-1'}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleChoice('dirty')}
                            className={`group relative w-full p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-4 transition-all overflow-hidden ${choice === 'dirty'
                                ? 'bg-red-50 border-red-500 shadow-2xl scale-105'
                                : 'bg-white/60 backdrop-blur-md border-transparent hover:border-red-200'
                                }`}
                        >
                            <div className="relative z-10 flex flex-col items-center gap-4 md:gap-6">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-2xl flex items-center justify-center text-4xl md:text-5xl shadow-inner">
                                    ☹️
                                </div>
                                <div className="text-center">
                                    <h4 className="text-xl md:text-2xl font-black text-red-700 mb-2">The "Oops" Toilet</h4>
                                    <p className="text-red-900/60 font-bold leading-tight text-sm md:text-base">
                                        Dirty toilets can make our friends feel sick. We don't want that!
                                    </p>
                                </div>
                            </div>
                            {choice === 'dirty' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-red-500/10 pointer-events-none"
                                />
                            )}
                        </motion.button>
                    </div>
                </div>

                <AnimatePresence>
                    {choice !== 'none' && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={`mt-6 md:mt-12 px-6 py-3 md:px-10 md:py-4 rounded-full font-black text-xs md:text-sm uppercase tracking-widest shadow-xl flex items-center gap-2 md:gap-3 ${choice === 'clean' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                }`}
                        >
                            {choice === 'clean' ? (
                                <><CheckCircle className="w-5 h-5 md:w-6 md:h-6" /> Great Choice, Hero!</>
                            ) : (
                                <><RotateCcw className="w-5 h-5 md:w-6 md:h-6" /> Let's try for a cleaner choice!</>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const ImageSlide = ({ title, image, content, mascot }: Partial<Slide>) => (
    <div className="flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto space-y-6 md:space-y-10 relative p-4">
        {/* Mascot Decoration */}
        <div className="absolute -right-16 bottom-0 hidden lg:block pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mascot || "/mascots/mascot-sitting.png"} alt="Studying Hero" className="w-64 -scale-x-100" />
        </div>
        <div className="w-64 h-64 md:w-80 md:h-80 bg-white rounded-[3rem] md:rounded-[4rem] border-2 border-slate-100 flex items-center justify-center text-[8rem] md:text-[10rem] shadow-2xl relative group shrink-0">
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
            <div className="absolute -top-4 -right-4 w-10 h-10 md:w-12 md:h-12 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-12">
                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
            </div>
        </div>
        <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-blue-900 mb-2 md:mb-4 uppercase">{title}</h2>
            <p className="text-lg md:text-2xl text-slate-500 font-medium leading-relaxed max-w-full md:max-w-none">{content}</p>
        </div>
    </div>
);

const VideoSlide = ({ title, content }: Partial<Slide>) => (
    <div className="flex flex-col h-full max-w-5xl mx-auto py-4 md:py-8 space-y-6 md:space-y-10 text-center p-4">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-blue-900 leading-tight uppercase">{title}</h2>
        <div className="aspect-video w-full bg-slate-900 rounded-3xl md:rounded-[4rem] overflow-hidden shadow-2xl shadow-sky-900/10 relative group flex items-center justify-center border-4 md:border-8 border-white">
            <MonitorPlay className="w-20 h-20 md:w-32 md:h-32 text-white/5" />
            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-all" />
            <button className="absolute inset-0 flex items-center justify-center group-hover:bg-black/10 transition-all">
                <div className="p-6 md:p-10 bg-white rounded-full shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                    <PlayCircle className="w-12 h-12 md:w-16 md:h-16 text-sky-500" />
                </div>
            </button>
        </div>
        <p className="text-lg md:text-xl text-slate-400 font-bold uppercase tracking-[0.2em]">{content}</p>
    </div>
);

const GameLauncherSlide = ({ title, gameType, content, onStart }: any) => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 max-w-3xl mx-auto p-4">
        <div className="p-6 md:p-12 bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-orange-100/50 relative overflow-hidden group w-full">
            {/* Texture */}
            <div className="absolute top-0 right-0 p-8 text-orange-500/5 scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                <Gamepad2 className="w-64 h-64" />
            </div>

            <div className="relative z-10 font-sans">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-orange-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-xl rotate-3">
                    <Gamepad2 className="w-10 h-10 md:w-12 md:h-12" />
                </div>
                <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 md:mb-6">
                    {gameType}
                </span>
                <h2 className="text-2xl md:text-4xl font-black text-blue-900 mb-4">{title}</h2>
                <p className="text-lg md:text-xl text-slate-600 font-medium mb-8 md:mb-10 max-w-sm mx-auto leading-relaxed">{content}</p>
                <PlayfulButton
                    onClick={onStart}
                    color="orange"
                    className="px-8 py-4 md:px-12 md:py-5 mx-auto"
                >
                    <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 md:w-6 md:h-6" />
                        Begin Challenge
                    </div>
                </PlayfulButton>
            </div>
        </div>
    </div>
);

const QuizLauncherSlide = ({ title, content, mascot, onStart }: any) => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 max-w-3xl mx-auto font-sans p-4">
        <div className="p-6 md:p-12 bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-purple-100/50 relative overflow-hidden group w-full">
            <div className="absolute top-0 right-0 p-8 text-purple-500/5 scale-150 -rotate-12 group-hover:-rotate-45 transition-transform duration-1000">
                <HelpCircle className="w-64 h-64" />
            </div>

            {/* Mascot */}
            <div className="absolute -right-4 bottom-0 hidden sm:block pointer-events-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mascot || "/mascots/mascot-scared.png"} alt="Nervous Hero" className="w-32 rotate-12" />
            </div>

            <div className="relative z-10">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-purple-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-xl -rotate-3">
                    <HelpCircle className="w-10 h-10 md:w-12 md:h-12" />
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-blue-900 mb-4">{title}</h2>
                <p className="text-lg md:text-xl text-slate-600 font-medium mb-8 md:mb-10 max-w-sm mx-auto leading-relaxed">{content}</p>
                <PlayfulButton
                    onClick={onStart}
                    color="purple"
                    className="px-8 py-4 md:px-12 md:py-5 mx-auto"
                >
                    <div className="flex items-center gap-3">
                        <Send className="w-5 h-5 md:w-6 md:h-6" />
                        Review Knowledge
                    </div>
                </PlayfulButton>
            </div>
        </div>
    </div>
);
const CelebrationSlide = ({ id, title, subtitle, content, mascot, image }: Partial<Slide>) => {
    // Robust fallback: if mascot is missing, infer from ID or title
    const effectiveMascot = mascot && mascot.trim() !== ""
        ? mascot
        : (id?.includes("m2") || title?.includes("Module B") || title?.includes("Great Job"))
            ? "/mascots/m2-mascot-final.png"
            : "/mascots/mascot-hero.png";

    const moduleLabel = (id?.includes("m2") || title?.includes("Module B") || title?.includes("Great Job"))
        ? "Module B"
        : "Module A";

    useEffect(() => {
        const audio = new Audio('/sfx/celebration.mp3');
        audio.play().catch(error => {
            console.warn("Celebration audio auto-play was prevented by the browser:", error);
        });

        // Cleanup if necessary (though usually not needed for a one-shot SFX on mount)
        return () => {
            audio.pause();
            audio.src = "";
        };
    }, []);

    console.log("CelebrationSlide render:", { id, title, mascot: effectiveMascot, image });

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center h-full w-full max-w-6xl mx-auto gap-4 lg:gap-16 relative p-2 lg:p-4 overflow-y-auto no-scrollbar">
            {/* Mascot Side */}
            <motion.div
                initial={{ x: -100, opacity: 0, rotate: -10 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12, stiffness: 100 }}
                className="shrink-0 flex justify-center lg:justify-end"
            >
                <div className="relative">
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="relative"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={effectiveMascot}
                            alt="Hero Mascot"
                            onLoad={() => console.log("Mascot loaded:", effectiveMascot)}
                            onError={(e) => {
                                console.error("Mascot failed to load:", effectiveMascot);
                                // Fallback to hero if specific mascot fails, though it shouldn't
                                if (effectiveMascot !== "/mascots/mascot-hero.png") {
                                    (e.target as HTMLImageElement).src = "/mascots/mascot-hero.png";
                                }
                            }}
                            className="w-[180px] md:w-[400px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                        />
                    </motion.div>
                    {/* Sparkles around mascot */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                                className="absolute text-yellow-400 text-2xl md:text-4xl"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`
                                }}
                            >
                                ✨
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Content Side */}
            <div className="flex-1 space-y-4 md:space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start max-w-xl">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                >
                    <h1 className="text-2xl md:text-5xl font-black text-blue-900 leading-none tracking-tighter uppercase drop-shadow-md">
                        {title}
                    </h1>
                    {subtitle && (
                        <h2 className="text-xl md:text-4xl font-black text-orange-500 tracking-tighter leading-tight italic drop-shadow-sm">
                            {subtitle}
                        </h2>
                    )}
                    <div className="h-1.5 md:h-3 w-32 md:w-48 bg-yellow-400 rounded-full mx-auto lg:mx-0 shadow-lg" />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2 md:space-y-4"
                >
                    <div className="text-base md:text-lg text-blue-900/70 font-bold leading-relaxed whitespace-pre-line">
                        {content}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ scale: 0, rotate: 20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.6, delay: 0.8 }}
                    className="relative group pt-2 flex flex-col items-center"
                >
                    <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full scale-150 group-hover:bg-yellow-400/40 transition-all duration-500" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        // src={image || "/images/toilet-hero-badge.png"}
                        src={"/images/toilet-hero-badge.png"}
                        alt="Hero Badge"
                        className="w-32 md:w-48 relative z-10 drop-shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                    />
                    <div className="relative z-10 px-6 py-2 bg-white rounded-2xl shadow-lg border-2 border-yellow-400 -rotate-2">
                        <span className="font-nerko text-2xl md:text-3xl text-yellow-600 font-black uppercase tracking-widest">{moduleLabel}</span>
                    </div>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                        className="absolute top-2 w-36 h-36 md:w-52 md:h-52 border-4 border-dashed border-white/40 rounded-full scale-110 opacity-50"
                    />
                </motion.div>
            </div>
        </div>
    );
};

// --- Sub-Components (Quiz Flow) ---

const DragAndDropQuestion = ({ question, onCorrect }: { question: Question, onCorrect: () => void }) => {
    const [isDropped, setIsDropped] = useState(false);
    const targetRef = useRef<HTMLDivElement>(null);

    const handleDragEnd = (event: any, info: any, option: string) => {
        if (!targetRef.current || isDropped) return;

        const targetRect = targetRef.current.getBoundingClientRect();
        const dropPoint = info.point;

        // Check if the drop point is within the target area
        const isWithinTarget = (
            dropPoint.x >= targetRect.left &&
            dropPoint.x <= targetRect.right &&
            dropPoint.y >= targetRect.top &&
            dropPoint.y <= targetRect.bottom
        );

        if (isWithinTarget) {
            if (option === question.correctAnswer) {
                setIsDropped(true);
                const audio = new Audio('/sfx/correct.mp3');
                audio.play().catch(e => console.warn("Correct sfx play failed:", e));
                setTimeout(onCorrect, 1500);
                confetti({
                    particleCount: 40,
                    spread: 60,
                    origin: {
                        x: (targetRect.left + targetRect.width / 2) / window.innerWidth,
                        y: (targetRect.top + targetRect.height / 2) / window.innerHeight
                    },
                    colors: ['#4f46e5', '#818cf8', '#ffffff']
                });
            } else {
                const audio = new Audio('/sfx/wrong.mp3');
                audio.play().catch(e => console.warn("Wrong sfx play failed:", e));
            }
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 md:gap-12 py-2 md:py-4 w-full">
            {/* Target Area */}
            <div
                ref={targetRef}
                className={`relative w-full max-w-md p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-xl border-4 transition-all duration-500 flex flex-col items-center gap-4 md:gap-6 ${isDropped
                    ? 'bg-indigo-50 border-indigo-500 scale-105 shadow-indigo-100/50'
                    : 'bg-white border-slate-100'
                    }`}
            >
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl shadow-inner transition-colors duration-500 ${isDropped ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                    {isDropped ? <ShieldCheck className="w-8 h-8 md:w-10 md:h-10" /> : (question.question.includes('True') ? '🤔' : '🧼')}
                </div>

                <div className="space-y-1 md:space-y-2 text-center">
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                        {question.question}
                    </h3>
                    <p className="text-sm md:text-base text-slate-500 font-bold leading-tight px-4 italic">
                        "{question.description}"
                    </p>
                </div>

                <div className={`mt-2 md:mt-4 w-full h-16 md:h-20 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all duration-500 ${isDropped
                    ? 'bg-white border-indigo-400 text-indigo-700 shadow-inner'
                    : 'bg-slate-50 border-slate-200 text-slate-300'
                    }`}>
                    {isDropped ? (
                        <motion.div
                            initial={{ scale: 0, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            className="flex flex-col items-center gap-1"
                        >
                            <span className="font-black text-base md:text-lg uppercase tracking-tight">{question.correctAnswer}</span>
                            <span className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest">Locked In!</span>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-black opacity-40">Drop Zone</span>
                            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 rotate-90 opacity-20" />
                        </div>
                    )}
                </div>
            </div>

            {/* Draggable Options */}
            <div className="relative min-h-[5rem] md:min-h-[6rem] h-auto w-full flex justify-center items-center">
                <AnimatePresence>
                    {!isDropped && (
                        <div className="flex flex-wrap justify-center gap-3 md:gap-6">
                            {question.options?.map((opt, i) => (
                                <motion.div
                                    key={opt}
                                    layoutId={`opt-${opt}`}
                                    drag
                                    dragSnapToOrigin
                                    onDragEnd={(e, info) => handleDragEnd(e, info, opt)}
                                    whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                                    whileDrag={{
                                        scale: 1.1,
                                        rotate: 0,
                                        zIndex: 100,
                                        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                                    }}
                                    className="px-6 py-3 md:px-10 md:py-5 bg-white border-2 border-slate-100 rounded-2xl md:rounded-3xl font-black text-sm md:text-base text-slate-700 shadow-lg cursor-grab active:cursor-grabbing hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                                >
                                    {opt}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                {isDropped && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-indigo-600 font-black text-lg md:text-xl uppercase tracking-widest flex items-center gap-2 md:gap-3"
                    >
                        ✨ Correct! You're a Hero! ✨
                    </motion.div>
                )}
            </div>
        </div>
    );
};

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

    const isCorrectlyAnswered = q.type === 'TEXT_INPUT'
        ? answers[q.id] !== undefined && answers[q.id] !== ""
        : answers[q.id] === q.correctAnswer || (q.type === 'TRUE_FALSE' && (answers[q.id]?.toUpperCase() === (q.correctAnswer as string)?.toUpperCase()));

    const isAnswered = answers[q.id] !== undefined && answers[q.id] !== "";

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <motion.div
                key={idx}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="space-y-8"
            >
                {q.type !== 'DRAG_AND_DROP' && (
                    <div className="flex items-center justify-between mb-8">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            {q.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Step {idx + 1} of {questions.length}</span>
                    </div>
                )}

                {q.type !== 'DRAG_AND_DROP' && (
                    <h2 className="text-3xl font-black text-slate-900 leading-tight text-center">
                        {q.question}
                    </h2>
                )}

                <div className="space-y-4">
                    {q.type === "DRAG_AND_DROP" && (
                        <DragAndDropQuestion
                            question={q}
                            onCorrect={() => {
                                setAnswers({ ...answers, [q.id]: q.correctAnswer });
                                handleNext();
                            }}
                        />
                    )}

                    {q.type === "MULTIPLE_CHOICE" && q.options?.map((opt, i) => {
                        const isSelected = answers[q.id] === opt;
                        const isCorrect = opt === q.correctAnswer;
                        const isCorrectlyPicked = answers[q.id] === q.correctAnswer;
                        const showCorrect = isSelected && isCorrect;
                        const showWrong = isSelected && !isCorrect;

                        return (
                            <button
                                key={i}
                                onClick={() => {
                                    // Allow guessing until correct
                                    const alreadyCorrect = answers[q.id] === q.correctAnswer;
                                    if (!alreadyCorrect) {
                                        setAnswers({ ...answers, [q.id]: opt });
                                        const isCorrectChoice = opt === q.correctAnswer;
                                        const audio = new Audio(`/sfx/${isCorrectChoice ? 'correct' : 'wrong'}.mp3`);
                                        audio.play().catch(e => console.warn("Quiz sfx play failed:", e));
                                    }
                                }}
                                className={`w-full p-6 text-left rounded-3xl border-2 font-bold text-lg transition-all flex items-center justify-between relative group ${isCorrectlyPicked
                                    ? isCorrect
                                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg scale-[1.02] z-10'
                                        : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                                    : isSelected && !isCorrect
                                        ? 'bg-rose-500 border-rose-500 text-white'
                                        : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-purple-300 hover:bg-white hover:scale-[1.01] active:scale-[0.98]'
                                    }`}
                            >
                                <span className="flex-1">{opt}</span>
                                <AnimatePresence>
                                    {showCorrect && (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -20 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            className="ml-4"
                                        >
                                            <CheckCircle className="w-6 h-6 md:w-8 md:h-8" />
                                        </motion.div>
                                    )}
                                    {showWrong && (
                                        <motion.div
                                            initial={{ scale: 0, x: 10 }}
                                            animate={{ scale: 1, x: 0 }}
                                            className="ml-4"
                                        >
                                            <XCircle className="w-6 h-6 md:w-8 md:h-8" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        );
                    })}

                    {q.type === "TRUE_FALSE" && (
                        <div className="grid grid-cols-2 gap-6">
                            {["True", "False"].map((opt) => {
                                const isSelected = answers[q.id] === opt;
                                const isCorrect = opt.toUpperCase() === (q.correctAnswer as string)?.toUpperCase() || opt === q.correctAnswer;
                                const currentAnswer = answers[q.id];
                                const alreadyCorrect = currentAnswer?.toUpperCase() === (q.correctAnswer as string)?.toUpperCase() || currentAnswer === q.correctAnswer;
                                const showCorrect = isSelected && isCorrect;
                                const showWrong = isSelected && !isCorrect;

                                return (
                                    <button
                                        key={opt}
                                        onClick={() => {
                                            // Allow guessing until correct
                                            const isCorrectChoice = opt.toUpperCase() === (q.correctAnswer as string)?.toUpperCase() || opt === q.correctAnswer;
                                            const currentAnswer = answers[q.id];
                                            const alreadyCorrect = currentAnswer?.toUpperCase() === (q.correctAnswer as string)?.toUpperCase() || currentAnswer === q.correctAnswer;

                                            if (!alreadyCorrect) {
                                                setAnswers({ ...answers, [q.id]: opt });
                                                const audio = new Audio(`/sfx/${isCorrectChoice ? 'correct' : 'wrong'}.mp3`);
                                                audio.play().catch(e => console.warn("Quiz sfx play failed:", e));
                                            }
                                        }}
                                        className={`p-10 rounded-3xl border-2 font-black text-2xl transition-all flex flex-col items-center gap-4 relative ${alreadyCorrect
                                            ? isCorrect
                                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg scale-[1.05] z-10'
                                                : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                                            : isSelected && !isCorrect
                                                ? 'bg-rose-500 border-rose-500 text-white'
                                                : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-purple-300 hover:bg-white hover:shadow-md'
                                            }`}
                                    >
                                        <span className="mb-2">{opt}</span>
                                        <AnimatePresence>
                                            {showCorrect && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                    <CheckCircle className="w-10 h-10" />
                                                </motion.div>
                                            )}
                                            {showWrong && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                    <XCircle className="w-10 h-10" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                );
                            })}
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

                {q.type !== 'DRAG_AND_DROP' && (
                    <div className="pt-8 flex justify-end">
                        <button
                            disabled={!isCorrectlyAnswered}
                            onClick={handleNext}
                            className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
                        >
                            {idx === questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
                        </button>
                    </div>
                )}
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
    const [loading, setLoading] = useState(true);
    const [isMarked, setIsMarked] = useState(false); // API call status

    const playYay = () => {
        const audio = new Audio('/sfx/yay.mp3');
        audio.play().catch(e => console.warn("Yay audio play failed:", e));
    };

    // Game states
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'completed'>('idle');
    // Quiz states
    const [quizState, setQuizState] = useState<'idle' | 'playing' | 'completed'>('idle');

    const [slides, setSlides] = useState<Slide[]>(dummySlides);
    const [initialSlideLoaded, setInitialSlideLoaded] = useState(false);

    // Fetch lesson and progress
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Lesson
                const lessonRes = await fetch(`/api/lessons/${params.lessonId}`);
                if (!lessonRes.ok) throw new Error("Failed to fetch lesson data");
                const lessonData = await lessonRes.json();

                let currentSlides = dummySlides;
                if (lessonData.slides && lessonData.slides.length > 0) {
                    currentSlides = lessonData.slides;
                } else if (lessonData.module && lessonData.module.title.includes("Be a Toilet Hero")) {
                    currentSlides = moduleTwoSlides as unknown as Slide[];
                }
                setSlides(currentSlides);

                // Fetch Progress
                const progressRes = await fetch(`/api/completions?lessonId=${params.lessonId}`);
                if (progressRes.ok) {
                    const progressData = await progressRes.json();
                    if (progressData.currentSlide > 0 && !progressData.isCompleted && !initialSlideLoaded) {
                        setCurrentIdx(progressData.currentSlide);
                        setInitialSlideLoaded(true);
                    }
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (params.lessonId) {
            fetchData();
        }
    }, [params.lessonId, initialSlideLoaded]);

    const totalSlides = slides.length;
    const currentSlide = slides[currentIdx];

    const saveProgress = async (idx: number, isComplete = false) => {
        try {
            await fetch('/api/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lessonId: params.lessonId,
                    currentSlide: idx,
                    isComplete
                })
            });
        } catch (err) {
            console.error("Failed to save progress:", err);
        }
    };

    const handleNext = () => {
        if (currentIdx < totalSlides - 1) {
            const nextIdx = currentIdx + 1;
            setDirection(1);
            setCurrentIdx(nextIdx);
            setGameState('idle');
            setQuizState('idle');
            saveProgress(nextIdx);
        }
    };

    const handlePrev = () => {
        if (currentIdx > 0) {
            const prevIdx = currentIdx - 1;
            setDirection(-1);
            setCurrentIdx(prevIdx);
            setGameState('idle');
            setQuizState('idle');
            saveProgress(prevIdx);
        }
    };

    const jumpToSlide = (idx: number) => {
        setDirection(idx > currentIdx ? 1 : -1);
        setCurrentIdx(idx);
        setGameState('idle');
        setQuizState('idle');
        saveProgress(idx);
    };

    const handleComplete = async () => {
        setIsMarked(true);
        saveProgress(currentIdx, true);
        confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
        setTimeout(() => setComplete(true), 1500);
    };

    // Logic to lock navigation
    const isSlideLocked =
        (currentSlide.type === "game" && gameState !== "completed") ||
        (currentSlide.type === "comparison" && gameState !== "completed") ||
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

    if (loading) {
        return (
            <div className="min-h-screen bg-sky-50 flex items-center justify-center font-sans overflow-hidden">
                <div className="flex flex-col items-center gap-6">
                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="text-8xl"
                    >
                        🧼
                    </motion.div>
                    <div className="space-y-2 text-center">
                        <h2 className="text-2xl font-black text-blue-900 uppercase tracking-widest animate-pulse">Prepping the Classroom...</h2>
                        <p className="text-blue-900/40 font-bold italic">Getting your hero training ready!</p>
                    </div>
                </div>
            </div>
        );
    }

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
                                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Completion</p>
                                </div>
                                <div className="w-12 h-12 bg-sky-500 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg">
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
            <main className="relative pt-16 pb-24 h-dvh flex items-center justify-center overflow-hidden">
                {/* --- Background Image --- */}
                <div
                    className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
                    style={{
                        backgroundImage: `url('${currentSlide.background
                            ? currentSlide.background
                            : currentSlide.type === 'celebration'
                                ? (currentSlide.mascot?.includes('m2-mascot-final')
                                    ? '/backgrounds/module-2-final-bg.png'
                                    : '/images/celebration-bg.jpg')
                                : currentSlide.type === 'comparison'
                                    ? '/images/toilet-comparison-bg.jpg'
                                    : (currentIdx >= 2 && currentIdx <= 5)
                                        ? '/images/lesson-bg-germs.jpg'
                                        : '/images/lesson-bg.jpg'
                            }')`
                    }}
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
                            className={`w-full ${currentSlide.type === "game" || currentSlide.type === "comparison" ? "" : "bg-white/20 backdrop-blur shadow-[0_0_50px_rgba(0,0,0,0.05)] rounded-4xl md:rounded-5xl border border-white/40"} p-6 md:p-12 w-full max-w-[95vw] h-auto min-h-[50dvh] max-h-[calc(100dvh-180px)] flex flex-col relative overflow-y-auto overflow-x-hidden no-scrollbar`}
                        >
                            {/* Dynamic Slide Switcher */}
                            <div className="w-full m-auto">
                                {currentSlide.type === "title" && <TitleSlide {...currentSlide} />}
                                {currentSlide.type === "content" && <ContentSlide {...currentSlide} />}
                                {currentSlide.type === "image" && <ImageSlide {...currentSlide} />}
                                {currentSlide.type === "video" && <VideoSlide {...currentSlide} />}
                                {currentSlide.type === "celebration" && (
                                    currentSlide.title.includes("Pledge") ? (
                                        <PledgeSlide {...currentSlide} />
                                    ) : (
                                        <CelebrationSlide {...currentSlide} />
                                    )
                                )}

                                {/* Game Logic */}
                                {currentSlide.type === "game" && (
                                    gameState === "playing" ? (
                                        currentSlide.gameType === "Story Interaction" ? (
                                            <HandwashingGame onComplete={() => {
                                                setGameState('completed');
                                                playYay();
                                                setTimeout(handleNext, 500);
                                            }} />
                                        ) : currentSlide.gameType === "WhosNext" ? (
                                            <WhosNextGame onComplete={() => {
                                                setGameState('completed');
                                                playYay();
                                                setTimeout(handleNext, 500);
                                            }} />
                                        ) : currentSlide.gameType === "HeroOrOops" ? (
                                            <HeroOrOopsGame onComplete={() => {
                                                setGameState('completed');
                                                playYay();
                                                setTimeout(handleNext, 500);
                                            }} invertChoices={currentSlide.invertChoices} />
                                        ) : currentSlide.gameType === "CleanupChallenge" ? (
                                            <CleanupChallengeGame
                                                onComplete={() => {
                                                    setGameState('completed');
                                                    playYay();
                                                    setTimeout(handleNext, 500);
                                                }}
                                                background={currentSlide.background}
                                            />
                                        ) : (
                                            <GermHunterGame onComplete={() => {
                                                setGameState('completed');
                                                playYay();
                                                setTimeout(handleNext, 500);
                                            }} />
                                        )
                                    ) : (
                                        <GameLauncherSlide
                                            {...currentSlide}
                                            onStart={() => setGameState('playing')}
                                        />
                                    )
                                )}

                                {currentSlide.type === "comparison" && (
                                    <ToiletComparisonSlide
                                        onComplete={() => {
                                            setGameState('completed');
                                            playYay();
                                            setTimeout(handleNext, 500);
                                        }}
                                        invertChoices={currentSlide.invertChoices}
                                    />
                                )}

                                {/* Quiz Logic */}
                                {currentSlide.type === "quiz" && (
                                    quizState === "playing" ? (
                                        <InlineQuizFlow
                                            questions={currentSlide.questions || []}
                                            onComplete={() => {
                                                setQuizState('completed');
                                                playYay();
                                                setTimeout(handleNext, 500);
                                            }}
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
            <footer className="fixed bottom-0 left-0 right-0 z-30 p-5">
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
                                    ? "w-10 h-3 bg-[#2196F3] shadow-[0_0_15px_rgba(15,23,42,0.2)]"
                                    : "w-3 h-3 bg-slate-200 hover:bg-slate-300"
                                    } ${isSlideLocked && 'cursor-not-allowed opacity-50'}`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>

                    <div className="min-w-[200px] flex justify-end">
                        {currentIdx === totalSlides - 1 ? (
                            <PlayfulButton
                                onClick={handleComplete}
                                disabled={isMarked}
                                color={isMarked ? "green" : "blue"}
                                className="w-full px-10 py-5"
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <span>{isMarked ? 'Completed' : 'Mark Complete'}</span>
                                    {!isMarked && <CheckCircle className="w-5 h-5" />}
                                </div>
                            </PlayfulButton>
                        ) : (
                            <PlayfulButton
                                onClick={handleNext}
                                disabled={isSlideLocked}
                                color={isSlideLocked ? "blue" : "blue"}
                                className={`w-full px-10 py-5 ${isSlideLocked ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                            >
                                <div className="flex items-center justify-center gap-4">
                                    <span>{isSlideLocked ? 'Locked Slide' : 'Next'}</span>
                                    {!isSlideLocked && <ChevronRight className="w-5 h-5" />}
                                </div>
                            </PlayfulButton>
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        {/* Final Celebration Background in Modal */}
                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />

                        {currentSlide.background && (
                            <div className="absolute inset-0 opacity-40">
                                <img src={currentSlide.background} alt="Rays" className="w-full h-full object-cover" />
                            </div>
                        )}

                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white/95 backdrop-blur max-w-lg w-full rounded-[3.5rem] p-12 md:p-16 text-center shadow-2xl border border-white/50 relative overflow-hidden"
                        >
                            {/* Decorative Shine */}
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-yellow-200/30 rounded-full blur-3xl" />


                            <div className="relative z-10 space-y-6">
                                <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner rotate-3">
                                    <Trophy className="w-10 h-10" />
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-blue-900 tracking-tighter uppercase leading-none">
                                    {currentSlide.title || "Module Complete!"}
                                </h2>
                                <p className="text-lg text-slate-500 font-bold leading-relaxed">
                                    {currentSlide.content?.split('\n')[0] || "You've successfully mastered this module! Your progress is saved."}
                                </p>

                                <div className="pt-6 space-y-4">
                                    <PlayfulButton
                                        onClick={() => router.push(`/dashboard`)}
                                        color="green"
                                        className="w-full py-6"
                                    >
                                        <span className="text-xl">Return to Dashboard</span>
                                    </PlayfulButton>
                                </div>
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

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
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef, useMemo } from "react";
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
    type: "title" | "content" | "image" | "video" | "game" | "quiz" | "comparison" | "celebration" | "pledge";
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
    waitSeconds?: number;
    audio?: string;
}

const dummySlides: Slide[] = [
    {
        id: "slide-0",
        type: "video",
        title: "Mission Introduction",
        videoUrl: "/videos/module-a/A1 video.mp4",
        order: 1,
        waitSeconds: 3,
        audio: "/audio/intro-speech.mp3"
    },
    {
        id: "slide-1",
        type: "title",
        title: "Welcome to Toilet Heroes",
        subtitle: "Clean Toilets Keep Us Healthy",
        content: "Meet our friendly mascot guide who explains that toilets are shared spaces. To keep everyone healthy, we all have a part to play!",
        order: 2,
        waitSeconds: 3
    },
    {
        id: "slide-2",
        type: "content",
        title: "Hi there, Hero",
        content: "Meet our friendly mascot guide who explains that toilets are shared spaces. To keep everyone healthy, we all have a part to play!",
        order: 3,
        mascot: "/mascots/mascot-greeting.png",
        waitSeconds: 4
    },
    {
        id: "slide-3",
        type: "content",
        title: "Meet the Invisible Germs",
        content: "• Germs are invisible but real\n• They love wet surfaces\n• They can live on faucet handles for hours\n• But we have a secret weapon: Hygiene!",
        order: 4,
        mascot: "/mascots/mascot-pointing.png",
        waitSeconds: 5
    },
    {
        id: "slide-a2-video",
        type: "video",
        title: "Germ Secret Revealed",
        videoUrl: "/videos/module-a/A2.mp4",
        order: 5,
        waitSeconds: 3
    },
    {
        id: "slide-4",
        type: "game",
        title: "Germ Hunter Game",
        gameType: "Drag to Disinfect",
        content: "Drag all 6 invisible germs into the 'Sanitizer' portal to clear the restroom!",
        order: 6,
        waitSeconds: 3
    },
    {
        id: "slide-5",
        type: "image",
        title: "How Germs Travel",
        image: "🦠",
        content: "Germs often gather on door handles and light switches. Look closely!",
        order: 7,
        mascot: "/mascots/mascot-pointing.png",
        waitSeconds: 4
    },
    {
        id: "slide-a4-video",
        type: "video",
        title: "Invisible Germs",
        videoUrl: "/videos/module-a/A4.mp4",
        order: 8,
        waitSeconds: 3
    },
    {
        id: "slide-a5-video",
        type: "video",
        title: "Wash Your Hand!",
        videoUrl: "/videos/module-a/A5.mp4",
        order: 9,
        waitSeconds: 3
    },
    {
        id: "slide-a6-video",
        type: "video",
        title: "Wash Your Hand!",
        videoUrl: "/videos/module-a/A6.mp4",
        order: 10,
        waitSeconds: 3
    },
    {
        id: "slide-germ-story",
        type: "game",
        title: "Tiny Germs, Big Impact",
        gameType: "Story Interaction",
        content: "Spot the animated germ moving from the toilet to the hand? Quickly tap to scrub it away, then press the 'Wash' button to clean the hands and stop the germ from reaching the face!",
        order: 11,
        mascot: "/mascots/mascot-scared.png",
        waitSeconds: 3
    },
    {
        id: "slide-toilet-choice",
        type: "comparison",
        title: "Clean Toilets, Happy Friends",
        order: 12,
        waitSeconds: 3
    },
    {
        id: "slide-a8-video",
        type: "video",
        title: "Clean Toilets, Happy Friends",
        videoUrl: "/videos/module-a/A8.mp4",
        order: 13,
        waitSeconds: 3
    },
    {
        id: "slide-a9-video",
        type: "video",
        title: "Fun Quiz Time!",
        videoUrl: "/videos/module-a/A9.mp4",
        order: 14,
        waitSeconds: 3
    },
    {
        id: "slide-6",
        type: "quiz",
        title: "Fun Quiz Time!",
        content: "Drag and drop the correct answers into the boxes to complete the quiz!",
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
        order: 15,
        waitSeconds: 3
    },
    {
        id: "slide-7",
        type: "celebration",
        title: "What a Toilet Hero!",
        content: "Students receive praise from the mascot and a 'Health Defender' badge.\n\nThis creates a sense of achievement and motivates them to continue to Module B.",
        mascot: "/mascots/mascot-hero.png",
        background: "/images/celebration-bg.jpg",
        order: 16,
        waitSeconds: 5
    }
];

// --- Success Popup Component ---

const GameSuccessModal = ({ title, description, onContinue }: { title: string, description: string, onContinue: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 md:p-12 rounded-[3rem] overflow-hidden"
        >
            <motion.div
                initial={{ scale: 0.5, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-24 h-24 md:w-32 md:h-32 bg-linear-to-b from-yellow-300 to-yellow-500 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl"
            >
                <Trophy className="w-12 h-12 md:w-16 md:h-16 text-white drop-shadow-lg" />
            </motion.div>

            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter"
            >
                {title}
            </motion.h3>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl text-slate-500 font-bold mb-10 max-w-md"
            >
                {description}
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
            >
                <PlayfulButton
                    onClick={onContinue}
                    color="green"
                    className="px-10 py-4 md:px-14 md:py-6"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xl md:text-2xl font-black uppercase tracking-widest">Continue</span>
                        <ArrowRight className="w-6 h-6" />
                    </div>
                </PlayfulButton>
            </motion.div>
        </motion.div>
    );
};

// --- Specialized Game Component ---

const GermHunterGame = ({ onComplete }: { onComplete: () => void }) => {
    const [germs, setGerms] = useState([
        { id: 1, x: 15, y: 20, image: '/images/germs/germ-green.png' },
        { id: 2, x: 75, y: 15, image: '/images/germs/germ-purple.png' },
        { id: 3, x: 80, y: 45, image: '/images/germs/germ-blue.png' },
        { id: 4, x: 20, y: 70, image: '/images/germs/germ-green.png' },
        { id: 5, x: 50, y: 80, image: '/images/germs/germ-purple.png' },
        { id: 6, x: 80, y: 75, image: '/images/germs/germ-blue.png' },
        { id: 7, x: 50, y: 20, image: '/images/germs/germ-green.png' },
        { id: 8, x: 70, y: 65, image: '/images/germs/germ-purple.png' },
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
                    confetti({ particleCount: 100, spread: 50 });
                }
                return remaining;
            });
        }
    };

    return (
        <div className="bg-gray-50/50 relative w-full h-[400px] md:h-[500px] border-4 border-dashed border-slate-200 rounded-[3rem] overflow-hidden flex items-center justify-center shadow-inner">
            {/* Background Info */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8 text-left z-10">
                <h4 className="text-[10px] md:text-sm font-black text-slate-700 uppercase tracking-widest mb-1">Restroom Area</h4>
                <p className="text-[10px] md:text-xs text-slate-700 font-bold">Germs Detected: {germs.length}</p>
            </div>

            {/* The Sanitizer Portal */}
            <div
                ref={portalRef}
                className={`w-40 h-40 md:w-48 md:h-48 rounded-full transition-transform duration-500 flex flex-col items-center justify-center relative ${isWon ? 'scale-125' : 'animate-pulse'}`}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/images/sanitizer.png"
                    alt="Sanitizer Portal"
                    className={`absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-[1.5] ${!isWon && 'animate-spin-slow'}`}
                    draggable="false"
                />
                <span className="relative z-10 text-[10px] md:text-xs font-black text-indigo-800 uppercase tracking-widest drop-shadow-md select-none pointer-events-none">
                    Sanitizer
                </span>
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
                        className="absolute cursor-grab active:cursor-grabbing w-12 h-12 md:w-16 md:h-16 flex items-center justify-center -ml-6 -mt-6 md:-ml-8 md:-mt-8 z-20"
                        style={{ left: `${germ.x}%`, top: `${germ.y}%` }}
                    >
                        <img
                            src={germ.image}
                            className="w-full h-full object-contain pointer-events-none"
                            alt="Germ"
                            draggable="false"
                        />
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Success Modal */}
            {isWon && (
                <GameSuccessModal
                    title="Restroom Disinfected!"
                    description="You found every germ. You may now proceed."
                    onContinue={onComplete}
                />
            )}
        </div>
    );
};

// --- Handwashing Game Component ---

const HandwashingGame = ({ onComplete }: { onComplete: () => void }) => {
    // 0: Waiting for water, 1: Scrubbing (water added), 2: Ready to Rinse (scrubbed), 3: Rinsing
    const [waterPhase, setWaterPhase] = useState<0 | 1 | 2 | 3>(0);
    const [isPouring, setIsPouring] = useState(false);
    const [scrubProgress, setScrubProgress] = useState(0);
    const [isWon, setIsWon] = useState(false);

    const [bubbles, setBubbles] = useState<{ id: number, x: string, y: string, type: string, scale: number }[]>([]);

    // Static germ positions, fade opacity based on scrubProgress
    const germs = useMemo(() => [
        { id: 1, x: "30%", y: "30%", image: '/images/germs/germ-green.png', threshold: 10 },
        { id: 2, x: "70%", y: "25%", image: '/images/germs/germ-purple.png', threshold: 25 },
        { id: 3, x: "50%", y: "50%", image: '/images/germs/germ-blue.png', threshold: 40 },
        { id: 4, x: "20%", y: "45%", image: '/images/germs/germ-green.png', threshold: 55 },
        { id: 5, x: "65%", y: "60%", image: '/images/germs/germ-purple.png', threshold: 70 },
        { id: 6, x: "40%", y: "75%", image: '/images/germs/germ-blue.png', threshold: 85 },
    ], []);

    const handRef = useRef<HTMLDivElement>(null);

    const handleFaucetClick = () => {
        if (waterPhase === 0) {
            // Turn on water to start scrubbing
            const audio = new Audio('/sfx/correct.mp3');
            audio.play().catch(e => console.warn("Sfx play failed:", e));
            setWaterPhase(1);
            setIsPouring(true);
            setTimeout(() => setIsPouring(false), 2000); // 2s pour duration
        } else if (waterPhase === 2) {
            // Turn on water to rinse and complete
            const audio = new Audio('/sfx/correct.mp3');
            audio.play().catch(e => console.warn("Sfx play failed:", e));
            setWaterPhase(3);
            setIsPouring(true);
            setTimeout(() => {
                setIsWon(true);
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            }, 2000); // 2s rinse animation then win
        }
    };

    const handleScrub = (e: React.PointerEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (waterPhase !== 1) return; // Only scrub if water has been opened once and we haven't finished

        // Increase scrub progress
        setScrubProgress(prev => {
            const next = Math.min(100, prev + 2); // 2% per move
            if (next === 100 && prev < 100) {
                setWaterPhase(2); // Ready to rinse
                const audio = new Audio('/sfx/correct.mp3');
                audio.play().catch(console.warn);
            }
            return next;
        });

        // Add a random bubble occasionally based on pointer position roughly
        if (Math.random() < 0.2 && handRef.current) {
            const rect = handRef.current.getBoundingClientRect();
            let clientX, clientY;
            if ('touches' in e) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            const xPos = ((clientX - rect.left) / rect.width) * 100;
            const yPos = ((clientY - rect.top) / rect.height) * 100;

            const bubbleType = `bubble${Math.floor(Math.random() * 3) + 1}.png`; // bubble1, 2, or 3
            const scale = 0.5 + Math.random();

            setBubbles(prev => [...prev, {
                id: Date.now() + Math.random(),
                x: `${xPos}%`,
                y: `${yPos}%`,
                type: bubbleType,
                scale
            }].slice(-30)); // Keep max 30 bubbles on screen
        }
    };

    return (
        <div className="relative w-full max-w-4xl h-auto bg-sky-50/50 backdrop-blur-sm border-4 border-white rounded-3xl md:rounded-[4rem] flex flex-col items-center justify-center p-4 md:p-8">
            {/* Phase Indicator */}
            <div className="w-full flex justify-between items-center mb-6">
                <div>
                    <h4 className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-widest mb-1">Soap & Water Superheroes</h4>
                    <p className="text-[10px] md:text-xs text-slate-700 font-bold italic">
                        {waterPhase === 0 && "Click the faucet to wet your hands!"}
                        {waterPhase === 1 && "Rub your hands together to make bubbles!"}
                        {waterPhase === 2 && "Click the faucet again to rinse!"}
                        {waterPhase === 3 && "Squeaky clean!"}
                    </p>
                </div>
                <div className="flex gap-1.5 md:gap-2">
                    {[1, 2, 3].map((p) => (
                        <div
                            key={p}
                            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${waterPhase >= p ? 'bg-sky-500' : 'bg-sky-200'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Game Canvas */}
            <div className="relative w-full aspect-4/5 sm:aspect-square md:aspect-4/3 max-w-2xl bg-[#E8F8FA] rounded-2xl md:rounded-[3rem] shadow-2xl border-4 border-sky-100 flex flex-col items-center justify-end overflow-hidden pb-4 md:pb-8">

                {/* Score/Progress HUD */}
                {waterPhase === 1 && (
                    <div className="absolute top-2 md:top-4 right-2 md:left-1/2 md:-translate-x-1/2 flex flex-col items-end md:items-center gap-1 z-50 pointer-events-none">
                        <div className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-sky-100 text-blue-900/60 font-black text-[8px] md:text-[10px] uppercase tracking-widest shadow-sm">
                            Prog: {Math.floor(scrubProgress)}%
                        </div>
                        <div className="w-20 md:w-48 h-1.5 md:h-2 bg-sky-200/50 rounded-full overflow-hidden backdrop-blur-sm">
                            <motion.div
                                className="h-full bg-sky-500"
                                animate={{ width: `${scrubProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Faucet Element */}
                <motion.div
                    className="absolute top-2 md:top-8 left-2 md:left-1/3 md:-translate-x-1/2 z-40 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFaucetClick}
                >
                    <img src="/images/handwash/faucet.png" alt="Faucet" className="w-24 md:w-56 drop-shadow-xl translate-y-1 md:translate-y-4" draggable={false} />

                    {/* Glowing highlight when needs click */}
                    {(waterPhase === 0 || waterPhase === 2) && (
                        <motion.div
                            className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl mix-blend-overlay"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        />
                    )}
                </motion.div>

                {/* Hand Container Element */}
                <div
                    ref={handRef}
                    className="absolute bottom-0 left-0 right-0 mx-auto w-[85%] md:w-[60%] aspect-square z-20 touch-none flex items-center justify-center cursor-pointer -translate-y-4 md:-translate-y-12"
                    onPointerMove={handleScrub}
                    onTouchMove={handleScrub}
                >
                    <img src="/images/handwash/hand.png" alt="Hand" className="w-full h-full object-contain drop-shadow-2xl pointer-events-none origin-bottom" draggable={false} />

                    {/* Germs Overlay */}
                    {germs.map((germ: { id: number; x: string; y: string; image: string; threshold: number }) => {
                        const opacity = waterPhase === 3 ? 0 : Math.max(0, 1 - (scrubProgress / germ.threshold));
                        return (
                            <motion.img
                                key={germ.id}
                                src={germ.image}
                                alt="Germ"
                                className="absolute w-8 h-8 md:w-12 md:h-12 object-contain pointer-events-none z-30"
                                style={{ left: germ.x, top: germ.y }}
                                animate={{ opacity, scale: opacity > 0 ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                                draggable={false}
                            />
                        );
                    })}

                    {/* Bubbles Overlay */}
                    <AnimatePresence>
                        {waterPhase >= 1 && waterPhase < 3 && bubbles.map((bubble) => (
                            <motion.img
                                key={bubble.id}
                                src={`/images/handwash/${bubble.type}`}
                                alt="Bubble"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: bubble.scale }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="absolute w-12 h-12 md:w-16 md:h-16 object-contain pointer-events-none z-30"
                                style={{ left: bubble.x, top: bubble.y, transform: 'translate(-50%, -50%)' }}
                            />
                        ))}
                    </AnimatePresence>

                    {/* Water Lap Overlay (Pouring Water) */}
                    <AnimatePresence>
                        {isPouring && (
                            <motion.img
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                src="/images/handwash/waterlap.png"
                                alt="Water Lap"
                                className="absolute z-40 w-[60%] md:w-[30%] object-contain top-[25%] left-[20%] md:top-[33%] md:left-1/3 md:-translate-x-1/2 mix-blend-hard-light pointer-events-none drop-shadow-lg"
                            />
                        )}
                    </AnimatePresence>
                </div>

            </div>

            {/* Success Modal */}
            {isWon && (
                <GameSuccessModal
                    title="Super Scrubbed!"
                    description="You've washed away all the germs. Great job hero!"
                    onContinue={onComplete}
                />
            )}
        </div>
    );
};


const WhosNextGame = ({ onComplete }: { onComplete: () => void }) => {
    const [isWon, setIsWon] = useState(false);
    return (
        <div className="relative flex flex-col items-center justify-center p-10 bg-purple-50 rounded-[3rem] border-4 border-purple-200 overflow-hidden">
            <h3 className="text-2xl font-black text-purple-900 mb-4">Who's Next?</h3>
            <p className="text-purple-700 mb-8 text-center max-w-md">
                Game logic coming soon! Imagine a line of people waiting...
            </p>
            <PlayfulButton onClick={() => {
                setIsWon(true);
                confetti({ particleCount: 100, spread: 50 });
            }} color="purple">
                Finish Game
            </PlayfulButton>

            {isWon && (
                <GameSuccessModal
                    title="Mission Accomplished!"
                    description="You've completed this challenge."
                    onContinue={onComplete}
                />
            )}
        </div>
    );
};

const HeroOrOopsGame = ({ onComplete, invertChoices }: { onComplete: () => void, invertChoices?: boolean }) => {
    const [isWon, setIsWon] = useState(false);
    const [scenarios] = useState([
        { id: 1, title: "Flushing after use", isHero: true, image: "/images/toilet-behavior/flushing.png" },
        { id: 2, title: "Leaving tissues on the floor", isHero: false, image: "/images/toilet-behavior/leaving-tissues.png" },
        { id: 3, title: "Washing hands with soap", isHero: true, image: "/images/toilet-behavior/washing-hand.png" },
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
                    setIsWon(true);
                    confetti({ particleCount: 100, spread: 70 });
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
        <div className="flex flex-col items-center justify-center p-6 md:p-12 bg-sky-50/80 rounded-[3rem] border-4 border-sky-200 w-full max-w-2xl mx-auto relative">
            <div className="mb-4 flex flex-col items-center w-full">
                <span className="text-[12px] md:text-[14px] font-black text-sky-400 uppercase tracking-widest mb-3">Progress: {currentStep + 1}/{scenarios.length}</span>
                <div className="w-full max-w-xs h-3 bg-sky-100 rounded-full overflow-hidden shadow-inner">
                    <motion.div className="h-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]" animate={{ width: `${((currentStep + 1) / scenarios.length) * 100}%` }} />
                </div>
            </div>

            <div className="w-full aspect-video md:h-72 flex items-center justify-center mb-4 relative group overflow-hidden rounded-3xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={scenarios[currentStep].image}
                    alt={scenarios[currentStep].title}
                    className="w-full h-full object-contain drop-shadow-2xl scale-110"
                />
            </div>

            <h3 className="text-2xl font-black text-slate-800 mb-2 text-center">{scenarios[currentStep].title}</h3>
            <p className="text-slate-500 font-bold mb-4 text-center">Is this a Toilet Hero choice?</p>

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

            {isWon && (
                <GameSuccessModal
                    title="Hero Logic Master!"
                    description="You know exactly how a Toilet Hero behaves."
                    onContinue={onComplete}
                />
            )}
        </div>
    );
};

const CleanupChallengeGame = ({ onComplete, background }: { onComplete: () => void, background?: string }) => {
    const [isWon, setIsWon] = useState(false);
    const [wetFloorCleaned, setWetFloorCleaned] = useState(false);
    const [poopCleaned, setPoopCleaned] = useState(false);
    const [papersCleaned, setPapersCleaned] = useState([false, false, false]);

    const trashRef = useRef<HTMLImageElement>(null);
    const wetFloorRef = useRef<HTMLImageElement>(null);

    const playCorrectSfx = () => {
        const audio = new Audio('/sfx/correct.mp3');
        audio.play().catch(e => console.warn("Audio play failed:", e));
        confetti({ particleCount: 20, spread: 30 });
    };

    const checkIntersection = (point: { x: number, y: number }, ref: React.RefObject<HTMLImageElement | null>) => {
        if (!ref.current) return false;
        const rect = ref.current.getBoundingClientRect();
        // A generous bounding box check for mobile ease
        const padding = 20;
        return point.x >= rect.left - padding && point.x <= rect.right + padding &&
            point.y >= rect.top - padding && point.y <= rect.bottom + padding;
    };

    const handleDragEnd = (type: 'paper' | 'mop', info: any, index?: number) => {
        if (type === 'paper' && index !== undefined) {
            if (checkIntersection(info.point, trashRef)) {
                setPapersCleaned(prev => {
                    const next = [...prev];
                    next[index] = true;
                    return next;
                });
                playCorrectSfx();
            }
        } else if (type === 'mop') {
            if (checkIntersection(info.point, wetFloorRef)) {
                setWetFloorCleaned(true);
                playCorrectSfx();
            }
        }
    };

    const handleFlush = () => {
        if (!poopCleaned) {
            setPoopCleaned(true);
            playCorrectSfx();
        }
    };

    const progressCount = [wetFloorCleaned, poopCleaned, ...papersCleaned].filter(Boolean).length;
    const score = progressCount * 100;

    useEffect(() => {
        if (progressCount === 5) {
            setTimeout(() => {
                setIsWon(true);
                confetti({ particleCount: 150, spread: 70 });
            }, 500);
        }
    }, [progressCount]);

    return (
        <div className="relative flex flex-col items-center justify-center w-full max-w-4xl mx-auto">

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
                        <div className="flex items-center gap-2">🔄 Drag Mop to Wet Floor</div>
                        <div className="flex items-center gap-2">🗑️ Drag Paper to Trash</div>
                        <div className="flex items-center gap-2">🚽 Click Flush for Poop</div>
                    </div>
                </div>
            </motion.div>

            <div className="relative w-full aspect-video md:aspect-[16/9] md:h-auto bg-sky-50 rounded-[3rem] border-4 border-white shadow-2xl overflow-hidden mb-8 select-none touch-none">
                {/* Scenario background */}
                {background ? (
                    <img src={'/backgrounds/cleanup-challenge-bg.jpg'} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[15rem] opacity-20 pointer-events-none">🚽</div>
                )}

                {/* Trash Can (Target for Paper) */}
                <img ref={trashRef as React.RefObject<HTMLImageElement>} src="/images/cleanup/trash.png" alt="Trash" className="absolute bottom-[22%] left-[42%] h-[22%] object-contain pointer-events-none drop-shadow-md" />

                {/* Wet Floor (Target for Mop) */}
                {!wetFloorCleaned && (
                    <img ref={wetFloorRef as React.RefObject<HTMLImageElement>} src="/images/cleanup/wet-floor.png" alt="Wet Floor" className="absolute bottom-[1%] right-[20%] w-[20%] object-contain pointer-events-none drop-shadow-md" />
                )}

                {/* Poop (Click target is Flush) */}
                {!poopCleaned && (
                    <img src="/images/cleanup/poop.png" alt="Poop" className="absolute bottom-[35%] left-[62%] -translate-x-1/2 w-[8%] max-w-[50px] object-contain pointer-events-none drop-shadow-xl" />
                )}

                {/* Flush Button (Click Interaction) */}
                <motion.button
                    onClick={handleFlush}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-[41%] left-[68%] w-[8%] max-w-[50px] z-50 cursor-pointer pointer-events-auto"
                >
                    <img src="/images/cleanup/flush.png" alt="Flush" className="w-full object-contain drop-shadow-md" />
                </motion.button>

                {/* Papers (Draggable) */}
                {[0, 1, 2].map(idx => !papersCleaned[idx] && (
                    <motion.div
                        key={`paper-${idx}`}
                        drag
                        dragMomentum={false}
                        dragSnapToOrigin={true}
                        onDragEnd={(e, info) => handleDragEnd('paper', info, idx)}
                        whileHover={{ scale: 1.1 }}
                        whileDrag={{ scale: 1.2, zIndex: 100 }}
                        className={`absolute z-20 cursor-grab active:cursor-grabbing pointer-events-auto max-w-[60px] ${idx === 0 ? 'bottom-[10%] left-[32%] w-[10%]' :
                            idx === 1 ? 'bottom-[15%] left-[42%] w-[11%]' :
                                'bottom-[8%] left-[50%] w-[9%]'
                            }`}
                    >
                        <img src={`/images/cleanup/paper${idx + 1}.png`} alt={`Paper ${idx + 1}`} className="w-full object-contain drop-shadow-lg pointer-events-none" />
                    </motion.div>
                ))}

                {/* Mop (Draggable) */}
                <motion.div
                    drag={!wetFloorCleaned}
                    dragMomentum={false}
                    dragSnapToOrigin={true}
                    onDragEnd={(e, info) => handleDragEnd('mop', info)}
                    whileHover={{ scale: !wetFloorCleaned ? 1.05 : 1 }}
                    whileDrag={{ scale: 1.1, rotate: -15, zIndex: 100 }}
                    className={`absolute top-[30%] right-[3%] h-[60%] z-30 origin-bottom pointer-events-auto ${!wetFloorCleaned ? 'cursor-grab active:cursor-grabbing' : ''}`}
                >
                    <img src="/images/cleanup/mop.png" alt="Mop" className="h-full object-contain drop-shadow-2xl pointer-events-none" />
                </motion.div>

                {/* Sparkles for completed tasks */}
                {wetFloorCleaned && <div className="absolute bottom-[10%] right-[20%] text-4xl animate-bounce pointer-events-none">✨</div>}
                {poopCleaned && <div className="absolute bottom-[40%] left-[58%] -translate-x-1/2 text-4xl animate-pulse pointer-events-none">✨</div>}
            </div>

            {isWon && (
                <GameSuccessModal
                    title="Mission Secured!"
                    description="The restroom is sparkling clean thanks to you!"
                    onContinue={onComplete}
                />
            )}
        </div>
    );
};

const PledgeSlide = ({ title, subtitle, content, onComplete }: Partial<Slide> & { onComplete: () => void }) => {
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
        <div className="flex flex-col items-center justify-center h-full w-full max-w-6xl mx-auto p-2 md:p-4">
            <h2 className="text-xl md:text-4xl font-black tracking-tighter text-blue-900 leading-tight uppercase text-center">{title}</h2>
            <p className="text-sm md:text-2xl text-slate-700 font-black uppercase max-w-2xl leading-relaxed px-4 text-center">
                {subtitle}
            </p>
            <div className="relative w-full aspect-[16/9] max-w-6xl mb-4 rounded-3xl overflow-hidden shadow-2xl border-4 border-white mx-auto">
                <img src="/images/pledge-bg.jpg" alt="Pledge Background" className="w-full h-full object-cover pointer-events-none select-none" draggable={false} />
                {/* Hotspot Container */}
                <div className="absolute bottom-[10%] left-[39%] w-[58%] h-[38%] flex justify-between">
                    {[0, 1, 2, 3].map((index) => {
                        const isChecked = checkedItems.includes(index);
                        return (
                            <motion.button
                                key={index}
                                onClick={() => toggleItem(index)}
                                className={`relative w-[23%] h-full rounded-2xl cursor-pointer transition-all border-4 ${isChecked ? "border-green-500 bg-green-500/20" : "border-transparent"
                                    }`}
                                animate={!isChecked ? {
                                    backgroundColor: ["rgba(255, 255, 255, 0.0)", "rgba(255, 255, 255, 0.4)", "rgba(255, 255, 255, 0.0)"],
                                    borderColor: ["rgba(255, 255, 255, 0.0)", "rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.0)"],
                                    boxShadow: ["0px 0px 0px rgba(255,255,255,0)", "0px 0px 20px rgba(255,255,255,0.6)", "0px 0px 0px rgba(255,255,255,0)"]
                                } : {
                                    scale: 1
                                }}
                                transition={!isChecked ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { type: "spring" }}
                                whileHover={!isChecked ? { scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.6)" } : {}}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isChecked && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="absolute -top-4 -right-4 bg-green-500 rounded-full p-1 text-white shadow-xl z-10 border-4 border-white"
                                    >
                                        <CheckCircle className="w-6 h-6 md:w-8 md:h-8" />
                                    </motion.div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <p className="text-[10px] md:text-base font-bold text-blue-600 bg-blue-50 px-3 md:px-4 py-1 md:py-1.5 rounded-full mb-3 md:mb-6 animate-pulse flex items-center gap-2 border border-blue-100">
                click for your pledges 👆🏻
            </p>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <PlayfulButton
                    color={checkedItems.length === 4 ? "orange" : "blue"}
                    className="px-8 py-4 md:px-12 md:py-6"
                    disabled={checkedItems.length !== 4}
                    onClick={() => {
                        confetti({
                            particleCount: 200,
                            spread: 100,
                            origin: { y: 0.6 }
                        });
                        onComplete();
                    }}
                >
                    <span className="text-sm md:text-xl">
                        {checkedItems.length === 4 ? "I am a Toilet Hero!" : "Unlock Pledge First!"}
                    </span>
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
            <img src="/mascots/mascot-pose.png" alt="Mascot" className="w-32 md:w-56 h-auto" />
        </motion.div>
        <h1 className="font-nerko tracking-wide text-3xl sm:text-5xl md:text-8xl font-black tracking-tighter text-blue-900 drop-shadow-sm leading-none pb-2 uppercase text-center max-w-4xl">
            {title}
        </h1>
        <p className="text-base md:text-2xl text-blue-900 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] max-w-2xl leading-relaxed px-4">
            {subtitle}
        </p>
    </div>
);

const ContentSlide = ({ title, content, mascot, isModule1 }: Partial<Slide> & { isModule1?: boolean }) => {
    const isList = content?.includes('•');
    const points = content?.split('\n').filter(p => p.trim() !== '') || [];

    const germAssets = [
        '/images/points/germ-green01.png',
        '/images/points/germ-purple02.png',
        '/images/points/germ-purple03.png',
        '/images/points/germ-blue04.png',
    ];

    // Predefined positions for germ points to create a scattered horizontal look
    const positions = [
        { top: '5%', left: '2%' },
        { top: '40%', left: '50%' },
        { top: '5%', left: '55%' },
        { top: '40%', left: '5%' },
    ];

    return (
        <div className="flex flex-col h-full max-w-6xl mx-auto py-4 relative">
            <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-slate-900 text-white rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl rotate-3 shrink-0">
                    <BookOpen className="w-5 h-5 md:w-8 md:h-8" />
                </div>
                <h2 className="text-2xl md:text-5xl font-black tracking-tighter text-blue-900 uppercase">
                    {title}
                </h2>
            </div>

            <div className={`flex flex-col lg:flex-row gap-4 lg:gap-8 lg:items-center relative z-10 w-full grow ${isList ? '' : 'items-center lg:items-start'}`}>
                <div className={`relative flex-1 ${isList && isModule1 ? 'min-h-[400px] md:h-[600px] w-full' : isList ? 'w-full' : 'text-lg md:text-2xl leading-relaxed text-slate-500 whitespace-pre-line font-medium border-l-4 border-sky-100 pl-6 md:pl-10 ml-4 md:ml-8'}`}>
                    {isList ? (
                        isModule1 ? (
                            points.map((point, idx) => {
                                const pos = positions[idx % positions.length];
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.2 }}
                                        className="absolute"
                                        style={{
                                            top: pos.top,
                                            left: pos.left,
                                            width: '320px',
                                            height: '200px'
                                        }}
                                    >
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.05, 1],
                                                rotate: [0, 1, -1, 0]
                                            }}
                                            transition={{
                                                duration: 5,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: idx * 0.7
                                            }}
                                            className="relative w-full h-full flex items-center justify-center p-8 overflow-hidden group"
                                        >
                                            {/* Germ background image - using object-contain to prevent stretching */}
                                            <div className="absolute inset-0 z-0">
                                                <img
                                                    src={germAssets[idx % germAssets.length]}
                                                    alt="Germ Frame"
                                                    className="w-full h-full object-contain filter drop-shadow-xl group-hover:brightness-105 transition-all duration-500"
                                                />
                                            </div>

                                            <span className="relative z-10 text-center text-sm md:text-base font-black text-white leading-tight px-6 drop-shadow-sm pointer-events-none">
                                                {point.replace('•', '').trim()}
                                            </span>
                                        </motion.div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <ul className="space-y-6">
                                {points.map((point, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-start gap-4 text-slate-700 bg-white/40 p-5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-sm"
                                    >
                                        <div className="mt-1 w-6 h-6 shrink-0 bg-sky-500 rounded-full flex items-center justify-center text-white text-[10px] shadow-lg">
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                        <span className="text-xl md:text-2xl font-bold leading-tight tracking-tight">
                                            {point.replace('•', '').trim()}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>
                        )
                    ) : (
                        content
                    )}
                </div>

                {mascot && (
                    <div className="hidden lg:block shrink-0 relative z-20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={mascot} alt="Mascot" className="w-[350px] h-auto drop-shadow-2xl" />
                    </div>
                )}
            </div>

        </div>
    );
};

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
        } else {
            const audio = new Audio('/sfx/wrong.mp3');
            audio.play().catch(e => console.warn("Sfx play failed:", e));
        }
    };

    return (
        <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center">
            {/* Content Layer */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center p-4 md:p-12">
                <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/90 backdrop-blur px-4 py-2 md:px-6 md:py-3 rounded-2xl shadow-xl mb-4 md:mb-12 border border-blue-100 max-w-[95%]"
                >
                    <h3 className="text-base md:text-2xl font-black text-blue-900 uppercase tracking-widest text-center">
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

const VideoSlide = ({ title, videoUrl, content, audio, onReady }: Partial<Slide> & { onReady?: () => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const isList = content?.includes('•');

    useEffect(() => {
        if (videoRef.current && audio) {
            videoRef.current.volume = 0.3;
        }
    }, [audio]);
    const points = content?.split('\n').filter(p => p.trim() !== '') || [];

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto py-2 space-y-4 text-center p-2">
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-blue-900 leading-tight uppercase">{title}</h2>
            <div className="relative group rounded-xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900/5 max-w-[95%] md:max-w-full">
                <video
                    ref={videoRef}
                    src={videoUrl}
                    autoPlay
                    loop
                    playsInline
                    onCanPlayThrough={() => onReady?.()}
                    className="w-full h-auto max-h-[45vh] md:max-h-[55vh] object-contain block"
                />
                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-[inherit]" />
            </div>
            {content && (

                <div className="max-w-3xl mx-auto mt-4 px-4 overflow-y-auto no-scrollbar max-h-[25vh]">
                    {isList ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {points.map((point, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-3 rounded-xl border border-white/60 shadow-sm"
                                >
                                    <div className="w-2 h-2 bg-sky-500 rounded-full shrink-0" />
                                    <span className="text-sm md:text-base font-bold text-slate-700 text-left leading-tight">
                                        {point.replace('•', '').trim()}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/60">
                            {content}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

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
                        {question.description === "" ? "" : `"${question.description}"`}
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
    const { data: session, status } = useSession();
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
    const [postQuizVideoPlaying, setPostQuizVideoPlaying] = useState(false);
    // Track completed slide indices
    const [completedSlides, setCompletedSlides] = useState<Record<number, boolean>>({});
    // Countdown timer state
    const [countdown, setCountdown] = useState(0);
    const [isTimerLocked, setIsTimerLocked] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);

    const [slides, setSlides] = useState<Slide[]>(dummySlides);
    const [initialSlideLoaded, setInitialSlideLoaded] = useState(false);
    const currentAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

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
                        // Assume all previous slides are completed
                        const prevCompleted: Record<number, boolean> = {};
                        for (let i = 0; i < progressData.currentSlide; i++) {
                            prevCompleted[i] = true;
                        }
                        setCompletedSlides(prevCompleted);
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

    // Timer Logic
    useEffect(() => {
        if (slides[currentIdx]?.waitSeconds && slides[currentIdx].waitSeconds > 0 && !completedSlides[currentIdx]) {
            setIsTimerLocked(true);
            setCountdown(slides[currentIdx].waitSeconds);

            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsTimerLocked(false);
                        // Mark as completed once timer ends so it doesn't re-lock
                        setCompletedSlides(prevComp => ({ ...prevComp, [currentIdx]: true }));
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        } else {
            setIsTimerLocked(false);
            setCountdown(0);
        }
        // Reset video ready state on slide change
        setIsVideoReady(false);
    }, [currentIdx, slides, completedSlides[currentIdx]]);

    // Handle Slide Audio Playback
    useEffect(() => {
        // Stop currently playing audio
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
            currentAudioRef.current = null;
        }

        const audioPath = slides[currentIdx]?.audio;
        if (audioPath) {
            const audio = new Audio(audioPath);
            currentAudioRef.current = audio;

            const playAudio = () => {
                audio.play().catch(err => {
                    console.warn("Audio autoplay blocked or failed:", err);
                });
            };

            // If it's a video slide, wait for it to be ready
            if (slides[currentIdx]?.type === 'video') {
                if (isVideoReady) {
                    playAudio();
                }
                // Otherwise wait for isVideoReady to become true via the dependency array
            } else {
                playAudio();
            }
        }

        return () => {
            if (currentAudioRef.current) {
                currentAudioRef.current.pause();
                currentAudioRef.current.currentTime = 0;
            }
        };
    }, [currentIdx, slides, isVideoReady]);

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
            // Mark current slide as completed when moving forward
            setCompletedSlides(prev => ({ ...prev, [currentIdx]: true }));

            // Play SFX
            const audio = new Audio('/sfx/next.mp3');
            audio.play().catch(e => console.warn("Next sfx play failed:", e));

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
    const isSlideLocked = !completedSlides[currentIdx] && (
        isTimerLocked ||
        (currentSlide.type === "game" && gameState !== "completed") ||
        (currentSlide.type === "comparison" && gameState !== "completed") ||
        (currentSlide.type === "quiz" && quizState !== "completed") ||
        (currentSlide.type === "celebration" && currentSlide.title.includes("Pledge") && gameState !== "completed")
    );

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
            <main className="relative pt-16 pb-24 md:pb-24 h-dvh flex items-center justify-center overflow-hidden">
                {/* --- Background Image or Video --- */}
                {(() => {
                    const bgPath = currentSlide.background
                        ? currentSlide.background
                        : currentSlide.type === 'celebration'
                            ? (currentSlide.mascot?.includes('m2-mascot-final')
                                ? '/backgrounds/module-2-final-bg.png'
                                : '/images/celebration-bg.jpg')
                            : currentSlide.type === 'comparison'
                                ? '/images/toilet-comparison-bg.jpg'
                                : (currentIdx >= 2 && currentIdx <= 5)
                                    ? '/images/lesson-bg-germs.jpg'
                                    : '/images/lesson-bg.jpg';

                    const isVideo = bgPath.toLowerCase().endsWith('.mov') || bgPath.toLowerCase().endsWith('.mp4');

                    if (isVideo) {
                        return (
                            <div className="fixed inset-0 z-0">
                                <video
                                    src={bgPath}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover transition-opacity duration-700"
                                />
                            </div>
                        );
                    }

                    return (
                        <div
                            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
                            style={{ backgroundImage: `url('${bgPath}')` }}
                        />
                    );
                })()}
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
                            className={`w-full ${currentSlide.type === "game" || currentSlide.type === "comparison" || currentSlide.type === "quiz" || currentSlide.type === "video" || currentSlide.type === "pledge" ? "" : "bg-white/20 backdrop-blur shadow-[0_0_50px_rgba(0,0,0,0.05)] rounded-4xl md:rounded-5xl border border-white/40"} p-4 md:p-12 w-full max-w-[95vw] h-auto min-h-[40dvh] max-h-[calc(100dvh-180px)] md:max-h-[calc(100dvh-200px)] flex flex-col relative overflow-y-auto overflow-x-hidden no-scrollbar mb-2 md:mb-6`}
                        >
                            {/* Dynamic Slide Switcher */}
                            <div className="w-full m-auto">
                                {currentSlide.type === "title" && <TitleSlide {...currentSlide} />}
                                {currentSlide.type === "content" && (
                                    <ContentSlide
                                        {...currentSlide}
                                        isModule1={slides.some(s => s.title && s.title.toLowerCase().includes("germ"))}
                                    />
                                )}
                                {currentSlide.type === "image" && <ImageSlide {...currentSlide} />}
                                {currentSlide.type === "video" && <VideoSlide {...currentSlide} onReady={() => setIsVideoReady(true)} />}
                                {currentSlide.type === "celebration" &&
                                    <CelebrationSlide {...currentSlide} />
                                }
                                {currentSlide.type === "pledge" &&
                                    <PledgeSlide {...currentSlide} onComplete={() => {
                                        setGameState('completed');
                                        setCompletedSlides(prev => ({ ...prev, [currentIdx]: true }));
                                        handleNext();
                                    }} />
                                }

                                {/* Game Logic */}
                                {currentSlide.type === "game" && (
                                    gameState === "playing" ? (
                                        currentSlide.gameType === "Story Interaction" ? (
                                            <HandwashingGame onComplete={() => {
                                                setGameState('completed');
                                                setCompletedSlides(prev => ({ ...prev, [currentIdx]: true }));
                                                playYay();
                                                handleNext();
                                                // setTimeout(handleNext, 500);
                                            }} />
                                        ) : currentSlide.gameType === "WhosNext" ? (
                                            <WhosNextGame onComplete={() => {
                                                setGameState('completed');
                                                setCompletedSlides(prev => ({ ...prev, [currentIdx]: true }));
                                                playYay();
                                                handleNext();
                                            }} />
                                        ) : currentSlide.gameType === "HeroOrOops" ? (
                                            <HeroOrOopsGame onComplete={() => {
                                                setGameState('completed');
                                                setCompletedSlides(prev => ({ ...prev, [currentIdx]: true }));
                                                playYay();
                                                handleNext();
                                            }} invertChoices={currentSlide.invertChoices} />
                                        ) : currentSlide.gameType === "CleanupChallenge" ? (
                                            <CleanupChallengeGame
                                                onComplete={() => {
                                                    setGameState('completed');
                                                    setCompletedSlides(prev => ({ ...prev, [currentIdx]: true }));
                                                    playYay();
                                                    handleNext();
                                                }}
                                                background={currentSlide.background}
                                            />
                                        ) : (
                                            <GermHunterGame onComplete={() => {
                                                setGameState('completed');
                                                setCompletedSlides(prev => ({ ...prev, [currentIdx]: true }));
                                                playYay();
                                                handleNext();
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
                                            setCompletedSlides(prev => ({ ...prev, [currentIdx]: true }));
                                            playYay();
                                            handleNext();
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
                                                setCompletedSlides(prev => ({ ...prev, [currentIdx]: true }));
                                                playYay();
                                                setPostQuizVideoPlaying(true);
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

                    {/* Post-Quiz Video Overlay */}
                    <AnimatePresence>
                        {postQuizVideoPlaying && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-100 bg-black flex items-center justify-center overflow-hidden"
                            >
                                <video
                                    src={
                                        slides.some(s => s.content && s.content.includes("Bin"))
                                            ? "/videos/module-b/B10.mp4" : "/videos/module-a/A12.mp4"}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-contain"
                                    onEnded={() => {
                                        setPostQuizVideoPlaying(false);
                                        handleNext();
                                    }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* 4. Navigation Footer */}
            <footer className="fixed bottom-0 left-0 right-0 z-30 h-20 md:h-24 p-2 md:p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <div className="max-w-5xl mx-auto h-full flex flex-row flex-nowrap items-center justify-between gap-2 md:gap-8">

                    <button
                        onClick={handlePrev}
                        disabled={currentIdx === 0 || gameState === "playing" || quizState === "playing"}
                        className="group flex items-center justify-center gap-1.5 px-3 py-2 md:px-8 md:py-4 bg-white border border-slate-100 text-slate-400 rounded-xl md:rounded-3xl font-black text-[9px] md:text-xs uppercase tracking-widest hover:text-slate-900 hover:border-slate-300 transition-all disabled:opacity-0 disabled:pointer-events-none shadow-sm shadow-slate-200/50 min-w-fit"
                    >
                        <ChevronLeft className="w-3.5 h-3.5 md:w-5 md:h-5 md:group-hover:-translate-x-1 transition-transform" />
                        <span className="sm:inline">Prev</span>
                    </button>

                    {/* Dot Navigation - hidden on mobile/tablet to prevent flex overlap causing issues; on desktop, allow horizontal scroll if too many slides */}
                    <div className="hidden lg:flex items-center gap-2 md:gap-3 bg-slate-50/50 p-2 md:p-3 rounded-full border border-slate-100 overflow-x-auto no-scrollbar max-w-[50%] shrink-0">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => !isSlideLocked && jumpToSlide(i)}
                                disabled={isSlideLocked}
                                className={`transition-all duration-700 rounded-full shrink-0 ${currentIdx === i
                                    ? "w-8 md:w-10 h-2 md:h-3 bg-[#2196F3] shadow-[0_0_15px_rgba(15,23,42,0.2)]"
                                    : "w-2 md:w-3 h-2 md:h-3 bg-slate-200 hover:bg-slate-300"
                                    } ${isSlideLocked && 'cursor-not-allowed opacity-50'}`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Mobile/Tablet Numeric Indicator */}
                    <div className="lg:hidden flex flex-col items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Slide</span>
                        <span className="text-xs font-black text-[#2196F3]">{currentIdx + 1} / {totalSlides}</span>
                    </div>

                    <div className="flex justify-end min-w-fit">
                        {currentIdx === totalSlides - 1 ? (
                            <PlayfulButton
                                onClick={handleComplete}
                                disabled={isMarked || isTimerLocked}
                                color={isMarked ? "green" : isTimerLocked ? "blue" : "blue"}
                                className={`px-5 py-3 md:px-10 md:py-5 ${isTimerLocked ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                            >
                                <div className="flex items-center justify-center gap-2 md:gap-3">
                                    <span className="text-xs md:text-base">
                                        {isMarked ? 'Done' : isTimerLocked ? `Wait ${countdown}s` : 'Complete'}
                                    </span>
                                    {!isMarked && !isTimerLocked && <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />}
                                </div>
                            </PlayfulButton>
                        ) : (
                            <PlayfulButton
                                onClick={handleNext}
                                disabled={isSlideLocked}
                                color={isSlideLocked ? "blue" : "blue"}
                                className={`px-5 py-3 md:px-10 md:py-5 ${isSlideLocked ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                            >
                                <div className="flex items-center justify-center gap-2 md:gap-4">
                                    <span className="text-xs md:text-base">
                                        {isTimerLocked ? `Wait ${countdown}s` : isSlideLocked ? 'Locked' : 'Next'}
                                    </span>
                                    {!isSlideLocked && <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />}
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

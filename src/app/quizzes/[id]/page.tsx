"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Send,
  Trophy,
  LayoutDashboard,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

interface Question {
  id: string;
  question: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "MULTIPLE_SELECT" | "TEXT_INPUT";
  options?: string[];
  correctAnswer?: any;
}

const dummyQuiz = {
  id: "quiz-1",
  title: "Restroom Engineering Final Assessment",
  moduleId: "mod-1",
  questions: [
    {
      id: "q1",
      type: "MULTIPLE_CHOICE",
      question: "What is the minimum required turning radius for a wheelchair-accessible restroom?",
      options: ["48 inches", "60 inches", "72 inches", "55 inches"],
    },
    {
      id: "q2",
      type: "TRUE_FALSE",
      question: "Automatic sensors are mandatory for all public restrooms regarless of local codes.",
      options: ["True", "False"],
    },
    {
      id: "q3",
      type: "MULTIPLE_SELECT",
      question: "Which of the following are considered anti-microbial materials?",
      options: ["Copper Alloys", "Untreated Wood", "Silver-ion infused plastics", "Porous Sandstone"],
    },
    {
      id: "q4",
      type: "TEXT_INPUT",
      question: "Briefly explain why slip resistance is critical for flooring in high-moisture environments.",
    }
  ] as Question[]
};

export default function EnhancedQuizPage() {
  const params = useParams();
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [direction, setDirection] = useState(0); // For slide direction

  const currentQuestion = dummyQuiz.questions[currentIdx];

  const handleAnswer = (val: any) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }));
  };

  const handleMultipleSelect = (optionIdx: number) => {
    const current = (answers[currentQuestion.id] || []) as number[];
    const updated = current.includes(optionIdx)
      ? current.filter(i => i !== optionIdx)
      : [...current, optionIdx];
    handleAnswer(updated);
  };

  const nextQuestion = () => {
    if (currentIdx < dummyQuiz.questions.length - 1) {
      setDirection(1);
      setCurrentIdx(currentIdx + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIdx > 0) {
      setDirection(-1);
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#4ade80', '#fbbf24']
    });
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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.95
    })
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* --- Floating Background Decorations --- */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <motion.div
            variants={bubbleVariants}
            animate="animate"
            className="absolute top-20 left-[10%] w-64 h-64 bg-sky-50 rounded-full blur-3xl opacity-50"
          />
          <motion.div
            variants={bubbleVariants}
            animate="animate"
            style={{ transitionDelay: "1s" }}
            className="absolute bottom-40 right-[15%] w-96 h-96 bg-yellow-50 rounded-full blur-3xl opacity-50"
          />
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-xl w-full bg-white/70 backdrop-blur-2xl rounded-[3rem] p-16 shadow-2xl shadow-sky-100 border border-white text-center relative z-10"
        >
          <div className="w-24 h-24 bg-yellow-50 text-yellow-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner rotate-3">
            <Trophy className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Exam Accomplished!</h1>
          <p className="text-slate-400 font-medium text-lg mb-10">You've successfully secured all objectives for <br /><span className="text-slate-900 font-bold">{dummyQuiz.title}</span>.</p>

          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Final Rank</span>
              <span className="text-3xl font-black text-slate-900">S-GRADE</span>
            </div>
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Status</span>
              <span className="text-3xl font-black text-green-500 uppercase">Passed</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/dashboard" className="flex-1 px-8 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-sky-500 transition-all shadow-xl">
              <LayoutDashboard className="w-4 h-4" />
              Command Centre
            </Link>
            <Link href={`/modules/${dummyQuiz.moduleId}`} className="flex-1 px-8 py-5 bg-white border border-slate-100 text-slate-400 hover:text-slate-900 rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
              Module View
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden relative selection:bg-sky-100 selection:text-sky-900">
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

      {/* Quiz Progress Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 line-clamp-1 leading-none mb-1 uppercase tracking-tight">{dummyQuiz.title}</h2>
              <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em]">Question {currentIdx + 1} of {dummyQuiz.questions.length}</p>
            </div>
          </div>
          <Link href={`/modules/${dummyQuiz.moduleId}`} className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 h-1.5 bg-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all duration-700 ease-out" style={{ width: `${((currentIdx + 1) / dummyQuiz.questions.length) * 100}%` }} />
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-40 pb-32">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIdx}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
          >
            <div className="mb-12">
              <span className="inline-block px-4 py-1.5 bg-sky-50 text-sky-500 rounded-full font-black text-[10px] uppercase tracking-widest border border-sky-100 mb-6">
                Objective Type: {currentQuestion.type.replace('_', ' ')}
              </span>
              <h1 className="text-4xl md:text-5xl font-black leading-none tracking-tighter text-slate-900 uppercase">
                {currentQuestion.question}
              </h1>
            </div>

            {/* Answer Types */}
            <div className="space-y-4">
              {currentQuestion.type === "MULTIPLE_CHOICE" && currentQuestion.options?.map((opt, i) => (
                <AnswerCard
                  key={i}
                  label={opt}
                  selected={answers[currentQuestion.id] === i}
                  onClick={() => handleAnswer(i)}
                />
              ))}

              {currentQuestion.type === "TRUE_FALSE" && (
                <div className="grid grid-cols-2 gap-6">
                  <AnswerCard label="True" selected={answers[currentQuestion.id] === true} onClick={() => handleAnswer(true)} />
                  <AnswerCard label="False" selected={answers[currentQuestion.id] === false} onClick={() => handleAnswer(false)} />
                </div>
              )}

              {currentQuestion.type === "MULTIPLE_SELECT" && currentQuestion.options?.map((opt, i) => (
                <AnswerCard
                  key={i}
                  label={opt}
                  selected={(answers[currentQuestion.id] || []).includes(i)}
                  onClick={() => handleMultipleSelect(i)}
                  multi
                />
              ))}

              {currentQuestion.type === "TEXT_INPUT" && (
                <motion.textarea
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder="Think like a hero and type your strategic response here..."
                  className="w-full h-56 p-8 bg-white/50 backdrop-blur-sm border-2 border-slate-100 rounded-[2.5rem] focus:border-sky-400 focus:bg-white outline-none transition-all shadow-xl shadow-slate-100/30 resize-none text-lg font-medium placeholder:text-slate-300"
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Navigation Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 bg-white/60 backdrop-blur-md border-t border-slate-100/50 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            disabled={currentIdx === 0}
            onClick={prevQuestion}
            className="w-16 h-16 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all disabled:opacity-0 shadow-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {currentIdx === dummyQuiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-sky-500 transition-all shadow-2xl shadow-sky-900/10"
            >
              <span>Verify Assessment</span>
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-sky-500 transition-all shadow-2xl shadow-sky-900/10 group"
            >
              <span>Next Objective</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

function AnswerCard({ label, selected, onClick, multi = false }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full group p-8 rounded-[2.5rem] border-2 transition-all flex items-center justify-between text-left ${selected
        ? "bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-900/10"
        : "bg-white border-slate-100 text-slate-500 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-50/50"
        }`}
    >
      <span className="text-lg font-black uppercase tracking-tight leading-tight">{label}</span>
      <div className={`w-10 h-10 rounded-[1rem] border-2 flex items-center justify-center transition-all shrink-0 ${selected
        ? "bg-sky-400 border-sky-400 text-white"
        : "border-slate-100 group-hover:border-sky-200"
        }`}>
        {selected && <CheckCircle2 className="w-6 h-6" />}
      </div>
    </motion.button>
  );
}

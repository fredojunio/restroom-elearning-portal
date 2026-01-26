"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Send,
  Trophy,
  LayoutDashboard
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
      origin: { y: 0.6 }
    });
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-xl w-full bg-white rounded-[2rem] p-12 shadow-2xl border border-slate-100 text-center"
        >
          <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Quiz Completed!</h1>
          <p className="text-slate-500 mb-8">You've successfully finished the assessment for {dummyQuiz.title}.</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-2xl">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Score</span>
              <span className="text-2xl font-black text-slate-900">100%</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</span>
              <span className="text-2xl font-black text-green-600">PASSED</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard" className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link href={`/modules/${dummyQuiz.moduleId}`} className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              Module View
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Quiz Progress Header */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 line-clamp-1">{dummyQuiz.title}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question {currentIdx + 1} of {dummyQuiz.questions.length}</p>
            </div>
          </div>
          <Link href={`/modules/${dummyQuiz.moduleId}`} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 h-[2px] bg-indigo-600 transition-all duration-500" style={{ width: `${((currentIdx + 1) / dummyQuiz.questions.length) * 100}%` }} />
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
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
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">
                {currentQuestion.type.replace('_', ' ')}
              </span>
              <h1 className="text-3xl md:text-4xl font-black leading-tight text-slate-900">
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
                <div className="grid grid-cols-2 gap-4">
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
                  placeholder="Type your response here..."
                  className="w-full h-48 p-6 bg-white border-2 border-slate-100 rounded-[2rem] focus:border-indigo-500 outline-none transition-all shadow-sm resize-none text-lg font-medium"
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Navigation Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent">
        <div className="max-w-3xl mx-auto flex items-center justify-between pointer-events-auto">
          <button
            disabled={currentIdx === 0}
            onClick={prevQuestion}
            className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all disabled:opacity-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {currentIdx === dummyQuiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-100"
            >
              <span>Submit Assessment</span>
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-200"
            >
              <span>Continue</span>
              <ChevronRight className="w-5 h-5" />
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
      className={`w-full group p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between text-left ${selected
          ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100"
          : "bg-white border-slate-100 text-slate-600 hover:border-indigo-300 hover:shadow-md"
        }`}
    >
      <span className="text-lg font-bold">{label}</span>
      <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${selected
          ? "bg-white border-white text-indigo-600"
          : "border-slate-100 group-hover:border-indigo-200"
        }`}>
        {selected && <CheckCircle2 className="w-5 h-5" />}
      </div>
    </motion.button>
  );
}

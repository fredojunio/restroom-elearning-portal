/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ArrowLeft,
  BookOpen,
  Gamepad2,
  HelpCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Info
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  order: number;
}

interface Activity {
  id: string;
  title: string;
  type: string;
}

interface Quiz {
  id: string;
  title: string;
  type: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  grade: number;
  subject: string;
  content: string;
}

interface Progress {
  lessons: {
    completed: number;
    total: number;
    percentage: number;
    items: Lesson[];
  };
  activities: {
    completed: number;
    total: number;
    percentage: number;
    items: Activity[];
  };
  quizzes: {
    completed: number;
    total: number;
    percentage: number;
    items: Quiz[];
  };
  overall: {
    completed: number;
    total: number;
    percentage: number;
  };
}

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const moduleId = params.id as string;

  const [module, setModule] = useState<Module | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "lessons" | "activities" | "quizzes"
  >("lessons");

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    fetchModuleData();
  }, [moduleId, session, router]);

  const fetchModuleData = async () => {
    try {
      const [moduleRes, progressRes] = await Promise.all([
        fetch(`/api/modules/${moduleId}`),
        fetch(`/api/modules/${moduleId}/progress`),
      ]);

      if (!moduleRes.ok) throw new Error("Module not found");
      if (!progressRes.ok) throw new Error("Failed to fetch progress");

      const moduleData = await moduleRes.json();
      const progressData = await progressRes.json();

      setModule(moduleData);
      setProgress(progressData);
    } catch (error) {
      console.error("Failed to fetch module data:", error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <ShieldCheck className="text-sky-500 w-6 h-6" />
          </motion.div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Accessing Mission Data...</p>
        </div>
      </div>
    );
  }

  if (!module || !progress) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 font-bold mb-4 uppercase tracking-widest text-xs">Mission path not found.</p>
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-500 transition-colors inline-block"
          >
            ← Return to Command
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden">
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

      {/* Header */}
      <div className="relative bg-slate-900 text-white py-20 overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sky-500/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-slate-800 rounded-full opacity-50 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all font-black text-[10px] uppercase tracking-widest mb-10 border border-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            Control Centre
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-3xl">
              <div className="flex gap-3 mb-6">
                <span className="px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full font-black text-[10px] uppercase tracking-widest border border-sky-500/20">
                  Mission Grade {module.grade}
                </span>
                <span className="px-3 py-1 bg-white/5 text-slate-400 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/5">
                  {module.subject}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 uppercase leading-none">{module.title}</h1>
              <p className="text-slate-400 text-xl font-medium leading-relaxed">{module.description}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 min-w-[300px]">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Mission Completion</p>
                  <p className="text-4xl font-black text-white">{progress.overall.percentage}%</p>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className={`w-6 h-6 ${progress.overall.percentage === 100 ? "text-green-400" : "text-slate-600"}`} />
                </div>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.overall.percentage}%` }}
                  className="h-full bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all"
                />
              </div>
              <p className="text-[10px] font-bold text-slate-500 mt-4 uppercase tracking-widest">
                {progress.overall.completed} / {progress.overall.total} Objectives Secured
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Module Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-100 border border-slate-50 p-12 mb-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-sky-500 rounded-full" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Mission Briefing</h2>
              </div>
              <div className="text-slate-600 text-lg font-medium leading-relaxed whitespace-pre-wrap">
                {module.content}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-100 border border-slate-50 overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex bg-slate-50/50 p-3 gap-2 border-b border-slate-100">
                {[
                  { id: "lessons", label: "Intel", icon: <BookOpen className="w-4 h-4" />, count: progress.lessons.total, color: "text-sky-500", bg: "bg-sky-50" },
                  { id: "activities", label: "Drills", icon: <Gamepad2 className="w-4 h-4" />, count: progress.activities.total, color: "text-green-500", bg: "bg-green-50" },
                  { id: "quizzes", label: "Exams", icon: <HelpCircle className="w-4 h-4" />, count: progress.quizzes.total, color: "text-purple-500", bg: "bg-purple-50" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex flex-col items-center py-4 px-4 rounded-[2rem] transition-all relative overflow-hidden group ${activeTab === tab.id
                      ? "bg-white shadow-lg text-slate-900"
                      : "text-slate-400 hover:text-slate-600"
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${activeTab === tab.id ? tab.bg + " " + tab.color : "bg-transparent text-slate-300 group-hover:bg-slate-100"
                      }`}>
                      {tab.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                    <span className="text-[10px] font-bold opacity-40 mt-1">{tab.count} Tasks</span>
                    {activeTab === tab.id && (
                      <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 w-full h-1 bg-slate-900" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black tracking-tighter uppercase">
                        {activeTab === "lessons" ? "Hero Intelligence" : activeTab === "activities" ? "Combat Drills" : "Final Exams"}
                      </h3>
                      <div className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-200">
                        {progress[activeTab].completed} / {progress[activeTab].total} SECURED
                      </div>
                    </div>

                    {progress[activeTab].items.length === 0 ? (
                      <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-300 font-black text-[10px] uppercase tracking-widest">No mission items detected.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {progress[activeTab].items.map((item: any, idx: number) => {
                          const isCompleted = item.isCompleted;
                          const href = activeTab === "lessons"
                            ? `/modules/${moduleId}/lessons/${item.id}`
                            : activeTab === "activities"
                              ? `/modules/${moduleId}/activities/${item.id}`
                              : `/quizzes/${item.id}`;

                          return (
                            <Link key={item.id} href={href} className="group block">
                              <div className="flex items-center gap-6 p-6 rounded-[2rem] border border-slate-100 hover:border-slate-900 hover:shadow-2xl hover:shadow-slate-100 transition-all bg-white relative overflow-hidden">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner shrink-0 transition-transform group-hover:scale-110 ${isCompleted ? "bg-green-50 text-green-500" : "bg-slate-50 text-slate-300"
                                  }`}>
                                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : (idx + 1).toString().padStart(2, "0")}
                                </div>

                                <div className="flex-1">
                                  <h4 className="text-lg font-black tracking-tight text-slate-900 uppercase group-hover:text-sky-500 transition-colors">
                                    {item.title}
                                  </h4>
                                  <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span className="text-[10px] font-bold uppercase tracking-widest">{activeTab === "quizzes" ? "15min" : "5min"}</span>
                                    </div>
                                    {isCompleted && (
                                      <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Mastered</span>
                                    )}
                                  </div>
                                </div>

                                <div className="p-3 bg-slate-50 group-hover:bg-slate-900 group-hover:text-white rounded-xl transition-all">
                                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-sky-400 to-blue-600 rounded-[3rem] p-10 text-white shadow-xl shadow-sky-100 relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Info className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Hero Handbook</h3>
                <p className="text-sky-100 text-sm font-medium leading-relaxed mb-8">
                  Complete all modules in this order to maximize your Hero Rank. Each activity contributes to your Academy profile!
                </p>
                <div className="space-y-4">
                  {[
                    "Watch introductory holos",
                    "Complete skill simulations",
                    "Pass the verification exam"
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{i + 1}</div>
                      <span className="text-xs font-bold text-sky-50 uppercase tracking-wide">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Decor */}
              <div className="absolute top-0 right-0 p-8 scale-[3] opacity-10 pointer-events-none">
                <ShieldCheck className="w-16 h-16" />
              </div>
            </div>

            <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-6 text-3xl">
                🎓
              </div>
              <h4 className="font-black uppercase tracking-widest text-xs text-slate-900 mb-2">Graduation Eligible?</h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6 px-4">
                Score above 80% on all exams to unlock your official physical certificate.
              </p>
              <button className="w-full py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-not-allowed">
                Certificate Locked
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-50 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-30">
            <ShieldCheck className="text-slate-900 w-5 h-5" />
            <span className="font-black text-[10px] uppercase tracking-widest text-slate-900">Toilet Hero Academy</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-200">© 2026 Mission Ops Command</p>
        </div>
      </footer>
    </div>
  );
}

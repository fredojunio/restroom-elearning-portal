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

            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 min-w-[300px] relative overflow-hidden group">
              {/* Happy Mascot Decoration */}
              <div className="absolute -right-8 -bottom-8 opacity-20 group-hover:opacity-40 transition-opacity">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/mascots/mascot-happy.png" alt="Happy Hero" className="w-40 rotate-12" />
              </div>

              <div className="flex justify-between items-end mb-4 relative z-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Mission Completion</p>
                  <p className="text-4xl font-black text-white">{progress.overall.percentage}%</p>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className={`w-6 h-6 ${progress.overall.percentage === 100 ? "text-green-400" : "text-slate-600"}`} />
                </div>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden relative z-10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.overall.percentage}%` }}
                  className="h-full bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all"
                />
              </div>
              <p className="text-[10px] font-bold text-slate-500 mt-4 uppercase tracking-widest relative z-10">
                {progress.overall.completed} / {progress.overall.total} Objectives Secured
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Module Content */}
        <div className="grid grid-cols-1 gap-12">
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-100 border border-slate-50 overflow-hidden p-10">
            <div className="flex flex-col items-center text-center py-10">
              <div className="w-24 h-24 bg-sky-100 text-sky-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner scale-110">
                <ShieldCheck className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-black tracking-tighter uppercase mb-4">Ready for Mission?</h3>
              <p className="text-slate-400 font-medium max-w-md mb-10 leading-relaxed">
                Prepare yourself, Hero! You're about to enter the field. Complete all objectives to earn your legendary badge.
              </p>

              {progress.lessons.items.length > 0 ? (
                <Link
                  href={`/modules/${moduleId}/lessons/${progress.lessons.items[0].id}`}
                  className="group relative px-12 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden inline-flex items-center gap-3"
                >
                  <div className="absolute inset-0 bg-sky-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10">Start Mission</span>
                  <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <div className="text-slate-300 font-black text-[10px] uppercase tracking-widest">No mission items detected.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-50 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-30">
            <ShieldCheck className="text-slate-900 w-5 h-5" />
            <span className="font-black text-[10px] uppercase tracking-widest text-slate-900">Restroom Association</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-200">© 2026 Restroom Association</p>
        </div>
      </footer>
    </div>
  );
}

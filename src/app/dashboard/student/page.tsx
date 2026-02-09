"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import {
  ShieldCheck,
  BookOpen,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

interface Module {
  id: string;
  title: string;
  description: string;
  grade: number;
  subject: string;
}

interface ModuleProgress {
  moduleId: string;
  overall: {
    completed: number;
    total: number;
    percentage: number;
  };
}

interface EnrolledModule extends Module {
  progress: ModuleProgress["overall"];
}

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [enrolledModules, setEnrolledModules] = useState<EnrolledModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchEnrolledModules();
    }
  }, [session]);

  const fetchEnrolledModules = async () => {
    try {
      const res = await fetch("/api/modules");
      const modulesData = await res.json();

      const modulesWithProgress = await Promise.all(
        modulesData.map(async (module: Module) => {
          try {
            const progressRes = await fetch(`/api/modules/${module.id}/progress`);
            const progressData = await progressRes.json();

            return {
              ...module,
              progress: progressData.overall || {
                completed: 0,
                total: 0,
                percentage: 0
              },
            };
          } catch (error) {
            console.error(`Failed to fetch progress for module ${module.id}:`, error);
            return {
              ...module,
              progress: {
                completed: 0,
                total: 0,
                percentage: 0
              },
            };
          }
        }),
      );

      setEnrolledModules(modulesWithProgress);
    } catch (error) {
      console.error("Failed to fetch modules:", error);
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
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Academy Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden">
      <Navbar role="STUDENT" />

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

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-16 relative">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-4 leading-[0.9]">
                Hi there, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
                  Hero {session?.user?.name?.split(" ")[0]}!
                </span>
              </h1>
              <p className="text-slate-400 font-medium text-xl max-w-xl">
                Welcome to your command center. Access your modules and track your progress to become the ultimate school guardian.
              </p>
            </div>
            {/* Flying Mascot */}
            {/* <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="hidden lg:block absolute right-0 bottom-0 pointer-events-none"
            > */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* <img
                src="/mascots/mascot-flying.png"
                alt="Flying Hero"
                className="w-64 h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </motion.div> */}
          </div>
        </div>

        {/* Modules Section */}
        <div className="relative">
          {/* Typing Mascot Decoration */}
          <div className="hidden lg:block absolute right-0 -top-16 opacity-100 pointer-events-none z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mascots/mascot-typing.png" alt="Study Mode" className="w-40 -scale-x-100" />
          </div>

          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Training Modules</h2>
              <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-200">
                {enrolledModules.length} Active
              </span>
            </div>
          </div>

          {enrolledModules.length === 0 ? (
            <div className="bg-slate-50 rounded-[3rem] p-24 text-center border border-dashed border-slate-200 relative overflow-hidden">
              {/* Worried Mascot Decoration */}
              <div className="absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none hidden md:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/mascots/mascot-worried.png" alt="Decoration" className="w-40" />
              </div>

              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-slate-100 relative z-10">
                <BookOpen className="w-10 h-10 text-slate-200" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-sm relative z-10">No active training missions found.</p>
              <p className="text-slate-300 text-xs mt-2 relative z-10">Contact your supervisor to enroll in new missions.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
              {enrolledModules.map((module, idx) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link href={`/modules/${module.id}`} className="group block h-full">
                    <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-100 border border-slate-50 overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all hover:-translate-y-2 active:scale-[0.98]">
                      {/* Card Header */}
                      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-white relative overflow-hidden">
                        <div className="relative z-10">
                          <h3 className="text-3xl font-black tracking-tighter leading-none uppercase pr-8">
                            {module.title}
                          </h3>
                        </div>
                        {/* Decor */}
                        <div className="absolute top-0 right-0 p-6 opacity-20 scale-[4] rotate-[15deg] pointer-events-none translate-x-4 -translate-y-4">
                          <ShieldCheck className="w-12 h-12" />
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-10 flex-1 flex flex-col">
                        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10 flex-1">
                          {module.description}
                        </p>

                        {/* Progress */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Mission Integrity</p>
                              <p className="text-2xl font-black text-slate-900">{(module.progress?.percentage || 0)}%</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                                {(module.progress?.completed || 0)}/{(module.progress?.total || 0)} TASKS
                              </p>
                            </div>
                          </div>
                          <div className="w-full bg-slate-50 rounded-full h-3 overflow-hidden p-0.5 border border-slate-100">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${module.progress?.percentage || 0}%` }}
                              className={`h-full rounded-full transition-all ${(module.progress?.percentage || 0) === 100
                                ? "bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)]"
                                : "bg-gradient-to-r from-sky-400 to-blue-500 shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                                }`}
                            />
                          </div>
                        </div>

                        {/* Action Badge */}
                        <div className="mt-10">
                          {(module.progress?.percentage || 0) === 100 ? (
                            <div className="w-full py-5 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest border border-green-100 shadow-sm shadow-green-100">
                              <CheckCircle2 className="w-4 h-4" />
                              Mission Accomplished
                            </div>
                          ) : (
                            <div className="w-full py-5 bg-slate-900 text-white rounded-3xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest group-hover:bg-sky-500 transition-all shadow-xl shadow-slate-200">
                              Resume Training
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-24 border-t border-slate-100 bg-white/50 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity cursor-default">
            <ShieldCheck className="text-slate-900 w-6 h-6" />
            <div className="flex flex-col">
              <span className="font-black text-[12px] uppercase tracking-[0.2em] text-slate-900 leading-none">Restroom Association</span>
              <span className="text-[10px] font-bold text-slate-400 mt-1">Global Safety Standards</span>
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">© 2026 Toilet Hero Academy</p>
        </div>
      </footer>
    </div>
  );
}

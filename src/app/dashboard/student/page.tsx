"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  ShieldCheck,
  LogOut,
  BookOpen,
  Trophy,
  Zap,
  ArrowRight,
  TrendingUp,
  LayoutDashboard,
  Gamepad2,
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
  const [stats, setStats] = useState({
    totalModules: 0,
    completedModules: 0,
    averageProgress: 0,
  });

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

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
          const progressRes = await fetch(`/api/modules/${module.id}/progress`);
          const progressData = await progressRes.json();
          return {
            ...module,
            progress: progressData.overall,
          };
        }),
      );

      setEnrolledModules(modulesWithProgress);

      const completed = modulesWithProgress.filter(
        (m) => m.progress.percentage === 100,
      ).length;
      const avgProgress =
        modulesWithProgress.length > 0
          ? Math.round(
            modulesWithProgress.reduce(
              (sum, m) => sum + m.progress.percentage,
              0,
            ) / modulesWithProgress.length,
          )
          : 0;

      setStats({
        totalModules: modulesWithProgress.length,
        completedModules: completed,
        averageProgress: avgProgress,
      });
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
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-200"
              >
                <ShieldCheck className="text-white w-6 h-6" />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tighter text-slate-900 leading-none">TOILET HERO</span>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-sky-500">Dashboard</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <p className="text-xs font-black text-slate-900 uppercase tracking-wider">
                {session?.user?.name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2 leading-none">
            Hi there, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
              Hero {session?.user?.name?.split(" ")[0]}!
            </span>
          </h1>
          <p className="text-slate-400 font-medium text-lg mt-4">Continue your training and keep our school safe.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { label: "Missions Active", value: stats.totalModules, icon: <BookOpen className="w-6 h-6" />, color: "bg-sky-50 text-sky-500 shadow-sky-100" },
            { label: "Medals Earned", value: stats.completedModules, icon: <Trophy className="w-6 h-6" />, color: "bg-yellow-50 text-yellow-500 shadow-yellow-100" },
            { label: "Training Score", value: `${stats.averageProgress}%`, icon: <Zap className="w-6 h-6" />, color: "bg-green-50 text-green-500 shadow-green-100" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-50 flex items-center justify-between group hover:scale-[1.02] transition-transform"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
                <p className="text-4xl font-black text-slate-900">{stat.value}</p>
              </div>
              <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modules Section */}
        <div>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black tracking-tighter text-slate-900">Training Modules</h2>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full font-black text-[10px] uppercase tracking-widest">
                {enrolledModules.length} Total
              </span>
            </div>
          </div>

          {enrolledModules.length === 0 ? (
            <div className="bg-slate-50 rounded-[3rem] p-16 text-center border border-dashed border-slate-200">
              <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active training missions found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {enrolledModules.map((module, idx) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link href={`/modules/${module.id}`} className="group block h-full">
                    <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-100 border border-slate-50 overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                      {/* Card Header */}
                      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="flex gap-2 mb-4">
                            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-sky-400">
                              Grade {module.grade}
                            </span>
                            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">
                              {module.subject}
                            </span>
                          </div>
                          <h3 className="text-2xl font-black tracking-tighter leading-tight group-hover:translate-x-1 transition-transform uppercase">
                            {module.title}
                          </h3>
                        </div>
                        {/* Decor */}
                        <div className="absolute top-0 right-0 p-4 opacity-10 scale-[3] pointer-events-none">
                          <ShieldCheck className="w-12 h-12" />
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-8 flex-1 flex flex-col">
                        <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8 flex-1">
                          {module.description}
                        </p>

                        {/* Progress */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Missions Progress</p>
                              <p className="text-xl font-black text-slate-900">{module.progress.percentage}%</p>
                            </div>
                            <p className="text-[10px] font-black text-slate-300">
                              {module.progress.completed}/{module.progress.total} TASKS
                            </p>
                          </div>
                          <div className="w-full bg-slate-50 rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${module.progress.percentage}%` }}
                              className={`h-full rounded-full transition-all ${module.progress.percentage === 100
                                ? "bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)]"
                                : "bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]"
                                }`}
                            />
                          </div>
                        </div>

                        {/* Action Badge */}
                        <div className="mt-8">
                          {module.progress.percentage === 100 ? (
                            <div className="w-full py-4 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest border border-green-100">
                              <CheckCircle2 className="w-4 h-4" />
                              Mission Accomplished
                            </div>
                          ) : (
                            <div className="w-full py-4 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest group-hover:bg-sky-500 transition-colors shadow-lg">
                              Resume Mission
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

        {/* Hero Tips Section */}
        <div className="mt-20">
          <div className="bg-gradient-to-br from-indigo-50/50 to-sky-50/50 rounded-[3rem] p-12 border border-white">
            <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-8 flex items-center gap-3 uppercase">
              <TrendingUp className="text-sky-500 w-6 h-6" />
              Academy Excellence Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { icon: "📖", title: "Master Lessons", desc: "Read every scroll carefully to uncover secret hygiene techniques." },
                { icon: "🎮", title: "Skill Drills", desc: "Perfect your coordination with interactive training simulations." },
                { icon: "❓", title: "Final Exams", desc: "Prove your knowledge to earn legendary graduation artifacts." },
              ].map((tip, idx) => (
                <div key={idx} className="flex gap-5 group">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0">
                    {tip.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-2">{tip.title}</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <ShieldCheck className="text-slate-900 w-5 h-5" />
            <span className="font-black text-[10px] uppercase tracking-widest text-slate-900">Restroom Association</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">© 2026 Restroom Association</p>
        </div>
      </footer>
    </div>
  );
}

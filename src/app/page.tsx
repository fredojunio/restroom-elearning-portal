"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion, Variants } from "framer-motion";
import {
  ShieldCheck,
  Gamepad2,
  Trophy,
  Map as MapIcon,
  Zap,
  Star,
  Sparkles,
  ArrowRight,
  LogIn,
  BookOpen,
  HelpCircle
} from "lucide-react";

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const floatingVariants: Variants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
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

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden">
      {/* --- Floating Background Decorations --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          variants={bubbleVariants}
          animate="animate"
          className="absolute top-20 left-[10%] w-32 h-32 bg-sky-100 rounded-full blur-3xl"
        />
        <motion.div
          variants={bubbleVariants}
          animate="animate"
          style={{ transitionDelay: "1s" }}
          className="absolute bottom-40 right-[15%] w-48 h-48 bg-yellow-50 rounded-full blur-3xl"
        />
        <motion.div
          variants={bubbleVariants}
          animate="animate"
          style={{ transitionDelay: "0.5s" }}
          className="absolute top-[40%] right-[5%] w-24 h-24 bg-green-50 rounded-full blur-2xl"
        />
      </div>

      {/* --- Navigation --- */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-200"
            >
              <ShieldCheck className="text-white w-7 h-7" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-slate-900 leading-none">TOILET HERO</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500">Academy</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="flex items-center gap-2 px-6 py-3 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-sky-600 hover:bg-sky-50 rounded-2xl transition-all group"
            >
              <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full border border-yellow-200 font-black text-[10px] uppercase tracking-widest mb-8 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-yellow-500" />
            Enrolling Now for Primary Student
          </div>

          <h1 className="text-6xl md:text-8xl tracking-wide font-nerko font-black tracking-tighter text-slate-900 mb-8 leading-tight">
            Become a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-600 to-indigo-600">
              Restroom Superhero!
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            The fun way to learn hygiene! Master the secrets of clean restrooms, defeat invisible germs, and earn your legendary Hero Badge. 🎓✨
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/auth/login"
              className="group relative px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-sky-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <div className="relative z-10 flex items-center gap-3">
                Start Hero Training
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Floating Icons */}
        {/* <div className="relative mt-24 w-full max-w-5xl h-[400px]">
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="absolute top-10 left-[15%] p-8 bg-white rounded-[3rem] shadow-2xl border border-slate-50 flex flex-col items-center gap-4 rotate-[-10deg]"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center shadow-inner">
              <Sparkles className="w-10 h-10" />
            </div>
            <span className="font-black text-xs uppercase tracking-widest text-slate-400">Cleanliness</span>
          </motion.div>

          <motion.div
            variants={floatingVariants}
            animate="animate"
            style={{ transitionDelay: "1.5s" }}
            className="absolute top-0 right-[20%] p-10 bg-white rounded-[3.5rem] shadow-2xl border border-slate-50 flex flex-col items-center gap-5 rotate-[12deg] z-20"
          >
            <div className="w-24 h-24 bg-sky-100 text-sky-600 rounded-[2.5rem] flex items-center justify-center shadow-inner scale-110">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <span className="font-black text-sm uppercase tracking-widest text-slate-800">Safety First</span>
          </motion.div>

          <motion.div
            variants={floatingVariants}
            animate="animate"
            style={{ transitionDelay: "0.8s" }}
            className="absolute bottom-10 left-[40%] p-8 bg-white rounded-[3rem] shadow-2xl border border-slate-50 flex flex-col items-center gap-4 rotate-[-5deg] z-10"
          >
            <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-[2rem] flex items-center justify-center shadow-inner">
              <Trophy className="w-10 h-10" />
            </div>
            <span className="font-black text-xs uppercase tracking-widest text-slate-400">Legendary Badges</span>
          </motion.div>
        </div> */}
      </section>

      {/* --- CTA Box --- */}
      {/* <section className="relative z-10 px-6 pb-24">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-[4rem] p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-200"
        > */}
      {/* Decor */}
      {/* <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 right-10 flex gap-4">
              <Star className="w-12 h-12 text-yellow-400 rotate-12" />
              <Sparkles className="w-8 h-8 text-sky-400 -rotate-12" />
            </div>
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter">Ready for Become a Hero?</h2>
          <p className="text-xl text-slate-400 font-medium mb-12 max-w-xl mx-auto leading-relaxed">
            Join the elite circle of Toilet Heroes today and start making your school safer for everyone!
          </p>
          <Link
            href="/auth/login"
            className="inline-flex py-6 px-12 bg-sky-400 text-slate-900 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-white hover:scale-105 active:scale-95 transition-all"
          >
            Claim Your Uniform
          </Link>
        </motion.div>
      </section> */}

      {/* --- Simplified Footer --- */}
      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-sm tracking-tight text-slate-900 uppercase">Restroom Association</span>
          </div>

          <p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.4em]">
            © 2026 Restroom Association
          </p>

          <div className="flex gap-8">
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-600 transition-colors">Privacy</Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-600 transition-colors">Safety</Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-600 transition-colors">Academy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

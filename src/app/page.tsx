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
            Enrolling Now for Primary Heroes
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-tight">
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
            <Link
              href="#journey"
              className="px-10 py-5 bg-white border-2 border-slate-100 text-slate-500 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 transition-all flex items-center gap-3 shadow-xl shadow-slate-200/50"
            >
              The Hero Journey
            </Link>
          </div>
        </motion.div>

        {/* Floating Icons */}
        <div className="relative mt-24 w-full max-w-5xl h-[400px]">
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
        </div>
      </section>

      {/* --- The Hero Journey Section --- */}
      <section id="journey" className="relative z-10 py-32 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Your Heroic Journey</h2>
          <p className="text-lg text-slate-400 font-medium mb-20">Follow the path to becoming a certified Toilet Hero!</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: 1,
                title: "Enter the Academy",
                desc: "Sign in with your secret school code to begin your training.",
                icon: <LogIn className="w-8 h-8" />,
                color: "bg-blue-500 shadow-blue-200"
              },
              {
                step: 2,
                title: "Master the Skills",
                desc: "Play games and study interactive scrolls to reveal the secret of hygiene.",
                icon: <Gamepad2 className="w-8 h-8" />,
                color: "bg-orange-500 shadow-orange-200"
              },
              {
                step: 3,
                title: "Earn Your Badge",
                desc: "Pass the Hero Assessment to get your legendary graduation certificate!",
                icon: <Trophy className="w-8 h-8" />,
                color: "bg-yellow-500 shadow-yellow-200"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative p-10 bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group hover:scale-[1.02] transition-transform"
              >
                <div className={`w-20 h-20 ${item.color} text-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl relative z-10`}>
                  {item.icon}
                </div>
                <div className="absolute top-6 left-6 text-6xl font-black text-slate-50 z-0">0{item.step}</div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 relative z-10">{item.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed relative z-10">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Hero Gadgets (Features) --- */}
      <section id="gadgets" className="relative z-10 py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="text-left">
              <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Hero Academy Gear</h2>
              <p className="text-xl text-slate-400 font-medium max-w-md">Everything you need to defeat the Germ Army!</p>
            </div>
            <Link href="/auth/login" className="px-8 py-4 bg-sky-50 text-sky-600 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-sky-100 transition-all">
              Unlock All Gear
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Knowledge Scrolls", icon: <BookOpen className="w-8 h-8" />, color: "text-blue-500", bg: "bg-blue-50" },
              { title: "Defeat Germs", icon: <Zap className="w-8 h-8" />, color: "text-orange-500", bg: "bg-orange-50" },
              { title: "Hero Map", icon: <MapIcon className="w-8 h-8" />, color: "text-green-500", bg: "bg-green-50" },
              { title: "Mini-Games", icon: <Gamepad2 className="w-8 h-8" />, color: "text-purple-500", bg: "bg-purple-50" },
              { title: "Battle Quizzes", icon: <HelpCircle className="w-8 h-8" />, color: "text-indigo-500", bg: "bg-indigo-50" },
              { title: "Certification", icon: <Trophy className="w-8 h-8" />, color: "text-yellow-500", bg: "bg-yellow-50" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[3rem] border border-slate-100 bg-white hover:shadow-2xl hover:shadow-slate-100 transition-all flex flex-col items-start text-left group"
              >
                <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  Interactive tools designed to make you the brightest hero in your school.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Box --- */}
      <section className="relative z-10 px-6 pb-24">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-[4rem] p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-200"
        >
          {/* Decor */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
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
      </section>

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

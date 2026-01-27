/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ShieldCheck, LogIn, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-sans text-slate-900 selection:bg-sky-100 selection:text-sky-900 overflow-hidden relative">
      {/* --- Floating Background Decorations --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          variants={bubbleVariants}
          animate="animate"
          className="absolute top-20 left-[10%] w-64 h-64 bg-sky-100 rounded-full blur-3xl"
        />
        <motion.div
          variants={bubbleVariants}
          animate="animate"
          style={{ transitionDelay: "1s" }}
          className="absolute bottom-40 right-[15%] w-96 h-96 bg-yellow-50 rounded-full blur-3xl"
        />
      </div>

      <div className="w-full max-w-md relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-sky-100 border border-white p-10 md:p-12"
        >
          <div className="flex flex-col items-center mb-10">
            <Link href="/" className="group mb-6">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-200"
              >
                <ShieldCheck className="text-white w-9 h-9" />
              </motion.div>
            </Link>
            <div className="text-center">
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 leading-none mb-2">
                HERO LOGIN
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500">
                Toilet Hero Academy
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hero@academy.edu"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-sky-400 focus:bg-white focus:border-transparent outline-none transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-sky-400 focus:bg-white focus:border-transparent outline-none transition-all font-medium"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 border border-red-100 rounded-2xl"
              >
                <p className="text-red-500 text-xs font-bold text-center">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden disabled:opacity-70 disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-sky-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "Verifying..." : (
                  <>
                    Begin Mission
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              Need credentials? Contact Academy Command
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-500 transition-colors">
            ← Return to Base
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

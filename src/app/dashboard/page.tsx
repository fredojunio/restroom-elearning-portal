/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (session?.user) {
      const role = (session.user as any).role;
      if (role === "TEACHER") {
        router.push("/dashboard/teacher");
      } else if (role === "STUDENT") {
        router.push("/dashboard/student");
      }
    }
  }, [session, status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 bg-white shadow-2xl rounded-3xl flex items-center justify-center mx-auto mb-8 overflow-hidden p-2"
        >
          <img src="/mascots/mascot-logo.png" alt="Loading" className="w-full h-full object-contain" />
        </motion.div>
        <p className="mt-4 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Preparing your hub...</p>
      </div>
    </div>
  );
}

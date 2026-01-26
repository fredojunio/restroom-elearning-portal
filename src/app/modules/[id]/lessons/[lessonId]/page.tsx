"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const dummyLesson = {
    id: "lesson-1",
    title: "Modern Restroom Design Fundamentals",
    content: `
    <h3>Introduction to Ergonomics</h3>
    <p>Designing a restroom requires a deep understanding of human ergonomics and accessibility. The layout must allow for easy movement while maximizing the utility of available space.</p>
    
    <div class="my-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
      <strong>Pro Tip:</strong> Always ensure a minimum of 60 inches (1500mm) of turning space for wheelchair accessibility.
    </div>

    <h3>Materials and Surface Choices</h3>
    <p>Choosing the right materials is not just about aesthetics; it's about hygiene and durability. Non-porous surfaces like polished concrete, ceramic tile, or quartz are preferred for their ease of cleaning and resistance to moisture.</p>
    
    <ul>
      <li><strong>Durability:</strong> High-traffic areas need materials that can withstand constant cleaning.</li>
      <li><strong>Hygiene:</strong> Anti-microbial coatings can further enhance safety.</li>
      <li><strong>Slip Resistance:</strong> Flooring must meet safety standards even when wet.</li>
    </ul>

    <h3>Conclusion</h3>
    <p>By focusing on these core principles, you can create a restroom that is both beautiful and functional.</p>
  `,
    moduleId: "mod-1",
    nextActivityId: "act-1",
};

export default function LessonDetailPage() {
    const params = useParams();
    const router = useRouter();
    const moduleId = params.id as string;
    const [isCompleted, setIsCompleted] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Navigation Header */}
            <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link
                        href={`/modules/${moduleId}`}
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Module</span>
                    </Link>
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Lesson</span>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="max-w-4xl mx-auto px-6 pt-16 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                        {dummyLesson.title}
                    </h1>
                    <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
                </motion.div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 pb-24">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="prose prose-slate prose-lg max-w-none"
                >
                    <motion.div
                        variants={itemVariants}
                        dangerouslySetInnerHTML={{ __html: dummyLesson.content }}
                        className="mb-12 leading-relaxed text-slate-700"
                    />

                    {/* Interaction Area */}
                    <motion.div
                        variants={itemVariants}
                        className="pt-12 border-t border-slate-100"
                    >
                        {!isCompleted ? (
                            <button
                                onClick={() => setIsCompleted(true)}
                                className="group relative w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200"
                            >
                                <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <span className="relative z-10">Mark as Complete</span>
                                <CheckCircle className="relative z-10 w-5 h-5" />
                            </button>
                        ) : (
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex items-center gap-3 text-green-600 bg-green-50 px-6 py-4 rounded-2xl font-bold"
                                >
                                    <CheckCircle className="w-6 h-6" />
                                    Lesson Completed
                                </motion.div>

                                <Link
                                    href={`/modules/${moduleId}/activities/${dummyLesson.nextActivityId}`}
                                    className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-xl shadow-blue-200 group"
                                >
                                    <span>Start Activity</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </main>

            {/* Subtle Bottom Bar */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white/60 backdrop-blur-sm p-4 border-t border-slate-50 pointer-events-none">
                <div className="max-w-4xl mx-auto flex justify-end">
                    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                        Restroom eLearning Portal
                    </div>
                </div>
            </footer>

            <style jsx global>{`
        .prose h3 {
          font-weight: 800;
          color: #0f172a;
          margin-top: 2.5rem;
          font-size: 1.5rem;
        }
        .prose p {
          margin-bottom: 1.5rem;
        }
        .prose ul {
          list-style: none;
          padding-left: 0;
        }
        .prose li {
          position: relative;
          padding-left: 1.75rem;
          margin-bottom: 0.75rem;
        }
        .prose li::before {
          content: "—";
          position: absolute;
          left: 0;
          color: #3b82f6;
          font-weight: bold;
        }
      `}</style>
        </div>
    );
}

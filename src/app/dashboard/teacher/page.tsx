"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  RotateCcw,
  AlertTriangle,
  X,
  Users,
  Search,
  BookOpen,
  Layout,
  FileText
} from "lucide-react";

interface Module {
  id: string;
  title: string;
  subject: string;
  grade: number;
  _count?: {
    lessons: number;
    activities: number;
    quizzes: number;
  };
}

interface StudentProgress {
  id: string;
  name: string;
  email: string;
  modulesCompleted: number;
  averageProgress: number;
}

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
  const [stats, setStats] = useState({
    totalModules: 0,
    totalStudents: 0,
    avgStudentProgress: 0,
    pendingGradings: 0,
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
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const [modulesRes, studentsRes] = await Promise.all([
        fetch("/api/modules"),
        fetch("/api/students"),
      ]);

      const modulesData = await modulesRes.json();
      const studentsData = await studentsRes.json();

      setModules(modulesData);
      setStudents(studentsData);

      const avgProgress =
        studentsData.length > 0
          ? Math.round(
            studentsData.reduce(
              (sum: number, s: StudentProgress) => sum + s.averageProgress,
              0,
            ) / studentsData.length,
          )
          : 0;

      setStats({
        totalModules: modulesData.length,
        totalStudents: studentsData.length,
        avgStudentProgress: avgProgress,
        pendingGradings: 0, // Would fetch from quizzes with pending
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetProgress = async () => {
    if (!selectedStudent) return;
    setResetting(true);
    try {
      const res = await fetch("/api/user/reset-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedStudent.id }),
      });

      if (res.ok) {
        // Refresh student data
        await fetchDashboardData();
        setShowResetConfirm(false);
        setSelectedStudent(null);
      } else {
        const error = await res.json();
        alert(`Failed to reset progress: ${error.error}`);
      }
    } catch (error) {
      console.error("Error resetting progress:", error);
      alert("An error occurred while resetting progress.");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white shadow-md rounded-lg flex items-center justify-center overflow-hidden p-1">
                <img src="/mascots/mascot-logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Toilet Hero</span>
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl overflow-hidden p-2"
            >
              <img src="/mascots/mascot-logo.png" alt="Loading" className="w-full h-full object-contain" />
            </motion.div>
            <p className="mt-4 text-gray-600 font-medium">Loading teacher dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white shadow-md rounded-lg flex items-center justify-center overflow-hidden p-1 group-hover:rotate-12 transition-transform">
              <img src="/mascots/mascot-logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Toilet Hero</span>
              <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mt-0.5">Teacher Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-900">
                {session?.user?.name}
              </p>
              <p className="text-xs text-gray-600">{session?.user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome, {session?.user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Manage your courses and monitor student progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Total Modules
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalModules}
                </p>
              </div>
              <div className="text-4xl opacity-20">📚</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Students Enrolled
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.totalStudents}
                </p>
              </div>
              <div className="text-4xl opacity-20">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Avg. Student Progress
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.avgStudentProgress}%
                </p>
              </div>
              <div className="text-4xl opacity-20">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Pending Grading
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.pendingGradings}
                </p>
              </div>
              <div className="text-4xl opacity-20">✏️</div>
            </div>
          </div>
        </div>

        {/* Students Section */}
        {students.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Student Progress
              </h2>
              <Link
                href="/analytics"
                className="text-blue-600 hover:underline text-sm font-semibold"
              >
                View All →
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Student Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Modules Completed
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Progress
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students.slice(0, 5).map((student, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900">
                            {student.name}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">
                            {student.email}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                            {student.modulesCompleted}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-32">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-gray-700">
                                {student.averageProgress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${student.averageProgress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowResetConfirm(true);
                            }}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors group"
                            title="Reset Progress"
                          >
                            <RotateCcw className="w-5 h-5 group-hover:-rotate-45 transition-transform" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !resetting && setShowResetConfirm(false)}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowResetConfirm(false)}
                disabled={resetting}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-10 text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-rose-500" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">Reset Student Progress?</h3>
              <p className="text-gray-600 mb-8">
                You are about to reset all progress for <span className="font-bold text-gray-900">{selectedStudent.name}</span>. This cannot be undone.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  disabled={resetting}
                  onClick={handleResetProgress}
                  className="w-full py-4 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {resetting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Resetting...
                    </>
                  ) : "Confirm Reset"}
                </button>
                <button
                  disabled={resetting}
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full py-4 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

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
  FileText,
  ArrowLeft,
  Filter,
  Download
} from "lucide-react";

interface StudentProgress {
  id: string;
  name: string;
  email: string;
  modulesCompleted: number;
  averageProgress: number;
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgProgress: 0,
    topPerformers: 0,
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
      // @ts-ignore
      if (session.user.role !== "TEACHER") {
        router.push("/dashboard");
        return;
      }
      fetchAnalyticsData();
    }
  }, [session]);

  const fetchAnalyticsData = async () => {
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data);

      const avg = data.length > 0
        ? Math.round(data.reduce((sum: number, s: StudentProgress) => sum + s.averageProgress, 0) / data.length)
        : 0;

      const top = data.filter((s: StudentProgress) => s.averageProgress >= 90).length;

      setStats({
        totalStudents: data.length,
        avgProgress: avg,
        topPerformers: top,
      });
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
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
        await fetchAnalyticsData();
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

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl overflow-hidden p-2"
          >
            <img src="/mascots/mascot-logo.png" alt="Loading" className="w-full h-full object-contain" />
          </motion.div>
          <p className="mt-4 text-gray-600 font-medium">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard/teacher" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white shadow-md rounded-lg flex items-center justify-center overflow-hidden p-1 group-hover:rotate-12 transition-transform">
              <img src="/mascots/mascot-logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Toilet Hero</span>
              <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mt-0.5">Teacher Portal</p>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-900">{session?.user?.name}</p>
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
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Link
              href="/dashboard/teacher"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Analytics</h1>
            <p className="text-gray-600">Comprehensive overview of all student progress and performance</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-6">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Students</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalStudents}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-6">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Avg. Progress</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.avgProgress}%</h3>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Modules Done</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Average Progress</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500 text-sm">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                          {student.modulesCompleted}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-[200px]">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-gray-700">{student.averageProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${student.averageProgress}%` }}
                              className={`h-full rounded-full transition-all ${student.averageProgress === 100 ? "bg-green-500" : "bg-blue-600"
                                }`}
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
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Reset Progress"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="max-w-[200px] mx-auto opacity-40 mb-4 transform grayscale">
                        <img src="/mascots/mascot-logo.png" alt="No results" className="w-full" />
                      </div>
                      <p className="text-gray-400 font-medium">No students found matching your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination Placeholder */}
          <div className="p-6 bg-gray-50/50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500 font-medium">Showing {filteredStudents.length} of {students.length} students</p>
          </div>
        </div>
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

              <h3 className="text-2xl font-bold text-gray-900 mb-2">Reset Progress?</h3>
              <p className="text-gray-600 mb-8 text-sm">
                You are about to reset all progress for <span className="font-bold text-gray-900">{selectedStudent.name}</span>. This action is permanent and cannot be undone.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  disabled={resetting}
                  onClick={handleResetProgress}
                  className="w-full py-4 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-rose-200"
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

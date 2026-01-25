"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

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

      // Fetch progress for each module
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">📚</span>
              </div>
              <span className="font-bold text-xl text-gray-900">EduLearn</span>
            </div>
          </div>
        </nav>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
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
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📚</span>
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900">EduLearn</span>
              <p className="text-xs text-gray-600">Student Portal</p>
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
            Welcome back, {session?.user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Modules Enrolled
                </p>
                <p className="text-4xl font-bold text-blue-600">
                  {stats.totalModules}
                </p>
              </div>
              <div className="text-5xl opacity-20">📚</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Completed
                </p>
                <p className="text-4xl font-bold text-green-600">
                  {stats.completedModules}
                </p>
              </div>
              <div className="text-5xl opacity-20">✓</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Overall Progress
                </p>
                <p className="text-4xl font-bold text-purple-600">
                  {stats.averageProgress}%
                </p>
              </div>
              <div className="text-5xl opacity-20">📊</div>
            </div>
          </div>
        </div>

        {/* Modules Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Modules</h2>
            <span className="text-sm text-gray-600">
              {enrolledModules.length} modules available
            </span>
          </div>

          {enrolledModules.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-600 text-lg mb-4">
                No modules available yet
              </p>
              <p className="text-gray-500 text-sm">
                Check back soon for new courses!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledModules.map((module) => (
                <Link
                  key={module.id}
                  href={`/modules/${module.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition h-full flex flex-col">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                      <h3 className="text-xl font-bold mb-2 group-hover:translate-x-1 transition">
                        {module.title}
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                          Grade {module.grade}
                        </span>
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                          {module.subject}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <p className="text-gray-600 text-sm mb-4 flex-1">
                        {module.description}
                      </p>

                      {/* Progress */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-700">
                            Progress
                          </span>
                          <span className="text-sm font-bold text-blue-600">
                            {module.progress.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              module.progress.percentage === 100
                                ? "bg-green-500"
                                : "bg-blue-600"
                            }`}
                            style={{
                              width: `${module.progress.percentage}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {module.progress.completed}/{module.progress.total}{" "}
                          items
                        </p>
                      </div>

                      {/* Status Badge */}
                      {module.progress.percentage === 100 && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                          <span className="text-green-700 font-semibold text-sm">
                            ✓ Completed
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer Button */}
                    <div className="p-6 pt-0">
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                        {module.progress.percentage === 100
                          ? "Review Module"
                          : "Continue Learning"}
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            💡 Learning Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="flex gap-3">
              <span className="text-2xl">📖</span>
              <p>Read lessons carefully and mark them complete when done</p>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">🎮</span>
              <p>Practice with activities to strengthen your understanding</p>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">❓</span>
              <p>Take quizzes to test your knowledge and earn certificates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

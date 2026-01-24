/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface StudentModule {
  isCompleted: boolean;
  completedAt: string | null;
}

interface Progress {
  moduleId: string;
  overallProgress: number;
  lastAccessedAt: string;
}

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [enrolledModules, setEnrolledModules] = useState<Set<string>>(
    new Set(),
  );
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modulesRes, progressRes] = await Promise.all([
          fetch("/api/modules"),
          fetch(`/api/progress/${(session?.user as any)?.id}`),
        ]);

        const modulesData = await modulesRes.json();
        const progressData: Progress[] = await progressRes.json();

        setModules(modulesData);
        setProgress(
          progressData.reduce((acc: Record<string, Progress>, p: Progress) => {
            acc[p.moduleId] = p;
            return acc;
          }, {}),
        );

        const enrolled = new Set<string>(
          progressData.map((p: Progress) => p.moduleId),
        );
        setEnrolledModules(enrolled);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchData();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📚</span>
            </div>
            <span className="font-bold text-xl text-gray-900">EduLearn</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome, {session?.user?.name}
          </h1>
          <p className="text-gray-600 mt-2">Continue your learning journey</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Modules</h2>
          {modules.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600">No modules available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => {
                const p = progress[module.id];
                const isEnrolled = enrolledModules.has(module.id);

                return (
                  <div
                    key={module.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {module.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {module.description}
                      </p>
                      <div className="flex items-center gap-2 mb-4 text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                          Grade {module.grade}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                          {module.subject}
                        </span>
                      </div>

                      {isEnrolled && p && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-gray-700">
                              Progress
                            </span>
                            <span className="text-sm font-bold text-blue-600">
                              {Math.round(p.overallProgress)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${Math.min(p.overallProgress, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <Link
                        href={`/modules/${module.id}`}
                        className="block w-full text-center bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
                      >
                        {isEnrolled ? "Continue Learning" : "Enroll Now"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

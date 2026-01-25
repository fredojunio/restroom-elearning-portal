/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Lesson {
  id: string;
  title: string;
  order: number;
}

interface Activity {
  id: string;
  title: string;
  type: string;
}

interface Quiz {
  id: string;
  title: string;
  type: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  grade: number;
  subject: string;
  content: string;
}

interface Progress {
  lessons: {
    completed: number;
    total: number;
    percentage: number;
    items: Lesson[];
  };
  activities: {
    completed: number;
    total: number;
    percentage: number;
    items: Activity[];
  };
  quizzes: {
    completed: number;
    total: number;
    percentage: number;
    items: Quiz[];
  };
  overall: {
    completed: number;
    total: number;
    percentage: number;
  };
}

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const moduleId = params.id as string;

  const [module, setModule] = useState<Module | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "lessons" | "activities" | "quizzes"
  >("lessons");

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    fetchModuleData();
  }, [moduleId, session, router]);

  const fetchModuleData = async () => {
    try {
      const [moduleRes, progressRes] = await Promise.all([
        fetch(`/api/modules/${moduleId}`),
        fetch(`/api/modules/${moduleId}/progress`),
      ]);

      if (!moduleRes.ok) throw new Error("Module not found");
      if (!progressRes.ok) throw new Error("Failed to fetch progress");

      const moduleData = await moduleRes.json();
      const progressData = await progressRes.json();

      setModule(moduleData);
      setProgress(progressData);
    } catch (error) {
      console.error("Failed to fetch module data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading module...</p>
        </div>
      </div>
    );
  }

  if (!module || !progress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Module not found</p>
          <Link
            href="/dashboard"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const getCompletionStatus = (
    type: "lessons" | "activities" | "quizzes",
    id: string,
  ) => {
    const items = progress[type].items as any[];
    return items.some((item) => item.isCompleted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/dashboard"
            className="text-blue-100 hover:text-white mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">{module.title}</h1>
          <p className="text-blue-100 text-lg mb-6">{module.description}</p>

          <div className="flex gap-4 mb-6 flex-wrap">
            <span className="px-4 py-2 bg-white/20 rounded-full font-semibold">
              Grade {module.grade}
            </span>
            <span className="px-4 py-2 bg-white/20 rounded-full font-semibold">
              {module.subject}
            </span>
          </div>

          {/* Overall Progress Bar */}
          <div className="max-w-md">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Overall Progress</span>
              <span className="text-lg font-bold">
                {progress.overall.percentage}%
              </span>
            </div>
            <div className="w-full bg-blue-900 rounded-full h-3 overflow-hidden">
              <div
                className="bg-yellow-400 h-3 rounded-full transition-all"
                style={{ width: `${progress.overall.percentage}%` }}
              />
            </div>
            <p className="text-sm text-blue-100 mt-2">
              {progress.overall.completed} of {progress.overall.total} items
              completed
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Module Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            About This Module
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {module.content}
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("lessons")}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === "lessons"
                  ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span>📖</span> Lessons ({progress.lessons.completed}/
                {progress.lessons.total})
              </span>
            </button>
            <button
              onClick={() => setActiveTab("activities")}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === "activities"
                  ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span>🎮</span> Activities ({progress.activities.completed}/
                {progress.activities.total})
              </span>
            </button>
            <button
              onClick={() => setActiveTab("quizzes")}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === "quizzes"
                  ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span>❓</span> Quizzes ({progress.quizzes.completed}/
                {progress.quizzes.total})
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Lessons Tab */}
            {activeTab === "lessons" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Lessons
                </h3>
                {progress.lessons.items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No lessons available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {progress.lessons.items.map((lesson: any, idx: number) => (
                      <Link
                        key={lesson.id}
                        href={`/modules/${moduleId}/lessons/${lesson.id}`}
                        className="group block"
                      >
                        <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition">
                          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-600">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                              {lesson.title}
                            </h4>
                          </div>
                          {lesson.isCompleted ? (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                              <span>✓</span>
                              <span className="text-sm font-semibold">
                                Completed
                              </span>
                            </div>
                          ) : (
                            <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                              Not started
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Activities Tab */}
            {activeTab === "activities" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Activities
                </h3>
                {progress.activities.items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No activities available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {progress.activities.items.map(
                      (activity: any, idx: number) => (
                        <Link
                          key={activity.id}
                          href={`/modules/${moduleId}/activities/${activity.id}`}
                          className="group block"
                        >
                          <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-green-600 hover:bg-green-50 transition">
                            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-xl">
                              🎮
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition">
                                {activity.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {activity.type === "DRAG_AND_DROP"
                                  ? "Drag & Drop"
                                  : activity.type === "MATCHING"
                                    ? "Matching"
                                    : "Interactive"}
                              </p>
                            </div>
                            {activity.isCompleted ? (
                              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                                <span>✓</span>
                                <span className="text-sm font-semibold">
                                  Done
                                </span>
                              </div>
                            ) : (
                              <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                Not started
                              </div>
                            )}
                          </div>
                        </Link>
                      ),
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Quizzes Tab */}
            {activeTab === "quizzes" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Quizzes
                </h3>
                {progress.quizzes.items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No quizzes available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {progress.quizzes.items.map((quiz: any, idx: number) => (
                      <Link
                        key={quiz.id}
                        href={`/quizzes/${quiz.id}`}
                        className="group block"
                      >
                        <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-600 hover:bg-purple-50 transition">
                          <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-xl">
                            ❓
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition">
                              {quiz.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {quiz.type === "MULTIPLE_CHOICE"
                                ? "Multiple Choice"
                                : quiz.type === "TRUE_FALSE"
                                  ? "True/False"
                                  : "Long Text Answer"}
                            </p>
                          </div>
                          {quiz.isCompleted ? (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                              <span>✓</span>
                              <span className="text-sm font-semibold">
                                Passed
                              </span>
                            </div>
                          ) : (
                            <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                              Not taken
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

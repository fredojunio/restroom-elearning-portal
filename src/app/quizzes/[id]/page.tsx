/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Question {
  id: string;
  question: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "LONG_TEXT";
  correctAnswer?: number | boolean | string;
  options?: string[];
  points?: number;
  minWords?: number;
  maxWords?: number;
}

interface Quiz {
  id: string;
  title: string;
  type: string;
  questions: Question[];
  passingScore: number;
  moduleId: string;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    fetchQuiz();
  }, [quizId, session, router]);

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`/api/quizzes/${quizId}`);
      if (!res.ok) throw new Error("Quiz not found");
      const data = await res.json();
      setQuiz(data);
      // Initialize answers object
      const initialAnswers: Record<string, any> = {};
      data.questions.forEach((q: Question) => {
        initialAnswers[q.id] = null;
      });
      setAnswers(initialAnswers);
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    const answersArray = quiz!.questions.map((q) => answers[q.id]);

    try {
      const res = await fetch(`/api/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId,
          score: 0,
          passed: false,
          answer: JSON.stringify(answersArray),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit quiz");
      const data = await res.json();
      setResults(data);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Quiz not found</p>
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

  if (submitted && results) {
    return <QuizResults quiz={quiz} results={results} />;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isAnswered =
    answers[currentQuestion.id] !== null && answers[currentQuestion.id] !== "";
  const allAnswered = quiz.questions.every(
    (q) => answers[q.id] !== null && answers[q.id] !== "",
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
          <p className="text-purple-100 mb-4">
            {quiz.type === "MULTIPLE_CHOICE"
              ? "Multiple Choice Quiz"
              : quiz.type === "TRUE_FALSE"
                ? "True/False Quiz"
                : "Long Text Answer Quiz"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-700">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {
                quiz.questions.filter(
                  (q) => answers[q.id] !== null && answers[q.id] !== "",
                ).length
              }{" "}
              / {quiz.questions.length} answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-purple-600 h-3 rounded-full transition-all"
              style={{
                width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {currentQuestion.question}
          </h2>

          {/* Multiple Choice Questions */}
          {currentQuestion.type === "MULTIPLE_CHOICE" && (
            <div className="space-y-3">
              {currentQuestion.options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerChange(currentQuestion.id, idx)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition ${
                    answers[currentQuestion.id] === idx
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-400"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        answers[currentQuestion.id] === idx
                          ? "border-purple-600 bg-purple-600"
                          : "border-gray-300"
                      }`}
                    >
                      {answers[currentQuestion.id] === idx && (
                        <span className="text-white text-sm font-bold">✓</span>
                      )}
                    </div>
                    <span
                      className={`font-semibold ${
                        answers[currentQuestion.id] === idx
                          ? "text-purple-600"
                          : "text-gray-700"
                      }`}
                    >
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* True/False Questions */}
          {currentQuestion.type === "TRUE_FALSE" && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswerChange(currentQuestion.id, true)}
                className={`p-6 rounded-lg border-2 transition font-semibold text-lg ${
                  answers[currentQuestion.id] === true
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-green-400 text-gray-700"
                }`}
              >
                True
              </button>
              <button
                onClick={() => handleAnswerChange(currentQuestion.id, false)}
                className={`p-6 rounded-lg border-2 transition font-semibold text-lg ${
                  answers[currentQuestion.id] === false
                    ? "border-red-600 bg-red-50 text-red-700"
                    : "border-gray-200 hover:border-red-400 text-gray-700"
                }`}
              >
                False
              </button>
            </div>
          )}

          {/* Long Text Questions */}
          {currentQuestion.type === "LONG_TEXT" && (
            <div>
              <textarea
                value={answers[currentQuestion.id] || ""}
                onChange={(e) =>
                  handleAnswerChange(currentQuestion.id, e.target.value)
                }
                placeholder="Type your answer here..."
                className="w-full h-48 p-4 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none resize-none"
              />
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {currentQuestion.minWords
                    ? `Minimum: ${currentQuestion.minWords} words`
                    : "No minimum"}
                </span>
                <span className="text-sm text-gray-600">
                  {answers[currentQuestion.id]
                    ? `${
                        answers[currentQuestion.id]
                          .trim()
                          .split(/\s+/)
                          .filter((w: string) => w.length > 0).length
                      } words`
                    : "0 words"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={() =>
              setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
            }
            disabled={currentQuestionIndex === 0}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 transition"
          >
            ← Previous
          </button>

          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
            >
              Submit Quiz
            </button>
          )}
        </div>

        {/* Question Indicators */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Questions</h3>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {quiz.questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-10 h-10 rounded-lg font-semibold transition ${
                  currentQuestionIndex === idx
                    ? "bg-purple-600 text-white"
                    : answers[q.id] !== null && answers[q.id] !== ""
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Quiz Results Component
function QuizResults({ quiz, results }: { quiz: Quiz; results: any }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Quiz Submitted!
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Your answers have been recorded and will be reviewed.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-blue-700 text-sm">
              Thank you for completing {quiz.title}. If this was an auto-graded
              quiz, your results will appear shortly.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Back to Dashboard
            </Link>
            <Link
              href={`/modules/${quiz.moduleId}`}
              className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Back to Module
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

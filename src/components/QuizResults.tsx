/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { CertificateDisplay } from "./CertificateDisplay";

interface QuizResultsProps {
  quiz: any;
  results: any;
  onRetry?: () => void;
}

export function QuizResults({ quiz, results, onRetry }: QuizResultsProps) {
  const [showCertificate, setShowCertificate] = useState(
    results.passed && quiz.type !== "LONG_TEXT",
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  };

  if (showCertificate && results.passed) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <button
            onClick={() => setShowCertificate(false)}
            className="text-blue-600 hover:underline"
          >
            ← Back to Results
          </button>
        </div>
        <CertificateDisplay certificate={results.certificate} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>

        {results.requiresManualGrading ? (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">
              Pending Teacher Review
            </h3>
            <p className="text-yellow-800 text-sm">
              Your long-text answers are being reviewed by your teacher. You'll
              receive your score and feedback soon.
            </p>
          </div>
        ) : (
          <div className="mb-8">
            <p className="text-gray-600 mb-4">Your Score:</p>
            <div
              className={`text-6xl font-bold ${getScoreColor(results.score)}`}
            >
              {results.score}%
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-lg">
                {results.passed ? (
                  <span className="text-green-600 font-semibold">
                    ✓ You passed! Congratulations!
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    ✗ You did not pass. Try again!
                  </span>
                )}
              </p>
              <p className="text-gray-600">
                Passing Score: {results.submission?.quiz?.passingScore || 70}%
              </p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Answer Review</h3>
          <div className="space-y-4">
            {results.submission?.answers &&
              JSON.parse(results.submission.answers).map(
                (answer: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-l-4 ${
                      answer.isCorrect === undefined
                        ? "bg-yellow-50 border-yellow-400"
                        : answer.isCorrect
                          ? "bg-green-50 border-green-400"
                          : "bg-red-50 border-red-400"
                    }`}
                  >
                    <p className="font-semibold mb-2">Question {idx + 1}</p>
                    {answer.isCorrect === undefined ? (
                      <p className="text-sm text-yellow-700">
                        Pending manual grading
                      </p>
                    ) : (
                      <p
                        className={`text-sm ${
                          answer.isCorrect ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {answer.isCorrect ? "Correct" : "Incorrect"}
                      </p>
                    )}
                  </div>
                ),
              )}
          </div>
        </div>

        <div className="flex gap-4">
          {results.passed && quiz.type !== "LONG_TEXT" && (
            <button
              onClick={() => setShowCertificate(true)}
              className="flex-1 py-3 px-6 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition"
            >
              View Certificate
            </button>
          )}
          {!results.passed && (
            <button
              onClick={onRetry}
              className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Retake Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

interface Question {
  id: string;
  question: string;
  type: "LONG_TEXT";
  points?: number;
  minWords?: number;
  maxWords?: number;
}

interface LongTextQuizProps {
  questions: Question[];
  onSubmit: (answers: string[]) => void;
}

export function LongTextQuiz({ questions, onSubmit }: LongTextQuizProps) {
  const [answers, setAnswers] = useState<string[]>(
    new Array(questions.length).fill(""),
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const wordCount = currentAnswer
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const minWords = currentQuestion.minWords || 10;
  const maxWords = currentQuestion.maxWords || 500;
  const isValidLength = wordCount >= minWords && wordCount <= maxWords;

  const handleAnswerChange = (text: string) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = text;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (answers.every((a) => a.trim().length > 0)) {
      onSubmit(answers);
    }
  };

  const allAnswered = answers.every((a) => a.trim().length > 0);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Question {currentIndex + 1} of {questions.length}
          </h2>
          <div className="text-sm text-gray-600">
            {answers.filter((a) => a.trim().length === 0).length} unanswered
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-6">
          {currentQuestion.question}
        </h3>

        <div className="space-y-4">
          <textarea
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />

          <div className="flex justify-between items-center text-sm">
            <span
              className={`${
                isValidLength
                  ? "text-green-600"
                  : wordCount < minWords
                    ? "text-red-600"
                    : "text-orange-600"
              }`}
            >
              {wordCount} / {minWords}-{maxWords} words
            </span>
            {isValidLength && (
              <span className="text-green-600 font-semibold">✓ Valid</span>
            )}
          </div>

          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
            <p className="font-semibold mb-1">Note:</p>
            <p>
              Your answer will be reviewed by your teacher and graded manually.
              Please write a thoughtful and complete response.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="flex-1 py-3 px-4 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 transition"
        >
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() =>
              setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))
            }
            disabled={!currentAnswer.trim()}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
          >
            Submit for Review
          </button>
        )}
      </div>
    </div>
  );
}

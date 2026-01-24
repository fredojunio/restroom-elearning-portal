"use client";

import { useState } from "react";

interface Question {
  id: string;
  question: string;
  type: "TRUE_FALSE";
  correctAnswer: boolean;
  points?: number;
}

interface TrueFalseQuizProps {
  questions: Question[];
  onSubmit: (answers: boolean[]) => void;
  passingScore: number;
}

export function TrueFalseQuiz({
  questions,
  onSubmit,
  passingScore,
}: TrueFalseQuizProps) {
  const [answers, setAnswers] = useState<(boolean | null)[]>(
    new Array(questions.length).fill(null),
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex];
  const unanswered = answers.filter((a) => a === null).length;

  const handleAnswerSelect = (answer: boolean) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (answers.every((a) => a !== null)) {
      onSubmit(answers as boolean[]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Question {currentIndex + 1} of {questions.length}
          </h2>
          <div className="text-sm text-gray-600">
            {unanswered > 0 && <span>{unanswered} unanswered</span>}
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
        <h3 className="text-lg font-semibold mb-8 text-center">
          {currentQuestion.question}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAnswerSelect(true)}
            className={`p-6 rounded-lg border-2 font-semibold text-lg transition ${
              answers[currentIndex] === true
                ? "border-green-600 bg-green-50 text-green-900"
                : "border-gray-200 hover:border-green-400 text-gray-700"
            }`}
          >
            True
          </button>

          <button
            onClick={() => handleAnswerSelect(false)}
            className={`p-6 rounded-lg border-2 font-semibold text-lg transition ${
              answers[currentIndex] === false
                ? "border-red-600 bg-red-50 text-red-900"
                : "border-gray-200 hover:border-red-400 text-gray-700"
            }`}
          >
            False
          </button>
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
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={unanswered > 0}
            className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizQuestionProps {
  questions: Question[];
  onSubmit: (answers: number[]) => void;
}

export function QuizQuestion({ questions, onSubmit }: QuizQuestionProps) {
  const [answers, setAnswers] = useState<number[]>(
    new Array(questions.length).fill(-1),
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex];

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (answers.every((a) => a !== -1)) {
      onSubmit(answers);
    }
  };

  const unanswered = answers.filter((a) => a === -1).length;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
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

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-6">
          {currentQuestion.question}
        </h3>
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswerSelect(idx)}
              className={`w-full p-4 text-left rounded-lg border-2 transition ${
                answers[currentIndex] === idx
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-blue-400"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                    answers[currentIndex] === idx
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-400"
                  }`}
                >
                  {answers[currentIndex] === idx && (
                    <span className="text-white text-sm">✓</span>
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex-1 py-2 px-4 bg-gray-200 rounded font-semibold hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        {currentIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={unanswered > 0}
            className="flex-1 py-2 px-4 bg-green-600 text-white rounded font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}

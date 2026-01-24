"use client";

import { useState } from "react";

interface DragDropProps {
  activity: {
    id: string;
    title: string;
    content: string;
  };
  onSubmit: (answer: string) => void;
}

export function DragDropActivity({ activity, onSubmit }: DragDropProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string>("");

  const content = JSON.parse(activity.content);
  const items = content.items || [];

  const handleDragStart = (item: string) => {
    setDraggedItem(item);
  };

  const handleDrop = () => {
    if (draggedItem) {
      setAnswer(draggedItem);
      setDraggedItem(null);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">{activity.title}</h2>
      <p className="text-gray-600 mb-6">{content.question}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Drag from here:</h3>
          <div className="space-y-2">
            {items.map((item: string, idx: number) => (
              <div
                key={idx}
                draggable
                onDragStart={() => handleDragStart(item)}
                className="p-3 bg-blue-500 text-white rounded cursor-move hover:bg-blue-600"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="bg-green-50 p-4 rounded-lg border-2 border-dashed border-green-300 min-h-32 flex items-center justify-center"
        >
          {answer ? (
            <div className="text-center">
              <div className="p-3 bg-green-500 text-white rounded font-semibold">
                {answer}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Drop answer here</p>
          )}
        </div>
      </div>

      <button
        onClick={() => onSubmit(answer)}
        disabled={!answer}
        className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        Submit Answer
      </button>
    </div>
  );
}

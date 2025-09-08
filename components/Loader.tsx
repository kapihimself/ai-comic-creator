
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Sketching characters...",
  "Inking the panels...",
  "Coloring the scenes...",
  "Adding dialogue...",
  "Consulting the comic book masters...",
  "Polishing the final frames...",
  "Unleashing creative genius...",
];

export const Loader: React.FC = () => {
  const [message, setMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = loadingMessages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-8 text-center p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
      <div className="flex justify-center items-center mb-4">
        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p className="text-lg font-semibold text-gray-300">{message}</p>
      <p className="text-sm text-gray-500 mt-2">The AI is working its magic. This might take a moment!</p>
    </div>
  );
};


import React, { useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface ContinueFormProps {
  onContinue: (nextStoryPart: string) => void;
  isLoading: boolean;
  page: number;
}

const MAX_PAGES = 10;

export const ContinueForm: React.FC<ContinueFormProps> = ({ onContinue, isLoading, page }) => {
  const [nextStoryPart, setNextStoryPart] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nextStoryPart && !isLoading) {
      onContinue(nextStoryPart);
      setNextStoryPart(''); // Clear after submitting
    }
  };

  return (
    <div className="mt-12 bg-gray-800/50 border border-gray-700 rounded-xl p-6 sm:p-8 shadow-2xl">
      <h3 className="font-bangers text-3xl text-center mb-4 tracking-wide">Continue the Story!</h3>
      <p className="text-center text-gray-400 mb-6">You are on Page {page} of {MAX_PAGES}. What happens next?</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="next-story-part" className="block text-sm font-medium text-gray-300 mb-2">
            Next Story Plot
          </label>
          <textarea
            id="next-story-part"
            rows={3}
            className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            placeholder="e.g., Squeaky discovers the cheese planet is guarded by a giant space cat."
            value={nextStoryPart}
            onChange={(e) => setNextStoryPart(e.target.value)}
            required
            aria-label="Next story plot"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !nextStoryPart}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-all duration-300 disabled:bg-green-800 disabled:cursor-not-allowed disabled:opacity-70 text-lg"
        >
          {isLoading ? (
            'Generating Next Page...'
          ) : (
            <>
              <SparklesIcon className="h-6 w-6" />
              <span>Generate Next Page</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

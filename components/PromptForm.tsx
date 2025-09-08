
import React, { useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface PromptFormProps {
  onGenerate: (storyPrompt: string, characterPrompt: string) => void;
  isLoading: boolean;
}

export const PromptForm: React.FC<PromptFormProps> = ({ onGenerate, isLoading }) => {
  const [storyPrompt, setStoryPrompt] = useState('A brave squirrel astronaut explores a planet made entirely of cheese.');
  const [characterPrompt, setCharacterPrompt] = useState('A courageous squirrel named Squeaky, wearing a tiny silver space helmet and a determined expression.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storyPrompt && characterPrompt && !isLoading) {
      onGenerate(storyPrompt, characterPrompt);
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 sm:p-8 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="story-prompt" className="block text-sm font-medium text-gray-300 mb-2">
            Story Idea
          </label>
          <textarea
            id="story-prompt"
            rows={3}
            className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            placeholder="e.g., A detective cat solves the mystery of the missing tuna."
            value={storyPrompt}
            onChange={(e) => setStoryPrompt(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="character-prompt" className="block text-sm font-medium text-gray-300 mb-2">
            Main Character Description
          </label>
          <input
            id="character-prompt"
            type="text"
            className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            placeholder="e.g., A grumpy cat named Whiskers with a tiny fedora and trench coat."
            value={characterPrompt}
            onChange={(e) => setCharacterPrompt(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 disabled:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-70 text-lg"
        >
          {isLoading ? (
            'Generating Your Masterpiece...'
          ) : (
            <>
              <SparklesIcon className="h-6 w-6" />
              <span>Create Comic</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

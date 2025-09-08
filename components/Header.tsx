
import React from 'react';
import { BookOpenIcon } from './icons/BookOpenIcon';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center justify-center bg-indigo-500/10 text-indigo-400 p-3 rounded-full mb-4 border border-indigo-500/20">
        <BookOpenIcon className="h-8 w-8" />
      </div>
      <h1 className="font-bangers text-5xl sm:text-6xl md:text-7xl tracking-wider text-white">
        AI Comic Creator
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
        Turn your wildest ideas into stunning comic book panels. Just describe your story and character, and let the AI bring it to life!
      </p>
    </header>
  );
};

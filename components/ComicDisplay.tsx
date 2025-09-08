
import React from 'react';
import type { ComicPanel } from '../types';

interface ComicDisplayProps {
  panels: ComicPanel[];
}

export const ComicDisplay: React.FC<ComicDisplayProps> = ({ panels }) => {
  const pages = [];
  for (let i = 0; i < panels.length; i += 4) {
    pages.push(panels.slice(i, i + 4));
  }

  return (
    <div className="mt-12 space-y-16">
      {pages.map((pagePanels, pageIndex) => (
        <div key={pageIndex}>
          <h2 className="font-bangers text-4xl text-center mb-8 tracking-wide text-yellow-300 underline decoration-wavy decoration-indigo-500 underline-offset-8">
            Page {pageIndex + 1}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-black/20 border-2 border-gray-700 rounded-lg">
            {pagePanels.map((panel) => (
              <div key={panel.id} className="relative bg-gray-800 border-4 border-white shadow-lg flex flex-col transform transition-transform duration-300 hover:scale-105">
                <div className="absolute top-2 left-2 bg-black/70 text-white font-bangers text-lg px-3 py-1 rounded-md z-10">
                  Panel {panel.id}
                </div>
                <div className="aspect-square w-full bg-gray-700">
                  <img src={panel.imageUrl} alt={panel.description} className="w-full h-full object-cover"/>
                </div>
                <div className="p-4 bg-yellow-300 text-black flex-grow">
                  <p className="font-bangers text-xl md:text-2xl leading-tight tracking-wide">{panel.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

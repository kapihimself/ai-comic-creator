import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { PromptForm } from './components/PromptForm';
import { ComicDisplay } from './components/ComicDisplay';
import { Loader } from './components/Loader';
import { generateComicPanels, continueComicPanels } from './services/geminiService';
import type { ComicPanel } from './types';
import { ContinueForm } from './components/ContinueForm';
import { DownloadButton } from './components/DownloadButton';

const App: React.FC = () => {
  const [comicPanels, setComicPanels] = useState<ComicPanel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [characterPrompt, setCharacterPrompt] = useState<string>('');
  const [storyPrompt, setStoryPrompt] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const comicContainerRef = useRef<HTMLDivElement>(null);

  const MAX_PAGES = 10;

  const handleGenerateComic = useCallback(async (newStoryPrompt: string, newCharacterPrompt: string) => {
    setIsLoading(true);
    setError(null);
    setComicPanels([]);
    setStoryPrompt(newStoryPrompt);
    setCharacterPrompt(newCharacterPrompt);
    setPage(0);

    try {
      const panels = await generateComicPanels(newStoryPrompt, newCharacterPrompt);
      setComicPanels(panels);
      setPage(1);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleContinueComic = useCallback(async (nextStoryPart: string) => {
    if (!characterPrompt || !storyPrompt) return;
    setIsLoading(true);
    setError(null);
    
    try {
        const newPanels = await continueComicPanels(nextStoryPart, characterPrompt, storyPrompt, comicPanels);
        setComicPanels(prevPanels => [...prevPanels, ...newPanels]);
        setPage(prev => prev + 1);
    } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred while continuing the comic. Please try again.');
    } finally {
        setIsLoading(false);
    }
  }, [characterPrompt, storyPrompt, comicPanels]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <Header />
        <main className="mt-8">
          {comicPanels.length === 0 && !isLoading && (
            <PromptForm onGenerate={handleGenerateComic} isLoading={isLoading} />
          )}

          {isLoading && <Loader />}
          
          {error && (
            <div className="mt-8 text-center bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
              <p className="font-bold">Generation Failed</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          <div ref={comicContainerRef}>
            {comicPanels.length > 0 && <ComicDisplay panels={comicPanels} />}
          </div>

          {comicPanels.length > 0 && page < MAX_PAGES && !isLoading && (
            <ContinueForm onContinue={handleContinueComic} isLoading={isLoading} page={page} />
          )}

          {page >= MAX_PAGES && !isLoading && comicPanels.length > 0 && (
             <div className="mt-12 text-center bg-gray-800/50 border border-gray-700 rounded-xl p-8">
                <h3 className="font-bangers text-3xl tracking-wide text-green-400">The End!</h3>
                <p className="text-gray-300 mt-2">You've reached the 10-page limit. Your epic comic is complete!</p>
                <DownloadButton elementRef={comicContainerRef} />
             </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AudioPlayer, { AudioPlayerProps } from './AudioPlayer';
import SlokaCard from './SlokaCard';
import LanguageSelector from './LanguageSelector';
import SequentialAudioPlayer from './SequentialAudioPlayer';

type Language = 'en' | 'hi' | 'te';

interface SlokaLearnerProps {
  sloka: any;
  slokaIndex: number;
  slokaIndices: number[];
  group: any;
}

const SlokaLearner = ({ sloka, slokaIndex, slokaIndices, group }: SlokaLearnerProps) => {
  const [isLooping, setIsLooping] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [language, setLanguage] = useState<Language>('en');
  const [expandedIndex, setExpandedIndex] = useState<number>(slokaIndex);
  const [showAllVerses, setShowAllVerses] = useState(false);
  
  // Controlled state for SequentialAudioPlayer
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentIndex = slokaIndex;
  const prevSlokaIndex = currentIndex > 0 ? slokaIndices[currentIndex - 1] : null;
  const nextSlokaIndex = currentIndex < slokaIndices.length - 1 ? slokaIndices[currentIndex + 1] : null;

  if (!sloka) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-20 text-brand-muted-text">Sloka not found.</div>
      </div>
    );
  }

  // Classification mapping for scripture types
  const scriptureTypeMap: Record<string, string> = {
    'Stotram': 'Stotram',
    'Mantra': 'Mantra',
    'Ślok': 'Ślok',
    'Shlok': 'Ślok',
    'Shloka': 'Ślok',
    'Sloka': 'Ślok',
  };
  const classifiedScripture = sloka.scripture && scriptureTypeMap[sloka.scripture] ? scriptureTypeMap[sloka.scripture] : sloka.scripture;
  const deity = sloka.deities && sloka.deities.length > 0 ? sloka.deities[0] : '';
  const deityDisplay = deity.charAt(0).toUpperCase() + deity.slice(1);

  // When switching language, update both transliteration and meaning
  const handleLanguageChange = (val: Language) => {
    setLanguage(val);
  };

  // If group has multiple slokas, show accordion
  const isMultiVerse = group && group.slokas && group.slokas.length > 1;

  // Initialize currentVerseIndex when switching to book view
  useEffect(() => {
    if (showAllVerses) {
      setCurrentVerseIndex(0);
      setIsPlaying(false);
    }
  }, [showAllVerses]);

  // Handle verse change from SequentialAudioPlayer
  const handleVerseChange = (verseIndex: number) => {
    setCurrentVerseIndex(verseIndex);
  };

  // Handle play state change from SequentialAudioPlayer
  const handlePlayStateChange = (playing: boolean) => {
    setIsPlaying(playing);
  };

  // Handle clicking on a verse to start playback from that verse
  const handleVerseClick = (verseIndex: number) => {
    setCurrentVerseIndex(verseIndex);
    setIsPlaying(true);
  };

  // Debug logging for state changes
  useEffect(() => {
    console.log('Book view state:', {
      showAllVerses,
      currentVerseIndex,
      isPlaying,
      totalVerses: group?.slokas?.length
    });
  }, [showAllVerses, currentVerseIndex, isPlaying, group?.slokas?.length]);

  return (
    <div className="container mx-auto px-2 sm:px-4 lg:px-8 py-6 md:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-sm mb-6 text-[#22304A] font-medium" aria-label="Breadcrumb">
        <ol className="list-none p-0 flex items-center space-x-2">
          <li className="flex items-center">
            <Link href={`/slokas/${deity.toLowerCase()}`} className="hover:underline text-brand-primary">{deityDisplay}</Link>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          {classifiedScripture && (
            <li className="flex items-center">
              <Link href={`/slokas/scripture/${sloka.scripture.toLowerCase()}`} className="hover:underline text-brand-primary">{classifiedScripture}</Link>
              <span className="mx-2 text-gray-400">/</span>
            </li>
          )}
          <li className="flex items-center text-gray-700">{sloka.title}</li>
        </ol>
      </nav>

      <main>
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <div className="text-2xl font-bold text-brand-text mr-4 text-center w-full">{sloka.title}</div>
            <div className="flex-1" />
          </div>
          {isMultiVerse && (
            <div className="mb-4 flex items-center justify-end">
              <div className="inline-flex rounded-full shadow-sm bg-gray-100 p-1">
                <button
                  className={`flex items-center justify-center px-3 py-1.5 rounded-full text-sm transition-colors focus:outline-none ${!showAllVerses ? 'bg-blue-600 text-white shadow' : 'bg-transparent text-[#2C3E50]'}`}
                  onClick={() => setShowAllVerses(false)}
                  aria-label="Accordion View"
                  title="Accordion View"
                >
                  <img src="/list.svg" alt="Accordion View" className={`h-5 w-5 ${!showAllVerses ? 'filter invert' : ''}`} />
                </button>
                <button
                  className={`flex items-center justify-center px-3 py-1.5 rounded-full text-sm transition-colors focus:outline-none ${showAllVerses ? 'bg-blue-600 text-white shadow' : 'bg-transparent text-[#2C3E50]'}`}
                  onClick={() => setShowAllVerses(true)}
                  aria-label="All Verses View"
                  title="All Verses View"
                >
                  <img src="/book.svg" alt="All Verses View" className={`h-5 w-5 ${showAllVerses ? 'filter invert' : ''}`} />
                </button>
              </div>
            </div>
          )}
          {isMultiVerse && showAllVerses ? (
            <div className="bg-white rounded-lg shadow p-6 mb-4">
              <h3 className="font-extrabold text-xl mb-4 border-b border-gray-100 pb-1 text-center text-[#22304A]">मूलपाठ: <span className="text-sm text-gray-500 font-normal">(All Verses)</span></h3>
              <div className="mb-6 max-w-5xl mx-auto">
                <SequentialAudioPlayer
                  verses={group.slokas}
                  currentVerseIndex={currentVerseIndex}
                  isPlaying={isPlaying}
                  onVerseChange={handleVerseChange}
                  onPlayStateChange={handlePlayStateChange}
                  autoPlay={false}
                />
                <div className="text-center text-xs text-gray-600 mt-2">
                  {isPlaying ? `Playing Verse ${currentVerseIndex + 1} of ${group.slokas.length}` : `Paused at Verse ${currentVerseIndex + 1} of ${group.slokas.length}`}
                </div>
              </div>
              {/* Column-major grid for verses */}
              <ColumnMajorSlokaGrid
                slokas={group.slokas}
                currentVerseIndex={currentVerseIndex}
                isPlaying={isPlaying}
                onVerseClick={handleVerseClick}
              />
            </div>
          ) : isMultiVerse ? (
            <div className="mt-6 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
              {group.slokas.map((verse: any, idx: number) => (
                <div key={verse.id}>
                  <button
                    className={`w-full text-left px-4 py-3 focus:outline-none flex items-center justify-between ${expandedIndex === idx ? 'bg-blue-50' : 'bg-white'} transition`}
                    onClick={() => setExpandedIndex(idx)}
                    aria-expanded={expandedIndex === idx}
                  >
                    <span className="font-semibold text-brand-primary">Verse {idx + 1}</span>
                    <span className="ml-2 text-xs text-gray-500">{expandedIndex === idx ? '▼' : '▶'}</span>
                  </button>
                  {expandedIndex === idx && (
                    <div className="px-4 pb-6">
                      <SlokaCard
                        title={sloka.title}
                        text={verse.originalText}
                        transliteration={verse.transliteration}
                        transliterationLanguage={language === 'hi' ? 'en' : language}
                        meaning={typeof verse.meaning === 'object' ? verse.meaning[language] : verse.meaning}
                        languageSelector={
                          <LanguageSelector
                            value={language}
                            options={[
                              { value: 'en', label: 'EN' },
                              { value: 'hi', label: 'हि' },
                              { value: 'te', label: 'తె' },
                            ]}
                            onChange={val => handleLanguageChange(val as Language)}
                          />
                        }
                      >
                        <div className="mt-6">
                          <AudioPlayer
                            audioUrl={verse.audioUrl}
                            isLooping={isLooping}
                            playbackSpeed={playbackSpeed}
                          />
                        </div>
                      </SlokaCard>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <SlokaCard
              title={sloka.title}
              text={sloka.originalText}
              transliteration={sloka.transliteration}
              transliterationLanguage={language === 'hi' ? 'en' : language}
              meaning={typeof sloka.meaning === 'object' ? sloka.meaning[language] : sloka.meaning}
              languageSelector={
                <LanguageSelector
                  value={language}
                  options={[
                    { value: 'en', label: 'EN' },
                    { value: 'hi', label: 'हि' },
                    { value: 'te', label: 'తె' },
                  ]}
                  onChange={val => handleLanguageChange(val as Language)}
                />
              }
            >
              <div className="mt-6">
                <AudioPlayer
                  audioUrl={sloka.audioUrl}
                  isLooping={isLooping}
                  playbackSpeed={playbackSpeed}
                />
              </div>
            </SlokaCard>
          )}
        </div>
      </main>
    </div>
  );
};

function ColumnMajorSlokaGrid({ slokas, currentVerseIndex, isPlaying, onVerseClick }: {
  slokas: any[];
  currentVerseIndex: number;
  isPlaying: boolean;
  onVerseClick: (idx: number) => void;
}) {
  // Responsive columns: 1 (mobile), 2 (sm), 3 (lg)
  // We'll render 3 columns for desktop, 2 for tablet, 1 for mobile, but let CSS handle the wrapping.
  // For column-major, we need to split slokas into columns.
  // We'll use 3 columns for simplicity (can be improved with a hook for true responsiveness)
  const numCols = 3;
  const numRows = Math.ceil(slokas.length / numCols);
  // Build columns: each column is an array of sloka indices
  const columns = Array.from({ length: numCols }, (_, colIdx) =>
    Array.from({ length: numRows }, (_, rowIdx) => {
      const idx = rowIdx + colIdx * numRows;
      return idx < slokas.length ? idx : null;
    }).filter(idx => idx !== null)
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {columns.map((col, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-4">
          {col.map(idx => (
            <div
              key={slokas[idx].id}
              className={`bg-white border rounded-lg p-4 text-center font-devanagari leading-relaxed shadow-sm transition cursor-pointer whitespace-pre-line
                ${currentVerseIndex === idx ? 'border-blue-400 bg-blue-50' : 'hover:bg-gray-50'}`}
              onClick={() => onVerseClick(idx)}
              style={{ minHeight: 120 }}
            >
              <div className="text-lg">{slokas[idx].originalText}</div>
              <div className="text-xs text-gray-500 mt-2">॥ {idx + 1} ॥</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default SlokaLearner; 
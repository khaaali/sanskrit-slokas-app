"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import AudioPlayer from './AudioPlayer';
import SlokaCard from './SlokaCard';
import LanguageSelector from './LanguageSelector';

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
          <LanguageSelector
            value={language}
            options={[
              { value: 'en', label: 'EN' },
              { value: 'hi', label: 'हि' },
              { value: 'te', label: 'తె' },
            ]}
            onChange={val => handleLanguageChange(val as Language)}
          />
          {isMultiVerse ? (
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
                        languageSelector={null}
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
              languageSelector={null}
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

export default SlokaLearner; 
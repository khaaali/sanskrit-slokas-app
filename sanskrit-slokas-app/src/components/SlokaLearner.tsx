"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getSlokaById, getSlokasByScripture } from '@/lib/data';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type Language = 'en' | 'hi' | 'te';

const SlokaLearner = ({ slokaId }: { slokaId: string }) => {
  const searchParams = useSearchParams();
  const context = searchParams.get('context');
  const slokaIds: number[] = context ? JSON.parse(context) : [];
  
  const id = parseInt(slokaId, 10);
  const sloka = getSlokaById(id);

  const [isPlaying, setIsPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [isLooping, setIsLooping] = useState(false); // loop is NOT active by default
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [language, setLanguage] = useState<Language>('en');
  const [audioProgress, setAudioProgress] = useState(0); // 0 to 1
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<any>(null);
  const [WaveSurfer, setWaveSurfer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [audioError, setAudioError] = useState(false);

  const currentIndex = slokaIds.indexOf(id);
  const prevSlokaId = currentIndex > 0 ? slokaIds[currentIndex - 1] : null;
  const nextSlokaId = currentIndex < slokaIds.length - 1 ? slokaIds[currentIndex + 1] : null;

  // Get all verses of the same scripture for navigation
  const scriptureVerses = sloka ? getSlokasByScripture(sloka.scripture) : [];
  const hasMultipleVerses = scriptureVerses.length > 1;

  // Ref to always have latest userPaused in loop handler
  const userPausedRef = useRef(userPaused);
  useEffect(() => { userPausedRef.current = userPaused; }, [userPaused]);

  // Ref to always have latest isPlaying in loop handler
  const isPlayingRef = useRef(isPlaying);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  // Dynamically import wavesurfer.js on client
  useEffect(() => {
    if (!WaveSurfer) {
      import('wavesurfer.js').then((mod) => setWaveSurfer(() => mod.default));
    }
  }, [WaveSurfer]);

  // Responsive: determine waveform height based on screen size
  const getWaveformHeight = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 32; // mobile
      if (window.innerWidth < 1024) return 40; // tablet
    }
    return 48; // desktop
  };

  // Stable handler references
  const finishHandler = useCallback(() => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    ws.seekTo(0); // reset playhead
    ws.pause(); // ensure player is stopped
    setIsPlaying(false); // show play icon
    setAudioProgress(0); // reset waveform
    setAudioDuration(ws.getDuration() || 0);
  }, [isPlaying]);

  const loopHandler = useCallback(() => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    ws.seekTo(0);
    if (!userPausedRef.current && isPlayingRef.current) {
      ws.play();
    }
  }, []);

  // Initialize and sync WaveSurfer
  useEffect(() => {
    if (!WaveSurfer || !waveformRef.current || !sloka || !sloka.audioUrl) return;
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }
    // Reset state on new audio
    setIsPlaying(false);
    setUserPaused(false);
    setAudioProgress(0);
    setAudioDuration(0);
    setLoading(true);
    setAudioError(false);
    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#d1e6fa',
      progressColor: '#3b82f6',
      height: getWaveformHeight(),
      barWidth: 2,
      cursorColor: 'transparent',
      backend: 'MediaElement',
      mediaControls: false,
      responsive: true,
    });
    ws.load(sloka.audioUrl);
    wavesurferRef.current = ws;
    // Register event listeners ONCE (no setIsPlaying here)
    ws.on('audioprocess', () => {
      setAudioProgress(ws.getCurrentTime() / (ws.getDuration() || 1));
      setAudioDuration(ws.getDuration() || 0);
    });
    ws.on('interaction', () => {
      setAudioProgress(ws.getCurrentTime() / (ws.getDuration() || 1));
    });
    ws.on('ready', () => {
      setLoading(false);
      setAudioDuration(ws.getDuration() || 0);
    });
    ws.on('error', () => {
      setAudioError(true);
      setLoading(false);
    });
    // Responsive: update height on resize
    const handleResize = () => {
      ws.setOptions({ height: getWaveformHeight() });
    };
    window.addEventListener('resize', handleResize);
    // Clean up
    return () => {
      ws.destroy();
      window.removeEventListener('resize', handleResize);
    };
  }, [WaveSurfer, sloka && sloka.audioUrl]);

  // Sync play/pause from UI
  useEffect(() => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    if (isPlaying) {
      setUserPaused(false);
      ws.play();
    } else {
      setUserPaused(true);
      ws.pause();
    }
  }, [isPlaying]);

  // Sync speed
  useEffect(() => {
    const ws = wavesurferRef.current;
    if (ws) ws.setPlaybackRate(playbackSpeed);
  }, [playbackSpeed]);

  // Sync loop
  useEffect(() => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    if (isLooping) {
      ws.on('finish', loopHandler);
      ws.un('finish', finishHandler);
    } else {
      ws.on('finish', finishHandler);
      ws.un('finish', loopHandler);
    }
    return () => {
      ws.un('finish', loopHandler);
      ws.un('finish', finishHandler);
    };
  }, [isLooping, finishHandler, loopHandler]);

  // Seek handler for waveform (mouse and touch)
  const handleWaveformSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    let clientX;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = x / rect.width;
    ws.seekTo(percent);
  };

  if (!sloka) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-20 text-brand-muted-text">Sloka not found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 lg:px-8 py-6 md:py-12">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 flex items-center text-sm text-brand-muted-text space-x-2">
        <Link href="/slokas/shiva" className="hover:text-brand-primary font-medium">Shiva</Link>
        <span className="mx-1">/</span>
        <span className="font-semibold">{sloka.scripture}</span>
      </div>
      {/* Title and Navigation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="text-center md:text-left flex-1">
          <div className="text-brand-muted-text mb-1">Sloka {currentIndex + 1} of {slokaIds.length}</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-text font-devanagari">{sloka.title}</h1>
          <p className="text-brand-muted-text mt-1 text-base">{sloka.scripture}</p>
        </div>
        <div className="flex justify-between md:justify-end mt-4 md:mt-0 space-x-4">
          {prevSlokaId ? (
            <Link href={`/learn/${prevSlokaId}?context=${JSON.stringify(slokaIds)}`} className="flex items-center text-brand-muted-text hover:text-brand-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back
            </Link>
          ) : null}
          {nextSlokaId ? (
            <Link href={`/learn/${nextSlokaId}?context=${JSON.stringify(slokaIds)}`} className="flex items-center text-brand-muted-text hover:text-brand-primary transition-colors">
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          ) : null}
        </div>
      </div>
      {/* Main Layout: Sidebar + Content */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Verses Sidebar */}
        {hasMultipleVerses && (
          <aside className="md:w-64 w-full md:sticky md:top-24 flex-shrink-0 mb-4 md:mb-0">
            <div className="bg-brand-surface p-4 md:p-6 rounded-lg shadow-sm border border-brand-border overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4 text-brand-text">Verses</h3>
              <div className="space-y-2">
                {scriptureVerses.map((verse, idx) => (
                  <Link
                    key={verse.id}
                    href={`/learn/${verse.id}?context=${JSON.stringify(scriptureVerses.map(v => v.id))}`}
                    className={`block p-3 rounded-lg transition-colors overflow-hidden text-ellipsis whitespace-nowrap`
                      + (verse.id === id
                        ? ' bg-brand-primary text-white'
                        : ' text-brand-text hover:bg-brand-background')}
                    title={`Verse ${idx + 1}`}
                  >
                    <div className="font-medium text-ellipsis overflow-hidden whitespace-nowrap" title={`Verse ${idx + 1}`}>{`Verse ${idx + 1}`}</div>
                    <div className="text-sm opacity-75 mt-1 text-ellipsis overflow-hidden whitespace-nowrap" title={verse.originalText.split('\n')[0]}>
                      {verse.originalText.split('\n')[0].substring(0, 30)}...
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        )}
        {/* Main Content */}
        <main className={`flex-1 grid grid-cols-1 ${hasMultipleVerses ? 'md:grid-cols-3' : 'md:grid-cols-3'} gap-6 md:gap-8`}>
          {/* Original Text */}
          <div className="bg-brand-surface p-4 md:p-6 rounded-lg shadow-sm border border-brand-border h-64 md:h-80 lg:h-96 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-brand-text">मूलपाठः (Original Text)</h2>
            <p className="text-2xl leading-relaxed font-devanagari text-brand-text whitespace-pre-wrap break-words">{sloka.originalText}</p>
          </div>
          {/* Transliteration */}
          <div className="bg-brand-surface p-4 md:p-6 rounded-lg shadow-sm border border-brand-border h-64 md:h-80 lg:h-96 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-brand-text">लिप्यन्तरण (Transliteration)</h2>
            <p className="text-xl leading-relaxed text-brand-muted-text whitespace-pre-wrap break-words" style={{ wordBreak: 'break-word' }}>{sloka.transliteration}</p>
          </div>
          {/* Meaning */}
          <div className="bg-brand-surface p-4 md:p-6 rounded-lg shadow-sm border border-brand-border h-64 md:h-80 lg:h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-brand-text">अर्थः (Meaning)</h2>
              {typeof sloka.meaning === 'object' ? (
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="bg-brand-surface border-brand-border rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="te">Telugu</option>
                </select>
              ) : null}
            </div>
            <p className="text-lg leading-relaxed text-brand-text">
              {typeof sloka.meaning === 'object' ? sloka.meaning[language] : sloka.meaning}
            </p>
          </div>
        </main>
      </div>
      {/* Audio Player */}
      <div className="mt-8 bg-brand-surface p-2 sm:p-4 md:p-6 rounded-lg shadow-sm border border-brand-border">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className={`flex items-center justify-center p-2 transition-colors group`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            disabled={loading || audioError}
          >
            {loading ? (
              <svg className="animate-spin h-8 w-8 text-brand-muted-text" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : isPlaying ? (
              // Provided Pause SVG
              <svg viewBox="-1 0 8 8" xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition-colors duration-150 ${isPlaying ? 'fill-brand-primary' : 'fill-brand-muted-text'} group-hover:brightness-90`}>
                <g fill={isPlaying ? '#4A90E2' : '#7F8C8D'}>
                  <path d="M11,3613 L13,3613 L13,3605 L11,3605 L11,3613 Z M15,3613 L17,3613 L17,3605 L15,3605 L15,3613 Z" transform="translate(-67 -3765) translate(56 160)" />
                </g>
              </svg>
            ) : (
              // Provided Play SVG
              <svg viewBox="-0.5 0 8 8" xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition-colors duration-150 fill-brand-primary group-hover:brightness-90`}>
                <g fill="#4A90E2">
                  <polygon points="371 3605 371 3613 378 3609" transform="translate(-427 -3765) translate(56 160)" />
                </g>
              </svg>
            )}
          </button>
          {/* Waveform Visualization */}
          <div className="flex-1 w-full max-w-full flex flex-col min-w-0">
            <div className="flex justify-between items-center mb-2">
              <div className="text-lg font-semibold text-brand-text">{sloka.title}</div>
              <div className="text-xs text-brand-muted-text">
                {audioDuration ? `${Math.floor(audioProgress * audioDuration / 60)}:${('0' + Math.floor((audioProgress * audioDuration) % 60)).slice(-2)} / ${Math.floor(audioDuration / 60)}:${('0' + Math.floor(audioDuration % 60)).slice(-2)}` : '0:00 / 0:00'}
              </div>
            </div>
            <div
              ref={waveformRef}
              className="w-full cursor-pointer select-none rounded-md bg-white"
              style={{ minHeight: getWaveformHeight(), height: getWaveformHeight() }}
              onClick={handleWaveformSeek}
              onTouchStart={handleWaveformSeek}
            />
            {audioError && (
              <div className="text-red-500 text-sm mt-2">Audio failed to load. Please try again later.</div>
            )}
          </div>
          {/* Speed & Loop Controls */}
          <div className="flex flex-row sm:flex-col items-center gap-2 min-w-[80px] w-full sm:w-auto justify-center">
            <select
              value={playbackSpeed}
              onChange={e => setPlaybackSpeed(Number(e.target.value))}
              className="bg-brand-surface border-brand-border rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none text-sm w-20"
              disabled={loading || audioError}
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
            <button
              onClick={() => setIsLooping(l => !l)}
              className={`flex items-center justify-center p-2 transition-colors group`}
              aria-label="Toggle Loop"
              disabled={loading || audioError}
            >
              {/* Loop icon, no background, color reactive to state */}
              <svg xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 512 406.453" className={`h-8 w-8 transition-colors duration-150 ${isLooping ? 'fill-brand-primary' : 'fill-brand-muted-text'} group-hover:brightness-90` }>
                <path fillRule="nonzero" d="M97.761 63.347H77.388c-21.303 0-40.662 8.705-54.671 22.714C8.705 100.073 0 119.443 0 140.735v188.33c0 21.296 8.709 40.655 22.721 54.667s33.374 22.721 54.667 22.721h357.224c21.293 0 40.662-8.705 54.675-22.717C503.295 369.727 512 350.368 512 329.065v-188.33c0-21.307-8.698-40.666-22.71-54.678s-33.367-22.71-54.678-22.71H295.959V14.426C295.959 6.459 289.5 0 281.533 0a14.376 14.376 0 00-9.985 4.013L171.751 82.84c-6.223 4.915-7.281 13.947-2.366 20.17a14.348 14.348 0 002.61 2.559l100.636 79.489c6.223 4.914 15.255 3.856 20.17-2.366a14.302 14.302 0 003.089-8.902h.069v-52.737h138.653c5.386 0 10.304 2.224 13.881 5.801s5.801 8.498 5.801 13.881v188.33c0 5.379-2.228 10.297-5.804 13.874-3.581 3.58-8.502 5.808-13.878 5.808H77.388c-5.368 0-10.29-2.232-13.87-5.812s-5.812-8.498-5.812-13.87v-188.33c0-5.376 2.228-10.297 5.808-13.877 3.577-3.577 8.495-5.805 13.874-5.805h20.373V63.347z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlokaLearner; 
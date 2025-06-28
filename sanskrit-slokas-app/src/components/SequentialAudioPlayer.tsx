import React, { useEffect, useRef, useCallback } from 'react';
import type WaveSurfer from 'wavesurfer.js';

export interface SequentialAudioPlayerProps {
  verses: Array<{
    id: string;
    audioUrl: string;
    title: string;
  }>;
  currentVerseIndex: number;
  isPlaying: boolean;
  onVerseChange: (verseIndex: number) => void;
  onPlayStateChange: (isPlaying: boolean) => void;
  autoPlay?: boolean;
}

const SequentialAudioPlayer: React.FC<SequentialAudioPlayerProps> = ({
  verses,
  currentVerseIndex,
  isPlaying,
  onVerseChange,
  onPlayStateChange,
  autoPlay = false,
}) => {
  const [loop, setLoop] = React.useState(false);
  const [speed, setSpeed] = React.useState(1);
  const [audioProgress, setAudioProgress] = React.useState(0);
  const [audioDuration, setAudioDuration] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [audioError, setAudioError] = React.useState(false);
  const [WaveSurferClass, setWaveSurferClass] = React.useState<typeof WaveSurfer | null>(null);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  const currentVerse = verses[currentVerseIndex];
  const audioUrl = currentVerse?.audioUrl;

  // Dynamically import wavesurfer.js on client
  useEffect(() => {
    if (!WaveSurferClass) {
      import('wavesurfer.js').then((mod) => setWaveSurferClass(() => mod.default));
    }
  }, [WaveSurferClass]);

  const getWaveformHeight = () => {
    return 32;
  };

  // Notify parent to advance verse
  const finishHandler = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    if (currentVerseIndex < verses.length - 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        onVerseChange(currentVerseIndex + 1);
        onPlayStateChange(true);
      }, 200);
    } else {
      setIsTransitioning(false);
      onPlayStateChange(false);
    }
  }, [isTransitioning, currentVerseIndex, verses.length, onVerseChange, onPlayStateChange]);

  const loopHandler = useCallback(() => {
    const ws = wavesurferRef.current;
    if (ws && !isTransitioning) {
      ws.seekTo(0);
      ws.play();
    }
  }, [isTransitioning]);

  // Reset progress and error when verse changes
  useEffect(() => {
    setAudioProgress(0);
    setAudioDuration(0);
    setLoading(false);
    setAudioError(false);
  }, [currentVerseIndex]);

  // Initialize and sync WaveSurfer
  useEffect(() => {
    if (!WaveSurferClass || !waveformRef.current || !audioUrl) return;
    if (wavesurferRef.current) {
      const oldWs = wavesurferRef.current;
      oldWs.pause();
      oldWs.un('finish', loopHandler);
      oldWs.un('finish', finishHandler);
      oldWs.destroy();
      wavesurferRef.current = null;
    }
    setAudioProgress(0);
    setAudioDuration(0);
    setLoading(true);
    setAudioError(false);
    const ws = WaveSurferClass.create({
      container: waveformRef.current,
      waveColor: '#d1e6fa',
      progressColor: '#3b82f6',
      height: getWaveformHeight(),
      barWidth: 2,
      cursorColor: 'transparent',
      backend: 'MediaElement',
      mediaControls: false,
    });
    ws.load(audioUrl);
    wavesurferRef.current = ws;
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
      if ((autoPlay || isPlaying) && !isTransitioning) {
        onPlayStateChange(true);
        ws.play();
      }
    });
    ws.on('error', () => {
      setAudioError(true);
      setLoading(false);
    });
    ws.on('finish', finishHandler);
    return () => {
      if (ws) {
        try { ws.pause(); } catch (e) {}
        try { ws.un('finish', loopHandler); } catch (e) {}
        try { ws.un('finish', finishHandler); } catch (e) {}
        try { ws.destroy(); } catch (e) {}
      }
    };
  }, [WaveSurferClass, audioUrl, autoPlay, currentVerseIndex, finishHandler, loopHandler, isTransitioning, isPlaying, onPlayStateChange]);

  // Update finish event handler when loop changes, without reloading audio
  useEffect(() => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    ws.un('finish', loopHandler);
    ws.un('finish', finishHandler);
    if (loop) {
      ws.on('finish', loopHandler);
    } else {
      ws.on('finish', finishHandler);
    }
    return () => {
      if (ws) {
        ws.un('finish', loopHandler);
        ws.un('finish', finishHandler);
      }
    };
  }, [loop, finishHandler, loopHandler]);

  // Sync play/pause from parent
  useEffect(() => {
    const ws = wavesurferRef.current;
    if (!ws || isTransitioning) return;
    if (isPlaying) {
      ws.play();
    } else {
      ws.pause();
    }
  }, [isPlaying, audioUrl, currentVerseIndex, isTransitioning]);

  // Sync speed
  useEffect(() => {
    const ws = wavesurferRef.current;
    if (ws) ws.setPlaybackRate(speed);
  }, [speed]);

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

  if (!currentVerse) {
    return <div className="text-center py-4">No verses available.</div>;
  }

  return (
    <div className="w-full">
      {/* Audio Player Controls */}
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            aria-pressed={isPlaying}
            onClick={() => onPlayStateChange(!isPlaying)}
            className="p-2 rounded"
            disabled={loading}
          >
            {isPlaying ? (
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-label="Pause icon" role="img" className="text-[#4A90E2]"><rect x="6" y="5" width="4" height="14" rx="2" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="2" fill="currentColor"/></svg>
            ) : (
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-label="Play icon" role="img" className="text-[#2C3E50]">
                <path d="M7 6v12l10-6-10-6z" fill="currentColor"/>
              </svg>
            )}
          </button>
          <button
            type="button"
            aria-label={loop ? 'Disable loop' : 'Enable loop'}
            aria-pressed={loop}
            onClick={() => setLoop(l => !l)}
            className={`p-2 rounded ${loop ? 'text-[#4A90E2]' : 'text-[#2C3E50]'}`}
          >
            <svg width="24" height="24" viewBox="0 0 30 30" fill="currentColor" aria-label="Loop icon" role="img">
              <path d="M20,14c-0.3,0-0.5-0.1-0.7-0.3l-4-4c-0.4-0.4-0.4-1,0-1.4l4-4c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4L17.4,9l3.3,3.3 c0.4,0.4,0.4,1,0,1.4C20.5,13.9,20.3,14,20,14z" />
              <path d="M22,24H10c-4.4,0-8-3.6-8-8s3.6-8,8-8h2c0.6,0,1,0.4,1,1s-0.4,1-1,1h-2c-3.3,0-6,2.7-6,6s2.7,6,6,6h12c3.3,0,6-2.7,6-6 s-2.7-6-6-6h-6c-0.6,0-1-0.4-1-1s0.4-1,1-1h6c4.4,0,8,3.6,8,8S26.4,24,22,24z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="audio-speed-btn"
            type="button"
            aria-label={`Change speed (current: ${speed}x)`}
            onClick={() => {
              const speeds = [0.5, 1, 1.5, 2];
              const idx = speeds.indexOf(speed);
              setSpeed(speeds[(idx + 1) % speeds.length]);
            }}
            className={`flex items-center justify-center gap-1 text-xs rounded px-2 py-1 w-[69px] ${speed === 1 ? 'text-[#2C3E50]' : 'text-[#4A90E2]'} hover:text-[#4A90E2]`}
          >
            <span className="font-mono">{speed.toFixed(1)}x</span>
            <svg aria-label="Speed icon" role="img" width="20" height="20" viewBox="0 0 612 612" fill="none" className={`inline-block align-middle`} style={{ color: speed === 1 ? '#2C3E50' : '#4A90E2' }}>
              <g>
                <g>
                  <path d="M175.205,239.62c0.127-1.965-0.533-3.902-1.833-5.381l-58.84-66.941c-1.3-1.479-3.135-2.381-5.102-2.508 c-1.975-0.126-3.902,0.533-5.381,1.833c-27.037,23.766-49.479,51.794-66.706,83.305c-0.944,1.729-1.165,3.762-0.611,5.651 c0.554,1.89,1.836,3.483,3.565,4.427l78.205,42.748c1.131,0.619,2.352,0.912,3.557,0.912c2.627,0,5.174-1.398,6.523-3.866 c11.386-20.828,26.229-39.359,44.114-55.08C174.178,243.422,175.08,241.587,175.205,239.62z" fill="currentColor"/>
                  <path d="M201.462,214.829c1.334,2.515,3.907,3.948,6.568,3.948c1.174,0,2.365-0.279,3.473-0.867 c20.962-11.117,43.512-18.371,67.025-21.561c4.064-0.551,6.913-4.293,6.362-8.358l-11.979-88.316 c-0.551-4.064-4.304-6.909-8.358-6.362c-35.708,4.843-69.949,15.857-101.772,32.736c-3.623,1.922-5.002,6.416-3.082,10.041 L201.462,214.829z" fill="currentColor"/>
                  <path d="M105.785,334.345l-86.017-23.338c-1.901-0.514-3.929-0.255-5.638,0.725s-2.958,2.598-3.475,4.499 C3.586,342.295,0,369.309,0,396.523c0,4.657,0.111,9.329,0.342,14.284c0.185,3.981,3.468,7.083,7.414,7.083 c0.116,0,0.234-0.002,0.35-0.008l89.031-4.113c1.967-0.90,3.82-0.960,5.145-2.415c1.327-1.455,2.022-3.38,1.93-5.347 c-0.155-3.341-0.23-6.444-0.23-9.484c0-18.02,2.365-35.873,7.029-53.066C112.082,339.499,109.743,335.42,105.785,334.345z" fill="currentColor"/>
                  <path d="M438.731,120.745c-32.411-15.625-67.04-25.308-102.925-28.786c-1.972-0.198-3.918,0.408-5.439,1.659 c-1.521,1.252-2.481,3.056-2.671,5.018l-8.593,88.712c-0.396,4.082,2.594,7.713,6.677,8.108 c23.652,2.291,46.463,8.669,67.8,18.954c1.015,0.49,2.118,0.738,3.225,0.738c0.826,0,1.654-0.139,2.45-0.416 c1.859-0.649,3.385-2.012,4.24-3.786l38.7-80.287C443.978,126.965,442.427,122.525,438.731,120.745z" fill="currentColor"/>
                  <path d="M569.642,245.337c0.48-1.911,0.184-3.932-0.828-5.624c-18.432-30.835-41.933-57.983-69.848-80.686 c-1.529-1.242-3.48-1.824-5.447-1.627c-1.959,0.203-3.758,1.174-5,2.702l-56.237,69.144c-1.242,1.529-1.828,3.488-1.625,5.447 c0.201,1.959,1.173,3.758,2.702,5.002c18.47,15.019,34.015,32.975,46.205,53.369c1.392,2.326,3.855,3.618,6.383,3.618 c1.297,0,2.61-0.34,3.803-1.054l76.501-45.728C567.94,248.889,569.16,247.248,569.642,245.337z" fill="currentColor"/>
                  <path d="M598.044,304.939c-1.228-3.915-5.397-6.096-9.308-4.867l-85.048,26.648c-3.915,1.226-6.093,5.393-4.867,9.306 c6.104,19.486,9.199,39.839,9.199,60.494c0,3.041-0.076,6.144-0.23,9.484c-0.092,1.967,0.602,3.892,1.93,5.347 c1.327,1.456,3.178,2.325,5.145,2.415l89.031,4.113c0.118,0.005,0.234,0.008,0.35,0.008c3.944,0,7.228-3.103,7.414-7.083 c0.229-4.955,0.342-9.627,0.342-14.284C612,365.306,607.306,334.494,598.044,304.939z" fill="currentColor"/>
                  <path d="M305.737,380.755c-1.281,0-2.555,0.042-3.824,0.11l-120.65-71.185c-2.953-1.745-6.702-1.308-9.176,1.065 c-2.476,2.371-3.07,6.099-1.456,9.121l65.815,123.355c-0.242,2.376-0.371,4.775-0.371,7.195c0,18.608,7.246,36.101,20.403,49.258 c13.158,13.158,30.652,20.404,49.26,20.404c18.608,0,36.101-7.248,49.258-20.404c13.158-13.157,20.403-30.65,20.403-49.258 c0-18.608-7.246-36.101-20.403-49.258C341.839,388.001,324.344,380.755,305.737,380.755z" fill="currentColor"/>
                </g>
              </g>
            </svg>
          </button>
          <span className="text-xs text-gray-500 ml-2 font-mono">
            {audioDuration > 0 ? `${Math.floor((audioProgress * audioDuration) / 60)}:${('0' + Math.floor((audioProgress * audioDuration) % 60)).slice(-2)} / ${Math.floor(audioDuration / 60)}:${('0' + Math.floor(audioDuration % 60)).slice(-2)}` : '--:-- / --:--'}
          </span>
        </div>
      </div>
      {/* Waveform with loading overlay */}
      <div className="relative w-full mt-2 cursor-pointer" style={{ minHeight: 32 }}
        ref={waveformRef}
        onClick={handleWaveformSeek}
        onTouchStart={handleWaveformSeek}
        role="region"
        aria-label="Audio waveform seek bar"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-10" style={{ minHeight: 32 }}>
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      {/* Fixed height for loading/error message to prevent layout shift */}
      <div style={{ minHeight: 20 }}>
        {audioError && <div className="text-xs text-red-500 mt-2">Failed to load audio.</div>}
      </div>
    </div>
  );
};

export default SequentialAudioPlayer; 
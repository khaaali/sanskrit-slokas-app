import React from 'react';
import Link from 'next/link';

const Hero = () => {
  return (
    <div className="relative bg-cover bg-center h-[500px]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549420642-c23d4a6fe011?q=80&w=2070&auto=format&fit=crop')" }}>
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
        <h1 className="text-4xl md:text-6xl font-bold" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}>Unlock the Wisdom of Sanskrit Slokas</h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
          Explore a vast library of Sanskrit slokas with translations, meanings, and audio playback. Immerse yourself in the rich heritage of ancient Indian wisdom.
        </p>
        <Link href="/slokas" className="mt-8 px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-full text-lg font-semibold transition duration-300 shadow-lg">
            Get Started
        </Link>
      </div>
    </div>
  );
};

export default Hero; 
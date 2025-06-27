import React from 'react';

interface SlokaCardProps {
  title: string;
  text: string;
  transliteration: { en: string; te: string };
  transliterationLanguage: 'en' | 'te';
  meaning: string;
  languageSelector?: React.ReactNode;
  children?: React.ReactNode;
}

const SlokaCard: React.FC<SlokaCardProps> = ({ title, text, transliteration, transliterationLanguage, meaning, languageSelector, children }) => (
  <section className="bg-white rounded-lg shadow p-4 mb-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0">
      {/* Original Text */}
      <article className="md:pr-6 md:border-r md:border-gray-200 text-center">
        <h3 className="font-extrabold text-xl mb-2 border-b border-gray-100 pb-1 text-center text-[#22304A]">मूलपाठ: <span className="text-sm text-gray-500 font-normal">(Original Text)</span></h3>
        <div className="font-devanagari text-lg font-bold whitespace-pre-line text-center">{text}</div>
      </article>
      {/* Transliteration */}
      <article className="md:px-6 md:border-r md:border-gray-200 text-center">
        <h3 className="font-extrabold text-xl mb-2 border-b border-gray-100 pb-1 text-center text-[#22304A]">लिप्यन्तरण <span className="text-sm text-gray-500 font-normal">(Transliteration)</span></h3>
        <div className="text-[#2C3E50] whitespace-pre-line text-center">{transliteration[transliterationLanguage]}</div>
      </article>
      {/* Meaning */}
      <article className="md:pl-6 text-center">
        <div className="flex items-center justify-between mb-2 border-b border-gray-100 pb-1 w-full">
          <h3 className="font-extrabold text-xl flex items-center text-[#22304A]">अर्थः <span className="text-sm text-gray-500 font-normal ml-1">(Meaning)</span></h3>
          {languageSelector && <div className="ml-2">{languageSelector}</div>}
        </div>
        <div className="text-[#2C3E50] whitespace-pre-line text-center">{meaning}</div>
      </article>
    </div>
    {children && <div className="mt-4">{children}</div>}
  </section>
);

export default SlokaCard; 
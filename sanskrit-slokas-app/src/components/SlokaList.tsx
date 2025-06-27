"use client";

import React from 'react';
import Link from 'next/link';
import { getSlokasByDeity, FlattenedSloka } from '@/lib/data';

// Slugify function for scripture titles
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Group slokas by scripture title
function groupSlokasByTitle(slokas: FlattenedSloka[]) {
  const grouped: { [title: string]: { scripture: string; slokas: FlattenedSloka[] } } = {};
  for (const sloka of slokas) {
    if (!grouped[sloka.title]) {
      grouped[sloka.title] = { scripture: sloka.scripture, slokas: [] };
    }
    grouped[sloka.title].slokas.push(sloka);
  }
  return grouped;
}

const ScriptureTag = ({ scripture }: { scripture: string }) => (
  <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-200 text-blue-800 ml-2">
    {scripture}
  </span>
);

const ScriptureCard = ({ title, scripture, slokas }: { title: string; scripture: string; slokas: FlattenedSloka[] }) => {
  const firstSloka = slokas[0];
  const isMultiVerse = slokas.length > 1;
  const contextIndices = slokas.map((_, idx) => idx);
  const slug = slugify(title);
  return (
    <Link href={`/learn/${slug}/0?context=${JSON.stringify(contextIndices)}`}>
      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 border border-brand-border cursor-pointer flex flex-col items-start">
        <div className="font-devanagari font-bold text-base sm:text-lg text-[#2C3E50] leading-snug mb-1 whitespace-pre-line">
          {firstSloka.originalText.split('\n')[0]}
        </div>
        <div className="flex items-center w-full mb-1">
          <span className="text-xs sm:text-sm text-[#8A99A8] flex-1 mt-0.5">{title}</span>
          <ScriptureTag scripture={scripture} />
        </div>
        <div className="flex items-center text-xs text-[#5A5A5A] mt-1">
          {slokas.length} verse{isMultiVerse ? 's' : ''}
        </div>
      </div>
    </Link>
  );
};

const SlokaList = ({ deity }: { deity: string }) => {
  const slokas = getSlokasByDeity(deity);
  const grouped = groupSlokasByTitle(slokas);

  if (slokas.length === 0) {
    return <div className="text-center py-10 text-[#5A5A5A]">No slokas found for this deity yet.</div>;
  }

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([title, { scripture, slokas }]) => (
        <ScriptureCard key={title} title={title} scripture={scripture} slokas={slokas} />
      ))}
    </div>
  );
};

export default SlokaList; 
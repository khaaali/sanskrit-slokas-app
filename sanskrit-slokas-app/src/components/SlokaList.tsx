"use client";

import React from 'react';
import Link from 'next/link';
import { getSlokasByDeity, Sloka } from '@/lib/data';

// Group slokas by scripture
function groupSlokasByScripture(slokas: Sloka[]) {
  const grouped: { [scripture: string]: Sloka[] } = {};
  for (const sloka of slokas) {
    if (!grouped[sloka.scripture]) grouped[sloka.scripture] = [];
    grouped[sloka.scripture].push(sloka);
  }
  return grouped;
}

const ScriptureTag = ({ scripture }: { scripture: string }) => (
  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 mb-2 mr-2">
    {scripture}
  </span>
);

const ScriptureCard = ({ scripture, slokas }: { scripture: string, slokas: Sloka[] }) => {
  const firstSloka = slokas[0];
  const isMultiVerse = slokas.length > 1;
  const contextIds = slokas.map(s => s.id);
  return (
    <Link href={`/learn/${firstSloka.id}?context=${JSON.stringify(contextIds)}`}>
      <div className="bg-brand-surface p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 border border-brand-border cursor-pointer flex flex-col items-start">
        <div className="font-devanagari text-2xl sm:text-3xl text-brand-text leading-snug mb-3 whitespace-pre-line">
          {firstSloka.originalText.split('\n')[0]}
        </div>
        <div className="mt-auto flex flex-col items-start w-full">
          <ScriptureTag scripture={firstSloka.scripture} />
          {isMultiVerse && (
            <div className="text-brand-muted-text text-xs mb-1">{slokas.length} verses</div>
          )}
        </div>
      </div>
    </Link>
  );
};

const SlokaList = ({ deity }: { deity: string }) => {
  const slokas = getSlokasByDeity(deity);
  const grouped = groupSlokasByScripture(slokas);

  if (slokas.length === 0) {
    return <div className="text-center py-10 text-brand-muted-text">No slokas found for this deity yet.</div>;
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([scripture, scriptureSlokas]) => (
        <ScriptureCard key={scripture} scripture={scripture} slokas={scriptureSlokas} />
      ))}
    </div>
  );
};

export default SlokaList; 
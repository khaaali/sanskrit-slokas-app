import React from 'react';
import Link from 'next/link';
import { getSlokasByScripture, FlattenedSloka } from '@/lib/data';

// Simple slugify function
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Group slokas by title and collect deities
function groupSlokasByTitle(slokas: FlattenedSloka[]) {
  const grouped: { [title: string]: { scripture: string; deities: string[]; slokas: FlattenedSloka[] } } = {};
  for (const sloka of slokas) {
    if (!grouped[sloka.title]) {
      grouped[sloka.title] = { scripture: sloka.scripture, deities: sloka.deities, slokas: [] };
    }
    grouped[sloka.title].slokas.push(sloka);
  }
  return grouped;
}

const DeityTag = ({ name }: { name: string }) => (
  <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-primary text-white ml-2">
    {name}
  </span>
);

const ScriptureTypePage = ({ params }: { params: { scripture: string } }) => {
  const scriptureType = params.scripture.replace(/-/g, ' ');
  const slokas = getSlokasByScripture(scriptureType);
  const grouped = groupSlokasByTitle(slokas);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/slokas" className="flex items-center text-brand-muted-text hover:text-brand-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Collection
        </Link>
      </div>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-brand-text font-devanagari">{scriptureType.charAt(0).toUpperCase() + scriptureType.slice(1)}s</h1>
      </div>
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-10 text-brand-muted-text">
          No slokas found for {scriptureType}.
        </div>
      ) : (
        <div className="space-y-4 max-w-2xl mx-auto">
          {Object.entries(grouped).map(([title, { deities, slokas }]) => {
            const firstSloka = slokas[0];
            const isMultiVerse = slokas.length > 1;
            const contextIndices = slokas.map((_, idx) => idx);
            const slug = slugify(title);
            return (
              <Link key={title} href={`/learn/${slug}/0?context=${JSON.stringify(contextIndices)}`}>
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 border border-brand-border cursor-pointer flex flex-col items-start">
                  <div className="font-devanagari font-bold text-base sm:text-lg text-[#2C3E50] leading-snug mb-1 whitespace-pre-line">
                    {firstSloka.originalText.split('\n')[0]}
                  </div>
                  <div className="flex items-center w-full mb-1">
                    <span className="text-xs sm:text-sm text-[#8A99A8] flex-1 mt-0.5 font-devanagari">{title}</span>
                    {deities && deities.length > 0 && (
                      <span className="flex items-center ml-2">
                        {deities.map(d => (
                          <DeityTag key={d} name={d.charAt(0).toUpperCase() + d.slice(1)} />
                        ))}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-[#5A5A5A] mt-1">
                    {slokas.length} verse{isMultiVerse ? 's' : ''}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScriptureTypePage; 
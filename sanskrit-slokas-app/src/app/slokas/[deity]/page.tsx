import React from 'react';
import Link from 'next/link';
import { getCollectionsWithSlokas } from '@/lib/db';
import type { SlokaGroup, FlattenedSloka } from '@/lib/data';

// Server component version of SlokaList
const SlokaList = async ({ deity }: { deity: string }) => {
  const collections = await getCollectionsWithSlokas() as SlokaGroup[];
  // Filter collections by deity (case-insensitive)
  const filtered = collections.filter((col) =>
    col.deities.some((d: string) => d.toLowerCase() === deity.toLowerCase())
  );

  // Flatten slokas for grouping by title
  const allSlokas: FlattenedSloka[] = filtered.flatMap((col) =>
    (col.slokas as FlattenedSloka[] || []).map((sloka) => ({
      ...sloka,
      deities: col.deities,
      scripture: col.scripture,
      title: col.title,
    }))
  );

  // Group by title
  const grouped: { [title: string]: { scripture: string; slokas: FlattenedSloka[] } } = {};
  for (const sloka of allSlokas) {
    if (!grouped[sloka.title]) {
      grouped[sloka.title] = { scripture: sloka.scripture, slokas: [] };
    }
    grouped[sloka.title].slokas.push(sloka);
  }

  if (allSlokas.length === 0) {
    return <div className="text-center py-10 text-[#5A5A5A]">No slokas found for this deity yet.</div>;
  }

  // Slugify function
  function slugify(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([title, { scripture, slokas }]) => {
        const firstSloka = slokas[0];
        const isMultiVerse = slokas.length > 1;
        const contextIndices = slokas.map((_: FlattenedSloka, idx: number) => idx);
        const slug = slugify(title);
        return (
          <Link key={title} href={`/learn/${slug}/0?context=${JSON.stringify(contextIndices)}`}>
            <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 border border-brand-border cursor-pointer flex flex-col items-start">
              <div className="font-devanagari font-bold text-base sm:text-lg text-[#2C3E50] leading-snug mb-1 whitespace-pre-line">
                {firstSloka.originalText.split('\n')[0]}
              </div>
              <div className="flex items-center w-full mb-1">
                <span className="text-xs sm:text-sm text-[#8A99A8] flex-1 mt-0.5 font-devanagari">{title}</span>
                <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-200 text-blue-800 ml-2">{scripture}</span>
              </div>
              <div className="flex items-center text-xs text-[#5A5A5A] mt-1">
                {slokas.length} verse{isMultiVerse ? 's' : ''}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

const SlokaListPage = async ({ params }: { params: Promise<{ deity: string }> }) => {
  const { deity } = await params;
  const deityName = deity.charAt(0).toUpperCase() + deity.slice(1);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/slokas" className="flex items-center text-brand-muted-text hover:text-brand-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Collection
        </Link>
      </div>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-brand-text">Slokas for {deityName}</h1>
      </div>
      <SlokaList deity={deity} />
    </div>
  );
};

export default SlokaListPage; 
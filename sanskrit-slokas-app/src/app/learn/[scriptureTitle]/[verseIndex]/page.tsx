import React, { Suspense } from 'react';
import SlokaLearner from '@/components/SlokaLearner';
import slokasData from '@/../public/data/slokas.json';

// Simple slugify function (must match the one in scripture type page)
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Find scripture group by slug
function getScriptureGroupBySlug(slug: string) {
  return slokasData.find(
    (group: any) => slugify(group.title) === slug
  );
}

const SlokaLearnerPage = ({ params, searchParams }: { params: { scriptureTitle: string, verseIndex: string }, searchParams: { context?: string } }) => {
  const { scriptureTitle, verseIndex } = params;
  const group = getScriptureGroupBySlug(scriptureTitle);
  const index = parseInt(verseIndex, 10);
  const context = searchParams.context ? JSON.parse(searchParams.context) : [];

  if (!group || !group.slokas || !group.slokas[index]) {
    return <div className="text-center py-20">Sloka not found.</div>;
  }

  // Compose a "flattened" sloka object for compatibility with SlokaLearner
  const sloka = {
    ...group.slokas[index],
    deities: group.deities,
    scripture: group.scripture,
    title: group.title,
  };

  // Compose context as indices for navigation
  const slokaIds = Array.isArray(context) && context.length > 0 ? context : group.slokas.map((_: any, idx: number) => idx);

  return (
    <div>
      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
        <SlokaLearner sloka={sloka} slokaIndex={index} slokaIndices={slokaIds} group={group} />
      </Suspense>
    </div>
  );
};

export default SlokaLearnerPage; 
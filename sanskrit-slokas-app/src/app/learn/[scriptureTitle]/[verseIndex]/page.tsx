import React, { Suspense } from 'react';
import SlokaLearner from '@/components/SlokaLearner';
import slokasData from '@/../public/data/slokas.json';
import type { SlokaGroup, FlattenedSloka } from '@/lib/data';

// Simple slugify function (must match the one in scripture type page)
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Find scripture group by slug
type SlokasDataType = SlokaGroup[];
function getScriptureGroupBySlug(slug: string, data: SlokasDataType): SlokaGroup | undefined {
  return data.find(
    (group) => slugify(group.title) === slug
  );
}

interface PageParams {
  scriptureTitle: string;
  verseIndex: string;
}

const SlokaLearnerPage = async ({ params }: { params: Promise<PageParams> }) => {
  const { scriptureTitle, verseIndex } = await params;
  const group = getScriptureGroupBySlug(scriptureTitle, slokasData as SlokasDataType);
  const index = parseInt(verseIndex, 10);

  if (!group || !group.slokas || !group.slokas[index]) {
    return <div className="text-center py-20">Sloka not found.</div>;
  }

  // Compose a "flattened" sloka object for compatibility with SlokaLearner
  const sloka: FlattenedSloka = {
    ...group.slokas[index],
    deities: group.deities,
    scripture: group.scripture,
    title: group.title,
  };

  return (
    <div>
      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
        <SlokaLearner sloka={sloka} slokaIndex={index} group={group} />
      </Suspense>
    </div>
  );
};

export default SlokaLearnerPage; 
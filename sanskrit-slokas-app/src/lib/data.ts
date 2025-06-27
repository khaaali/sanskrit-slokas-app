import slokas from '@/../public/data/slokas.json';

// Types for the new grouped structure
export interface Sloka {
  id: number;
  originalText: string;
  transliteration: {
    en: string;
    te: string;
  };
  meaning: {
    en: string;
    hi: string;
    te: string;
  } | string;
  audioUrl: string;
}

export interface SlokaGroup {
  deities: string[];
  scripture: string;
  title: string;
  slokas: Sloka[];
}

// Flattened sloka for UI use
export interface FlattenedSloka extends Sloka {
  deities: string[];
  scripture: string;
  title: string;
}

// Flatten the grouped data for easier filtering/display
const slokaGroups: SlokaGroup[] = slokas as SlokaGroup[];
const allSlokas: FlattenedSloka[] = slokaGroups.flatMap(group =>
  group.slokas.map(sloka => ({
    ...sloka,
    deities: group.deities,
    scripture: group.scripture,
    title: group.title,
  }))
);

// Utility functions
export function getSlokasByDeity(deity: string): FlattenedSloka[] {
  return allSlokas.filter(sloka =>
    sloka.deities.map(d => d.toLowerCase()).includes(deity.toLowerCase())
  );
}

export function getSlokaById(id: number): FlattenedSloka | undefined {
  return allSlokas.find(sloka => sloka.id === id);
}

export function getSlokasByScripture(scripture: string): FlattenedSloka[] {
  return allSlokas.filter(sloka =>
    sloka.scripture.toLowerCase() === scripture.toLowerCase()
  );
} 
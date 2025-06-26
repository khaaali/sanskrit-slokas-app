import slokas from '@/../public/data/slokas.json';

export interface Sloka {
  id: number;
  deity: string;
  scripture: string;
  title: string;
  originalText: string;
  transliteration: string;
  meaning: {
    en: string;
    hi: string;
    te: string;
  } | string;
  audioUrl: string;
}

// Since the JSON is in the public folder, it's treated as a static asset
// and we can't directly import it on the server-side in the same way.
// A simple approach for this app structure is to just re-export the imported data.
// For a larger app, we'd use an API route or server-side data fetching.
const allSlokas: Sloka[] = slokas as Sloka[];

export function getSlokasByDeity(deity: string): Sloka[] {
  return allSlokas.filter(sloka => sloka.deity.toLowerCase() === deity.toLowerCase());
}

export function getSlokaById(id: number): Sloka | undefined {
  return allSlokas.find(sloka => sloka.id === id);
}

export function getSlokasByScripture(scripture: string): Sloka[] {
  return allSlokas.filter(sloka => sloka.scripture.toLowerCase() === scripture.toLowerCase());
} 
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deities, scripture, title, slokas } = body;
    if (!deities || !scripture || !title || !Array.isArray(slokas) || slokas.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert collection
    const collectionResult = await sql`
      INSERT INTO collections (deities, scripture, title)
      VALUES (${deities}, ${scripture}, ${title})
      RETURNING id;
    `;
    const collectionId = collectionResult.rows[0].id;

    // Insert slokas
    for (const sloka of slokas) {
      const { originalText, transliteration, meaning, audioUrl } = sloka;
      if (!originalText || !transliteration || !meaning || !audioUrl) {
        return NextResponse.json({ error: 'Missing sloka fields' }, { status: 400 });
      }
      await sql`
        INSERT INTO slokas (collection_id, original_text, transliteration, meaning, audio_url)
        VALUES (
          ${collectionId},
          ${originalText},
          ${JSON.stringify(transliteration)},
          ${JSON.stringify(meaning)},
          ${audioUrl}
        );
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 
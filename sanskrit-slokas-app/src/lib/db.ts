import { sql } from '@vercel/postgres';

export async function getCollectionsWithSlokas() {
  const collections = await sql`
    SELECT c.id, c.deities, c.scripture, c.title,
      json_agg(
        json_build_object(
          'id', s.id,
          'originalText', s.original_text,
          'transliteration', s.transliteration,
          'meaning', s.meaning,
          'audioUrl', s.audio_url
        )
      ) AS slokas
    FROM collections c
    LEFT JOIN slokas s ON s.collection_id = c.id
    GROUP BY c.id
    ORDER BY c.id;
  `;
  return collections.rows;
}

export async function getSlokaById(slokaId: number) {
  const result = await sql`
    SELECT * FROM slokas WHERE id = ${slokaId}
  `;
  return result.rows[0];
}

export async function getCollectionById(collectionId: number) {
  const result = await sql`
    SELECT c.id, c.deities, c.scripture, c.title,
      json_agg(
        json_build_object(
          'id', s.id,
          'originalText', s.original_text,
          'transliteration', s.transliteration,
          'meaning', s.meaning,
          'audioUrl', s.audio_url
        )
      ) AS slokas
    FROM collections c
    LEFT JOIN slokas s ON s.collection_id = c.id
    WHERE c.id = ${collectionId}
    GROUP BY c.id;
  `;
  return result.rows[0];
} 
require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const POSTGRES_URL = process.env.POSTGRES_URL;
if (!POSTGRES_URL) {
  console.error('Please set the POSTGRES_URL environment variable.');
  process.exit(1);
}

const client = new Client({ connectionString: POSTGRES_URL });

async function migrate() {
  const slokasPath = path.join(__dirname, '../public/data/slokas.json');
  const data = JSON.parse(fs.readFileSync(slokasPath, 'utf-8'));

  await client.connect();

  for (const group of data) {
    // Insert collection
    const { deities, scripture, title, slokas } = group;
    const collectionRes = await client.query(
      'INSERT INTO collections (deities, scripture, title) VALUES ($1, $2, $3) RETURNING id',
      [deities, scripture, title]
    );
    const collectionId = collectionRes.rows[0].id;

    // Insert slokas
    for (const sloka of slokas) {
      await client.query(
        `INSERT INTO slokas (collection_id, original_text, transliteration, meaning, audio_url)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          collectionId,
          sloka.originalText,
          JSON.stringify(sloka.transliteration),
          JSON.stringify(sloka.meaning),
          sloka.audioUrl
        ]
      );
    }
    console.log(`Migrated collection: ${title} (${slokas.length} slokas)`);
  }

  await client.end();
  console.log('Migration complete!');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
}); 
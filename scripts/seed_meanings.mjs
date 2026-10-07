import fs from 'fs';
import path from 'path';

const PROJECT_ID = 'soundspellquest-ajith0308';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/meanings`;
// Writes need an admin OAuth token (security rules block unauthenticated writes):
//   FIRESTORE_TOKEN=$(gcloud auth print-access-token) node scripts/seed_meanings.mjs
const TOKEN = process.env.FIRESTORE_TOKEN;
if (!TOKEN) {
  console.error('Set FIRESTORE_TOKEN first, e.g. FIRESTORE_TOKEN=$(gcloud auth print-access-token) node scripts/seed_meanings.mjs');
  process.exit(1);
}

// Helper: fetch with timeout
async function fetchWithTimeout(url, opts = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

// Extract words from data.ts
function extractWords() {
  const dataPath = path.resolve('angular/src/app/data.ts');
  const content = fs.readFileSync(dataPath, 'utf-8');
  
  const wordsSet = new Set();
  
  // Extract all quoted strings
  const stringRegex = /"([^"\r\n]+)"|'([^'\r\n]+)'/g;
  let match;
  while ((match = stringRegex.exec(content)) !== null) {
    const str = (match[1] || match[2] || '').trim().toLowerCase();
    // Only pick valid single words (2 to 30 letters, no spaces or special punctuation)
    if (/^[a-z]{2,30}$/.test(str)) {
      wordsSet.add(str);
    }
  }

  return Array.from(wordsSet).sort();
}

// Check if document exists in Firestore
async function getFirestoreMeaning(word) {
  try {
    const res = await fetchWithTimeout(`${FIRESTORE_BASE}/${encodeURIComponent(word)}`);
    if (res.ok) {
      const data = await res.json();
      return data?.fields?.text?.stringValue || null;
    }
  } catch {}
  return null;
}

// Save document to Firestore
async function saveFirestoreMeaning(word, text) {
  try {
    const body = {
      fields: {
        text: { stringValue: text },
        updatedAt: { integerValue: String(Date.now()) }
      }
    };
    const res = await fetchWithTimeout(`${FIRESTORE_BASE}/${encodeURIComponent(word)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify(body)
    });
    return res.ok;
  } catch (e) {
    console.error(`Failed to save to Firestore for ${word}:`, e);
    return false;
  }
}

// Fetch meaning from Dictionary APIs
async function fetchMeaningFromApi(word) {
  // 1. dictionaryapi.dev
  try {
    const res = await fetchWithTimeout(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    if (res.ok) {
      const data = await res.json();
      const def = data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition;
      if (def) return def.trim();
    }
  } catch {}

  // 2. datamuse fallback
  try {
    const res = await fetchWithTimeout(`https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&max=1&md=d`);
    if (res.ok) {
      const data = await res.json();
      const rawDef = data?.[0]?.defs?.[0];
      if (rawDef) {
        const parts = rawDef.split('\t');
        const def = parts.length > 1 ? parts[1] : parts[0];
        if (def) return def.trim();
      }
    }
  } catch {}

  return 'No definition available.';
}

async function main() {
  const words = extractWords();
  console.log(`Found ${words.length} unique target words in data.ts.`);

  let seededCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  const CONCURRENCY = 16;
  for (let i = 0; i < words.length; i += CONCURRENCY) {
    const chunk = words.slice(i, i + CONCURRENCY);
    
    await Promise.all(chunk.map(async (word) => {
      try {
        const existing = await getFirestoreMeaning(word);
        if (existing) {
          skippedCount++;
          return;
        }

        const meaning = await fetchMeaningFromApi(word);
        const ok = await saveFirestoreMeaning(word, meaning);
        if (ok) {
          seededCount++;
          console.log(`[${seededCount + skippedCount}/${words.length}] Saved: "${word}" -> "${meaning.slice(0, 50)}..."`);
        } else {
          errorCount++;
        }
      } catch (err) {
        errorCount++;
        console.error(`Error processing word ${word}:`, err);
      }
    }));
  }

  console.log(`\n🎉 Seeding complete!`);
  console.log(`- Total words processed: ${words.length}`);
  console.log(`- Newly seeded to Firestore: ${seededCount}`);
  console.log(`- Already present in Firestore: ${skippedCount}`);
  console.log(`- Errors: ${errorCount}`);
}

main().catch(console.error);

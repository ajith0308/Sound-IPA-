import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';

/** Word meanings: local cache → shared Firestore cache → public dictionary APIs. */
@Injectable({ providedIn: 'root' })
export class MeaningService {
  private fb = inject(FirebaseService);
  private cache: { [word: string]: string } = {};

  constructor() {
    try { const s = localStorage.getItem('meaning_cache'); if (s) this.cache = JSON.parse(s); } catch {}
  }

  private persist() { try { localStorage.setItem('meaning_cache', JSON.stringify(this.cache)); } catch {} }

  cached(word: string): string { return this.cache[word.trim().toLowerCase()] || ''; }

  async prefetch(words: string[]) {
    if (!words || !words.length) return;
    const uncached = words.map(w => w.trim().toLowerCase()).filter(w => w && !this.cache[w]);
    if (!uncached.length) return;

    const cloudMap = await this.fb.getMeaningsBatchCloud(uncached);
    for (const [w, text] of Object.entries(cloudMap)) this.cache[w] = text;
    this.persist();

    const stillUncached = uncached.filter(w => !this.cache[w]);
    const chunkSize = 5;
    for (let i = 0; i < stillUncached.length; i += chunkSize) {
      const chunk = stillUncached.slice(i, i + chunkSize);
      await Promise.allSettled(chunk.map(w => this.get(w)));
    }
  }

  async get(word: string): Promise<string> {
    const w = word.trim().toLowerCase();
    if (!w) return '';
    if (this.cache[w]) return this.cache[w];

    const cloudDef = await this.fb.getMeaningCloud(w);
    if (cloudDef) { this.cache[w] = cloudDef; this.persist(); return cloudDef; }

    let def = '';
    try {
      const res = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(w));
      if (res.ok) {
        const data = await res.json();
        def = data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition || '';
      }
    } catch {}

    if (!def) {
      try {
        const res = await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(w)}&max=1&md=d`);
        if (res.ok) {
          const data = await res.json();
          const rawDef = data?.[0]?.defs?.[0];
          if (rawDef) { const parts = rawDef.split('\t'); def = parts.length > 1 ? parts[1] : parts[0]; }
        }
      } catch {}
    }

    if (!def) def = 'No meaning found for this word.';
    this.cache[w] = def;
    this.persist();
    await this.fb.saveMeaningCloud(w, def);
    return def;
  }
}

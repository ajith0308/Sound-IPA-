import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SpeechService } from './speech.service';
import { StoreService } from './store.service';

interface Def { pos: string; text: string; }
interface WordItem { word: string; defs: Def[]; open: boolean; loading: boolean; }

const POS: { [k: string]: string } = { n: 'noun', v: 'verb', adj: 'adjective', adv: 'adverb', u: '' };

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="appbar"><a routerLink="/"><button class="sec">← Home</button></a><div class="appbar-title">📖 Dictionary</div></div>
  <div class="card">
    <div class="row">
      <input type="text" [(ngModel)]="query" (keyup.enter)="search()" placeholder="Search any word…" autocomplete="off" spellcheck="false" style="flex:1;min-width:180px">
      <button (click)="search()">🔎 Search</button>
    </div>

    <div class="row" style="flex-wrap:wrap;gap:6px;margin-top:12px">
      @for (l of letters; track l) {
        <button class="sec" [class.on]="activeLetter === l" (click)="browse(l)" style="min-width:38px;padding:8px 0;text-transform:uppercase">{{ l }}</button>
      }
    </div>

    @if (loading) { <p class="note">Fetching words…</p> }
    @if (error) { <p class="note" style="color:#c0392b">{{ error }}</p> }
    @if (!loading && !error && words.length) { <p class="hint" style="margin-top:12px">{{ words.length }} words{{ activeLetter ? ' starting with “' + activeLetter + '”' : '' }} · tap a word to see its meaning</p> }

    <div style="margin-top:8px">
      @for (w of words; track w.word) {
        <div style="border-bottom:1px solid var(--line, #e4dccb);padding:10px 2px">
          <div class="row" style="align-items:center;gap:8px">
            <button class="linklike" (click)="toggle(w)" style="flex:1;text-align:left;font-size:20px;font-weight:bold">
              {{ w.open ? '▾' : '▸' }} {{ w.word }}
            </button>
            <button class="linklike" (click)="sp.say(w.word, { rate: 1 })" title="Say it">🔊</button>
            <button class="linklike" (click)="add(w.word)" title="Add to my words">➕</button>
          </div>
          @if (w.open) {
            <div style="padding:6px 0 4px 16px">
              @if (w.loading) { <span class="hint">Loading meaning…</span> }
              @else if (w.defs.length) {
                <ol style="margin:0;padding-left:20px">
                  @for (d of w.defs; track $index) {
                    <li style="margin-bottom:6px">
                      @if (d.pos) { <em class="hint" style="margin:0">{{ d.pos }} — </em> }
                      <span>{{ d.text }}</span>
                    </li>
                  }
                </ol>
              }
              @else { <span class="hint">No meaning found for this word.</span> }
            </div>
          }
        </div>
      }
    </div>

    @if (!loading && !words.length && !error) {
      <p class="note">Pick a letter above to browse the dictionary, or search for any word. Words and meanings are fetched live from the internet, so you need a connection.</p>
    }
    @if (added) { <p class="note" style="color:#2e7d32">{{ added }}</p> }
  </div>
  `
})
export class DictionaryComponent {
  sp = inject(SpeechService);
  private store = inject(StoreService);
  letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  query = '';
  activeLetter = '';
  words: WordItem[] = [];
  loading = false;
  error = '';
  added = '';

  browse(letter: string) { this.activeLetter = letter; this.query = ''; this.fetchWords(letter); }
  search() {
    const q = this.query.trim().toLowerCase();
    if (!q) { this.error = 'Type a word to search.'; return; }
    this.activeLetter = '';
    this.fetchWords(q);
  }

  private async fetchWords(prefix: string) {
    this.loading = true; this.error = ''; this.added = ''; this.words = [];
    try {
      const url = `https://api.datamuse.com/words?sp=${encodeURIComponent(prefix)}*&max=300&md=d`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('bad');
      const data = await res.json();
      this.words = (Array.isArray(data) ? data : [])
        .filter((w: any) => typeof w.word === 'string' && /^[a-z]+$/.test(w.word))
        .map((w: any) => ({ word: w.word, defs: this.parseDefs(w.defs), open: false, loading: false }));
      if (!this.words.length) this.error = `No words found for “${prefix}”.`;
    } catch {
      this.error = 'Could not reach the dictionary. Check your internet and try again.';
    } finally {
      this.loading = false;
    }
  }

  private parseDefs(defs: any): Def[] {
    if (!Array.isArray(defs)) return [];
    return defs.slice(0, 5).map((d: string) => {
      const i = d.indexOf('\t');
      if (i < 0) return { pos: '', text: d };
      return { pos: POS[d.slice(0, i)] ?? d.slice(0, i), text: d.slice(i + 1) };
    });
  }

  async toggle(w: WordItem) {
    w.open = !w.open;
    if (w.open && w.defs.length) this.sp.say(w.word, { rate: 1 });
    if (w.open && !w.defs.length && !w.loading) {
      w.loading = true;
      try {
        const res = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(w.word));
        if (res.ok) {
          const data = await res.json();
          const out: Def[] = [];
          for (const e of (Array.isArray(data) ? data : [])) {
            for (const m of (e.meanings || [])) {
              for (const d of (m.definitions || []).slice(0, 3)) {
                out.push({ pos: m.partOfSpeech || '', text: d.definition });
              }
            }
          }
          w.defs = out.slice(0, 5);
        }
      } catch {}
      w.loading = false;
      if (w.defs.length) this.sp.say(w.word, { rate: 1 });
    }
  }

  add(word: string) {
    const lists = this.store.get<any>('lists_ng', {});
    const key = 'My Dictionary';
    const arr: string[] = lists[key] || [];
    if (!arr.includes(word)) arr.push(word);
    lists[key] = arr;
    this.store.set('lists_ng', lists);
    this.added = `Added “${word}” to your “My Dictionary” list (${arr.length} words).`;
  }
}

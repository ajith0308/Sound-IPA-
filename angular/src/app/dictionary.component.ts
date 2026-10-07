import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpeechService } from './speech.service';
import { StoreService } from './store.service';
import { UI } from './ui';

interface Def { pos: string; text: string; }
interface WordItem { word: string; defs: Def[]; open: boolean; loading: boolean; }

const POS: { [k: string]: string } = { n: 'noun', v: 'verb', adj: 'adjective', adv: 'adverb', u: '' };

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [FormsModule, ...UI],
  template: `
  <div class="page narrow">
    <ui-page-head title="Dictionary" sub="Look up a word, hear it, and save it to practise" back="/"/>
    <section class="card">
      <form class="row" style="flex-wrap:nowrap" (submit)="$event.preventDefault(); search()">
        <div class="field-wrap" style="flex:1">
          <ui-icon name="search"/>
          <input class="field" type="search" name="q" [(ngModel)]="query" placeholder="Search any word…" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" aria-label="Search">
        </div>
        <button class="btn btn-primary" type="submit" style="height:50px">Search</button>
      </form>

      <div class="az" role="toolbar" aria-label="Browse by letter">
        @for (l of letters; track l) {
          <button [class.on]="activeLetter === l" (click)="browse(l)" [attr.aria-pressed]="activeLetter === l">{{ l }}</button>
        }
      </div>

      @if (added) { <div class="feedback good" style="max-width:none"><ui-icon name="checkCircle"/>{{ added }}</div> }

      @if (loading) {
        <div class="empty"><span class="spinner"></span><div style="margin-top:10px">Fetching words…</div></div>
      } @else if (error) {
        <div class="empty"><span class="ic-tile"><ui-icon name="wifiOff"/></span>{{ error }}</div>
      } @else if (words.length) {
        <p class="muted small" style="margin-top:16px">{{ words.length }} words{{ activeLetter ? ' starting with “' + activeLetter.toUpperCase() + '”' : '' }} · tap a word for its meaning</p>
        <div class="dict-list">
          @for (w of words; track w.word) {
            <div class="dict-item">
              <div class="dict-row">
                <button class="dict-word" [class.open]="w.open" (click)="toggle(w)" [attr.aria-expanded]="w.open"><ui-icon name="chevR"/>{{ w.word }}</button>
                <button class="icon-btn sm" (click)="sp.say(w.word, { rate: 1 })" [attr.aria-label]="'Hear ' + w.word"><ui-icon name="volume"/></button>
                <button class="icon-btn sm" (click)="add(w.word)" [attr.aria-label]="'Add ' + w.word + ' to My Dictionary list'"><ui-icon name="plus"/></button>
              </div>
              @if (w.open) {
                <div class="dict-defs">
                  @if (w.loading) { <span class="muted small">Loading meaning…</span> }
                  @else if (w.defs.length) {
                    <ol>
                      @for (d of w.defs; track $index) { <li>@if (d.pos) { <span class="pos">{{ d.pos }}</span> }{{ d.text }}</li> }
                    </ol>
                  }
                  @else { <span class="muted small">No meaning found for this word.</span> }
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <div class="empty"><span class="ic-tile"><ui-icon name="book"/></span>Pick a letter to browse, or search for any word.<br><span class="small">Meanings are fetched live, so you need an internet connection.</span></div>
      }
    </section>
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
    if (!q) { this.error = 'Type a word to search.'; this.words = []; return; }
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
    this.added = `Added “${word}” to “My Dictionary” (${arr.length} words).`;
  }
}

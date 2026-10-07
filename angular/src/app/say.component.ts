import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpeechService } from './speech.service';
import { UI } from './ui';

@Component({
  selector: 'app-say',
  standalone: true,
  imports: [FormsModule, ...UI],
  template: `
  <div class="page narrow">
    <ui-page-head title="Say a Word" sub="Type any word to hear it and see its sounds" back="/"/>
    <section class="card">
      <div class="field-wrap">
        <ui-icon name="search"/>
        <input class="field" type="text" [(ngModel)]="word" (ngModelChange)="render()" placeholder="Type or paste a word…"
          autocomplete="off" autocapitalize="off" spellcheck="false" (keydown.enter)="sp.say(word.trim(), { rate: 1 })" aria-label="Word">
      </div>
      <div style="text-align:center;padding:40px 0 34px">
        @if (word.trim()) { <div class="segword lg" [innerHTML]="seg"></div> }
        @else { <div class="muted">Your word will appear here, split into its sounds.</div> }
      </div>
      <div class="action-grid">
        <button class="btn btn-primary btn-lg" (click)="sp.say(word.trim(), { rate: 1 })" [disabled]="!word.trim()"><ui-icon name="volume"/>Say it</button>
        <button class="btn btn-secondary btn-lg" (click)="sp.say(word.trim(), { rate: 0.45 })" [disabled]="!word.trim()"><ui-icon name="slow"/>Slowly</button>
        <button class="btn btn-soft btn-lg" (click)="soundOut()" [disabled]="!word.trim()"><ui-icon name="layers"/>Sound it out</button>
        <button class="btn btn-soft btn-lg" (click)="sp.spell(word.trim())" [disabled]="!word.trim()"><ui-icon name="type"/>Spell letters</button>
      </div>
      <p class="note"><b>Sound it out</b> reads each chunk (keeping sh, ai, igh, -tion together), then blends the whole word. <span style="color:var(--vowel);font-weight:600">Orange</span> chunks are vowel sounds.</p>
    </section>
  </div>
  `
})
export class SayComponent {
  word = 'beautiful';
  seg = '';
  constructor(public sp: SpeechService) { this.render(); }
  render() { this.seg = this.sp.segHtml(this.word.trim()); }
  soundOut() { const w = this.word.trim(); if (w && !/\s/.test(w)) this.sp.soundOut(w, i => this.seg = this.sp.segHtml(w, i)); }
}

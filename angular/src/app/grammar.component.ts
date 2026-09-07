import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SpeechService } from './speech.service';
import { GRAMMAR, GQ } from './data';

@Component({
  selector: 'app-grammar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="appbar"><a routerLink="/"><button class="sec">← Home</button></a><div class="appbar-title">🧩 Grammar</div></div>
  <div class="card">
    <div class="row" style="justify-content:space-between">
      <span class="hint" style="margin:0">Score {{ right }} / {{ total }}</span>
      <select [(ngModel)]="topic" (ngModelChange)="start()">
        @for (t of topics; track t) { <option [value]="t">{{ t }}</option> }
      </select>
    </div>
    @if (!done) {
      <div class="hint" style="font-weight:bold;color:var(--accent)">Question {{ idx + 1 }} of {{ total }}</div>
      <div style="font-size:22px;margin:14px 0;line-height:1.5">{{ q[0] }}</div>
      <div class="gropts">
        @for (o of q[1]; track $index) {
          <button class="gropt" [class.good]="answered && $index === q[2]" [class.bad]="answered && $index === chosen && $index !== q[2]"
                  [disabled]="answered" (click)="pick($index)">{{ o }}</button>
        }
      </div>
      <div class="big-fb" [innerHTML]="fb"></div>
      <div class="hint" style="font-size:15px">{{ why }}</div>
      @if (answered) { <div class="row" style="margin-top:14px"><button (click)="nextQ()">Next →</button></div> }
    } @else {
      <div style="text-align:center;padding:10px">
        <div style="font-size:52px">🎉</div>
        <div class="reveal">You scored {{ right }} / {{ total }} ({{ pct }}%)</div>
        <div class="row" style="justify-content:center;margin-top:14px"><button (click)="start()">🔁 Practise again</button></div>
      </div>
    }
  </div>
  `
})
export class GrammarComponent {
  topics: string[] = ['All', ...Array.from(new Set(GRAMMAR.map(q => q[4])))];
  topic = 'All';
  list: GQ[] = []; idx = 0; right = 0; total = 0; answered = false; chosen = -1; fb = ''; why = ''; done = false; pct = 0;
  constructor(private sp: SpeechService) { this.start(); }
  private shuffle<T>(a: T[]) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  get q(): GQ { return this.list[this.idx] || GRAMMAR[0]; }
  start() {
    const pool = GRAMMAR.filter(q => this.topic === 'All' || q[4] === this.topic);
    this.list = this.shuffle(pool); this.idx = 0; this.right = 0; this.total = this.list.length;
    this.done = false; this.answered = false; this.fb = ''; this.why = '';
  }
  pick(i: number) {
    if (this.answered) return; this.answered = true; this.chosen = i;
    if (i === this.q[2]) { this.right++; this.fb = '<span class="good">✓ Correct!</span>'; this.sp.sfxCorrect(); }
    else { this.fb = '<span class="bad">✗ Not quite.</span>'; this.sp.sfxWrong(); }
    this.why = '💡 ' + this.q[3];
  }
  nextQ() {
    this.answered = false; this.chosen = -1; this.fb = ''; this.why = '';
    if (this.idx < this.list.length - 1) this.idx++; else { this.pct = this.total ? Math.round(this.right / this.total * 100) : 0; if (this.pct >= 70) this.sp.sfxFanfare(); this.done = true; }
  }
}

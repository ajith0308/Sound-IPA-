import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { StoreService } from './store.service';
import { SpeechService } from './speech.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="appbar"><a routerLink="/"><button class="sec">← Home</button></a><div class="appbar-title">✏️ Spelling Test</div></div>
  <div class="card">
    @if (!finished) {
      <div class="row" style="justify-content:space-between">
        <span class="hint" style="margin:0">Score {{ right }} / {{ total }}</span>
        <select [(ngModel)]="listName" (ngModelChange)="start()">
          @for (n of listNames; track n) { <option [value]="n">{{ n }}</option> }
        </select>
      </div>
      <div class="hint" style="font-weight:bold;color:var(--accent)">Word {{ idx + 1 }} of {{ total }}</div>
      <div class="row" style="margin-top:12px">
        <button class="big" (click)="hear()">🔊 Hear the word</button>
        <button class="sec" (click)="hear(0.45)">🐢 Slowly</button>
      </div>
      <input type="text" [(ngModel)]="answer" (keydown.enter)="check()" [disabled]="answered" placeholder="Type what you hear…" style="margin-top:14px" autocomplete="off">
      <div class="row" style="margin-top:12px">
        <button (click)="check()" [disabled]="answered">Check</button>
        <button class="sec" (click)="reveal()" [disabled]="answered">Show answer</button>
        <button class="sec" (click)="next()">{{ answered ? 'Next →' : 'Skip →' }}</button>
      </div>
      <div class="big-fb" [innerHTML]="fb"></div>
      <div class="reveal" [innerHTML]="ans"></div>
    } @else {
      <div style="text-align:center">
        <div style="font-size:56px">{{ emoji }}</div>
        <h2>{{ title }}</h2>
        <div class="reveal">{{ right }} / {{ total }} correct ({{ pct }}%)</div>
        <div class="hint">+{{ gained }} XP this session</div>
        <div class="row" style="justify-content:center;margin-top:16px">
          <button (click)="start()">🔁 Try again</button>
          <a routerLink="/"><button class="sec">🏠 Home</button></a>
        </div>
      </div>
    }
  </div>
  `
})
export class TestComponent {
  listNames: string[] = [];
  listName = '';
  words: string[] = []; idx = 0; right = 0; total = 0;
  answer = ''; answered = false; gotIt = false; fb = ''; ans = '';
  finished = false; pct = 0; gained = 0; emoji = '🎉'; title = ''; startXp = 0;
  day: number | null = null;
  pending: { name: string; words: string[]; day: number | null } | null = null;

  constructor(public store: StoreService, private sp: SpeechService, private route: ActivatedRoute) {
    const lists = this.store.allLists(); this.listNames = Object.keys(lists);
    this.pending = this.store.pendingTest; this.store.pendingTest = null;
    if (this.pending) { this.listName = this.pending.name; if (!this.listNames.includes(this.listName)) this.listNames = [this.listName, ...this.listNames]; }
    else { const q = this.route.snapshot.queryParamMap.get('list'); this.listName = (q && this.listNames.includes(q)) ? q : this.listNames[0]; }
    this.start();
  }
  private shuffle(a: string[]) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  start() {
    const src = (this.pending && this.pending.name === this.listName) ? this.pending.words : (this.store.allLists()[this.listName] || []);
    this.day = (this.pending && this.pending.name === this.listName) ? this.pending.day : null;
    this.words = this.shuffle(src); this.total = this.words.length;
    this.idx = 0; this.right = 0; this.finished = false; this.startXp = this.store.G.xp;
    if (this.total) { this.store.touchStreak(); this.show(); }
  }
  show() { this.answered = false; this.gotIt = false; this.answer = ''; this.fb = ''; this.ans = ''; this.hear(); }
  hear(rate?: number) { if (this.words[this.idx]) this.sp.say(this.words[this.idx], { rate: rate ?? Math.min(1, this.sp.rate + 0.05) }); }
  check() {
    if (!this.total || this.answered) return;
    const a = (this.words[this.idx] || '').trim(); const got = this.answer.trim();
    if (!got) return;
    if (got.toLowerCase() === a.toLowerCase()) {
      if (!this.answered) { this.answered = true; this.right++; this.store.G.correct++; this.store.awardXP(10); }
      this.gotIt = true; this.sp.sfxCorrect(); this.fb = '<span class="good">✓ Correct! +10 XP</span>';
      setTimeout(() => this.next(), 850);
    } else { this.sp.sfxWrong(); this.fb = '<span class="bad">✗ Try again, or Show answer.</span>'; }
  }
  reveal() { const a = this.words[this.idx]; if (!a) return; this.answered = true; this.ans = this.sp.segHtml(a); this.sp.say(a, { rate: 0.5 }); }
  next() {
    const w = this.words[this.idx];
    if (w != null) { this.store.G.attempts++; if (!this.gotIt) this.store.G.wrongWords[w] = (this.store.G.wrongWords[w] || 0) + 1; }
    this.answered = true; this.idx++;
    if (this.idx >= this.total) this.finish(); else this.show();
  }
  finish() {
    this.pct = this.total ? Math.round(this.right / this.total * 100) : 0;
    this.store.G.history.push({ t: Date.now(), name: this.listName, day: null, pct: this.pct, right: this.right, total: this.total });
    if (this.store.G.history.length > 200) this.store.G.history = this.store.G.history.slice(-200);
    if (this.pct === 100 && this.total >= 5) this.store.unlock('perfect');
    if (this.day != null) {
      const nextI = this.day + 1; const wasLocked = !this.store.dayUnlocked(nextI);
      const stars = this.store.setDayResult(this.day, this.pct); if (stars) this.store.awardXP(stars * 15);
      if (wasLocked && this.store.dayUnlocked(nextI)) this.store.toast('🔓 Day ' + (nextI + 1) + ' unlocked!');
      else if (this.pct < 89) this.store.toast('Score 89%+ to unlock Day ' + (nextI + 1));
    }
    this.store.save();
    this.gained = this.store.G.xp - this.startXp;
    this.emoji = this.pct >= 90 ? '🏆' : this.pct >= 70 ? '🎉' : this.pct >= 50 ? '👍' : '💪';
    this.title = this.pct >= 90 ? 'Amazing!' : this.pct >= 70 ? 'Well done!' : this.pct >= 50 ? 'Good effort!' : 'Keep practising!';
    if (this.pct >= 70) this.sp.sfxFanfare(); else this.sp.sfxCorrect();
    this.finished = true;
  }
}

import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { StoreService } from './store.service';
import { SpeechService } from './speech.service';
import { MeaningService } from './meaning.service';
import { UI } from './ui';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [FormsModule, RouterLink, ...UI],
  template: `
  <div class="page narrow">
    <ui-page-head title="Spelling Test" [sub]="day != null ? 'Score 89% or more to unlock the next day' : 'Listen carefully, then type the word'"/>

    @if (!finished) {
      <div class="toolbar">
        <select class="select" [(ngModel)]="listName" (ngModelChange)="start()" aria-label="Word list">
          @for (n of listNames; track n) { <option [value]="n">{{ n }}</option> }
        </select>
      </div>

      @if (!total) {
        <section class="card empty">
          <span class="ic-tile"><ui-icon name="list"/></span>
          <p>This list has no words yet.</p>
          <a routerLink="/lists" class="btn btn-soft" style="margin-top:14px">Edit word lists</a>
        </section>
      } @else {
        <section class="card quiz-card">
          <div class="quiz-top">
            <span class="count">{{ idx + 1 }} / {{ total }}</span>
            <div class="progress"><i [style.width.%]="idx / total * 100"></i></div>
            <span class="chip success" title="Correct so far"><ui-icon name="check"/>{{ right }}</span>
          </div>

          <div class="quiz-body">
            <button class="play" [class.playing]="playing" (click)="hear()" aria-label="Hear the word"><ui-icon name="volume"/></button>
            <p class="play-hint">Tap to hear the word again</p>
            <div class="aux-row">
              <button class="btn btn-soft btn-sm" (click)="hear(0.45)"><ui-icon name="slow"/>Slowly</button>
              <button class="btn btn-soft btn-sm" (click)="readMeaning()" [disabled]="loadingMeaning">
                @if (loadingMeaning) { <span class="spinner"></span> } @else { <ui-icon name="book"/> } Meaning
              </button>
            </div>

            @if (sMeaning) {
              <div class="meaning"><div class="eyebrow"><ui-icon name="bulb"/>Meaning</div><p>{{ sMeaning }}</p></div>
            }

            <input #inp class="answer" type="text" [(ngModel)]="answer" (ngModelChange)="onType()" (keydown.enter)="answered ? next() : check()"
              [readonly]="answered" [class.is-good]="state === 'good'" [class.is-bad]="state === 'bad'"
              placeholder="Type what you hear" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go" aria-label="Your spelling">

            @if (state === 'good') { <div class="feedback good"><ui-icon name="checkCircle"/>Correct! +10 XP</div> }
            @if (state === 'bad') { <div class="feedback bad"><ui-icon name="xCircle"/>Not quite — listen again and have another go.</div> }

            @if (ans) {
              <div class="reveal-box"><div class="eyebrow">The answer is</div><div class="segword md" [innerHTML]="ans"></div></div>
            }

            <div class="quiz-actions">
              @if (!answered) {
                <button class="btn btn-primary btn-lg btn-block" (click)="check()" [disabled]="!answer.trim()">Check</button>
                <div class="sub">
                  <button class="btn btn-ghost" (click)="reveal()"><ui-icon name="eye"/>Show answer</button>
                  <button class="btn btn-ghost" (click)="next()">Skip<ui-icon name="skip"/></button>
                </div>
              } @else {
                <button class="btn btn-primary btn-lg btn-block" (click)="next()">{{ idx + 1 >= total ? 'See results' : 'Next word' }}<ui-icon name="arrow"/></button>
              }
            </div>
          </div>
        </section>
      }
    } @else {
      <section class="card result">
        <ui-ring [size]="148" [stroke]="12" [value]="pct" [color]="ringColor">
          <div><div style="font-size:36px;font-weight:700;letter-spacing:-.02em">{{ pct }}%</div><div class="muted small">score</div></div>
        </ui-ring>
        <h2>{{ title }}</h2>
        <p>{{ listName }}</p>
        @if (day != null) {
          <div style="margin-top:12px"><ui-stars [n]="stars"/></div>
        }
        <div class="result-stats">
          <div class="mini-stat"><div class="v" style="justify-content:center;color:var(--success)">{{ right }}</div><div class="k">Correct</div></div>
          <div class="mini-stat"><div class="v" style="justify-content:center;color:var(--danger)">{{ total - right }}</div><div class="k">To review</div></div>
          <div class="mini-stat"><div class="v" style="justify-content:center;color:var(--primary)">+{{ gained }}</div><div class="k">XP earned</div></div>
        </div>
        <div class="result-actions">
          <button class="btn btn-secondary btn-lg" (click)="start()"><ui-icon name="retry"/>Try again</button>
          @if (day != null) { <a routerLink="/quest" class="btn btn-primary btn-lg">Back to quest<ui-icon name="arrow"/></a> }
          @else { <a routerLink="/" class="btn btn-primary btn-lg">Done<ui-icon name="check"/></a> }
        </div>
      </section>
    }
  </div>
  `
})
export class TestComponent {
  store = inject(StoreService);
  private sp = inject(SpeechService);
  private meanings = inject(MeaningService);
  private route = inject(ActivatedRoute);
  @ViewChild('inp') inp?: ElementRef<HTMLInputElement>;

  listNames: string[] = [];
  listName = '';
  words: string[] = []; idx = 0; right = 0; total = 0;
  answer = ''; answered = false; gotIt = false; state: '' | 'good' | 'bad' = ''; ans = '';
  finished = false; pct = 0; gained = 0; title = ''; startXp = 0; stars = 0;
  day: number | null = null;
  pending: { name: string; words: string[]; day: number | null } | null = null;
  playing = false;
  sMeaning = ''; loadingMeaning = false;
  private advanceTimer: any = null;
  private playToken = 0;

  constructor() {
    const lists = this.store.allLists(); this.listNames = Object.keys(lists);
    this.pending = this.store.pendingTest; this.store.pendingTest = null;
    if (this.pending) { this.listName = this.pending.name; if (!this.listNames.includes(this.listName)) this.listNames = [this.listName, ...this.listNames]; }
    else { const q = this.route.snapshot.queryParamMap.get('list'); this.listName = (q && this.listNames.includes(q)) ? q : this.listNames[0]; }
    this.start();
  }

  get ringColor() { return this.pct >= 90 ? 'var(--success)' : this.pct >= 70 ? 'var(--primary)' : this.pct >= 50 ? 'var(--warn)' : 'var(--danger)'; }

  async readMeaning() {
    const w = this.words[this.idx] || '';
    if (!w.trim()) return;
    const cached = this.meanings.cached(w);
    if (cached) { this.sMeaning = cached; this.sp.say(cached); return; }
    this.loadingMeaning = true;
    this.sMeaning = await this.meanings.get(w);
    this.loadingMeaning = false;
    if (this.sMeaning) this.sp.say(this.sMeaning);
  }

  private shuffle(a: string[]) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  start() {
    clearTimeout(this.advanceTimer);
    const src = (this.pending && this.pending.name === this.listName) ? this.pending.words : (this.store.allLists()[this.listName] || []);
    this.day = (this.pending && this.pending.name === this.listName) ? this.pending.day : null;
    this.words = this.shuffle(src); this.total = this.words.length;
    this.idx = 0; this.right = 0; this.finished = false; this.startXp = this.store.G.xp; this.stars = 0;
    if (this.total) {
      // deferred: start() runs during construction, and the shell's streak chip has already been rendered this cycle
      Promise.resolve().then(() => this.store.touchStreak());
      this.show();
      this.meanings.prefetch(this.words);
    }
  }

  show() {
    this.answered = false; this.gotIt = false; this.answer = ''; this.state = ''; this.ans = '';
    this.sMeaning = ''; this.loadingMeaning = false;
    this.hear();
    // keep the cursor in the answer box on keyboard devices; on phones this would cover the screen with the keyboard
    if (matchMedia('(hover: hover)').matches) setTimeout(() => this.inp?.nativeElement.focus(), 0);
  }

  hear(rate?: number) {
    const w = this.words[this.idx];
    if (!w) return;
    const my = ++this.playToken;
    this.playing = true;
    const stop = () => { if (my === this.playToken) this.playing = false; };
    this.sp.say(w, { rate: rate ?? Math.min(1, this.sp.rate + 0.05) }).then(stop, stop);
    setTimeout(stop, 6000);
  }

  onType() { if (this.state === 'bad') this.state = ''; }

  check() {
    if (!this.total || this.answered) return;
    const a = (this.words[this.idx] || '').trim(); const got = this.answer.trim();
    if (!got) return;
    if (got.toLowerCase() === a.toLowerCase()) {
      this.answered = true; this.right++; this.store.G.correct++; this.store.awardXP(10);
      this.gotIt = true; this.sp.sfxCorrect(); this.state = 'good';
      this.advanceTimer = setTimeout(() => this.next(), 900);
    } else { this.sp.sfxWrong(); this.state = 'bad'; }
  }

  reveal() { const a = this.words[this.idx]; if (!a) return; this.answered = true; this.state = ''; this.ans = this.sp.segHtml(a); this.sp.say(a, { rate: 0.5 }); }

  next() {
    clearTimeout(this.advanceTimer);
    if (this.finished) return;
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
      this.stars = stars;
      if (wasLocked && this.store.dayUnlocked(nextI)) this.store.toast('🔓 Day ' + (nextI + 1) + ' unlocked!');
      else if (this.pct < 89) this.store.toast('Score 89%+ to unlock Day ' + (nextI + 1));
    }
    this.store.save();
    this.gained = this.store.G.xp - this.startXp;
    this.title = this.pct >= 90 ? 'Amazing work!' : this.pct >= 70 ? 'Well done!' : this.pct >= 50 ? 'Good effort!' : 'Keep practising!';
    if (this.pct >= 70) this.sp.sfxFanfare(); else this.sp.sfxCorrect();
    this.finished = true;
  }
}

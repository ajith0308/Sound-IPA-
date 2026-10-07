import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService, BADGES } from './store.service';
import { SpeechService } from './speech.service';
import { MeaningService } from './meaning.service';
import { LESSONS } from './data';
import { UI } from './ui';

@Component({
  selector: 'app-quest',
  standalone: true,
  imports: [...UI],
  template: `
  <div class="page">
    <ui-page-head title="30-Day Quest" [sub]="doneCount + ' of ' + LESSONS.length + ' days complete · score 89% to unlock the next day'"/>

    <div class="quest-grid">
      <div class="stack">
        @if (!studyOn) {
          <section class="card lesson">
            <div class="lesson-nav">
              <button class="icon-btn bordered sm" (click)="go(idx - 1)" [disabled]="idx === 0" aria-label="Previous day"><ui-icon name="chevL"/></button>
              <div style="text-align:center">
                <div class="eyebrow">Day {{ idx + 1 }} of {{ LESSONS.length }}</div>
                <div style="margin-top:4px"><ui-stars [n]="starCount(idx)"/></div>
              </div>
              <button class="icon-btn bordered sm" (click)="next()" [disabled]="idx >= LESSONS.length - 1" aria-label="Next day"><ui-icon name="chevR"/></button>
            </div>
            <h2>{{ L[0] }}</h2>
            <p class="desc">{{ L[1] }}</p>
            <div class="meta">
              <span class="chip primary"><ui-icon name="list"/>{{ L[2].length }} words</span>
              @if (best(idx) != null) { <span class="chip success"><ui-icon name="target"/>Best {{ best(idx) }}%</span> }
              @if (done(idx)) { <span class="chip success"><ui-icon name="check"/>Completed</span> }
            </div>
            <div class="cta">
              <button class="btn btn-secondary btn-lg" (click)="startStudy()"><ui-icon name="play"/>Practise</button>
              <button class="btn btn-primary btn-lg" (click)="startTest()"><ui-icon name="pencil"/>Take test</button>
            </div>
            <div class="word-preview">
              @for (w of L[2].slice(0, previewCount); track $index) { <button class="chip" (click)="sp.say(w, { rate: 1 })">{{ w }}</button> }
              @if (L[2].length > previewCount) { <span class="chip">+{{ L[2].length - previewCount }} more</span> }
            </div>
          </section>
        } @else {
          <section class="card study">
            <div class="study-top">
              <span class="count small muted" style="font-weight:600">{{ sIdx + 1 }} / {{ L[2].length }}</span>
              <div class="progress"><i [style.width.%]="(sIdx + 1) / L[2].length * 100"></i></div>
              <button class="icon-btn sm" (click)="studyOn = false" aria-label="Close practice"><ui-icon name="x"/></button>
            </div>
            <div class="eyebrow" style="margin-top:8px">Day {{ idx + 1 }} · {{ L[0] }}</div>
            <div class="study-word"><div class="segword lg" [innerHTML]="sSeg"></div></div>
            <div class="study-actions">
              <button class="btn btn-primary" (click)="sp.say(sWord, { rate: 1 })"><ui-icon name="volume"/>Hear it</button>
              @if (!multiWord) { <button class="btn btn-soft" (click)="sSound()"><ui-icon name="layers"/>Sound it out</button> }
              <button class="btn btn-soft" (click)="readMeaning()" [disabled]="loadingMeaning">
                @if (loadingMeaning) { <span class="spinner"></span> } @else { <ui-icon name="book"/> } Meaning
              </button>
            </div>
            @if (sMeaning) {
              <div class="meaning" style="margin-left:auto;margin-right:auto"><div class="eyebrow"><ui-icon name="bulb"/>Meaning</div><p>{{ sMeaning }}</p></div>
            }
            <div class="study-nav">
              <button class="btn btn-secondary btn-lg" (click)="sPrev()" [disabled]="sIdx === 0"><ui-icon name="chevL"/>Back</button>
              @if (sIdx < L[2].length - 1) {
                <button class="btn btn-primary btn-lg" (click)="sNext()">Next<ui-icon name="chevR"/></button>
              } @else {
                <button class="btn btn-primary btn-lg" (click)="startTest()">Start test<ui-icon name="pencil"/></button>
              }
            </div>
            @if (sIdx < L[2].length - 1) {
              <button class="btn btn-ghost btn-block" style="margin-top:8px" (click)="startTest()">I'm ready — start the test</button>
            }
          </section>
        }
      </div>

      <div class="stack">
        <section class="card">
          <div class="card-head"><h2>Your journey</h2><span class="chip primary">{{ doneCount }}/{{ LESSONS.length }}</span></div>
          <div class="journey">
            @for (l of LESSONS; track $index) {
              <button class="jnode" [class.done]="done($index)" [class.current]="$index === idx" [class.locked]="!store.dayUnlocked($index)"
                      [title]="'Day ' + ($index + 1) + ': ' + l[0]" (click)="tile($index)">
                @if (store.dayUnlocked($index)) {
                  <span>{{ $index + 1 }}</span>
                  <span class="st">{{ starText($index) }}</span>
                } @else { <ui-icon name="lock"/> }
              </button>
            }
          </div>
        </section>

        <section class="card">
          <div class="card-head"><h2>Badges</h2><span class="chip warn">{{ badgeCount }}/{{ BADGES.length }}</span></div>
          <div class="badge-grid">
            @for (b of BADGES; track b[0]) {
              <div class="badge" [class.got]="store.G.badges[b[0]]" [class.locked]="!store.G.badges[b[0]]" [title]="b[3]">
                <span class="em">{{ b[1] }}</span>{{ b[2] }}
              </div>
            }
          </div>
        </section>
      </div>
    </div>
  </div>
  `
})
export class QuestComponent {
  store = inject(StoreService);
  sp = inject(SpeechService);
  private meanings = inject(MeaningService);
  private router = inject(Router);
  LESSONS = LESSONS; BADGES = BADGES;
  idx = Math.min(this.store.get('planDay', 0), this.store.maxUnlockedDay());
  studyOn = false; sIdx = 0; sSeg = '';
  sMeaning = ''; loadingMeaning = false;
  previewCount = 14;

  constructor() { this.meanings.prefetch(this.L[2]); }

  done(i: number) { return !!this.store.G.days[i]?.completed; }
  best(i: number) { const d = this.store.G.days[i]; return d ? d.best : null; }
  starCount(i: number) { return this.store.G.days[i]?.stars || 0; }
  starText(i: number) { return '★'.repeat(this.starCount(i)); }
  get L() { return LESSONS[this.idx]; }
  get doneCount() { return Object.values(this.store.G.days).filter(d => d.completed).length; }
  get badgeCount() { return BADGES.filter(b => this.store.G.badges[b[0]]).length; }
  get sWord() { return this.L[2][this.sIdx] || ''; }
  get multiWord() { return /\s/.test(this.sWord); }

  go(i: number) {
    i = Math.max(0, Math.min(this.store.maxUnlockedDay(), i));
    this.idx = i;
    this.studyOn = false;
    this.store.set('planDay', i);
    this.meanings.prefetch(this.L[2]);
  }
  next() { const n = this.idx + 1; if (n <= this.store.maxUnlockedDay()) this.go(n); else this.store.toast('Score 89%+ to unlock the next day.'); }
  tile(i: number) { if (this.store.dayUnlocked(i)) this.go(i); else this.store.toast('Finish the earlier days (89%+) to unlock this one.'); }

  startStudy() {
    this.studyOn = true;
    this.sIdx = 0;
    this.store.touchStreak();
    this.showStudy();
    this.meanings.prefetch(this.L[2]);
  }
  showStudy() {
    this.sMeaning = ''; this.loadingMeaning = false;
    const w = this.sWord;
    this.sSeg = this.multiWord ? `<span style="font-size:.6em">${w}</span>` : this.sp.segHtml(w);
    this.sp.say(w, { rate: 1 });
  }
  sPrev() { if (this.sIdx > 0) { this.sIdx--; this.showStudy(); } }
  sNext() { if (this.sIdx < this.L[2].length - 1) { this.sIdx++; this.showStudy(); } else this.startTest(); }
  sSound() { const w = this.sWord; if (w && !this.multiWord) this.sp.soundOut(w, i => this.sSeg = this.sp.segHtml(w, i)); }

  async readMeaning() {
    const w = this.sWord;
    if (!w.trim()) return;
    const cached = this.meanings.cached(w);
    if (cached) { this.sMeaning = cached; this.sp.say(cached); return; }
    this.loadingMeaning = true;
    this.sMeaning = await this.meanings.get(w);
    this.loadingMeaning = false;
    if (this.sMeaning) this.sp.say(this.sMeaning);
  }

  startTest() {
    this.store.pendingTest = { name: `Day ${this.idx + 1} — ${this.L[0]}`, words: this.L[2], day: this.idx };
    this.router.navigate(['/test']);
  }
}

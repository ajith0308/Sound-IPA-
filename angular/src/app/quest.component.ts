import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { StoreService, BADGES } from './store.service';
import { SpeechService } from './speech.service';
import { LESSONS } from './data';

@Component({
  selector: 'app-quest',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="appbar"><a routerLink="/"><button class="sec">← Home</button></a><div class="appbar-title">🗺️ 30-Day Quest</div></div>

  <div class="card badges-card">
    <div class="grp-title">🏅 Badges</div>
    <div class="badges">
      @for (b of BADGES; track b[0]) {
        <div class="badge" [class.locked]="!store.G.badges[b[0]]" [title]="b[3]">{{ b[1] }} {{ b[2] }}</div>
      }
    </div>
  </div>

  <div class="plan-layout">
    <div class="plan-main">
      <div class="card">
        <div class="row daynav">
          <button class="sec" (click)="go(idx-1)">◀ Prev</button>
          <select class="daysel" [(ngModel)]="idx" (ngModelChange)="onSelect()">
            @for (l of LESSONS; track $index) {
              <option [ngValue]="$index" [disabled]="!store.dayUnlocked($index)">{{ store.dayUnlocked($index) ? '' : '🔒 ' }}Day {{ $index+1 }} — {{ l[0] }}</option>
            }
          </select>
          <button class="sec" (click)="next()">Next ▶</button>
        </div>
        <h2>Day {{ idx+1 }}: {{ L[0] }}</h2>
        <p class="hint" style="font-size:16px">{{ L[1] }}</p>
        <p class="hint"><span class="stepnum">{{ L[2].length }} words</span> &nbsp;
          <span style="color:var(--gold)">{{ stars }}</span> &nbsp; Practise first, then take the test (89%+ unlocks the next day).</p>
        <div class="row" style="margin-top:6px">
          <button class="big" (click)="startStudy()">▶ 1. Practice</button>
          <button class="big sec" (click)="startTest()">✏️ 2. Test</button>
        </div>
        <div class="words" style="font-size:18px;margin-top:16px;line-height:2.1">
          @for (w of L[2]; track $index) { <b (click)="sp.say(w, { rate: 1 })">{{ w }}</b> }
        </div>
      </div>

      @if (studyOn) {
        <div class="card" style="text-align:center">
          <div class="hint">Word {{ sIdx+1 }} of {{ L[2].length }}</div>
          <div class="segbox lg" [innerHTML]="sSeg"></div>
          <div class="row" style="justify-content:center">
            <button class="big" (click)="sp.say(sWord, { rate: 1 })">🔊 Hear</button>
            <button class="sec" (click)="sSound()">Sound it out</button>
            <button class="sec" (click)="sp.spell(sWord)">Spell</button>
          </div>
          <div class="row" style="justify-content:space-between;margin-top:16px">
            <button class="sec" (click)="sPrev()">◀ Back</button>
            <button class="sec" (click)="studyOn=false">Close</button>
            <button (click)="sNext()">Next ▶</button>
          </div>
          <div class="row" style="justify-content:center;margin-top:14px">
            <button class="big" (click)="startTest()">Done studying — start Test ✏️</button>
          </div>
        </div>
      }
    </div>

    <div class="plan-side">
      <div class="card">
        <div class="grp-title">🗺️ Your journey — {{ doneCount }} / {{ LESSONS.length }} days done</div>
        <div class="journey">
          @for (l of LESSONS; track $index) {
            <div class="jtile" [class.done]="done($index)" [class.current]="$index===idx" [class.locked]="!store.dayUnlocked($index)"
                 [title]="l[0]" (click)="tile($index)">
              <div class="jday">Day {{ $index+1 }}{{ store.dayUnlocked($index) ? '' : ' 🔒' }}</div>
              <div class="jstars">{{ starsFor($index) }}</div>
            </div>
          }
        </div>
      </div>
    </div>
  </div>
  `
})
export class QuestComponent {
  store = inject(StoreService);
  sp = inject(SpeechService);
  private router = inject(Router);
  LESSONS = LESSONS; BADGES = BADGES;
  idx = Math.min(this.store.get('planDay', 0), this.store.maxUnlockedDay());
  studyOn = false; sIdx = 0; sSeg = '';
  done(i: number) { return !!this.store.G.days[i]?.completed; }
  get L() { return LESSONS[this.idx]; }
  get stars() { const s = this.store.G.days[this.idx]?.stars || 0; return '★'.repeat(s) + '☆'.repeat(3 - s); }
  get doneCount() { return Object.values(this.store.G.days).filter(d => d.completed).length; }
  get sWord() { return this.L[2][this.sIdx] || ''; }
  starsFor(i: number) { const s = this.store.G.days[i]?.stars || 0; return '★'.repeat(s) + '☆'.repeat(3 - s); }
  go(i: number) { i = Math.max(0, Math.min(this.store.maxUnlockedDay(), i)); this.idx = i; this.studyOn = false; this.store.set('planDay', i); }
  onSelect() { if (!this.store.dayUnlocked(this.idx)) this.idx = this.store.maxUnlockedDay(); this.go(this.idx); }
  next() { const n = this.idx + 1; if (n <= this.store.maxUnlockedDay()) this.go(n); else this.store.toast('Score 89%+ to unlock the next day.'); }
  tile(i: number) { if (this.store.dayUnlocked(i)) this.go(i); else this.store.toast('Finish the earlier days (89%+) to unlock this one.'); }
  startStudy() { this.studyOn = true; this.sIdx = 0; this.store.touchStreak(); this.showStudy(); }
  showStudy() { const w = this.sWord; this.sSeg = /\s/.test(w) ? `<span style="font-size:22px">${w}</span>` : this.sp.segHtml(w); this.sp.say(w, { rate: 1 }); }
  sPrev() { if (this.sIdx > 0) { this.sIdx--; this.showStudy(); } }
  sNext() { if (this.sIdx < this.L[2].length - 1) { this.sIdx++; this.showStudy(); } else this.startTest(); }
  sSound() { const w = this.sWord; if (w && !/\s/.test(w)) this.sp.soundOut(w, i => this.sSeg = this.sp.segHtml(w, i)); }
  startTest() {
    this.store.pendingTest = { name: `Day ${this.idx + 1} — ${this.L[0]}`, words: this.L[2], day: this.idx };
    this.router.navigate(['/test']);
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { StoreService } from './store.service';
import { SpeechService } from './speech.service';
import { LESSONS } from './data';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="appbar"><a routerLink="/"><button class="sec">← Home</button></a><div class="appbar-title">📈 My Progress</div></div>

  <div class="card">
    <div class="grp-title">Overall</div>
    <div class="statgrid">
      <div class="stat"><div class="stat-v">{{ store.level }}</div><div class="stat-k">⭐ Level</div></div>
      <div class="stat"><div class="stat-v">{{ store.G.correct }}</div><div class="stat-k">✅ Words correct</div></div>
      <div class="stat"><div class="stat-v">{{ acc.acc == null ? '—' : acc.acc + '%' }}</div><div class="stat-k">🎯 Accuracy</div></div>
      <div class="stat"><div class="stat-v">{{ store.G.history.length }}</div><div class="stat-k">✏️ Tests taken</div></div>
      <div class="stat"><div class="stat-v">{{ store.G.streak }}</div><div class="stat-k">🔥 Streak</div></div>
      <div class="stat"><div class="stat-v">{{ daysDone }} / 30</div><div class="stat-k">🗺️ Days done</div></div>
    </div>
    <div class="pbig"><div class="pbig-fill" [style.width.%]="acc.acc || 0"></div></div>
    <div class="hint">{{ acc.acc == null ? 'Take a test to start tracking your accuracy.' : 'Overall spelling accuracy: ' + acc.acc + '% — ' + acc.right + ' correct of ' + acc.total + ' across your tests.' }}</div>
  </div>

  <div class="card">
    <div class="grp-title">⏱️ Time on task (active screen time)</div>
    <div class="statgrid">
      @for (b of timeBuckets; track b[0]) { <div class="stat"><div class="stat-v">{{ b[1] }}</div><div class="stat-k">{{ b[0] }}</div></div> }
    </div>
    <div class="trend">
      @for (d of last14; track d.k) {
        <div class="barcol"><div class="barlabel">{{ d.lab }}</div>
          <div class="bar" [style.height.%]="d.h" [style.background]="d.sec ? 'var(--accent)' : 'var(--line)'"></div>
          <div class="barlabel" style="margin:4px 0 0">{{ d.day }}</div>
        </div>
      }
    </div>
    <p class="hint">Counts only while the app is open and in use — other tabs / idle are not included.</p>
  </div>

  <div class="card">
    <div class="grp-title">Improvement — recent test scores</div>
    @if (recent.length) {
      <div class="trend">
        @for (h of recent; track h.t) {
          <div class="barcol"><div class="barlabel">{{ h.pct }}%</div>
            <div class="bar" [style.height.%]="h.pct" [style.background]="barColor(h.pct)" [title]="h.name"></div>
          </div>
        }
      </div>
    } @else { <div class="hint">No tests yet — your recent scores will show here.</div> }
  </div>

  <div class="card">
    <div class="grp-title">Areas to improve</div>
    @if (weak.length) {
      @for (o of weak; track o.i) {
        <div class="weakrow"><div><b>Day {{ o.i+1 }}:</b> {{ LESSONS[o.i][0] }} <span class="hint">— best {{ o.best }}%</span></div>
          <button class="sec" (click)="practiseDay(o.i)">Practise</button></div>
      }
    } @else { <div class="hint">No weak areas yet — complete more days to refine this.</div> }
    <p class="hint" style="margin:12px 0 6px">Tricky words to review (tap to hear, ✕ to remove):</p>
    <div class="words">
      @for (w of tricky; track w) {
        <span style="white-space:nowrap;margin-right:8px"><b (click)="sp.say(w, { rate: 1 })">{{ w }}</b>
          <span style="cursor:pointer;color:var(--bad);font-weight:bold;padding:0 5px" (click)="removeTricky(w)">✕</span></span>
      }
      @if (!tricky.length) { <span class="hint">No tricky words yet.</span> }
    </div>
    @if (tricky.length) { <div class="row" style="margin-top:12px"><button (click)="practiseTricky()">✏️ Practise tricky words</button></div> }
  </div>
  `
})
export class ProgressComponent {
  store = inject(StoreService);
  sp = inject(SpeechService);
  private router = inject(Router);
  LESSONS = LESSONS;
  acc = this.store.overallAccuracy();
  constructor() { this.store.flushTime(); this.acc = this.store.overallAccuracy(); }
  get daysDone() { return Object.values(this.store.G.days).filter(d => d.completed).length; }
  get recent() { return this.store.G.history.slice(-10); }
  barColor(p: number) { return p >= 90 ? 'var(--good)' : p >= 70 ? 'var(--gold)' : p >= 50 ? 'var(--vowel)' : 'var(--bad)'; }
  private ds(d: Date) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  private fmt(s: number) { s = Math.round(s || 0); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return h ? h + 'h ' + m + 'm' : m ? m + 'm' : s + 's'; }
  private sumDays(keys: string[]) { return keys.reduce((a, k) => a + (this.store.G.time[k] || 0), 0); }
  private lastN(n: number) { const a: string[] = []; for (let i = 0; i < n; i++) { const d = new Date(); d.setDate(d.getDate() - i); a.push(this.ds(d)); } return a; }
  private monthKeys(off: number) { const now = new Date(); const d = new Date(now.getFullYear(), now.getMonth() + off, 1); const y = d.getFullYear(), mo = d.getMonth(), dim = new Date(y, mo + 1, 0).getDate(); const a: string[] = []; for (let i = 1; i <= dim; i++) a.push(y + '-' + String(mo + 1).padStart(2, '0') + '-' + String(i).padStart(2, '0')); return a; }
  get timeBuckets(): [string, string][] {
    const today = this.store.G.time[this.ds(new Date())] || 0;
    const yest = this.store.G.time[this.ds(new Date(Date.now() - 86400000))] || 0;
    return [['Today', this.fmt(today)], ['Yesterday', this.fmt(yest)], ['Last 7 days', this.fmt(this.sumDays(this.lastN(7)))],
      ['This month', this.fmt(this.sumDays(this.monthKeys(0)))], ['Last month', this.fmt(this.sumDays(this.monthKeys(-1)))]];
  }
  get last14() {
    const keys = this.lastN(14).reverse(); const vals = keys.map(k => this.store.G.time[k] || 0); const mx = Math.max(60, ...vals);
    return keys.map((k, i) => ({ k, sec: vals[i], h: Math.max(3, Math.round(vals[i] / mx * 100)), lab: vals[i] >= 60 ? Math.round(vals[i] / 60) + 'm' : (vals[i] ? vals[i] + 's' : ''), day: k.slice(8) }));
  }
  get weak() { return Object.entries(this.store.G.days).map(([i, d]) => ({ i: +i, best: d.best || 0 })).filter(o => o.best < 80).sort((a, b) => a.best - b.best).slice(0, 6); }
  get tricky() { return this.store.hardWords().slice(0, 15); }
  removeTricky(w: string) { delete this.store.G.wrongWords[w]; this.store.save(); }
  practiseDay(i: number) { this.store.pendingTest = { name: `Day ${i + 1} — ${LESSONS[i][0]}`, words: LESSONS[i][2], day: i }; this.router.navigate(['/test']); }
  practiseTricky() { this.store.pendingTest = { name: 'Tricky words', words: this.tricky, day: null }; this.router.navigate(['/test']); }
}

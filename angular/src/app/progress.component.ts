import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from './store.service';
import { SpeechService } from './speech.service';
import { LESSONS } from './data';
import { UI } from './ui';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [...UI],
  template: `
  <div class="page">
    <ui-page-head title="My Progress" sub="How you are doing, and what to practise next"/>

    <div class="kpis">
      <div class="kpi tint-indigo"><span class="ic-tile"><ui-icon name="zap"/></span><div class="v">{{ store.level }}</div><div class="k">Level · {{ store.G.xp }} XP</div></div>
      <div class="kpi tint-green"><span class="ic-tile"><ui-icon name="check"/></span><div class="v">{{ store.G.correct }}</div><div class="k">Words correct</div></div>
      <div class="kpi tint-teal"><span class="ic-tile"><ui-icon name="target"/></span><div class="v">{{ acc.acc == null ? '—' : acc.acc + '%' }}</div><div class="k">Accuracy</div></div>
      <div class="kpi tint-sky"><span class="ic-tile"><ui-icon name="pencil"/></span><div class="v">{{ store.G.history.length }}</div><div class="k">Tests taken</div></div>
      <div class="kpi tint-amber"><span class="ic-tile"><ui-icon name="flame"/></span><div class="v">{{ store.G.streak }}</div><div class="k">Day streak</div></div>
      <div class="kpi tint-violet"><span class="ic-tile"><ui-icon name="map"/></span><div class="v">{{ daysDone }}<span class="muted" style="font-size:15px;font-weight:500"> / 30</span></div><div class="k">Quest days</div></div>
    </div>

    <div class="two-col">
      <section class="card">
        <div class="card-head"><h2>Recent test scores</h2><span class="muted small">Last {{ recent.length || 10 }}</span></div>
        @if (recent.length) {
          <div class="chart">
            @for (h of recent; track h.t) {
              <div class="col" [title]="h.name">
                <span class="val">{{ h.pct }}</span>
                <div class="bar" [style.height.%]="Math.max(4, h.pct)" [style.background]="barColor(h.pct)"></div>
              </div>
            }
          </div>
          <p class="note">{{ acc.right }} correct out of {{ acc.total }} words across all tests.</p>
        } @else {
          <div class="empty"><span class="ic-tile"><ui-icon name="chart"/></span>Take a spelling test and your scores will appear here.</div>
        }
      </section>

      <section class="card">
        <div class="card-head"><h2>Time practising</h2><span class="muted small">Last 14 days</span></div>
        <div class="time-list">
          @for (b of timeBuckets; track b[0]) { <div class="mini-stat"><div class="v">{{ b[1] }}</div><div class="k">{{ b[0] }}</div></div> }
        </div>
        <div class="chart" style="height:120px">
          @for (d of last14; track d.k) {
            <div class="col">
              <span class="val">{{ d.lab }}</span>
              <div class="bar" [class.zero]="!d.sec" [style.height.%]="d.h"></div>
              <span class="lab">{{ d.day }}</span>
            </div>
          }
        </div>
        <p class="note">Counts only while the app is open and in use.</p>
      </section>
    </div>

    <div class="two-col">
      <section class="card">
        <div class="card-head"><h2>Days to revisit</h2></div>
        @if (weak.length) {
          @for (o of weak; track o.i) {
            <div class="weak-row">
              <div class="body">
                <div class="t">Day {{ o.i + 1 }} · {{ LESSONS[o.i][0] }}</div>
                <div class="progress"><i [style.width.%]="o.best" [style.background]="barColor(o.best)"></i></div>
              </div>
              <span class="small muted" style="font-variant-numeric:tabular-nums">{{ o.best }}%</span>
              <button class="btn btn-soft btn-sm" (click)="practiseDay(o.i)">Practise</button>
            </div>
          }
        } @else {
          <div class="empty"><span class="ic-tile"><ui-icon name="sparkles"/></span>Nothing to revisit yet — days scoring under 80% will show here.</div>
        }
      </section>

      <section class="card">
        <div class="card-head">
          <h2>Tricky words</h2>
          @if (tricky.length) { <button class="btn btn-primary btn-sm" (click)="practiseTricky()"><ui-icon name="pencil"/>Practise</button> }
        </div>
        @if (tricky.length) {
          <div class="tricky">
            @for (w of tricky; track w) {
              <span class="tw">
                <button class="w" (click)="sp.say(w, { rate: 1 })" [title]="'Hear ' + w">{{ w }}</button>
                <button class="x" (click)="removeTricky(w)" [attr.aria-label]="'Remove ' + w"><ui-icon name="x"/></button>
              </span>
            }
          </div>
          <p class="note">Words you have missed at least twice. Tap to hear one.</p>
        } @else {
          <div class="empty"><span class="ic-tile"><ui-icon name="check"/></span>No tricky words yet — great job!</div>
        }
      </section>
    </div>
  </div>
  `
})
export class ProgressComponent {
  store = inject(StoreService);
  sp = inject(SpeechService);
  private router = inject(Router);
  LESSONS = LESSONS;
  Math = Math;
  acc = this.store.overallAccuracy();
  constructor() { this.store.flushTime(); this.acc = this.store.overallAccuracy(); }
  get daysDone() { return Object.values(this.store.G.days).filter(d => d.completed).length; }
  get recent() { return this.store.G.history.slice(-10); }
  barColor(p: number) { return p >= 90 ? 'var(--success)' : p >= 70 ? 'var(--primary)' : p >= 50 ? 'var(--warn)' : 'var(--danger)'; }
  private ds(d: Date) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  private fmt(s: number) { s = Math.round(s || 0); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return h ? h + 'h ' + m + 'm' : m ? m + 'm' : s + 's'; }
  private sumDays(keys: string[]) { return keys.reduce((a, k) => a + (this.store.G.time[k] || 0), 0); }
  private lastN(n: number) { const a: string[] = []; for (let i = 0; i < n; i++) { const d = new Date(); d.setDate(d.getDate() - i); a.push(this.ds(d)); } return a; }
  private monthKeys(off: number) { const now = new Date(); const d = new Date(now.getFullYear(), now.getMonth() + off, 1); const y = d.getFullYear(), mo = d.getMonth(), dim = new Date(y, mo + 1, 0).getDate(); const a: string[] = []; for (let i = 1; i <= dim; i++) a.push(y + '-' + String(mo + 1).padStart(2, '0') + '-' + String(i).padStart(2, '0')); return a; }
  get timeBuckets(): [string, string][] {
    const today = this.store.G.time[this.ds(new Date())] || 0;
    return [['Today', this.fmt(today)], ['Last 7 days', this.fmt(this.sumDays(this.lastN(7)))],
      ['This month', this.fmt(this.sumDays(this.monthKeys(0)))], ['Last month', this.fmt(this.sumDays(this.monthKeys(-1)))]];
  }
  get last14() {
    const keys = this.lastN(14).reverse(); const vals = keys.map(k => this.store.G.time[k] || 0); const mx = Math.max(60, ...vals);
    return keys.map((k, i) => ({ k, sec: vals[i], h: Math.max(3, Math.round(vals[i] / mx * 100)), lab: vals[i] >= 60 ? Math.round(vals[i] / 60) + 'm' : '', day: k.slice(8) }));
  }
  get weak() { return Object.entries(this.store.G.days).map(([i, d]) => ({ i: +i, best: d.best || 0 })).filter(o => o.best < 80).sort((a, b) => a.best - b.best).slice(0, 6); }
  get tricky() { return this.store.hardWords().slice(0, 15); }
  removeTricky(w: string) { delete this.store.G.wrongWords[w]; this.store.save(); }
  practiseDay(i: number) { this.store.pendingTest = { name: `Day ${i + 1} — ${LESSONS[i][0]}`, words: LESSONS[i][2], day: i }; this.router.navigate(['/test']); }
  practiseTricky() { this.store.pendingTest = { name: 'Tricky words', words: this.tricky, day: null }; this.router.navigate(['/test']); }
}

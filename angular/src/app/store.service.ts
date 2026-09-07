import { Injectable } from '@angular/core';
import { LESSONS, DEFAULT_LISTS } from './data';

export interface DayResult { stars: number; best: number; completed: boolean; }
export interface HistoryEntry { t: number; name: string; day: number | null; pct: number; right: number; total: number; }

export interface Game {
  xp: number; correct: number; attempts: number; streak: number; lastDay: string | null;
  days: { [i: number]: DayResult };
  badges: { [id: string]: boolean };
  history: HistoryEntry[];
  time: { [day: string]: number };
  wrongWords: { [w: string]: number };
  extraHard: string[];
}

export const BADGES: [string, string, string, string][] = [
  ["first","🌱","First Steps","Spell your first word correctly"],
  ["ten","✍️","Getting It","Spell 10 words correctly"],
  ["hundred","📚","Word Collector","Spell 100 words correctly"],
  ["perfect","💯","Flawless","Get 100% on a test"],
  ["threestar","🌟","Star Speller","Earn 3 stars on any day"],
  ["streak3","🔥","On a Roll","Reach a 3-day streak"],
  ["streak7","🚀","Week Warrior","Reach a 7-day streak"],
  ["level5","🏅","Rising Star","Reach Level 5"],
  ["half","🗺️","Halfway There","Complete 15 days"],
  ["all","👑","Spelling Champion","Complete all 30 days"]
];

@Injectable({ providedIn: 'root' })
export class StoreService {
  G: Game = this.load();
  toastMsg = '';
  pendingTest: { name: string; words: string[]; day: number | null } | null = null;
  onSave: (() => void) | null = null;

  private load(): Game {
    let g: any = {};
    try { g = JSON.parse(localStorage.getItem('spellquest_ng') || '{}') || {}; } catch { g = {}; }
    return {
      xp: g.xp || 0, correct: g.correct || 0, attempts: g.attempts || 0, streak: g.streak || 0,
      lastDay: g.lastDay || null, days: g.days || {}, badges: g.badges || {}, history: g.history || [],
      time: g.time || {}, wrongWords: g.wrongWords || {}, extraHard: g.extraHard || []
    };
  }
  save() { try { localStorage.setItem('spellquest_ng', JSON.stringify(this.G)); } catch {} if (this.onSave) this.onSave(); }

  mergeRemote(g: any, lists: any) {
    const G = this.G;
    G.xp = Math.max(G.xp, g.xp || 0);
    G.correct = Math.max(G.correct, g.correct || 0);
    G.attempts = Math.max(G.attempts, g.attempts || 0);
    G.streak = Math.max(G.streak, g.streak || 0);
    G.lastDay = [G.lastDay, g.lastDay].filter(Boolean).sort().pop() || null;
    Object.entries(g.days || {}).forEach(([d, rd]: any) => {
      const ld = G.days[+d] || { stars: 0, best: 0, completed: false };
      G.days[+d] = { stars: Math.max(ld.stars || 0, rd.stars || 0), best: Math.max(ld.best || 0, rd.best || 0), completed: !!(ld.completed || rd.completed) };
    });
    Object.entries(g.badges || {}).forEach(([id, on]: any) => { if (on) G.badges[id] = true; });
    Object.entries(g.wrongWords || {}).forEach(([w, c]: any) => { G.wrongWords[w] = Math.max(G.wrongWords[w] || 0, c || 0); });
    Object.entries(g.time || {}).forEach(([k, v]: any) => { G.time[k] = Math.max(G.time[k] || 0, v || 0); });
    const hm: any = {}; [...(G.history || []), ...(g.history || [])].forEach((h: any) => { if (h && h.t) hm[h.t] = h; });
    G.history = (Object.values(hm) as HistoryEntry[]).sort((a, b) => a.t - b.t).slice(-200);
    G.extraHard = Array.from(new Set([...(G.extraHard || []), ...(g.extraHard || [])])).slice(-40);
    if (lists && typeof lists === 'object') { const cur = this.get<any>('lists_ng', {}); this.set('lists_ng', Object.assign({}, lists, cur)); }
    try { localStorage.setItem('spellquest_ng', JSON.stringify(this.G)); } catch {}
  }

  get<T>(k: string, d: T): T { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } }
  set(k: string, v: any) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

  levelFor(xp: number) { return Math.floor(xp / 100) + 1; }
  get level() { return this.levelFor(this.G.xp); }
  totalStars() { return Object.values(this.G.days).reduce((a, d) => a + (d.stars || 0), 0); }

  toast(msg: string) { this.toastMsg = msg; setTimeout(() => { if (this.toastMsg === msg) this.toastMsg = ''; }, 2600); }

  awardXP(n: number) {
    const before = this.level; this.G.xp += n; this.save();
    if (this.level > before) { this.toast(`🎉 Level up! Level ${this.level}`); }
    this.checkBadges();
  }
  private todayStr() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  touchStreak() {
    const t = this.todayStr(); if (this.G.lastDay === t) return;
    const yest = new Date(Date.now() - 86400000);
    const ys = yest.getFullYear() + '-' + String(yest.getMonth() + 1).padStart(2, '0') + '-' + String(yest.getDate()).padStart(2, '0');
    this.G.streak = this.G.lastDay === ys ? this.G.streak + 1 : 1;
    this.G.lastDay = t; this.save(); this.checkBadges();
    if (this.G.streak > 1) this.toast(`🔥 ${this.G.streak}-day streak!`);
  }
  dayUnlocked(i: number) { return i <= 0 || !!(this.G.days[i - 1] && this.G.days[i - 1].completed); }
  maxUnlockedDay() { let i = 0; while (i < LESSONS.length - 1 && this.dayUnlocked(i + 1)) i++; return i; }
  setDayResult(idx: number, pct: number) {
    const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0;
    const d = this.G.days[idx] || { stars: 0, best: 0, completed: false };
    d.best = Math.max(d.best || 0, pct); d.stars = Math.max(d.stars || 0, stars);
    d.completed = d.completed || pct >= 89;
    this.G.days[idx] = d; this.save(); this.checkBadges();
    return stars;
  }
  unlock(id: string) {
    if (this.G.badges[id]) return; this.G.badges[id] = true; this.save();
    const b = BADGES.find(x => x[0] === id); if (b) this.toast(`🏅 Badge: ${b[2]}`);
  }
  checkBadges() {
    if (this.G.correct >= 1) this.unlock('first');
    if (this.G.correct >= 10) this.unlock('ten');
    if (this.G.correct >= 100) this.unlock('hundred');
    if (this.G.streak >= 3) this.unlock('streak3');
    if (this.G.streak >= 7) this.unlock('streak7');
    if (this.level >= 5) this.unlock('level5');
    const done = Object.values(this.G.days).filter(d => d.completed).length;
    if (done >= 15) this.unlock('half');
    if (done >= 30) this.unlock('all');
    if (Object.values(this.G.days).some(d => (d.stars || 0) >= 3)) this.unlock('threestar');
  }
  overallAccuracy() {
    let r = 0, t = 0; this.G.history.forEach(h => { r += h.right || 0; t += h.total || 0; });
    return { right: r, total: t, acc: t ? Math.round(r / t * 100) : null };
  }
  hardWords() {
    return Object.entries(this.G.wrongWords).filter(([w, c]) => c >= 2 && !/\s/.test(w) && /^[a-z][a-z'-]+$/i.test(w))
      .sort((a, b) => b[1] - a[1]).map(x => x[0]);
  }
  // active-time tracking
  private accSec = 0; private lastActive = Date.now();
  bumpActive() { this.lastActive = Date.now(); }
  tickTime() {
    if (document.hidden) return;
    if (Date.now() - this.lastActive > 60000) return;
    this.accSec++;
    if (this.accSec >= 15) this.flushTime();
  }
  flushTime() {
    if (this.accSec > 0) { const k = this.todayStr(); this.G.time[k] = (this.G.time[k] || 0) + this.accSec; this.accSec = 0; this.save(); }
  }
  allLists(): { [k: string]: string[] } { return Object.assign({}, DEFAULT_LISTS, this.get<any>('lists_ng', {})); }
}

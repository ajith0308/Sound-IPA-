import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StoreService } from './store.service';
import { FirebaseService } from './firebase.service';
import { LESSONS } from './data';
import { UI } from './ui';

interface Feat { route: string; icon: string; tint: string; t: string; d: string; }

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ...UI],
  template: `
  <div class="page">
    <div class="mobile-greet">
      <div>
        <div class="eyebrow">{{ today }}</div>
        <h1 style="margin-top:4px">{{ greeting }}{{ firstName ? ', ' + firstName : '' }}</h1>
      </div>
    </div>

    <div class="hero-grid">
      <section class="hero">
        <div>
          <div class="eyebrow">30-Day Quest · Day {{ day + 1 }}</div>
          <h2>{{ lesson[0] }}</h2>
          <p>{{ lesson[1] }}</p>
        </div>
        <div class="hero-foot">
          <div class="meter">
            {{ daysDone }} of {{ total }} days complete
            <div class="progress"><i [style.width.%]="daysDone / total * 100"></i></div>
          </div>
          <a routerLink="/quest" class="btn btn-white btn-lg">{{ daysDone ? 'Continue' : 'Start quest' }}<ui-icon name="arrow"/></a>
        </div>
      </section>

      <section class="card statcard" style="margin:0">
        <div class="level-row">
          <ui-ring [size]="72" [stroke]="8" [value]="store.G.xp % 100"><span class="lv">{{ store.level }}</span></ui-ring>
          <div style="flex:1;min-width:0">
            <div class="eyebrow">Level {{ store.level }}</div>
            <div style="font-weight:600;font-size:17px;margin-top:2px">{{ 100 - store.G.xp % 100 }} XP to level {{ store.level + 1 }}</div>
            <div class="muted small">{{ store.G.xp }} XP earned in total</div>
          </div>
        </div>
        <div class="mini-stats">
          <div class="mini-stat"><div class="v" style="color:var(--t-amber)"><ui-icon name="flame"/>{{ store.G.streak }}</div><div class="k">Day streak</div></div>
          <div class="mini-stat"><div class="v" style="color:var(--gold)"><ui-icon name="star"/>{{ store.totalStars() }}</div><div class="k">of {{ total * 3 }} stars</div></div>
          <div class="mini-stat"><div class="v" style="color:var(--t-teal)"><ui-icon name="target"/>{{ acc == null ? '—' : acc + '%' }}</div><div class="k">Accuracy</div></div>
        </div>
      </section>
    </div>

    <h2 class="section-title">Spelling</h2>
    <div class="tiles">
      @for (f of spelling; track f.route) {
        <button [class]="'tile ' + f.tint" (click)="go(f.route)">
          <span class="ic-tile"><ui-icon [name]="f.icon"/></span>
          <span class="body"><div class="t">{{ f.t }}</div><div class="d">{{ f.d }}</div></span>
          <span class="go"><ui-icon name="chevR"/></span>
        </button>
      }
    </div>

    <h2 class="section-title">Grammar &amp; progress</h2>
    <div class="tiles">
      @for (f of more; track f.route) {
        <button [class]="'tile ' + f.tint" (click)="go(f.route)">
          <span class="ic-tile"><ui-icon [name]="f.icon"/></span>
          <span class="body"><div class="t">{{ f.t }}</div><div class="d">{{ f.d }}</div></span>
          <span class="go"><ui-icon name="chevR"/></span>
        </button>
      }
    </div>
  </div>
  `
})
export class HomeComponent {
  store = inject(StoreService);
  fb = inject(FirebaseService);
  private router = inject(Router);

  total = LESSONS.length;
  day = Math.min(this.store.get('planDay', 0), this.store.maxUnlockedDay());
  lesson = LESSONS[this.day];
  acc = this.store.overallAccuracy().acc;

  spelling: Feat[] = [
    { route: 'test', icon: 'pencil', tint: 'tint-indigo', t: 'Spelling Test', d: 'Hear a word, then type it' },
    { route: 'sounds', icon: 'wave', tint: 'tint-coral', t: 'The 44 Sounds', d: 'Every sound and the letters that spell it' },
    { route: 'say', icon: 'volume', tint: 'tint-teal', t: 'Say a Word', d: 'Hear any word and sound it out' },
    { route: 'dictionary', icon: 'book', tint: 'tint-sky', t: 'Dictionary', d: 'Look up meanings and hear them read' },
    { route: 'lists', icon: 'list', tint: 'tint-pink', t: 'My Word Lists', d: 'Practise your own words' }
  ];
  more: Feat[] = [
    { route: 'grammar', icon: 'puzzle', tint: 'tint-violet', t: 'Grammar Practice', d: 'Fix sentences and learn the rules' },
    { route: 'progress', icon: 'chart', tint: 'tint-green', t: 'My Progress', d: 'Scores, time spent and tricky words' }
  ];

  get daysDone() { return Object.values(this.store.G.days).filter(d => d.completed).length; }
  get firstName() {
    const u = this.fb.user();
    return u ? (u.displayName || '').split(' ')[0] : '';
  }
  get greeting() { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; }
  today = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  go(r: string) { this.router.navigate(['/' + r]); }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StoreService } from './store.service';
import { FirebaseService } from './firebase.service';
import { GRAMMAR } from './data';

interface Feat { route: string; ic: string; t: string; d: string; }

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="home-head">
    <div>
      <h1>🏆 Sound &amp; Spell</h1>
      <p class="tag">{{ module ? modName + ' — pick an activity.' : 'Choose a module to begin.' }}</p>
    </div>
    <div class="userchip">
      <div class="avatar">@if (photo) { <img [src]="photo" alt=""> } @else { 👤 }</div>
      <div style="min-width:0">
        <div style="font-weight:bold;font-size:15px">{{ userName }}</div>
        @if (fb.status) { <div class="hint" style="font-size:12px;margin:0">{{ fb.status }}</div> }
      </div>
      @if (fb.user()) { <button class="linklike" (click)="fb.signOutUser()">Sign out</button> }
      @else { <button class="linklike" (click)="fb.backToLogin()">Sign in</button> }
      <button class="linklike" (click)="go('settings')">⚙️ Settings</button>
    </div>
  </div>

  <div class="gamebar">
    <div class="lvl">{{ store.level }}</div>
    <div style="flex:1;min-width:150px">
      <div class="hint" style="margin:0">Level {{ store.level }} · {{ store.G.xp }} XP</div>
      <div class="xpwrap"><div class="xpfill" [style.width.%]="store.G.xp % 100"></div></div>
    </div>
    <div class="gstat">🔥 {{ store.G.streak }}</div>
    <div class="gstat">⭐ {{ store.totalStars() }} / 90</div>
  </div>

  @if (!module) {
    <div class="mod-grid">
      <div class="modcard mod-spelling" (click)="pick('spelling')">
        <div class="modcard-ic">📝</div><div class="modcard-t">Spelling</div>
        <div class="modcard-d">Sounds, the 30-day quest, tests &amp; word lists</div>
        <div class="modcard-chip">{{ spellCount }} activities</div>
      </div>
      <div class="modcard mod-grammar" (click)="pick('grammar')">
        <div class="modcard-ic">🧩</div><div class="modcard-t">Grammar</div>
        <div class="modcard-d">Sentence &amp; rule practice</div>
        <div class="modcard-chip">{{ gCount }} exercises</div>
      </div>
    </div>
  } @else {
    <button class="sec" style="margin-bottom:14px" (click)="pick(null)">← All modules</button>
    <div class="menu-grid">
      @for (f of feats; track f.route) {
        <div class="menu-card" (click)="go(f.route)">
          <div class="mc-ic">{{ f.ic }}</div>
          <div><div class="mc-t">{{ f.t }}</div><div class="mc-d">{{ f.d }}</div></div>
        </div>
      }
    </div>
  }
  `
})
export class HomeComponent {
  store = inject(StoreService);
  fb = inject(FirebaseService);
  private router = inject(Router);
  module = this.store.get<string | null>('module', null);
  gCount = GRAMMAR.length;
  get userName() { const u = this.fb.user(); return u ? (u.displayName || u.email || 'Signed in') : 'Guest learner'; }
  get photo() { return this.fb.user()?.photoURL || ''; }
  spellFeats: Feat[] = [
    { route: 'quest', ic: '🗺️', t: '30-Day Quest', d: 'Daily lessons — practise, then test' },
    { route: 'test', ic: '✏️', t: 'Spelling Test', d: 'Hear a word and spell it' },
    { route: 'say', ic: '🔊', t: 'Say a word', d: 'Hear & sound out any word' },
    { route: 'sounds', ic: '🔤', t: 'Sounds', d: 'The 44 English sounds' },
    { route: 'dictionary', ic: '📖', t: 'Dictionary', d: 'Look up a word & hear its meaning' },
    { route: 'lists', ic: '📝', t: 'Word lists', d: 'Practise your own words' },
    { route: 'progress', ic: '📈', t: 'My Progress', d: 'See improvement & weak spots' }
  ];
  grammarFeats: Feat[] = [{ route: 'grammar', ic: '🧩', t: 'Grammar Practice', d: 'Fix sentences & learn the rules' }];

  get modName() { return this.module === 'spelling' ? 'Spelling' : this.module === 'grammar' ? 'Grammar' : ''; }
  get feats() { return this.module === 'spelling' ? this.spellFeats : this.grammarFeats; }
  get spellCount() { return this.spellFeats.length; }
  pick(m: string | null) { this.module = m; this.store.set('module', m); }
  go(r: string) { this.router.navigate(['/' + r]); }
}

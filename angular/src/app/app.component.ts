import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { StoreService } from './store.service';
import { SpeechService } from './speech.service';
import { FirebaseService } from './firebase.service';
import { LoginComponent } from './login.component';
import { UI } from './ui';

interface NavItem { route: string; icon: string; label: string; }

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LoginComponent, ...UI],
  template: `
    @if (!fb.ready()) {
      <div class="splash"><ui-brand-mark/></div>
    } @else if (!fb.user() && !fb.guest()) {
      <app-login></app-login>
    } @else {
      <div class="shell">
        <aside class="sidebar">
          <a routerLink="/" class="brand side-brand"><ui-brand-mark/><span>Sound &amp; Spell<small>Learn to spell by sound</small></span></a>
          @for (g of groups; track g.label) {
            <div class="nav-label">{{ g.label }}</div>
            @for (n of g.items; track n.route) {
              <a class="nav-item" [routerLink]="n.route" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: n.route === '/' }">
                <ui-icon [name]="n.icon"/>{{ n.label }}
              </a>
            }
          }
          <div class="side-foot">
            <a class="side-user" routerLink="/settings">
              <div class="avatar">@if (photo) { <img [src]="photo" alt=""> } @else { {{ initial }} }</div>
              <div class="meta">
                <div class="name">{{ userName }}</div>
                <div class="sub">Level {{ store.level }} · {{ store.G.xp }} XP</div>
              </div>
              <ui-icon name="settings"/>
            </a>
          </div>
        </aside>

        <div class="main">
          <div class="topbar">
            <a routerLink="/" class="brand"><ui-brand-mark/><span>Sound &amp; Spell</span></a>
            <div class="row" style="gap:6px;flex-wrap:nowrap">
              <span class="chip warn"><ui-icon name="flame"/>{{ store.G.streak }}</span>
              <a routerLink="/settings" class="avatar" aria-label="Account and settings" style="width:34px;height:34px;font-size:14px">
                @if (photo) { <img [src]="photo" alt=""> } @else { {{ initial }} }
              </a>
            </div>
          </div>
          <router-outlet></router-outlet>
        </div>

        <nav class="tabbar" aria-label="Main">
          @for (n of tabs; track n.route) {
            <a class="tab" [routerLink]="n.route" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: n.route === '/' }">
              <ui-icon [name]="n.icon"/><span>{{ n.label }}</span>
            </a>
          }
        </nav>
      </div>
    }
    @if (store.toastMsg) { <div class="toast" role="status">{{ store.toastMsg }}</div> }
  `
})
export class AppComponent {
  store = inject(StoreService);
  sp = inject(SpeechService);
  fb = inject(FirebaseService);

  groups: { label: string; items: NavItem[] }[] = [
    { label: 'Learn', items: [
      { route: '/', icon: 'home', label: 'Home' },
      { route: '/quest', icon: 'map', label: '30-Day Quest' },
      { route: '/test', icon: 'pencil', label: 'Spelling Test' },
      { route: '/sounds', icon: 'wave', label: 'Sounds' },
      { route: '/say', icon: 'volume', label: 'Say a Word' }
    ] },
    { label: 'Tools', items: [
      { route: '/dictionary', icon: 'book', label: 'Dictionary' },
      { route: '/lists', icon: 'list', label: 'Word Lists' },
      { route: '/grammar', icon: 'puzzle', label: 'Grammar' }
    ] },
    { label: 'You', items: [
      { route: '/progress', icon: 'chart', label: 'Progress' },
      { route: '/settings', icon: 'settings', label: 'Settings' }
    ] }
  ];
  tabs: NavItem[] = [
    { route: '/', icon: 'home', label: 'Home' },
    { route: '/quest', icon: 'map', label: 'Quest' },
    { route: '/test', icon: 'pencil', label: 'Test' },
    { route: '/progress', icon: 'chart', label: 'Progress' },
    { route: '/settings', icon: 'settings', label: 'Settings' }
  ];

  get userName() { const u = this.fb.user(); return u ? (u.displayName || u.email || 'Signed in') : 'Guest learner'; }
  get initial() { return (this.fb.user()?.displayName || this.fb.user()?.email || 'G').trim().charAt(0).toUpperCase(); }
  get photo() { return this.fb.user()?.photoURL || ''; }

  constructor() {
    this.store.applyTheme();
    ['click', 'keydown', 'mousemove', 'touchstart', 'scroll', 'input'].forEach(ev =>
      window.addEventListener(ev, () => this.store.bumpActive(), { passive: true }));
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.store.flushTime(); });
    window.addEventListener('beforeunload', () => this.store.flushTime());
    setInterval(() => this.store.tickTime(), 1000);
  }
}

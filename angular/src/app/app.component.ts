import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoreService } from './store.service';
import { SpeechService } from './speech.service';
import { FirebaseService } from './firebase.service';
import { LoginComponent } from './login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent],
  template: `
    <canvas id="confetti"></canvas>
    <div class="wrap">
      @if (!fb.ready()) {
        <p class="hint" style="text-align:center;margin-top:25vh">Loading…</p>
      } @else if (!fb.user() && !fb.guest()) {
        <app-login></app-login>
      } @else {
        <router-outlet></router-outlet>
      }
    </div>
    @if (store.toastMsg) { <div class="toast">{{ store.toastMsg }}</div> }
  `
})
export class AppComponent {
  store = inject(StoreService);
  sp = inject(SpeechService);
  fb = inject(FirebaseService);
  constructor() {
    this.applyTheme();
    ['click', 'keydown', 'mousemove', 'touchstart', 'scroll', 'input'].forEach(ev =>
      window.addEventListener(ev, () => this.store.bumpActive(), { passive: true }));
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.store.flushTime(); });
    window.addEventListener('beforeunload', () => this.store.flushTime());
    setInterval(() => this.store.tickTime(), 1000);
  }
  applyTheme() {
    const b = document.body;
    b.classList.toggle('easy', this.store.get('easy', true));
    const bg = this.store.get<string>('bg', 'cream');
    b.classList.toggle('plainwhite', bg === 'white');
    b.classList.toggle('dark', bg === 'dark');
  }
}

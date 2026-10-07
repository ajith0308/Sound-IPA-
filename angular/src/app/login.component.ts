import { Component, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { UI } from './ui';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [...UI],
  template: `
  <div class="auth">
    <section class="auth-art">
      <div class="brand"><ui-brand-mark/><span>Sound &amp; Spell</span></div>
      <div>
        <div class="word-demo"><span>b</span><span class="v">ea</span><span>u</span><span>t</span><span class="v">i</span><span>f</span><span class="v">u</span><span>l</span></div>
        <h2 style="margin-top:28px">Hear it. Sound it out. Spell it.</h2>
        <p class="lead">A calm, easy-to-read way to master English spelling through the 44 sounds of the language.</p>
        <div class="feature-list">
          <div><span class="ic-tile"><ui-icon name="map"/></span>A guided 30-day phonics quest</div>
          <div><span class="ic-tile"><ui-icon name="volume"/></span>Every word spoken aloud — normal or slow</div>
          <div><span class="ic-tile"><ui-icon name="chart"/></span>Progress, streaks and badges that motivate</div>
        </div>
      </div>
      <p style="font-size:13px;color:rgba(255,255,255,.7)">Designed with dyslexic learners in mind.</p>
    </section>

    <section class="auth-panel">
      <div class="auth-card">
        <div class="brand"><ui-brand-mark/><span>Sound &amp; Spell</span></div>
        <div class="auth-mini">
          <div class="word-demo"><span>b</span><span class="v">ea</span><span>u</span><span>t</span><span class="v">i</span><span>f</span><span class="v">u</span><span>l</span></div>
          <p>Hear it. Sound it out. Spell it.</p>
        </div>
        <h1>Welcome</h1>
        <p class="lead">Sign in to keep your progress safe and in sync on every device.</p>

        <button class="btn btn-secondary btn-lg btn-block gbtn" (click)="fb.signInGoogle()">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"/>
          </svg>
          Continue with Google
        </button>
        <div class="divider">or</div>
        <button class="btn btn-ghost btn-lg btn-block" (click)="fb.continueGuest()">Try it without an account</button>
        <p class="auth-status" role="alert">{{ fb.status }}</p>
        <p class="fine">Guest progress is saved only on this device. You can sign in later from Settings.</p>
      </div>
    </section>
  </div>
  `
})
export class LoginComponent { fb = inject(FirebaseService); }

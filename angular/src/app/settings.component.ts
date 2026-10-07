import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpeechService } from './speech.service';
import { StoreService } from './store.service';
import { FirebaseService } from './firebase.service';
import { UI } from './ui';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, ...UI],
  template: `
  <div class="page narrow">
    <ui-page-head title="Settings" sub="Your account, voice and reading preferences"/>

    <section class="card">
      <div class="row" style="gap:14px">
        <div class="avatar lg">@if (photo) { <img [src]="photo" alt=""> } @else { {{ initial }} }</div>
        <div style="flex:1 1 180px;min-width:0">
          <div style="font-weight:600;font-size:17px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ userName }}</div>
          <div class="muted small" style="display:flex;align-items:center;gap:6px">
            @if (fb.user()) { <ui-icon name="cloud"/>{{ fb.status || 'Progress syncs to your Google account' }} }
            @else { Progress is saved on this device only }
          </div>
        </div>
        @if (fb.user()) { <button class="btn btn-secondary btn-sm" (click)="fb.signOutUser()"><ui-icon name="logout"/>Sign out</button> }
        @else { <button class="btn btn-primary btn-sm" (click)="fb.backToLogin()"><ui-icon name="login"/>Sign in</button> }
      </div>
    </section>

    <h2 class="section-title">Voice</h2>
    <section class="card set-group">
      <div class="set-row">
        <span class="ic-tile tint-indigo"><ui-icon name="gauge"/></span>
        <div class="lbl"><div class="t">Speaking speed</div><div class="d">How fast words are read aloud</div></div>
        <div class="ctl" style="flex:1 1 200px;max-width:280px">
          <input type="range" min="0.4" max="1" step="0.05" [(ngModel)]="rate" (ngModelChange)="sp.setRate(rate)" aria-label="Speaking speed">
          <span class="range-val">{{ rate }}×</span>
        </div>
      </div>
      <div class="set-row">
        <span class="ic-tile tint-teal"><ui-icon name="mic"/></span>
        <div class="lbl"><div class="t">Voice</div><div class="d">The online voice is clearer; the device voice works offline</div></div>
        <div class="ctl wide">
          <div class="segmented">
            <button [class.on]="src === 'online'" (click)="setSrc('online')">Clear (online)</button>
            <button [class.on]="src === 'device'" (click)="setSrc('device')">Device</button>
          </div>
        </div>
      </div>
      @if (src === 'online') {
        <div class="set-row">
          <span class="ic-tile tint-sky"><ui-icon name="globe"/></span>
          <div class="lbl"><div class="t">Accent</div></div>
          <div class="ctl wide">
            <select class="select" [(ngModel)]="accent" (ngModelChange)="sp.setAccent(accent)" aria-label="Accent">
              <option value="en-GB">English (UK)</option><option value="en">English (US)</option>
              <option value="en-AU">English (Australia)</option><option value="en-IN">English (India)</option>
            </select>
          </div>
        </div>
      } @else {
        <div class="set-row">
          <span class="ic-tile tint-sky"><ui-icon name="globe"/></span>
          <div class="lbl"><div class="t">Device voice</div></div>
          <div class="ctl wide">
            <select class="select" [(ngModel)]="voiceName" (ngModelChange)="sp.setVoice(voiceName)" aria-label="Device voice">
              @for (v of sp.voices; track v.name) { <option [value]="v.name">{{ v.name }} ({{ v.lang }})</option> }
            </select>
          </div>
        </div>
      }
      <div class="set-row">
        <span class="ic-tile tint-coral"><ui-icon name="volume"/></span>
        <div class="lbl"><div class="t">Preview</div><div class="d">Hear how the voice sounds</div></div>
        <div class="ctl"><button class="btn btn-soft btn-sm" (click)="sp.say('Hello! This is your spelling voice.')"><ui-icon name="play"/>Play</button></div>
      </div>
    </section>

    <h2 class="section-title">Reading &amp; display</h2>
    <section class="card set-group">
      <div class="set-row">
        <span class="ic-tile tint-violet"><ui-icon name="type"/></span>
        <div class="lbl"><div class="t">Easy-read spacing</div><div class="d">Extra space between letters, words and lines</div></div>
        <div class="ctl"><button class="switch" [class.on]="easy" (click)="toggleEasy()" role="switch" [attr.aria-checked]="easy" aria-label="Easy-read spacing"></button></div>
      </div>
      <div class="set-row">
        <span class="ic-tile tint-amber"><ui-icon name="palette"/></span>
        <div class="lbl"><div class="t">Background</div><div class="d">Cream is gentler on the eyes for many readers</div></div>
        <div class="ctl wide">
          <div class="segmented">
            <button [class.on]="bg === 'cream'" (click)="setBg('cream')">Cream</button>
            <button [class.on]="bg === 'white'" (click)="setBg('white')">White</button>
            <button [class.on]="bg === 'dark'" (click)="setBg('dark')">Dark</button>
          </div>
        </div>
      </div>
      <div class="set-row">
        <span class="ic-tile tint-green"><ui-icon name="bell"/></span>
        <div class="lbl"><div class="t">Game sounds</div><div class="d">Chimes for right answers and level-ups</div></div>
        <div class="ctl"><button class="switch" [class.on]="sp.sfxOn" (click)="sp.toggleSfx()" role="switch" [attr.aria-checked]="sp.sfxOn" aria-label="Game sounds"></button></div>
      </div>
    </section>
    <p class="note" style="text-align:center;margin-top:20px">Voice and display settings are saved on this device.</p>
  </div>
  `
})
export class SettingsComponent {
  sp = inject(SpeechService);
  fb = inject(FirebaseService);
  private store = inject(StoreService);
  rate = this.sp.rate; src = this.sp.voiceSrc; accent = this.sp.voiceAccent; voiceName = this.sp.chosen?.name || '';
  easy = this.store.get('easy', true); bg: string = this.store.get<string>('bg', 'cream');

  get userName() { const u = this.fb.user(); return u ? (u.displayName || u.email || 'Signed in') : 'Guest learner'; }
  get initial() { return (this.fb.user()?.displayName || this.fb.user()?.email || 'G').trim().charAt(0).toUpperCase(); }
  get photo() { return this.fb.user()?.photoURL || ''; }

  setSrc(v: string) { this.src = v; this.sp.setSrc(v); }
  toggleEasy() { this.easy = !this.easy; this.store.set('easy', this.easy); this.store.applyTheme(); }
  setBg(v: string) { this.bg = v; this.store.set('bg', v); this.store.applyTheme(); }
}

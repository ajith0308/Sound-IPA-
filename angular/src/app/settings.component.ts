import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SpeechService } from './speech.service';
import { StoreService } from './store.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="appbar"><a routerLink="/"><button class="sec">← Home</button></a><div class="appbar-title">⚙️ Settings</div></div>
  <div class="card">
    <div class="setrow">
      <div class="setlabel">🔊 Speaking speed</div>
      <div class="row"><input type="range" min="0.4" max="1" step="0.05" [(ngModel)]="rate" (ngModelChange)="sp.setRate(rate)"><span>{{ rate }}×</span></div>
    </div>
    <div class="setrow">
      <div class="setlabel">Voice</div>
      <select [(ngModel)]="src" (ngModelChange)="sp.setSrc(src)">
        <option value="online">Clear voice (online)</option>
        <option value="device">Device voice</option>
      </select>
    </div>
    @if (src === 'online') {
      <div class="setrow">
        <div class="setlabel">Accent</div>
        <select [(ngModel)]="accent" (ngModelChange)="sp.setAccent(accent)">
          <option value="en-GB">English (UK)</option><option value="en">English (US)</option>
          <option value="en-AU">English (Australia)</option><option value="en-IN">English (India)</option>
        </select>
      </div>
    } @else {
      <div class="setrow">
        <div class="setlabel">Device voice</div>
        <select [(ngModel)]="voiceName" (ngModelChange)="sp.setVoice(voiceName)">
          @for (v of sp.voices; track v.name) { <option [value]="v.name">{{ v.name }} ({{ v.lang }})</option> }
        </select>
      </div>
    }
    <div class="setrow"><div class="setlabel">Preview</div><button class="sec" (click)="sp.say('Hello! This is your spelling voice.')">🔊 Test</button></div>
    <div class="setrow"><div class="setlabel">Easy-read font</div><span class="toggle" [class.on]="easy" (click)="toggleEasy()">{{ easy ? 'On' : 'Off' }}</span></div>
    <div class="setrow"><div class="setlabel">Background</div><span class="toggle" [class.on]="bg!=='cream'" (click)="cycleBg()">{{ bgLabel }}</span></div>
    <div class="setrow"><div class="setlabel">Game sounds</div><span class="toggle" [class.on]="sp.sfxOn" (click)="sp.toggleSfx()">{{ sp.sfxOn ? '🔔 On' : '🔕 Off' }}</span></div>
    <p class="note">These settings are saved on this device.</p>
  </div>
  `
})
export class SettingsComponent {
  sp = inject(SpeechService);
  private store = inject(StoreService);
  rate = this.sp.rate; src = this.sp.voiceSrc; accent = this.sp.voiceAccent; voiceName = this.sp.chosen?.name || '';
  easy = this.store.get('easy', true); bg: string = this.store.get<string>('bg', 'cream');
  get bgLabel() { return this.bg === 'cream' ? 'Cream' : this.bg === 'white' ? 'White' : 'Dark'; }
  toggleEasy() { this.easy = !this.easy; this.store.set('easy', this.easy); document.body.classList.toggle('easy', this.easy); }
  cycleBg() {
    const modes = ['cream', 'white', 'dark']; this.bg = modes[(modes.indexOf(this.bg) + 1) % 3]; this.store.set('bg', this.bg);
    document.body.classList.toggle('plainwhite', this.bg === 'white'); document.body.classList.toggle('dark', this.bg === 'dark');
  }
}

import { Component, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
  <div class="login-hero">
    <div class="login-logo">🏆</div>
    <h1>Sound &amp; Spell</h1>
    <p class="hint">Learn English spelling with sounds, a 30-day quest, XP, stars and badges — designed to be easy to read for dyslexic learners.</p>
    <button class="gbtn" (click)="fb.signInGoogle()"><span style="color:#4285F4;font-weight:bold;font-size:19px">G</span> Sign in with Google</button>
    <button class="sec" style="width:100%;margin-top:10px" (click)="fb.continueGuest()">Continue without signing in</button>
    <p class="hint" style="margin-top:16px">{{ fb.status }}</p>
  </div>
  `
})
export class LoginComponent { fb = inject(FirebaseService); }

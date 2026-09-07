import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SpeechService } from './speech.service';

@Component({
  selector: 'app-say',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="appbar"><a routerLink="/"><button class="sec">← Home</button></a><div class="appbar-title">🔊 Say a word</div></div>
  <div class="card">
    <input type="text" [(ngModel)]="word" (ngModelChange)="render()" placeholder="Type or paste a word…" autocomplete="off">
    <div class="segbox" [innerHTML]="seg"></div>
    <div class="row">
      <button class="big" (click)="sp.say(word.trim(), { rate: 1 })">▶ Say it</button>
      <button class="sec big" (click)="sp.say(word.trim(), { rate: 0.45 })">🐢 Slowly</button>
      <button class="sec" (click)="soundOut()">Sound it out</button>
      <button class="sec" (click)="sp.spell(word.trim())">Spell letters</button>
    </div>
    <p class="note">“Sound it out” voices each chunk (keeping sh, ai, igh, -tion together), then blends the whole word.</p>
  </div>
  `
})
export class SayComponent {
  word = 'beautiful';
  seg = '';
  constructor(public sp: SpeechService) { this.render(); }
  render() { this.seg = this.sp.segHtml(this.word.trim()); }
  soundOut() { const w = this.word.trim(); if (w && !/\s/.test(w)) this.sp.soundOut(w, i => this.seg = this.sp.segHtml(w, i)); }
}

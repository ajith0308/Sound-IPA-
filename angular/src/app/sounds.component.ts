import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SpeechService } from './speech.service';
import { PHON } from './data';

@Component({
  selector: 'app-sounds',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="appbar"><a routerLink="/"><button class="sec">← Home</button></a><div class="appbar-title">🔤 Sounds &amp; spellings</div></div>
  <div class="card"><p style="margin:0">The 44 sounds of English and the letters that spell them. Tap a card to hear its example words, or tap any underlined word.</p></div>
  @for (grp of PHON; track grp[0]) {
    <div class="grp-title">{{ grp[0] }}</div>
    <div class="sgrid">
      @for (it of grp[1]; track $index) {
        <div class="scard" [class.v]="isVowel(grp[0])" (click)="sayAll(it[3])">
          <div><span class="key">{{ it[0] }}</span> <span class="hint" style="font-size:14px">{{ it[1] }}</span></div>
          <div>@for (s of it[2].split(','); track $index) { <span class="chip">{{ s.trim() }}</span> }</div>
          <div class="words">@for (w of it[3].split(','); track $index) { <b (click)="$event.stopPropagation(); sp.say(w.trim(), { rate: 1 })">{{ w.trim() }}</b> }</div>
        </div>
      }
    </div>
  }
  `
})
export class SoundsComponent {
  PHON = PHON;
  constructor(public sp: SpeechService) {}
  isVowel(group: string) { return /vowel|Diphthong/i.test(group); }
  async sayAll(words: string) { for (const w of words.split(',')) { await this.sp.say(w.trim(), { rate: 1 }); await new Promise(r => setTimeout(r, 150)); } }
}

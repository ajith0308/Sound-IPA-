import { Component } from '@angular/core';
import { SpeechService } from './speech.service';
import { PHON } from './data';
import { UI } from './ui';

@Component({
  selector: 'app-sounds',
  standalone: true,
  imports: [...UI],
  template: `
  <div class="page">
    <ui-page-head title="The 44 Sounds" sub="Each sound of English and the letters that spell it. Tap a card to hear its examples." back="/"/>
    @for (grp of PHON; track grp[0]) {
      <h2 class="section-title">
        <span>{{ grp[0] }}</span>
        <span class="chip" [class.vowel]="isVowel(grp[0])" [class.primary]="!isVowel(grp[0])">{{ grp[1].length }} sounds</span>
      </h2>
      <div class="sound-grid">
        @for (it of grp[1]; track $index) {
          <div class="scard" [class.v]="isVowel(grp[0])" (click)="sayAll(it[3])" role="button" tabindex="0" (keydown.enter)="sayAll(it[3])">
            <div class="scard-head">
              <span class="key">{{ it[0] }}</span>
              <div style="min-width:0">
                <div class="ipa">{{ it[1] }}</div>
                <div class="spell-row" style="margin-top:4px">@for (s of it[2].split(','); track $index) { <span class="chip">{{ s.trim() }}</span> }</div>
              </div>
              <span class="icon-btn sm play-mini" aria-hidden="true"><ui-icon name="volume"/></span>
            </div>
            <div class="word-pills">
              @for (w of it[3].split(','); track $index) {
                <button class="word-pill" (click)="$event.stopPropagation(); sp.say(w.trim(), { rate: 1 })">{{ w.trim() }}</button>
              }
            </div>
          </div>
        }
      </div>
    }
  </div>
  `
})
export class SoundsComponent {
  PHON = PHON;
  constructor(public sp: SpeechService) {}
  isVowel(group: string) { return /vowel|Diphthong/i.test(group); }
  async sayAll(words: string) { for (const w of words.split(',')) { await this.sp.say(w.trim(), { rate: 1 }); await new Promise(r => setTimeout(r, 150)); } }
}

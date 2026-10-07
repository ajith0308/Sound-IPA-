import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpeechService } from './speech.service';
import { GRAMMAR, GQ } from './data';
import { UI } from './ui';

@Component({
  selector: 'app-grammar',
  standalone: true,
  imports: [FormsModule, ...UI],
  template: `
  <div class="page narrow">
    <ui-page-head title="Grammar Practice" sub="Choose the correct sentence, then learn why" back="/"/>

    <div class="toolbar">
      <select class="select" [(ngModel)]="topic" (ngModelChange)="start()" aria-label="Topic">
        @for (t of topics; track t) { <option [value]="t">{{ t === 'All' ? 'All topics' : t }}</option> }
      </select>
    </div>

    @if (!done) {
      <section class="card quiz-card">
        <div class="quiz-top">
          <span class="count">{{ idx + 1 }} / {{ total }}</span>
          <div class="progress"><i [style.width.%]="idx / total * 100"></i></div>
          <span class="chip success" title="Correct so far"><ui-icon name="check"/>{{ right }}</span>
        </div>
        <div class="quiz-body" style="align-items:stretch">
          <div class="eyebrow" style="text-align:left">{{ q[4] }}</div>
          <p class="question">{{ q[0] }}</p>
          <div class="options">
            @for (o of q[1]; track $index) {
              <button class="option" [class.good]="answered && $index === q[2]" [class.bad]="answered && $index === chosen && $index !== q[2]"
                      [disabled]="answered" (click)="pick($index)">
                <span class="key">
                  @if (answered && $index === q[2]) { <ui-icon name="check"/> }
                  @else if (answered && $index === chosen) { <ui-icon name="x"/> }
                  @else { {{ 'ABCDEF'[$index] }} }
                </span>
                <span>{{ o }}</span>
              </button>
            }
          </div>
          @if (answered) {
            <div class="feedback" [class.good]="chosen === q[2]" [class.bad]="chosen !== q[2]" style="max-width:none">
              <ui-icon [name]="chosen === q[2] ? 'checkCircle' : 'xCircle'"/>{{ chosen === q[2] ? 'Correct!' : 'Not quite.' }}
            </div>
            <div class="explain"><ui-icon name="bulb"/><span>{{ q[3] }}</span></div>
            <button class="btn btn-primary btn-lg btn-block" style="margin-top:16px" (click)="nextQ()">
              {{ idx < list.length - 1 ? 'Next question' : 'See results' }}<ui-icon name="arrow"/>
            </button>
          }
        </div>
      </section>
    } @else {
      <section class="card result">
        <ui-ring [size]="148" [stroke]="12" [value]="pct" [color]="pct >= 70 ? 'var(--success)' : pct >= 50 ? 'var(--warn)' : 'var(--danger)'">
          <div><div style="font-size:36px;font-weight:700">{{ pct }}%</div><div class="muted small">score</div></div>
        </ui-ring>
        <h2>{{ pct >= 90 ? 'Brilliant!' : pct >= 70 ? 'Well done!' : 'Keep practising!' }}</h2>
        <p>You answered {{ right }} of {{ total }} correctly.</p>
        <div class="result-actions"><button class="btn btn-primary btn-lg" (click)="start()"><ui-icon name="retry"/>Practise again</button></div>
      </section>
    }
  </div>
  `
})
export class GrammarComponent {
  topics: string[] = ['All', ...Array.from(new Set(GRAMMAR.map(q => q[4])))];
  topic = 'All';
  list: GQ[] = []; idx = 0; right = 0; total = 0; answered = false; chosen = -1; done = false; pct = 0;
  constructor(private sp: SpeechService) { this.start(); }
  private shuffle<T>(a: T[]) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  get q(): GQ { return this.list[this.idx] || GRAMMAR[0]; }
  start() {
    const pool = GRAMMAR.filter(q => this.topic === 'All' || q[4] === this.topic);
    this.list = this.shuffle(pool); this.idx = 0; this.right = 0; this.total = this.list.length;
    this.done = false; this.answered = false; this.chosen = -1;
  }
  pick(i: number) {
    if (this.answered) return; this.answered = true; this.chosen = i;
    if (i === this.q[2]) { this.right++; this.sp.sfxCorrect(); } else this.sp.sfxWrong();
  }
  nextQ() {
    this.answered = false; this.chosen = -1;
    if (this.idx < this.list.length - 1) this.idx++; else { this.pct = this.total ? Math.round(this.right / this.total * 100) : 0; if (this.pct >= 70) this.sp.sfxFanfare(); this.done = true; }
  }
}

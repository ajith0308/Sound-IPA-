import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from './store.service';
import { UI } from './ui';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [FormsModule, ...UI],
  template: `
  <div class="page narrow">
    <ui-page-head title="Word Lists" sub="Build your own lists and test yourself on them" back="/"/>

    <section class="card">
      <div class="label">Start from a saved list</div>
      <div class="row" style="gap:8px">
        @for (n of names; track n) { <button class="chip" [class.on]="name === n" (click)="loadPreset(n)">{{ n }}</button> }
      </div>
    </section>

    <section class="card">
      <label class="label" for="lst-name">List name</label>
      <input id="lst-name" class="field" type="text" [(ngModel)]="name" placeholder="e.g. Week 5 spellings" autocomplete="off">

      <div class="row" style="justify-content:space-between;margin:18px 0 8px">
        <label class="label" for="lst-words" style="margin:0">Words</label>
        <span class="chip" [class.primary]="count > 0">{{ count }} {{ count === 1 ? 'word' : 'words' }}</span>
      </div>
      <textarea id="lst-words" class="field" [(ngModel)]="text" placeholder="One word per line, or separated by commas&#10;monday&#10;because&#10;friend" spellcheck="false" autocapitalize="off"></textarea>

      @if (msg) { <div class="feedback" [class.good]="ok" [class.bad]="!ok" style="max-width:none"><ui-icon [name]="ok ? 'checkCircle' : 'xCircle'"/>{{ msg }}</div> }

      <div class="row" style="margin-top:18px">
        <button class="btn btn-secondary btn-lg" style="flex:1 1 160px" (click)="save()"><ui-icon name="save"/>Save list</button>
        <button class="btn btn-primary btn-lg" style="flex:1 1 160px" (click)="use()"><ui-icon name="pencil"/>Test these words</button>
      </div>
      <p class="note">Saved lists stay on this device, and sync to your account when you are signed in.</p>
    </section>
  </div>
  `
})
export class ListsComponent {
  private store = inject(StoreService);
  private router = inject(Router);
  name = ''; text = ''; msg = ''; ok = true;
  names: string[] = Object.keys(this.store.allLists());
  get count() { return this.parse(this.text).length; }
  private parse(t: string) { return t.split(/[\n,]+/).map(s => s.trim()).filter(Boolean); }
  loadPreset(n: string) { this.text = (this.store.allLists()[n] || []).join('\n'); this.name = n; this.msg = ''; }
  save() {
    const words = this.parse(this.text);
    if (!this.name.trim()) { this.ok = false; this.msg = 'Please give your list a name.'; return; }
    if (!words.length) { this.ok = false; this.msg = 'Please type some words first.'; return; }
    const saved = this.store.get<any>('lists_ng', {}); saved[this.name] = words; this.store.set('lists_ng', saved);
    this.names = Object.keys(this.store.allLists()); this.ok = true; this.msg = `Saved “${this.name}” (${words.length} words).`;
  }
  use() {
    const words = this.parse(this.text);
    if (!words.length) { this.ok = false; this.msg = 'Please type some words first.'; return; }
    this.store.pendingTest = { name: this.name.trim() || 'Your words', words, day: null };
    this.router.navigate(['/test']);
  }
}

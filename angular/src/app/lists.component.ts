import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { StoreService } from './store.service';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="appbar"><a routerLink="/"><button class="sec">← Home</button></a><div class="appbar-title">📝 Word lists</div></div>
  <div class="card">
    <div class="row" style="margin-bottom:12px">
      @for (n of names; track n) { <button class="sec" (click)="loadPreset(n)">{{ n }}</button> }
    </div>
    <label class="hint">Your words (one per line, or comma-separated):</label>
    <textarea [(ngModel)]="text" style="min-height:150px;font-size:20px;margin-top:8px" placeholder="monday&#10;because&#10;friend"></textarea>
    <div class="row" style="margin-top:12px">
      <input type="text" [(ngModel)]="name" placeholder="List name (e.g. Week 5)" style="flex:1;font-size:18px;min-width:180px">
      <button (click)="save()">💾 Save list</button>
      <button class="sec" (click)="use()">Test these →</button>
    </div>
    <p class="note">{{ msg }}</p>
  </div>
  `
})
export class ListsComponent {
  private store = inject(StoreService);
  private router = inject(Router);
  name = ''; text = ''; msg = 'Saved lists stay on this device and load automatically next time.';
  names: string[] = Object.keys(this.store.allLists());
  private parse(t: string) { return t.split(/[\n,]+/).map(s => s.trim()).filter(Boolean); }
  loadPreset(n: string) { this.text = (this.store.allLists()[n] || []).join('\n'); this.name = n; }
  save() {
    const words = this.parse(this.text);
    if (!this.name.trim()) { this.msg = 'Please give your list a name.'; return; }
    if (!words.length) { this.msg = 'Please type some words first.'; return; }
    const saved = this.store.get<any>('lists_ng', {}); saved[this.name] = words; this.store.set('lists_ng', saved);
    this.names = Object.keys(this.store.allLists()); this.msg = `Saved “${this.name}” (${words.length} words).`;
  }
  use() {
    const words = this.parse(this.text);
    if (!words.length) { this.msg = 'Please type some words first.'; return; }
    this.store.pendingTest = { name: this.name.trim() || 'Your words', words, day: null };
    this.router.navigate(['/test']);
  }
}

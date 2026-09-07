import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home.component').then(m => m.HomeComponent) },
  { path: 'test', loadComponent: () => import('./test.component').then(m => m.TestComponent) },
  { path: 'say', loadComponent: () => import('./say.component').then(m => m.SayComponent) },
  { path: 'sounds', loadComponent: () => import('./sounds.component').then(m => m.SoundsComponent) },
  { path: 'dictionary', loadComponent: () => import('./dictionary.component').then(m => m.DictionaryComponent) },
  { path: 'quest', loadComponent: () => import('./quest.component').then(m => m.QuestComponent) },
  { path: 'grammar', loadComponent: () => import('./grammar.component').then(m => m.GrammarComponent) },
  { path: 'progress', loadComponent: () => import('./progress.component').then(m => m.ProgressComponent) },
  { path: 'lists', loadComponent: () => import('./lists.component').then(m => m.ListsComponent) },
  { path: 'settings', loadComponent: () => import('./settings.component').then(m => m.SettingsComponent) },
  { path: '**', redirectTo: '' }
];

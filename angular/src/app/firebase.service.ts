import { Injectable, inject, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, Auth, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, Firestore, DocumentReference } from 'firebase/firestore';
import { StoreService } from './store.service';

const CFG = {
  apiKey: 'AIzaSyCKcGJ5KiwfpQsCr6yt2-ckuWpGgOD1cEc',
  authDomain: 'soundspellquest-ajith0308.firebaseapp.com',
  projectId: 'soundspellquest-ajith0308',
  storageBucket: 'soundspellquest-ajith0308.firebasestorage.app',
  messagingSenderId: '835863162292',
  appId: '1:835863162292:web:eb53467071d78a077716e1'
};

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private store = inject(StoreService);
  user = signal<User | null>(null);
  ready = signal(false);
  guest = signal(this.store.get('guest', false));
  status = '';
  private auth: Auth | null = null;
  private db: Firestore | null = null;
  private unsub: (() => void) | null = null;
  private saveTimer: any = null;
  private applying = false;

  constructor() {
    this.store.onSave = () => this.queueSave();
    try {
      const app = initializeApp(CFG);
      this.auth = getAuth(app);
      this.db = getFirestore(app);
      onAuthStateChanged(this.auth, (u) => {
        this.user.set(u);
        this.ready.set(true);
        if (u) { this.store.set('guest', false); this.guest.set(false); this.loadCloud(u.uid); }
        else if (this.unsub) { this.unsub(); this.unsub = null; }
      });
    } catch (e) {
      console.error('Firebase init failed', e);
      this.ready.set(true);
      this.status = 'Sign-in unavailable (Firebase failed to start).';
    }
  }

  async signInGoogle() {
    if (!this.auth) { this.status = 'Sign-in unavailable.'; return; }
    this.status = 'Opening Google sign-in…';
    try { await signInWithPopup(this.auth, new GoogleAuthProvider()); this.status = ''; }
    catch (e: any) { this.status = this.errMsg(e); console.error('sign-in failed', e); }
  }
  async signOutUser() { try { if (this.auth) await signOut(this.auth); } catch {} this.store.set('guest', false); this.guest.set(false); }
  continueGuest() { this.store.set('guest', true); this.guest.set(true); }
  backToLogin() { this.store.set('guest', false); this.guest.set(false); }

  private errMsg(e: any): string {
    const c = e && e.code;
    if (c === 'auth/popup-blocked') return 'The browser blocked the sign-in popup — allow popups and try again.';
    if (c === 'auth/popup-closed-by-user') return 'Sign-in was closed before completing.';
    if (c === 'auth/unauthorized-domain') return 'This web address is not authorised in Firebase Authentication settings.';
    if (c === 'auth/operation-not-allowed' || c === 'auth/configuration-not-found') return 'Google sign-in is not enabled for this Firebase project.';
    return 'Google sign-in failed. Check the console for details.';
  }

  private ref(uid: string): DocumentReference { return doc(this.db!, 'users', uid, 'progress', 'main'); }

  private async loadCloud(uid: string) {
    if (!this.db) return;
    this.status = 'Loading your progress…';
    try {
      const snap = await getDoc(this.ref(uid));
      if (snap.exists()) this.applyRemote(snap.data());
      await this.saveNow();
      if (this.unsub) this.unsub();
      this.unsub = onSnapshot(this.ref(uid), (s) => { if (s.exists()) this.applyRemote(s.data()); this.status = 'Synced.'; });
    } catch (e) { console.error('cloud load failed', e); this.status = 'Could not load cloud progress (local saved).'; }
  }
  private applyRemote(data: any) {
    if (!data || !data.game) return;
    this.applying = true;
    try { this.store.mergeRemote(data.game, data.lists); } finally { this.applying = false; }
  }
  queueSave() {
    if (this.applying || !this.user() || !this.db) return;
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.saveNow(), 800);
  }
  async saveNow() {
    const u = this.user(); if (!u || !this.db) return;
    try {
      await setDoc(this.ref(u.uid), { game: this.store.G, lists: this.store.get('lists_ng', {}), updatedAt: Date.now() }, { merge: true });
      this.status = 'Synced.';
    } catch (e) { console.error('sync failed', e); this.status = 'Could not sync (local saved).'; }
  }
}

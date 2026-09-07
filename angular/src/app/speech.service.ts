import { Injectable } from '@angular/core';
import { splitGraphemes, isVowelChunk, soundFor, SPEAK_AS } from './data';

@Injectable({ providedIn: 'root' })
export class SpeechService {
  rate = this.g('rate', 0.8);
  voiceSrc = this.g('voiceSrc', 'online');   // 'online' | 'device'
  voiceAccent = this.pickAccent();               // UK English by default (US says "hot" as "haht")
  voices: SpeechSynthesisVoice[] = [];
  chosen: SpeechSynthesisVoice | null = null;
  private token = 0;
  private curAudio: HTMLAudioElement | null = null;

  constructor() { this.loadVoices(); if ('onvoiceschanged' in speechSynthesis) (speechSynthesis as any).onvoiceschanged = () => this.loadVoices(); }

  // Default is British English. Devices that still carry the old US default are moved over once;
  // any accent chosen after that in Settings is kept.
  private pickAccent(): string {
    const saved = this.g<string | null>('voiceAccent', null);
    if (saved && saved !== 'en') return saved;
    if (saved === 'en' && this.g('accentV2', false)) return saved;
    this.s('voiceAccent', 'en-GB'); this.s('accentV2', true); return 'en-GB';
  }
  private g<T>(k: string, d: T): T { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } }
  private s(k: string, v: any) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  setRate(r: number) { this.rate = r; this.s('rate', r); }
  setSrc(v: string) { this.voiceSrc = v; this.s('voiceSrc', v); }
  setAccent(a: string) { this.voiceAccent = a; this.s('voiceAccent', a); this.s('accentV2', true); }
  setVoice(name: string) { this.chosen = this.voices.find(v => v.name === name) || null; this.s('voice', name); }

  loadVoices() {
    let vs = speechSynthesis.getVoices().filter(v => /en(-|_|$)/i.test(v.lang));
    if (!vs.length) vs = speechSynthesis.getVoices();
    this.voices = vs;
    const saved = this.g<string | null>('voice', null);
    this.chosen = vs.find(v => v.name === saved) || vs.find(v => /en-GB/i.test(v.lang)) || vs[0] || null;
  }

  private ttsUrl(text: string, slow = false) {
    return 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=' +
      encodeURIComponent(this.voiceAccent || 'en') +
      (slow ? '&ttsspeed=0.3' : '') +
      '&q=' + encodeURIComponent(text);
  }
  private stop() { try { speechSynthesis.cancel(); } catch {} if (this.curAudio) { try { this.curAudio.pause(); } catch {} this.curAudio = null; } }

  say(text: string, opts: { rate?: number } = {}): Promise<void> {
    const my = ++this.token; this.stop();
    const r = opts.rate ?? this.rate;
    const spoken = SPEAK_AS[text.toLowerCase()] ?? text;   // pronunciation override
    const slow = r < 0.65;                                  // ask Google for a natively-slow clip
    if (this.voiceSrc === 'online' && navigator.onLine !== false) {
      return new Promise<void>(res => {
        const a = new Audio(this.ttsUrl(spoken, slow)); this.curAudio = a;
        // No playbackRate time-stretch: it smears consonant blends (gr/gl/dr). Slow speech
        // comes from Google's own slow render (ttsspeed) so the audio stays crisp.
        let done = false; const fin = (ok?: boolean) => { if (done) return; done = true; if (ok === false && my === this.token) { this.deviceSay(spoken, r, my).then(() => res()); } else res(); };
        a.onended = () => fin(true); a.onerror = () => fin(false);
        a.play().then(() => {}, () => fin(false));
      });
    }
    return this.deviceSay(spoken, r, my);
  }
  private deviceSay(text: string, r: number, my: number): Promise<void> {
    return new Promise<void>(res => {
      try { speechSynthesis.cancel(); } catch {}
      if (my !== this.token) { res(); return; }
      const u = new SpeechSynthesisUtterance(text);
      if (this.chosen) u.voice = this.chosen;
      u.rate = r; u.pitch = 1;
      let done = false; const fin = () => { if (!done) { done = true; res(); } };
      u.onend = fin; u.onerror = fin; speechSynthesis.speak(u);
    });
  }
  spell(word: string) { return this.say([...word].join(', '), { rate: 0.7 }); }

  segHtml(word: string, active = -1): string {
    return splitGraphemes(word).map((g, i) =>
      `<span class="seg ${isVowelChunk(g) ? 'vwl' : ''} ${i === active ? 'on' : ''}">${g}</span>`).join('');
  }
  private soundingOut = false;
  async soundOut(word: string, render: (i: number) => void) {
    if (this.soundingOut) return; this.soundingOut = true;
    const chunks = splitGraphemes(word); this.stop();
    for (let i = 0; i < chunks.length; i++) { render(i); await this.say(soundFor(chunks[i]), { rate: 0.75 }); await this.wait(140); }
    render(-1); await this.wait(300); await this.say(word, { rate: 0.55 }); this.soundingOut = false;
  }
  private wait(ms: number) { return new Promise(r => setTimeout(r, ms)); }

  // sound effects
  private actx: AudioContext | null = null;
  sfxOn = this.g('sfx', true);
  toggleSfx() { this.sfxOn = !this.sfxOn; this.s('sfx', this.sfxOn); if (this.sfxOn) this.sfxCorrect(); }
  private beep(freq: number, dur = 0.12, type: OscillatorType = 'sine', when = 0) {
    if (!this.sfxOn) return;
    try {
      this.actx = this.actx || new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = this.actx.createOscillator(), g = this.actx.createGain();
      o.type = type; o.frequency.value = freq; o.connect(g); g.connect(this.actx.destination);
      const t = this.actx.currentTime + when;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.start(t); o.stop(t + dur);
    } catch {}
  }
  sfxCorrect() { this.beep(660, 0.1); this.beep(990, 0.13, 'sine', 0.09); }
  sfxWrong() { this.beep(180, 0.2, 'square'); }
  sfxFanfare() { [523, 659, 784, 1047].forEach((f, i) => this.beep(f, 0.2, 'triangle', i * 0.12)); }
}

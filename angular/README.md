# Sound & Spell — Angular

The app rewritten in **Angular 17** (standalone components + router). The **Speaking** module has been removed.

## Modules & activities
- **Spelling**: 30-Day Quest (study flashcards + test, sequential day locking that unlocks the next day at ≥89%), Spelling Test, Say a word (hear / sound-it-out / spell), Sounds (44 phonemes), Word lists, My Progress (accuracy, time-on-task chart, improvement chart, tricky words, weak areas).
- **Grammar**: 40 multiple-choice exercises across 8 topics with feedback + explanations.
- Gamification (XP, levels, streak, stars, badges), dyslexia-friendly theming (easy-read font, cream/white/dark), TTS (clear online voice + device voices), all saved in `localStorage`.

## Run locally
```bash
cd angular
npm install
npm start          # http://localhost:4200
```

## Build for production
```bash
cd angular
npm install
npm run build      # outputs to angular/dist/sound-spell/browser
```

## Deploy to Firebase
The repo's `firebase.json` already points hosting at `angular/dist/sound-spell/browser`.
```bash
# from the repo root, after building above:
firebase deploy --only hosting
```

## Notes
- This is a fresh Angular project alongside the old single-file app (the old `index.html` at the repo root is no longer served once you deploy this build).
- Progress is stored on the device (`localStorage`). Cloud sign-in / Firestore sync from the old app was **not** ported in this pass — say the word and it can be added with `@angular/fire`.
- Structure: `src/app/data.ts` (lessons, grammar, sounds), `store.service.ts` (game state + gamification + persistence), `speech.service.ts` (TTS + sound-out + sfx), one component per screen, routes in `app.routes.ts`.

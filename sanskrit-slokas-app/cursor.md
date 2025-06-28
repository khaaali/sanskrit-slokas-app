# Sanskrit Slokas App – Development Context & Roadmap

## Project Overview
A modern, responsive web app for learning Sanskrit slokas (shlokas) with audio playback, waveform visualization, and multi-language support. Built with Next.js, Tailwind CSS, and WaveSurfer.js.

---

## 1. Current Features
- **Browse Slokas:** View slokas by deity or scripture, with original text, transliteration, and meaning.
- **Audio Playback:** Professional audio player with waveform visualization (WaveSurfer.js), play/pause, loop, and seek controls.
- **Learning Mode:** Dedicated learner view for step-by-step sloka learning.
- **Multi-language Support:** Display meanings in multiple languages.
- **Responsive UI:** Mobile-friendly, modern design.
- **Robust States:** Handles loading and error states gracefully.

---

## 2. Project Structure
```
sanskrit-slokas-app/
├── public/
│   ├── audio/         # Audio files (user-provided)
│   ├── data/
│   │   └── slokas.json # Sloka data (text, transliteration, meaning, audio refs)
│   └── *.svg          # UI icons
├── src/
│   ├── app/
│   │   ├── learn/     # Learner view (audio + sloka)
│   │   └── slokas/    # Sloka collections by deity/scripture
│   ├── components/    # UI components (AudioPlayer, SlokaCard, etc.)
│   └── lib/           # Data utilities
├── package.json       # Dependencies & scripts
├── tailwind.config.js # Tailwind CSS config
├── next.config.ts     # Next.js config
└── README.md          # Project info
```

---

## 3. Key Files & Their Roles
- **public/data/slokas.json**: Central data file for all slokas (text, transliteration, meaning, audio filename, tags).
- **src/app/slokas/scripture/[scripture]/page.tsx**: Scripture/book view – lists all slokas for a given scripture.
- **src/app/learn/[scriptureTitle]/[verseIndex]/page.tsx**: Learner view for a specific sloka (with audio, step-by-step).
- **src/components/AudioPlayer.tsx**: Custom audio player with waveform and controls.
- **src/components/SlokaCard.tsx**: Card UI for displaying a single sloka.
- **src/components/SlokaLearner.tsx**: Interactive learning component for slokas.
- **src/lib/data.ts**: Data loading and utility functions.

---

## 4. Data Flow
- **Sloka Data** is loaded from `public/data/slokas.json` via utility functions in `src/lib/data.ts`.
- **Pages** (in `src/app/`) fetch and display sloka data, passing it to components.
- **Audio** is referenced by filename in sloka data and loaded from `public/audio/`.
- **Components** (AudioPlayer, SlokaCard, etc.) receive props and render UI accordingly.

---

## 5. Planned Features & Ideas
- **Book View:**
  - Dedicated page to read an entire scripture/book in a continuous scroll (all slokas, with audio and meanings).
  - Add navigation (chapter/verse), search, and bookmarking.
- **User Progress Tracking:**
  - Track which slokas a user has learned or listened to.
  - Optionally store progress in localStorage or via user accounts.
- **Quiz/Practice Mode:**
  - Interactive quizzes for sloka recall, fill-in-the-blanks, or audio-based practice.
- **Enhanced Audio Features:**
  - Adjustable playback speed, AB repeat, and waveform zoom.
- **Admin/Editor UI:**
  - Interface to add/edit slokas, upload audio, and manage translations.
- **Offline Support:**
  - Enable PWA features for offline access to slokas and audio.
- **Accessibility Improvements:**
  - Better screen reader support, font size adjustments, and color contrast options.

---

## 6. Development Notes & Todos
- [ ] Refactor sloka data loading for scalability (pagination, lazy loading).
- [ ] Improve error handling for missing audio files.
- [ ] Add unit and integration tests for key components.
- [ ] Document data schema for slokas.json.
- [ ] Optimize mobile UI for small screens.
- [ ] Add feature flags for experimental features.

---

## 7. Useful References
- [Next.js Documentation](https://nextjs.org/docs)
- [WaveSurfer.js Docs](https://wavesurfer-js.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 8. How to Use This File
- Update this file as you add new features, refactor code, or make architectural decisions.
- Use the **Development Notes & Todos** section to track ongoing work.
- Use the **Planned Features & Ideas** section to brainstorm and prioritize future work. 
# Sanskrit Slokas App

A modern, responsive web app for learning Sanskrit shlokas (slokas) with audio playback, waveform visualization, and multi-language support. Built with Next.js, Tailwind CSS, and WaveSurfer.js.

## Features
- Browse and learn Sanskrit slokas with original text, transliteration, and meaning (multi-language support)
- Professional, mobile-friendly audio player with waveform visualization (WaveSurfer.js)
- Play/pause, loop, and seek controls
- Responsive design for all devices
- Robust error and loading states
- Modern, clean UI/UX

## Project Structure
```
sanskrit-slokas-app/
├── public/
│   ├── audio/         # (ignored in git) Place your audio files here
│   ├── data/          # slokas.json: sloka data
│   └── *.svg          # UI icons
├── src/
│   ├── app/           # Next.js app directory (routing, pages)
│   │   ├── learn/     # Learner view with audio player
│   │   └── slokas/    # Sloka collections by deity/scripture
│   ├── components/    # UI components (SlokaLearner, Header, etc.)
│   └── lib/           # Data utilities
├── package.json       # Project dependencies and scripts
├── tailwind.config.js # Tailwind CSS config
├── next.config.ts     # Next.js config
└── README.md          # Project info (this file)
```

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/khaaali/sanskrit-slokas-app.git
   cd sanskrit-slokas-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Add audio files:**
   - Place your `.mp3` audio files in `public/audio/` (this folder is git-ignored).
   - Update `public/data/slokas.json` to reference your audio files by filename.

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Notes
- **Audio files are not included in the repository.** You must add your own audio files to `public/audio/`.
- The app is organized for easy extension: add new slokas, languages, or features as needed.
- For deployment, see the Next.js documentation for Vercel or your preferred platform.

## License
MIT

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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

## 2. Updated Project Structure (2024)

```
sanskrit-slokas-app/
├── .next/                  # Next.js build output (generated)
├── public/                 # Static assets served at the root
│   ├── audio/              # All audio files, organized by deity/scripture/type
│   │   └── shiva/
│   │       ├── mantra/     # Shiva mantras (e.g., om-namah-shivaya.mp3)
│   │       └── stotram/    # Shiva stotrams, further organized by type
│   │           ├── dakshinamurti/   # e.g., verse_1.mp3, verse_2.mp3, ...
│   │           ├── karpura-gauram/
│   │           ├── nirvana-shatkam/
│   │           └── sadyojata/
│   ├── data/
│   │   └── slokas.json     # Main data file: all slokas, metadata, audio refs
│   └── *.svg               # UI icons and images
├── src/
│   ├── app/                # Next.js App Router (all routes and layouts)
│   │   ├── layout.tsx      # Root layout for the app
│   │   ├── globals.css     # Global styles (Tailwind, custom)
│   │   ├── page.tsx        # Home page ("/" route)
│   │   ├── learn/          # Dynamic learning routes
│   │   │   └── [scriptureTitle]/
│   │   │       └── [verseIndex]/
│   │   │           └── page.tsx   # Learner view for a specific verse
│   │   └── slokas/        # Sloka collections by deity/scripture
│   │       ├── page.tsx   # Slokas landing page
│   │       ├── [deity]/
│   │       │   └── page.tsx   # Slokas for a specific deity
│   │       └── scripture/
│   │           └── [scripture]/
│   │               └── page.tsx   # Slokas for a specific scripture
│   ├── components/         # All reusable UI components
│   │   ├── AudioPlayer.tsx         # Audio player with waveform
│   │   ├── SequentialAudioPlayer.tsx # For sequential playback
│   │   ├── SlokaCard.tsx           # Card UI for slokas
│   │   ├── SlokaLearner.tsx        # Interactive learning component
│   │   ├── SlokaList.tsx           # List of slokas
│   │   ├── SlokasCollection.tsx    # Collection/grid of slokas
│   │   ├── ScriptureTypePageComponent.tsx # Scripture/deity page logic
│   │   ├── LanguageSelector.tsx    # Language switcher
│   │   ├── Features.tsx, Footer.tsx, Header.tsx, Hero.tsx # UI/layout
│   └── lib/
│       └── data.ts         # Data loading and utility functions
├── package.json            # App dependencies and scripts
├── next.config.ts          # Next.js configuration (image domains, etc.)
├── tsconfig.json           # TypeScript configuration
├── eslint.config.mjs       # ESLint configuration
├── postcss.config.mjs      # PostCSS/Tailwind config
├── README.md               # Project overview and instructions
├── cursor.md               # Developer notes, learnings, and roadmap (this file)
└── ...                     # Other config and dotfiles
```

### Directory/Component Explanations
- **public/audio/**: All audio files, organized for easy mapping from sloka data. Subfolders by deity/scripture/type for scalability.
- **public/data/slokas.json**: The single source of truth for all sloka content, metadata, and audio references. Update this file to add new slokas or audio.
- **src/app/**: Uses the Next.js App Router. All routes (static and dynamic) are defined here. Dynamic folders (in square brackets) allow for scripture and verse navigation.
- **src/components/**: All UI and logic components are here. Most are stateless and receive data via props. Key components include AudioPlayer, SlokaLearner, and SlokaCard.
- **src/lib/data.ts**: Contains utility functions for loading and transforming sloka data from JSON.
- **Config files**: Standard Next.js, TypeScript, ESLint, and Tailwind/PostCSS configs for a modern React project.
- **cursor.md**: This file! Contains all developer notes, deployment learnings, and onboarding context.

### Onboarding Tips for New Developers
- **Start with `public/data/slokas.json`** to understand the data model and how slokas are structured.
- **Explore `src/app/`** to see how routes are mapped to components and how dynamic routing works for scriptures and verses.
- **Check `src/components/`** for reusable UI and logic. Most business logic is in these components.
- **Audio files** must be placed in the correct subfolder under `public/audio/` and referenced in `slokas.json`.
- **For deployment:** If using Vercel, ensure the project root is set to `sanskrit-slokas-app` (see section 9 for details).
- **For local dev:** Use `npm run dev` in the `sanskrit-slokas-app` directory. Build with `npm run build` and preview with `npm start`.
- **See the rest of this file** for deployment, troubleshooting, and roadmap notes.

---

## 3. Key Files & Their Roles
- **public/data/slokas.json**: Central data file for all slokas (text, transliteration, meaning, audio refs)
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

---

## 9. Deployment & Vercel Learnings

### Vercel Deployment (Monorepo/Subdirectory)
- When deploying a Next.js app inside a subdirectory (e.g., `sanskrit-slokas-app`), you **must set the project root directory** in Vercel to that subfolder.
- In the Vercel dashboard: Go to **Settings > General > Root Directory** and set it to `sanskrit-slokas-app`.
- If this is not set, Vercel will deploy from the repo root, resulting in a 404 (NOT_FOUND) error for all routes.
- After setting the correct root, redeploy the project. The build should succeed and routes will be available as expected.
- No `vercel.json` is needed for this unless you want advanced configuration; the dashboard setting is sufficient for most cases.
- Always ensure your entry file exists: for App Router, `src/app/page.tsx` must be present; for Pages Router, `pages/index.tsx`.
- If you restructure your repo, double-check the root directory setting in Vercel.

### Troubleshooting 404 Errors on Vercel
- 404 errors after a successful build usually mean Vercel is not finding your app's output (missing or misconfigured root directory, or missing entry file).
- Check the Vercel build logs for clues—if the build completes but no routes are found, it's almost always a root directory or entry file issue.
- Test locally with `npm run build && npm start` from the app directory to ensure your app works before deploying.

---

## 2a. Data Schema Example (`public/data/slokas.json`)

Each entry in `slokas.json` represents a scripture or collection, with an array of slokas (verses/mantras/stotrams). Example:

```json
{
  "deities": ["shiva"],
  "scripture": "Stotram",
  "title": "Karpura Gauram Karunavataram",
  "slokas": [
    {
      "id": 1,
      "originalText": "कर्पूरगौरं करुणावतारं ...",
      "transliteration": {
        "en": "karpūragauraṁ karuṇāvatāraṁ ...",
        "te": "కర్పూర గౌరం కరుణావతారం ..."
      },
      "meaning": {
        "en": "I bow to that camphor-white-complexioned one ...",
        "hi": "मैं उस कपूर-गौर वर्ण वाले ...",
        "te": "కర్పూర గౌరవర్ణుడు ..."
      },
      "audioUrl": "/audio/shiva/stotram/karpura-gauram/karpura_gauram.mp3"
    }
  ]
}
```

**Field explanations:**
- `deities`: Array of deities associated with the scripture (e.g., `"shiva"`).
- `scripture`: The type or name of the scripture (e.g., `"Stotram"`, `"Mantra"`).
- `title`: Human-readable title for the scripture or collection.
- `slokas`: Array of sloka objects, each with:
  - `id`: Unique integer within the group.
  - `originalText`: The Sanskrit text (Devanagari).
  - `transliteration`: Object with keys for each supported language (e.g., `en`, `te`).
  - `meaning`: Object with keys for each supported language (e.g., `en`, `hi`, `te`).
  - `audioUrl`: Path to the audio file in `public/audio/`.

---

## 2b. Component Usage Patterns & Data Flow

### Example: Displaying a Sloka in the Learner View

1. **Route file:** `src/app/learn/[scriptureTitle]/[verseIndex]/page.tsx`
   - Loads sloka data from `slokas.json`.
   - Finds the correct scripture group and verse by slug and index.
   - Passes a `FlattenedSloka` object and group info to the `SlokaLearner` component.

```tsx
// page.tsx (simplified)
const group = getScriptureGroupBySlug(scriptureTitle, slokasData);
const sloka = { ...group.slokas[index], deities: group.deities, scripture: group.scripture, title: group.title };
<SlokaLearner sloka={sloka} slokaIndex={index} group={group} />
```

2. **SlokaLearner component:** `src/components/SlokaLearner.tsx`
   - Receives the sloka, index, and group as props.
   - Handles language switching, verse navigation, and view modes (single/accordion/book view).
   - Renders a `SlokaCard` for each verse, passing the correct text, transliteration, and meaning.
   - Composes the `AudioPlayer` for each verse, passing the `audioUrl` and playback controls.

```tsx
<SlokaCard
  text={verse.originalText}
  transliteration={verse.transliteration}
  transliterationLanguage={language}
  meaning={typeof verse.meaning === 'object' ? verse.meaning[language] : verse.meaning}
  languageSelector={...}
>
  <AudioPlayer audioUrl={verse.audioUrl} ... />
</SlokaCard>
```

3. **SlokaCard component:** `src/components/SlokaCard.tsx`
   - Stateless UI component for displaying a single sloka, its transliteration, and meaning.
   - Accepts children, so the `AudioPlayer` can be rendered inside.

4. **AudioPlayer component:** `src/components/AudioPlayer.tsx`
   - Handles all audio playback, waveform rendering, and controls.
   - Receives the audio file path and playback options as props.
   - Used both for single-verse playback and in sequence (via `SequentialAudioPlayer`).

---

### Data Flow Summary
- Data is loaded from `public/data/slokas.json` at the route level.
- Route files (in `src/app/`) select and flatten the relevant data for the UI.
- Components receive only the data they need as props, making them reusable and testable.
- Audio files are referenced by path in the data and must exist in the correct `public/audio/...` folder.

---

**This pattern—data loaded at the route, passed down via props, and composed into stateless UI components—is used throughout the app for maintainability and clarity.** 

---

## 2c. Guide: Adding New Scriptures, Slokas, or Audio

**To add a new scripture, sloka, or audio file:**

1. **Add the audio file:**
   - Place your `.mp3` file in the appropriate subfolder under `public/audio/`.
   - For example, for a new Shiva stotram: `public/audio/shiva/stotram/my-new-stotram/verse_1.mp3`
   - Create new subfolders as needed to keep audio organized by deity/scripture/type.

2. **Update `public/data/slokas.json`:**
   - Add a new object to the top-level array for a new scripture, or add a new sloka to an existing scripture's `slokas` array.
   - Example for a new scripture:
     ```json
     {
       "deities": ["shiva"],
       "scripture": "Stotram",
       "title": "My New Stotram",
       "slokas": [
         {
           "id": 1,
           "originalText": "...",
           "transliteration": { "en": "...", "te": "..." },
           "meaning": { "en": "...", "hi": "...", "te": "..." },
           "audioUrl": "/audio/shiva/stotram/my-new-stotram/verse_1.mp3"
         }
       ]
     }
     ```
   - For additional verses, add more objects to the `slokas` array with incrementing `id` and correct `audioUrl`.

3. **Check your changes:**
   - Run the app locally (`npm run dev` in `sanskrit-slokas-app`) and navigate to the new scripture/verse route.
   - Confirm the new sloka appears, the text/transliteration/meaning are correct, and the audio plays.

4. **Commit and push:**
   - Commit your changes to `slokas.json` and any new audio files.
   - Push to your repository and redeploy if needed.

**Tips:**
- Always keep audio file names and paths consistent with the `audioUrl` in `slokas.json`.
- Use unique `id` values for each sloka within a scripture.
- Add translations for all supported languages if possible.

---

## 2d. Sample Test: Component Rendering

The project uses [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit testing components.

**Example: Testing the `SlokaCard` component**

```tsx
// src/components/__tests__/SlokaCard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import SlokaCard from '../SlokaCard';

describe('SlokaCard', () => {
  it('renders original text, transliteration, and meaning', () => {
    render(
      <SlokaCard
        text="कर्पूरगौरं करुणावतारं ..."
        transliteration={{ en: 'karpūragauraṁ ...', te: '...' }}
        transliterationLanguage="en"
        meaning="I bow to that camphor-white-complexioned one ..."
      />
    );
    expect(screen.getByText(/कर्पूरगौरं/)).toBeInTheDocument();
    expect(screen.getByText(/karpūragauraṁ/)).toBeInTheDocument();
    expect(screen.getByText(/I bow to that camphor-white-complexioned one/)).toBeInTheDocument();
  });
});
```

**How to run tests:**
- From the `sanskrit-slokas-app` directory, run: `npm test`
- Add more tests in `src/components/__tests__/` as needed for other components. 

---

## 2e. Advanced Testing Patterns

- **Async Components & User Interactions:**
  - Use `await` with `findBy*` queries to test components that fetch or load data asynchronously.
  - Simulate user actions (clicks, typing, etc.) with `user-event`:
    ```tsx
    import userEvent from '@testing-library/user-event';
    // ...
    userEvent.click(screen.getByRole('button', { name: /play/i }));
    expect(screen.getByText(/Paused/)).toBeInTheDocument();
    ```
- **Mocking Audio and External Modules:**
  - For components using `wavesurfer.js` or HTML audio, mock these modules to avoid real playback in tests:
    ```tsx
    jest.mock('wavesurfer.js', () => () => ({
      load: jest.fn(),
      play: jest.fn(),
      pause: jest.fn(),
      on: jest.fn(),
      destroy: jest.fn(),
      getCurrentTime: () => 0,
      getDuration: () => 1,
      seekTo: jest.fn(),
      setPlaybackRate: jest.fn(),
    }));
    ```
- **Testing AudioPlayer Logic:**
  - Test that play/pause buttons update state and call the correct handlers.
  - Use spies/mocks for callback props (`onPlay`, `onPause`).

---

## 2f. Continuous Integration (CI) Setup

**Recommended: Use GitHub Actions for CI.**

- Create a workflow file at `.github/workflows/ci.yml` in your repo:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install -w sanskrit-slokas-app
      - run: npm run lint -w sanskrit-slokas-app
      - run: npm test -w sanskrit-slokas-app
```

- This workflow will run linting and tests on every push and pull request to `main`.
- Customize the workflow for additional steps (build, deploy, etc.) as needed.

---

## 2g. Data Validation Tips

- **Why validate?**
  - Prevents runtime errors from missing fields, typos, or broken audio paths in `slokas.json`.
- **Options:**
  - **JSON Schema:** Use a tool like [ajv](https://ajv.js.org/) to define and validate the schema for `slokas.json`.
  - **TypeScript Types:** Use TypeScript interfaces/types to check structure at compile time (if importing JSON as a module).
  - **Custom Node.js Script:** Write a script to check for required fields, unique IDs, and that all `audioUrl` paths exist in `public/audio/`.
  - **zod:** Use [zod](https://zod.dev/) for runtime validation in TypeScript projects.
- **Example: Simple Node.js Validation Script**
  ```js
  // scripts/validate-slokas.js
  const fs = require('fs');
  const data = require('../public/data/slokas.json');
  data.forEach(group => {
    if (!group.deities || !group.title || !group.slokas) throw new Error('Missing required group fields');
    group.slokas.forEach(sloka => {
      if (!sloka.id || !sloka.originalText || !sloka.transliteration || !sloka.meaning || !sloka.audioUrl) {
        throw new Error(`Missing field in sloka ${group.title} #${sloka.id}`);
      }
      if (!fs.existsSync(`../public${sloka.audioUrl}`)) {
        throw new Error(`Audio file not found: ${sloka.audioUrl}`);
      }
    });
  });
  console.log('Validation passed!');
  ```
- **How to run:** `node scripts/validate-slokas.js`

---

## 2h. Deployment Automation

- **Vercel Git Integration (Recommended):**
  - Connect your GitHub repo to Vercel. Every push to `main` (or any branch) will trigger an automatic deployment.
  - Configure environment variables and project settings in the Vercel dashboard.
- **GitHub Actions for Vercel Deploys:**
  - For more control, use the [vercel-action](https://github.com/marketplace/actions/vercel-action) in a workflow:
    ```yaml
    # .github/workflows/deploy.yml
    name: Deploy to Vercel
    on:
      push:
        branches: [main]
    jobs:
      deploy:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - uses: amondnet/vercel-action@v25
            with:
              vercel-token: ${{ secrets.VERCEL_TOKEN }}
              vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
              vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
              working-directory: ./sanskrit-slokas-app
              prod: true
    ```
  - Set the required secrets in your GitHub repo settings.
  - This workflow will deploy to Vercel on every push to `main`.

---

## 2i. Advanced Data Migration

- **When to migrate?**
  - If you need to update the schema, add new fields, or batch-update many slokas/audio paths.
- **Strategies:**
  - Write Node.js scripts to transform `slokas.json` (e.g., add a new field, update all audio URLs, or migrate to a new structure).
  - Use version control: commit the old and new versions for traceability.
  - Consider adding a `version` field to the JSON for future migrations.
- **Sample migration script:**
  ```js
  // scripts/add-field-to-slokas.js
  const fs = require('fs');
  const path = require('path');
  const dataPath = path.join(__dirname, '../public/data/slokas.json');
  const data = require(dataPath);
  data.forEach(group => {
    group.slokas.forEach(sloka => {
      if (!sloka.difficulty) sloka.difficulty = 'medium'; // Add a new field
    });
  });
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log('Migration complete!');
  ```
- **How to run:** `node scripts/add-field-to-slokas.js`

---

## 2j. Accessibility (a11y) Testing

- **Tools:**
  - [axe-core](https://github.com/dequelabs/axe-core) (with [jest-axe](https://github.com/nickcolley/jest-axe) for automated tests)
  - [Lighthouse](https://developers.google.com/web/tools/lighthouse) (Chrome DevTools)
  - [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) for linting
- **Sample accessibility test:**
  ```tsx
  // src/components/__tests__/SlokaCard.a11y.test.tsx
  import React from 'react';
  import { render } from '@testing-library/react';
  import { axe, toHaveNoViolations } from 'jest-axe';
  import SlokaCard from '../SlokaCard';
  expect.extend(toHaveNoViolations);

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <SlokaCard
        text="कर्पूरगौरं ..."
        transliteration={{ en: 'karpūragauraṁ ...', te: '...' }}
        transliterationLanguage="en"
        meaning="I bow to that camphor-white-complexioned one ..."
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  ```
- **Best Practices:**
  - Use semantic HTML elements (e.g., `<main>`, `<nav>`, `<button>`, `<article>`).
  - Always provide descriptive `alt` text for images/icons.
  - Ensure all interactive elements are keyboard accessible.
  - Maintain sufficient color contrast for text and UI elements.
  - Test with screen readers and keyboard navigation. 

---

## 2k. Internationalization (i18n) Tips

- **Adding new languages:**
  - In `slokas.json`, add new keys to the `transliteration` and `meaning` objects for each supported language (e.g., `fr`, `es`).
  - Example:
    ```json
    "transliteration": { "en": "...", "te": "...", "fr": "..." },
    "meaning": { "en": "...", "hi": "...", "te": "...", "fr": "..." }
    ```
- **UI/UX best practices:**
  - Use a language selector component (see `LanguageSelector.tsx`) to let users switch languages easily.
  - Remember to provide fallback text if a translation is missing.
  - Keep the UI consistent and avoid layout shifts when switching languages.
- **Next.js i18n routing:**
  - For future expansion, consider using [Next.js built-in i18n routing](https://nextjs.org/docs/advanced-features/i18n-routing) for localized URLs and automatic language detection.

---

## 2l. Performance Optimization

- **Image optimization:**
  - Use the Next.js `<Image />` component for all images and icons for automatic resizing and lazy loading.
  - Configure allowed domains in `next.config.ts` for remote images.
- **Static generation:**
  - Use static generation (SSG) for all possible routes to maximize speed and scalability.
  - Use dynamic imports and React.lazy for code splitting and lazy loading of heavy components.
- **Audio optimization:**
  - Compress audio files to a reasonable bitrate for web delivery (e.g., 64–128 kbps for voice).
  - Use short, well-named audio files and avoid unnecessary metadata.
- **Bundle analysis:**
  - Use `next build && npx next analyze` or [next-bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer) to inspect and reduce bundle size.
- **Performance audits:**
  - Run [Lighthouse](https://developers.google.com/web/tools/lighthouse) in Chrome DevTools to identify bottlenecks.
  - Use Next.js Analytics for real-user performance data.

---

## 2m. Advanced Error Handling

- **Next.js error boundaries:**
  - Use `error.js` files in route folders to provide custom error boundaries and fallback UIs for each route.
  - Example: `src/app/learn/[scriptureTitle]/[verseIndex]/error.js` to catch errors in the learner view.
- **User-friendly error messages:**
  - Show clear, actionable messages for missing data, audio, or navigation errors.
  - Use fallback UIs (e.g., "Sloka not found" or "Audio unavailable") instead of blank screens.
- **Production error logging:**
  - Integrate with [Sentry](https://sentry.io/welcome/) or similar services for real-time error monitoring and alerting.
  - Log errors with context (route, user action) for easier debugging. 

---

## 2n. Security Best Practices

- **Keep dependencies up to date:**
  - Regularly run `npm audit` and update packages to patch vulnerabilities.
  - Use Dependabot or similar tools for automated security PRs.
- **Environment variables:**
  - Store secrets (API keys, tokens) in environment variables, not in the repo.
  - Use Vercel's Environment Variables settings for production secrets.
- **Sanitize user input:**
  - Always validate and sanitize any user input, even if the app is mostly static.
  - Use libraries like DOMPurify for any dynamic HTML rendering.
- **Secure HTTP headers:**
  - Set security headers in `next.config.ts` or via Vercel dashboard (CSP, X-Frame-Options, X-Content-Type-Options, etc.).
  - Example in `next.config.ts`:
    ```js
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            // Add Content-Security-Policy as needed
          ],
        },
      ];
    },
    ```
- **HTTPS:**
  - Always use HTTPS in production. Vercel provides SSL by default for all custom and *.vercel.app domains.

---

## 2o. Advanced Analytics

- **Vercel Analytics:**
  - Enable [Vercel Analytics](https://vercel.com/docs/analytics) for real-user performance and traffic insights.
- **Google Analytics or Plausible:**
  - Add the tracking script in your root layout or use a Next.js plugin for analytics.
  - Example (Google Analytics):
    ```tsx
    // src/app/layout.tsx
    {process.env.NEXT_PUBLIC_GA_ID && (
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
    )}
    ```
- **Custom tracking:**
  - Use Next.js Middleware or API routes for advanced event tracking.
- **Privacy & GDPR:**
  - Display a cookie consent banner if tracking users in the EU.
  - Anonymize IP addresses and avoid collecting unnecessary personal data.

---

## 2p. Custom Plugin Integration

- **Adding Next.js plugins:**
  - Install the plugin via npm/yarn and update `next.config.ts` as needed.
  - Example: Adding [next-pwa](https://github.com/shadowwalker/next-pwa) for offline support:
    ```js
    // next.config.js
    const withPWA = require('next-pwa');
    module.exports = withPWA({
      dest: 'public',
      // ...other Next.js config
    });
    ```
  - Example: Adding [@next/mdx](https://github.com/vercel/next.js/tree/canary/packages/next-mdx) for MDX support:
    ```js
    // next.config.js
    const withMDX = require('@next/mdx')();
    module.exports = withMDX({
      // ...other Next.js config
    });
    ```
- **Testing and maintenance:**
  - Test plugins locally and in preview deployments before merging to main.
  - Check plugin compatibility with each Next.js upgrade and review plugin changelogs.

---

## 2q. Pull Request (PR) Workflow & Template

- **PR Template:**
  - The repository includes a standardized Pull Request template at `.github/pull_request_template.md`.
  - This template ensures all PRs include:
    - A clear description and motivation for the change
    - The type of change (bug fix, feature, docs, etc.)
    - A checklist for build, tests, documentation, linting, accessibility, security, and merge review
    - Sections for screenshots and additional reviewer notes
- **PR Process:**
  - Create a new branch from `develop` (or `main` for hotfixes).
  - Open a PR to merge your branch into `develop` (or `main` for releases/hotfixes).
  - Fill out the PR template, complete the checklist, and request review.
  - Ensure all CI checks pass before merging.
  - Use clear, descriptive commit messages and PR titles.
- **Best Practices:**
  - Keep PRs focused and small when possible.
  - Reference related issues in the PR description (e.g., `Fixes #123`).
  - Address reviewer feedback promptly and update the PR as needed.

--- 
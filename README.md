# Pepper Giveaway

A web app for claiming hot pepper seedlings. Built with React, TypeScript, Vite, and Tailwind CSS. Data is stored in Firebase Realtime Database with Google authentication.

Hosted on GitHub Pages.

## Local development prerequisites

- **Node.js** (v24+)
- **Java** (required by Firebase Emulator Suite)
- **Firebase CLI**

### Installing Java on macOS

```bash
brew install openjdk
echo 'export PATH="/opt/homebrew/opt/openjdk/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Verify with `java -version`.

### Installing Firebase CLI

```bash
npm install -g firebase-tools
```

## Setup

```bash
npm install
```

Create a `.env.local` file with your Firebase project credentials:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
```

## Development

Run the Vite dev server and Firebase emulators together:

```bash
npm run dev:full
```

This starts:

- **Vite dev server** at http://localhost:5173
- **Firebase Auth emulator** on port 9099
- **Firebase Realtime Database emulator** on port 9000
- **Firebase Emulator UI** at http://localhost:4000

In development mode (`vite dev`), the app automatically connects to the local emulators instead of production Firebase. The emulator database starts empty each session.

You can also run them separately:

```bash
npm run emulators   # just the Firebase emulators
npm run dev         # just the Vite dev server
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run emulators` | Start Firebase emulators |
| `npm run dev:full` | Start emulators and dev server together |

## Production build

```bash
npm run build
```

Output goes to `dist/`. The Vite config sets `base: "/pepper-giveaway/"` for GitHub Pages deployment.

## Project structure

```
src/
  App.tsx                  # Firebase init, app layout, pepper data
  hooks.ts                 # useAuth and useReservations hooks
  firebase-context.ts      # React context for Firebase instances
  index.css                # Tailwind imports, dark mode config, base styles
  components/
    Pepper.tsx             # Pepper card with claim/unclaim functionality
    AvailabilityIndicator.tsx  # Dot-based availability display
    AuthButton.tsx         # Sign in / sign out button
    ThemeToggle.tsx        # Light / dark / system mode switcher
    ReserveIcon.tsx        # Claim button icon (gift box)
    UnreserveIcon.tsx      # Unclaim button icon (x-mark)
    SunIcon.tsx            # Light mode icon
    MoonIcon.tsx           # Dark mode icon
```

## Dark mode

The app supports light, dark, and system-preference modes via a toggle in the top-right corner. Dark mode uses Tailwind v4's class-based strategy (`@custom-variant dark` in `index.css`). The user's preference is persisted to `localStorage`.

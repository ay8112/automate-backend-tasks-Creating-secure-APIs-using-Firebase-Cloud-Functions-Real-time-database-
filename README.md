Micro Notes
This project can help you to login anonymously and crate notes. It used Firestore to store the notes and users data, Cloud Functions to update the data for both notes and users table and Firebase auth to authenticate users anonymously.

This README walks you through the full setup from scratch, running locally with the Emulator Suite, and deploying.

Prerequisites
Google account with a Firebase project.
Node.js 20.x (recommended for current Firebase CLI & Functions runtime).
If you use nvm:
nvm install 20
nvm use 20
node -v
Firebase CLI:
npm i -g firebase-tools
firebase login
Git
If you previously used Node 18 and see CLI/runtime errors, switch to Node 20.

Project structure
micro-notes/
├─ micro-notes-backend/
│ ├─ functions/
│ │ └─src/
│ │ └─index.ts
│ ├─ .firebaserc
│ ├─ .gitignore
│ ├─ firebase.json
│ ├─ firestore.rules
│ ├─ firestore.indexes.json
│ ├─ firebase-debug.log # emulator/log output (optional)
│ ├─ firestore-debug.log # emulator/log output (optional)
│ └─ README.md
├─ micro-notes-frontend/
│ ├─ public/
│ ├─ src/
│ ├─ .env.sample
│ ├─ .gitignore
│ ├─ eslint.config.js
│ ├─ index.html
│ ├─ package-lock.json
│ ├─ package.json
│ ├─ README.md
│ ├─ tsconfig.app.json
│ ├─ tsconfig.json
│ ├─ tsconfig.node.json
│ └─ vite.config.ts
│
├─ .firebaserc
├─ .gitignore
├─ firebase.json
├─ firestore.rules
├─ firestore.indexes.json
├─ firebase-debug.log # emulator/log output (optional)
├─ firestore-debug.log # emulator/log output (optional)
└─ README.md # root project README
Clone & install
Fork and clone using git clone git clone https://github.com/<YOUR-USERNAME>/firebase-functions.git

cd firebase-functions

Install dependencies in each workspace:

Backend (Cloud Functions)
cd  micro-notes-backend/functions
npm install
npm run build # compiles TS -> lib/
cd ..
Frontend
cd micro-notes-frontend
npm install
cd ..
Connect to your Firebase project From the repo root:
firebase use --add
choose your project, give it an alias like "default"
This writes .firebaserc with your project id.

⸻

Environment variables (frontend)
Create frontend/.env.local using values from Firebase Console → Project settings → Web app:

VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
The Functions region used in this project is asia-south1. Keep it consistent in both backend and frontend.

Run locally with the Emulator Suite
Open two terminals.

Terminal A — start emulators (from repo root):

firebase emulators:start

should see emulators for Functions, Firestore, Auth.
The terminal prints the Emulator UI URL (often http://127.0.0.1:4000 or 4001).
Terminal B — run the frontend (Vite dev server):

cd micro-notes-frontend
npm run dev
Open the printed local URL (e.g., http://127.0.0.1:5173).

The frontend is configured to automatically connect to Auth/Firestore/Functions emulators in dev mode.

What the app does (concept) • Callable function (createNote): validates input on the server and writes a note to Firestore for the signed-in user. • Firestore trigger (onNoteCreated): increments a per-user noteCount aggregate in users/{uid}. • Frontend: signs in anonymously, calls createNote, lists the user’s notes, and shows noteCount in real time.

Deploy to production (optional)

From the repo root:

Deploy Cloud Functions (v2)
firebase deploy --only functions
Deploy Firestore rules
firebase deploy --only firestore:rules
To host the built frontend on Firebase Hosting:

firebase init hosting # choose "dist" as public directory
cd frontend && npm run build && cd ..
firebase deploy --only hosting
Common issues & fixes
CLI vs Node mismatch
Error: “Firebase CLI vX is incompatible with Node.js vY”
Switch your shell to Node 20 (nvm use 20), then re-run.
functions/lib/index.js does not exist
Build once before starting emulators:
cd functions && npm run build && cd ..
Function not found (e.g., asia-south1-ping does not exist)
Ensure the emulator printed the function URL; if not, restart emulators after a successful build. Confirm the function is exported in functions/src/index.ts.
Cannot read properties of undefined (reading 'INTERNAL')
Usually a runtime/env mismatch. Use Node 20 for CLI & host, and set "engines": { "node": "20" } in functions/package.json. Reinstall deps and rebuild:
cd functions
rm -rf node_modules lib
npm ci
npm run build
CORS errors when calling HTTP

Use Callable functions from the web app (SDK handles CORS + auth). Keep raw onRequest for webhooks or manual testing.

Scripts reference
Backend (from functions/):

npm run build — compile TS → lib/
npm run watch — compile on save
Frontend (from frontend/):

npm run dev — Vite dev server
npm run build — production build
Root (from repo root):

firebase emulators:start — start Auth + Firestore + Functions
firebase deploy --only — deploy functions / rules / hosting
Where to look next
frontend/README.md for UI details, environment variables, and emulator wiring.
functions/README.md for function types (onRequest/onCall), triggers, and local debugging tips.
Happy building! 💙 If anything in this root README is unclear, open an issue or PR in the repo to improve the docs.


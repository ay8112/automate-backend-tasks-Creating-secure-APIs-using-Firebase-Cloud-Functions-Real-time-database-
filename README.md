📝 Micro Notes
Micro Notes is a lightweight Firebase-powered note-taking app that allows users to log in anonymously and create personal notes. It uses:
- Firebase Auth for anonymous authentication
- Firestore for storing notes and user metadata
- Cloud Functions for backend logic and real-time aggregation
This README walks you through setup, local development with Firebase Emulator Suite, and deployment.

🚀 Features
- Anonymous login via Firebase Auth
- Create and store notes in Firestore
- Real-time note count aggregation using Firestore triggers
- Callable Cloud Functions for secure note creation
- Local development with full Emulator Suite support
- Optional deployment to Firebase Hosting

📦 Prerequisites
- Google account with a Firebase project
- Node.js 20.x (recommended for Firebase CLI & Functions runtime)
- Git
- Firebase CLI
Setup Node.js (with nvm)
nvm install 20
nvm use 20
node -v


Install Firebase CLI
npm i -g firebase-tools
firebase login



🧭 Project Structure
micro-notes/
├─ micro-notes-backend/
│  ├─ functions/
│  │  └─ src/index.ts
│  ├─ firebase.json, .firebaserc, firestore.rules, firestore.indexes.json
│  └─ README.md
├─ micro-notes-frontend/
│  ├─ src/, public/, index.html
│  ├─ vite.config.ts, tsconfig.json, .env.sample
│  └─ README.md
├─ firebase.json, .firebaserc, firestore.rules, firestore.indexes.json
└─ README.md (this file)



🛠️ Installation
1. Clone the repo
git clone https://github.com/<YOUR-USERNAME>/firebase-functions.git
cd firebase-functions


2. Install dependencies
Backend
cd micro-notes-backend/functions
npm install
npm run build
cd ../..


Frontend
cd micro-notes-frontend
npm install
cd ..



🔐 Connect to Firebase
firebase use --add


Choose your Firebase project and assign an alias (e.g., default). This updates .firebaserc.

🌐 Environment Variables (Frontend)
Create micro-notes-frontend/.env.local using values from Firebase Console → Project Settings → Web App:
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...


🔁 Functions region: asia-south1 — ensure consistency across frontend and backend.


🧪 Run Locally (Emulator Suite)
Terminal A — Start Emulators
firebase emulators:start


You should see emulators for Auth, Firestore, and Functions. Emulator UI usually runs at http://127.0.0.1:4000.
Terminal B — Start Frontend
cd micro-notes-frontend
npm run dev


Visit the printed local URL (e.g., http://127.0.0.1:5173).

🧠 App Logic Overview
- Callable Function (createNote): Validates input and writes note to Firestore
- Trigger (onNoteCreated): Increments noteCount in users/{uid}
- Frontend:
- Signs in anonymously
- Calls createNote
- Lists user’s notes
- Displays real-time noteCount

🚢 Deploy to Production (Optional)
Deploy Functions
firebase deploy --only functions


Deploy Firestore Rules
firebase deploy --only firestore:rules


Deploy Frontend to Hosting
firebase init hosting # choose "dist" as public directory
cd micro-notes-frontend
npm run build
cd ..
firebase deploy --only hosting



🧯 Common Issues
|  |  | 
|  | nvm use 20 | 
| functions/lib/index.js | npm run buildfunctions/ | 
|  | src/index.ts | 
| INTERNAL |  | 
|  |  | 



📜 Scripts Reference
|  |  |  | 
| functions/ | npm run build |  | 
| functions/ | npm run watch |  | 
| frontend/ | npm run dev |  | 
| frontend/ | npm run build |  | 
|  | firebase emulators:start |  | 
|  | firebase deploy --only |  | 



📚 Where to Look Next
- frontend/README.md: UI setup, environment variables, emulator wiring
- functions/README.md: Function types, triggers, debugging tips



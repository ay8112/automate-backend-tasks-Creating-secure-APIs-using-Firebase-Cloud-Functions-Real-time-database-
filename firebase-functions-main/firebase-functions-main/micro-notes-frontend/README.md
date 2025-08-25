# Micro Notes Frontend

This code is the react code of the micro-notes app. It is build using React. By using this frontend user can login anonymously and create notes for them.

## Features

- Users can login anonymously.
- Can create notes
- Get the update of total number of notes created by a user from firebase

## Technology Used

- Firestore
- Firebase Auth
- Cloud Functions for Firebase
- React

## Project Setup

- Clone this repo by `git clone https://github.com/debajit13/firebase-functions.git` command.
- Go inside the micro-notes-frontend repo using the `cd micro-notes-frontend` command.
- Go to the micro-notes-frontend folder and create an `.env` file there. Inside the env put this variables and you will get the value of them by creating a new project at `https://console.firebase.google.com/` and put those values in the keys. The .env file should contain this variables:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

- Now run the command `npm install` to install all the packages.
- Run `npm run dev` to start the frontend project at `http://localhost:5173/`

import { setGlobalOptions } from 'firebase-functions/v2';
import { onRequest, onCall, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// v2 options use numeric memory (MiB)
setGlobalOptions({ region: 'asia-south1', memory: '256MiB', maxInstances: 10 });

initializeApp();

// 1) HTTP endpoint
export const ping = onRequest((req, res) => {
  res.status(200).json({ ok: true, time: new Date().toISOString() });
});

// 2) Callable: create a note
export const createNote = onCall(async (request) => {
  const auth = request.auth;
  if (!auth)
    throw new HttpsError('unauthenticated', 'Sign in to create notes.');

  const text = String(request.data?.text ?? '').trim();
  if (!text) throw new HttpsError('invalid-argument', 'Text is required.');
  if (text.length > 200)
    throw new HttpsError('invalid-argument', 'Max 200 characters.');

  const db = getFirestore();
  const ref = await db.collection('notes').add({
    uid: auth.uid,
    text,
    createdAt: FieldValue.serverTimestamp(),
  });

  return { id: ref.id };
});

// 3) Firestore trigger: increment per-user aggregate
export const onNoteCreated = onDocumentCreated(
  'notes/{noteId}',
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data() as { uid: string };
    const db = getFirestore();
    const userRef = db.collection('users').doc(data.uid); // <- "users" (plural)

    await db.runTransaction(async (t) => {
      const current = (await t.get(userRef)).data()?.noteCount ?? 0;
      t.set(
        userRef,
        { noteCount: current + 1, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
    });
  }
);

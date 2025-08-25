import { useEffect, useMemo, useState } from 'react';
import {
  auth,
  db,
  functions,
  httpsCallable,
  signInAnonymously,
} from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  doc,
} from 'firebase/firestore';

type Note = {
  id: string;
  text: string;
  uid: string;
  createdAt?: { seconds: number; nanoseconds: number };
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [text, setText] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteCount, setNoteCount] = useState<number>(0);

  const createNoteFn = useMemo(
    () => httpsCallable(functions, 'createNote'),
    []
  );

  // Auth: auto sign-in anonymously
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) await signInAnonymously(auth);
    });
    return unsub;
  }, []);

  // Subscriptions: notes + user aggregate
  useEffect(() => {
    if (!user) return;

    const notesRef = collection(db, 'notes');
    const q = query(
      notesRef,
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubNotes = onSnapshot(q, (snap) => {
      const items: Note[] = [];
      snap.forEach((d) => items.push({ id: d.id, ...(d.data() as any) }));
      setNotes(items);
    });

    const unsubUser = onSnapshot(doc(db, 'users', user.uid), (d) => {
      setNoteCount((d.data() as any)?.noteCount ?? 0);
    });

    return () => {
      unsubNotes();
      unsubUser();
    };
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      await createNoteFn({ text: trimmed });
      setText('');
    } catch (e: any) {
      alert(e.message ?? 'Failed to create note');
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <h1>Micro Notes</h1>
      <p>
        Signed in as: <code>{user?.uid ?? '...'}</code>
      </p>

      <section style={{ margin: '24px 0' }}>
        <h2>Create a note</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Max 280 chars'
            maxLength={280}
            style={{ flex: 1, padding: 8 }}
          />
          <button type='submit'>Add</button>
        </form>
      </section>

      <section style={{ margin: '24px 0' }}>
        <h2>Your notes ({noteCount})</h2>
        {notes.length === 0 ? (
          <p>No notes yet. Write your first!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {notes.map((n) => (
              <li
                key={n.id}
                style={{
                  padding: 12,
                  border: '1px solid #eee',
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                {n.text}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

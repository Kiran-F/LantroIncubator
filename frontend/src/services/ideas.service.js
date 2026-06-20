import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  increment,
  onSnapshot,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

// ── Upload attachment ──────────────────────────────────────────────────────────
export async function uploadAttachment(file, ideaId) {
  const storageRef = ref(storage, `attachments/${ideaId}/${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ── Submit new idea ────────────────────────────────────────────────────────────
export async function submitIdea(ideaData, file, user) {
  const docRef = await addDoc(collection(db, 'ideas'), {
    ...ideaData,
    authorId: user.uid,
    authorName: user.displayName || user.email,
    status: 'REVIEWING',
    voteCount: 0,
    commentCount: 0,
    attachmentUrl: null,
    createdAt: serverTimestamp(),
  });

  if (file) {
    const url = await uploadAttachment(file, docRef.id);
    await updateDoc(docRef, { attachmentUrl: url });
  }

  return docRef.id;
}

// ── Get all ideas (with optional filters) ─────────────────────────────────────
export async function getIdeas(filters = {}) {
  let q = query(collection(db, 'ideas'), orderBy('createdAt', 'desc'));

  if (filters.status && filters.status !== 'ALL') {
    q = query(
      collection(db, 'ideas'),
      where('status', '==', filters.status),
      orderBy('createdAt', 'desc')
    );
  }

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ── Get all ideas for AI (no filter) ──────────────────────────────────────────
export async function getAllIdeasForAI() {
  const snap = await getDocs(collection(db, 'ideas'));
  const ideas = [];

  for (const d of snap.docs) {
    const idea = { id: d.id, ...d.data() };
    // fetch recent comments
    const commentsSnap = await getDocs(
      query(
        collection(db, 'ideas', d.id, 'comments'),
        orderBy('createdAt', 'desc')
      )
    );
    idea.recentComments = commentsSnap.docs
      .slice(0, 10)
      .map((c) => c.data().content);
    ideas.push(idea);
  }

  return ideas;
}

// ── Get single idea ────────────────────────────────────────────────────────────
export async function getIdeaById(ideaId) {
  const snap = await getDoc(doc(db, 'ideas', ideaId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// ── Update idea (admin: status, any field) ─────────────────────────────────────
export async function updateIdea(ideaId, data) {
  await updateDoc(doc(db, 'ideas', ideaId), data);
}

// ── Delete idea ────────────────────────────────────────────────────────────────
export async function deleteIdea(ideaId) {
  await deleteDoc(doc(db, 'ideas', ideaId));
}

// ── Vote (toggle) ──────────────────────────────────────────────────────────────
export async function toggleVote(ideaId, userId) {
  const voteRef = doc(db, 'ideas', ideaId, 'votes', userId);
  const snap = await getDoc(voteRef);

  if (snap.exists()) {
    await deleteDoc(voteRef);
    await updateDoc(doc(db, 'ideas', ideaId), { voteCount: increment(-1) });
    return false; // un-voted
  } else {
    await setDoc(voteRef, { votedAt: serverTimestamp() });
    await updateDoc(doc(db, 'ideas', ideaId), { voteCount: increment(1) });
    return true; // voted
  }
}

// ── Check if user has voted ────────────────────────────────────────────────────
export async function hasUserVoted(ideaId, userId) {
  const snap = await getDoc(doc(db, 'ideas', ideaId, 'votes', userId));
  return snap.exists();
}

// ── Comments ───────────────────────────────────────────────────────────────────
export function subscribeToComments(ideaId, callback) {
  const q = query(
    collection(db, 'ideas', ideaId, 'comments'),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snap) => {
    const comments = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(comments);
  });
}

export async function addComment(ideaId, content, user) {
  await addDoc(collection(db, 'ideas', ideaId, 'comments'), {
    content,
    authorId: user.uid,
    authorName: user.displayName || user.email,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'ideas', ideaId), { commentCount: increment(1) });
}

// ── Real-time idea listener ────────────────────────────────────────────────────
export function subscribeToIdeas(callback) {
  const q = query(collection(db, 'ideas'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const ideas = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(ideas);
  });
}

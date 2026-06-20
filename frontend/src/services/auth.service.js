import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// ── Register new user ──────────────────────────────────────────────────────────
export async function registerUser(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });

  // Store user profile in Firestore with default EMPLOYEE role
  await setDoc(doc(db, 'users', cred.user.uid), {
    name,
    email,
    role: 'EMPLOYEE',
    createdAt: serverTimestamp(),
  });

  return cred.user;
}

// ── Login ──────────────────────────────────────────────────────────────────────
export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// ── Logout ─────────────────────────────────────────────────────────────────────
export async function logoutUser() {
  await signOut(auth);
}

// ── Get user profile from Firestore (includes role) ───────────────────────────
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

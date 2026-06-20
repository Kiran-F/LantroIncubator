import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserProfile, loginUser, logoutUser, registerUser } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Firebase auth user
  const [profile, setProfile] = useState(null); // Firestore profile (includes role)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const prof = await getUserProfile(firebaseUser.uid);
        setUser(firebaseUser);
        setProfile(prof);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function register(name, email, password) {
    const u = await registerUser(name, email, password);
    const prof = await getUserProfile(u.uid);
    setProfile(prof);
    return u;
  }

  async function login(email, password) {
    const u = await loginUser(email, password);
    const prof = await getUserProfile(u.uid);
    setProfile(prof);
    return u;
  }

  async function logout() {
    await logoutUser();
    setUser(null);
    setProfile(null);
  }

  const isAdmin = profile?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, profile, loading, register, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

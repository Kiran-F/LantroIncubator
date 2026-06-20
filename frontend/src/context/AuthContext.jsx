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
        setUser(firebaseUser);
        try {
          const prof = await getUserProfile(firebaseUser.uid);
          setProfile(prof || { name: firebaseUser.displayName || firebaseUser.email, email: firebaseUser.email, role: 'EMPLOYEE' });
        } catch (err) {
          console.warn("Failed to get profile, using offline fallback:", err);
          setProfile({ name: firebaseUser.displayName || firebaseUser.email, email: firebaseUser.email, role: 'EMPLOYEE' });
        }
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
    setUser(u);
    try {
      const prof = await getUserProfile(u.uid);
      setProfile(prof || { name, email, role: 'EMPLOYEE' });
    } catch (err) {
      console.warn("Failed to load profile on register, using offline fallback:", err);
      setProfile({ name, email, role: 'EMPLOYEE' });
    }
    return u;
  }

  async function login(email, password) {
    const u = await loginUser(email, password);
    setUser(u);
    try {
      const prof = await getUserProfile(u.uid);
      setProfile(prof || { name: u.displayName || u.email, email: u.email, role: 'EMPLOYEE' });
    } catch (err) {
      console.warn("Failed to load profile on login, using offline fallback:", err);
      setProfile({ name: u.displayName || u.email, email: u.email, role: 'EMPLOYEE' });
    }
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

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User, type Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore'; // Importar Firestore como tipo
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
  firebaseDb: Firestore | null;
  firebaseAuth: Auth | null;
}

export const AuthProvider = ({ children, firebaseDb, firebaseAuth }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (firebaseAuth) {
      const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
        console.log("Auth state changed. currentUser:", currentUser);
        if (currentUser) {
          console.log("currentUser.uid:", currentUser.uid);
          console.log("currentUser.isAnonymous:", currentUser.isAnonymous);
          console.log("currentUser.email:", currentUser.email);
        } else {
          console.log("No currentUser (logged out or anonymous but not yet signed in).");
        }
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [firebaseAuth]);

  const login = async (email: string, password: string) => {
    if (!firebaseAuth) throw new Error("Firebase Auth no está inicializado.");
    await signInWithEmailAndPassword(firebaseAuth, email, password);
  };

  const register = async (email: string, password: string) => {
    if (!firebaseAuth) throw new Error("Firebase Auth no está inicializado.");
    await createUserWithEmailAndPassword(firebaseAuth, email, password);
  };

  const logout = async () => {
    if (!firebaseAuth) throw new Error("Firebase Auth no está inicializado.");
    await signOut(firebaseAuth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, db: firebaseDb, auth: firebaseAuth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

import { createContext } from 'react';
import { type User, type Auth } from 'firebase/auth'; 
import { Firestore } from 'firebase/firestore';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  db: Firestore | null;
  auth: Auth | null;
  login?: (email: string, password: string) => Promise<void>;
  register?: (email: string, password: string) => Promise<void>;
  logout?: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  db: null,
  auth: null,
});

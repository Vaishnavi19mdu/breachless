import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface UserData {
  email: string;
  role: 'admin' | 'staff' | 'user';
  uid: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (currentUser: User) => {
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (userDoc.exists()) {
      setUserData(userDoc.data() as UserData);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        await fetchUserData(user);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, login, logout, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
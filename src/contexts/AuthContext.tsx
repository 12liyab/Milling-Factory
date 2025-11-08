import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updatePassword as firebaseUpdatePassword
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  lastActivity: number;
  updateActivity: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT = 5 * 60 * 1000;
const WARNING_TIME = 4 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const updateActivity = () => {
    setLastActivity(Date.now());
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        setLastActivity(Date.now());
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => {
      updateActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    const checkInactivity = setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;

      if (inactiveTime >= SESSION_TIMEOUT) {
        firebaseSignOut(auth);
        alert('Session expired due to inactivity. Please log in again.');
      } else if (inactiveTime >= WARNING_TIME) {
        const secondsLeft = Math.ceil((SESSION_TIMEOUT - inactiveTime) / 1000);
        console.log(`Session expiring in ${secondsLeft} seconds`);
      }
    }, 1000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearInterval(checkInactivity);
    };
  }, [user, lastActivity]);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    updateActivity();
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const updatePassword = async (newPassword: string) => {
    if (user) {
      await firebaseUpdatePassword(user, newPassword);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    updatePassword,
    lastActivity,
    updateActivity
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

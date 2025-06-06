import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, enableIndexedDbPersistence } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, role: UserRole, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser doesn\'t support offline persistence');
  }
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as User);
          } else {
            console.warn('No user profile found');
          }
        } catch (error) {
          // Handle offline errors more gracefully
          if (error instanceof Error && error.message.includes('offline')) {
            console.warn('Currently offline, using cached data if available');
          } else {
            console.error('Error fetching user profile:', error);
          }
        }
      } else {
        setUserProfile(null);
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if this is a new user
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create a new user profile
        await setDoc(userDocRef, {
          id: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || 'User',
          role: 'patient', // Default role
          createdAt: new Date().toISOString(),
          photoURL: result.user.photoURL,
          subscriptionTier: 'free'
        });
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('offline')) {
        console.warn('Currently offline, please check your internet connection');
      }
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error instanceof Error && error.message.includes('offline')) {
        console.warn('Currently offline, please check your internet connection');
      }
      console.error('Error signing in with email:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, role: UserRole, displayName: string) => {
    try {
      setIsLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create a new user profile
      const userDocRef = doc(db, 'users', result.user.uid);
      await setDoc(userDocRef, {
        id: result.user.uid,
        email: result.user.email,
        displayName,
        role,
        createdAt: new Date().toISOString(),
        subscriptionTier: 'free'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('offline')) {
        console.warn('Currently offline, please check your internet connection');
      }
      console.error('Error signing up with email:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      if (error instanceof Error && error.message.includes('offline')) {
        console.warn('Currently offline, please check your internet connection');
      }
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUserRole = async (role: UserRole) => {
    if (!currentUser) return;
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, { role }, { merge: true });
      
      // Update local state
      if (userProfile) {
        setUserProfile({ ...userProfile, role });
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('offline')) {
        console.warn('Currently offline, please check your internet connection');
      }
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    isLoading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateUserRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
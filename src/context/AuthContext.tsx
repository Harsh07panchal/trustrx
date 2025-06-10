import { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types';
import { supabase } from '../config/supabase';

interface AuthContextType {
  currentUser: any | null;
  userProfile: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, role: UserRole, displayName: string, additionalData?: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for demo session first
    const demoSession = localStorage.getItem('demo-session');
    if (demoSession) {
      try {
        const session = JSON.parse(demoSession);
        const now = Date.now();
        
        // Check if demo session is still valid (24 hours)
        if (now - session.timestamp < 24 * 60 * 60 * 1000) {
          console.log('🎭 Loading demo session');
          setCurrentUser(session.user);
          setUserProfile({
            id: session.user.id,
            email: session.user.email,
            displayName: session.user.displayName,
            role: session.user.role,
            createdAt: new Date(session.timestamp).toISOString(),
            subscriptionTier: 'free'
          } as User);
          setIsLoading(false);
          return;
        } else {
          // Remove expired demo session
          localStorage.removeItem('demo-session');
        }
      } catch (error) {
        console.error('Error parsing demo session:', error);
        localStorage.removeItem('demo-session');
      }
    }

    // Try to get session from Supabase if available
    if (supabase && typeof supabase.auth?.getSession === 'function') {
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
          console.error('Error getting session:', error);
        }
        setCurrentUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        }
        setIsLoading(false);
      });

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setCurrentUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // If Supabase is not available, just set loading to false
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (userId: string) => {
    if (!supabase || !supabase.from) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        // Convert snake_case to camelCase for compatibility
        const profile = {
          id: data.id,
          email: data.email,
          displayName: data.display_name,
          role: data.role,
          createdAt: data.created_at,
          subscriptionTier: data.subscription_tier,
          // Add other fields as needed
        };
        setUserProfile(profile as User);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signInWithGoogle = async () => {
    if (!supabase || !supabase.auth?.signInWithOAuth) {
      throw new Error('Google sign-in not available in demo mode');
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Check if this is a demo login attempt
      if (email.includes('demo') || !supabase || !supabase.auth?.signInWithPassword) {
        console.log('🎭 Demo login detected or Supabase not available');
        
        // Create demo user
        const demoUser = {
          id: `demo-${Date.now()}`,
          email: email,
          displayName: email.includes('demo') ? 'Demo User' : 'User',
          role: 'patient'
        };
        
        // Store demo session
        localStorage.setItem('demo-session', JSON.stringify({
          user: demoUser,
          timestamp: Date.now()
        }));
        
        // Set user state immediately
        setCurrentUser(demoUser);
        setUserProfile({
          id: demoUser.id,
          email: demoUser.email,
          displayName: demoUser.displayName,
          role: demoUser.role,
          createdAt: new Date().toISOString(),
          subscriptionTier: 'free'
        } as User);
        
        console.log('✅ Demo login successful');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      console.log('Sign in successful:', data.user?.email);
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, role: UserRole, displayName: string, additionalData?: any) => {
    try {
      setIsLoading(true);
      
      console.log('Attempting registration with:', {
        email: email,
        role: role,
        name: displayName
      });

      // For demo accounts or when Supabase is not available, create demo account
      if (additionalData?.isDemo || !supabase || !supabase.auth?.signUp || typeof supabase.auth.signUp !== 'function') {
        console.log('🎭 Creating demo account (Supabase not available or demo mode)');
        
        const demoUser = {
          id: `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          email: email,
          displayName: displayName,
          role: role
        };
        
        // Store demo session
        localStorage.setItem('demo-session', JSON.stringify({
          user: demoUser,
          timestamp: Date.now()
        }));
        
        // Set user state immediately
        setCurrentUser(demoUser);
        setUserProfile({
          id: demoUser.id,
          email: demoUser.email,
          displayName: demoUser.displayName,
          role: demoUser.role,
          createdAt: new Date().toISOString(),
          subscriptionTier: 'free'
        } as User);
        
        console.log('✅ Demo account created successfully');
        return;
      }
      
      // Regular Supabase signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role: role
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      console.log('Signup successful:', data);

      if (data.user && supabase.from) {
        // Create user profile
        const userProfile = {
          id: data.user.id,
          email: data.user.email,
          display_name: displayName,
          role,
          created_at: new Date().toISOString(),
          subscription_tier: 'free',
          ...additionalData
        };

        const { error: profileError } = await supabase
          .from('users')
          .insert([userProfile]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // Don't throw here as the user was created successfully
        } else {
          console.log('User profile created successfully');
        }
      }
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Clear demo session if it exists
      localStorage.removeItem('demo-session');
      
      if (supabase && supabase.auth?.signOut) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      
      // Clear local state
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUserRole = async (role: UserRole) => {
    if (!currentUser || !supabase || !supabase.from) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', currentUser.id);

      if (error) throw error;

      // Update local state
      if (userProfile) {
        setUserProfile({ ...userProfile, role });
      }
    } catch (error) {
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
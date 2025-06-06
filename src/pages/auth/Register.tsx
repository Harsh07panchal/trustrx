import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { FirebaseError } from 'firebase/app';

const Register = () => {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [error, setError] = useState<string | JSX.Element>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      await signUpWithEmail(email, password, role, name);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/api-key-not-valid':
            setError('Authentication service is not properly configured. Please contact support.');
            break;
          case 'auth/email-already-in-use':
            setError('This email is already registered. Please sign in instead.');
            break;
          case 'auth/invalid-email':
            setError('Please enter a valid email address.');
            break;
          default:
            setError('Error during registration. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleRegister = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Create a promise that resolves when the popup is handled
      const authResult = await new Promise(async (resolve, reject) => {
        try {
          // Add event listener for popup messages
          const messageHandler = (event: MessageEvent) => {
            if (event.data?.type === 'googleAuthSuccess') {
              window.removeEventListener('message', messageHandler);
              resolve(true);
            }
          };
          window.addEventListener('message', messageHandler);
          
          await signInWithGoogle();
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
      
      if (authResult) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Google registration error:', err);
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/unauthorized-domain':
            setError('This domain is not authorized for authentication. Please contact the administrator to add this domain to Firebase authorized domains.');
            break;
          case 'auth/popup-blocked':
            setError(
              <div>
                <p className="mb-2">The Google sign-in popup was blocked by your browser.</p>
                <p className="text-sm">To fix this:</p>
                <ol className="list-decimal ml-4 text-sm mt-1">
                  <li>Look for a popup blocked icon (🚫) in your browser's address bar</li>
                  <li>Click the icon and select "Always allow popups from localhost:5173"</li>
                  <li>Try signing in with Google again</li>
                </ol>
              </div>
            );
            break;
          case 'auth/cancelled-popup-request':
            // Don't show error for cancelled requests as it's intentional
            return;
          case 'auth/api-key-not-valid':
            setError('Authentication service is not properly configured. Please contact support.');
            break;
          default:
            setError('Error signing up with Google. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Create your account</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-error-50 border border-error-200 text-error-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input w-full"
            placeholder="John Doe"
            disabled={isLoading}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-full"
            placeholder="you@example.com"
            disabled={isLoading}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full pr-10"
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input w-full"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            I am a:
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`py-2 px-4 rounded-md border ${
                role === 'patient'
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
              }`}
              disabled={isLoading}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`py-2 px-4 rounded-md border ${
                role === 'doctor'
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
              }`}
              disabled={isLoading}
            >
              Doctor
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full mb-4"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-neutral-500">Or continue with</span>
        </div>
      </div>
      
      <button
        type="button"
        onClick={handleGoogleRegister}
        className="w-full flex items-center justify-center gap-2 border border-neutral-300 rounded-md py-2 px-4 text-neutral-700 hover:bg-neutral-50 transition-colors"
        disabled={isLoading}
      >
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </svg>
        Sign up with Google
      </button>
      
      <p className="mt-6 text-center text-sm text-neutral-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
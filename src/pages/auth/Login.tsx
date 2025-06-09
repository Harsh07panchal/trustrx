import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Phone, Mail, ArrowLeft } from 'lucide-react';
import { AuthApiError } from '@supabase/supabase-js';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const Login = () => {
  const navigate = useNavigate();
  const { signInWithEmail } = useAuth();
  const captchaRef = useRef<HCaptcha>(null);
  
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState<'method' | 'details' | 'verification'>('method');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const countryCodes = [
    { code: '+1', country: 'US/CA', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+91', country: 'IN', flag: '🇮🇳' },
    { code: '+86', country: 'CN', flag: '🇨🇳' },
    { code: '+81', country: 'JP', flag: '🇯🇵' },
    { code: '+49', country: 'DE', flag: '🇩🇪' },
    { code: '+33', country: 'FR', flag: '🇫🇷' },
    { code: '+39', country: 'IT', flag: '🇮🇹' },
    { code: '+34', country: 'ES', flag: '🇪🇸' },
    { code: '+61', country: 'AU', flag: '🇦🇺' },
  ];

  const hcaptchaSiteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY || 'c0d297b2-8efe-40c8-910e-37b0b6124034';
  
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      await signInWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof AuthApiError) {
        switch (err.message) {
          case 'Invalid login credentials':
            setError('Invalid email or password. Please check your credentials and try again.');
            break;
          case 'Email not confirmed':
            setError('Please check your email and confirm your account before signing in.');
            break;
          case 'Too many requests':
            setError('Too many login attempts. Please wait a moment and try again.');
            break;
          default:
            setError(`Authentication error: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async () => {
    setError('Phone authentication is currently not available. Please use email login or contact support.');
    return;

    // Phone login implementation would go here
    // Currently disabled as it requires additional Supabase configuration
  };

  const handlePhoneVerification = async () => {
    setError('Phone verification is currently not available. Please use email login.');
    return;
  };
  
  const handleGoogleLogin = async () => {
    setError('Google authentication is currently not configured. Please use email login.');
    return;

    // Google login implementation would go here
    // Currently disabled as it requires OAuth configuration
  };

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    const phoneNumberLength = phoneNumber.length;
    
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const resendVerificationCode = async () => {
    setError('Code resend is currently not available. Please use email login.');
  };

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
  };

  const handleCaptchaError = (err: string) => {
    console.error('hCaptcha error:', err);
    setError('CAPTCHA verification failed. Please try again.');
    setCaptchaToken(null);
  };
  
  return (
    <div>
      <AnimatePresence mode="wait">
        {step === 'method' && (
          <motion.div
            key="method"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6">Sign in to your account</h2>
            
            {error && (
              <motion.div 
                className="mb-4 p-3 bg-error-50 border border-error-200 text-error-700 rounded-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-medium">Choose your sign in method</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  onClick={() => {
                    setLoginMethod('email');
                    setStep('details');
                  }}
                  className={`p-6 border-2 rounded-lg transition-all duration-300 ${
                    loginMethod === 'email'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-primary-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Mail className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                  <h4 className="font-medium mb-2">Email Address</h4>
                  <p className="text-sm text-neutral-600">
                    Sign in with your email and password
                  </p>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => {
                    setError('Phone authentication is currently not available. Please use email login.');
                  }}
                  className="p-6 border-2 rounded-lg transition-all duration-300 border-neutral-200 hover:border-neutral-300 opacity-50 cursor-not-allowed"
                  disabled
                >
                  <Phone className="h-8 w-8 text-neutral-400 mx-auto mb-3" />
                  <h4 className="font-medium mb-2 text-neutral-500">Phone Number</h4>
                  <p className="text-sm text-neutral-500">
                    Currently unavailable
                  </p>
                </motion.button>
              </div>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">Or continue with</span>
              </div>
            </div>
            
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 border border-neutral-300 rounded-md py-2 px-4 text-neutral-700 hover:bg-neutral-50 transition-colors opacity-50 cursor-not-allowed"
              disabled
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              Sign in with Google (Coming Soon)
            </motion.button>
          </motion.div>
        )}

        {step === 'details' && loginMethod === 'email' && (
          <motion.div
            key="email-details"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <button
                onClick={() => setStep('method')}
                className="mr-4 p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-2xl font-bold">Sign in with Email</h2>
            </div>

            {error && (
              <motion.div 
                className="mb-4 p-3 bg-error-50 border border-error-200 text-error-700 rounded-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}
            
            <form onSubmit={handleEmailLogin}>
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
                  required
                />
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                    Password
                  </label>
                  <button type="button" className="text-sm text-primary-600 hover:text-primary-500">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input w-full pr-10"
                    placeholder="••••••••"
                    disabled={isLoading}
                    required
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
              
              <motion.button
                type="submit"
                className="btn-primary w-full mb-4"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.p 
        className="mt-6 text-center text-sm text-neutral-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
          Sign up
        </Link>
      </motion.p>
    </div>
  );
};

export default Login;
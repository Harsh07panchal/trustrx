import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Upload, Check, Phone, Mail, ArrowLeft } from 'lucide-react';
import { AuthApiError } from '@supabase/supabase-js';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const Register = () => {
  const navigate = useNavigate();
  const { signUpWithEmail } = useAuth();
  const captchaRef = useRef<HCaptcha>(null);
  
  const [signupMethod, setSignupMethod] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState<'method' | 'details' | 'verification'>('method');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient' as 'patient' | 'doctor',
    // Doctor specific fields
    specialty: '',
    licenseNumber: '',
    hospitalAffiliation: '',
    education: '',
    yearsOfExperience: '',
    identityDocument: null as File | null,
    medicalLicense: null as File | null,
    workCertification: null as File | null
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | JSX.Element>('');
  const [isLoading, setIsLoading] = useState(false);

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

  // Use the demo site key for testing
  const hcaptchaSiteKey = '10000000-ffff-ffff-ffff-000000000001';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'identityDocument' | 'medicalLicense' | 'workCertification') => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const handlePhoneSignup = async () => {
    setError('Phone registration is currently not available. Please use email registration.');
    return;
  };

  const handlePhoneVerification = async () => {
    setError('Phone verification is currently not available. Please use email registration.');
    return;
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError('');

      // Validation
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (formData.password.length < 6) {
        setError('Password should be at least 6 characters');
        return;
      }

      // Additional validation for doctors
      if (formData.role === 'doctor') {
        if (!formData.specialty || !formData.licenseNumber || !formData.hospitalAffiliation) {
          setError('Please fill in all required doctor information');
          return;
        }
      }

      console.log('Attempting registration with:', {
        email: formData.email,
        role: formData.role,
        name: formData.name
      });

      // Prepare additional data for doctor profiles
      const additionalData = formData.role === 'doctor' ? {
        specialty: formData.specialty,
        license_number: formData.licenseNumber,
        hospital_affiliation: formData.hospitalAffiliation,
        education: formData.education,
        years_of_experience: parseInt(formData.yearsOfExperience) || 0,
        verification_status: 'pending'
      } : {};

      await signUpWithEmail(
        formData.email, 
        formData.password, 
        formData.role, 
        formData.name,
        additionalData
      );

      // Show success message
      setError(
        <div className="text-success-700">
          Registration successful! You can now sign in with your credentials.
        </div>
      );

      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);
      if (err instanceof AuthApiError) {
        switch (err.message) {
          case 'User already registered':
            setError('This email is already registered. Please sign in instead.');
            break;
          case 'Invalid email':
            setError('Please enter a valid email address.');
            break;
          case 'Password should be at least 6 characters':
            setError('Password must be at least 6 characters long.');
            break;
          case 'Signup is disabled':
            setError('New registrations are currently disabled. Please contact support.');
            break;
          default:
            setError(`Registration error: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred during registration. Please try again.');
      }
      
      // Reset captcha on error
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha();
        setCaptchaToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    setError('Code resend is currently not available. Please use email registration.');
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

  const handleCaptchaVerify = (token: string) => {
    console.log('CAPTCHA verified:', token);
    setCaptchaToken(token);
    setError(''); // Clear any previous errors when captcha is completed
  };

  const handleCaptchaExpire = () => {
    console.log('CAPTCHA expired');
    setCaptchaToken(null);
  };

  const handleCaptchaError = (err: string) => {
    console.error('hCaptcha error:', err);
    setError('CAPTCHA verification failed. Please try again.');
    setCaptchaToken(null);
  };

  const handleCaptchaLoad = () => {
    console.log('CAPTCHA loaded successfully');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <AnimatePresence mode="wait">
        {step === 'method' && (
          <motion.div
            key="method"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6">Create your account</h2>
            
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
              <h3 className="text-lg font-medium">Choose your signup method</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  onClick={() => {
                    setSignupMethod('email');
                    setStep('details');
                  }}
                  className={`p-6 border-2 rounded-lg transition-all duration-300 ${
                    signupMethod === 'email'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-primary-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Mail className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                  <h4 className="font-medium mb-2">Email Address</h4>
                  <p className="text-sm text-neutral-600">
                    Sign up with your email address and password
                  </p>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => {
                    setError('Phone registration is currently not available. Please use email registration.');
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
          </motion.div>
        )}

        {step === 'details' && signupMethod === 'email' && (
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
              <h2 className="text-2xl font-bold">Sign up with Email</h2>
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

            <form onSubmit={handleEmailRegister} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input w-full"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input w-full"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        className="input w-full pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="input w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      I am a: *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: 'patient' }))}
                        className={`py-2 px-4 rounded-md border ${
                          formData.role === 'patient'
                            ? 'bg-primary-50 border-primary-500 text-primary-700'
                            : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        Patient
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: 'doctor' }))}
                        className={`py-2 px-4 rounded-md border ${
                          formData.role === 'doctor'
                            ? 'bg-primary-50 border-primary-500 text-primary-700'
                            : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        Doctor
                      </button>
                    </div>
                  </div>
                </div>

                {/* Doctor Specific Fields */}
                {formData.role === 'doctor' && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="specialty" className="block text-sm font-medium text-neutral-700 mb-1">
                        Specialty *
                      </label>
                      <input
                        id="specialty"
                        name="specialty"
                        type="text"
                        value={formData.specialty}
                        onChange={handleInputChange}
                        className="input w-full"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="licenseNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                        Medical License Number *
                      </label>
                      <input
                        id="licenseNumber"
                        name="licenseNumber"
                        type="text"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        className="input w-full"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="hospitalAffiliation" className="block text-sm font-medium text-neutral-700 mb-1">
                        Hospital Affiliation *
                      </label>
                      <input
                        id="hospitalAffiliation"
                        name="hospitalAffiliation"
                        type="text"
                        value={formData.hospitalAffiliation}
                        onChange={handleInputChange}
                        className="input w-full"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="education" className="block text-sm font-medium text-neutral-700 mb-1">
                        Education
                      </label>
                      <input
                        id="education"
                        name="education"
                        type="text"
                        value={formData.education}
                        onChange={handleInputChange}
                        className="input w-full"
                      />
                    </div>

                    <div>
                      <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-neutral-700 mb-1">
                        Years of Experience
                      </label>
                      <input
                        id="yearsOfExperience"
                        name="yearsOfExperience"
                        type="number"
                        min="0"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                        className="input w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* CAPTCHA Section */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Security Verification
                </label>
                <div className="border-2 border-neutral-200 rounded-lg p-4 bg-neutral-50">
                  <div className="flex justify-center">
                    <HCaptcha
                      ref={captchaRef}
                      sitekey={hcaptchaSiteKey}
                      onVerify={handleCaptchaVerify}
                      onExpire={handleCaptchaExpire}
                      onError={handleCaptchaError}
                      onLoad={handleCaptchaLoad}
                    />
                  </div>
                  {captchaToken && (
                    <div className="mt-3 flex items-center justify-center text-sm text-success-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      ✅ CAPTCHA verified successfully
                    </div>
                  )}
                  {!captchaToken && (
                    <div className="mt-3 text-center text-xs text-neutral-500">
                      Complete the CAPTCHA above to verify you're human
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <motion.button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </motion.button>
              </div>

              <div className="text-center text-sm text-neutral-500">
                <p>For demo purposes, CAPTCHA verification is optional</p>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p 
        className="text-center text-sm text-neutral-600 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
          Sign in
        </Link>
      </motion.p>
    </div>
  );
};

export default Register;
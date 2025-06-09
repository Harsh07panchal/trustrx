import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Upload, Check, Phone, Mail, ArrowLeft } from 'lucide-react';
import { AuthApiError } from '@supabase/supabase-js';
import { supabase } from '../../config/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const Register = () => {
  const navigate = useNavigate();
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

  const hcaptchaSiteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY || 'c0d297b2-8efe-40c8-910e-37b0b6124034';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'identityDocument' | 'medicalLicense' | 'workCertification') => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(path, file);
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  };

  const handlePhoneSignup = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a valid phone number');
      return;
    }

    if (!captchaToken) {
      setError('Please complete the CAPTCHA verification');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const fullPhoneNumber = `${countryCode}${phoneNumber.replace(/\D/g, '')}`;
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
        options: {
          captchaToken
        }
      });

      if (error) throw error;

      setStep('verification');
    } catch (err) {
      console.error('Phone signup error:', err);
      if (err instanceof AuthApiError) {
        switch (err.message) {
          case 'Phone number already registered':
            setError('This phone number is already registered. Please sign in instead.');
            break;
          case 'Invalid phone number':
            setError('Please enter a valid phone number.');
            break;
          case 'captcha verification process failed':
            setError('CAPTCHA verification failed. Please try again.');
            break;
          default:
            setError('Error sending verification code. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
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

  const handlePhoneVerification = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const fullPhoneNumber = `${countryCode}${phoneNumber.replace(/\D/g, '')}`;
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: fullPhoneNumber,
        token: verificationCode,
        type: 'sms'
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const userProfile = {
          id: data.user.id,
          phone: fullPhoneNumber,
          display_name: formData.name || 'User',
          role: formData.role,
          created_at: new Date().toISOString(),
          subscription_tier: 'free'
        };

        const { error: profileError } = await supabase
          .from('users')
          .insert([userProfile]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }

        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Verification error:', err);
      if (err instanceof AuthApiError) {
        switch (err.message) {
          case 'Invalid token':
            setError('Invalid verification code. Please try again.');
            break;
          case 'Token expired':
            setError('Verification code has expired. Please request a new one.');
            break;
          default:
            setError('Error verifying code. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
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

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            display_name: formData.name,
            role: formData.role
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const userProfile = {
          id: data.user.id,
          email: data.user.email,
          display_name: formData.name,
          role: formData.role,
          created_at: new Date().toISOString(),
          subscription_tier: 'free'
        };

        // Add doctor-specific fields if applicable
        if (formData.role === 'doctor') {
          Object.assign(userProfile, {
            specialty: formData.specialty,
            license_number: formData.licenseNumber,
            hospital_affiliation: formData.hospitalAffiliation,
            education: formData.education,
            years_of_experience: parseInt(formData.yearsOfExperience) || 0,
            verification_status: 'pending'
          });
        }

        const { error: profileError } = await supabase
          .from('users')
          .insert([userProfile]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }

        navigate('/dashboard');
      }
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

  const resendVerificationCode = async () => {
    if (!captchaToken) {
      setError('Please complete the CAPTCHA verification first');
      return;
    }

    try {
      setIsLoading(true);
      const fullPhoneNumber = `${countryCode}${phoneNumber.replace(/\D/g, '')}`;
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
        options: {
          captchaToken
        }
      });

      if (error) throw error;
      
      setError('');
    } catch (err) {
      setError('Error resending code. Please try again.');
      // Reset captcha on error
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha();
        setCaptchaToken(null);
      }
    } finally {
      setIsLoading(false);
    }
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
                    setSignupMethod('phone');
                    setStep('details');
                  }}
                  className={`p-6 border-2 rounded-lg transition-all duration-300 ${
                    signupMethod === 'phone'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-primary-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Phone className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                  <h4 className="font-medium mb-2">Phone Number</h4>
                  <p className="text-sm text-neutral-600">
                    Sign up with your phone number via SMS verification
                  </p>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'details' && signupMethod === 'phone' && (
          <motion.div
            key="phone-details"
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
              <h2 className="text-2xl font-bold">Sign up with Phone</h2>
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

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone Number
                </label>
                <div className="flex">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="input rounded-r-none border-r-0 w-24"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    id="phone"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className="input flex-1 rounded-l-none"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  We'll send you a verification code via SMS
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  I am a:
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'patient' }))}
                    className={`py-2 px-4 rounded-md border transition-all ${
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
                    className={`py-2 px-4 rounded-md border transition-all ${
                      formData.role === 'doctor'
                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                        : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    Doctor
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <HCaptcha
                  ref={captchaRef}
                  sitekey={hcaptchaSiteKey}
                  onVerify={handleCaptchaVerify}
                  onExpire={handleCaptchaExpire}
                  onError={handleCaptchaError}
                />
              </div>

              <motion.button
                type="button"
                onClick={handlePhoneSignup}
                disabled={isLoading || !phoneNumber.trim() || !formData.name.trim() || !captchaToken}
                className="btn-primary w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? 'Sending Code...' : 'Send Verification Code'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 'verification' && (
          <motion.div
            key="verification"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <button
                onClick={() => setStep('details')}
                className="mr-4 p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-2xl font-bold">Verify Your Phone</h2>
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

            <div className="space-y-6">
              <div className="text-center">
                <Phone className="h-16 w-16 text-primary-500 mx-auto mb-4" />
                <p className="text-neutral-600">
                  We've sent a verification code to
                </p>
                <p className="font-medium text-lg">
                  {countryCode} {phoneNumber}
                </p>
              </div>

              <div>
                <label htmlFor="verification-code" className="block text-sm font-medium text-neutral-700 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input w-full text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <motion.button
                type="button"
                onClick={handlePhoneVerification}
                disabled={isLoading || verificationCode.length !== 6}
                className="btn-primary w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? 'Verifying...' : 'Verify & Create Account'}
              </motion.button>

              <div className="text-center">
                <p className="text-sm text-neutral-600">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={resendVerificationCode}
                    disabled={isLoading || !captchaToken}
                    className="text-primary-600 hover:text-primary-500 font-medium disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                </p>
                {!captchaToken && (
                  <p className="text-xs text-neutral-500 mt-1">
                    Complete CAPTCHA verification to resend code
                  </p>
                )}
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
                        Education *
                      </label>
                      <input
                        id="education"
                        name="education"
                        type="text"
                        value={formData.education}
                        onChange={handleInputChange}
                        className="input w-full"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-neutral-700 mb-1">
                        Years of Experience *
                      </label>
                      <input
                        id="yearsOfExperience"
                        name="yearsOfExperience"
                        type="number"
                        min="0"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                        className="input w-full"
                        required
                      />
                    </div>
                  </div>
                )}
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
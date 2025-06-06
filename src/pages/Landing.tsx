import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileLock, 
  ShieldCheck, 
  Stethoscope, 
  CalendarClock, 
  HardDrive,
  Search,
  Menu,
  X,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };
  
  const handleSignIn = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };
  
  // Calculate navigation link based on user role
  const getDashboardLink = () => {
    if (!currentUser) return '/login';
    return userProfile?.role === 'patient' 
      ? '/patient/dashboard' 
      : '/doctor/dashboard';
  };
  
  const featureContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const featureItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <FileLock className="h-6 w-6 text-primary-500 mr-2" />
              <span className="text-xl font-bold">TrustRx</span>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-neutral-600 hover:text-primary-500 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-neutral-600 hover:text-primary-500 transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-neutral-600 hover:text-primary-500 transition-colors">
                Testimonials
              </a>
              <button 
                onClick={handleSignIn}
                className="text-neutral-600 hover:text-primary-500 transition-colors"
              >
                {currentUser ? 'Dashboard' : 'Sign In'}
              </button>
              <button 
                onClick={handleGetStarted}
                className="btn-primary"
              >
                {currentUser ? 'Dashboard' : 'Get Started'}
              </button>
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="text-neutral-500"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="container mx-auto px-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileLock className="h-6 w-6 text-primary-500 mr-2" />
                <span className="text-xl font-bold">TrustRx</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-neutral-500"
              >
                <X size={24} />
              </button>
            </div>
            
            <nav className="mt-8 space-y-6">
              <a 
                href="#features" 
                className="block text-lg text-neutral-600 hover:text-primary-500 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="block text-lg text-neutral-600 hover:text-primary-500 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="#testimonials" 
                className="block text-lg text-neutral-600 hover:text-primary-500 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </a>
              <button 
                onClick={() => {
                  handleSignIn();
                  setMobileMenuOpen(false);
                }}
                className="block text-lg text-neutral-600 hover:text-primary-500 transition-colors"
              >
                {currentUser ? 'Dashboard' : 'Sign In'}
              </button>
              <button 
                onClick={() => {
                  handleGetStarted();
                  setMobileMenuOpen(false);
                }}
                className="w-full btn-primary"
              >
                {currentUser ? 'Dashboard' : 'Get Started'}
              </button>
            </nav>
          </div>
        </div>
      )}
      
      {/* Hero section */}
      <section className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Your health data, <span className="text-primary-500">secured</span> by blockchain
              </motion.h1>
              
              <motion.p 
                className="text-xl text-neutral-600 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Securely store your medical records, find the right doctors, and request appointments - all in one place.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <button 
                  onClick={handleGetStarted}
                  className="btn-primary text-lg px-8 py-3"
                >
                  Get Started
                </button>
                <a 
                  href="#features"
                  className="btn-outline text-lg px-8 py-3"
                >
                  Learn More
                </a>
              </motion.div>
            </div>
            
            <div className="md:w-1/2">
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="bg-primary-500 px-6 py-4 flex items-center">
                    <div className="flex space-x-2 mr-4">
                      <div className="w-3 h-3 rounded-full bg-white bg-opacity-30"></div>
                      <div className="w-3 h-3 rounded-full bg-white bg-opacity-30"></div>
                      <div className="w-3 h-3 rounded-full bg-white bg-opacity-30"></div>
                    </div>
                    <span className="text-white font-medium">Medical Records Dashboard</span>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Your Records</h3>
                      <div className="flex items-center text-sm text-primary-500">
                        <span>View All</span>
                        <ArrowRight size={16} className="ml-1" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="border border-neutral-200 rounded-lg p-4 flex items-center">
                          <div className="h-10 w-10 rounded-md bg-primary-100 text-primary-500 flex items-center justify-center mr-4">
                            <FileIcon />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Medical Report {item}</h4>
                              <span className="text-xs text-neutral-500">2 days ago</span>
                            </div>
                            <p className="text-sm text-neutral-500">Dr. Smith • General Check-up</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-neutral-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Storage Used</span>
                        <span className="text-sm text-neutral-500">1.2 GB / 2 GB</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-value" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 -z-10 w-full h-full rounded-2xl bg-primary-100"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section id="features" className="bg-neutral-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-500 font-medium">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Everything you need for your health data</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              TrustRx provides a comprehensive platform for managing your health records securely with blockchain verification and connecting with healthcare providers.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={featureContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <FeatureCard 
              icon={<ShieldCheck className="h-8 w-8 text-primary-500" />}
              title="Blockchain Security"
              description="Your medical records are secured and verified with Algorand blockchain technology."
              variants={featureItemVariants}
            />
            <FeatureCard 
              icon={<HardDrive className="h-8 w-8 text-primary-500" />}
              title="Secure Storage"
              description="Store all your medical records in one secure place with different subscription tiers."
              variants={featureItemVariants}
            />
            <FeatureCard 
              icon={<Stethoscope className="h-8 w-8 text-primary-500" />}
              title="Doctor Discovery"
              description="Find and connect with qualified healthcare providers based on specialty and location."
              variants={featureItemVariants}
            />
            <FeatureCard 
              icon={<CalendarClock className="h-8 w-8 text-primary-500" />}
              title="Appointment Management"
              description="Request and manage appointments with your healthcare providers seamlessly."
              variants={featureItemVariants}
            />
          </motion.div>
        </div>
      </section>
      
      {/* Pricing section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-500 font-medium">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Choose the right plan for you</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              We offer flexible plans to meet your needs, from free basic storage to unlimited premium options.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <PricingCard 
              title="Free"
              price="$0"
              features={[
                "2GB secure storage",
                "Basic record management",
                "Doctor discovery",
                "Appointment requests"
              ]}
              buttonText="Get Started"
              onClick={handleGetStarted}
            />
            <PricingCard 
              title="Basic"
              price="$2.99"
              period="monthly"
              features={[
                "10GB secure storage",
                "Advanced record management",
                "Doctor discovery",
                "Appointment scheduling"
              ]}
              buttonText="Get Started"
              onClick={handleGetStarted}
              highlight={false}
            />
            <PricingCard 
              title="Premium"
              price="$9.99"
              period="monthly"
              features={[
                "50GB secure storage",
                "Priority support",
                "Verified doctor contacts",
                "Family member accounts",
                "Advanced appointment features"
              ]}
              buttonText="Get Started"
              onClick={handleGetStarted}
              highlight={true}
            />
            <PricingCard 
              title="Unlimited"
              price="$15.99"
              period="monthly"
              features={[
                "Unlimited storage",
                "Premium support",
                "All premium features",
                "Multiple family members",
                "Priority appointments",
                "Health analytics"
              ]}
              buttonText="Get Started"
              onClick={handleGetStarted}
              highlight={false}
            />
          </div>
          
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">For Doctors</h3>
            <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
              <PricingCard 
                title="Free"
                price="$0"
                features={[
                  "Basic profile",
                  "Limited storage",
                  "Appointment management",
                  "Patient communication"
                ]}
                buttonText="Sign Up"
                onClick={handleGetStarted}
                isWide={true}
              />
              <PricingCard 
                title="Professional"
                price="$5.99"
                period="monthly"
                features={[
                  "Unlimited storage",
                  "Verified badge",
                  "Priority in search results",
                  "Advanced appointment management",
                  "Patient record access",
                  "Analytics dashboard"
                ]}
                buttonText="Sign Up"
                onClick={handleGetStarted}
                highlight={true}
                isWide={true}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="testimonials" className="bg-neutral-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-500 font-medium">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">What our users say</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Hear from patients and doctors who are already using TrustRx to manage their health data securely.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="As a patient with chronic conditions, having all my medical records in one secure place has been life-changing. The blockchain verification gives me peace of mind."
              name="Sarah Johnson"
              role="Patient"
            />
            <TestimonialCard 
              quote="The appointment management system has streamlined my practice. I can now focus more on patient care rather than administrative tasks."
              name="Dr. Michael Chen"
              role="Cardiologist"
            />
            <TestimonialCard 
              quote="Finding specialists has never been easier. The doctor discovery feature helped me connect with the perfect specialist for my condition."
              name="David Martinez"
              role="Patient"
            />
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-20 bg-primary-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to secure your health data?</h2>
          <p className="text-xl text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of patients and doctors who trust TrustRx for secure health record management and seamless healthcare connections.
          </p>
          <button 
            onClick={handleGetStarted}
            className="btn bg-white text-primary-700 hover:bg-primary-50 px-8 py-3 text-lg font-medium"
          >
            Get Started Now
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <FileLock className="h-6 w-6 text-primary-400 mr-2" />
                <span className="text-xl font-bold">TrustRx</span>
              </div>
              <p className="text-neutral-300 mb-4">
                Secure health record management with blockchain verification.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-neutral-300">support@trustrx.com</li>
                <li className="text-neutral-300">+1 (800) 123-4567</li>
                <li className="text-neutral-300">1234 Health Ave, Suite 500<br />San Francisco, CA 94107</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-neutral-700 text-center text-neutral-400 text-sm">
            &copy; {new Date().getFullYear()} TrustRx. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, variants }) => (
  <motion.div 
    className="bg-white p-6 rounded-xl shadow-sm transition-all hover:shadow-md"
    variants={variants}
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-neutral-600">{description}</p>
  </motion.div>
);

const PricingCard = ({ title, price, period, features, buttonText, onClick, highlight = false, isWide = false }) => (
  <div className={`bg-white rounded-xl border ${highlight ? 'border-primary-500 shadow-md' : 'border-neutral-200'} overflow-hidden transition-all hover:shadow-md ${isWide ? 'md:col-span-1' : ''}`}>
    {highlight && (
      <div className="bg-primary-500 text-white text-center py-1 text-sm font-medium">
        Most Popular
      </div>
    )}
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        {period && <span className="text-neutral-500 ml-1">/{period}</span>}
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="h-5 w-5 text-primary-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-neutral-600">{feature}</span>
          </li>
        ))}
      </ul>
      <button 
        onClick={onClick}
        className={`w-full ${highlight ? 'btn-primary' : 'btn-outline'}`}
      >
        {buttonText}
      </button>
    </div>
  </div>
);

const TestimonialCard = ({ quote, name, role }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="mb-4 text-accent-500">
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
    </div>
    <p className="text-neutral-600 mb-6">{quote}</p>
    <div className="flex items-center">
      <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center mr-3">
        {name.charAt(0)}
      </div>
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-neutral-500">{role}</p>
      </div>
    </div>
  </div>
);

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 3V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89464 14.7348 8 15 8H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H14L19 8V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default Landing;
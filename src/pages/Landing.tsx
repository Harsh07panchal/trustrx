import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  FileLock, 
  ShieldCheck, 
  Stethoscope, 
  CalendarClock, 
  HardDrive,
  Search,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Zap,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MouseFollower from '../components/ui/MouseFollower';
import ScrollReveal from '../components/ui/ScrollReveal';
import InteractiveCard from '../components/ui/InteractiveCard';
import ParticleBackground from '../components/ui/ParticleBackground';

const Landing = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
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
  
  const getDashboardLink = () => {
    if (!currentUser) return '/login';
    return userProfile?.role === 'patient' 
      ? '/patient/dashboard' 
      : '/doctor/dashboard';
  };
  
  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const floatingIcons = [
    { icon: Heart, delay: 0, x: 100, y: 50 },
    { icon: ShieldCheck, delay: 1, x: -80, y: 100 },
    { icon: Sparkles, delay: 2, x: 120, y: -30 },
    { icon: Zap, delay: 0.5, x: -100, y: -50 },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <MouseFollower />
      <ParticleBackground />
      
      {/* Floating background elements */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute opacity-10 text-primary-500"
          style={{ x: item.x, y: item.y }}
          animate={{
            y: [item.y, item.y - 20, item.y],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <item.icon size={60} />
        </motion.div>
      ))}

      {/* Header */}
      <motion.header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled ? 'glass-effect shadow-lg' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <FileLock className="h-6 w-6 text-primary-500 mr-2" />
              </motion.div>
              <span className="text-xl font-bold gradient-text">TrustRx</span>
            </motion.div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {[
                { name: 'Features', href: '#features' },
                { name: 'Pricing', href: '/pricing' },
                { name: 'Testimonials', href: '#testimonials' }
              ].map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (item.href.startsWith('/')) {
                      e.preventDefault();
                      navigate(item.href);
                    }
                  }}
                  className="text-neutral-600 hover:text-primary-500 transition-all duration-300 relative group"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                </motion.a>
              ))}
              <motion.button 
                onClick={handleSignIn}
                className="text-neutral-600 hover:text-primary-500 transition-colors magnetic-hover"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentUser ? 'Dashboard' : 'Sign In'}
              </motion.button>
              <motion.button 
                onClick={handleGetStarted}
                className="btn-primary ripple"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(12, 184, 182, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                {currentUser ? 'Dashboard' : 'Get Started'}
              </motion.button>
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button 
                onClick={() => setMobileMenuOpen(true)}
                className="text-neutral-500"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Menu size={24} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div 
          className="fixed inset-0 z-50 glass-effect"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="container mx-auto px-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileLock className="h-6 w-6 text-primary-500 mr-2" />
                <span className="text-xl font-bold">TrustRx</span>
              </div>
              <motion.button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-neutral-500"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </div>
            
            <motion.nav 
              className="mt-8 space-y-6"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {[
                { name: 'Features', href: '#features' },
                { name: 'Pricing', href: '/pricing' },
                { name: 'Testimonials', href: '#testimonials' }
              ].map((item, index) => (
                <motion.a 
                  key={item.name}
                  href={item.href}
                  className="block text-lg text-neutral-600 hover:text-primary-500 transition-colors"
                  onClick={(e) => {
                    if (item.href.startsWith('/')) {
                      e.preventDefault();
                      navigate(item.href);
                    }
                    setMobileMenuOpen(false);
                  }}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                >
                  {item.name}
                </motion.a>
              ))}
              <motion.button 
                onClick={() => {
                  handleSignIn();
                  setMobileMenuOpen(false);
                }}
                className="block text-lg text-neutral-600 hover:text-primary-500 transition-colors"
                whileHover={{ x: 10 }}
              >
                {currentUser ? 'Dashboard' : 'Sign In'}
              </motion.button>
              <motion.button 
                onClick={() => {
                  handleGetStarted();
                  setMobileMenuOpen(false);
                }}
                className="w-full btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {currentUser ? 'Dashboard' : 'Get Started'}
              </motion.button>
            </motion.nav>
          </div>
        </motion.div>
      )}
      
      {/* Hero section */}
      <section className="flex-1 relative">
        <motion.div style={{ y }} className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white to-accent-50/50" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              variants={heroVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                variants={itemVariants}
              >
                Your health data, <motion.span 
                  className="gradient-text"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  secured
                </motion.span> by blockchain
              </motion.h1>
              
              <motion.p 
                className="text-xl text-neutral-600 mb-8"
                variants={itemVariants}
              >
                Securely store your medical records, find the right doctors, and request appointments - all in one place.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                variants={itemVariants}
              >
                <motion.button 
                  onClick={handleGetStarted}
                  className="btn-primary text-lg px-8 py-3 pulse-glow-animation"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(12, 184, 182, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                  <motion.span
                    className="ml-2 inline-block"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.button>
                <motion.button 
                  onClick={() => navigate('/pricing')}
                  className="btn-outline text-lg px-8 py-3 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Pricing
                </motion.button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <InteractiveCard 
                className="relative"
                glowEffect={true}
                tiltEffect={true}
              >
                <motion.div 
                  className="bg-white rounded-2xl shadow-2xl overflow-hidden"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 flex items-center">
                    <div className="flex space-x-2 mr-4">
                      {[0, 1, 2].map((i) => (
                        <motion.div 
                          key={i}
                          className="w-3 h-3 rounded-full bg-white bg-opacity-30"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                        />
                      ))}
                    </div>
                    <span className="text-white font-medium">Medical Records Dashboard</span>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Your Records</h3>
                      <motion.div 
                        className="flex items-center text-sm text-primary-500 cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        <span>View All</span>
                        <ArrowRight size={16} className="ml-1" />
                      </motion.div>
                    </div>
                    
                    <div className="space-y-4">
                      {[1, 2, 3].map((item, index) => (
                        <motion.div 
                          key={item} 
                          className="border border-neutral-200 rounded-lg p-4 flex items-center hover:border-primary-200 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + index * 0.2 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <motion.div 
                            className="h-10 w-10 rounded-md bg-primary-100 text-primary-500 flex items-center justify-center mr-4"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <FileIcon />
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Medical Report {item}</h4>
                              <span className="text-xs text-neutral-500">2 days ago</span>
                            </div>
                            <p className="text-sm text-neutral-500">Dr. Smith • General Check-up</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-neutral-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Storage Used</span>
                        <span className="text-sm text-neutral-500">1.2 GB / 2 GB</span>
                      </div>
                      <div className="progress-bar">
                        <motion.div 
                          className="progress-value" 
                          initial={{ width: "0%" }}
                          animate={{ width: "60%" }}
                          transition={{ duration: 2, delay: 1.5 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-6 -right-6 -z-10 w-full h-full rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 1, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </InteractiveCard>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section id="features" className="bg-gradient-to-br from-neutral-50 to-primary-50/30 py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <motion.span 
                className="text-primary-500 font-medium"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Features
              </motion.span>
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mt-2 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Everything you need for your health data
              </motion.h2>
              <motion.p 
                className="text-neutral-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                TrustRx provides a comprehensive platform for managing your health records securely with blockchain verification and connecting with healthcare providers.
              </motion.p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Blockchain Security",
                description: "Your medical records are secured and verified with Algorand blockchain technology.",
                color: "text-primary-500"
              },
              {
                icon: HardDrive,
                title: "Secure Storage",
                description: "Store all your medical records in one secure place with different subscription tiers.",
                color: "text-accent-500"
              },
              {
                icon: Stethoscope,
                title: "Doctor Discovery",
                description: "Find and connect with qualified healthcare providers based on specialty and location.",
                color: "text-secondary-500"
              },
              {
                icon: CalendarClock,
                title: "Appointment Management",
                description: "Request and manage appointments with your healthcare providers seamlessly.",
                color: "text-success-500"
              }
            ].map((feature, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <InteractiveCard 
                  className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200"
                  glowEffect={true}
                  tiltEffect={true}
                >
                  <motion.div 
                    className={`mb-4 ${feature.color}`}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </InteractiveCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(12, 184, 182, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <FileLock className="h-6 w-6 text-primary-400 mr-2" />
                </motion.div>
                <span className="text-xl font-bold">TrustRx</span>
              </div>
              <p className="text-neutral-300 mb-4">
                Secure health record management with blockchain verification.
              </p>
            </motion.div>
            
            {/* Add more footer content with animations... */}
          </div>
          
          <motion.div 
            className="mt-12 pt-8 border-t border-neutral-700 text-center text-neutral-400 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            &copy; {new Date().getFullYear()} TrustRx. All rights reserved.
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

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
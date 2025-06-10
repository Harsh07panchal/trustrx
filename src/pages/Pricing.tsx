import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Check, 
  Star, 
  Users, 
  Shield, 
  HardDrive, 
  Clock, 
  Phone, 
  Mail,
  Zap,
  Crown,
  Heart,
  ArrowRight,
  FileLock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Pricing = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started with basic health record management',
      icon: <Shield className="h-8 w-8" />,
      color: 'from-neutral-500 to-neutral-600',
      popular: false,
      features: [
        '2GB secure storage',
        '5 medical records per month',
        'Basic blockchain verification',
        'Doctor discovery',
        '2 appointment requests per month',
        'Email support',
        'Mobile responsive access'
      ],
      limitations: [
        'Limited to 5 uploads per month',
        'Basic support only',
        'No family sharing'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 2.99, yearly: 29.99 },
      description: 'Enhanced features for active health management',
      icon: <Star className="h-8 w-8" />,
      color: 'from-primary-500 to-primary-600',
      popular: true,
      features: [
        '50GB secure storage',
        'Unlimited medical records',
        'Advanced blockchain verification',
        'Priority doctor discovery',
        'Unlimited appointment requests',
        'Priority email & chat support',
        'Advanced search & filtering',
        'Health timeline view',
        'Export & sharing tools',
        'Mobile app access'
      ],
      limitations: []
    },
    {
      id: 'family',
      name: 'Family',
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'Complete health management for your entire family',
      icon: <Users className="h-8 w-8" />,
      color: 'from-accent-500 to-accent-600',
      popular: false,
      features: [
        'Everything in Premium',
        'Up to 5 family members',
        '200GB shared storage',
        'Family health dashboard',
        'Shared appointment calendar',
        'Emergency contact system',
        'Family health insights',
        'Dedicated family support',
        'Admin controls & permissions',
        'Bulk record management',
        'Family health reports'
      ],
      limitations: []
    }
  ];

  const handleSelectPlan = (planId: string) => {
    if (currentUser) {
      navigate('/patient/subscription');
    } else {
      navigate('/register');
    }
  };

  const formatPrice = (price: { monthly: number; yearly: number }) => {
    const amount = billingPeriod === 'monthly' ? price.monthly : price.yearly;
    if (amount === 0) return 'Free';
    return `$${amount.toFixed(2)}`;
  };

  const calculateSavings = (price: { monthly: number; yearly: number }) => {
    if (price.monthly === 0) return 0;
    const yearlyEquivalent = price.monthly * 12;
    const savings = yearlyEquivalent - price.yearly;
    return Math.round((savings / yearlyEquivalent) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-neutral-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileLock className="h-6 w-6 text-primary-500 mr-2" />
              <span className="text-xl font-bold gradient-text">TrustRx</span>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="text-neutral-600 hover:text-primary-500 transition-colors"
              >
                Back to Home
              </button>
              {currentUser ? (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="btn-primary"
                >
                  Dashboard
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="btn-primary"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your <span className="gradient-text">Health Plan</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
            Secure your medical records with blockchain technology. From basic storage to comprehensive family health management.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center p-1 bg-neutral-100 rounded-lg">
              <button
                className={`px-4 py-2 text-sm rounded-md transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-white shadow-sm font-medium text-neutral-900'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                onClick={() => setBillingPeriod('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 text-sm rounded-md transition-all ${
                  billingPeriod === 'yearly'
                    ? 'bg-white shadow-sm font-medium text-neutral-900'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                onClick={() => setBillingPeriod('yearly')}
              >
                Yearly
                <span className="ml-2 text-xs bg-success-100 text-success-700 px-2 py-0.5 rounded-full font-medium">
                  Save up to 17%
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'ring-2 ring-primary-500 shadow-2xl' 
                  : 'border border-neutral-200 shadow-lg hover:shadow-xl'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center py-2 text-sm font-medium">
                  <Crown className="inline h-4 w-4 mr-1" />
                  Most Popular
                </div>
              )}
              
              <div className={`${plan.popular ? 'pt-12' : 'pt-8'} pb-8 px-8 bg-white`}>
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} text-white mb-4`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-neutral-600 text-sm mb-6">{plan.description}</p>
                  
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold">
                        {formatPrice(plan.price)}
                      </span>
                      {plan.price.monthly > 0 && (
                        <span className="text-neutral-500 ml-1">
                          /{billingPeriod === 'monthly' ? 'month' : 'year'}
                        </span>
                      )}
                    </div>
                    {billingPeriod === 'yearly' && plan.price.monthly > 0 && (
                      <div className="text-sm text-success-600 font-medium mt-1">
                        Save {calculateSavings(plan.price)}% annually
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="border-t border-neutral-200 pt-6 mb-8">
                    <h4 className="text-sm font-medium text-neutral-500 mb-3">Limitations:</h4>
                    <div className="space-y-2">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-start">
                          <div className="h-2 w-2 bg-neutral-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                          <span className="text-sm text-neutral-500">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <motion.button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.id === 'free' ? 'Get Started Free' : 'Choose Plan'}
                  <ArrowRight className="inline h-4 w-4 ml-2" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose TrustRx?</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Every plan includes our core security features powered by blockchain technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Blockchain Security</h3>
              <p className="text-neutral-600">
                Every medical record is verified and secured using Algorand blockchain technology
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success-100 text-success-600 mb-4">
                <HardDrive className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Storage</h3>
              <p className="text-neutral-600">
                Enterprise-grade encryption ensures your health data remains private and secure
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-100 text-accent-600 mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Access</h3>
              <p className="text-neutral-600">
                Access your medical records anytime, anywhere with our responsive platform
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="mt-20 bg-white rounded-2xl p-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-neutral-600 text-sm">
                Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at your next billing cycle.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Is my data secure?</h3>
              <p className="text-neutral-600 text-sm">
                Absolutely. We use blockchain verification, enterprise-grade encryption, and strict access controls to protect your health data.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">How does family sharing work?</h3>
              <p className="text-neutral-600 text-sm">
                The Family plan allows up to 5 members with individual accounts, shared storage, and admin controls for managing permissions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-neutral-600 text-sm">
                We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-neutral-600 mb-6">
            Our team is here to help you find the perfect plan for your needs
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="mailto:support@trustrx.com" 
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              <Mail className="h-4 w-4 mr-2" />
              support@trustrx.com
            </a>
            <a 
              href="tel:+1-555-0123" 
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              <Phone className="h-4 w-4 mr-2" />
              +1 (555) 012-3456
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
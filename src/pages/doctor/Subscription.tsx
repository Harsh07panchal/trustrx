import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CreditCard, Shield, HardDrive, Clock, RefreshCcw } from 'lucide-react';

// Subscription plan data
const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    storageLimit: 2, // in GB
    billingPeriod: 'monthly',
    features: [
      '2GB secure storage',
      'Basic record management',
      'Doctor discovery',
      'Appointment requests',
      'Blockchain verification'
    ]
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 2.99,
    storageLimit: 10, // in GB
    billingPeriod: 'monthly',
    features: [
      '10GB secure storage',
      'Advanced record management',
      'Doctor discovery',
      'Appointment scheduling',
      'Blockchain verification',
      'Email notifications'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    storageLimit: 50, // in GB
    billingPeriod: 'monthly',
    features: [
      '50GB secure storage',
      'Priority support',
      'Verified doctor contacts',
      'Family member accounts',
      'Advanced appointment features',
      'Health timeline',
      'Email & SMS notifications'
    ]
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: 15.99,
    storageLimit: -1, // unlimited
    billingPeriod: 'monthly',
    features: [
      'Unlimited storage',
      'Premium support',
      'All premium features',
      'Multiple family members',
      'Priority appointments',
      'Health analytics',
      'Custom categories',
      'API access'
    ]
  }
];

// Billing history data
const billingHistory = [
  {
    id: '1',
    date: '2023-06-01',
    amount: 0,
    plan: 'Free',
    status: 'Completed'
  }
];

const DoctorSubscription = () => {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showBillingHistory, setShowBillingHistory] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const getCurrentPlanDetails = () => {
    return subscriptionPlans.find(plan => plan.id === currentPlan);
  };
  
  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `$${price.toFixed(2)}`;
  };
  
  const formatStorageLimit = (limit: number) => {
    if (limit === -1) return 'Unlimited';
    return `${limit} GB`;
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowUpgradeModal(true);
  };
  
  const handleUpgrade = () => {
    if (!selectedPlan) return;
    setCurrentPlan(selectedPlan);
    setShowUpgradeModal(false);
    setSelectedPlan(null);
  };
  
  const currentPlanDetails = getCurrentPlanDetails();
  
  return (
    <div className="space-y-6">
      {/* Current plan section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        <h2 className="text-2xl font-bold mb-6">Your Subscription</h2>
        
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">{currentPlanDetails?.name} Plan</h3>
              <p className="text-neutral-600">
                {formatPrice(currentPlanDetails?.price || 0)}/{currentPlanDetails?.billingPeriod}
              </p>
            </div>
            
            <div className="space-x-3">
              <button 
                className="btn-ghost"
                onClick={() => setShowBillingHistory(!showBillingHistory)}
              >
                Billing History
              </button>
              {currentPlan !== 'unlimited' && (
                <button 
                  className="btn-primary"
                  onClick={() => setShowUpgradeModal(true)}
                >
                  Upgrade Plan
                </button>
              )}
            </div>
          </div>
          
          {/* Storage usage */}
          <div className="mt-6">
            <div className="flex items-center mb-4">
              <Shield size={18} className="text-primary-500 mr-2" />
              <span className="font-medium">Plan Benefits</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentPlanDetails?.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <Check size={16} className="text-primary-500 mr-2 mt-0.5" />
                  <span className="text-neutral-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Next billing date */}
          <div className="mt-4 flex items-center text-sm text-neutral-600">
            <Clock size={16} className="mr-2" />
            <span>Next billing date: July 1, 2023</span>
          </div>
        </div>
        
        {/* Billing history */}
        {showBillingHistory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">Billing History</h3>
            
            <div className="border border-neutral-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {billingHistory.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        {item.plan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        {formatPrice(item.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-success-100 text-success-800">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Subscription plans section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Available Plans</h2>
          
          <div className="flex items-center p-1 bg-neutral-100 rounded-lg">
            <button
              className={`px-3 py-1 text-sm rounded-md ${
                billingPeriod === 'monthly'
                  ? 'bg-white shadow-sm font-medium'
                  : 'text-neutral-600'
              }`}
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${
                billingPeriod === 'yearly'
                  ? 'bg-white shadow-sm font-medium'
                  : 'text-neutral-600'
              }`}
              onClick={() => setBillingPeriod('yearly')}
            >
              Yearly
              <span className="ml-1 text-xs text-success-600 font-medium">Save 20%</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subscriptionPlans.map((plan) => (
            <PlanCard 
              key={plan.id}
              plan={plan}
              isCurrentPlan={currentPlan === plan.id}
              billingPeriod={billingPeriod}
              onSelectPlan={handleSelectPlan}
            />
          ))}
        </div>
      </div>
      
      {/* Payment methods section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
        
        <div className="border border-neutral-200 rounded-lg p-4 flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-neutral-100 rounded-md flex items-center justify-center mr-4">
              <CreditCard size={20} className="text-neutral-600" />
            </div>
            <div>
              <p className="font-medium">No payment method added</p>
              <p className="text-sm text-neutral-500">Add a payment method to upgrade your plan</p>
            </div>
          </div>
          <button className="btn-outline">
            Add Method
          </button>
        </div>
        
        <div className="text-sm text-neutral-500 flex items-center">
          <Shield size={16} className="mr-2 text-primary-500" />
          <span>Your payment information is stored securely.</span>
        </div>
      </div>
      
      {/* Upgrade modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">
                {selectedPlan 
                  ? `Upgrade to ${subscriptionPlans.find(p => p.id === selectedPlan)?.name}` 
                  : 'Upgrade Your Plan'}
              </h3>
              
              {!selectedPlan ? (
                <div className="space-y-4">
                  {subscriptionPlans.map((plan) => (
                    <button
                      key={plan.id}
                      className={`w-full p-4 border rounded-lg text-left flex justify-between items-center ${
                        currentPlan === plan.id
                          ? 'bg-primary-50 border-primary-500'
                          : 'border-neutral-200 hover:border-primary-200'
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                      disabled={currentPlan === plan.id}
                    >
                      <div>
                        <span className="font-medium">{plan.name}</span>
                        <span className="ml-2">{formatPrice(plan.price)}/{plan.billingPeriod}</span>
                      </div>
                      {currentPlan === plan.id && (
                        <span className="text-primary-500 text-sm font-medium">Current Plan</span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-600">Current Plan</span>
                      <span className="font-medium">{getCurrentPlanDetails()?.name}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-600">New Plan</span>
                      <span className="font-medium">{subscriptionPlans.find(p => p.id === selectedPlan)?.name}</span>
                    </div>
                    <div className="border-t border-neutral-200 my-2 pt-2">
                      <div className="flex justify-between font-medium">
                        <span>New Price</span>
                        <span>{formatPrice(subscriptionPlans.find(p => p.id === selectedPlan)?.price || 0)}/{billingPeriod}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-neutral-600 mb-4">
                    Your subscription will be upgraded immediately. You'll be charged the new rate on your next billing date.
                  </p>
                  
                  <div className="flex items-center text-sm text-neutral-600 mb-6">
                    <RefreshCcw size={16} className="mr-2 text-primary-500" />
                    <span>You can downgrade or cancel anytime.</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t border-neutral-200 p-4 flex justify-end gap-3">
              <button 
                className="btn-ghost"
                onClick={() => {
                  setShowUpgradeModal(false);
                  setSelectedPlan(null);
                }}
              >
                Cancel
              </button>
              
              {selectedPlan ? (
                <button 
                  className="btn-primary"
                  onClick={handleUpgrade}
                  disabled={currentPlan === selectedPlan}
                >
                  Confirm Upgrade
                </button>
              ) : (
                <button 
                  className="btn-primary"
                  onClick={() => {}}
                  disabled={!selectedPlan}
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Plan card component
interface PlanCardProps {
  plan: typeof subscriptionPlans[0];
  isCurrentPlan: boolean;
  billingPeriod: 'monthly' | 'yearly';
  onSelectPlan: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isCurrentPlan, billingPeriod, onSelectPlan }) => {
  // Calculate yearly price (20% discount)
  const yearlyPrice = plan.price * 0.8 * 12;
  
  return (
    <div className={`border rounded-xl overflow-hidden transition-all hover:shadow-md ${
      isCurrentPlan ? 'border-primary-500 shadow-sm' : 'border-neutral-200'
    }`}>
      {isCurrentPlan && (
        <div className="bg-primary-500 text-white text-center py-1 text-sm font-medium">
          Current Plan
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
        <div className="mb-4">
          <span className="text-3xl font-bold">
            {billingPeriod === 'monthly' 
              ? formatPrice(plan.price) 
              : formatPrice(yearlyPrice)}
          </span>
          <span className="text-neutral-500 ml-1">
            /{billingPeriod}
          </span>
        </div>
        
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check size={18} className="text-primary-500 mr-2 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <button 
          className={`w-full ${
            isCurrentPlan 
              ? 'btn-ghost cursor-default'
              : 'btn-primary'
          }`}
          onClick={() => !isCurrentPlan && onSelectPlan(plan.id)}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
        </button>
      </div>
    </div>
  );
};

export default DoctorSubscription;
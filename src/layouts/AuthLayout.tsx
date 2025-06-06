import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FileLock } from 'lucide-react';

const AuthLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Brand and info */}
      <div className="bg-secondary-900 text-white flex flex-col justify-center p-6 md:p-12 md:w-1/2">
        <div 
          className="cursor-pointer flex items-center mb-8" 
          onClick={() => navigate('/')}
        >
          <FileLock className="h-8 w-8 text-primary-400 mr-2" />
          <span className="text-2xl font-bold">TrustRx</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Your health data, <span className="text-primary-400">secured</span> by blockchain
        </h1>
        
        <p className="text-neutral-300 mb-8 text-lg">
          Securely store your medical records, find the right doctors, and request appointments - all in one place.
        </p>
        
        <div className="hidden md:block space-y-6">
          <FeatureItem 
            title="Blockchain Verification" 
            description="Every medical record is verified and secured using Algorand blockchain technology." 
          />
          <FeatureItem 
            title="Doctor Discovery" 
            description="Find and connect with qualified healthcare professionals tailored to your needs." 
          />
          <FeatureItem 
            title="Appointment Management" 
            description="Request and manage appointments with your healthcare providers seamlessly." 
          />
        </div>
      </div>
      
      {/* Right side - Auth forms */}
      <div className="bg-white p-6 md:p-12 flex items-center justify-center md:w-1/2">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ title, description }: { title: string; description: string }) => (
  <div className="flex items-start">
    <div className="bg-primary-500 rounded-full p-2 mr-4 mt-1">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-neutral-300 text-sm">{description}</p>
    </div>
  </div>
);

export default AuthLayout;
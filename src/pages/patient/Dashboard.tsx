import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, User, CalendarClock, ShieldCheck, ArrowRight, Wallet, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const PatientDashboard = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [recentRecords, setRecentRecords] = useState([
    { id: '1', name: 'Annual Physical Results', date: '2023-06-15', doctor: 'Dr. Sarah Johnson', type: 'labResults' },
    { id: '2', name: 'Chest X-Ray', date: '2023-04-22', doctor: 'Dr. Michael Chen', type: 'imaging' },
    { id: '3', name: 'Allergy Test Results', date: '2023-02-10', doctor: 'Dr. Emily Rodriguez', type: 'labResults' },
  ]);
  
  const [upcomingAppointments, setUpcomingAppointments] = useState([
    { id: '1', doctor: 'Dr. Sarah Johnson', specialty: 'General Practitioner', date: '2023-07-25', time: '09:30 AM' },
    { id: '2', doctor: 'Dr. David Lee', specialty: 'Dermatologist', date: '2023-08-12', time: '02:15 PM' },
  ]);
  
  const [storageUsed, setStorageUsed] = useState(1.2); // in GB
  const [storageLimit, setStorageLimit] = useState(2); // in GB
  
  const getStoragePercentage = () => {
    return (storageUsed / storageLimit) * 100;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Welcome header */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200"
      >
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {userProfile?.displayName?.split(' ')[0] || 'User'}
        </h2>
        <p className="text-neutral-600">
          Here's an overview of your health records and upcoming appointments.
        </p>
      </motion.div>
      
      {/* Stats overview */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <StatCard 
          icon={<FileText className="h-6 w-6 text-primary-500" />}
          title="Medical Records"
          value="12"
          link="/patient/records"
        />
        <StatCard 
          icon={<User className="h-6 w-6 text-primary-500" />}
          title="Doctors"
          value="3"
          link="/patient/doctors"
        />
        <StatCard 
          icon={<CalendarClock className="h-6 w-6 text-primary-500" />}
          title="Appointments"
          value={upcomingAppointments.length.toString()}
          link="/patient/appointments"
        />
      </motion.div>

      {/* Blockchain Wallet Setup */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Wallet className="mr-2" size={20} />
              Algorand Wallet Setup
            </h3>
            <p className="text-primary-100 mb-4">
              Set up your Algorand wallet to enable blockchain verification for your medical records.
            </p>
            <div className="flex items-center text-sm text-primary-100">
              <ShieldCheck size={16} className="mr-2" />
              <span>Secure • Decentralized • Tamper-proof</span>
            </div>
          </div>
          <div className="text-right">
            <button 
              onClick={() => window.open('/wallet-setup', '_blank')}
              className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors flex items-center"
            >
              Setup Wallet
              <ExternalLink size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Recent records */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Medical Records</h3>
          <Link to="/patient/records" className="text-primary-500 flex items-center hover:text-primary-600 text-sm font-medium">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentRecords.map((record) => (
            <div key={record.id} className="border border-neutral-200 rounded-lg p-4 flex items-center">
              <div className="h-10 w-10 rounded-md bg-primary-100 text-primary-500 flex items-center justify-center mr-4">
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{record.name}</h4>
                  <span className="text-xs text-neutral-500">{formatDate(record.date)}</span>
                </div>
                <p className="text-sm text-neutral-500">{record.doctor}</p>
              </div>
            </div>
          ))}
        </div>
        
        {recentRecords.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 mb-4">You don't have any medical records yet</p>
            <Link to="/patient/records" className="btn-primary inline-flex">
              Upload Your First Record
            </Link>
          </div>
        )}
      </motion.div>
      
      {/* Upcoming appointments */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
          <Link to="/patient/appointments" className="text-primary-500 flex items-center hover:text-primary-600 text-sm font-medium">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="border border-neutral-200 rounded-lg p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-secondary-100 text-secondary-800 flex items-center justify-center mr-4 font-medium">
                {appointment.doctor.split(' ')[1][0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{appointment.doctor}</h4>
                  <span className="text-xs text-neutral-500">{formatDate(appointment.date)}</span>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-neutral-500">{appointment.specialty}</p>
                  <p className="text-sm text-primary-500">{appointment.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {upcomingAppointments.length === 0 && (
          <div className="text-center py-8">
            <CalendarClock className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 mb-4">You don't have any upcoming appointments</p>
            <Link to="/patient/doctors" className="btn-primary inline-flex">
              Find a Doctor
            </Link>
          </div>
        )}
      </motion.div>
      
      {/* Storage usage */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Storage Usage</h3>
          <button 
            onClick={() => navigate('/patient/subscription')} 
            className="text-primary-500 flex items-center hover:text-primary-600 text-sm font-medium"
          >
            Upgrade Plan <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
        
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <ShieldCheck className="h-5 w-5 text-success-500 mr-2" />
            <span className="text-sm font-medium">Secured by blockchain verification</span>
          </div>
          <span className="text-sm text-neutral-500">{storageUsed} GB / {storageLimit} GB</span>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-value" 
            style={{ width: `${getStoragePercentage()}%` }}
          ></div>
        </div>
        
        <p className="mt-4 text-sm text-neutral-500">
          You're currently on the <span className="font-medium">Free</span> plan. 
          <button 
            onClick={() => navigate('/patient/subscription')}
            className="text-primary-500 hover:text-primary-600 ml-1"
          >
            Upgrade to get more storage and premium features.
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
};

const StatCard = ({ icon, title, value, link }) => (
  <Link to={link} className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200 hover:border-primary-200 transition-all hover:shadow-md">
    <div className="flex items-center mb-2">
      {icon}
      <h3 className="text-lg font-semibold ml-2">{title}</h3>
    </div>
    <p className="text-3xl font-bold text-primary-500">{value}</p>
  </Link>
);

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default PatientDashboard;
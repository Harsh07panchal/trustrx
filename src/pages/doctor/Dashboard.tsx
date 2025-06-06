import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, UserCheck, ClipboardList, Clock, ArrowRight, Users, BarChart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const DoctorDashboard = () => {
  const { userProfile } = useAuth();
  
  // Mock data for today's appointments
  const [todayAppointments, setTodayAppointments] = useState([
    { 
      id: '1', 
      patientName: 'John Smith', 
      time: '09:30 AM', 
      status: 'confirmed',
      reason: 'Annual check-up'
    },
    { 
      id: '2', 
      patientName: 'Emily Johnson', 
      time: '11:00 AM', 
      status: 'confirmed',
      reason: 'Follow-up appointment'
    },
    { 
      id: '3', 
      patientName: 'Michael Brown', 
      time: '02:15 PM', 
      status: 'confirmed',
      reason: 'Consultation'
    }
  ]);
  
  // Mock data for pending appointment requests
  const [pendingRequests, setPendingRequests] = useState([
    { 
      id: '1', 
      patientName: 'Sarah Williams', 
      requestDate: '2023-07-18',
      preferredDate: '2023-07-25',
      reason: 'New patient consultation'
    },
    { 
      id: '2', 
      patientName: 'David Lee', 
      requestDate: '2023-07-17',
      preferredDate: '2023-07-26',
      reason: 'Skin condition'
    }
  ]);
  
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
          Welcome back, Dr. {userProfile?.displayName?.split(' ')[1] || 'User'}
        </h2>
        <p className="text-neutral-600">
          Here's an overview of your appointments and requests for today.
        </p>
      </motion.div>
      
      {/* Stats overview */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <StatCard 
          icon={<CalendarClock className="h-6 w-6 text-primary-500" />}
          title="Today's Appointments"
          value={todayAppointments.length.toString()}
          link="/doctor/appointments"
        />
        <StatCard 
          icon={<UserCheck className="h-6 w-6 text-primary-500" />}
          title="Pending Requests"
          value={pendingRequests.length.toString()}
          link="/doctor/appointments"
        />
        <StatCard 
          icon={<Users className="h-6 w-6 text-primary-500" />}
          title="Total Patients"
          value="46"
          link="/doctor/patients"
        />
      </motion.div>
      
      {/* Today's appointments */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Today's Appointments</h3>
          <Link to="/doctor/appointments" className="text-primary-500 flex items-center hover:text-primary-600 text-sm font-medium">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {todayAppointments.map((appointment) => (
            <div key={appointment.id} className="border border-neutral-200 rounded-lg p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-secondary-100 text-secondary-800 flex items-center justify-center mr-4 font-medium">
                {appointment.patientName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{appointment.patientName}</h4>
                  <span className="text-primary-500 font-medium">{appointment.time}</span>
                </div>
                <p className="text-sm text-neutral-500">{appointment.reason}</p>
              </div>
            </div>
          ))}
        </div>
        
        {todayAppointments.length === 0 && (
          <div className="text-center py-8">
            <CalendarClock className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">You have no appointments scheduled for today</p>
          </div>
        )}
      </motion.div>
      
      {/* Pending appointment requests */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Pending Appointment Requests</h3>
          <Link to="/doctor/appointments" className="text-primary-500 flex items-center hover:text-primary-600 text-sm font-medium">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div key={request.id} className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-secondary-100 text-secondary-800 flex items-center justify-center mr-3 font-medium">
                    {request.patientName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium">{request.patientName}</h4>
                    <p className="text-sm text-neutral-500">{request.reason}</p>
                  </div>
                </div>
                <span className="text-xs text-neutral-500">Requested on {formatDate(request.requestDate)}</span>
              </div>
              
              <div className="flex items-center text-sm text-neutral-600 mb-3">
                <Clock size={16} className="mr-1" />
                <span>Preferred date: {formatDate(request.preferredDate)}</span>
              </div>
              
              <div className="flex space-x-2">
                <button className="btn-primary py-1.5 px-3 text-sm">Accept</button>
                <button className="btn-ghost py-1.5 px-3 text-sm">Decline</button>
                <button className="btn-outline py-1.5 px-3 text-sm">Suggest Time</button>
              </div>
            </div>
          ))}
        </div>
        
        {pendingRequests.length === 0 && (
          <div className="text-center py-8">
            <ClipboardList className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">You have no pending appointment requests</p>
          </div>
        )}
      </motion.div>
      
      {/* Quick stats */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        <div className="flex items-center mb-6">
          <BarChart size={20} className="text-primary-500 mr-2" />
          <h3 className="text-lg font-semibold">Activity Overview</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-neutral-200 rounded-lg p-4">
            <h4 className="text-neutral-500 text-sm mb-1">Appointments This Week</h4>
            <p className="text-2xl font-bold">12</p>
            <div className="mt-2 text-xs text-success-600 flex items-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>20% increase</span>
            </div>
          </div>
          
          <div className="border border-neutral-200 rounded-lg p-4">
            <h4 className="text-neutral-500 text-sm mb-1">Completed Appointments</h4>
            <p className="text-2xl font-bold">24</p>
            <div className="mt-2 text-xs text-neutral-500 flex items-center">
              <span>This month</span>
            </div>
          </div>
          
          <div className="border border-neutral-200 rounded-lg p-4">
            <h4 className="text-neutral-500 text-sm mb-1">New Patients</h4>
            <p className="text-2xl font-bold">8</p>
            <div className="mt-2 text-xs text-success-600 flex items-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>15% increase</span>
            </div>
          </div>
        </div>
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

export default DoctorDashboard;
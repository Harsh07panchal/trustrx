import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import AlgorandWalletSetup from './pages/AlgorandWalletSetup';

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard';
import MedicalRecords from './pages/patient/MedicalRecords';
import DoctorSearch from './pages/patient/DoctorSearch';
import PatientAppointments from './pages/patient/Appointments';
import PatientSubscription from './pages/patient/Subscription';
import PatientProfile from './pages/patient/Profile';

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorAppointments from './pages/doctor/Appointments';
import DoctorProfile from './pages/doctor/Profile';
import DoctorSubscription from './pages/doctor/Subscription';

// Components
import Loading from './components/ui/Loading';
import CustomerSupport from './components/CustomerSupport';

// Route protection component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: 'patient' | 'doctor' | undefined;
}> = ({ children, requiredRole }) => {
  const { currentUser, userProfile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Navigate to="/login\" state={{ from: location }} replace />;
  }

  if (requiredRole && userProfile?.role !== requiredRole) {
    return <Navigate to="/dashboard\" replace />;
  }

  return <>{children}</>;
};

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: 100,
    scale: 0.95
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: -100,
    scale: 1.05
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

function App() {
  const { userProfile, isLoading } = useAuth();
  const [pageLoaded, setPageLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Set page as loaded after a short delay for initial animations
    const timer = setTimeout(() => setPageLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading && !pageLoaded) {
    return <Loading />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="min-h-screen"
        >
          <Routes location={location}>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/wallet-setup" element={<AlgorandWalletSetup />} />
            
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            
            {/* Dashboard Routes - These will redirect based on user role */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {userProfile?.role === 'patient' ? (
                    <Navigate to="/patient/dashboard\" replace />
                  ) : userProfile?.role === 'doctor' ? (
                    <Navigate to="/doctor/dashboard" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )}
                </ProtectedRoute>
              }
            />
            
            {/* Patient Routes */}
            <Route path="/patient" element={
              <ProtectedRoute requiredRole="patient">
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="records" element={<MedicalRecords />} />
              <Route path="doctors" element={<DoctorSearch />} />
              <Route path="appointments" element={<PatientAppointments />} />
              <Route path="subscription" element={<PatientSubscription />} />
              <Route path="profile" element={<PatientProfile />} />
            </Route>
            
            {/* Doctor Routes */}
            <Route path="/doctor" element={
              <ProtectedRoute requiredRole="doctor">
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="profile" element={<DoctorProfile />} />
              <Route path="subscription" element={<DoctorSubscription />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {/* Customer Support Widget */}
      <CustomerSupport />
    </>
  );
}

export default App;
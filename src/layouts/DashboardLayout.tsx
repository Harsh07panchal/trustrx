import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  FileLock, 
  FileText, 
  User, 
  CalendarClock, 
  CreditCard, 
  LogOut, 
  Menu, 
  X, 
  Home,
  Bell,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

const DashboardLayout = () => {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');

  // Update page title based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard')) setPageTitle('Dashboard');
    else if (path.includes('/records')) setPageTitle('Medical Records');
    else if (path.includes('/doctors')) setPageTitle('Find Doctors');
    else if (path.includes('/appointments')) setPageTitle('Appointments');
    else if (path.includes('/subscription')) setPageTitle('Subscription');
    else if (path.includes('/profile')) setPageTitle('Profile');
  }, [location]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-64 bg-white border-r border-neutral-200 flex-col h-screen sticky top-0">
        <div className="p-6">
          <div className="flex items-center mb-8 cursor-pointer" onClick={() => navigate('/')}>
            <FileLock className="h-6 w-6 text-primary-500 mr-2" />
            <span className="text-xl font-bold">TrustRx</span>
          </div>
          
          <nav className="space-y-1">
            {userProfile?.role === 'patient' ? (
              <>
                <NavItem to="/patient/dashboard\" icon={<Home size={20} />} label="Dashboard" />
                <NavItem to="/patient/records" icon={<FileText size={20} />} label="Medical Records" />
                <NavItem to="/patient/doctors" icon={<User size={20} />} label="Find Doctors" />
                <NavItem to="/patient/appointments" icon={<CalendarClock size={20} />} label="Appointments" />
                <NavItem to="/patient/subscription" icon={<CreditCard size={20} />} label="Subscription" />
              </>
            ) : (
              <>
                <NavItem to="/doctor/dashboard" icon={<Home size={20} />} label="Dashboard" />
                <NavItem to="/doctor/appointments" icon={<CalendarClock size={20} />} label="Appointments" />
                <NavItem to="/doctor/subscription" icon={<CreditCard size={20} />} label="Subscription" />
              </>
            )}
          </nav>
        </div>
        
        <div className="mt-auto border-t border-neutral-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-secondary-100 text-secondary-800 flex items-center justify-center font-medium text-sm">
                {userProfile?.displayName?.charAt(0) || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{userProfile?.displayName}</p>
                <p className="text-xs text-neutral-500 capitalize">{userProfile?.role}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate(userProfile?.role === 'patient' ? '/patient/profile' : '/doctor/profile')}
              className="flex items-center justify-center w-1/2 px-3 py-2 text-sm text-neutral-600 rounded-md hover:bg-neutral-100"
            >
              <Settings size={16} className="mr-2" />
              Profile
            </button>
            <button 
              onClick={handleSignOut}
              className="flex items-center justify-center w-1/2 px-3 py-2 text-sm text-neutral-600 rounded-md hover:bg-neutral-100"
            >
              <LogOut size={16} className="mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="fixed inset-0 bg-neutral-900 bg-opacity-50" onClick={closeMobileMenu}></div>
            <motion.div 
              className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white shadow-xl z-10 flex flex-col"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                    <FileLock className="h-6 w-6 text-primary-500 mr-2" />
                    <span className="text-xl font-bold">TrustRx</span>
                  </div>
                  <button onClick={closeMobileMenu}>
                    <X size={24} className="text-neutral-500" />
                  </button>
                </div>
                
                <nav className="space-y-1">
                  {userProfile?.role === 'patient' ? (
                    <>
                      <NavItem 
                        to="/patient/dashboard" 
                        icon={<Home size={20} />} 
                        label="Dashboard" 
                        onClick={closeMobileMenu} 
                      />
                      <NavItem 
                        to="/patient/records" 
                        icon={<FileText size={20} />} 
                        label="Medical Records" 
                        onClick={closeMobileMenu} 
                      />
                      <NavItem 
                        to="/patient/doctors" 
                        icon={<User size={20} />} 
                        label="Find Doctors" 
                        onClick={closeMobileMenu} 
                      />
                      <NavItem 
                        to="/patient/appointments" 
                        icon={<CalendarClock size={20} />} 
                        label="Appointments" 
                        onClick={closeMobileMenu} 
                      />
                      <NavItem 
                        to="/patient/subscription" 
                        icon={<CreditCard size={20} />} 
                        label="Subscription" 
                        onClick={closeMobileMenu} 
                      />
                    </>
                  ) : (
                    <>
                      <NavItem 
                        to="/doctor/dashboard" 
                        icon={<Home size={20} />} 
                        label="Dashboard" 
                        onClick={closeMobileMenu} 
                      />
                      <NavItem 
                        to="/doctor/appointments" 
                        icon={<CalendarClock size={20} />} 
                        label="Appointments" 
                        onClick={closeMobileMenu} 
                      />
                      <NavItem 
                        to="/doctor/subscription" 
                        icon={<CreditCard size={20} />} 
                        label="Subscription" 
                        onClick={closeMobileMenu} 
                      />
                    </>
                  )}
                </nav>
              </div>
              
              <div className="mt-auto border-t border-neutral-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-secondary-100 text-secondary-800 flex items-center justify-center font-medium text-sm">
                      {userProfile?.displayName?.charAt(0) || 'U'}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{userProfile?.displayName}</p>
                      <p className="text-xs text-neutral-500 capitalize">{userProfile?.role}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => {
                      navigate(userProfile?.role === 'patient' ? '/patient/profile' : '/doctor/profile');
                      closeMobileMenu();
                    }}
                    className="flex items-center justify-center w-1/2 px-3 py-2 text-sm text-neutral-600 rounded-md hover:bg-neutral-100"
                  >
                    <Settings size={16} className="mr-2" />
                    Profile
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center justify-center w-1/2 px-3 py-2 text-sm text-neutral-600 rounded-md hover:bg-neutral-100"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <button 
                className="md:hidden mr-4 text-neutral-500"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold">{pageTitle}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-neutral-500 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary-500 rounded-full text-white text-xs flex items-center justify-center">
                  2
                </span>
              </button>
              <div className="h-9 w-9 rounded-full bg-secondary-100 text-secondary-800 flex items-center justify-center font-medium text-sm md:hidden">
                {userProfile?.displayName?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>
        
        {/* Content area */}
        <div className="p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);
  
  return (
    <NavLink 
      to={to} 
      className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
        isActive 
          ? 'bg-primary-50 text-primary-700' 
          : 'text-neutral-700 hover:bg-neutral-100'
      }`}
      onClick={onClick}
    >
      <span className={`mr-3 ${isActive ? 'text-primary-500' : 'text-neutral-500'}`}>
        {icon}
      </span>
      {label}
    </NavLink>
  );
};

export default DashboardLayout;
import { useState } from 'react';
import { CalendarClock, ChevronLeft, ChevronRight, Clock, Calendar, CheckCircle, XCircle, CircleSlash, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for appointments
const appointmentsData = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Smith',
    patientAge: 42,
    patientGender: 'Male',
    status: 'confirmed',
    dateTime: '2023-07-25T09:30:00',
    duration: 30,
    reason: 'Annual check-up',
    notes: 'Patient has a history of high blood pressure.',
    createdAt: '2023-07-10T14:23:00',
    updatedAt: '2023-07-10T14:23:00'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Emily Johnson',
    patientAge: 35,
    patientGender: 'Female',
    status: 'confirmed',
    dateTime: '2023-07-25T11:00:00',
    duration: 45,
    reason: 'Follow-up appointment',
    notes: 'Follow-up after blood test results.',
    createdAt: '2023-07-12T10:15:00',
    updatedAt: '2023-07-12T10:15:00'
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Michael Brown',
    patientAge: 28,
    patientGender: 'Male',
    status: 'confirmed',
    dateTime: '2023-07-25T14:15:00',
    duration: 30,
    reason: 'Consultation',
    notes: '',
    createdAt: '2023-07-15T09:30:00',
    updatedAt: '2023-07-15T09:30:00'
  },
  {
    id: '4',
    patientId: '4',
    patientName: 'Sarah Williams',
    patientAge: 52,
    patientGender: 'Female',
    status: 'requested',
    dateTime: '2023-07-28T10:00:00',
    duration: 30,
    reason: 'New patient consultation',
    notes: 'Patient is new to the practice.',
    createdAt: '2023-07-18T11:45:00',
    updatedAt: '2023-07-18T11:45:00'
  },
  {
    id: '5',
    patientId: '5',
    patientName: 'David Lee',
    patientAge: 33,
    patientGender: 'Male',
    status: 'requested',
    dateTime: '2023-07-29T13:30:00',
    duration: 30,
    reason: 'Skin condition',
    notes: '',
    createdAt: '2023-07-17T16:20:00',
    updatedAt: '2023-07-17T16:20:00'
  },
  {
    id: '6',
    patientId: '6',
    patientName: 'Lisa Martinez',
    patientAge: 45,
    patientGender: 'Female',
    status: 'completed',
    dateTime: '2023-07-20T09:00:00',
    duration: 30,
    reason: 'Regular check-up',
    notes: 'Patient reported occasional headaches.',
    createdAt: '2023-07-05T10:00:00',
    updatedAt: '2023-07-20T09:45:00'
  },
  {
    id: '7',
    patientId: '7',
    patientName: 'Robert Wilson',
    patientAge: 61,
    patientGender: 'Male',
    status: 'cancelled',
    dateTime: '2023-07-22T15:30:00',
    duration: 30,
    reason: 'Follow-up appointment',
    notes: 'Patient cancelled due to schedule conflict.',
    createdAt: '2023-07-10T14:00:00',
    updatedAt: '2023-07-21T09:30:00'
  }
];

const DoctorAppointments = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointmentsData[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get appointments for the selected date
  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    
    return appointmentsData.filter(appointment => {
      const appointmentDate = new Date(appointment.dateTime).toISOString().split('T')[0];
      
      const matchesDate = appointmentDate === dateString;
      const matchesStatus = selectedStatus ? appointment.status === selectedStatus : true;
      
      return matchesDate && matchesStatus;
    }).sort((a, b) => {
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });
  };
  
  // Get all appointments based on filters
  const getAllAppointments = () => {
    return appointmentsData.filter(appointment => {
      const matchesStatus = selectedStatus ? appointment.status === selectedStatus : true;
      
      return matchesStatus;
    }).sort((a, b) => {
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });
  };
  
  // Get appointments based on active tab
  const getFilteredAppointments = () => {
    if (activeTab === 'calendar') {
      return getAppointmentsForDate(selectedDate);
    } else {
      return getAllAppointments();
    }
  };
  
  // Get the list of dates with appointments
  const getDatesWithAppointments = () => {
    const dates = new Set();
    
    appointmentsData.forEach(appointment => {
      const date = new Date(appointment.dateTime).toISOString().split('T')[0];
      dates.add(date);
    });
    
    return Array.from(dates) as string[];
  };
  
  // Change the selected date
  const changeDate = (amount: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + amount);
    setSelectedDate(newDate);
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };
  
  // Open appointment details
  const openAppointmentDetails = (appointment: typeof appointmentsData[0]) => {
    setSelectedAppointment(appointment);
  };
  
  // Close appointment details
  const closeAppointmentDetails = () => {
    setSelectedAppointment(null);
  };
  
  // Get the filtered appointments
  const filteredAppointments = getFilteredAppointments();
  
  // Get dates with appointments
  const datesWithAppointments = getDatesWithAppointments();
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">Appointments</h2>
          
          <div className="flex items-center space-x-2">
            <button 
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                activeTab === 'calendar'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              onClick={() => setActiveTab('calendar')}
            >
              <Calendar size={16} className="inline mr-1" />
              Calendar
            </button>
            <button 
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                activeTab === 'list'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              onClick={() => setActiveTab('list')}
            >
              <CalendarClock size={16} className="inline mr-1" />
              List
            </button>
            <button 
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} className="inline mr-1" />
              Filter
            </button>
          </div>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 p-4 border border-neutral-200 rounded-lg bg-neutral-50"
          >
            <h3 className="font-medium mb-3">Filter Appointments</h3>
            
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  selectedStatus === null
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-white text-neutral-700 border border-neutral-200'
                }`}
                onClick={() => setSelectedStatus(null)}
              >
                All
              </button>
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  selectedStatus === 'confirmed'
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-white text-neutral-700 border border-neutral-200'
                }`}
                onClick={() => setSelectedStatus('confirmed')}
              >
                Confirmed
              </button>
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  selectedStatus === 'requested'
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-white text-neutral-700 border border-neutral-200'
                }`}
                onClick={() => setSelectedStatus('requested')}
              >
                Requested
              </button>
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  selectedStatus === 'completed'
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-white text-neutral-700 border border-neutral-200'
                }`}
                onClick={() => setSelectedStatus('completed')}
              >
                Completed
              </button>
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  selectedStatus === 'cancelled'
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-white text-neutral-700 border border-neutral-200'
                }`}
                onClick={() => setSelectedStatus('cancelled')}
              >
                Cancelled
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Calendar view header */}
        {activeTab === 'calendar' && (
          <div className="flex items-center justify-between mb-6">
            <button 
              className="p-1 rounded-full hover:bg-neutral-100"
              onClick={() => changeDate(-1)}
            >
              <ChevronLeft size={20} />
            </button>
            
            <h3 className="text-lg font-medium">{formatDate(selectedDate)}</h3>
            
            <button 
              className="p-1 rounded-full hover:bg-neutral-100"
              onClick={() => changeDate(1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
        
        {/* Appointments list */}
        {filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                onClick={() => openAppointmentDetails(appointment)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarClock className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-700 mb-2">No appointments found</h3>
            <p className="text-neutral-500 mb-6">
              {activeTab === 'calendar'
                ? `You don't have any appointments on ${formatDate(selectedDate)}.`
                : "No appointments match the selected filters."}
            </p>
            {activeTab === 'calendar' && (
              <div className="flex justify-center space-x-4">
                <button 
                  className="btn-outline"
                  onClick={() => changeDate(-1)}
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Previous Day
                </button>
                <button 
                  className="btn-outline"
                  onClick={() => changeDate(1)}
                >
                  Next Day
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Mini calendar (shown only in calendar view) */}
        {activeTab === 'calendar' && (
          <div className="mt-8 border-t border-neutral-200 pt-6">
            <h3 className="font-medium mb-3">Upcoming Appointments</h3>
            
            <div className="flex flex-wrap gap-2">
              {datesWithAppointments.map((dateString) => {
                const date = new Date(dateString);
                const isSelected = 
                  date.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];
                
                return (
                  <button
                    key={dateString}
                    className={`px-3 py-1.5 rounded-md text-sm ${
                      isSelected
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Appointment details modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Appointment Details</h3>
                <AppointmentStatusBadge status={selectedAppointment.status} />
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <div className="h-10 w-10 rounded-full bg-secondary-100 text-secondary-800 flex items-center justify-center mr-3 font-medium">
                    {selectedAppointment.patientName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium">{selectedAppointment.patientName}</h4>
                    <p className="text-sm text-neutral-500">
                      {selectedAppointment.patientAge} years • {selectedAppointment.patientGender}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-neutral-50 rounded-lg p-4 flex items-center">
                  <CalendarClock size={20} className="text-primary-500 mr-3" />
                  <div>
                    <p className="font-medium">{formatDate(new Date(selectedAppointment.dateTime))}</p>
                    <p className="text-neutral-500 text-sm">
                      {formatTime(selectedAppointment.dateTime)} • {selectedAppointment.duration} minutes
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Reason for Visit</h4>
                  <p className="text-neutral-600">{selectedAppointment.reason}</p>
                </div>
                
                {selectedAppointment.notes && (
                  <div>
                    <h4 className="font-medium mb-1">Notes</h4>
                    <p className="text-neutral-600">{selectedAppointment.notes}</p>
                  </div>
                )}
                
                {selectedAppointment.status === 'requested' && (
                  <div className="pt-2">
                    <h4 className="font-medium mb-2">Appointment Request</h4>
                    <div className="space-y-2">
                      <button className="btn-primary w-full">Accept Request</button>
                      <button className="btn-outline w-full">Suggest Different Time</button>
                      <button className="btn-ghost w-full text-error-600">Decline Request</button>
                    </div>
                  </div>
                )}
                
                {selectedAppointment.status === 'confirmed' && (
                  <div className="pt-2">
                    <h4 className="font-medium mb-2">Appointment Actions</h4>
                    <div className="space-y-2">
                      <button className="btn-primary w-full">Mark as Completed</button>
                      <button className="btn-outline w-full">Reschedule</button>
                      <button className="btn-ghost w-full text-error-600">Cancel Appointment</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-t border-neutral-200 p-4 flex justify-end">
              <button 
                className="btn-ghost"
                onClick={closeAppointmentDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Appointment card component
interface AppointmentCardProps {
  appointment: typeof appointmentsData[0];
  onClick: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onClick }) => {
  const appointmentDate = new Date(appointment.dateTime);
  
  // Format time
  const time = appointmentDate.toLocaleString('default', { hour: 'numeric', minute: '2-digit', hour12: true });
  
  return (
    <motion.div 
      className="border border-neutral-200 rounded-lg overflow-hidden hover:border-primary-200 transition-all cursor-pointer"
      whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
      onClick={onClick}
    >
      <div className="flex">
        {/* Time column */}
        <div className="flex-shrink-0 w-20 bg-neutral-50 flex flex-col items-center justify-center py-4 border-r border-neutral-200">
          <span className="text-2xl font-bold">{time}</span>
          <span className="text-neutral-500 text-sm">{appointment.duration} min</span>
        </div>
        
        {/* Content column */}
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-secondary-100 text-secondary-800 flex items-center justify-center mr-3 font-medium">
                {appointment.patientName.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium">{appointment.patientName}</h3>
                <p className="text-sm text-neutral-500">
                  {appointment.patientAge} years • {appointment.patientGender}
                </p>
              </div>
            </div>
            <AppointmentStatusBadge status={appointment.status} />
          </div>
          
          <p className="text-neutral-600 ml-13">{appointment.reason}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Appointment status badge component
interface AppointmentStatusBadgeProps {
  status: string;
}

const AppointmentStatusBadge: React.FC<AppointmentStatusBadgeProps> = ({ status }) => {
  let bgColor = '';
  let textColor = '';
  let icon = null;
  let label = '';
  
  switch (status) {
    case 'confirmed':
      bgColor = 'bg-success-100';
      textColor = 'text-success-700';
      icon = <CheckCircle size={14} className="mr-1" />;
      label = 'Confirmed';
      break;
    case 'requested':
      bgColor = 'bg-amber-100';
      textColor = 'text-amber-700';
      icon = <Clock size={14} className="mr-1" />;
      label = 'Requested';
      break;
    case 'completed':
      bgColor = 'bg-neutral-100';
      textColor = 'text-neutral-700';
      icon = <CheckCircle size={14} className="mr-1" />;
      label = 'Completed';
      break;
    case 'cancelled':
      bgColor = 'bg-error-100';
      textColor = 'text-error-700';
      icon = <XCircle size={14} className="mr-1" />;
      label = 'Cancelled';
      break;
    default:
      bgColor = 'bg-neutral-100';
      textColor = 'text-neutral-600';
      icon = <CircleSlash size={14} className="mr-1" />;
      label = 'Unknown';
  }
  
  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {label}
    </div>
  );
};

export default DoctorAppointments;
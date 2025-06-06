import { useState } from 'react';
import { CalendarClock, ChevronLeft, ChevronRight, Clock, MapPin, CheckCircle, XCircle, CircleSlash } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for appointments
const appointmentsData = [
  {
    id: '1',
    doctorId: '1',
    doctorName: 'Dr. Sarah Johnson',
    doctorSpecialty: 'General Practitioner',
    doctorPhotoUrl: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150',
    location: {
      address: '123 Medical Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
    status: 'confirmed',
    dateTime: '2023-07-25T09:30:00',
    duration: 30,
    reason: 'Annual check-up',
    notes: 'Please bring your insurance card and a list of current medications.',
    createdAt: '2023-07-10T14:23:00',
    updatedAt: '2023-07-10T14:23:00'
  },
  {
    id: '2',
    doctorId: '2',
    doctorName: 'Dr. Michael Chen',
    doctorSpecialty: 'Cardiologist',
    doctorPhotoUrl: 'https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=compress&cs=tinysrgb&w=150',
    location: {
      address: '456 Heart Blvd',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
    },
    status: 'requested',
    dateTime: '2023-08-15T14:00:00',
    duration: 45,
    reason: 'Follow-up after test results',
    notes: '',
    createdAt: '2023-07-18T10:05:00',
    updatedAt: '2023-07-18T10:05:00'
  },
  {
    id: '3',
    doctorId: '3',
    doctorName: 'Dr. Emily Rodriguez',
    doctorSpecialty: 'Dermatologist',
    doctorPhotoUrl: 'https://images.pexels.com/photos/5214961/pexels-photo-5214961.jpeg?auto=compress&cs=tinysrgb&w=150',
    location: {
      address: '789 Skin Lane',
      city: 'Boston',
      state: 'MA',
      zipCode: '02115',
    },
    status: 'completed',
    dateTime: '2023-06-10T11:15:00',
    duration: 30,
    reason: 'Skin condition examination',
    notes: 'Follow-up appointment scheduled in 3 months.',
    createdAt: '2023-05-28T16:42:00',
    updatedAt: '2023-06-10T12:30:00'
  },
  {
    id: '4',
    doctorId: '5',
    doctorName: 'Dr. Jessica Taylor',
    doctorSpecialty: 'Pediatrician',
    doctorPhotoUrl: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150',
    location: {
      address: '222 Children\'s Way',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
    },
    status: 'cancelled',
    dateTime: '2023-07-05T10:00:00',
    duration: 30,
    reason: 'Vaccination appointment',
    notes: 'Cancelled due to illness. Please reschedule.',
    createdAt: '2023-06-20T09:15:00',
    updatedAt: '2023-07-03T14:30:00'
  }
];

const PatientAppointments = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointmentsData[0] | null>(null);
  
  // Filter appointments based on active tab
  const filteredAppointments = appointmentsData.filter(appointment => {
    const appointmentDate = new Date(appointment.dateTime);
    const now = new Date();
    
    if (activeTab === 'upcoming') {
      return (appointmentDate > now || appointment.status === 'requested') && 
             appointment.status !== 'completed' && 
             appointment.status !== 'cancelled';
    } else {
      return appointmentDate < now || 
             appointment.status === 'completed' || 
             appointment.status === 'cancelled';
    }
  });
  
  // Open appointment details
  const openAppointmentDetails = (appointment: typeof appointmentsData[0]) => {
    setSelectedAppointment(appointment);
  };
  
  // Close appointment details
  const closeAppointmentDetails = () => {
    setSelectedAppointment(null);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        <h2 className="text-2xl font-bold mb-6">My Appointments</h2>
        
        {/* Tabs */}
        <div className="border-b border-neutral-200 mb-6">
          <div className="flex space-x-8">
            <button
              className={`tab ${activeTab === 'upcoming' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`tab ${activeTab === 'past' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('past')}
            >
              Past
            </button>
          </div>
        </div>
        
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
              {activeTab === 'upcoming'
                ? "You don't have any upcoming appointments scheduled."
                : "You don't have any past appointments."}
            </p>
            {activeTab === 'upcoming' && (
              <button className="btn-primary inline-flex items-center">
                Find a Doctor
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Appointment details modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <img 
                    src={selectedAppointment.doctorPhotoUrl} 
                    alt={selectedAppointment.doctorName} 
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{selectedAppointment.doctorName}</h3>
                      <p className="text-neutral-600">{selectedAppointment.doctorSpecialty}</p>
                    </div>
                    <AppointmentStatusBadge status={selectedAppointment.status} />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="bg-neutral-50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarClock size={20} className="text-primary-500 mr-2" />
                    <div>
                      <p className="font-medium">{formatDate(selectedAppointment.dateTime)}</p>
                      <p className="text-neutral-500 text-sm">
                        {formatTime(selectedAppointment.dateTime)} • {selectedAppointment.duration} minutes
                      </p>
                    </div>
                  </div>
                  {activeTab === 'upcoming' && selectedAppointment.status !== 'cancelled' && (
                    <button className="text-neutral-500 hover:text-neutral-700 text-sm underline">
                      Reschedule
                    </button>
                  )}
                </div>
                
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <MapPin size={20} className="text-primary-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Office Location</p>
                      <address className="not-italic text-neutral-600 text-sm">
                        {selectedAppointment.location.address}<br />
                        {selectedAppointment.location.city}, {selectedAppointment.location.state} {selectedAppointment.location.zipCode}
                      </address>
                    </div>
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
              </div>
            </div>
            
            <div className="border-t border-neutral-200 p-4 flex justify-between items-center">
              <button 
                className="btn-ghost"
                onClick={closeAppointmentDetails}
              >
                Close
              </button>
              
              {activeTab === 'upcoming' && selectedAppointment.status !== 'cancelled' && (
                <button 
                  className="btn text-error-600 hover:bg-error-50 border border-error-300"
                >
                  Cancel Appointment
                </button>
              )}
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
  
  // Format date components
  const month = appointmentDate.toLocaleString('default', { month: 'short' });
  const day = appointmentDate.getDate();
  const time = appointmentDate.toLocaleString('default', { hour: 'numeric', minute: '2-digit', hour12: true });
  
  return (
    <motion.div 
      className="border border-neutral-200 rounded-lg overflow-hidden hover:border-primary-200 transition-all cursor-pointer"
      whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
      onClick={onClick}
    >
      <div className="flex">
        {/* Date column */}
        <div className="flex-shrink-0 w-20 bg-neutral-50 flex flex-col items-center justify-center py-4 border-r border-neutral-200">
          <span className="text-neutral-500 text-sm">{month}</span>
          <span className="text-2xl font-bold">{day}</span>
          <span className="text-neutral-500 text-sm">{time}</span>
        </div>
        
        {/* Content column */}
        <div className="flex-1 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <img 
                src={appointment.doctorPhotoUrl} 
                alt={appointment.doctorName} 
                className="h-12 w-12 rounded-md object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{appointment.doctorName}</h3>
                  <p className="text-neutral-600 text-sm">{appointment.doctorSpecialty}</p>
                </div>
                <AppointmentStatusBadge status={appointment.status} />
              </div>
              
              <div className="flex items-center mt-2 text-sm text-neutral-500">
                <Clock size={14} className="mr-1" />
                <span>{appointment.duration} minutes</span>
                <span className="mx-2">•</span>
                <MapPin size={14} className="mr-1" />
                <span>{appointment.location.city}, {appointment.location.state}</span>
              </div>
            </div>
          </div>
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

export default PatientAppointments;
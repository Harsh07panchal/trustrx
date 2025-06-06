import { useState } from 'react';
import { Search, MapPin, Star, Clock, FilterX, Filter, Check, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for doctors
const doctorsData = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'General Practitioner',
    location: {
      address: '123 Medical Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
    acceptingNewPatients: true,
    rating: 4.8,
    reviewCount: 124,
    languages: ['English', 'Spanish'],
    education: 'Harvard Medical School',
    yearsOfExperience: 12,
    isVerified: true,
    photoUrl: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Cardiologist',
    location: {
      address: '456 Heart Blvd',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
    },
    acceptingNewPatients: true,
    rating: 4.9,
    reviewCount: 89,
    languages: ['English', 'Mandarin'],
    education: 'Johns Hopkins University',
    yearsOfExperience: 15,
    isVerified: true,
    photoUrl: 'https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Dermatologist',
    location: {
      address: '789 Skin Lane',
      city: 'Boston',
      state: 'MA',
      zipCode: '02115',
    },
    acceptingNewPatients: false,
    rating: 4.7,
    reviewCount: 56,
    languages: ['English', 'Spanish'],
    education: 'Yale School of Medicine',
    yearsOfExperience: 8,
    isVerified: true,
    photoUrl: 'https://images.pexels.com/photos/5214961/pexels-photo-5214961.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '4',
    name: 'Dr. David Lee',
    specialty: 'Neurologist',
    location: {
      address: '101 Brain St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
    },
    acceptingNewPatients: true,
    rating: 4.6,
    reviewCount: 78,
    languages: ['English', 'Korean'],
    education: 'Stanford University',
    yearsOfExperience: 10,
    isVerified: false,
    photoUrl: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '5',
    name: 'Dr. Jessica Taylor',
    specialty: 'Pediatrician',
    location: {
      address: '222 Children\'s Way',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
    },
    acceptingNewPatients: true,
    rating: 4.9,
    reviewCount: 112,
    languages: ['English'],
    education: 'Northwestern University',
    yearsOfExperience: 7,
    isVerified: true,
    photoUrl: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

// Specialty options
const specialties = [
  'All Specialties',
  'General Practitioner',
  'Cardiologist',
  'Dermatologist',
  'Neurologist',
  'Pediatrician',
  'Orthopedist',
  'Gynecologist',
  'Psychiatrist',
  'Ophthalmologist',
  'Dentist'
];

// Location options
const locations = [
  'All Locations',
  'New York, NY',
  'Boston, MA',
  'San Francisco, CA',
  'Chicago, IL',
  'Los Angeles, CA',
  'Houston, TX',
  'Miami, FL',
  'Seattle, WA'
];

const DoctorSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [acceptingNewPatients, setAcceptingNewPatients] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctorsData[0] | null>(null);
  
  // Filter and sort doctors
  const filteredDoctors = doctorsData.filter(doctor => {
    // Filter by search term
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by specialty
    const matchesSpecialty = 
      selectedSpecialty === 'All Specialties' || doctor.specialty === selectedSpecialty;
    
    // Filter by location
    const doctorLocation = `${doctor.location.city}, ${doctor.location.state}`;
    const matchesLocation = 
      selectedLocation === 'All Locations' || doctorLocation === selectedLocation.split(',')[0].trim();
    
    // Filter by accepting new patients
    const matchesNewPatients = 
      !acceptingNewPatients || doctor.acceptingNewPatients;
    
    // Filter by verified status
    const matchesVerified = 
      !verifiedOnly || doctor.isVerified;
    
    return matchesSearch && matchesSpecialty && matchesLocation && matchesNewPatients && matchesVerified;
  }).sort((a, b) => {
    // Sort by selected criteria
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else {
      return b.yearsOfExperience - a.yearsOfExperience;
    }
  });
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('All Specialties');
    setSelectedLocation('All Locations');
    setAcceptingNewPatients(false);
    setVerifiedOnly(false);
    setSortBy('rating');
  };
  
  // Open doctor details modal
  const openDoctorDetails = (doctor: typeof doctorsData[0]) => {
    setSelectedDoctor(doctor);
  };
  
  // Close doctor details modal
  const closeDoctorDetails = () => {
    setSelectedDoctor(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        <h2 className="text-2xl font-bold mb-6">Find a Doctor</h2>
        
        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or specialty..."
            className="input pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filters section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button 
              className="flex items-center text-neutral-700 font-medium"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} className="mr-2" />
              Filters
              {showFilters ? (
                <svg width="20\" height="20\" viewBox="0 0 24 24\" className="ml-1\" fill="none\" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 15L12 9L6 15\" stroke="currentColor\" strokeWidth="2\" strokeLinecap="round\" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" className="ml-1" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
            
            {(selectedSpecialty !== 'All Specialties' || 
              selectedLocation !== 'All Locations' || 
              acceptingNewPatients || 
              verifiedOnly) && (
              <button 
                className="flex items-center text-neutral-600 text-sm hover:text-neutral-900"
                onClick={resetFilters}
              >
                <FilterX size={16} className="mr-1" />
                Reset Filters
              </button>
            )}
          </div>
          
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"
            >
              {/* Specialty filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Specialty
                </label>
                <select
                  className="input w-full"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Location filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Location
                </label>
                <select
                  className="input w-full"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Sort by filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Sort By
                </label>
                <div className="flex">
                  <button
                    className={`flex-1 py-2 px-3 text-sm border ${
                      sortBy === 'rating'
                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                        : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    } rounded-l-md`}
                    onClick={() => setSortBy('rating')}
                  >
                    Top Rated
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 text-sm border ${
                      sortBy === 'experience'
                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                        : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    } border-l-0 rounded-r-md`}
                    onClick={() => setSortBy('experience')}
                  >
                    Experience
                  </button>
                </div>
              </div>
              
              {/* Additional filters */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Additional Filters
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-500 rounded border-neutral-300 focus:ring-primary-500"
                      checked={acceptingNewPatients}
                      onChange={() => setAcceptingNewPatients(!acceptingNewPatients)}
                    />
                    <span className="ml-2 text-sm text-neutral-700">
                      Accepting new patients
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-500 rounded border-neutral-300 focus:ring-primary-500"
                      checked={verifiedOnly}
                      onChange={() => setVerifiedOnly(!verifiedOnly)}
                    />
                    <span className="ml-2 text-sm text-neutral-700">
                      Verified doctors only
                    </span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Active filters display */}
          <div className="flex flex-wrap gap-2">
            {selectedSpecialty !== 'All Specialties' && (
              <FilterBadge 
                label={selectedSpecialty} 
                onRemove={() => setSelectedSpecialty('All Specialties')} 
              />
            )}
            {selectedLocation !== 'All Locations' && (
              <FilterBadge 
                label={selectedLocation} 
                onRemove={() => setSelectedLocation('All Locations')} 
              />
            )}
            {acceptingNewPatients && (
              <FilterBadge 
                label="Accepting new patients" 
                onRemove={() => setAcceptingNewPatients(false)} 
              />
            )}
            {verifiedOnly && (
              <FilterBadge 
                label="Verified doctors only" 
                onRemove={() => setVerifiedOnly(false)} 
              />
            )}
          </div>
        </div>
        
        {/* Results count */}
        <div className="mb-4 text-neutral-600">
          Found {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}
        </div>
        
        {/* Doctors list */}
        {filteredDoctors.length > 0 ? (
          <div className="space-y-4">
            {filteredDoctors.map((doctor) => (
              <DoctorCard 
                key={doctor.id} 
                doctor={doctor} 
                onClick={() => openDoctorDetails(doctor)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="h-16 w-16 text-neutral-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-neutral-700 mb-2">No doctors found</h3>
            <p className="text-neutral-500 mb-6">
              Try adjusting your search filters to find more doctors.
            </p>
            <button 
              className="btn-primary inline-flex items-center"
              onClick={resetFilters}
            >
              <FilterX size={18} className="mr-2" />
              Reset Filters
            </button>
          </div>
        )}
      </div>
      
      {/* Doctor details modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <img 
                    src={selectedDoctor.photoUrl} 
                    alt={selectedDoctor.name} 
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-xl font-bold mb-1">{selectedDoctor.name}</h3>
                    {selectedDoctor.isVerified && (
                      <div className="verified-badge">
                        <Check size={14} className="mr-1" />
                        Verified
                      </div>
                    )}
                  </div>
                  <p className="text-neutral-700 mb-2">{selectedDoctor.specialty}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center text-amber-500 mr-2">
                      <Star size={16} className="fill-current" />
                      <span className="ml-1 text-neutral-700 font-medium">{selectedDoctor.rating}</span>
                    </div>
                    <span className="text-neutral-500 text-sm">({selectedDoctor.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center text-neutral-600">
                    <MapPin size={16} className="mr-1" />
                    <span>{selectedDoctor.location.city}, {selectedDoctor.location.state}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">About</h4>
                  <ul className="space-y-3">
                    <li className="flex">
                      <span className="text-neutral-500 w-36">Experience</span>
                      <span className="font-medium">{selectedDoctor.yearsOfExperience} years</span>
                    </li>
                    <li className="flex">
                      <span className="text-neutral-500 w-36">Education</span>
                      <span className="font-medium">{selectedDoctor.education}</span>
                    </li>
                    <li className="flex">
                      <span className="text-neutral-500 w-36">Languages</span>
                      <span className="font-medium">{selectedDoctor.languages.join(', ')}</span>
                    </li>
                    <li className="flex">
                      <span className="text-neutral-500 w-36">Accepting patients</span>
                      <span className={`font-medium ${selectedDoctor.acceptingNewPatients ? 'text-success-600' : 'text-error-600'}`}>
                        {selectedDoctor.acceptingNewPatients ? 'Yes' : 'No'}
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Address</h4>
                  <address className="not-italic mb-4">
                    {selectedDoctor.location.address}<br />
                    {selectedDoctor.location.city}, {selectedDoctor.location.state} {selectedDoctor.location.zipCode}
                  </address>
                  
                  <h4 className="font-semibold mb-2">Schedule</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Monday - Friday</span>
                      <span>9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Saturday</span>
                      <span>10:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Sunday</span>
                      <span className="text-neutral-500">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Biography</h4>
                <p className="text-neutral-600">
                  {selectedDoctor.name.split(' ')[1]} is a board-certified {selectedDoctor.specialty.toLowerCase()} with over {selectedDoctor.yearsOfExperience} years of experience. {selectedDoctor.name.split(' ')[0]} graduated from {selectedDoctor.education} and has been practicing medicine since {new Date().getFullYear() - selectedDoctor.yearsOfExperience}.
                </p>
              </div>
            </div>
            
            <div className="border-t border-neutral-200 p-4 flex justify-between items-center">
              <button 
                className="btn-ghost"
                onClick={closeDoctorDetails}
              >
                Close
              </button>
              <button 
                className="btn-primary"
                disabled={!selectedDoctor.acceptingNewPatients}
              >
                {selectedDoctor.acceptingNewPatients 
                  ? 'Request Appointment' 
                  : 'Not Accepting Patients'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Filter badge component
interface FilterBadgeProps {
  label: string;
  onRemove: () => void;
}

const FilterBadge: React.FC<FilterBadgeProps> = ({ label, onRemove }) => (
  <div className="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
    <span>{label}</span>
    <button className="ml-1 text-primary-500 hover:text-primary-700" onClick={onRemove}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  </div>
);

// Doctor card component
interface DoctorCardProps {
  doctor: typeof doctorsData[0];
  onClick: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onClick }) => (
  <div 
    className="border border-neutral-200 rounded-lg p-4 hover:border-primary-200 transition-all cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-start">
      <div className="flex-shrink-0 mr-4">
        <img 
          src={doctor.photoUrl} 
          alt={doctor.name} 
          className="h-16 w-16 rounded-lg object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">{doctor.name}</h3>
            <p className="text-neutral-600 text-sm">{doctor.specialty}</p>
          </div>
          {doctor.isVerified && (
            <div className="verified-badge">
              <Check size={12} className="mr-1" />
              Verified
            </div>
          )}
        </div>
        
        <div className="flex items-center mt-1 mb-2">
          <div className="flex items-center text-amber-500 mr-2">
            <Star size={14} className="fill-current" />
            <span className="ml-1 text-neutral-700 text-sm font-medium">{doctor.rating}</span>
          </div>
          <span className="text-neutral-500 text-xs">({doctor.reviewCount} reviews)</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <div className="flex items-center text-neutral-600">
            <MapPin size={14} className="mr-1" />
            <span>{doctor.location.city}, {doctor.location.state}</span>
          </div>
          
          <div className="flex items-center text-neutral-600">
            <Clock size={14} className="mr-1" />
            <span>{doctor.yearsOfExperience} years exp.</span>
          </div>
          
          <div className={`flex items-center ${doctor.acceptingNewPatients ? 'text-success-600' : 'text-neutral-500'}`}>
            {doctor.acceptingNewPatients ? (
              <>
                <Check size={14} className="mr-1" />
                <span>Accepting patients</span>
              </>
            ) : (
              <span>Not accepting patients</span>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DoctorSearch;
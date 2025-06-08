import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, FilterX, Filter, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../config/supabase';

const DoctorSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [acceptingNewPatients, setAcceptingNewPatients] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to NYC

  // Mock doctors data since Google Maps API might not be available
  const mockDoctors = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      photo_url: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150',
      is_verified: true,
      rating: 4.8,
      review_count: 124,
      accepting_new_patients: true,
      years_of_experience: 15,
      education: 'Harvard Medical School',
      languages: ['English', 'Spanish'],
      location: {
        address: '123 Medical Ave',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
        coordinates: { latitude: 40.7128, longitude: -74.0060 }
      },
      distance: 2.3
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Dermatologist',
      photo_url: 'https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=compress&cs=tinysrgb&w=150',
      is_verified: true,
      rating: 4.6,
      review_count: 89,
      accepting_new_patients: true,
      years_of_experience: 12,
      education: 'Johns Hopkins University',
      languages: ['English', 'Mandarin'],
      location: {
        address: '456 Health Blvd',
        city: 'New York',
        state: 'NY',
        zip_code: '10002',
        coordinates: { latitude: 40.7589, longitude: -73.9851 }
      },
      distance: 3.1
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'General Practitioner',
      photo_url: 'https://images.pexels.com/photos/5214961/pexels-photo-5214961.jpeg?auto=compress&cs=tinysrgb&w=150',
      is_verified: false,
      rating: 4.4,
      review_count: 67,
      accepting_new_patients: false,
      years_of_experience: 8,
      education: 'Columbia University',
      languages: ['English', 'Spanish'],
      location: {
        address: '789 Care St',
        city: 'New York',
        state: 'NY',
        zip_code: '10003',
        coordinates: { latitude: 40.7505, longitude: -73.9934 }
      },
      distance: 1.8
    }
  ];

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Filter and sort doctors
  useEffect(() => {
    let filteredDoctors = mockDoctors.filter(doctor => {
      const matchesSearch = 
        doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSpecialty = selectedSpecialty === 'All Specialties' || doctor.specialty === selectedSpecialty;
      const matchesVerified = !verifiedOnly || doctor.is_verified;
      const matchesAccepting = !acceptingNewPatients || doctor.accepting_new_patients;
      
      return matchesSearch && matchesSpecialty && matchesVerified && matchesAccepting;
    });

    // Sort doctors
    filteredDoctors = filteredDoctors.sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      } else {
        return (b.years_of_experience || 0) - (a.years_of_experience || 0);
      }
    });

    setDoctors(filteredDoctors);
  }, [searchTerm, selectedSpecialty, verifiedOnly, acceptingNewPatients, sortBy]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Search and Filters */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
          <h2 className="text-2xl font-bold mb-6">Find a Doctor</h2>
          
          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              className="input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filters */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Specialty
              </label>
              <select
                className="input w-full"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option>All Specialties</option>
                <option>Cardiologist</option>
                <option>Dermatologist</option>
                <option>General Practitioner</option>
                <option>Neurologist</option>
                <option>Pediatrician</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Sort By
              </label>
              <div className="flex rounded-md overflow-hidden border border-neutral-200">
                <button
                  className={`flex-1 px-4 py-2 ${
                    sortBy === 'rating'
                      ? 'bg-primary-50 text-primary-700'
                      : 'bg-white text-neutral-700'
                  }`}
                  onClick={() => setSortBy('rating')}
                >
                  Top Rated
                </button>
                <button
                  className={`flex-1 px-4 py-2 ${
                    sortBy === 'experience'
                      ? 'bg-primary-50 text-primary-700'
                      : 'bg-white text-neutral-700'
                  }`}
                  onClick={() => setSortBy('experience')}
                >
                  Experience
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary-600"
                  checked={acceptingNewPatients}
                  onChange={(e) => setAcceptingNewPatients(e.target.checked)}
                />
                <span className="ml-2 text-sm text-neutral-700">
                  Accepting new patients
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary-600"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                />
                <span className="ml-2 text-sm text-neutral-700">
                  Verified doctors only
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Doctor List */}
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <motion.div
              key={doctor.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200 cursor-pointer hover:border-primary-200 transition-all"
              onClick={() => setSelectedDoctor(doctor)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start gap-4">
                <img
                  src={doctor.photo_url}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-lg">{doctor.name}</h3>
                      <p className="text-neutral-600">{doctor.specialty}</p>
                    </div>
                    {doctor.is_verified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                        <Check size={12} className="mr-1" />
                        Verified
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <div className="flex items-center text-amber-500">
                      <Star size={16} className="fill-current" />
                      <span className="ml-1 text-neutral-700">{doctor.rating}</span>
                    </div>
                    <span className="text-neutral-500">
                      {doctor.review_count} reviews
                    </span>
                    <span className="text-neutral-500">
                      {doctor.distance} km away
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {doctor.accepting_new_patients ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                        Accepting Patients
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                        Not Accepting Patients
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                      {doctor.years_of_experience} years exp.
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Map View */}
      <div className="sticky top-0 h-screen">
        <div className="w-full h-full bg-neutral-100 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <MapPin size={48} className="text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600">Map view would be displayed here</p>
            <p className="text-sm text-neutral-500">Google Maps integration available with API key</p>
          </div>
        </div>
      </div>

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start gap-6">
                <img
                  src={selectedDoctor.photo_url}
                  alt={selectedDoctor.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedDoctor.name}</h2>
                      <p className="text-neutral-600">{selectedDoctor.specialty}</p>
                    </div>
                    {selectedDoctor.is_verified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                        <Check size={12} className="mr-1" />
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">About</h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-neutral-500">Experience:</span>{' '}
                          {selectedDoctor.years_of_experience} years
                        </p>
                        <p>
                          <span className="text-neutral-500">Education:</span>{' '}
                          {selectedDoctor.education}
                        </p>
                        <p>
                          <span className="text-neutral-500">Languages:</span>{' '}
                          {selectedDoctor.languages?.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Location</h3>
                      <div className="space-y-2 text-sm">
                        <p>{selectedDoctor.location?.address}</p>
                        <p>
                          {selectedDoctor.location?.city}, {selectedDoctor.location?.state}{' '}
                          {selectedDoctor.location?.zip_code}
                        </p>
                        <p className="text-neutral-500">
                          {selectedDoctor.distance} km away
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      className="btn-primary w-full"
                      disabled={!selectedDoctor.accepting_new_patients}
                    >
                      {selectedDoctor.accepting_new_patients
                        ? 'Book Appointment'
                        : 'Not Accepting Patients'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200 p-4 flex justify-end">
              <button
                className="btn-ghost"
                onClick={() => setSelectedDoctor(null)}
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

export default DoctorSearch;
import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, FilterX, Filter, Check, Navigation, Locate } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const DoctorSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [acceptingNewPatients, setAcceptingNewPatients] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'distance'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to NYC
  const [selectedMapDoctor, setSelectedMapDoctor] = useState(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Mock doctors data with more locations
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
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      specialty: 'Neurologist',
      photo_url: 'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&w=150',
      is_verified: true,
      rating: 4.9,
      review_count: 156,
      accepting_new_patients: true,
      years_of_experience: 20,
      education: 'Stanford Medical School',
      languages: ['English'],
      location: {
        address: '321 Brain Ave',
        city: 'Brooklyn',
        state: 'NY',
        zip_code: '11201',
        coordinates: { latitude: 40.6892, longitude: -73.9442 }
      },
      distance: 5.2
    },
    {
      id: '5',
      name: 'Dr. Lisa Park',
      specialty: 'Pediatrician',
      photo_url: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150',
      is_verified: true,
      rating: 4.7,
      review_count: 203,
      accepting_new_patients: true,
      years_of_experience: 14,
      education: 'Yale Medical School',
      languages: ['English', 'Korean'],
      location: {
        address: '654 Kids Blvd',
        city: 'Queens',
        state: 'NY',
        zip_code: '11375',
        coordinates: { latitude: 40.7282, longitude: -73.7949 }
      },
      distance: 8.7
    }
  ];

  // Get user's location
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setUserLocation(newLocation);
          setMapCenter(newLocation);
          
          // Update distances based on user location
          const updatedDoctors = mockDoctors.map(doctor => ({
            ...doctor,
            distance: calculateDistance(
              latitude, 
              longitude, 
              doctor.location.coordinates.latitude, 
              doctor.location.coordinates.longitude
            )
          }));
          setDoctors(updatedDoctors);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setDoctors(mockDoctors);
          setIsLoadingLocation(false);
        }
      );
    } else {
      setDoctors(mockDoctors);
      setIsLoadingLocation(false);
    }
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  };

  // Search by location
  const searchByLocation = async () => {
    if (!locationSearch.trim()) return;
    
    // In a real app, you would use Google Geocoding API
    // For demo, we'll simulate location search
    const mockLocations = {
      'manhattan': { lat: 40.7831, lng: -73.9712 },
      'brooklyn': { lat: 40.6782, lng: -73.9442 },
      'queens': { lat: 40.7282, lng: -73.7949 },
      'bronx': { lat: 40.8448, lng: -73.8648 },
      'new york': { lat: 40.7128, lng: -74.0060 },
      'nyc': { lat: 40.7128, lng: -74.0060 }
    };
    
    const searchKey = locationSearch.toLowerCase();
    const foundLocation = mockLocations[searchKey] || mockLocations['new york'];
    
    setMapCenter(foundLocation);
    setUserLocation(foundLocation);
    
    // Update distances
    const updatedDoctors = mockDoctors.map(doctor => ({
      ...doctor,
      distance: calculateDistance(
        foundLocation.lat, 
        foundLocation.lng, 
        doctor.location.coordinates.latitude, 
        doctor.location.coordinates.longitude
      )
    }));
    setDoctors(updatedDoctors);
  };

  useEffect(() => {
    setDoctors(mockDoctors);
  }, []);

  // Filter and sort doctors
  useEffect(() => {
    let filteredDoctors = (doctors.length > 0 ? doctors : mockDoctors).filter(doctor => {
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
      } else if (sortBy === 'experience') {
        return (b.years_of_experience || 0) - (a.years_of_experience || 0);
      } else if (sortBy === 'distance') {
        return (a.distance || 0) - (b.distance || 0);
      }
      return 0;
    });

    setDoctors(filteredDoctors);
  }, [searchTerm, selectedSpecialty, verifiedOnly, acceptingNewPatients, sortBy]);

  const mapContainerStyle = {
    width: '100%',
    height: '100%'
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
  };

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

          {/* Location search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Search by Location
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter city, neighborhood, or zip code..."
                className="input flex-1"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchByLocation()}
              />
              <button
                onClick={searchByLocation}
                className="btn-outline px-4"
                disabled={!locationSearch.trim()}
              >
                <Search size={16} />
              </button>
              <button
                onClick={getUserLocation}
                className="btn-outline px-4"
                disabled={isLoadingLocation}
                title="Use my current location"
              >
                {isLoadingLocation ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                ) : (
                  <Locate size={16} />
                )}
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Try: "Manhattan", "Brooklyn", "Queens", or your zip code
            </p>
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
              <div className="grid grid-cols-3 rounded-md overflow-hidden border border-neutral-200">
                <button
                  className={`px-4 py-2 text-sm ${
                    sortBy === 'rating'
                      ? 'bg-primary-50 text-primary-700'
                      : 'bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                  onClick={() => setSortBy('rating')}
                >
                  Top Rated
                </button>
                <button
                  className={`px-4 py-2 text-sm border-l border-r border-neutral-200 ${
                    sortBy === 'experience'
                      ? 'bg-primary-50 text-primary-700'
                      : 'bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                  onClick={() => setSortBy('experience')}
                >
                  Experience
                </button>
                <button
                  className={`px-4 py-2 text-sm ${
                    sortBy === 'distance'
                      ? 'bg-primary-50 text-primary-700'
                      : 'bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                  onClick={() => setSortBy('distance')}
                >
                  Distance
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
              whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
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
                    <div className="flex items-center text-neutral-500">
                      <Navigation size={14} className="mr-1" />
                      <span>{doctor.distance} km away</span>
                    </div>
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
        <div className="w-full h-full bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <LoadScript 
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}
            loadingElement={
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
                  <p className="text-neutral-600">Loading map...</p>
                </div>
              </div>
            }
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={12}
              options={mapOptions}
            >
              {/* User location marker */}
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="8" fill="#0CB8B6" stroke="white" stroke-width="2"/>
                        <circle cx="12" cy="12" r="3" fill="white"/>
                      </svg>
                    `),
                    scaledSize: window.google && window.google.maps && window.google.maps.Size 
                      ? new window.google.maps.Size(24, 24) 
                      : undefined,
                  }}
                  title="Your Location"
                />
              )}

              {/* Doctor markers */}
              {doctors.map((doctor) => (
                <Marker
                  key={doctor.id}
                  position={{
                    lat: doctor.location.coordinates.latitude,
                    lng: doctor.location.coordinates.longitude
                  }}
                  onClick={() => setSelectedMapDoctor(doctor)}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 2C11.6 2 8 5.6 8 10C8 16 16 30 16 30S24 16 24 10C24 5.6 20.4 2 16 2Z" fill="#FF6B6B" stroke="white" stroke-width="2"/>
                        <circle cx="16" cy="10" r="4" fill="white"/>
                        <path d="M14 8H18M16 6V14" stroke="#FF6B6B" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    `),
                    scaledSize: window.google && window.google.maps && window.google.maps.Size 
                      ? new window.google.maps.Size(32, 32) 
                      : undefined,
                  }}
                />
              ))}

              {/* Info window for selected doctor */}
              {selectedMapDoctor && (
                <InfoWindow
                  position={{
                    lat: selectedMapDoctor.location.coordinates.latitude,
                    lng: selectedMapDoctor.location.coordinates.longitude
                  }}
                  onCloseClick={() => setSelectedMapDoctor(null)}
                >
                  <div className="p-2 max-w-xs">
                    <div className="flex items-center mb-2">
                      <img
                        src={selectedMapDoctor.photo_url}
                        alt={selectedMapDoctor.name}
                        className="w-12 h-12 rounded-lg object-cover mr-3"
                      />
                      <div>
                        <h4 className="font-medium">{selectedMapDoctor.name}</h4>
                        <p className="text-sm text-neutral-600">{selectedMapDoctor.specialty}</p>
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center">
                        <Star size={14} className="text-amber-500 fill-current mr-1" />
                        <span>{selectedMapDoctor.rating} ({selectedMapDoctor.review_count} reviews)</span>
                      </div>
                      <div className="flex items-center">
                        <Navigation size={14} className="text-neutral-500 mr-1" />
                        <span>{selectedMapDoctor.distance} km away</span>
                      </div>
                      <p className="text-neutral-600">{selectedMapDoctor.location.address}</p>
                    </div>
                    <button
                      onClick={() => setSelectedDoctor(selectedMapDoctor)}
                      className="mt-2 w-full bg-primary-500 text-white px-3 py-1 rounded text-sm hover:bg-primary-600"
                    >
                      View Details
                    </button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
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
                        <div className="flex items-center">
                          <Star size={16} className="text-amber-500 fill-current mr-2" />
                          <span>{selectedDoctor.rating} ({selectedDoctor.review_count} reviews)</span>
                        </div>
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
                        <div className="flex items-center text-neutral-500">
                          <Navigation size={14} className="mr-1" />
                          <span>{selectedDoctor.distance} km away</span>
                        </div>
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
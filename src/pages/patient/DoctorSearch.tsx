{
  "id": "doctor-search-update",
  "content": `import { useState, useEffect } from 'react';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { Search, MapPin, Star, Clock, FilterX, Filter, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

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

  // Load Google Maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

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

  // Fetch doctors from Firestore
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsRef = collection(db, 'doctors');
        let q = query(doctorsRef);

        if (selectedSpecialty !== 'All Specialties') {
          q = query(q, where('specialty', '==', selectedSpecialty));
        }

        if (verifiedOnly) {
          q = query(q, where('isVerified', '==', true));
        }

        if (acceptingNewPatients) {
          q = query(q, where('acceptingNewPatients', '==', true));
        }

        const querySnapshot = await getDocs(q);
        const doctorsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Filter by search term
        const filteredDoctors = doctorsData.filter(doctor => {
          const matchesSearch = 
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
          
          return matchesSearch;
        });

        // Sort doctors
        const sortedDoctors = filteredDoctors.sort((a, b) => {
          if (sortBy === 'rating') {
            return b.rating - a.rating;
          } else {
            return b.yearsOfExperience - a.yearsOfExperience;
          }
        });

        setDoctors(sortedDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, [searchTerm, selectedSpecialty, verifiedOnly, acceptingNewPatients, sortBy]);

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d;
  };

  // Sort doctors by distance if user location is available
  const sortedDoctors = userLocation
    ? doctors.map(doctor => ({
        ...doctor,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          doctor.location.coordinates.latitude,
          doctor.location.coordinates.longitude
        )
      })).sort((a, b) => a.distance - b.distance)
    : doctors;

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
                {/* Add more specialties */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Sort By
              </label>
              <div className="flex rounded-md overflow-hidden border border-neutral-200">
                <button
                  className={\`flex-1 px-4 py-2 \${
                    sortBy === 'rating'
                      ? 'bg-primary-50 text-primary-700'
                      : 'bg-white text-neutral-700'
                  }\`}
                  onClick={() => setSortBy('rating')}
                >
                  Top Rated
                </button>
                <button
                  className={\`flex-1 px-4 py-2 \${
                    sortBy === 'experience'
                      ? 'bg-primary-50 text-primary-700'
                      : 'bg-white text-neutral-700'
                  }\`}
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
          {sortedDoctors.map((doctor) => (
            <motion.div
              key={doctor.id}
              className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200 cursor-pointer hover:border-primary-200 transition-all"
              onClick={() => setSelectedDoctor(doctor)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start gap-4">
                <img
                  src={doctor.photoURL}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-lg">{doctor.name}</h3>
                      <p className="text-neutral-600">{doctor.specialty}</p>
                    </div>
                    {doctor.isVerified && (
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
                      {doctor.reviewCount} reviews
                    </span>
                    {userLocation && (
                      <span className="text-neutral-500">
                        {doctor.distance.toFixed(1)} km away
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {doctor.acceptingNewPatients ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
                        Accepting Patients
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                        Not Accepting Patients
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                      {doctor.yearsOfExperience} years exp.
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
        {isLoaded ? (
          <GoogleMap
            mapContainerClassName="w-full h-full rounded-xl"
            center={mapCenter}
            zoom={12}
          >
            {sortedDoctors.map((doctor) => (
              <Marker
                key={doctor.id}
                position={{
                  lat: doctor.location.coordinates.latitude,
                  lng: doctor.location.coordinates.longitude
                }}
                onClick={() => setSelectedDoctor(doctor)}
              />
            ))}
          </GoogleMap>
        ) : (
          <div className="w-full h-full bg-neutral-100 rounded-xl flex items-center justify-center">
            Loading map...
          </div>
        )}
      </div>

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal content */}
            <div className="p-6">
              {/* Doctor details */}
              <div className="flex items-start gap-6">
                <img
                  src={selectedDoctor.photoURL}
                  alt={selectedDoctor.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedDoctor.name}</h2>
                      <p className="text-neutral-600">{selectedDoctor.specialty}</p>
                    </div>
                    {selectedDoctor.isVerified && (
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
                          {selectedDoctor.yearsOfExperience} years
                        </p>
                        <p>
                          <span className="text-neutral-500">Education:</span>{' '}
                          {selectedDoctor.education}
                        </p>
                        <p>
                          <span className="text-neutral-500">Languages:</span>{' '}
                          {selectedDoctor.languages.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Location</h3>
                      <div className="space-y-2 text-sm">
                        <p>{selectedDoctor.location.address}</p>
                        <p>
                          {selectedDoctor.location.city},{' '}
                          {selectedDoctor.location.state}{' '}
                          {selectedDoctor.location.zipCode}
                        </p>
                        {userLocation && (
                          <p className="text-neutral-500">
                            {selectedDoctor.distance.toFixed(1)} km away
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      className="btn-primary w-full"
                      disabled={!selectedDoctor.acceptingNewPatients}
                    >
                      {selectedDoctor.acceptingNewPatients
                        ? 'Book Appointment'
                        : 'Not Accepting Patients'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal actions */}
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

export default DoctorSearch;`
}
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Camera, Clock, MapPin, Award, Languages, Plus, Trash, Lock, Shield, Phone } from 'lucide-react';

const DoctorProfile = () => {
  const { userProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    specialty: '',
    qualifications: '',
    licenseNumber: '',
    hospitalAffiliation: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bio: '',
    languages: '',
    acceptingNewPatients: true
  });
  
  const [workingHours, setWorkingHours] = useState([
    { day: 'monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
    { day: 'tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
    { day: 'wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
    { day: 'thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
    { day: 'friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
    { day: 'saturday', startTime: '10:00', endTime: '14:00', isAvailable: false },
    { day: 'sunday', startTime: '10:00', endTime: '14:00', isAvailable: false }
  ]);
  
  // Initialize form data with user profile
  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        specialty: 'Cardiologist', // These would come from the doctor profile
        qualifications: 'MD, Johns Hopkins University',
        licenseNumber: 'MD12345',
        hospitalAffiliation: 'Memorial Hospital',
        address: '456 Heart Blvd',
        city: 'New York',
        state: 'NY',
        zipCode: '10002',
        bio: 'Experienced cardiologist with over 15 years of practice. Specializing in preventive cardiology and heart health management.',
        languages: 'English, Spanish',
        acceptingNewPatients: true
      });
    }
  }, [userProfile]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleWorkingHoursChange = (index: number, field: string, value: string | boolean) => {
    const newWorkingHours = [...workingHours];
    newWorkingHours[index] = { ...newWorkingHours[index], [field]: value };
    setWorkingHours(newWorkingHours);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would update the user profile in the database
    console.log('Updated profile:', { ...formData, workingHours });
    
    // Exit edit mode
    setIsEditing(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Profile</h2>
          {!isEditing && (
            <button 
              className="btn-outline"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
        
        {!isEditing ? (
          <div className="space-y-6">
            {/* Profile header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center text-3xl font-medium">
                  {userProfile?.displayName?.charAt(0) || 'D'}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-success-100 text-success-700 px-2 py-0.5 rounded-full text-xs font-medium border border-white">
                  Verified
                </div>
              </div>
              
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-semibold">{formData.displayName}</h3>
                <p className="text-neutral-700">{formData.specialty}</p>
                <p className="text-neutral-500">{userProfile?.email}</p>
                <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Doctor
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                    Free Plan
                  </span>
                  {formData.acceptingNewPatients && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      Accepting Patients
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Profile sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Professional Information */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <h4 className="font-semibold mb-4 flex items-center">
                  <User size={18} className="mr-2 text-primary-500" />
                  Professional Information
                </h4>
                
                <div className="space-y-3">
                  <ProfileItem label="Specialty" value={formData.specialty} />
                  <ProfileItem label="Qualifications" value={formData.qualifications} />
                  <ProfileItem label="License Number" value={formData.licenseNumber} />
                  <ProfileItem label="Hospital Affiliation" value={formData.hospitalAffiliation} />
                  <ProfileItem label="Languages" value={formData.languages} />
                </div>
              </div>
              
              {/* Location */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <h4 className="font-semibold mb-4 flex items-center">
                  <MapPin size={18} className="mr-2 text-primary-500" />
                  Location
                </h4>
                
                <div className="space-y-3">
                  <ProfileItem label="Address" value={formData.address} />
                  <ProfileItem label="City" value={formData.city} />
                  <ProfileItem label="State" value={formData.state} />
                  <ProfileItem label="Zip Code" value={formData.zipCode} />
                </div>
              </div>
            </div>
            
            {/* Working Hours */}
            <div className="border border-neutral-200 rounded-lg p-4">
              <h4 className="font-semibold mb-4 flex items-center">
                <Clock size={18} className="mr-2 text-primary-500" />
                Working Hours
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {workingHours.map((hours) => (
                  <div 
                    key={hours.day} 
                    className={`p-3 rounded-lg ${
                      hours.isAvailable 
                        ? 'bg-neutral-50' 
                        : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">{hours.day}</span>
                      {hours.isAvailable ? (
                        <span>{hours.startTime} - {hours.endTime}</span>
                      ) : (
                        <span>Not Available</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bio */}
            <div className="border border-neutral-200 rounded-lg p-4">
              <h4 className="font-semibold mb-4 flex items-center">
                <Award size={18} className="mr-2 text-primary-500" />
                Biography
              </h4>
              
              <p className="text-neutral-700">{formData.bio}</p>
            </div>
            
            {/* Account Security */}
            <div className="border border-neutral-200 rounded-lg p-4">
              <h4 className="font-semibold mb-4 flex items-center">
                <Lock size={18} className="mr-2 text-primary-500" />
                Account Security
              </h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-neutral-500">Last changed: Never</p>
                  </div>
                  <button className="btn-ghost text-sm">Change Password</button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-neutral-500">Enhance your account security</p>
                  </div>
                  <button className="btn-ghost text-sm">Enable</button>
                </div>
              </div>
            </div>
            
            {/* Danger Zone */}
            <div className="border border-error-200 rounded-lg p-4 bg-error-50">
              <h4 className="font-semibold mb-4 text-error-700">Danger Zone</h4>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-error-700">Delete Account</p>
                  <p className="text-sm text-error-600">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
                <button className="text-error-600 border border-error-300 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-error-100">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        ) : (
          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Profile photo */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center text-3xl font-medium">
                  {userProfile?.displayName?.charAt(0) || 'D'}
                </div>
                <button 
                  type="button"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 border border-neutral-200 shadow-sm"
                >
                  <Camera size={16} className="text-neutral-600" />
                </button>
              </div>
            </div>
            
            {/* Basic Information */}
            <div className="border border-neutral-200 rounded-lg p-4">
              <h4 className="font-semibold mb-4">Basic Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    className="input w-full"
                    value={formData.displayName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-neutral-700 mb-1">
                    Specialty
                  </label>
                  <input
                    type="text"
                    id="specialty"
                    name="specialty"
                    className="input w-full"
                    value={formData.specialty}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="qualifications" className="block text-sm font-medium text-neutral-700 mb-1">
                    Qualifications
                  </label>
                  <input
                    type="text"
                    id="qualifications"
                    name="qualifications"
                    className="input w-full"
                    value={formData.qualifications}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    className="input w-full"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="hospitalAffiliation" className="block text-sm font-medium text-neutral-700 mb-1">
                    Hospital Affiliation
                  </label>
                  <input
                    type="text"
                    id="hospitalAffiliation"
                    name="hospitalAffiliation"
                    className="input w-full"
                    value={formData.hospitalAffiliation}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="languages" className="block text-sm font-medium text-neutral-700 mb-1">
                    Languages
                  </label>
                  <input
                    type="text"
                    id="languages"
                    name="languages"
                    className="input w-full"
                    value={formData.languages}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="acceptingNewPatients"
                      checked={formData.acceptingNewPatients}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-primary-500 rounded border-neutral-300 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-neutral-700">
                      I am currently accepting new patients
                    </span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Location */}
            <div className="border border-neutral-200 rounded-lg p-4">
              <h4 className="font-semibold mb-4 flex items-center">
                <MapPin size={18} className="mr-2 text-primary-500" />
                Location
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="input w-full"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="input w-full"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    className="input w-full"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-neutral-700 mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    className="input w-full"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Working Hours */}
            <div className="border border-neutral-200 rounded-lg p-4">
              <h4 className="font-semibold mb-4 flex items-center">
                <Clock size={18} className="mr-2 text-primary-500" />
                Working Hours
              </h4>
              
              <div className="space-y-4">
                {workingHours.map((hours, index) => (
                  <div key={hours.day} className="p-3 bg-neutral-50 rounded-lg">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="w-20">
                        <span className="font-medium capitalize">{hours.day}</span>
                      </div>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={hours.isAvailable}
                          onChange={(e) => handleWorkingHoursChange(index, 'isAvailable', e.target.checked)}
                          className="h-4 w-4 text-primary-500 rounded border-neutral-300 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-neutral-700">Available</span>
                      </label>
                      
                      {hours.isAvailable && (
                        <>
                          <div>
                            <label className="block text-xs text-neutral-500 mb-1">Start Time</label>
                            <input
                              type="time"
                              value={hours.startTime}
                              onChange={(e) => handleWorkingHoursChange(index, 'startTime', e.target.value)}
                              className="input py-1 px-2 text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs text-neutral-500 mb-1">End Time</label>
                            <input
                              type="time"
                              value={hours.endTime}
                              onChange={(e) => handleWorkingHoursChange(index, 'endTime', e.target.value)}
                              className="input py-1 px-2 text-sm"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bio */}
            <div className="border border-neutral-200 rounded-lg p-4">
              <h4 className="font-semibold mb-4 flex items-center">
                <Award size={18} className="mr-2 text-primary-500" />
                Biography
              </h4>
              
              <textarea
                id="bio"
                name="bio"
                rows={4}
                className="input w-full"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Write a short bio about your professional experience and expertise..."
              ></textarea>
            </div>
            
            {/* Form actions */}
            <div className="flex justify-end space-x-3">
              <button 
                type="button"
                className="btn-ghost"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
};

// Profile item component for display mode
const ProfileItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-neutral-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default DoctorProfile;
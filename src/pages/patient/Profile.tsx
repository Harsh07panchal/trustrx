import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Camera, Mail, Phone, MapPin, Shield, UserPlus, Lock } from 'lucide-react';

const PatientProfile = () => {
  const { userProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    address: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: ''
  });
  
  // Initialize form data with user profile
  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        dateOfBirth: '', // These would come from the patient profile
        gender: '',
        phoneNumber: '',
        address: '',
        emergencyContactName: '',
        emergencyContactRelationship: '',
        emergencyContactPhone: ''
      });
    }
  }, [userProfile]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would update the user profile in the database
    console.log('Updated profile:', formData);
    
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
                  {userProfile?.displayName?.charAt(0) || 'U'}
                </div>
              </div>
              
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-semibold">{userProfile?.displayName}</h3>
                <p className="text-neutral-500">{userProfile?.email}</p>
                <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Patient
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                    Free Plan
                  </span>
                </div>
              </div>
            </div>
            
            {/* Profile sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <h4 className="font-semibold mb-4 flex items-center">
                  <User size={18} className="mr-2 text-primary-500" />
                  Personal Information
                </h4>
                
                <div className="space-y-3">
                  <ProfileItem label="Date of Birth" value="Not provided" />
                  <ProfileItem label="Gender" value="Not provided" />
                  <ProfileItem label="Phone Number" value="Not provided" />
                  <ProfileItem label="Address" value="Not provided" />
                </div>
              </div>
              
              {/* Emergency Contact */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <h4 className="font-semibold mb-4 flex items-center">
                  <Phone size={18} className="mr-2 text-primary-500" />
                  Emergency Contact
                </h4>
                
                <div className="space-y-3">
                  <ProfileItem label="Name" value="Not provided" />
                  <ProfileItem label="Relationship" value="Not provided" />
                  <ProfileItem label="Phone Number" value="Not provided" />
                </div>
              </div>
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
            
            {/* Connected Services */}
            <div className="border border-neutral-200 rounded-lg p-4">
              <h4 className="font-semibold mb-4 flex items-center">
                <Shield size={18} className="mr-2 text-primary-500" />
                Connected Services
              </h4>
              
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg mb-3">
                <div className="flex items-center">
                  <svg className="h-8 w-8 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#4285F4"/>
                    <path d="M12 9.5V14.5H18.5C18 16.5 16 18.5 12 18.5C8.14 18.5 5 15.36 5 11.5C5 7.64 8.14 4.5 12 4.5C14 4.5 15.5 5.25 16.5 6.15L20.5 2.15C18.5 0.75 15.5 0 12 0C5.5 0 0 5.5 0 11.5C0 17.5 5.5 23 12 23C22 23 24 13 22.5 9.5H12Z" fill="white"/>
                  </svg>
                  <div>
                    <p className="font-medium">Google</p>
                    <p className="text-sm text-neutral-500">Connected</p>
                  </div>
                </div>
                <button className="btn-ghost text-sm">Disconnect</button>
              </div>
              
              <button className="flex items-center text-primary-600 font-medium text-sm">
                <UserPlus size={16} className="mr-1" />
                Connect Another Service
              </button>
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
                  {userProfile?.displayName?.charAt(0) || 'U'}
                </div>
                <button 
                  type="button"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 border border-neutral-200 shadow-sm"
                >
                  <Camera size={16} className="text-neutral-600" />
                </button>
              </div>
            </div>
            
            {/* Personal Information */}
            <div className="border border-neutral-200 rounded-lg p-4">
              <h4 className="font-semibold mb-4 flex items-center">
                <User size={18} className="mr-2 text-primary-500" />
                Personal Information
              </h4>
              
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
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-neutral-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    className="input w-full"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-neutral-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    className="input w-full"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    className="input w-full"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
                
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
              </div>
            </div>
            
            {/* Emergency Contact */}
            <div className="border border-neutral-200 rounded-lg p-4">
              <h4 className="font-semibold mb-4 flex items-center">
                <Phone size={18} className="mr-2 text-primary-500" />
                Emergency Contact
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="emergencyContactName" className="block text-sm font-medium text-neutral-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    name="emergencyContactName"
                    className="input w-full"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="emergencyContactRelationship" className="block text-sm font-medium text-neutral-700 mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    id="emergencyContactRelationship"
                    name="emergencyContactRelationship"
                    className="input w-full"
                    value={formData.emergencyContactRelationship}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    className="input w-full"
                    value={formData.emergencyContactPhone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
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

export default PatientProfile;
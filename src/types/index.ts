// User types
export type UserRole = 'patient' | 'doctor';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  photoURL?: string;
}

export interface PatientProfile extends User {
  role: 'patient';
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  subscriptionTier: SubscriptionTier;
  storageUsed: number;
}

export interface DoctorProfile extends User {
  role: 'doctor';
  specialty: string;
  qualifications: string[];
  licenseNumber: string;
  hospitalAffiliation?: string;
  workingHours: WorkingHours[];
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  acceptingNewPatients: boolean;
  bio: string;
  languages: string[];
  isVerified: boolean;
  subscriptionTier: DoctorSubscriptionTier;
  rating?: number;
  reviewCount?: number;
}

// Medical record types
export interface MedicalRecord {
  id: string;
  patientId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  category: MedicalRecordCategory;
  description: string;
  url: string;
  thumbnailUrl?: string;
  blockchainVerification?: {
    transactionId: string;
    hash: string;
    timestamp: string;
    verified: boolean;
  };
  sharedWith: string[]; // Array of doctor IDs
}

export type MedicalRecordCategory = 
  | 'labResults' 
  | 'imaging' 
  | 'prescriptions' 
  | 'consultations' 
  | 'surgeries'
  | 'vaccinations'
  | 'allergies'
  | 'other';

// Appointment types
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  status: AppointmentStatus;
  dateTime: string;
  duration: number; // in minutes
  reason: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = 
  | 'requested' 
  | 'confirmed' 
  | 'cancelled' 
  | 'completed';

// Subscription types
export type SubscriptionTier = 
  | 'free' 
  | 'basic' 
  | 'premium' 
  | 'unlimited';

export type DoctorSubscriptionTier = 
  | 'free' 
  | 'professional';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  storageLimit: number; // in GB, -1 for unlimited
  benefits: string[];
}

export interface DoctorSubscriptionPlan {
  id: string;
  name: string;
  tier: DoctorSubscriptionTier;
  price: number;
  benefits: string[];
}

// Working hours type
export interface WorkingHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string; // Format: "09:00"
  endTime: string; // Format: "17:00"
  isAvailable: boolean;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: NotificationType;
  relatedId?: string; // ID of related entity (appointment, record, etc.)
}

export type NotificationType = 
  | 'appointment' 
  | 'record' 
  | 'subscription' 
  | 'system';
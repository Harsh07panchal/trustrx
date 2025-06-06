import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  FileText, 
  Upload, 
  FileImage, 
  FileUp, 
  FileX, 
  Search, 
  Filter, 
  Shield, 
  Download, 
  Trash, 
  Share, 
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { sha256 } from 'js-sha256';

const MedicalRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('labResults');
  
  // Mock data for medical records
  const [records, setRecords] = useState([
    {
      id: '1',
      fileName: 'Annual Physical Results.pdf',
      fileType: 'application/pdf',
      fileSize: 2500000,
      uploadDate: '2023-06-15',
      category: 'labResults',
      description: 'Annual physical examination results from Dr. Sarah Johnson',
      url: '#',
      thumbnailUrl: '#',
      blockchainVerification: {
        transactionId: '0x123456789abcdef',
        hash: '0xabcdef123456789',
        timestamp: '2023-06-15T10:30:00Z',
        verified: true
      }
    },
    {
      id: '2',
      fileName: 'Chest X-Ray.jpg',
      fileType: 'image/jpeg',
      fileSize: 4200000,
      uploadDate: '2023-04-22',
      category: 'imaging',
      description: 'Chest X-Ray from Memorial Hospital',
      url: '#',
      thumbnailUrl: '#',
      blockchainVerification: {
        transactionId: '0x987654321fedcba',
        hash: '0xfedcba987654321',
        timestamp: '2023-04-22T14:15:00Z',
        verified: true
      }
    },
    {
      id: '3',
      fileName: 'Allergy Test Results.pdf',
      fileType: 'application/pdf',
      fileSize: 1800000,
      uploadDate: '2023-02-10',
      category: 'labResults',
      description: 'Comprehensive allergy panel from Allergy Specialists',
      url: '#',
      thumbnailUrl: '#',
      blockchainVerification: {
        transactionId: '0xabcdef123456789',
        hash: '0x123456789abcdef',
        timestamp: '2023-02-10T09:45:00Z',
        verified: true
      }
    },
    {
      id: '4',
      fileName: 'Prescription - Amoxicillin.pdf',
      fileType: 'application/pdf',
      fileSize: 500000,
      uploadDate: '2023-01-05',
      category: 'prescriptions',
      description: 'Prescription for Amoxicillin 500mg from Dr. James Wilson',
      url: '#',
      thumbnailUrl: '#',
      blockchainVerification: {
        transactionId: '0x567890abcdef1234',
        hash: '0xdef1234567890abc',
        timestamp: '2023-01-05T16:20:00Z',
        verified: true
      }
    }
  ]);
  
  const categories = [
    { id: 'labResults', name: 'Lab Results', icon: <FileText size={16} /> },
    { id: 'imaging', name: 'Imaging', icon: <FileImage size={16} /> },
    { id: 'prescriptions', name: 'Prescriptions', icon: <FileText size={16} /> },
    { id: 'consultations', name: 'Consultations', icon: <FileText size={16} /> },
    { id: 'surgeries', name: 'Surgeries', icon: <FileText size={16} /> },
    { id: 'vaccinations', name: 'Vaccinations', icon: <FileText size={16} /> },
    { id: 'allergies', name: 'Allergies', icon: <FileText size={16} /> },
    { id: 'other', name: 'Other', icon: <FileText size={16} /> }
  ];
  
  // Filter records based on search term and category
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.fileName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? record.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });
  
  // Handle file drop for upload
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadingFile(file);
      setShowUploadModal(true);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 10485760 // 10MB
  });
  
  // Start upload process
  const handleUpload = async () => {
    if (!uploadingFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    try {
      // Calculate file hash (for blockchain verification)
      const fileBuffer = await uploadingFile.arrayBuffer();
      const fileHash = sha256(fileBuffer);
      
      // Simulate upload and blockchain transaction
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        
        // Add new record to the list
        const newRecord = {
          id: Date.now().toString(),
          fileName: uploadingFile.name,
          fileType: uploadingFile.type,
          fileSize: uploadingFile.size,
          uploadDate: new Date().toISOString().split('T')[0],
          category: uploadCategory,
          description: uploadDescription,
          url: '#',
          thumbnailUrl: '#',
          blockchainVerification: {
            transactionId: `0x${Math.random().toString(16).slice(2)}`,
            hash: `0x${fileHash}`,
            timestamp: new Date().toISOString(),
            verified: true
          }
        };
        
        setRecords(prev => [newRecord, ...prev]);
        
        // Reset upload state
        setTimeout(() => {
          setIsUploading(false);
          setUploadingFile(null);
          setUploadDescription('');
          setShowUploadModal(false);
        }, 1000);
      }, 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
    }
  };
  
  // Format file size in KB or MB
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        <h2 className="text-2xl font-bold mb-6">Medical Records</h2>
        
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          {/* Search bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search records..."
              className="input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Upload button */}
          <button
            className="btn-primary flex items-center justify-center"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload size={18} className="mr-2" />
            Upload Record
          </button>
        </div>
        
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
              selectedCategory === null
                ? 'bg-primary-100 text-primary-700'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            <Filter size={16} className="mr-1" />
            All
          </button>
          
          {categories.map(category => (
            <button
              key={category.id}
              className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                selectedCategory === category.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon}
              <span className="ml-1">{category.name}</span>
            </button>
          ))}
        </div>
        
        {/* Records list */}
        {filteredRecords.length > 0 ? (
          <div className="space-y-4">
            {filteredRecords.map(record => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-neutral-200 rounded-lg p-4 hover:border-primary-200 transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* File type icon */}
                  <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-500 flex items-center justify-center flex-shrink-0">
                    {record.fileType.includes('pdf') ? (
                      <FileText size={24} />
                    ) : record.fileType.includes('image') ? (
                      <FileImage size={24} />
                    ) : (
                      <FileText size={24} />
                    )}
                  </div>
                  
                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg truncate">{record.fileName}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500 mt-1">
                      <span>{formatDate(record.uploadDate)}</span>
                      <span>{formatFileSize(record.fileSize)}</span>
                      <span className="capitalize">{getCategoryName(record.category)}</span>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                      {record.description}
                    </p>
                  </div>
                  
                  {/* Verification badge */}
                  <div className="flex-shrink-0 self-center">
                    {record.blockchainVerification?.verified && (
                      <div className="verified-badge flex items-center">
                        <Shield size={14} className="mr-1" />
                        Verified
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 self-center">
                    <button className="p-2 text-neutral-500 hover:text-primary-500 hover:bg-neutral-100 rounded-full transition-colors" title="Download">
                      <Download size={18} />
                    </button>
                    <button className="p-2 text-neutral-500 hover:text-primary-500 hover:bg-neutral-100 rounded-full transition-colors" title="Share">
                      <Share size={18} />
                    </button>
                    <button className="p-2 text-neutral-500 hover:text-error-500 hover:bg-neutral-100 rounded-full transition-colors" title="Delete">
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileX className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-700 mb-2">No records found</h3>
            <p className="text-neutral-500 mb-6">
              {searchTerm || selectedCategory
                ? "No records match your search criteria. Try different filters."
                : "You haven't uploaded any medical records yet."}
            </p>
            {!searchTerm && !selectedCategory && (
              <button
                className="btn-primary inline-flex items-center"
                onClick={() => setShowUploadModal(true)}
              >
                <Upload size={18} className="mr-2" />
                Upload Your First Record
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Storage usage */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold">Storage Usage</h3>
            <p className="text-neutral-500 text-sm">Free plan: 2GB storage</p>
          </div>
          <button className="btn-outline">Upgrade Plan</button>
        </div>
        
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-success-500 mr-2" />
            <span className="text-sm font-medium">All files are blockchain verified</span>
          </div>
          <span className="text-sm text-neutral-500">1.2 GB / 2 GB</span>
        </div>
        
        <div className="progress-bar">
          <div className="progress-value" style={{ width: '60%' }}></div>
        </div>
        
        <div className="mt-4 text-xs text-neutral-500 flex items-center">
          <Info size={14} className="mr-1" />
          <span>Upgrade your plan to increase your storage limit and access premium features.</span>
        </div>
      </div>
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Upload Medical Record</h3>
              
              {!uploadingFile ? (
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:border-primary-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <FileUp size={36} className="mx-auto mb-4 text-neutral-400" />
                  <p className="text-neutral-600 mb-2">
                    {isDragActive
                      ? 'Drop the file here...'
                      : 'Drag & drop a file here, or click to select a file'}
                  </p>
                  <p className="text-neutral-500 text-sm">
                    Supports PDF, JPG, PNG (max 10MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                    <div className="h-10 w-10 rounded-md bg-primary-100 text-primary-500 flex items-center justify-center mr-3">
                      {uploadingFile.type.includes('pdf') ? (
                        <FileText size={20} />
                      ) : uploadingFile.type.includes('image') ? (
                        <FileImage size={20} />
                      ) : (
                        <FileText size={20} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{uploadingFile.name}</p>
                      <p className="text-sm text-neutral-500">{formatFileSize(uploadingFile.size)}</p>
                    </div>
                    <button 
                      className="text-neutral-400 hover:text-neutral-600 p-1" 
                      onClick={() => setUploadingFile(null)}
                      disabled={isUploading}
                    >
                      <FileX size={18} />
                    </button>
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      className="input w-full"
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      disabled={isUploading}
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      className="input w-full"
                      rows={3}
                      placeholder="Add a description for this record..."
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      disabled={isUploading}
                    ></textarea>
                  </div>
                  
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading and verifying...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-value" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="border-t border-neutral-200 p-4 flex justify-end gap-3">
              <button 
                className="btn-ghost"
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadingFile(null);
                  setUploadDescription('');
                }}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button 
                className="btn-primary flex items-center"
                onClick={handleUpload}
                disabled={isUploading || !uploadingFile}
              >
                {isUploading ? 'Uploading...' : 'Upload & Verify'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get category name from ID
const getCategoryName = (categoryId: string) => {
  const categories = {
    labResults: 'Lab Results',
    imaging: 'Imaging',
    prescriptions: 'Prescriptions',
    consultations: 'Consultations',
    surgeries: 'Surgeries',
    vaccinations: 'Vaccinations',
    allergies: 'Allergies',
    other: 'Other'
  };
  
  return categories[categoryId as keyof typeof categories] || categoryId;
};

export default MedicalRecords;
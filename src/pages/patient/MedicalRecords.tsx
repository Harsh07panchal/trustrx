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
  Info,
  ExternalLink,
  Eye,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sha256 } from 'js-sha256';
import { storeHashOnBlockchain } from '../../config/algorand';

const MedicalRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadCategory, setUploadCategory] = useState('labResults');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});
  
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
        transactionId: 'algo-tx-1687689000000-abc123def',
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
        transactionId: 'algo-tx-1682179200000-def456ghi',
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
        transactionId: 'algo-tx-1676016000000-ghi789jkl',
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
        transactionId: 'algo-tx-1672876800000-jkl012mno',
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
  
  // Start upload process with blockchain verification
  const handleUpload = async () => {
    if (!uploadingFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Step 1: Calculate file hash
      setUploadProgress(20);
      const fileBuffer = await uploadingFile.arrayBuffer();
      const fileHash = sha256(fileBuffer);
      console.log('File hash calculated:', fileHash);
      
      // Step 2: Store hash on blockchain
      setUploadProgress(40);
      const mockUserAddress = 'ALGO' + Math.random().toString(36).substr(2, 25).toUpperCase();
      const mockPrivateKey = Math.random().toString(36).substr(2, 32);
      
      const blockchainResult = await storeHashOnBlockchain(fileHash, mockUserAddress, mockPrivateKey);
      
      if (!blockchainResult.success) {
        throw new Error(blockchainResult.error || 'Blockchain verification failed');
      }
      
      setUploadProgress(80);
      
      // Step 3: Simulate file upload to storage
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUploadProgress(100);
      
      // Step 4: Add new record to the list
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
          transactionId: blockchainResult.transactionId!,
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
        setUploadProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      // You could show an error message here
    }
  };

  // Handle download
  const handleDownload = (record: any) => {
    // In a real app, this would download the actual file
    console.log('Downloading:', record.fileName);
    
    // Create a mock download
    const element = document.createElement('a');
    element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Mock file: ${record.fileName}\nDescription: ${record.description}\nBlockchain TX: ${record.blockchainVerification.transactionId}`);
    element.download = record.fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Handle share
  const handleShare = (record: any) => {
    setSelectedRecord(record);
    setShowShareModal(true);
  };

  // Handle delete
  const handleDelete = (record: any) => {
    if (window.confirm(`Are you sure you want to delete "${record.fileName}"? This action cannot be undone.`)) {
      setRecords(prev => prev.filter(r => r.id !== record.id));
      console.log('Deleted record:', record.fileName);
    }
  };

  // Handle view/preview
  const handleView = (record: any) => {
    // In a real app, this would open a preview modal or new tab
    console.log('Viewing:', record.fileName);
    alert(`Preview functionality would open here for: ${record.fileName}`);
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Submit share
  const submitShare = () => {
    if (!shareEmail || !selectedRecord) return;
    
    // In a real app, this would send a secure share link
    console.log('Sharing record with:', shareEmail);
    alert(`Share link sent to ${shareEmail} for "${selectedRecord.fileName}"`);
    
    setShowShareModal(false);
    setShareEmail('');
    setSelectedRecord(null);
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
                      <div 
                        className="verified-badge flex items-center cursor-pointer" 
                        title={`Blockchain verified: ${record.blockchainVerification.transactionId}`}
                        onClick={() => copyToClipboard(record.blockchainVerification.transactionId, `tx-${record.id}`)}
                      >
                        <Shield size={14} className="mr-1" />
                        {copiedStates[`tx-${record.id}`] ? (
                          <>
                            <Check size={14} className="mr-1" />
                            Copied!
                          </>
                        ) : (
                          'Verified'
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 self-center">
                    <button 
                      className="p-2 text-neutral-500 hover:text-primary-500 hover:bg-neutral-100 rounded-full transition-colors" 
                      title="View/Preview"
                      onClick={() => handleView(record)}
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      className="p-2 text-neutral-500 hover:text-primary-500 hover:bg-neutral-100 rounded-full transition-colors" 
                      title="Download"
                      onClick={() => handleDownload(record)}
                    >
                      <Download size={18} />
                    </button>
                    <button 
                      className="p-2 text-neutral-500 hover:text-primary-500 hover:bg-neutral-100 rounded-full transition-colors" 
                      title="Share"
                      onClick={() => handleShare(record)}
                    >
                      <Share size={18} />
                    </button>
                    <button 
                      className="p-2 text-neutral-500 hover:text-error-500 hover:bg-neutral-100 rounded-full transition-colors" 
                      title="Delete"
                      onClick={() => handleDelete(record)}
                    >
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
      <AnimatePresence>
        {showUploadModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-xl max-w-lg w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
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
                          <span>
                            {uploadProgress < 40 ? 'Calculating hash...' :
                             uploadProgress < 80 ? 'Storing on blockchain...' :
                             uploadProgress < 100 ? 'Uploading file...' : 'Complete!'}
                          </span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-value" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        {uploadProgress < 100 && (
                          <p className="text-xs text-neutral-500">
                            Your file is being secured with blockchain verification...
                          </p>
                        )}
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
                    setUploadProgress(0);
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && selectedRecord && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Share Medical Record</h3>
                
                <div className="mb-4 p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FileText size={20} className="text-primary-500 mr-2" />
                    <span className="font-medium">{selectedRecord.fileName}</span>
                  </div>
                  <p className="text-sm text-neutral-600">{selectedRecord.description}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="share-email" className="block text-sm font-medium text-neutral-700 mb-1">
                      Share with (Email)
                    </label>
                    <input
                      type="email"
                      id="share-email"
                      className="input w-full"
                      placeholder="doctor@example.com"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-700">
                      <strong>Note:</strong> A secure, time-limited link will be sent to the recipient. 
                      They'll be able to view the record and verify its blockchain authenticity.
                    </p>
                  </div>

                  <div className="text-xs text-neutral-500">
                    <p><strong>Blockchain TX:</strong> {selectedRecord.blockchainVerification.transactionId}</p>
                    <p><strong>Hash:</strong> {selectedRecord.blockchainVerification.hash}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-neutral-200 p-4 flex justify-end space-x-3">
                <button 
                  className="btn-ghost"
                  onClick={() => {
                    setShowShareModal(false);
                    setShareEmail('');
                    setSelectedRecord(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary"
                  onClick={submitShare}
                  disabled={!shareEmail}
                >
                  Send Secure Link
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
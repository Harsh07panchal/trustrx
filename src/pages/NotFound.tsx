import { useNavigate } from 'react-router-dom';
import { FileSearch } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <FileSearch className="h-20 w-20 text-primary-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-neutral-600 text-lg mb-8 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => navigate('/')} 
          className="btn-primary px-6"
        >
          Go Home
        </button>
        <button 
          onClick={() => navigate(-1)} 
          className="btn-outline px-6"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
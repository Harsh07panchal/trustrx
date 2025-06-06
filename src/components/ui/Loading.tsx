import { motion } from 'framer-motion';
import { FileLock } from 'lucide-react';

const Loading = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="flex items-center mb-6"
      >
        <FileLock className="h-12 w-12 text-primary-500 mr-2" />
        <span className="text-3xl font-bold">TrustRx</span>
      </motion.div>
      
      <div className="w-12 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <p className="mt-4 text-neutral-500 text-sm">Loading your secure health data...</p>
    </div>
  );
};

export default Loading;
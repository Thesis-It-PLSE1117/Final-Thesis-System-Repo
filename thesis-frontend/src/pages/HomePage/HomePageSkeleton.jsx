import { motion } from 'framer-motion';

const HomePageSkeleton = () => {
  return (
    <motion.div
      className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-white to-[#e0f7fa]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >

      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="h-12 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
      </div>
      

      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <div className="h-16 bg-gray-200 rounded max-w-2xl mx-auto mb-4 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded max-w-xl mx-auto mb-8 animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
        </div>
      </div>
      

      <div className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePageSkeleton;

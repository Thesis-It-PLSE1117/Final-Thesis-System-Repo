import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { FaGithub } from 'react-icons/fa';
import danmelImage from '../../assets/2x2-laranga.png';
import kierImage from '../../assets/2x2-reyes.png';
import alfredImage from '../../assets/2x2-violanta.png';

const AboutUsModal = ({ isOpen, onClose }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    },
    exit: {
      y: 20,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    visible: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { 
      scale: 0.95, 
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  const teamMembers = [
    {
      name: "John Danmel C. Laranga",
      role: "Thesis Leader/Project Manager",
      image: danmelImage,
      location: "University of Cabuyao",
      description: "Leads the research team and manages the project timeline.",
      github: "https://github.com/Danmel502"
    },
    {
      name: "Kier Christian F. Reyes",
      role: "Backend Dev Lead",
      image: kierImage,
      location: "University of Cabuyao",
      description: "Builds the backend and develop the algorithms chosen for the study.",
      github: "https://github.com/kierre-yes"
    },
    {
      name: "Jan Alfred G. Violanta",
      role: "Frontend Dev Lead",
      image: alfredImage,
      location: "University of Cabuyao",
      description: "Creates the user interface and visual displays.",
      github: "https://github.com/alfred-jgv"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Enhanced backdrop */}
          <div 
            className="fixed inset-0 bg-gradient-to-br from-gray-900/70 via-gray-800/50 to-gray-900/70 backdrop-blur-md" 
            onClick={onClose}
          />
          
          <motion.div
            variants={modalVariants}
            className="bg-white w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl relative mx-4 overflow-y-auto"
          >
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-500 hover:text-gray-700 rounded-full p-2 shadow-lg border border-gray-200 backdrop-blur-sm"
            >
              <IoClose className="text-xl" />
            </motion.button>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="px-6 py-8 lg:px-12 lg:py-12"
            >
              {/* Header Section */}
              <div className="mx-auto max-w-3xl text-center mb-12">
                <motion.h2 
                  variants={itemVariants}
                  className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4"
                >
                  Meet the minds behind{' '}
                  <span className="text-[#319694]">the research</span>
                </motion.h2>
                
                <motion.p 
                  variants={itemVariants}
                  className="text-lg text-gray-600 leading-relaxed"
                >
                  A dedicated team of 4th year students  pushing the boundaries of cloud computing optimization through innovative algorithmic approaches and rigorous academic methodology.
                </motion.p>
              </div>

              {/* Team Grid */}
              <div className="grid max-w-7xl mx-auto grid-cols-1 gap-6 lg:grid-cols-3 mb-12">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                  >
                    {/* Image container */}
                    <div className="relative mb-5 mx-auto w-32 h-32">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#319694]/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <img 
                        loading="lazy"
                        src={member.image} 
                        alt={member.name}
                        className="relative w-full h-full rounded-full object-cover border-4 border-white shadow-md group-hover:border-[#319694]/10 transition-all duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm font-medium text-[#319694] mb-3">
                        {member.role}
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                        {member.description}
                      </p>
                      <div className="flex items-center justify-center text-xs text-gray-500 mb-4">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {member.location}
                      </div>
                      
                      {/* GitHub link */}
                      <div className="flex justify-center pt-3 border-t border-gray-100">
                        <motion.a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-gray-400 hover:text-[#319694] transition-colors duration-200"
                        >
                          <FaGithub className="w-5 h-5" />
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Project Info Card */}
              <motion.div 
                variants={itemVariants}
                className="mx-auto max-w-4xl bg-gradient-to-br from-[#319694] to-[#267573] rounded-xl overflow-hidden shadow-lg"
              >
                <div className="relative p-8 lg:p-10">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  </div>
                  
                  <div className="relative grid lg:grid-cols-3 gap-8 items-center">
                    {/* Left: Stats */}
                    <div className="lg:col-span-1 space-y-6 text-center lg:text-left">
                      <div>
                        <div className="text-3xl font-bold text-white mb-2">2025</div>
                        <div className="text-xs font-medium text-white/80 bg-white/20 inline-block px-3 py-1 rounded-full">
                          Research Timeline
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-lg font-semibold text-white">CloudSim</div>
                          <div className="text-xs text-white/70">Framework</div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Project details */}
                    <div className="lg:col-span-2 text-center lg:text-left">
                      <h4 className="text-xl font-bold text-white mb-3">
                        Research Title
                      </h4>
                      <p className="text-lg font-semibold text-white/95 mb-4 leading-tight">
                        Enhanced PSO and ACO for Cloud Load Balancing: A Comparative Study
                      </p>
                      <p className="text-sm text-white/80 leading-relaxed">
                        A simulation-based study using CloudSim to compare Enhanced Particle Swarm Optimization (EPSO) and Enhanced Ant Colony Optimization (EACO) for cloud load balancing efficiency.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AboutUsModal;
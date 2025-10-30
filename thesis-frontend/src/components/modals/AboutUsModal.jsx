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
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", damping: 20, stiffness: 300 }
    },
    exit: { 
      scale: 0.95, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const teamMembers = [
  {
    name: "John Danmel C. Laranga",
    role: "Thesis Leader/Project Manager",
    image: danmelImage,
    location: "University of Cabuyao",
    description: "Leads the team and manages the project timeline. Makes sure everyone stays coordinated and the research meets academic standards.",
    github: "https://github.com/Danmel502"
  },
  {
    name: "Kier Christian F. Reyes",
    role: "Backend Dev Lead",
    image: kierImage,
    location: "University of Cabuyao",
    description: "Builds the technical systems and runs simulations. Develops the algorithms that power the research and test different solutions.",
    github: "https://github.com/kierre-yes"
  },
  {
    name: "Jan Alfred G. Violanta",
    role: "Frontend Dev Lead",
    image: alfredImage,
    location: "University of Cabuyao",
    description: "Creates the user interface and visual displays. Transforms complex research data into easy-to-understand charts and interactions.",
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
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
        >
          <div 
            className="fixed inset-0 bg-gradient-to-br from-black/40 via-[#319694]/10 to-black/40" 
            onClick={onClose}
          />
          
          <motion.div
            variants={modalVariants}
            className="bg-white w-full max-w-6xl max-h-[90vh] rounded-3xl shadow-2xl relative mx-4 overflow-y-auto"
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-2xl z-10 bg-white rounded-full p-2 shadow-lg"
            >
              <IoClose />
            </motion.button>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="px-6 py-12 lg:px-16 lg:py-16"
            >
              {/* Header Section */}
              <div className="mx-auto max-w-3xl text-center mb-16">
               
                
                <motion.h2 
                  variants={itemVariants}
                  className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6"
                >
                  Meet the minds behind{' '}
                  <span className="text-[#319694]">the research</span>
                </motion.h2>
                
                <motion.p 
                  variants={itemVariants}
                  className="text-lg leading-relaxed text-gray-600"
                >
                  A dedicated team of researchers pushing the boundaries of cloud computing optimization through innovative algorithmic approaches and rigorous academic methodology.
                </motion.p>
              </div>

              {/* Team Grid */}
              <div 
                className="grid max-w-7xl mx-auto grid-cols-1 gap-8 lg:grid-cols-3 mb-16"
              >
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    {/* Image with overlay effect */}
                    <div className="relative mb-6 mx-auto w-48 h-48">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#319694]/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <img 
                        loading="lazy"
                        src={member.image} 
                        alt={member.name}
                        className="relative w-full h-full rounded-full object-cover ring-4 ring-white shadow-lg group-hover:ring-[#319694]/20 transition-all duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm font-semibold text-[#319694] mb-3">
                        {member.role}
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        {member.description}
                      </p>
                      <div className="flex items-center justify-center text-xs text-gray-500 mb-4">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {member.location}
                      </div>
                      
                      {/* GitHub link */}
                      <div className="flex justify-center pt-4 border-t border-gray-200">
                        <motion.a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-gray-400 hover:text-[#319694] transition-colors"
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
                className="mx-auto max-w-4xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#319694] to-[#267573]" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
                
                <div className="relative rounded-2xl p-8 lg:p-12">
                  <div className="grid lg:grid-cols-3 gap-8 items-center">
                    {/* Left: Stats */}
                    <div className="lg:col-span-1 space-y-4">
                      <div className="text-center lg:text-left">
                        <div className="text-4xl font-bold text-white mb-1">2025</div>
                        <div className="text-sm text-[#319694]/80 bg-white inline-block px-3 py-1 rounded-full">
                          Timeline
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="text-center lg:text-left">
                          <div className="text-2xl font-bold text-white">CloudSim</div>
                          <div className="text-xs text-white/70">Framework</div>
                        </div>
                        <div className="text-center lg:text-left">
                          <div className="text-2xl font-bold text-white">Quantitative</div>
                          <div className="text-xs text-white/70">Methodology</div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Project details */}
                    <div className="lg:col-span-2 text-center lg:text-left">
                      <h4 className="text-2xl font-bold text-white mb-4">
                         Research Title
                      </h4>
                      <p className="text-lg font-semibold text-white/90 mb-4">
                        Enhanced PSO and ACO for Cloud Load Balancing: A Comparative Study
                      </p>
                      <p className="text-sm text-white/70 leading-relaxed">
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

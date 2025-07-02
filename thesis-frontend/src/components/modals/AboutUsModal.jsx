import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaUniversity } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
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

  const cardVariants = {
    hover: { y: -5, scale: 1.03, transition: { duration: 0.2 } }
  };

  const teamMembers = [
    {
      name: "John Danmel C. Laranga",
      role: "Team Leader",
      image: danmelImage,
      description: "Oversaw project development and coordination"
    },
    {
      name: "Kier Christian F. Reyes",
      role: "Backend Developer",
      image: kierImage,
      description: "Implemented load balancing algorithms and server logic"
    },
    {
      name: "Jan Alfred G. Violanta",
      role: "Frontend Developer",
      image: alfredImage,
      description: "Designed and developed the user interface"
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
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
        >
          <motion.div
            variants={modalVariants}
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative mx-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
            >
              <IoClose />
            </motion.button>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-3xl font-bold text-[#319694] mb-6 flex items-center gap-2"
              >
                About The Team
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  👋
                </motion.div>
              </motion.h2>

              <motion.p variants={itemVariants} className="mb-6 text-lg">
                This thesis project was developed by passionate Computer Science students:
              </motion.p>

              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={cardVariants.hover}
                    className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-5 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <motion.div 
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#319694]/10 flex items-center justify-center overflow-hidden"
                    >
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <h3 className="font-bold text-gray-800 text-lg">{member.name}</h3>
                    <p className="text-sm text-[#319694] font-medium mb-2">{member.role}</p>
                    <p className="text-xs text-gray-500">{member.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="bg-[#319694]/10 rounded-xl p-4 mb-6"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FaUniversity className="text-[#319694]" />
                  <h4 className="font-semibold text-[#319694]">University of Cabuyao</h4>
                </div>
                <p className="text-sm text-gray-700 text-center">
                  <span className="font-medium">Thesis Title:</span> Enhanced ACO and PSO for Cloud Load Balancing: A Comparative Study
                </p>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="flex justify-center gap-4"
              >
                <motion.a 
                  whileHover={{ y: -2 }}
                  href="#"
                  className="text-gray-500 hover:text-[#319694] transition-colors"
                >
                  <FaGithub className="text-xl" />
                </motion.a>
                <motion.a 
                  whileHover={{ y: -2 }}
                  href="#"
                  className="text-gray-500 hover:text-[#319694] transition-colors"
                >
                  <FaLinkedin className="text-xl" />
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AboutUsModal;
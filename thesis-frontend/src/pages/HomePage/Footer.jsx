import { motion } from 'framer-motion';
import { Cloud, ChevronUp, Users } from 'lucide-react';

const Footer = ({ footerLinks, onOpenAboutUs }) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLinkClick = (e, link) => {
    e.preventDefault(); // Prevent default behavior
    
    if (link.onClick) {
      link.onClick();
    }
    if (link.href && !link.onClick) { // Only handle href if there's no onClick
      if (link.href.startsWith('http') || link.href.startsWith('mailto')) {
        window.open(link.href, link.href.startsWith('mailto') ? '_self' : '_blank');
      } else {
        window.location.href = link.href;
      }
    }
  };

  return (
    <motion.footer
      className="bg-[#267b79] py-12 px-6 text-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Cloud className="w-8 h-8" />
            <h4 className="text-xl font-bold">Cloud Load Balancer</h4>
          </div>
          <p className="text-white/80">
            A research project comparing load balancing algorithms for cloud computing environments.
          </p>
        </motion.div>
        
        {footerLinks.map((column, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <h5 className="font-semibold mb-4">{column.title}</h5>
            <ul className="space-y-2">
              {column.links.map((link, j) => (
                <li key={j}>
                  <motion.button
                    className="text-white/80 hover:text-white transition-colors flex items-center gap-1 w-full text-left"
                    onClick={(e) => handleLinkClick(e, link)}
                    whileHover={{ x: link.href || link.onClick ? 5 : 0 }}
                    whileTap={{ scale: link.href || link.onClick ? 0.95 : 1 }}
                  >
                    {link.icon && <span className="mr-1">{link.icon}</span>}
                    {link.text}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        className="max-w-7xl mx-auto pt-8 mt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-white/70 text-sm">
          &copy; {new Date().getFullYear()} Cloud Load Balancer. All rights reserved.
        </p>
        
        <div className="flex gap-4 mt-4 md:mt-0">
          <motion.button
            onClick={onOpenAboutUs}
            className="text-white hover:text-white/80 transition-colors text-sm flex items-center gap-1"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Research Team <Users className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            onClick={scrollToTop}
            className="text-white hover:text-white/80 transition-colors text-sm flex items-center gap-1"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Top <ChevronUp className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
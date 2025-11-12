import { motion } from 'framer-motion';
import { Mail, Cloud, Server } from 'lucide-react';
import StackIcon from 'tech-stack-icons';

const Footer = ({ footerLinks }) => {

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    
    if (link.onClick) {
      link.onClick();
    }
    if (link.href && !link.onClick) {
      if (link.href.startsWith('http') || link.href.startsWith('mailto')) {
        window.open(link.href, link.href.startsWith('mailto') ? '_self' : '_blank');
      } else {
        window.location.href = link.href;
      }
    }
  };

  return (
    <footer className="bg-[#267b79] py-12 md:py-16 px-4 md:px-6 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        <div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 items-start">
              <img
                src="/logo/logo_asset.png"
                alt="Cloud Load Balancer Simulator Logo"
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
              />
              <h4 className="text-base md:text-lg font-medium tracking-wide">© 2025, Cloud Load Balancer Simulator.</h4>
            </div>
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-lg bg-sky-100 border border-sky-200 text-sky-700 font-semibold text-sm md:text-base w-fit">
                <div className="relative w-5 h-5 md:w-6 md:h-6">
                  <img
                    src="/logo/logo_asset.png"
                    alt="CloudSim Logo"
                    className="w-4 h-4 md:w-5 md:h-5 absolute top-0 left-0 object-contain"
                  />
                  <Server className="w-2.5 h-2.5 md:w-3 md:h-3 absolute bottom-0 right-0" />
                </div>
                CloudSim
              </div>
            </div>
            <div className="mt-3 md:mt-4">
              <div className="flex flex-wrap gap-2 md:gap-3">
                <StackIcon name="react" className="w-7 h-7 md:w-8 md:h-8" />
                <StackIcon name="tailwindcss" className="w-7 h-7 md:w-8 md:h-8" />
                <StackIcon name="spring" className="w-7 h-7 md:w-8 md:h-8" />
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h5 className="font-semibold mb-4 md:mb-5 text-lg md:text-xl">Know more about our system?</h5>
          <ul className="space-y-3 md:space-y-4">
            {footerLinks.map((link, i) => (
              <li key={i}>
                <motion.button
                  className="text-white/90 hover:text-white transition-colors flex items-center gap-2 md:gap-3 w-full text-left text-base md:text-lg"
                  onClick={(e) => handleLinkClick(e, link)}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.icon}
                  {link.text}
                </motion.button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 md:gap-5 rounded-xl bg-white/10 p-5 md:p-8 backdrop-blur-sm border border-white/20">
          <h5 className="font-semibold text-lg md:text-xl">Contact</h5>
          <p className="text-sm md:text-base text-white/90">
            You can request a copy of the research paper or ask further questions by contacting:
          </p>
          <div className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-lg bg-white border border-gray-200">
            <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
            <span className="text-sm md:text-base text-gray-700 font-medium break-all">larangajohndanmel31@gmail.com</span>
          </div>
           <div className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-lg bg-white border border-gray-200">
            <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
            <span className="text-sm md:text-base text-gray-700 font-medium break-all">reyeskierchristian64@gmail.com</span>
          </div>
          <div className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-lg bg-white border border-gray-200">
            <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
            <span className="text-sm md:text-base text-gray-700 font-medium break-all">violantajanalfred40@gmail.com</span>
          </div>
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;

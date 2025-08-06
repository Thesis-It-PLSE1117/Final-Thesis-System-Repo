import { motion } from 'framer-motion';
import { useMemo } from 'react';

const AnimatedBackground = () => {
  const bubbles = useMemo(() => 
    [...Array(5)].map((_, i) => ({
      id: i,
      width: Math.random() * 200 + 100,
      height: Math.random() * 200 + 100,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      yOffset: Math.random() * 50 - 25,
      xOffset: Math.random() * 50 - 25,
      duration: Math.random() * 15 + 15,
    })), []
  );

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full bg-[#319694]/5 will-change-transform"
          style={{
            width: bubble.width,
            height: bubble.height,
            top: bubble.top,
            left: bubble.left,
          }}
          animate={{
            y: [0, bubble.yOffset, 0],
            x: [0, bubble.xOffset, 0],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
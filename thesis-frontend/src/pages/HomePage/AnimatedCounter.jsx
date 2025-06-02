import { useState, useEffect } from 'react';

const AnimatedCounter = ({ from, to, duration = 2000 }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let startTimestamp;
    let requestId;

    const animate = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentCount = Math.floor(from + progress * (to - from));
      setCount(currentCount);

      if (progress < 1) {
        requestId = requestAnimationFrame(animate);
      }
    };

    requestId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(requestId);
    };
  }, [from, to, duration]);

  return <span>{count}</span>;
};

export default AnimatedCounter;
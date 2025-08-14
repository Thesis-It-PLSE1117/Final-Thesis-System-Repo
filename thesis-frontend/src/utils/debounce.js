/**
    debouncing tutorial i found in freecodecamp
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  let lastCallTime = 0;
  
  const debounced = (...args) => {
    const now = Date.now();
    
    // ignore
    if (now - lastCallTime < delay) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        func(...args);
      }, delay - (now - lastCallTime));
      return;
    }
    
    clearTimeout(timeoutId);
    lastCallTime = now;
    func(...args);
  };
  
  // cancel pending
  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };
  
  return debounced;
};

/**
 * limit to specific calls
 */
export const throttle = (func, limit = 1000) => {
  let inThrottle;
  let lastFunc;
  let lastRan;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, Math.max(limit - (Date.now() - lastRan), 0));
    }
  };
};

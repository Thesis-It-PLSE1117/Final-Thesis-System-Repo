export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    } 
  }
};

export const inputVariants = {
  focus: {
    boxShadow: "0 0 0 2px rgba(49, 150, 148, 0.3)",
    borderColor: "#319694",
    transition: { duration: 0.2 }
  }
};
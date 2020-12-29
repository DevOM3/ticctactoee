export const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.5,
    },
  },
  exit: {
    y: "-100vw",
    transition: {
      ease: "easeInOut",
    },
  },
};

export const buttonVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      type: "spring",
      ease: "easeInOut",
    },
  },
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.3,
      yoyo: Infinity,
    },
  },
};

export const backdropVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

export const modalVariants = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5,
    },
  },
};

export const passwordVariant = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transitios: {
      type: "spring",
    },
  },
};

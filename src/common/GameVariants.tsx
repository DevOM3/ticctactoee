export const centerTopVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      delay: 0.1,
      type: "tween",
      duration: 0.7,
      ease: "linear",
    },
  },
};

export const centerTopTitleVariants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      delay: 1,
      type: "spring",
      stiffness: 444,
      damping: 7.5,
      bounce: 0.44,
    },
  },
  hover: {
    scale: 1.51,
  },
};

export const centerCenterVariants = {
  initial: {
    scale: 4.44,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      delay: 3,
      type: "tween",
      ease: "linear",
    },
  },
};

export const centerBottomVariants = {
  initial: {
    scale: 0,
    y: "100vh",
  },
  animate: {
    scale: 1,
    y: 0,
    transition: {
      delay: 2.4,
      type: "spring",
      stiffness: 71,
      damping: 9.5,
    },
  },
};

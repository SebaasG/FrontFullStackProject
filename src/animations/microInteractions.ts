export const hoverScale = {
  scale: 1.05,
  transition: {
    type: 'spring',
    damping: 15,
    stiffness: 400,
  },
};

export const tapScale = {
  scale: 0.95,
  transition: {
    duration: 0.1,
  },
};

export const glowEffect = {
  boxShadow: [
    '0 0 20px rgba(0, 245, 255, 0.3)',
    '0 0 40px rgba(0, 245, 255, 0.5)',
    '0 0 20px rgba(0, 245, 255, 0.3)',
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export const rotateAnimation = {
  rotate: [0, 360],
  transition: {
    duration: 20,
    repeat: Infinity,
    ease: 'linear',
  },
};

export const shakeAnimation = {
  x: [0, -10, 10, -10, 10, 0],
  transition: {
    duration: 0.5,
  },
};

export const bounceAnimation = {
  y: [0, -20, 0],
  transition: {
    duration: 0.6,
    ease: 'easeOut',
  },
};

export const slideUpAnimation = {
  y: [100, 0],
  opacity: [0, 1],
  transition: {
    type: 'spring',
    damping: 20,
    stiffness: 300,
  },
};

export const fadeInAnimation = {
  opacity: [0, 1],
  transition: {
    duration: 0.5,
  },
};

export const morphAnimation = {
  borderRadius: ['0%', '50%', '0%'],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export const neonPulse = {
  boxShadow: [
    '0 0 5px rgba(0, 245, 255, 0.5)',
    '0 0 20px rgba(0, 245, 255, 0.8)',
    '0 0 35px rgba(0, 245, 255, 1)',
    '0 0 20px rgba(0, 245, 255, 0.8)',
    '0 0 5px rgba(0, 245, 255, 0.5)',
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export const typewriterAnimation = {
  width: ['0%', '100%'],
  transition: {
    duration: 2,
    ease: 'easeInOut',
  },
};

export const liquidAnimation = {
  borderRadius: [
    '60% 40% 30% 70%/60% 30% 70% 40%',
    '30% 60% 70% 40%/50% 60% 30% 60%',
    '60% 40% 30% 70%/60% 30% 70% 40%',
  ],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};
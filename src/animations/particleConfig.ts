import type { ISourceOptions } from '@tsparticles/engine';

export const particleConfig: ISourceOptions = {
  background: {
    color: {
      value: 'transparent',
    },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: 'push',
      },
      onHover: {
        enable: true,
        mode: 'repulse',
      },
      resize: true,
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: ['#00F5FF', '#B537F2', '#FF6B35', '#39FF14'],
    },
    links: {
      color: '#00F5FF',
      distance: 150,
      enable: true,
      opacity: 0.3,
      width: 1,
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: {
        default: 'bounce',
      },
      random: false,
      speed: 2,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
      animation: {
        enable: true,
        speed: 1,
        minimumValue: 0.1,
      },
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: { min: 1, max: 5 },
      animation: {
        enable: true,
        speed: 2,
        minimumValue: 0.1,
      },
    },
  },
  detectRetina: true,
};

export const loginParticleConfig: ISourceOptions = {
  ...particleConfig,
  particles: {
    ...particleConfig.particles,
    number: {
      density: {
        enable: true,
        area: 1200,
      },
      value: 120,
    },
    move: {
      ...particleConfig.particles?.move,
      speed: 1,
    },
    opacity: {
      value: 0.3,
      animation: {
        enable: true,
        speed: 0.5,
        minimumValue: 0.05,
      },
    },
  },
};
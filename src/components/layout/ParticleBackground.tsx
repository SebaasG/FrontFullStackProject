import React, { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Container, Engine } from '@tsparticles/engine';
import { particleConfig } from '../../animations/particleConfig';

interface ParticleBackgroundProps {
  config?: typeof particleConfig;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ 
  config = particleConfig 
}) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // Particles loaded callback
  }, []);

  const isEnabled = import.meta.env.VITE_ENABLE_PARTICLES === 'true';

  if (!isEnabled) return null;

  return (
    <div id="particles-container">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={config}
        className="absolute inset-0 -z-10"
      />
    </div>
  );
};

export default ParticleBackground;
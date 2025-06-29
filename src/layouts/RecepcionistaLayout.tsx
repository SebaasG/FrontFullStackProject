import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import ParticleBackground from '../components/layout/ParticleBackground';

interface RecepcionistaLayoutProps {
  children: React.ReactNode;
}

const RecepcionistaLayout: React.FC<RecepcionistaLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-deep via-black to-primary-deep">
      <ParticleBackground />
      
      <div className="flex">
        <Sidebar userRole="Recepcionista" />
        
        <div className="flex-1 ml-64">
          <Header />
          
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default RecepcionistaLayout;
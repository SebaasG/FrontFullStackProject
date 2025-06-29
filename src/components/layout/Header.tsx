import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, User, Settings } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

const Header: React.FC = () => {
  const { user, role } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-16 glass border-b border-white/10 flex items-center justify-between px-8"
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <Input
          placeholder="Buscar..."
          icon={<Search className="w-5 h-5" />}
          variant="glass"
          className="bg-white/5"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative p-2 text-white/70 hover:text-white transition-colors"
        >
          <Bell className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-orange rounded-full" />
        </motion.button>

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-white/70 hover:text-white transition-colors"
        >
          <Settings className="w-6 h-6" />
        </motion.button>

        {/* User Profile */}
        <motion.div
          className="flex items-center gap-3 glass px-4 py-2 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="text-sm">
            <p className="text-white font-medium">{user?.nombre || 'Usuario'}</p>
            <p className="text-white/60">{role}</p>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
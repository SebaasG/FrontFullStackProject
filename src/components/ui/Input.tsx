import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'glass';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, variant = 'default', className, ...props }, ref) => {
    const baseClasses = 'w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent';

    const variantClasses = {
      default: 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-primary-electric focus:ring-primary-electric/50',
      glass: 'glass border-white/30 text-white placeholder-white/60 focus:border-primary-electric focus:ring-primary-electric/50 backdrop-blur-md',
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        {label && (
          <label className="block text-sm font-medium text-white/90">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
              {icon}
            </div>
          )}
          
          <motion.input
            ref={ref}
            className={cn(
              baseClasses,
              variantClasses[variant],
              icon && 'pl-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/50',
              className
            )}
            whileFocus={{
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            {...props}
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-red-400 flex items-center gap-1"
          >
            <span className="w-1 h-1 bg-red-400 rounded-full" />
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
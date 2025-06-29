import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { buttonVariants } from '../../animations/pageTransitions';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';

  const variantClasses = {
    primary: 'bg-gradient-primary text-white hover:shadow-neon focus:ring-primary-electric border border-primary-electric/20',
    secondary: 'glass text-white hover:bg-white/20 focus:ring-white/50 border border-white/20',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-neon-orange focus:ring-red-500',
    success: 'bg-gradient-to-r from-accent-green to-green-500 text-black hover:shadow-neon-green focus:ring-accent-green',
    ghost: 'text-primary-electric hover:bg-primary-electric/10 focus:ring-primary-electric',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      variants={buttonVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -top-px overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:animate-shimmer" />
      </div>

      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default Button;
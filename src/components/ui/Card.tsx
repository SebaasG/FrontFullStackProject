import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { cardVariants } from '../../animations/pageTransitions';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient';
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  hover = true,
  onClick,
}) => {
  const baseClasses = 'rounded-xl border transition-all duration-300';

  const variantClasses = {
    default: 'bg-white/5 border-white/10 backdrop-blur-sm',
    glass: 'glass border-white/20',
    gradient: 'bg-gradient-card border-white/20 backdrop-blur-md',
  };

  return (
    <motion.div
      className={cn(
        baseClasses,
        variantClasses[variant],
        hover && 'hover-lift cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hover ? "hover" : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;
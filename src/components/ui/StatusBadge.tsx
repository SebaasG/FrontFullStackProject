import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export type StatusType = 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const statusConfig = {
  pendiente: { 
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', 
    icon: AlertCircle, 
    label: 'Pendiente' 
  },
  en_proceso: { 
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', 
    icon: Clock, 
    label: 'En Proceso' 
  },
  completado: { 
    color: 'bg-green-500/20 text-green-400 border-green-500/30', 
    icon: CheckCircle, 
    label: 'Completado' 
  },
  cancelado: { 
    color: 'bg-red-500/20 text-red-400 border-red-500/30', 
    icon: XCircle, 
    label: 'Cancelado' 
  }
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  showIcon = true 
}) => {
  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center gap-1 rounded-full border font-medium
        ${config.color} ${sizeClasses[size]}
      `}
    >
      {showIcon && <IconComponent className="w-3 h-3" />}
      {config.label}
    </motion.span>
  );
};

export default StatusBadge;
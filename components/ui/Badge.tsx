import React from 'react';
import { cn } from '@/lib/utils/cn';
import { EstadoConciliacion } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: EstadoConciliacion | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    'Completada': 'bg-green-100 text-green-800',
    'En Proceso': 'bg-yellow-100 text-yellow-800',
    'Error': 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}


import React from 'react';
import { cn } from '@/lib/utils/cn';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

export function Label({ children, required, className, ...props }: LabelProps) {
  return (
    <label className={cn('block text-sm font-medium text-gray-700 mb-1', className)} {...props}>
      {children}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  );
}


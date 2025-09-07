'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'interactive';
  className?: string;
  onClick?: () => void;
}

export function Card({ children, variant = 'default', className, onClick }: CardProps) {
  const baseClasses = 'glass-card p-6';
  const variantClasses = {
    default: '',
    interactive: 'glass-card-interactive'
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

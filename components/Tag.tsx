'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TagProps {
  children: ReactNode;
  variant?: 'dietary' | 'goal' | 'status';
  className?: string;
}

export function Tag({ children, variant = 'dietary', className }: TagProps) {
  const variantClasses = {
    dietary: 'tag-dietary',
    goal: 'tag-goal',
    status: 'tag-status'
  };

  return (
    <span className={cn(variantClasses[variant], className)}>
      {children}
    </span>
  );
}

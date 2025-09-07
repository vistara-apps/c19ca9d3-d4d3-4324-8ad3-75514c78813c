'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps {
  variant?: 'text' | 'textarea' | 'select';
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  options?: { value: string; label: string; }[];
  rows?: number;
  disabled?: boolean;
  required?: boolean;
}

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  InputProps
>(({ variant = 'text', className, options, rows = 4, ...props }, ref) => {
  const baseClasses = 'input-field w-full';

  if (variant === 'textarea') {
    return (
      <textarea
        ref={ref as React.Ref<HTMLTextAreaElement>}
        className={cn(baseClasses, 'resize-none', className)}
        rows={rows}
        {...props}
      />
    );
  }

  if (variant === 'select' && options) {
    return (
      <select
        ref={ref as React.Ref<HTMLSelectElement>}
        className={cn(baseClasses, className)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      ref={ref as React.Ref<HTMLInputElement>}
      type="text"
      className={cn(baseClasses, className)}
      {...props}
    />
  );
});

Input.displayName = 'Input';

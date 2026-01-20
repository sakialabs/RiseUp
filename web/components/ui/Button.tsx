'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { buttonTap } from '@/components/animations';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-earth-green text-white hover:bg-earth-green/90 focus:ring-earth-green',
      secondary: 'bg-solidarity-red text-white hover:bg-solidarity-red/90 focus:ring-solidarity-red',
      outline: 'border-2 hover:opacity-80 focus:ring-earth-green',
      ghost: 'hover:opacity-80 focus:ring-earth-green',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        whileTap={!disabled && !isLoading ? buttonTap : undefined}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

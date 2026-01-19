'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cardHover } from '@/components/animations';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export default function Card({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'md',
  hover = false
}: CardProps) {
  const variants = {
    default: 'bg-white',
    bordered: 'bg-white border border-charcoal/10',
    elevated: 'bg-white shadow-md',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <motion.div 
      className={`rounded-lg ${variants[variant]} ${paddings[padding]} ${className}`}
      whileHover={hover ? cardHover : undefined}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-xl font-bold text-charcoal ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mt-4 pt-4 border-t border-charcoal/10 ${className}`}>{children}</div>;
}

'use client';

import { motion } from 'framer-motion';

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div 
          key={i} 
          className="rounded-xl p-6 shadow-sm"
          style={{ 
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-light)'
          }}
        >
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full" 
                style={{ backgroundColor: 'var(--color-border-light)' }}
              />
              <div className="flex-1 space-y-2">
                <div 
                  className="h-4 rounded w-1/4" 
                  style={{ backgroundColor: 'var(--color-border-light)' }}
                />
                <div 
                  className="h-3 rounded w-1/6" 
                  style={{ backgroundColor: 'var(--color-border-light)' }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div 
                className="h-4 rounded w-full" 
                style={{ backgroundColor: 'var(--color-border-light)' }}
              />
              <div 
                className="h-4 rounded w-5/6" 
                style={{ backgroundColor: 'var(--color-border-light)' }}
              />
              <div 
                className="h-4 rounded w-4/6" 
                style={{ backgroundColor: 'var(--color-border-light)' }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizes[size]} rounded-full`}
        style={{
          border: '4px solid var(--color-border-light)',
          borderTopColor: '#B11226'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: 'var(--color-text-secondary)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

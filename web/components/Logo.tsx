'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 24,
    md: 32,
    lg: 40,
  };

  const dimension = sizes[size];

  return (
    <motion.div
      className="flex items-center gap-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="RiseUp Home"
    >
      <motion.div
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <img
          src="/logo.png"
          alt="RiseUp Logo"
          width={dimension}
          height={dimension}
          className="object-contain"
        />
      </motion.div>
      <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
        RiseUp
      </span>
    </motion.div>
  );
}

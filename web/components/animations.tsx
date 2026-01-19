'use client';

import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import { ReactNode } from 'react';

// Smooth, consistent animation configurations
const ANIMATION_DURATION = 0.3;
const STAGGER_DELAY = 0.08;

interface AnimationProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  delay?: number;
}

// Page transition wrapper for consistent page animations
export function PageTransition({ children, ...props }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: ANIMATION_DURATION, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Fade in animation - subtle and smooth
export function FadeIn({ children, delay = 0, ...props }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: ANIMATION_DURATION, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Slide in with fade - for cards and content blocks
export function SlideIn({ 
  children, 
  delay = 0, 
  direction = 'up', 
  ...props 
}: AnimationProps & { direction?: 'left' | 'right' | 'up' | 'down' }) {
  const directions = {
    left: { x: -20, y: 0 },
    right: { x: 20, y: 0 },
    up: { x: 0, y: 20 },
    down: { x: 0, y: -20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: ANIMATION_DURATION, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Scale in - for modals and popups
export function ScaleIn({ children, delay = 0, ...props }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: ANIMATION_DURATION, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Stagger container - for lists and grids
export function StaggerContainer({ children, staggerDelay = STAGGER_DELAY, ...props }: AnimationProps & { staggerDelay?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Stagger item - child of StaggerContainer
export function StaggerItem({ children, ...props }: AnimationProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: ANIMATION_DURATION, ease: 'easeOut' }
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Button press animation - for interactive elements
export const buttonTap = {
  scale: 0.97,
  transition: { duration: 0.1 }
};

// Card hover animation - subtle lift effect
export const cardHover = {
  y: -4,
  transition: { duration: 0.2, ease: 'easeOut' }
};

// Variants for common animations
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: ANIMATION_DURATION, ease: 'easeOut' }
  }
};

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: ANIMATION_DURATION, ease: 'easeOut' }
  }
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: ANIMATION_DURATION, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: ANIMATION_DURATION, ease: 'easeIn' }
  }
};

// Modal backdrop animation
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

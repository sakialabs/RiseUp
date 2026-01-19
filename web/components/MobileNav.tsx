'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui';

interface MobileNavProps {
  onLogout?: () => void;
}

export default function MobileNav({ onLogout }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: 'Feed', path: '/feed', icon: '📰' },
    { label: 'Events', path: '/events', icon: '📅' },
    { label: 'Unionized', path: '/unionized', icon: '⚒️' },
    { label: 'Profile', path: '/profile', icon: '👤' },
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Burger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg transition-all duration-200 hover:opacity-70 md:hidden"
        style={{ 
          backgroundColor: 'var(--color-background)',
          border: '1px solid var(--color-border-light)'
        }}
        aria-label="Toggle menu"
      >
        <svg 
          className="w-6 h-6" 
          style={{ color: 'var(--color-text-primary)' }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] z-50 shadow-2xl md:hidden overflow-y-auto"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              {/* Header */}
              <div 
                className="p-6 flex items-center justify-between"
                style={{ borderBottom: '1px solid var(--color-border-light)' }}
              >
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  RiseUp
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="p-4">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className="w-full px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 hover:shadow-md active:scale-95"
                      style={
                        isActive(item.path)
                          ? {
                              backgroundColor: 'rgba(177, 18, 38, 0.1)',
                              color: '#B11226',
                              border: '1px solid rgba(177, 18, 38, 0.3)'
                            }
                          : {
                              backgroundColor: 'var(--color-background)',
                              color: 'var(--color-text-primary)',
                              border: '1px solid var(--color-border-light)'
                            }
                      }
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div 
                  className="my-6"
                  style={{ 
                    height: '1px',
                    backgroundColor: 'var(--color-border-light)'
                  }}
                />

                {/* Additional Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleNavigate('/events/new')}
                    className="w-full px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
                    style={{
                      backgroundColor: '#B11226',
                      color: '#FFFFFF'
                    }}
                  >
                    <span className="mr-3">✨</span>
                    Create Event
                  </button>

                  {onLogout && (
                    <button
                      onClick={handleLogoutClick}
                      className="w-full px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 hover:shadow-md active:scale-95"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border-light)'
                      }}
                    >
                      <span className="mr-3">🚪</span>
                      Logout
                    </button>
                  )}
                </div>
              </nav>

              {/* Footer */}
              <div 
                className="absolute bottom-0 left-0 right-0 p-6"
                style={{ borderTop: '1px solid var(--color-border-light)' }}
              >
                <p className="text-xs text-center" style={{ color: 'var(--color-text-secondary)' }}>
                  No algorithms. No followers.<br />
                  Just people and actions.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function SearchBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // TODO: Navigate to search results page when implemented
      console.log('Searching for:', query);
      setQuery('');
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg transition-all duration-200 hover:opacity-70"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border-light)',
          color: 'var(--color-text-primary)'
        }}
        aria-label="Search"
        title="Search posts, events, and people"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Search Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-80 rounded-lg shadow-xl z-50"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)'
              }}
            >
              <form onSubmit={handleSearch} className="p-4">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search posts, events, people..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border-light)'
                    }}
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    style={{ color: 'var(--color-text-secondary)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <div className="mt-3 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  <p className="mb-2 font-medium">Search for:</p>
                  <ul className="space-y-1 ml-2">
                    <li>• Posts and updates</li>
                    <li>• Upcoming events</li>
                    <li>• Community members</li>
                  </ul>
                </div>

                <p className="mt-3 text-xs text-center" style={{ color: 'var(--color-text-secondary)' }}>
                  Press Enter to search
                </p>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

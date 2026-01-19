'use client';

import Link from 'next/link';

interface FooterProps {
  variant?: 'compact' | 'full';
}

export default function Footer({ variant = 'compact' }: FooterProps) {
  if (variant === 'full') {
    return (
      <footer 
        className="border-t"
        style={{ 
          borderColor: 'var(--color-border-light)',
          backgroundColor: 'var(--color-surface)'
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--color-text-primary)' }}>
                RiseUp Collective
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                Built for the people, by the people. Find actions, connect with organizers, and build collective power in your community.
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                Part of the{' '}
                <Link 
                  href="/sprk" 
                  className="font-medium transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  SPRK ecosystem
                </Link>
              </p>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Platform
              </h3>
              <div className="flex flex-col gap-2">
                <Link 
                  href="/feed" 
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  Community Feed
                </Link>
                <Link 
                  href="/events" 
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  Events & Actions
                </Link>
                <Link 
                  href="/unionized" 
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  Fair Work Postings
                </Link>
                <Link 
                  href="/guide" 
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  How It Works
                </Link>
              </div>
            </div>

            {/* Legal & Contact */}
            <div>
              <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Resources
              </h3>
              <div className="flex flex-col gap-2">
                <Link 
                  href="/contact" 
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  Contact Us
                </Link>
                <Link 
                  href="/privacy" 
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms" 
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t" style={{ borderColor: 'var(--color-border-light)' }}>
            <p className="text-center text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              © 2026 RiseUp Collective. Built for the people, by the people.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  // Compact variant (default for authenticated pages)
  return (
    <footer 
      className="border-t"
      style={{ 
        borderColor: 'var(--color-border-light)',
        backgroundColor: 'var(--color-surface)'
      }}
    >
      <div className="px-4 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p style={{ color: 'var(--color-text-tertiary)' }}>
            Part of the{' '}
            <Link 
              href="/sprk" 
              className="font-medium transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
            >
              SPRK ecosystem
            </Link>
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            <Link 
              href="/feed" 
              className="transition-colors"
              style={{ color: 'var(--color-text-tertiary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-tertiary)';
              }}
            >
              Feed
            </Link>
            <span style={{ color: 'var(--color-border-light)' }}>•</span>
            <Link 
              href="/events" 
              className="transition-colors"
              style={{ color: 'var(--color-text-tertiary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-tertiary)';
              }}
            >
              Events
            </Link>
            <span style={{ color: 'var(--color-border-light)' }}>•</span>
            <Link 
              href="/unionized" 
              className="transition-colors"
              style={{ color: 'var(--color-text-tertiary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-tertiary)';
              }}
            >
              Unionized
            </Link>
            <span style={{ color: 'var(--color-border-light)' }}>•</span>
            <Link 
              href="/guide" 
              className="transition-colors"
              style={{ color: 'var(--color-text-tertiary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-tertiary)';
              }}
            >
              Guide
            </Link>
            <span style={{ color: 'var(--color-border-light)' }}>•</span>
            <Link 
              href="/contact" 
              className="transition-colors"
              style={{ color: 'var(--color-text-tertiary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-tertiary)';
              }}
            >
              Contact
            </Link>
            <span style={{ color: 'var(--color-border-light)' }}>•</span>
            <Link 
              href="/privacy" 
              className="transition-colors"
              style={{ color: 'var(--color-text-tertiary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-tertiary)';
              }}
            >
              Privacy
            </Link>
            <span style={{ color: 'var(--color-border-light)' }}>•</span>
            <Link 
              href="/terms" 
              className="transition-colors"
              style={{ color: 'var(--color-text-tertiary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-tertiary)';
              }}
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

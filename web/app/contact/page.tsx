'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { PageTransition } from '@/components/animations';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function ContactPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsAuthenticated(!!token);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
        <Header showNav={false} />

        {/* Content */}
        <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Get in Touch
              </h1>
              <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                Questions, feedback, or want to contribute?
              </p>
            </div>

            <div className="p-8 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    For Contributors
                  </h2>
                  <p className="mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                    Want to help build RiseUp? Check out our GitHub repository and contribution guidelines.
                  </p>
                  <a 
                    href="https://github.com/sakialabs/RiseUp" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button>View on GitHub</Button>
                  </a>
                </div>

                <div className="pt-6" style={{ borderTop: '1px solid var(--color-border-light)' }}>
                  <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    For Organizers
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    Using RiseUp for your community work? We'd love to hear how it's going and what would make it more useful.
                  </p>
                </div>

                <div className="pt-6" style={{ borderTop: '1px solid var(--color-border-light)' }}>
                  <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    For Everyone Else
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    Questions, feedback, or just want to say hi? Reach out through GitHub issues or discussions.
                  </p>
                </div>

                <div className="pt-6" style={{ borderTop: '1px solid var(--color-border-light)' }}>
                  <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Security Issues
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    Found a security vulnerability? Please report it responsibly through GitHub's security advisory feature.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center p-6 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                RiseUp is built by people who show up and do the work.
                <br />
                Thanks for being part of it.
              </p>
            </div>
          </div>
        </main>

        <Footer variant={isAuthenticated ? 'compact' : 'full'} />
      </div>
    </PageTransition>
  );
}

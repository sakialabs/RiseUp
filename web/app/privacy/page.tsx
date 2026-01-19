'use client';

import { useState, useEffect } from 'react';
import { PageTransition } from '@/components/animations';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function PrivacyPage() {
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
            <div>
              <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Privacy Policy
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Last updated: January 2026
              </p>
            </div>

            <div className="p-8 rounded-xl space-y-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
              <section>
                <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Our Approach
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  RiseUp collects the minimum data needed to help people organize and take action together. We don't sell data, track you across the web, or use your information for advertising.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  What We Collect
                </h2>
                <div className="space-y-3" style={{ color: 'var(--color-text-secondary)' }}>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                      Account Information
                    </h3>
                    <p>Email, name, location (optional), bio (optional), and profile type when you create an account.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                      Content You Create
                    </h3>
                    <p>Posts, events, and reactions you share on the platform.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                      Usage Data
                    </h3>
                    <p>Basic logs for security and debugging (IP address, browser type, timestamps).</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  What We Don't Collect
                </h2>
                <ul className="space-y-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <li>• Tracking cookies or third-party analytics</li>
                  <li>• Behavioral data for advertising</li>
                  <li>• Location data beyond what you choose to share</li>
                  <li>• Data from other websites or apps</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  How We Use Your Data
                </h2>
                <ul className="space-y-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <li>• To provide the service (show your posts, connect you to events)</li>
                  <li>• To send important updates about your account</li>
                  <li>• To improve security and prevent abuse</li>
                  <li>• To fix bugs and improve the platform</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Who We Share With
                </h2>
                <p className="mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                  We don't sell or rent your data. We only share information when:
                </p>
                <ul className="space-y-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <li>• You make it public (posts, events, profile information)</li>
                  <li>• Required by law (court orders, legal obligations)</li>
                  <li>• Necessary to prevent harm or abuse</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Your Rights
                </h2>
                <ul className="space-y-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <li>• Access your data</li>
                  <li>• Correct inaccurate data</li>
                  <li>• Delete your account and data</li>
                  <li>• Export your content</li>
                </ul>
                <p className="mt-3" style={{ color: 'var(--color-text-secondary)' }}>
                  To exercise these rights, contact us through GitHub or your account settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Data Security
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  We use industry-standard security measures to protect your data. Passwords are hashed, connections are encrypted, and access is limited to what's necessary.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Changes to This Policy
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  We'll notify you of significant changes through the platform or email. Continued use after changes means you accept the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Questions?
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Contact us through GitHub issues or the contact page.
                </p>
              </section>
            </div>
          </div>
        </main>

        <Footer variant={isAuthenticated ? 'compact' : 'full'} />
      </div>
    </PageTransition>
  );
}

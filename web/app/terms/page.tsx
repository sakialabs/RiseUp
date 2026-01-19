'use client';

import { useState, useEffect } from 'react';
import { PageTransition } from '@/components/animations';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function TermsPage() {
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
                Terms of Service
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Last updated: January 2026
              </p>
            </div>

            <div className="p-8 rounded-xl space-y-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
              <section>
                <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  What RiseUp Is
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  RiseUp is a tool for community organizing and local action. It helps people find events, connect with others, and work together on things that matter.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Using RiseUp
                </h2>
                <div className="space-y-3" style={{ color: 'var(--color-text-secondary)' }}>
                  <p>By using RiseUp, you agree to:</p>
                  <ul className="space-y-2">
                    <li>• Be honest about who you are</li>
                    <li>• Respect other people using the platform</li>
                    <li>• Not use the platform to harm, harass, or exploit others</li>
                    <li>• Not spam, scam, or manipulate the system</li>
                    <li>• Follow local laws and regulations</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Content You Share
                </h2>
                <div className="space-y-3" style={{ color: 'var(--color-text-secondary)' }}>
                  <p>When you post content on RiseUp:</p>
                  <ul className="space-y-2">
                    <li>• You own your content</li>
                    <li>• You're responsible for what you post</li>
                    <li>• You give us permission to display it on the platform</li>
                    <li>• You confirm you have the right to share it</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  What We Don't Allow
                </h2>
                <ul className="space-y-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <li>• Harassment, threats, or hate speech</li>
                  <li>• Spam or commercial solicitation</li>
                  <li>• Impersonation or deception</li>
                  <li>• Illegal activity or content</li>
                  <li>• Attempts to break or abuse the platform</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Account Termination
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  We may suspend or terminate accounts that violate these terms or harm the community. You can delete your account anytime through your settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Disclaimers
                </h2>
                <div className="space-y-3" style={{ color: 'var(--color-text-secondary)' }}>
                  <p>
                    RiseUp is provided "as is" without warranties. We do our best to keep the platform running smoothly, but we can't guarantee it will always be available or error-free.
                  </p>
                  <p>
                    Events and content are created by users. We're not responsible for what happens at events or the accuracy of information shared.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Liability
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  We're not liable for damages arising from your use of the platform, including issues with events, interactions with other users, or technical problems.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                  Changes to These Terms
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  We may update these terms as the platform evolves. We'll notify you of significant changes. Continued use after changes means you accept the updated terms.
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

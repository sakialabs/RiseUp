'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import Footer from '@/components/Footer';
import { PageTransition, FadeIn, SlideIn, StaggerContainer, StaggerItem } from '@/components/animations';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in with a valid token
    const token = localStorage.getItem('token');
    if (token) {
      // Try to verify the token is valid by making a simple API call
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/profiles/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.ok) {
          // Token is valid, redirect to feed
          router.push('/feed');
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('token');
        }
      })
      .catch(() => {
        // Error checking token, clear it
        localStorage.removeItem('token');
      });
    }
  }, [router]);

  return (
    <PageTransition>
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      {/* Theme Toggle - Fixed top-right */}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 50 }}>
        <ThemeToggle />
      </div>

      {/* Hero Section - using surface color for visual separation */}
      <section style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-6xl mx-auto px-4 py-20">
          <FadeIn>
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-8">
              <img 
                src="/logo_animated.png" 
                alt="RiseUp Collective" 
                className="h-32 w-auto"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
              Rise Up Together
            </h1>
            <p className="text-xl md:text-2xl mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              Find people organizing in your neighborhood. Join actions that matter. Build collective power.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/auth/register">
                <Button variant="secondary" size="lg">
                  Show Up
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="primary" size="lg">
                  I'm Back
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-base" style={{ color: 'var(--color-text-tertiary)' }}>
              No algorithms. No followers. Just people and actions.
            </p>
            <div className="mt-4">
              <Link
                href="/guide"
                className="text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                New here? See how it works →
              </Link>
            </div>
          </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <SlideIn direction="up">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--color-text-primary)' }}>
          How We Work Together
        </h2>
        </SlideIn>
        <StaggerContainer>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StaggerItem>
          <div className="text-center">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Find Your People</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Connect with neighbors and organizers doing real work in your community.
            </p>
          </div>
          </StaggerItem>
          <StaggerItem>
          <div className="text-center">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Show Up</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Join actions happening near you, from mutual aid to rallies to community meetings.
            </p>
          </div>
          </StaggerItem>
          <StaggerItem>
          <div className="text-center">
            <div className="text-5xl mb-4">✊</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Build Power</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Small actions matter when people do them together. Start where you are.
            </p>
          </div>
          </StaggerItem>
        </div>
        </StaggerContainer>
      </section>

      {/* Causes Section */}
      <section style={{ backgroundColor: 'var(--color-border-light)', padding: '4rem 0' }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--color-text-primary)' }}>
            Work That Needs Doing
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              'Housing Justice',
              'Labor Rights',
              'Environmental Justice',
              'Racial Justice',
              'Economic Justice',
              'Education Equity',
              'Healthcare Access',
              'Immigrant Rights',
              'Mutual Aid',
              'Community Defense',
            ].map((cause) => (
              <div
                key={cause}
                className="rounded-lg p-4 text-center font-medium transition hover:shadow-sm"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border-light)'
                }}
              >
                {cause}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Ready to Show Up?
        </h2>
        <p className="text-xl mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          Join people organizing and taking action right where they live.
        </p>
        <Link href="/auth/register">
          <Button variant="secondary" size="lg">
            Show Up
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <Footer variant="full" />
    </div>
    </PageTransition>
  );
}

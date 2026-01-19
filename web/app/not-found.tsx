'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { PageTransition, FadeIn, SlideIn } from '@/components/animations';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function NotFound() {
  const router = useRouter();

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-background)' }}>
        {/* Theme Toggle - Fixed top-right */}
        <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 50 }}>
          <ThemeToggle />
        </div>

        <div className="max-w-2xl w-full text-center">
          <FadeIn>
            {/* Animated 404 */}
            <div className="mb-8">
              <h1 
                className="text-9xl font-bold mb-4"
                style={{ 
                  color: 'var(--color-text-primary)',
                  textShadow: '0 4px 20px rgba(177, 18, 38, 0.2)'
                }}
              >
                404
              </h1>
              {/* <div className="text-6xl mb-6">🤷</div> */}
            </div>
          </FadeIn>

          <SlideIn direction="up" delay={0.2}>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              This page doesn't exist
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
              Looks like you wandered off the path. No worries, let's get you back to organizing.
            </p>
          </SlideIn>

          <SlideIn direction="up" delay={0.4}>
            <div 
              className="rounded-xl p-8 mb-8"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)'
              }}
            >
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Where do you want to go?
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/">
                  <button
                    className="w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
                    style={{
                      backgroundColor: '#B11226',
                      color: '#FFFFFF'
                    }}
                  >
                    🏠 Home
                  </button>
                </Link>

                <Link href="/feed">
                  <button
                    className="w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md active:scale-95"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border-medium)'
                    }}
                  >
                    📰 Community Feed
                  </button>
                </Link>

                <Link href="/events">
                  <button
                    className="w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md active:scale-95"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border-medium)'
                    }}
                  >
                    📅 Browse Events
                  </button>
                </Link>

                <Link href="/guide">
                  <button
                    className="w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md active:scale-95"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border-medium)'
                    }}
                  >
                    📖 How It Works
                  </button>
                </Link>
              </div>

              <button
                onClick={() => router.back()}
                className="mt-4 text-sm hover:opacity-70 transition-opacity"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                ← Go back to previous page
              </button>
            </div>
          </SlideIn>

          <SlideIn direction="up" delay={0.6}>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Still lost? We're here to help.{' '}
              <Link href="/guide" className="underline hover:opacity-70 transition-opacity">
                Check out the guide
              </Link>
            </p>
          </SlideIn>
        </div>
      </div>
    </PageTransition>
  );
}

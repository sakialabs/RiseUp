'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { PageTransition, SlideIn } from '@/components/animations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const STEPS = [
  {
    title: 'Welcome to RiseUp',
    content: `This is a tool for organizing real action in your community. Not for scrolling, not for clout, just real people doing the work together.

We're here to help you find events, show up, and build power with others who care.`,
    emoji: '✊',
  },
  {
    title: 'How It Works',
    content: `RiseUp is simple:

• Browse events in your area
• Join actions that matter to you
• Organize your own events
• Connect with others who show up

No algorithms. No ads. No metrics. Just people and action.`,
    emoji: '🗺️',
  },
  {
    title: 'Finding Actions',
    content: `Check the Community Feed to see what's happening nearby. Use the Map to find events with locations.

Events are tagged by cause, Racial Justice, Climate Justice, Workers Rights, and more. Find what speaks to you.`,
    emoji: '📅',
  },
  {
    title: 'Showing Up',
    content: `When you find an event, tap "Join" to let organizers know you're coming. They'll see you in the attendance list.

Showing up is how we build power. One event at a time.`,
    emoji: '💪',
  },
  {
    title: 'Creating Events',
    content: `Ready to organize? Create your own event:

• Share what you're planning
• Set a time and place
• Tag the cause
• Watch people join

You don't need permission. You just need to start.`,
    emoji: '🎯',
  },
  {
    title: 'Community Guidelines',
    content: `We're building this together:

• Love: Care in action. Look out for each other.
• Solidarity: We move together. No saviors.
• Empowerment: Every voice counts.

Use "Support reactions" to show appreciation. Share posts to spread the word.`,
    emoji: '🌟',
  },
  {
    title: 'Ready to Get Started',
    content: `You're all set. Browse the feed, find an event, or create your own.

This platform is just a tool. The real work happens when you show up.

Let's build power together.`,
    emoji: '🚀',
  },
];

export default function GuidePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsAuthenticated(!!token);
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <PageTransition>
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header onLogout={handleLogout} showNav={false} />

      <div className="flex-1 max-w-2xl mx-auto px-4 py-16 w-full">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {Math.round(((currentStep + 1) / STEPS.length) * 100)}%
            </span>
          </div>
          <div style={{ height: '0.5rem', backgroundColor: 'var(--color-border-light)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              className="h-full bg-solidarity-red transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <SlideIn direction="up" key={currentStep}>
        <div style={{ 
          backgroundColor: 'var(--color-surface)', 
          borderRadius: '1rem', 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
          padding: '2rem 3rem', 
          marginBottom: '2rem',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{step.emoji}</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              {step.title}
            </h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <p style={{ color: 'var(--color-text-secondary)', whiteSpace: 'pre-line', lineHeight: '1.75' }}>
              {step.content}
            </p>
          </div>
        </div>
        </SlideIn>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrev}
            variant="outline"
            disabled={currentStep === 0}
            className="min-w-24"
            style={{ color: 'var(--color-text-primary)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                style={{
                  width: index === currentStep ? '2rem' : '0.5rem',
                  height: '0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: index === currentStep ? '#B11226' : index < currentStep ? '#B11226' : 'var(--color-border-light)',
                  opacity: index === currentStep ? 1 : index < currentStep ? 0.6 : 0.3,
                  transition: 'all 0.3s'
                }}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {isLastStep ? (
            <Link href="/feed">
              <Button className="min-w-24">
                Get Started
              </Button>
            </Link>
          ) : (
            <Button onClick={handleNext} className="min-w-24">
              Next
            </Button>
          )}
        </div>

        {/* Skip option */}
        {!isLastStep && (
          <div className="text-center mt-6">
            <Link
              href="/feed"
              className="text-sm hover:opacity-70 transition-opacity"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Skip guide
            </Link>
          </div>
        )}
      </div>

      <Footer variant={isAuthenticated ? 'compact' : 'full'} />
    </div>
    </PageTransition>
  );
}

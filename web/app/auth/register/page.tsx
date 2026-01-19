'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '@/lib/api';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PageTransition, FadeIn, ScaleIn, StaggerContainer, StaggerItem } from '@/components/animations';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    bio: '',
    location: '',
    causes: [] as string[],
    profileType: 'individual' as 'individual' | 'group',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const availableCauses = [
    'HOUSING_JUSTICE',
    'LABOR_RIGHTS',
    'ENVIRONMENTAL_JUSTICE',
    'RACIAL_JUSTICE',
    'ECONOMIC_JUSTICE',
    'EDUCATION_EQUITY',
    'HEALTHCARE_ACCESS',
    'IMMIGRANT_RIGHTS',
    'MUTUAL_AID',
    'COMMUNITY_DEFENSE',
    'DISABILITY_JUSTICE',
    'INDIGENOUS_RIGHTS',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (formData.causes.length === 0) {
      setError('Please select at least one cause');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        causes: formData.causes,
        profile_type: formData.profileType,
      });

      // Store token
      localStorage.setItem('token', response.access_token);

      // Redirect to feed
      router.push('/feed');
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Extract meaningful error message
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const detail = err.response.data?.detail;
        
        if (typeof detail === 'string') {
          // Simple string error
          if (detail.toLowerCase().includes('email')) {
            errorMessage = 'This email is already registered. Try logging in instead.';
          } else {
            errorMessage = detail;
          }
        } else if (Array.isArray(detail)) {
          // Handle validation errors from FastAPI
          errorMessage = detail.map((e: any) => e.msg || e.message).join(', ');
        } else if (err.response.status === 409) {
          errorMessage = 'This email is already registered. Try logging in instead.';
        } else if (err.response.status === 400) {
          errorMessage = 'Invalid registration data. Please check your information.';
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'Cannot connect to server. Please check your connection and try again.';
      } else {
        // Something happened in setting up the request
        errorMessage = err.message || 'Registration failed. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleCause = (cause: string) => {
    setFormData(prev => ({
      ...prev,
      causes: prev.causes.includes(cause)
        ? prev.causes.filter(c => c !== cause)
        : [...prev.causes, cause],
    }));
  };

  const formatCause = (cause: string) => {
    return cause
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <PageTransition>
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }} className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Theme Toggle - Fixed top-right */}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 50 }}>
        <ThemeToggle />
      </div>

      {/* Back Button - Fixed top-left */}
      <div style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 50 }}>
        <Link href="/">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-light)',
              color: 'var(--color-text-primary)'
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
        </Link>
      </div>

      <div className="max-w-2xl w-full space-y-8">
        <FadeIn>
        <div>
          <div className="flex justify-center mb-6">
            <img 
              src="/logo_animated.png" 
              alt="RiseUp Collective" 
              className="h-24 w-auto"
            />
          </div>
          <h1 className="text-4xl font-bold text-center" style={{ color: 'var(--color-text-primary)' }}>
            Join the Cause
          </h1>
          <p className="mt-2 text-center" style={{ color: 'var(--color-text-secondary)' }}>
            Find your people. Take action. Build power together.
          </p>
        </div>
        </FadeIn>

        <ScaleIn delay={0.1}>
        <form style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }} className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  x: [0, -10, 10, -10, 10, 0]
                }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ 
                  opacity: { duration: 0.2 },
                  y: { duration: 0.2 },
                  x: { duration: 0.4 }
                }}
                style={{
                  backgroundColor: 'rgba(177, 18, 38, 0.1)',
                  border: '1px solid #B11226',
                  color: '#B11226',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.375rem'
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Profile Type */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Profile Type
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, profileType: 'individual' })}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '2px solid',
                  borderColor: formData.profileType === 'individual' ? '#2F5D3A' : 'var(--color-border-light)',
                  backgroundColor: formData.profileType === 'individual' ? 'rgba(47, 93, 58, 0.05)' : 'transparent',
                  color: formData.profileType === 'individual' ? '#2F5D3A' : 'var(--color-text-primary)',
                  transition: 'all 0.2s'
                }}
              >
                Individual
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, profileType: 'group' })}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '2px solid',
                  borderColor: formData.profileType === 'group' ? '#2F5D3A' : 'var(--color-border-light)',
                  backgroundColor: formData.profileType === 'group' ? 'rgba(47, 93, 58, 0.05)' : 'transparent',
                  color: formData.profileType === 'group' ? '#2F5D3A' : 'var(--color-text-primary)',
                  transition: 'all 0.2s'
                }}
              >
                Organization/Collective
              </button>
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--color-border-light)',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text-primary)'
              }}
              className="focus:outline-none focus:ring-2 focus:ring-earth-green"
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Name {formData.profileType === 'group' && '(Organization/Collective)'}
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--color-border-light)',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text-primary)'
              }}
              className="focus:outline-none focus:ring-2 focus:ring-earth-green"
            />
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text-primary)'
                }}
                className="focus:outline-none focus:ring-2 focus:ring-earth-green"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text-primary)'
                }}
                className="focus:outline-none focus:ring-2 focus:ring-earth-green"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Location
            </label>
            <input
              id="location"
              type="text"
              required
              placeholder="City, State or Neighborhood"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--color-border-light)',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text-primary)'
              }}
              className="focus:outline-none focus:ring-2 focus:ring-earth-green"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Bio
            </label>
            <textarea
              id="bio"
              rows={3}
              placeholder="Tell us about yourself or your organization..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--color-border-light)',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text-primary)',
                resize: 'none'
              }}
              className="focus:outline-none focus:ring-2 focus:ring-earth-green"
            />
          </div>

          {/* Causes */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Causes You Care About *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableCauses.map((cause) => (
                <button
                  key={cause}
                  type="button"
                  onClick={() => toggleCause(cause)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    borderRadius: '0.5rem',
                    border: '1px solid',
                    borderColor: formData.causes.includes(cause) ? '#2F5D3A' : 'var(--color-border-light)',
                    backgroundColor: formData.causes.includes(cause) ? '#2F5D3A' : 'transparent',
                    color: formData.causes.includes(cause) ? '#FAF9F6' : 'var(--color-text-primary)',
                    transition: 'all 0.2s'
                  }}
                >
                  {formatCause(cause)}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-earth-green hover:bg-earth-green/90 py-3 px-4 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: '#FAF9F6' }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/auth/login" className="text-solidarity-red hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </form>
        </ScaleIn>
      </div>
    </div>
    </PageTransition>
  );
}

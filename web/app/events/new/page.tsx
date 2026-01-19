'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { eventAPI } from '@/lib/api';
import { Button, Input, Textarea } from '@/components/ui';
import { PageTransition, FadeIn } from '@/components/animations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const causes = [
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
  'FOOD_SOVEREIGNTY',
  'INDIGENOUS_RIGHTS',
];

export default function CreateEventPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    latitude: '',
    longitude: '',
    tags: [] as string[],
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    if (!token) {
      setLoading(false);
      return;
    }

    const cachedProfile = localStorage.getItem('cached_profile');
    if (cachedProfile) {
      try {
        setProfile(JSON.parse(cachedProfile));
      } catch (e) {
        console.error('Failed to load profile:', e);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    const eventDate = new Date(formData.event_date);
    if (eventDate < new Date()) {
      setError('Event date must be in the future');
      return;
    }

    if (formData.tags.length === 0) {
      setError('Please select at least one cause/tag');
      return;
    }

    setSubmitting(true);

    try {
      const eventData: any = {
        title: formData.title,
        description: formData.description,
        event_date: formData.event_date,
        location: formData.location,
        tags: formData.tags,
      };

      // Add optional fields
      if (formData.latitude && formData.longitude) {
        eventData.latitude = parseFloat(formData.latitude);
        eventData.longitude = parseFloat(formData.longitude);
      }

      await eventAPI.create(eventData);
      router.push(`/events`);
    } catch (err: any) {
      console.error('Event creation error:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to create event. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const formatLabel = (str: string) => {
    return str
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <PageTransition>
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header onLogout={handleLogout} showSearch userName={profile?.name} avatarUrl={profile?.avatar_url} />

      {loading ? (
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center" style={{ color: 'var(--color-text-secondary)' }}>
            Loading...
          </div>
        </main>
      ) : !isAuthenticated ? (
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12 flex items-center">
          <FadeIn>
          <div 
            className="text-center py-16 rounded-xl w-full"
            style={{ 
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-light)'
            }}
          >
            <div className="text-6xl mb-6">✨</div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Sign In to Create Events
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              Join RiseUp to organize actions, create events, and mobilize your community.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => router.push('/auth/register')}
              >
                Show Up
              </Button>
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => router.push('/auth/login')}
              >
                Sign In
              </Button>
            </div>
          </div>
          </FadeIn>
        </main>
      ) : (
        <main className="max-w-4xl mx-auto px-4 py-6">
        <FadeIn>
        <div className="rounded-xl p-8" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Event Details</h2>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 px-4 py-3 rounded-lg"
              style={{ 
                backgroundColor: 'rgba(177, 18, 38, 0.1)', 
                border: '1px solid #B11226',
                color: '#B11226'
              }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Event Title <span className="text-solidarity-red">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Community Organizing Workshop"
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border-light)'
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Description <span className="text-solidarity-red">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell people what this event is about..."
                className="w-full px-4 py-3 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-earth-green transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border-light)',
                  minHeight: '100px'
                }}
              />
            </div>

            {/* Event Date & Time */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Event Date & Time <span className="text-solidarity-red">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border-light)'
                }}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Location <span className="text-solidarity-red">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="123 Main St, City, State or Community Center"
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border-light)'
                }}
              />
            </div>

            {/* Tags/Causes */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
                Related Causes <span className="text-solidarity-red">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {causes.map((cause) => (
                  <button
                    key={cause}
                    type="button"
                    onClick={() => toggleTag(cause)}
                    className="py-2 px-3 text-sm rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95"
                    style={
                      formData.tags.includes(cause)
                        ? {
                            borderColor: '#B11226',
                            backgroundColor: '#B11226',
                            color: '#FFFFFF'
                          }
                        : {
                            borderColor: 'var(--color-border-medium)',
                            backgroundColor: 'var(--color-background)',
                            color: 'var(--color-text-primary)'
                          }
                    }
                  >
                    {formatLabel(cause)}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={submitting}
                className="transition-all duration-200 hover:shadow-lg active:scale-95"
              >
                {submitting ? 'Creating...' : 'Create Event'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/events')}
                className="transition-all duration-200 hover:shadow-md active:scale-95"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
        </FadeIn>
      </main>
      )}

      <Footer />
    </div>
    </PageTransition>
  );
}

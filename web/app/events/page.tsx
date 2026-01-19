'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { eventAPI } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent, Avatar, Badge, Button } from '@/components/ui';
import EventMap from '@/components/EventMap';
import { FadeIn, StaggerContainer, StaggerItem, PageTransition } from '@/components/animations';
import { LoadingSkeleton } from '@/components/loading';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
  latitude: number;
  longitude: number;
  creator_id: number;
  attendee_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    if (token) {
      loadEvents();
      loadProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loadProfile = async () => {
    try {
      const cachedProfile = localStorage.getItem('cached_profile');
      if (cachedProfile) {
        setProfile(JSON.parse(cachedProfile));
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await eventAPI.list();
      setEvents(response.data);
    } catch (err: any) {
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendance = async (eventId: number, currentlyAttending: boolean) => {
    try {
      if (currentlyAttending) {
        await eventAPI.leave(eventId);
      } else {
        await eventAPI.join(eventId);
      }
      loadEvents();
    } catch (err) {
      console.error('Failed to update attendance:', err);
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatTag = (tag: string) => {
    return tag
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <header style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-light)' }} className="sticky top-0 z-10 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Events</h1>
            </div>
          </div>
        </header>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageTransition>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
        <Header showSearch />
        
        <main className="flex-1 max-w-6xl mx-auto px-4 py-12 flex items-center">
          <FadeIn>
          <div 
            className="text-center py-16 rounded-xl w-full"
            style={{ 
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-light)'
            }}
          >
            <div className="text-6xl mb-6">📅</div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Find Actions Near You
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              Join rallies, workshops, mutual aid events, and community meetings. See what's happening and show up.
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
        
        <Footer variant="full" />
      </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header showSearch userName={profile?.name} avatarUrl={profile?.avatar_url} />

      {/* View Toggle */}
      <div className="max-w-6xl mx-auto px-4 py-4 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Upcoming Events</h2>
          <div className="flex gap-3 flex-wrap items-center">
            {/* View Mode Toggle Group */}
            <div className="flex gap-2 p-1 rounded-lg" style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border-light)' }}>
              <button
                onClick={() => setViewMode('list')}
                className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:opacity-80 active:scale-95"
                style={
                  viewMode === 'list'
                    ? {
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-primary)',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                      }
                    : {
                        backgroundColor: 'transparent',
                        color: 'var(--color-text-secondary)'
                      }
                }
              >
                📋 List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:opacity-80 active:scale-95"
                style={
                  viewMode === 'map'
                    ? {
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text-primary)',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                      }
                    : {
                        backgroundColor: 'transparent',
                        color: 'var(--color-text-secondary)'
                      }
                }
              >
                🗺️ Map
              </button>
            </div>

            {/* Create Event Button */}
            <FadeIn>
              <button
                onClick={() => router.push('/events/new')}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-lg active:scale-95 whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border-light)'
                }}
              >
                ✨ Create Event
              </button>
            </FadeIn>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-6 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
            <p className="text-solidarity-red mb-4">{error}</p>
            <Button onClick={loadEvents}>
              Retry
            </Button>
          </div>
        )}
      </div>

      {/* Content Area - Full width for map, constrained for list */}
      <div className="flex-1">
      {viewMode === 'list' ? (
        <div className="max-w-6xl mx-auto px-4 pb-4">
          <StaggerContainer>
            {events.length === 0 ? (
              <FadeIn>
                <div className="md:col-span-2 text-center py-16 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>No upcoming events yet</h3>
                  <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                    Be the first to organize an action in your community.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => router.push('/events/new')}
                    className="transition-all duration-200 hover:shadow-lg"
                  >
                    ➕ Create Event
                  </Button>
                </div>
              </FadeIn>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((event) => (
                  <StaggerItem key={event.id}>
                    <div className="h-full rounded-xl p-6 hover:shadow-lg transition-all duration-200" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
                      <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex flex-wrap gap-1">
                            {event.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="primary">
                                {formatTag(tag)}
                              </Badge>
                            ))}
                            {event.tags.length > 2 && (
                              <Badge variant="default">
                                +{event.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            {event.attendee_count} attending
                          </span>
                        </div>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{event.title}</h3>
                      </div>

                      <div>
                        <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>{event.description}</p>

                        <div className="space-y-2 text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                          <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span>{formatEventDate(event.event_date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>📍</span>
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>👥</span>
                            <span>{event.attendee_count} attending</span>
                          </div>
                        </div>

                        <Button
                          variant="primary"
                          fullWidth
                          onClick={() => router.push(`/events/${event.id}`)}
                          className="transition-all duration-200 hover:shadow-md active:scale-95"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            )}
          </StaggerContainer>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 pb-4">
          <FadeIn>
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
              <EventMap />
            </div>
          </FadeIn>
        </div>
      )}
      </div>

      <Footer />
    </div>
    </PageTransition>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { profileAPI, authAPI } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent, Avatar, Badge, Button } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem, PageTransition } from '@/components/animations';
import { LoadingSkeleton } from '@/components/loading';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

interface Profile {
  id: number;
  user_id: number;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  profile_type: string;
  causes: string[];
  created_at: string;
  updated_at: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
  attendee_count: number;
  tags: string[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [attendingEvents, setAttendingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadProfile();
  }, [router]);

  const loadProfile = async () => {
    try {
      const [profileResponse, eventsResponse] = await Promise.all([
        profileAPI.getMyProfile(),
        profileAPI.getMyAttendingEvents()
      ]);
      setProfile(profileResponse.data);
      setAttendingEvents(eventsResponse.data);
      // Cache profile for header
      localStorage.setItem('cached_profile', JSON.stringify(profileResponse.data));
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/login');
      } else {
        setError('Failed to load profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cached_profile');
    router.push('/');
  };

  const formatCause = (cause: string) => {
    return cause
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <header style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-light)' }} className="sticky top-0 z-10 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Profile</h1>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="max-w-md p-6 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
          <p className="text-solidarity-red mb-4">{error || 'Profile not found'}</p>
          <Button onClick={loadProfile} fullWidth>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header onLogout={handleLogout} showSearch userName={profile?.name} avatarUrl={profile?.avatar_url} />

      {/* Profile Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <StaggerContainer className="space-y-6">
          {/* Profile Header Card */}
          <StaggerItem>
            <div className="p-8 rounded-xl hover:shadow-xl transition-shadow duration-200" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {profile.avatar_url ? (
                  <div 
                    className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-background)' }}
                  >
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <Avatar name={profile.name} size="xl" />
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{profile.name}</h2>
                    <Badge variant={profile.profile_type === 'individual' ? 'default' : 'primary'}>
                      {profile.profile_type === 'individual' ? 'Individual' : 'Organization'}
                    </Badge>
                  </div>
                  <p className="mb-1" style={{ color: 'var(--color-text-secondary)' }}>{profile.email}</p>
                  {profile.location && (
                    <p className="flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
                      📍 {profile.location}
                    </p>
                  )}
                  <p className="text-sm mt-2 flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
                    <span>📅</span>
                    <span>Member since {formatDate(profile.created_at)}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="primary" 
                    onClick={() => router.push('/profile/edit')}
                    className="transition-all duration-200 hover:shadow-lg active:scale-95"
                  >
                    ✏️ Edit Profile
                  </Button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2.5 text-base font-medium rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
                    style={{
                      border: '2px solid #B11226',
                      color: '#B11226',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#B11226';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#B11226';
                    }}
                  >
                    👋 Sign Out
                  </button>
                </div>
              </div>

              {profile.bio && (
                <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--color-border-light)' }}>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>About</h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{profile.bio}</p>
                </div>
              )}
            </div>
          </StaggerItem>

          {/* Causes Card */}
          {profile.causes && profile.causes.length > 0 && (
            <StaggerItem>
              <div className="p-6 rounded-xl hover:shadow-lg transition-shadow duration-200" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Causes I Care About</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.causes.map((cause) => (
                    <Badge key={cause} variant="primary" size="lg">
                      {formatCause(cause)}
                    </Badge>
                  ))}
                </div>
              </div>
            </StaggerItem>
          )}

          {/* My Events Card */}
          <StaggerItem>
            <div className="p-6 rounded-xl hover:shadow-lg transition-shadow duration-200" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Events I'm Attending</h3>
              {attendingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-5xl mb-3">📅</p>
                  <p className="mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                    You haven't joined any events yet
                  </p>
                  <button
                    onClick={() => router.push('/events')}
                    className="text-sm font-medium hover:underline"
                    style={{ color: '#2F5D3A' }}
                  >
                    Browse events →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {attendingEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => router.push(`/events`)}
                      className="w-full p-4 rounded-lg transition-all duration-200 hover:shadow-md active:scale-[0.99] text-left"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        border: '1px solid var(--color-border-light)'
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold mb-1 truncate" style={{ color: 'var(--color-text-primary)' }}>
                            {event.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            <span className="flex items-center gap-1">
                              📅 {formatEventDate(event.event_date)}
                            </span>
                            <span className="flex items-center gap-1">
                              👥 {event.attendee_count} attending
                            </span>
                          </div>
                          {event.location && (
                            <p className="text-sm mt-1 truncate" style={{ color: 'var(--color-text-secondary)' }}>
                              📍 {event.location}
                            </p>
                          )}
                        </div>
                        <svg 
                          className="w-5 h-5 flex-shrink-0 mt-1" 
                          style={{ color: 'var(--color-text-secondary)' }}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </StaggerItem>

          {/* Actions Card */}
          <StaggerItem>
            <div className="p-6 rounded-xl hover:shadow-lg transition-shadow duration-200" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => router.push('/guide')}
                  className="flex items-center gap-3 p-4 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95 text-left"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    border: '1px solid var(--color-border-light)'
                  }}
                >
                  <span className="text-2xl">📖</span>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Guide</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Learn how to use RiseUp</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/events')}
                  className="flex items-center gap-3 p-4 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95 text-left"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    border: '1px solid var(--color-border-light)'
                  }}
                >
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Browse Events</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Find actions nearby</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/feed')}
                  className="flex items-center gap-3 p-4 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95 text-left"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    border: '1px solid var(--color-border-light)'
                  }}
                >
                  <span className="text-2xl">📰</span>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Community Feed</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>See what's happening</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/unionized')}
                  className="flex items-center gap-3 p-4 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95 text-left"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    border: '1px solid var(--color-border-light)'
                  }}
                >
                  <span className="text-2xl">⚒️</span>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>Unionized</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Find fair work</p>
                  </div>
                </button>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </main>
      <Footer />
    </div>
    </PageTransition>
  );
}

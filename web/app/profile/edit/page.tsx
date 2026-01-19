'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { profileAPI } from '@/lib/api';
import { Button } from '@/components/ui';
import { PageTransition, FadeIn } from '@/components/animations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { motion } from 'framer-motion';

const CAUSES = [
  'RACIAL_JUSTICE',
  'CLIMATE_JUSTICE',
  'WORKERS_RIGHTS',
  'HOUSING_JUSTICE',
  'EDUCATION_ACCESS',
  'HEALTHCARE_FOR_ALL',
  'LGBTQ_RIGHTS',
  'IMMIGRANT_RIGHTS',
  'FOOD_SECURITY',
  'DISABILITY_RIGHTS',
  'FOOD_SOVEREIGNTY',
  'INDIGENOUS_RIGHTS',
];

const AVATARS = Array.from({ length: 20 }, (_, i) => `/avatars/avatar${i + 1}.png`);

export default function EditProfilePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<any>(null);

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
      const response = await profileAPI.getMyProfile();
      const profileData = response.data;
      setProfile(profileData);
      setName(profileData.name);
      setBio(profileData.bio || '');
      setLocation(profileData.location || '');
      setAvatarUrl(profileData.avatar_url || '');
      setSelectedCauses(profileData.causes || []);
      // Cache profile for header
      localStorage.setItem('cached_profile', JSON.stringify(profileData));
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/login');
      } else {
        setError('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  const toggleCause = (cause: string) => {
    if (selectedCauses.includes(cause)) {
      setSelectedCauses(selectedCauses.filter(c => c !== cause));
    } else {
      setSelectedCauses([...selectedCauses, cause]);
    }
  };

  const formatCause = (cause: string) => {
    return cause
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (selectedCauses.length === 0) {
      setError('Please select at least one cause');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await profileAPI.updateProfile({
        name: name.trim(),
        bio: bio.trim() || null,
        location: location.trim() || null,
        avatar_url: avatarUrl || null,
        causes: selectedCauses,
      });

      // Update cached profile
      const updatedProfile = {
        ...profile,
        name: name.trim(),
        bio: bio.trim() || null,
        location: location.trim() || null,
        avatar_url: avatarUrl || null,
        causes: selectedCauses,
      };
      localStorage.setItem('cached_profile', JSON.stringify(updatedProfile));
      
      // Dispatch custom event to notify Header component
      window.dispatchEvent(new Event('profileUpdated'));

      router.push('/profile');
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-solidarity-red mx-auto mb-4"></div>
          <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
        <Header onLogout={handleLogout} showSearch userName={profile?.name} avatarUrl={profile?.avatar_url} />

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 py-6">
          <FadeIn>
            <div className="mb-6">
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Profile
              </button>
            </div>

            <div className="rounded-xl p-6 sm:p-8" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
              <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Edit Profile</h1>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-lg"
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
                {/* Avatar Selector */}
                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                    Choose Avatar
                  </label>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                    {AVATARS.map((avatar) => (
                      <motion.button
                        key={avatar}
                        type="button"
                        onClick={() => setAvatarUrl(avatar)}
                        className="relative rounded-full overflow-hidden transition-all duration-200"
                        style={{
                          backgroundColor: 'var(--color-background)',
                          border: avatarUrl === avatar ? '3px solid #2F5D3A' : '2px solid var(--color-border-light)',
                          boxShadow: avatarUrl === avatar ? '0 0 0 4px rgba(47, 93, 58, 0.2)' : 'none'
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Image
                          src={avatar}
                          alt="Avatar option"
                          width={60}
                          height={60}
                          className="w-full h-full object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Name <span className="text-solidarity-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green transition-all duration-200"
                    style={{ 
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border-light)'
                    }}
                    placeholder="Your name or organization"
                    disabled={saving}
                    required
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-earth-green transition-all duration-200"
                    style={{ 
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border-light)'
                    }}
                    placeholder="Tell us about yourself and what drives you..."
                    rows={4}
                    disabled={saving}
                    maxLength={500}
                  />
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>{bio.length}/500 characters</p>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green transition-all duration-200"
                    style={{ 
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border-light)'
                    }}
                    placeholder="City, State or Region"
                    disabled={saving}
                  />
                </div>

                {/* Causes */}
                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                    Causes I Care About <span className="text-solidarity-red">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CAUSES.map((cause) => (
                      <button
                        key={cause}
                        type="button"
                        onClick={() => toggleCause(cause)}
                        disabled={saving}
                        className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                        style={
                          selectedCauses.includes(cause)
                            ? {
                                backgroundColor: '#2F5D3A',
                                color: '#FFFFFF'
                              }
                            : {
                                backgroundColor: 'var(--color-background)',
                                border: '1px solid #2F5D3A',
                                color: '#2F5D3A'
                              }
                        }
                      >
                        {formatCause(cause)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/profile')}
                    disabled={saving}
                    fullWidth
                    className="transition-all duration-200 hover:opacity-70"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={saving}
                    fullWidth
                    className="transition-all duration-200 hover:shadow-lg active:scale-95"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>
          </FadeIn>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}

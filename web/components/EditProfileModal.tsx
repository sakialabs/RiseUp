'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, Button } from './ui';
import { ScaleIn, backdropVariants } from './animations';

interface Profile {
  name: string;
  bio?: string;
  location?: string;
  causes: string[];
  profile_type: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: () => void;
  currentProfile: Profile;
}

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
];

export default function EditProfileModal({ isOpen, onClose, onProfileUpdated, currentProfile }: EditProfileModalProps) {
  const [name, setName] = useState(currentProfile.name);
  const [bio, setBio] = useState(currentProfile.bio || '');
  const [location, setLocation] = useState(currentProfile.location || '');
  const [selectedCauses, setSelectedCauses] = useState<string[]>(currentProfile.causes || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(currentProfile.name);
      setBio(currentProfile.bio || '');
      setLocation(currentProfile.location || '');
      setSelectedCauses(currentProfile.causes || []);
      setError('');
    }
  }, [isOpen, currentProfile]);

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

    setLoading(true);
    setError('');

    try {
      const { profileAPI } = await import('@/lib/api');
      await profileAPI.updateProfile({
        name: name.trim(),
        bio: bio.trim() || null,
        location: location.trim() || null,
        causes: selectedCauses,
      });

      onProfileUpdated();
      onClose();
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <ScaleIn onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <div 
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Edit Profile</h2>
                  <button
                    onClick={onClose}
                    className="text-3xl hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--color-text-secondary)' }}
                    disabled={loading}
                  >
                    ×
                  </button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-lg"
                    style={{ 
                      backgroundColor: 'rgba(177, 18, 38, 0.1)', 
                      border: '1px solid #B11226',
                      color: '#B11226'
                    }}
                  >
                    <p className="text-sm">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Name <span className="text-solidarity-red">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green transition-all duration-200"
                      style={{ 
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-text-primary)',
                        border: '1px solid var(--color-border-light)'
                      }}
                      placeholder="Your name or organization"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-earth-green transition-all duration-200"
                      style={{ 
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-text-primary)',
                        border: '1px solid var(--color-border-light)'
                      }}
                      placeholder="Tell us about yourself and what drives you..."
                      rows={4}
                      disabled={loading}
                      maxLength={500}
                    />
                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>{bio.length}/500 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-green transition-all duration-200"
                      style={{ 
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-text-primary)',
                        border: '1px solid var(--color-border-light)'
                      }}
                      placeholder="City, State or Region"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Causes I Care About <span className="text-solidarity-red">*</span>
                      <span className="text-xs font-normal ml-2" style={{ color: 'var(--color-text-secondary)' }}>(select at least one)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CAUSES.map((cause) => (
                        <button
                          key={cause}
                          type="button"
                          onClick={() => toggleCause(cause)}
                          disabled={loading}
                          className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
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

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={loading}
                      fullWidth
                      className="transition-all duration-200 hover:opacity-70"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      fullWidth
                      className="transition-all duration-200 hover:shadow-lg active:scale-95"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </ScaleIn>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

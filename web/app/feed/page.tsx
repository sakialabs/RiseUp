'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { feedAPI, reactionAPI, postAPI } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent, Avatar, Badge, Button, Tooltip } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem, PageTransition } from '@/components/animations';
import { LoadingSkeleton } from '@/components/loading';
import { SearchBar } from '@/components/SearchBar';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedItem {
  id: number;
  type: 'event' | 'post';
  creator: {
    id: number;
    name: string;
    profile_type: string;
    avatar_url?: string;
  };
  text?: string;
  title?: string;
  description?: string;
  event_date?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
  created_at: string;
  reactions?: {
    reaction_type: string;
    count: number;
    user_reacted: boolean;
  }[];
  attendee_count?: number;
}

const reactionEmojis: Record<string, { emoji: string; label: string }> = {
  solidarity: { emoji: '✊', label: 'Solidarity' },
  care: { emoji: '💚', label: 'Care' },
  respect: { emoji: '🙏', label: 'Respect' },
  gratitude: { emoji: '🌟', label: 'Gratitude' },
};

export default function FeedPage() {
  const router = useRouter();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  // Composer state
  const [postText, setPostText] = useState('');
  const [postError, setPostError] = useState('');
  const [posting, setPosting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxChars = 500;
  const remainingChars = maxChars - postText.length;

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    if (token) {
      loadFeed();
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

  const loadFeed = async () => {
    try {
      const response = await feedAPI.get();
      setFeed(response.data);
    } catch (err: any) {
      setError('Failed to load feed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setPostError('Image must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreatePost = async () => {
    setPostError('');

    if (postText.length > maxChars) {
      setPostError(`Post must be ${maxChars} characters or less`);
      return;
    }

    if (postText.trim().length === 0) {
      setPostError('Post cannot be empty');
      return;
    }

    setPosting(true);

    try {
      await postAPI.create({ text: postText.trim() });
      setPostText('');
      setImagePreview(null);
      setPostError('');
      loadFeed();
    } catch (err: any) {
      setPostError(err.response?.data?.detail || 'Failed to create post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  const handleReaction = async (item: FeedItem, reactionType: string) => {
    try {
      const targetType = item.type === 'event' ? 'EVENT' : 'POST';
      
      console.log('=== REACTION CLICK ===');
      console.log('Item:', item.id, item.type);
      console.log('Reaction type:', reactionType);
      console.log('Current reactions:', item.reactions);
      
      // Check if user already reacted with this type
      const existingReaction = item.reactions?.find(
        r => r.reaction_type === reactionType && r.user_reacted
      );
      
      console.log('Existing reaction:', existingReaction);

      // Optimistically update UI
      setFeed(prevFeed => 
        prevFeed.map(feedItem => {
          if (feedItem.id === item.id && feedItem.type === item.type) {
            const updatedReactions = feedItem.reactions ? [...feedItem.reactions] : [];
            
            // If clicking the same reaction, remove it
            if (existingReaction) {
              console.log('Removing existing reaction');
              return {
                ...feedItem,
                reactions: updatedReactions.map(r => 
                  r.reaction_type === reactionType 
                    ? { ...r, user_reacted: false, count: Math.max(0, r.count - 1) }
                    : r
                ).filter(r => r.count > 0)
              };
            }
            
            // Switch to new reaction (remove old, add new)
            console.log('Adding/switching reaction');
            const newReactions = updatedReactions.map(r => ({
              ...r,
              user_reacted: r.reaction_type === reactionType,
              count: r.reaction_type === reactionType 
                ? r.count + 1 
                : (r.user_reacted ? Math.max(0, r.count - 1) : r.count)
            })).filter(r => r.count > 0);
            
            // Add new reaction if it doesn't exist
            if (!newReactions.find(r => r.reaction_type === reactionType)) {
              newReactions.push({
                reaction_type: reactionType,
                count: 1,
                user_reacted: true
              });
            }
            
            console.log('New reactions:', newReactions);
            return { ...feedItem, reactions: newReactions };
          }
          return feedItem;
        })
      );

      if (existingReaction) {
        // Clicking same reaction - remove it
        console.log('API: Removing reaction');
        await reactionAPI.remove(targetType.toLowerCase(), item.id);
      } else {
        // Add or update reaction (backend handles switching automatically)
        console.log('API: Adding/updating reaction');
        await reactionAPI.add({
          target_type: targetType.toLowerCase(),
          target_id: item.id,
          reaction_type: reactionType.toLowerCase(),
        });
      }

      console.log('API call successful, refreshing feed...');
      // Refresh to get accurate data from backend
      await loadFeed();
      console.log('Feed refreshed');
    } catch (err) {
      console.error('Failed to update reaction:', err);
      // Revert on error
      loadFeed();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
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

  const formatTag = (tag: string) => {
    return tag
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="max-w-3xl mx-auto px-4">
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
        
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12 flex items-center">
          <FadeIn>
          <div 
            className="text-center py-16 rounded-xl w-full"
            style={{ 
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-light)'
            }}
          >
            <div className="text-6xl mb-6">📰</div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Join the Community Feed
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              See what's happening in your community. Share updates, organize actions, and connect with people doing real work.
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="max-w-md p-6 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
          <p className="text-solidarity-red mb-4">{error}</p>
          <Button onClick={loadFeed} fullWidth>
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

      {/* Feed */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Inline Post Composer */}
        <FadeIn>
          <div 
            className="rounded-xl p-4 sm:p-6 mb-6 shadow-sm"
            style={{ 
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-light)'
            }}
          >
            <h2 className="text-base sm:text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Share with your community
            </h2>

            {postError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm"
                style={{ 
                  backgroundColor: 'rgba(177, 18, 38, 0.1)', 
                  border: '1px solid #B11226',
                  color: '#B11226'
                }}
              >
                {postError}
              </motion.div>
            )}

            <textarea
              ref={textareaRef}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="What's happening in your community? Share an update, ask for help, or organize action..."
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg resize-none text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-earth-green"
              style={{ 
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border-light)'
              }}
            />

            {/* Image Preview */}
            <AnimatePresence>
              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 relative rounded-lg overflow-hidden"
                  style={{ border: '1px solid var(--color-border-light)' }}
                >
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full max-h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
                    aria-label="Remove image"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mt-4">
              <div className="flex items-center gap-3">
                {/* Image Upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="p-2 rounded-lg cursor-pointer transition-all duration-200 hover:opacity-70"
                  style={{ 
                    backgroundColor: 'var(--color-background)',
                    border: '1px solid var(--color-border-light)'
                  }}
                  title="Add image (coming soon)"
                >
                  <svg className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </label>

                {/* Character Counter */}
                <span 
                  className="text-sm font-medium"
                  style={{ 
                    color: remainingChars < 50 ? '#B11226' : 'var(--color-text-secondary)' 
                  }}
                >
                  {remainingChars}
                </span>
              </div>

              {/* Post Button */}
              <Button 
                onClick={handleCreatePost}
                disabled={postText.trim().length === 0 || posting}
                isLoading={posting}
                className="w-full sm:w-auto transition-all duration-200 hover:shadow-lg active:scale-95"
                style={{
                  backgroundColor: postText.trim().length === 0 ? 'var(--color-border-medium)' : '#B11226',
                  color: '#FFFFFF'
                }}
              >
                {posting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </FadeIn>

        {/* Feed Items */}
        <StaggerContainer className="space-y-4">
          {feed.length === 0 ? (
            <StaggerItem>
              <div 
                className="text-center py-12 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border-light)'
                }}
              >
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  Your feed is empty
                </h3>
                <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                  Start by joining events or creating posts to connect with your community.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button onClick={() => router.push('/events')}>
                    Browse Events
                  </Button>
                </div>
              </div>
            </StaggerItem>
          ) : (
            feed.map((item) => (
              <StaggerItem key={`${item.type}-${item.id}`}>
                <div 
                  className="rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200"
                  style={{ 
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border-light)'
                  }}
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    {item.creator?.avatar_url ? (
                      <div 
                        className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: 'var(--color-background)' }}
                      >
                        <img
                          src={item.creator.avatar_url}
                          alt={item.creator.name || 'User'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <Avatar name={item.creator?.name || 'Unknown'} size="md" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
                        {item.creator?.name || 'Unknown User'}
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                    {item.type === 'event' && item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="primary" className="flex-shrink-0">
                            {formatTag(tag)}
                          </Badge>
                        ))}
                        {item.tags.length > 2 && (
                          <Badge variant="default" className="flex-shrink-0">
                            +{item.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    {item.type === 'event' ? (
                      <>
                        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                          {item.title}
                        </h3>
                        <p className="mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                          {item.description}
                        </p>
                        <div className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span>{formatEventDate(item.event_date || '')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>📍</span>
                            <span>{item.location}</span>
                          </div>
                          {item.attendee_count !== undefined && (
                            <div className="flex items-center gap-2">
                              <span>👥</span>
                              <span>{item.attendee_count} attending</span>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="whitespace-pre-wrap text-base leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                        {item.text}
                      </p>
                    )}
                  </div>

                  {/* Reactions */}
                  <div className="pt-4" style={{ borderTop: '1px solid var(--color-border-light)' }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      {Object.entries(reactionEmojis).map(([type, { emoji, label }]) => {
                        const reaction = item.reactions?.find(r => r.reaction_type === type);
                        const count = reaction?.count || 0;
                        const userReacted = reaction?.user_reacted || false;

                        return (
                          <Tooltip key={type} content={label}>
                            <motion.button
                              onClick={() => handleReaction(item, type)}
                              className={`px-3 py-1.5 rounded-full border-2 transition-all duration-200 ${
                                userReacted ? 'shadow-md' : ''
                              }`}
                              style={
                                userReacted
                                  ? {
                                      borderColor: '#2F5D3A',
                                      backgroundColor: 'rgba(47, 93, 58, 0.2)',
                                      color: '#2F5D3A'
                                    }
                                  : {
                                      borderColor: 'var(--color-border-medium)',
                                      color: 'var(--color-text-secondary)',
                                      backgroundColor: 'var(--color-background)'
                                    }
                              }
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              aria-label={label}
                            >
                              <span className="text-base">{emoji}</span>
                            </motion.button>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))
          )}
        </StaggerContainer>
      </main>
      <Footer />
    </div>
    </PageTransition>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import MobileNav from './MobileNav';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { Avatar } from './ui';

interface HeaderProps {
  onLogout?: () => void;
  showNav?: boolean;
  showSearch?: boolean;
  userName?: string;
  avatarUrl?: string;
}

export default function Header({ onLogout, showNav = true, showSearch = false, userName, avatarUrl: propAvatarUrl }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileName, setProfileName] = useState(userName || '');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(propAvatarUrl);

  useEffect(() => {
    // Check authentication
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsAuthenticated(!!token);

    // Fetch user profile name and avatar if authenticated
    if (showNav && token) {
      // Always update from props if provided
      if (userName) {
        setProfileName(userName);
      }
      if (propAvatarUrl !== undefined) {
        setAvatarUrl(propAvatarUrl);
      }
      
      // If no props provided, try to get cached profile data
      if (!userName || propAvatarUrl === undefined) {
        const cachedProfile = localStorage.getItem('cached_profile');
        if (cachedProfile) {
          try {
            const profile = JSON.parse(cachedProfile);
            if (!userName) {
              setProfileName(profile.name || 'User');
            }
            if (propAvatarUrl === undefined) {
              setAvatarUrl(profile.avatar_url);
            }
          } catch (e) {
            if (!userName) {
              setProfileName('User');
            }
          }
        } else if (!userName) {
          setProfileName('User');
        }
      }
    }

    // Listen for storage changes (when profile is updated in another component)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cached_profile' && e.newValue) {
        try {
          const profile = JSON.parse(e.newValue);
          if (!userName) {
            setProfileName(profile.name || 'User');
          }
          if (propAvatarUrl === undefined) {
            setAvatarUrl(profile.avatar_url);
          }
        } catch (err) {
          console.error('Failed to parse profile update:', err);
        }
      }
    };

    // Also listen for custom events (for same-tab updates)
    const handleProfileUpdate = () => {
      const cachedProfile = localStorage.getItem('cached_profile');
      if (cachedProfile) {
        try {
          const profile = JSON.parse(cachedProfile);
          if (!userName) {
            setProfileName(profile.name || 'User');
          }
          if (propAvatarUrl === undefined) {
            setAvatarUrl(profile.avatar_url);
          }
        } catch (err) {
          console.error('Failed to parse profile update:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [userName, propAvatarUrl, showNav]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('token');
      router.push('/auth/login');
    }
  };

  const handleLogoClick = () => {
    // Check if user is authenticated
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      // Authenticated: go to feed
      router.push('/feed');
    } else {
      // Not authenticated: go to home
      router.push('/');
    }
  };

  const navItems = [
    { label: 'Feed', path: '/feed' },
    { label: 'Events', path: '/events' },
    { label: 'Unionized', path: '/unionized' },
  ];

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showDropdown]);

  return (
    <header 
      style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-light)' }} 
      className="sticky top-0 z-10 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo */}
          <div onClick={handleLogoClick} className="cursor-pointer">
            <Logo size="md" />
          </div>
          
          {/* Center: Desktop Navigation */}
          {showNav && (
            <nav className="hidden md:flex gap-1 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`px-4 py-2 rounded-lg text-sm font-${isActive(item.path) ? 'semibold' : 'medium'} transition-all duration-200 hover:bg-opacity-100 active:scale-95`}
                  style={
                    isActive(item.path)
                      ? {
                          color: 'var(--color-text-primary)',
                          backgroundColor: 'rgba(47, 93, 58, 0.1)',
                          border: '1px solid rgba(47, 93, 58, 0.3)'
                        }
                      : {
                          color: 'var(--color-text-secondary)',
                          backgroundColor: 'transparent'
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.backgroundColor = 'var(--color-background)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}

          {/* Right: Search, Theme Toggle, Profile Dropdown/Sign In, Mobile Menu */}
          <div className="flex items-center gap-2">
            {showSearch && <SearchBar />}
            <ThemeToggle iconOnly />
            {showNav && (
              <>
                {isAuthenticated ? (
                  <>
                    {/* Desktop Profile Dropdown */}
                    <div className="hidden md:block relative profile-dropdown">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:opacity-80 active:scale-95"
                    style={{
                      backgroundColor: pathname === '/profile' ? 'rgba(47, 93, 58, 0.1)' : 'transparent',
                      border: '1px solid var(--color-border-light)'
                    }}
                    aria-label="Profile menu"
                  >
                    {avatarUrl ? (
                      <div 
                        className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-background)' }}
                      >
                        <img
                          src={avatarUrl}
                          alt={profileName || 'User'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <Avatar name={profileName || 'User'} size="sm" />
                    )}
                    <svg 
                      className="w-4 h-4 transition-transform duration-200" 
                      style={{ 
                        color: 'var(--color-text-secondary)',
                        transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'
                      }} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div 
                      className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border-light)',
                        zIndex: 50
                      }}
                    >
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          router.push('/profile');
                        }}
                        className="w-full px-4 py-3 text-left transition-all duration-200 hover:bg-opacity-80 flex items-center gap-2"
                        style={{
                          color: 'var(--color-text-primary)',
                          backgroundColor: pathname === '/profile' ? 'var(--color-background)' : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (pathname !== '/profile') {
                            e.currentTarget.style.backgroundColor = 'var(--color-background)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (pathname !== '/profile') {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm font-medium">Profile</span>
                      </button>
                      <div style={{ borderTop: '1px solid var(--color-border-light)' }} />
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          handleLogout();
                        }}
                        className="w-full px-4 py-3 text-left transition-all duration-200 hover:bg-opacity-80 flex items-center gap-2"
                        style={{
                          color: '#B11226',
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(177, 18, 38, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                  <MobileNav onLogout={handleLogout} />
                </div>
              </>
            ) : (
              /* Sign In Button for unauthenticated users */
              <button
                onClick={() => router.push('/auth/login')}
                className="hidden md:block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md active:scale-95"
                style={{
                  backgroundColor: '#2F5D3A',
                  color: 'white'
                }}
              >
                Sign In
              </button>
            )}
          </>
        )}
      </div>
        </div>
      </div>
    </header>
  );
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { unionizedAPI } from '@/lib/api'
import { FairWorkPosting, EmploymentType, UnionStatus } from '@/types'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { PageTransition, FadeIn } from '@/components/animations'
import { motion, AnimatePresence } from 'framer-motion'

export default function UnionizedPage() {
  const router = useRouter()
  const [postings, setPostings] = useState<FairWorkPosting[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [selectedPosting, setSelectedPosting] = useState<FairWorkPosting | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    location: '',
    employment_type: '' as EmploymentType | '',
    union_status: '' as UnionStatus | '',
  })

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsAuthenticated(!!token);
    
    loadPostings()
    if (token) {
      loadProfile()
    }
  }, [filters])

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

  const loadPostings = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (filters.location) params.location = filters.location
      if (filters.employment_type) params.employment_type = filters.employment_type
      if (filters.union_status) params.union_status = filters.union_status
      
      const response = await unionizedAPI.list(params)
      setPostings(response.data)
    } catch (error) {
      console.error('Failed to load postings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/auth/login')
  }

  const getUnionBadgeVariant = (status: UnionStatus) => {
    if (status === 'unionized') return 'success'
    if (status === 'union-friendly') return 'primary'
    return 'default'
  }

  const getUnionLabel = (status: UnionStatus) => {
    if (status === 'unionized') return 'Unionized'
    if (status === 'union-friendly') return 'Union-Friendly'
    return 'Not Listed'
  }

  const getEmploymentLabel = (type: EmploymentType) => {
    if (type === 'full-time') return 'Full-Time'
    if (type === 'part-time') return 'Part-Time'
    if (type === 'contract') return 'Contract'
    return 'Gig'
  }

  const filteredPostings = postings.filter(posting => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      posting.title.toLowerCase().includes(query) ||
      posting.organization.toLowerCase().includes(query) ||
      posting.description.toLowerCase().includes(query)
    )
  })

  const clearFilters = () => {
    setFilters({
      location: '',
      employment_type: '',
      union_status: '',
    })
    setSearchQuery('')
  }

  const hasActiveFilters = filters.location || filters.employment_type || filters.union_status || searchQuery

  return (
    <PageTransition>
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header onLogout={handleLogout} showSearch avatarUrl={profile?.avatar_url} />

      {/* Compact Header with Info Button */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Fair Work Postings
            </h1>
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-2 rounded-full transition-all duration-200 hover:bg-opacity-80"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)',
                color: 'var(--color-text-secondary)'
              }}
              aria-label="About Unionized"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <p className="text-sm hidden sm:block" style={{ color: 'var(--color-text-secondary)' }}>
            {filteredPostings.length} {filteredPostings.length === 1 ? 'posting' : 'postings'}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                style={{ color: 'var(--color-text-secondary)' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by title, organization, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-earth-green"
                style={{ 
                  border: '1px solid var(--color-border-light)', 
                  backgroundColor: 'var(--color-background)', 
                  color: 'var(--color-text-primary)' 
                }}
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="flex-1 min-w-[150px] px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-earth-green"
                style={{ 
                  border: '1px solid var(--color-border-light)', 
                  backgroundColor: 'var(--color-background)', 
                  color: 'var(--color-text-primary)' 
                }}
              />
              <select
                value={filters.employment_type}
                onChange={(e) => setFilters({ ...filters, employment_type: e.target.value as EmploymentType | '' })}
                className="flex-1 min-w-[150px] px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-earth-green appearance-none"
                style={{ 
                  border: '1px solid var(--color-border-light)', 
                  backgroundColor: 'var(--color-background)', 
                  color: 'var(--color-text-primary)',
                  paddingRight: '2.5rem',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25rem'
                }}
              >
                <option value="">All Types</option>
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="gig">Gig</option>
              </select>
              <select
                value={filters.union_status}
                onChange={(e) => setFilters({ ...filters, union_status: e.target.value as UnionStatus | '' })}
                className="flex-1 min-w-[150px] px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-earth-green appearance-none"
                style={{ 
                  border: '1px solid var(--color-border-light)', 
                  backgroundColor: 'var(--color-background)', 
                  color: 'var(--color-text-primary)',
                  paddingRight: '2.5rem',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25rem'
                }}
              >
                <option value="">All Union Status</option>
                <option value="unionized">Unionized</option>
                <option value="union-friendly">Union-Friendly</option>
                <option value="not-listed">Not Listed</option>
              </select>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    border: '1px solid var(--color-border-light)',
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Postings List */}
        {loading ? (
          <div className="text-center py-12" style={{ color: 'var(--color-text-secondary)' }}>Loading...</div>
        ) : filteredPostings.length === 0 ? (
          <div className="text-center py-12 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
            <p className="text-5xl mb-3">⚒️</p>
            <p className="mb-2" style={{ color: 'var(--color-text-primary)' }}>
              {postings.length === 0 ? 'No postings yet' : 'No results found'}
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {postings.length === 0 ? 'Check back soon for fair work opportunities' : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPostings.map((posting) => (
              <FadeIn key={posting.id}>
                <button
                  onClick={() => setSelectedPosting(posting)}
                  className="w-full text-left p-6 rounded-xl hover:shadow-lg transition-all duration-200"
                  style={{ 
                    backgroundColor: 'var(--color-surface)', 
                    border: '1px solid var(--color-border-light)' 
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                        {posting.title}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{posting.organization}</p>
                    </div>
                    <Badge variant={getUnionBadgeVariant(posting.union_status)}>
                      {getUnionLabel(posting.union_status)}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-3">
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>📍 {posting.location}</span>
                    <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>💼 {getEmploymentLabel(posting.employment_type)}</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>💰 {posting.wage_text}</span>
                  </div>

                  <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                    {posting.description}
                  </p>

                  <span className="text-sm font-medium" style={{ color: '#2F5D3A' }}>
                    View Details →
                  </span>
                </button>
              </FadeIn>
            ))}
          </div>
        )}
      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowInfoModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setShowInfoModal(false)}
            >
              <div
                className="max-w-2xl w-full rounded-xl p-8 max-h-[80vh] overflow-y-auto"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    About Unionized
                  </h2>
                  <button
                    onClick={() => setShowInfoModal(false)}
                    className="p-2 rounded-lg transition-opacity hover:opacity-70"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Work with dignity
                    </h3>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                      This isn't a job board. It's a worker-first space for finding fair work with transparent wages and real worker protection.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      What makes work fair
                    </h3>
                    <ul className="space-y-2" style={{ color: 'var(--color-text-secondary)' }}>
                      <li>• Transparent wages (no hiding behind "competitive compensation")</li>
                      <li>• Union presence or worker-friendly policies</li>
                      <li>• Clear terms and no dark patterns</li>
                      <li>• Respect for workers as people, not leads</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      Why it's here
                    </h3>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                      RiseUp is about collective power. That includes the workplace. Fair pay, clear terms, and worker protections aren't luxuries—they're the baseline.
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <Button onClick={() => setShowInfoModal(false)} fullWidth>
                    Got it
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Posting Detail Modal */}
        {selectedPosting && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedPosting(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedPosting(null)}
            >
              <div
                className="max-w-3xl w-full rounded-xl p-8 max-h-[85vh] overflow-y-auto"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1 pr-4">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      {selectedPosting.title}
                    </h2>
                    <p className="text-lg mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                      {selectedPosting.organization}
                    </p>
                    <Badge variant={getUnionBadgeVariant(selectedPosting.union_status)}>
                      {getUnionLabel(selectedPosting.union_status)}
                    </Badge>
                  </div>
                  <button
                    onClick={() => setSelectedPosting(null)}
                    className="p-2 rounded-lg transition-opacity hover:opacity-70 flex-shrink-0"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
                  <div>
                    <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>Location</p>
                    <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>📍 {selectedPosting.location}</p>
                  </div>
                  <div>
                    <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>Employment Type</p>
                    <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>💼 {getEmploymentLabel(selectedPosting.employment_type)}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>Wage</p>
                    <p className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>💰 {selectedPosting.wage_text}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                    About the Position
                  </h3>
                  <p className="whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {selectedPosting.description}
                  </p>
                </div>

                {/* Worker Notes */}
                {selectedPosting.worker_notes && (
                  <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border-light)' }}>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                      <span>✊</span> Worker Notes
                    </h3>
                    <p className="whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {selectedPosting.worker_notes}
                    </p>
                  </div>
                )}

                {/* Posted Date */}
                <div className="mb-6">
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Posted on {new Date(selectedPosting.posted_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                {/* Apply Button */}
                {selectedPosting.application_url ? (
                  <Button 
                    onClick={() => window.open(selectedPosting.application_url, '_blank')}
                    fullWidth
                  >
                    Apply Now →
                  </Button>
                ) : (
                  <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--color-background)' }}>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                      Contact {selectedPosting.organization} directly to apply
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer variant={isAuthenticated ? 'compact' : 'full'} />
    </div>
    </PageTransition>
  )
}

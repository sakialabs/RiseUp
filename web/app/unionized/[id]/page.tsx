'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { unionizedAPI } from '@/lib/api'
import { FairWorkPosting, EmploymentType, UnionStatus } from '@/types'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export default function UnionizedDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [posting, setPosting] = useState<FairWorkPosting | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosting()
  }, [params.id])

  const loadPosting = async () => {
    try {
      setLoading(true)
      const response = await unionizedAPI.get(Number(params.id))
      setPosting(response.data)
    } catch (error) {
      console.error('Failed to load posting:', error)
    } finally {
      setLoading(false)
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    )
  }

  if (!posting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted mb-4">Posting not found</p>
          <Link href="/unionized">
            <Button variant="outline">Back to Unionized</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/unionized" className="text-sm text-muted hover:text-foreground mb-6 inline-block">
          ← Back to listings
        </Link>

        <Card className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {posting.title}
              </h1>
              <p className="text-lg text-muted">{posting.organization}</p>
            </div>
            <Badge variant={getUnionBadgeVariant(posting.union_status)} size="lg">
              {getUnionLabel(posting.union_status)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
            <div>
              <p className="text-sm text-muted mb-1">Location</p>
              <p className="text-foreground">{posting.location}</p>
            </div>
            <div>
              <p className="text-sm text-muted mb-1">Employment Type</p>
              <p className="text-foreground">{getEmploymentLabel(posting.employment_type)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted mb-1">Wage</p>
              <p className="text-lg font-semibold text-foreground">{posting.wage_text}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">Description</h2>
            <p className="text-muted whitespace-pre-wrap">{posting.description}</p>
          </div>

          {posting.worker_notes && (
            <div className="mb-6 p-4 bg-surface border border-border rounded-lg">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                What workers should know
              </h3>
              <p className="text-sm text-muted whitespace-pre-wrap">{posting.worker_notes}</p>
            </div>
          )}

          {posting.application_url && (
            <div className="flex gap-3">
              <a
                href={posting.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="primary" fullWidth>
                  Learn More
                </Button>
              </a>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted">
              Posted {new Date(posting.posted_date).toLocaleDateString()}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

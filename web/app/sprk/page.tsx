'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { PageTransition } from '@/components/animations';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function SPRKPage() {
  const router = useRouter();

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
        <Header showNav={false} />

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-12">
            {/* Hero */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                The SPRK Ecosystem
              </h1>
              <p className="text-xl" style={{ color: 'var(--color-text-secondary)' }}>
                Community tools for dignity, care, and power
              </p>
            </div>

            {/* What is SPRK */}
            <section className="p-8 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                What is SPRK?
              </h2>
              <div className="space-y-4" style={{ color: 'var(--color-text-secondary)' }}>
                <p>
                  SPRK is not a product or platform. It's the connective layer that holds community tools together through shared principles.
                </p>
                <p>
                  Most tools drift. They start with good intentions, then chase growth, metrics, and engagement. They become platforms that serve themselves instead of the people using them.
                </p>
                <p>
                  SPRK exists to prevent that drift.
                </p>
              </div>
            </section>

            {/* Core Principles */}
            <section className="p-8 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
                Core Principles
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    People Over Platforms
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    The work matters more than the tool. No growth hacking, no engagement optimization, no dark patterns.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Action Over Metrics
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    We care about what people do, not what they post. No follower counts, no like counts, no engagement scores.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Calm Over Urgency
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    People stay involved when they feel steady, not overwhelmed. No outrage farming, no notification spam.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Dignity Over Growth
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    Every person deserves respect, clarity, and fair treatment. Wage transparency, clear language, accessible by default.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Systems Over Hype
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    We build for the long term, not the news cycle. Quiet, steady work.
                  </p>
                </div>
              </div>
            </section>

            {/* The Tools */}
            <section className="p-8 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
                The Tools
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    RiseUp Collective
                  </h3>
                  <p className="mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                    Community organizing and local action. Find events, join actions, build power together.
                  </p>
                  <Link href="/feed">
                    <Button>Explore RiseUp</Button>
                  </Link>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Unionized
                  </h3>
                  <p className="mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                    Worker dignity and fair work. Find jobs with transparent wages and real worker protection.
                  </p>
                  <Link href="/unionized">
                    <Button>Browse Fair Work</Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* What We'll Never Do */}
            <section className="p-8 rounded-xl" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                What We'll Never Do
              </h2>
              <ul className="space-y-2" style={{ color: 'var(--color-text-secondary)' }}>
                <li>• Optimize for engagement over usefulness</li>
                <li>• Add follower counts or like counts</li>
                <li>• Use algorithms to rank or recommend content</li>
                <li>• Implement viral growth mechanics</li>
                <li>• Hide wages behind applications</li>
                <li>• Burn people out to prove commitment</li>
                <li>• Make the platform more important than the work</li>
              </ul>
              <p className="mt-4 font-medium" style={{ color: 'var(--color-text-primary)' }}>
                If we ever do these things, we've lost the point.
              </p>
            </section>

            {/* Learn More */}
            <section className="text-center">
              <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                Want to learn more or contribute?
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a 
                  href="https://github.com/sakialabs/RiseUp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">View on GitHub</Button>
                </a>
                <Link href="/contact">
                  <Button variant="outline">Get in Touch</Button>
                </Link>
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}

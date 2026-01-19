"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PageTransition, FadeIn, ScaleIn } from "@/components/animations";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem("token", response.access_token);
      router.push("/feed");
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Extract meaningful error message
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        const detail = err.response.data?.detail;
        
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = detail.map((e: any) => e.msg || e.message).join(', ');
        } else if (err.response.status === 401) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (err.response.status === 404) {
          errorMessage = 'Account not found. Please check your email or sign up.';
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'Cannot connect to server. Please check your connection and try again.';
      } else {
        // Something happened in setting up the request
        errorMessage = err.message || 'Login failed. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }} className="flex items-center justify-center p-4">
      {/* Theme Toggle - Fixed top-right */}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 50 }}>
        <ThemeToggle />
      </div>

      {/* Back Button - Fixed top-left */}
      <div style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 50 }}>
        <Link href="/">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-light)',
              color: 'var(--color-text-primary)'
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>
        </Link>
      </div>

      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <FadeIn>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/logo_animated.png" 
              alt="RiseUp Collective" 
              className="h-24 w-auto"
            />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Ready to show up and do the work
          </p>
        </div>
        </FadeIn>

        {/* Login Form */}
        <ScaleIn delay={0.1}>
        <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Welcome Back</h2>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  x: [0, -10, 10, -10, 10, 0]
                }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ 
                  opacity: { duration: 0.2 },
                  y: { duration: 0.2 },
                  x: { duration: 0.4 }
                }}
                style={{
                  backgroundColor: 'rgba(177, 18, 38, 0.1)',
                  border: '1px solid #B11226',
                  color: '#B11226',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.375rem',
                  marginBottom: '1rem'
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: '0.375rem',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text-primary)'
                }}
                className="focus:outline-none focus:ring-2 focus:ring-earth-green"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: '0.375rem',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text-primary)'
                }}
                className="focus:outline-none focus:ring-2 focus:ring-earth-green"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-earth-green hover:bg-earth-green/90 text-paper font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-solidarity-red hover:text-solidarity-red/80 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
        </ScaleIn>

        {/* Footer */}
        <FadeIn delay={0.2}>
        <div className="text-center mt-8 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
          <p>Built with 💖 for people who want to build a better world</p>
        </div>
        </FadeIn>
      </div>
    </div>
    </PageTransition>
  );
}

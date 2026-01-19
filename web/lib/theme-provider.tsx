'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme, getThemeCSSVariables } from './theme';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'riseup-theme';

/**
 * ThemeProvider
 * Manages theme state and persistence
 * Reference: docs/styles.md - Dual-mode support
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    // Initialize theme from localStorage or system preference
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;

        if (stored === 'light' || stored === 'dark') {
            setThemeState(stored);
        } else {
            // Detect system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setThemeState(prefersDark ? 'dark' : 'light');
        }

        setMounted(true);
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        const variables = getThemeCSSVariables(theme);

        // Apply CSS custom properties
        Object.entries(variables).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });

        // Update data-theme attribute for CSS selectors
        root.setAttribute('data-theme', theme);

        // Persist preference
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme, mounted]);

    const toggleTheme = () => {
        setThemeState(prev => prev === 'light' ? 'dark' : 'light');
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    // Prevent flash of wrong theme
    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * useTheme Hook
 * Access theme context in components
 */
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

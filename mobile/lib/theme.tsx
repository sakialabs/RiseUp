/**
 * RiseUp Collective - Mobile Theme System
 * Implements dual-mode theming as specified in docs/styles.md
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export type Theme = 'light' | 'dark';

/**
 * Light Mode Palette
 * Purpose: Reading, browsing, daytime use, printing
 */
export const LightMode = {
    background: '#FAF9F6',      // Paper White
    surface: '#FFFFFF',         // Pure white
    text: {
        primary: '#1C1C1C',       // Charcoal Black
        secondary: '#5F5F5F',     // Muted Gray
        tertiary: 'rgba(28, 28, 28, 0.5)',
        inverse: '#FAF9F6',
    },
    border: {
        light: 'rgba(28, 28, 28, 0.1)',
        medium: 'rgba(28, 28, 28, 0.2)',
    },
};

/**
 * Dark Mode Palette
 * Purpose: Night use, long sessions, reduced eye strain
 */
export const DarkMode = {
    background: '#121212',      // Charcoal Dark
    surface: '#1E1E1E',         // Soft Charcoal
    text: {
        primary: '#EDEBE7',       // Paper Off-White
        secondary: '#A0A0A0',     // Muted Light Gray
        tertiary: 'rgba(237, 235, 231, 0.5)',
        inverse: '#121212',
    },
    border: {
        light: 'rgba(237, 235, 231, 0.1)',
        medium: 'rgba(237, 235, 231, 0.2)',
    },
};

/**
 * Accent Colors (Shared Across Modes)
 */
export const Accents = {
    solidarityRed: '#B11226',
    earthGreen: '#2F5D3A',
    sunYellow: '#E0B400',
};

/**
 * Get colors for current theme
 */
export function getThemeColors(theme: Theme) {
    const mode = theme === 'light' ? LightMode : DarkMode;
    return {
        ...mode,
        ...Accents,
        white: '#FFFFFF',
        black: '#000000',
        transparent: 'transparent',
    };
}

interface ThemeContextType {
    theme: Theme;
    colors: ReturnType<typeof getThemeColors>;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = '@riseup:theme';

/**
 * ThemeProvider for React Native
 * Manages theme state with AsyncStorage persistence
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
    const systemColorScheme = useColorScheme();
    const [theme, setThemeState] = useState<Theme>('light');

    // Load saved theme or use system preference
    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            if (saved === 'light' || saved === 'dark') {
                setThemeState(saved);
            } else {
                // Use system preference
                setThemeState(systemColorScheme === 'dark' ? 'dark' : 'light');
            }
        } catch (error) {
            console.error('Failed to load theme:', error);
            setThemeState('light');
        }
    };

    const setTheme = async (newTheme: Theme) => {
        try {
            setThemeState(newTheme);
            await AsyncStorage.setItem(STORAGE_KEY, newTheme);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    const colors = getThemeColors(theme);

    return (
        <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * useTheme Hook
 */
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

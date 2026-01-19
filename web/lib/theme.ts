/**
 * RiseUp Collective - Theme System
 * Implements dual-mode theming as specified in docs/styles.md
 */

export type Theme = 'light' | 'dark';

/**
 * Light Mode Palette
 * Purpose: Reading, browsing, daytime use, printing
 */
export const lightMode = {
    // Core Colors
    background: '#FAF9F6',      // Paper White - page backgrounds, cards
    surface: '#FFFFFF',         // Pure white for elevated surfaces
    text: {
        primary: '#1C1C1C',       // Charcoal Black - body text, headlines, icons
        secondary: '#5F5F5F',     // Muted Gray - metadata, timestamps
        tertiary: 'rgba(28, 28, 28, 0.5)',
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
export const darkMode = {
    // Core Colors
    background: '#121212',      // Charcoal Dark - page backgrounds, app shell
    surface: '#1E1E1E',         // Soft Charcoal - cards, modals, inputs
    text: {
        primary: '#EDEBE7',       // Paper Off-White - body text, headlines
        secondary: '#A0A0A0',     // Muted Light Gray - metadata, timestamps
        tertiary: 'rgba(237, 235, 231, 0.5)',
    },
    border: {
        light: 'rgba(237, 235, 231, 0.1)',
        medium: 'rgba(237, 235, 231, 0.2)',
    },
};

/**
 * Accent Colors (Shared Across Modes)
 * Use sparingly - one accent max per screen
 */
export const accents = {
    solidarityRed: '#B11226',   // Primary CTAs, urgent actions
    earthGreen: '#2F5D3A',      // Mutual aid, community care
    sunYellow: '#E0B400',       // Highlights, small emphasis
};

/**
 * Typography
 * Same across both modes
 */
export const typography = {
    family: {
        regular: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'Space Grotesk, Inter, sans-serif',
    },
    size: {
        xs: '0.8125rem',    // 13px
        sm: '0.875rem',     // 14px
        base: '1rem',       // 16px
        lg: '1.125rem',     // 18px
        xl: '1.25rem',      // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '1.875rem',  // 30px
        '4xl': '2.25rem',   // 36px
    },
    weight: {
        regular: '400',
        medium: '500',
        semiBold: '600',
        bold: '700',
        extraBold: '800',
    },
    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.6,
    },
};

/**
 * Get theme tokens based on current mode
 */
export function getThemeTokens(theme: Theme) {
    const modeColors = theme === 'light' ? lightMode : darkMode;

    return {
        colors: {
            ...modeColors,
            ...accents,
        },
        typography,
    };
}

/**
 * CSS Custom Properties for theming
 * Apply these to :root or a container element
 */
export function getThemeCSSVariables(theme: Theme): Record<string, string> {
    const mode = theme === 'light' ? lightMode : darkMode;

    return {
        // Backgrounds
        '--color-background': mode.background,
        '--color-surface': mode.surface,

        // Text
        '--color-text-primary': mode.text.primary,
        '--color-text-secondary': mode.text.secondary,
        '--color-text-tertiary': mode.text.tertiary,

        // Borders
        '--color-border-light': mode.border.light,
        '--color-border-medium': mode.border.medium,

        // Accents
        '--color-solidarity-red': accents.solidarityRed,
        '--color-earth-green': accents.earthGreen,
        '--color-sun-yellow': accents.sunYellow,
    };
}

/**
 * Tailwind CSS theme configuration
 */
export const tailwindTheme = {
    colors: {
        // Dynamic colors that change with theme
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',

        // Text
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',

        // Borders
        'border-light': 'var(--color-border-light)',
        'border-medium': 'var(--color-border-medium)',

        // Accents (static)
        'solidarity-red': accents.solidarityRed,
        'earth-green': accents.earthGreen,
        'sun-yellow': accents.sunYellow,

        // Legacy support (for existing components)
        charcoal: lightMode.text.primary,
        paper: lightMode.background,
    },
    fontFamily: {
        sans: typography.family.regular.split(', '),
        display: typography.family.display.split(', '),
    },
};

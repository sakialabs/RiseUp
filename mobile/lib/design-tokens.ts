/**
 * RiseUp Collective - Mobile Design Tokens
 * 
 * These tokens ensure consistency with the RiseUp brand identity across the mobile app.
 * Reference: docs/styles.md and docs/tone.md
 */

export const Colors = {
    // Core Colors (Always Used)
    charcoal: '#1C1C1C',      // Primary text, headlines, icons
    paper: '#FAF9F6',         // Main backgrounds, cards, reading surfaces

    // Accent Colors (Use 1-2 at a time)
    solidarityRed: '#B11226', // Primary CTAs, urgent notices, collective power
    earthGreen: '#2F5D3A',    // Community care, mutual aid, long-term work
    sunYellow: '#E0B400',     // Highlights, visibility cues

    // Utility Colors
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',

    // Semantic Colors (derived from core palette)
    text: {
        primary: '#1C1C1C',
        secondary: 'rgba(28, 28, 28, 0.7)',
        tertiary: 'rgba(28, 28, 28, 0.5)',
        inverse: '#FAF9F6',
    },
    background: {
        primary: '#FAF9F6',
        secondary: '#FFFFFF',
        charcoalLight: 'rgba(28, 28, 28, 0.05)',
    },
    border: {
        light: 'rgba(28, 28, 28, 0.1)',
        medium: 'rgba(28, 28, 28, 0.2)',
    },
};

export const Typography = {
    // Font Family - Inter for all text
    family: {
        regular: 'Inter',
        bold: 'Inter-Bold',
        semiBold: 'Inter-SemiBold',
    },

    // Font Sizes (optimized for mobile)
    size: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
    },

    // Line Heights
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.6,
    },

    // Font Weights
    weight: {
        regular: '400' as const,
        medium: '500' as const,
        semiBold: '600' as const,
        bold: '700' as const,
        extraBold: '800' as const,
    },
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
};

export const BorderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
};

export const Shadows = {
    sm: {
        shadowColor: Colors.charcoal,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: Colors.charcoal,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    lg: {
        shadowColor: Colors.charcoal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
};

/**
 * Reaction Types
 * Reference: docs/design.md - Use "Support reactions" not "likes"
 */
export const ReactionTypes = {
    care: { emoji: '❤️', label: 'Care' },
    solidarity: { emoji: '✊', label: 'Solidarity' },
    respect: { emoji: '🙏', label: 'Respect' },
    gratitude: { emoji: '🌟', label: 'Gratitude' },
};

/**
 * Event Types with associated colors
 */
export const EventTypes = {
    RALLY: { label: 'Rally', color: Colors.solidarityRed },
    MARCH: { label: 'March', color: Colors.solidarityRed },
    WORKSHOP: { label: 'Workshop', color: Colors.earthGreen },
    MEETING: { label: 'Meeting', color: Colors.charcoal },
    FUNDRAISER: { label: 'Fundraiser', color: Colors.sunYellow },
    DIRECT_ACTION: { label: 'Direct Action', color: Colors.solidarityRed },
    MUTUAL_AID: { label: 'Mutual Aid', color: Colors.earthGreen },
};

/**
 * Causes - Community organizing categories
 */
export const CausesLabels = {
    HOUSING: 'Housing Rights',
    CLIMATE: 'Climate Action',
    LABOR: 'Labor Organizing',
    COMMUNITY_CARE: 'Community Care',
    RACIAL_JUSTICE: 'Racial Justice',
    MUTUAL_AID: 'Mutual Aid',
    FOOD_ACCESS: 'Food Access',
    EDUCATION: 'Education',
};

/**
 * Copy Guidelines
 * Reference: docs/tone.md - Human-first, grounded, action-oriented
 */
export const CopyGuidelines = {
    // Use these terms
    preferred: {
        join: 'Join',          // NOT "RSVP"
        showUp: 'I will show up',
        reactions: 'Support reactions',  // NOT "likes"
        guide: 'Guide',        // NOT "bot" or "assistant"
    },

    // Avoid these
    avoid: [
        'RSVP',
        'likes',
        'bot',
        'AI assistant',
        'scalable',
        'optimize',
        'leverage',
        'engagement metrics',
    ],
};

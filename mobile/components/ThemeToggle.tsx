import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../lib/theme';
import { Typography, Spacing, BorderRadius } from '../lib/design-tokens';

/**
 * ThemeToggle Component
 * 
 * Mobile theme switcher with smooth transitions
 * Reference: docs/styles.md - Dual-mode support
 */
export function ThemeToggle() {
    const { theme, toggleTheme, colors } = useTheme();

    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border.light,
                    opacity: pressed ? 0.7 : 1,
                },
            ]}
            onPress={toggleTheme}
        >
            <View style={styles.content}>
                {/* Sun Icon */}
                <Text style={[styles.icon, { opacity: theme === 'light' ? 1 : 0.4 }]}>
                    ☀️
                </Text>

                {/* Moon Icon */}
                <Text style={[styles.icon, { opacity: theme === 'dark' ? 1 : 0.4 }]}>
                    🌙
                </Text>

                <Text style={[styles.label, { color: colors.text.primary }]}>
                    {theme === 'light' ? 'Light' : 'Dark'}
                </Text>
            </View>
        </Pressable>
    );
}

/**
 * Compact ThemeToggle (Icon Only)
 * For use in navigation bars
 */
export function ThemeToggleCompact() {
    const { theme, toggleTheme, colors } = useTheme();

    return (
        <Pressable
            style={({ pressed }) => [
                styles.compactContainer,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border.light,
                    opacity: pressed ? 0.7 : 1,
                },
            ]}
            onPress={toggleTheme}
        >
            <Text style={styles.compactIcon}>
                {theme === 'light' ? '☀️' : '🌙'}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    icon: {
        fontSize: Typography.size.lg,
    },
    label: {
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.medium,
    },
    compactContainer: {
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        padding: Spacing.sm,
    },
    compactIcon: {
        fontSize: Typography.size.xl,
    },
});

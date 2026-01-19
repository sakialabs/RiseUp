import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../lib/design-tokens';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'green' | 'red' | 'yellow';
  color?: string;
}

export function Badge({ text, variant = 'default', color }: BadgeProps) {
  const badgeStyles = [
    styles.badge,
    variant === 'green' && styles.greenBadge,
    variant === 'red' && styles.redBadge,
    variant === 'yellow' && styles.yellowBadge,
    color && { backgroundColor: `${color}20` },
  ];

  const textStyles = [
    styles.text,
    variant === 'green' && styles.greenText,
    variant === 'red' && styles.redText,
    variant === 'yellow' && styles.yellowText,
    color && { color },
  ];

  return (
    <View style={badgeStyles}>
      <Text style={textStyles}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.border,
  },
  greenBadge: {
    backgroundColor: '#D1FAE5',
  },
  redBadge: {
    backgroundColor: '#FEE2E2',
  },
  yellowBadge: {
    backgroundColor: '#FEF3C7',
  },
  text: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
    color: Colors.text.primary,
  },
  greenText: {
    color: '#065F46',
  },
  redText: {
    color: '#991B1B',
  },
  yellowText: {
    color: '#92400E',
  },
});

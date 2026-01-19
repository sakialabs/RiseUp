import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing } from '../lib/design-tokens';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showText?: boolean;
  onPress?: () => void;
}

export function Logo({ size = 'md', animated = false, showText = true, onPress }: LogoProps) {
  const emojiSizes = {
    sm: 20,
    md: 28,
    lg: 36,
  };

  const textSizes = {
    sm: Typography.size.lg,
    md: Typography.size.xl,
    lg: Typography.size['2xl'],
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/feed');
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
    >
      <Text style={[styles.emoji, { fontSize: emojiSizes[size] }]}>
        ✊
      </Text>
      {showText && (
        <Text style={[styles.text, { fontSize: textSizes[size] }]}>
          RiseUp
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  emoji: {
    lineHeight: undefined,
  },
  text: {
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
  },
});

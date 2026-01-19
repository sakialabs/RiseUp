import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../lib/design-tokens';

export function LoadingSkeleton() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {[1, 2, 3].map((item) => (
        <Animated.View key={item} style={[styles.card, { opacity }]}>
          <View style={styles.header}>
            <View style={styles.badge} />
            <View style={styles.count} />
          </View>
          <View style={styles.title} />
          <View style={styles.description} />
          <View style={styles.descriptionShort} />
          <View style={styles.footer}>
            <View style={styles.footerItem} />
            <View style={styles.footerItem} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  badge: {
    width: 80,
    height: 24,
    backgroundColor: Colors.background.charcoalLight,
    borderRadius: BorderRadius.full,
  },
  count: {
    width: 40,
    height: 24,
    backgroundColor: Colors.background.charcoalLight,
    borderRadius: BorderRadius.full,
  },
  title: {
    width: '80%',
    height: 20,
    backgroundColor: Colors.background.charcoalLight,
    borderRadius: 4,
    marginBottom: Spacing.xs,
  },
  description: {
    width: '100%',
    height: 16,
    backgroundColor: Colors.background.charcoalLight,
    borderRadius: 4,
    marginBottom: 6,
  },
  descriptionShort: {
    width: '60%',
    height: 16,
    backgroundColor: Colors.background.charcoalLight,
    borderRadius: 4,
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  footerItem: {
    width: 60,
    height: 16,
    backgroundColor: Colors.background.charcoalLight,
    borderRadius: 4,
  },
});

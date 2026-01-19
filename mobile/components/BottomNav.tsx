import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Colors, Spacing, Typography, Shadows } from '../lib/design-tokens';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Feed', path: '/feed', icon: '📰' },
    { label: 'Events', path: '/events', icon: '📅' },
    { label: 'Unionized', path: '/unionized', icon: '⚒️' },
    { label: 'Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Pressable
              key={item.path}
              style={({ pressed }) => [
                styles.navItem,
                pressed && styles.navItemPressed,
              ]}
              onPress={() => router.push(item.path as any)}
            >
              <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {item.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingBottom: Platform.OS === 'ios' ? 20 : Spacing.sm,
    ...Shadows.md,
  },
  content: {
    flexDirection: 'row',
    paddingTop: Spacing.sm,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    position: 'relative',
  },
  navItemPressed: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(177, 18, 38, 0.1)',
  },
  icon: {
    fontSize: 22,
  },
  label: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.weight.medium,
  },
  labelActive: {
    color: Colors.solidarityRed,
    fontWeight: Typography.weight.semiBold,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3,
    backgroundColor: Colors.solidarityRed,
    borderRadius: 2,
  },
});

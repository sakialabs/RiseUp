import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { Colors, Spacing, Typography, BorderRadius } from '../lib/design-tokens';

export default function Index() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect to feed
    if (!loading && user) {
      router.replace('/feed');
    }
  }, [user, loading]);

  if (loading) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo as emoji */}
        <Text style={styles.logoEmoji}>✊</Text>

        <Text style={styles.title}>RiseUp</Text>
        <Text style={styles.tagline}>Organize. Show Up. Build Power.</Text>
        
        <Text style={styles.description}>
          A tool for people who want to organize locally and do the work together. No algorithms. No ads. Just action.
        </Text>
        
        <View style={styles.buttons}>
          <Link href="/auth/register" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Show Up</Text>
            </Pressable>
          </Link>
          
          <Link href="/auth/login" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </Pressable>
          </Link>
        </View>
        
        <View style={styles.values}>
          <View style={styles.valueItem}>
            <Text style={styles.valueEmoji}>💚</Text>
            <Text style={styles.valueTitle}>Love</Text>
            <Text style={styles.valueText}>Care in action. Look out for each other.</Text>
          </View>
          <View style={styles.valueItem}>
            <Text style={styles.valueEmoji}>✊</Text>
            <Text style={styles.valueTitle}>Solidarity</Text>
            <Text style={styles.valueText}>We move together. No saviors.</Text>
          </View>
          <View style={styles.valueItem}>
            <Text style={styles.valueEmoji}>🌟</Text>
            <Text style={styles.valueTitle}>Empowerment</Text>
            <Text style={styles.valueText}>Every voice counts.</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  content: {
    maxWidth: 500,
    alignItems: 'center',
    width: '100%',
  },
  logoEmoji: {
    fontSize: 80,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 48,
    fontWeight: Typography.weight.extraBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  tagline: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  description: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: Typography.size.base * Typography.lineHeight.relaxed,
  },
  buttons: {
    width: '100%',
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
  },
  primaryButton: {
    backgroundColor: Colors.solidarityRed,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semiBold,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: Colors.text.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: Colors.text.primary,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semiBold,
  },
  values: {
    width: '100%',
    gap: Spacing.lg,
  },
  valueItem: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  valueEmoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  valueTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  valueText: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.size.sm * Typography.lineHeight.relaxed,
  },
});

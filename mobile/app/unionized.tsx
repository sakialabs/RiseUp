import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { unionizedAPI } from '../lib/api';
import { Colors, Typography, Spacing, BorderRadius } from '../lib/design-tokens';
import { Logo } from '../components/Logo';
import { BottomNav } from '../components/BottomNav';
import { Badge } from '../components/Badge';

interface FairWorkPosting {
  id: number;
  title: string;
  organization: string;
  location: string;
  wage_text: string;
  employment_type: string;
  union_status: string;
  description: string;
  posted_date: string;
}

export default function UnionizedScreen() {
  const [postings, setPostings] = useState<FairWorkPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    loadPostings();
  }, []);

  const loadPostings = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (locationFilter) params.location = locationFilter;
      
      const response = await unionizedAPI.list(params);
      setPostings(response.data);
    } catch (error) {
      console.error('Failed to load postings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUnionBadgeColor = (status: string) => {
    if (status === 'unionized') return Colors.earthGreen;
    if (status === 'union-friendly') return Colors.solidarityRed;
    return Colors.text.secondary;
  };

  const getUnionLabel = (status: string) => {
    if (status === 'unionized') return 'Unionized';
    if (status === 'union-friendly') return 'Union-Friendly';
    return 'Not Listed';
  };

  const getEmploymentLabel = (type: string) => {
    if (type === 'full-time') return 'Full-Time';
    if (type === 'part-time') return 'Part-Time';
    if (type === 'contract') return 'Contract';
    return 'Gig';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Logo size="md" showText />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Work with dignity.</Text>
          <Text style={styles.heroSubtitle}>
            Find fair jobs, transparent wages, and real worker protection.
          </Text>
          <Text style={styles.heroNote}>
            This isn't a job board. It's a worker-first space.
          </Text>
        </View>

        {/* What is Unionized */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>What this is</Text>
            <Text style={styles.infoText}>
              A place to find work that respects you. Fair pay. Clear terms. Worker protections.
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>What makes work fair</Text>
            <Text style={styles.infoText}>
              Transparent wages. Union presence or worker-friendly policies. No dark patterns.
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Why it's here</Text>
            <Text style={styles.infoText}>
              RiseUp is about collective power. That includes the workplace.
            </Text>
          </View>
        </View>

        {/* Filter */}
        <View style={styles.filterSection}>
          <TextInput
            style={styles.filterInput}
            placeholder="Filter by location"
            placeholderTextColor={Colors.text.secondary}
            value={locationFilter}
            onChangeText={setLocationFilter}
            onSubmitEditing={loadPostings}
          />
        </View>

        {/* Postings */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.solidarityRed} />
          </View>
        ) : postings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No postings yet.</Text>
            <Text style={styles.emptySubtext}>Check back soon.</Text>
          </View>
        ) : (
          <View style={styles.postingsList}>
            {postings.map((posting) => (
              <Pressable
                key={posting.id}
                style={({ pressed }) => [
                  styles.postingCard,
                  pressed && styles.postingCardPressed,
                ]}
                onPress={() => router.push(`/unionized/${posting.id}`)}
              >
                <View style={styles.postingHeader}>
                  <View style={styles.postingTitleContainer}>
                    <Text style={styles.postingTitle}>{posting.title}</Text>
                    <Text style={styles.postingOrg}>{posting.organization}</Text>
                  </View>
                  <Badge
                    text={getUnionLabel(posting.union_status)}
                    color={getUnionBadgeColor(posting.union_status)}
                  />
                </View>

                <View style={styles.postingMeta}>
                  <Text style={styles.postingMetaText}>📍 {posting.location}</Text>
                  <Text style={styles.postingMetaText}>
                    💼 {getEmploymentLabel(posting.employment_type)}
                  </Text>
                  <Text style={styles.postingWage}>💰 {posting.wage_text}</Text>
                </View>

                <Text style={styles.postingDescription} numberOfLines={2}>
                  {posting.description}
                </Text>

                <Text style={styles.postingCta}>See Details →</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  content: {
    flex: 1,
  },
  hero: {
    padding: Spacing.xl,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: Typography.size['3xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: Typography.size.lg,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  heroNote: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  infoSection: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  infoCard: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  infoTitle: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  filterSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  filterInput: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
    fontSize: Typography.size.base,
    color: Colors.text.primary,
  },
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.size.lg,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
  },
  postingsList: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: 100,
  },
  postingCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  postingCardPressed: {
    opacity: 0.7,
  },
  postingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  postingTitleContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  postingTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  postingOrg: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
  },
  postingMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  postingMetaText: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
  },
  postingWage: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semiBold,
    color: Colors.text.primary,
  },
  postingDescription: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  postingCta: {
    fontSize: Typography.size.sm,
    color: Colors.solidarityRed,
    fontWeight: Typography.weight.medium,
  },
});

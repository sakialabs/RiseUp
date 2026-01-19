import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { unionizedAPI } from '../../lib/api';
import { Colors, Typography, Spacing, BorderRadius } from '../../lib/design-tokens';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';

interface FairWorkPosting {
  id: number;
  title: string;
  organization: string;
  location: string;
  wage_text: string;
  employment_type: string;
  union_status: string;
  description: string;
  worker_notes?: string;
  application_url?: string;
  posted_date: string;
}

export default function UnionizedDetailScreen() {
  const { id } = useLocalSearchParams();
  const [posting, setPosting] = useState<FairWorkPosting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosting();
  }, [id]);

  const loadPosting = async () => {
    try {
      setLoading(true);
      const response = await unionizedAPI.get(Number(id));
      setPosting(response.data);
    } catch (error) {
      console.error('Failed to load posting:', error);
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

  const handleOpenLink = () => {
    if (posting?.application_url) {
      Linking.openURL(posting.application_url);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.solidarityRed} />
      </View>
    );
  }

  if (!posting) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Posting not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back to listings</Text>
        </Pressable>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.title}>{posting.title}</Text>
              <Text style={styles.organization}>{posting.organization}</Text>
            </View>
            <Badge
              text={getUnionLabel(posting.union_status)}
              color={getUnionBadgeColor(posting.union_status)}
            />
          </View>
        </View>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{posting.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Employment Type</Text>
            <Text style={styles.detailValue}>{getEmploymentLabel(posting.employment_type)}</Text>
          </View>
          <View style={[styles.detailItem, styles.detailItemFull]}>
            <Text style={styles.detailLabel}>Wage</Text>
            <Text style={styles.detailValueWage}>{posting.wage_text}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionText}>{posting.description}</Text>
        </View>

        {/* Worker Notes */}
        {posting.worker_notes && (
          <View style={styles.workerNotesSection}>
            <Text style={styles.workerNotesTitle}>What workers should know</Text>
            <Text style={styles.workerNotesText}>{posting.worker_notes}</Text>
          </View>
        )}

        {/* Application Link */}
        {posting.application_url && (
          <View style={styles.actionSection}>
            <Button title="Learn More" onPress={handleOpenLink} fullWidth />
          </View>
        )}

        {/* Posted Date */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Posted {new Date(posting.posted_date).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.paper,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.paper,
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: Typography.size.lg,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  backButton: {
    padding: Spacing.lg,
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  backButtonText: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitleContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  organization: {
    fontSize: Typography.size.lg,
    color: Colors.text.secondary,
  },
  detailsGrid: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
    gap: Spacing.md,
  },
  detailItem: {
    flex: 1,
  },
  detailItemFull: {
    width: '100%',
  },
  detailLabel: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  detailValue: {
    fontSize: Typography.size.base,
    color: Colors.text.primary,
  },
  detailValueWage: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semiBold,
    color: Colors.text.primary,
  },
  section: {
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  sectionText: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  workerNotesSection: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  workerNotesTitle: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  workerNotesText: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  actionSection: {
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  footer: {
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  footerText: {
    fontSize: Typography.size.xs,
    color: Colors.text.secondary,
  },
});

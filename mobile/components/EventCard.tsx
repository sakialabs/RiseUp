import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { format } from 'date-fns';
import { Badge } from './Badge';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Shadows, Typography } from '../lib/design-tokens';

interface Event {
  id: number;
  title: string;
  description: string;
  event_type: string;
  event_date: string;
  location: string;
  tags: string[];
  attendee_count: number;
  creator: {
    name: string;
  };
}

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={() => router.push(`/events/${event.id}` as any)}
    >
      <View style={styles.header}>
        <Badge text={event.event_type} variant="green" />
        <View style={styles.attendanceContainer}>
          <Text style={styles.attendanceIcon}>👥</Text>
          <Text style={styles.attendance}>{event.attendee_count}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
      <Text style={styles.description} numberOfLines={3}>
        {event.description}
      </Text>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📅</Text>
          <Text style={styles.detailText}>
            {format(new Date(event.event_date), 'EEE, MMM d · h:mm a')}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detailText} numberOfLines={1}>{event.location}</Text>
        </View>
      </View>

      {event.tags && event.tags.length > 0 && (
        <View style={styles.tags}>
          {event.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} text={tag} />
          ))}
          {event.tags.length > 3 && (
            <Text style={styles.moreTags}>+{event.tags.length - 3}</Text>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.creator}>Organized by {event.creator.name}</Text>
        <Text style={styles.arrow}>→</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  attendanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.charcoalLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  attendanceIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  attendance: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semiBold,
    color: Colors.text.primary,
  },
  title: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    lineHeight: Typography.size.lg * Typography.lineHeight.tight,
  },
  description: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    lineHeight: Typography.size.sm * Typography.lineHeight.relaxed,
  },
  details: {
    marginBottom: Spacing.sm,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  detailText: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    flex: 1,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  moreTags: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  creator: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
    flex: 1,
  },
  arrow: {
    fontSize: Typography.size.base,
    color: Colors.earthGreen,
    fontWeight: Typography.weight.bold,
  },
});

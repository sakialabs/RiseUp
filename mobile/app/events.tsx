import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { eventAPI } from '../lib/api';
import { EventCard } from '../components/EventCard';
import { BottomNav } from '../components/BottomNav';
import { Logo } from '../components/Logo';
import { Colors, Spacing, Typography, BorderRadius } from '../lib/design-tokens';

export default function EventsScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'map'>('list');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await eventAPI.list();
      setEvents(response.data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#B11226" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo size="md" animated={false} showText={true} />
        <View style={styles.viewToggle}>
          <Pressable
            style={[styles.toggleButton, view === 'list' && styles.toggleButtonActive]}
            onPress={() => setView('list')}
          >
            <Text style={[styles.toggleText, view === 'list' && styles.toggleTextActive]}>
              List
            </Text>
          </Pressable>
          <Pressable
            style={[styles.toggleButton, view === 'map' && styles.toggleButtonActive]}
            onPress={() => setView('map')}
          >
            <Text style={[styles.toggleText, view === 'map' && styles.toggleTextActive]}>
              Map
            </Text>
          </Pressable>
        </View>
      </View>

      {view === 'list' ? (
        <FlatList
          data={events}
          renderItem={({ item }) => <EventCard event={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyText}>No events yet</Text>
              <Text style={styles.emptySubtext}>Be the first to organize</Text>
              <Pressable
                style={styles.createButton}
                onPress={() => router.push('/events/new' as any)}
              >
                <Text style={styles.createButtonText}>Create Event</Text>
              </Pressable>
            </View>
          }
        />
      ) : (
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>Map view coming soon!</Text>
          <Text style={styles.mapSubtext}>
            We'll integrate React Native Maps to show events on an interactive map
          </Text>
        </View>
      )}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    paddingTop: Spacing.xl + 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: Colors.white,
  },
  viewToggle: {
    flexDirection: 'row',
    gap: Spacing.xs,
    backgroundColor: Colors.background.charcoalLight,
    borderRadius: BorderRadius.md,
    padding: 4,
  },
  toggleButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    minWidth: 60,
  },
  toggleButtonActive: {
    backgroundColor: Colors.white,
  },
  toggleText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semiBold,
    color: Colors.text.secondary,
  },
  toggleTextActive: {
    color: Colors.text.primary,
  },
  listContent: {
    padding: Spacing.md,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
    paddingHorizontal: Spacing.lg,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  createButton: {
    backgroundColor: Colors.solidarityRed,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semiBold,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  mapText: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  mapSubtext: {
    fontSize: Typography.size.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});

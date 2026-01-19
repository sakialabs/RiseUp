import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useAuth } from '../lib/auth';
import { profileAPI } from '../lib/api';
import { Badge } from '../components/Badge';
import { EventCard } from '../components/EventCard';
import { Button } from '../components/Button';
import { BottomNav } from '../components/BottomNav';
import { Logo } from '../components/Logo';
import { Colors, Spacing, Typography, BorderRadius } from '../lib/design-tokens';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      if (user) {
        const [profileRes, eventsRes, attendingRes] = await Promise.all([
          profileAPI.getMyProfile(),
          profileAPI.getProfileEvents(user.profile.id),
          profileAPI.getMyAttendingEvents(),
        ]);
        setProfile(profileRes.data);
        setEvents(eventsRes.data);
        setAttendingEvents(attendingRes.data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#B11226" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Profile not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Logo size="md" animated={false} showText={true} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        {profile.avatar_url ? (
          <Image
            source={{ uri: profile.avatar_url }}
            style={styles.avatarImage}
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={styles.name}>{profile.name}</Text>
        <Badge text={profile.profile_type} variant="green" />
      </View>

      {profile.bio && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>About</Text>
          <Text style={styles.bio}>{profile.bio}</Text>
        </View>
      )}

      {profile.location && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Location</Text>
          <Text style={styles.locationText}>📍 {profile.location}</Text>
        </View>
      )}

      {profile.causes && profile.causes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Causes</Text>
          <View style={styles.causes}>
            {profile.causes.map((cause: string, index: number) => (
              <Badge key={index} text={cause} />
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Events I'm Attending ({attendingEvents.length})</Text>
        {attendingEvents.length === 0 ? (
          <Text style={styles.emptyText}>No events joined yet</Text>
        ) : (
          attendingEvents.map((event) => <EventCard key={event.id} event={event} />)
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>My Events ({events.length})</Text>
        {events.length === 0 ? (
          <Text style={styles.emptyText}>No events organized yet</Text>
        ) : (
          events.map((event) => <EventCard key={event.id} event={event} />)
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="Sign Out 👋" 
          onPress={handleLogout} 
          variant="outline"
          style={styles.logoutButton}
        />
      </View>
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  headerBar: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingTop: Spacing.xl + 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.earthGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: Typography.size['3xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.white,
  },
  name: {
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semiBold,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bio: {
    fontSize: Typography.size.base,
    color: Colors.text.primary,
    lineHeight: Typography.size.base * Typography.lineHeight.relaxed,
  },
  locationText: {
    fontSize: Typography.size.base,
    color: Colors.text.primary,
  },
  causes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.size.sm,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  logoutButton: {
    borderColor: Colors.solidarityRed,
    borderWidth: 2,
  },
  errorText: {
    fontSize: Typography.size.base,
    color: Colors.solidarityRed,
  },
});

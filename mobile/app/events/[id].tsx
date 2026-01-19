import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { format } from 'date-fns';
import { eventAPI } from '../../lib/api';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      const response = await eventAPI.get(Number(id));
      setEvent(response.data);
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      if (event.user_attending) {
        await eventAPI.leave(Number(id));
      } else {
        await eventAPI.join(Number(id));
      }
      loadEvent();
    } catch (error) {
      console.error('Error joining/leaving event:', error);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#B11226" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Badge text={event.event_type} variant="green" />
        <Text style={styles.attendance}>{event.attendance_count} people joined</Text>
      </View>

      <Text style={styles.title}>{event.title}</Text>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>When</Text>
        <Text style={styles.infoText}>
          {format(new Date(event.start_time), 'EEEE, MMMM d, yyyy')}
        </Text>
        <Text style={styles.infoText}>
          {format(new Date(event.start_time), 'h:mm a')} -{' '}
          {format(new Date(event.end_time), 'h:mm a')}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Where</Text>
        <Text style={styles.infoText}>📍 {event.location}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>About</Text>
        <Text style={styles.description}>{event.description}</Text>
      </View>

      {event.tags && event.tags.length > 0 && (
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Causes</Text>
          <View style={styles.tags}>
            {event.tags.map((tag: string, index: number) => (
              <Badge key={index} text={tag} />
            ))}
          </View>
        </View>
      )}

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Organized by</Text>
        <Text style={styles.infoText}>{event.creator.name}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={event.user_attending ? 'Leave Event' : 'Join Event'}
          onPress={handleJoin}
          loading={joining}
          variant={event.user_attending ? 'outline' : 'primary'}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  attendance: {
    fontSize: 14,
    color: '#6B7280',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginBottom: 24,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 16,
    color: '#1C1C1C',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: '#1C1C1C',
    lineHeight: 24,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
  },
});

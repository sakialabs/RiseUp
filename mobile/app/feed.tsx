import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { feedAPI, reactionAPI } from '../lib/api';
import { EventCard } from '../components/EventCard';
import { PostCard } from '../components/PostCard';
import { BottomNav } from '../components/BottomNav';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Logo } from '../components/Logo';
import { useAuth } from '../lib/auth';
import { Colors, Spacing, Typography, BorderRadius } from '../lib/design-tokens';

export default function FeedScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      const response = await feedAPI.get();
      setItems(response.data);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadFeed();
  };

  const handleReact = async (targetType: string, targetId: number, reactionType: string) => {
    try {
      const item = items.find((i) => i.id === targetId && i.type === targetType);
      const hasReacted = item?.reactions?.some(
        (r: any) => r.user_id === user?.id && r.reaction_type === reactionType
      );

      if (hasReacted) {
        await reactionAPI.remove(targetType, targetId);
      } else {
        await reactionAPI.add({
          target_type: targetType,
          target_id: targetId,
          reaction_type: reactionType,
        });
      }

      loadFeed();
    } catch (error) {
      console.error('Error reacting:', error);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'event') {
      return <EventCard event={item} />;
    } else if (item.type === 'post') {
      return (
        <PostCard
          post={item}
          reactions={item.reactions || []}
          onReact={(reactionType) => handleReact('post', item.id, reactionType)}
          currentUserId={user?.id}
        />
      );
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Community Feed</Text>
        </View>
        <LoadingSkeleton />
        <BottomNav />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Logo size="md" animated={false} showText={true} />
        <Pressable
          style={styles.createButton}
          onPress={() => router.push('/events/new' as any)}
        >
          <Text style={styles.createButtonText}>✨ Create</Text>
        </Pressable>
      </View>

      {/* Feed List */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            tintColor={Colors.solidarityRed}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📣</Text>
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptyText}>
              Be the first to share an update or create an event
            </Text>
            <Pressable
              style={styles.emptyButton}
              onPress={() => router.push('/events/new' as any)}
            >
              <Text style={styles.emptyButtonText}>Create Event</Text>
            </Pressable>
          </View>
        }
      />
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingTop: Spacing.xl + 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  createButton: {
    backgroundColor: Colors.solidarityRed,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semiBold,
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
  emptyTitle: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    fontSize: Typography.size.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: Typography.size.base * Typography.lineHeight.relaxed,
  },
  emptyButton: {
    backgroundColor: Colors.solidarityRed,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  emptyButtonText: {
    color: Colors.white,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semiBold,
  },
});

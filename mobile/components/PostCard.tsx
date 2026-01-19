import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { format } from 'date-fns';
import { Colors, Spacing, BorderRadius, Shadows, Typography, ReactionTypes } from '../lib/design-tokens';

interface Post {
  id: number;
  text: string;
  created_at: string;
  creator: {
    id: number;
    name: string;
  };
  reaction_counts?: {
    care: number;
    solidarity: number;
    respect: number;
    gratitude: number;
  };
}

interface Reaction {
  reaction_type: 'care' | 'solidarity' | 'respect' | 'gratitude';
  user_id: number;
}

interface PostCardProps {
  post: Post;
  reactions: Reaction[];
  onReact: (reactionType: string) => void;
  currentUserId?: number;
}

export function PostCard({ post, reactions, onReact, currentUserId }: PostCardProps) {
  const userReactions = reactions.filter((r) => r.user_id === currentUserId);
  const reactionCounts = post.reaction_counts || { care: 0, solidarity: 0, respect: 0, gratitude: 0 };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {post.creator.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.creator}>{post.creator.name}</Text>
          <Text style={styles.timestamp}>
            {format(new Date(post.created_at), 'MMM d · h:mm a')}
          </Text>
        </View>
      </View>

      {/* Content */}
      <Text style={styles.content}>{post.text}</Text>

      {/* Reactions */}
      <View style={styles.reactions}>
        {Object.entries(ReactionTypes).map(([type, { emoji, label }]) => {
          const count = reactionCounts[type as keyof typeof reactionCounts] || 0;
          const hasReacted = userReactions.some((r) => r.reaction_type === type);

          return (
            <Pressable
              key={type}
              style={({ pressed }) => [
                styles.reactionButton,
                hasReacted && styles.reactionButtonActive,
                pressed && styles.reactionButtonPressed,
              ]}
              onPress={() => onReact(type)}
            >
              <Text style={styles.reactionIcon}>{emoji}</Text>
              {count > 0 && (
                <Text style={[styles.reactionCount, hasReacted && styles.reactionCountActive]}>
                  {count}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.earthGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  avatarText: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
    color: Colors.white,
  },
  headerInfo: {
    flex: 1,
  },
  creator: {
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.semiBold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: Typography.size.xs,
    color: Colors.text.tertiary,
  },
  content: {
    fontSize: Typography.size.base,
    color: Colors.text.primary,
    lineHeight: Typography.size.base * Typography.lineHeight.relaxed,
    marginBottom: Spacing.md,
  },
  reactions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.charcoalLight,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  reactionButtonActive: {
    backgroundColor: 'rgba(47, 93, 58, 0.1)',
    borderColor: Colors.earthGreen,
  },
  reactionButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  reactionIcon: {
    fontSize: 16,
  },
  reactionCount: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
    color: Colors.text.secondary,
  },
  reactionCountActive: {
    color: Colors.earthGreen,
  },
});

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, ReactionTypes, Typography, Spacing } from '../lib/design-tokens';

interface ReactionButtonsProps {
    targetType: 'event' | 'post';
    targetId: number;
    reactions: Record<string, number>;
    userReaction?: string | null;
    onReact: (reactionType: string) => void;
    onRemove: () => void;
}

/**
 * ReactionButtons Component
 * 
 * Displays the four solidarity reaction types: Care, Solidarity, Respect, Gratitude
 * Label: "Support reactions" (not "likes")
 * Reference: docs/design.md, docs/tone.md
 */
export function ReactionButtons({
    reactions,
    userReaction,
    onReact,
    onRemove,
}: ReactionButtonsProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleReactionPress = (type: string) => {
        if (userReaction === type) {
            onRemove();
        } else {
            onReact(type);
        }
        setIsExpanded(false);
    };

    // Calculate total reactions
    const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Support reactions</Text>

            <View style={styles.reactionsContainer}>
                {Object.entries(ReactionTypes).map(([type, { emoji, label }]) => {
                    const count = reactions[type] || 0;
                    const isActive = userReaction === type;

                    return (
                        <Pressable
                            key={type}
                            style={[
                                styles.reactionButton,
                                isActive && styles.reactionButtonActive,
                            ]}
                            onPress={() => handleReactionPress(type)}
                        >
                            <Text style={styles.emoji}>{emoji}</Text>
                            {count > 0 && (
                                <Text style={[styles.count, isActive && styles.countActive]}>
                                    {count}
                                </Text>
                            )}
                            <Text style={[styles.reactionLabel, isActive && styles.labelActive]}>
                                {label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {totalReactions > 0 && (
                <Text style={styles.totalText}>
                    {totalReactions} {totalReactions === 1 ? 'person' : 'people'} showed support
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: Spacing.md,
    },
    label: {
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.semiBold,
        color: Colors.text.secondary,
        marginBottom: Spacing.sm,
    },
    reactionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    reactionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        backgroundColor: Colors.background.secondary,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.border.light,
    },
    reactionButtonActive: {
        backgroundColor: Colors.background.charcoalLight,
        borderColor: Colors.charcoal,
    },
    emoji: {
        fontSize: Typography.size.lg,
        marginRight: 4,
    },
    count: {
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.semiBold,
        color: Colors.text.secondary,
        marginRight: 4,
    },
    countActive: {
        color: Colors.text.primary,
    },
    reactionLabel: {
        fontSize: Typography.size.xs,
        color: Colors.text.secondary,
    },
    labelActive: {
        color: Colors.text.primary,
        fontWeight: Typography.weight.semiBold,
    },
    totalText: {
        fontSize: Typography.size.sm,
        color: Colors.text.tertiary,
        marginTop: Spacing.sm,
    },
});

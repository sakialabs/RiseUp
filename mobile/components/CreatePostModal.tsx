import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Modal,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../lib/design-tokens';
import { Button } from './Button';

interface CreatePostModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (text: string) => Promise<void>;
}

/**
 * CreatePostModal Component
 * 
 * Modal for creating community updates/posts
 * Max 500 characters with character counter
 * Reference: docs/design.md - Post text max 500 chars
 */
export function CreatePostModal({ visible, onClose, onSubmit }: CreatePostModalProps) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const MAX_LENGTH = 500;
    const remainingChars = MAX_LENGTH - text.length;

    const handleSubmit = async () => {
        if (!text.trim()) {
            setError('Please write something to share');
            return;
        }

        if (text.length > MAX_LENGTH) {
            setError(`Post exceeds maximum length of ${MAX_LENGTH} characters`);
            return;
        }

        setError('');
        setLoading(true);

        try {
            await onSubmit(text.trim());
            setText('');
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setText('');
            setError('');
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <Pressable style={styles.backdrop} onPress={handleClose} />

                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Share an Update</Text>
                        <Pressable onPress={handleClose} disabled={loading}>
                            <Text style={styles.closeButton}>✕</Text>
                        </Pressable>
                    </View>

                    <View style={styles.content}>
                        <TextInput
                            style={styles.input}
                            value={text}
                            onChangeText={setText}
                            placeholder="What's happening in your community?"
                            placeholderTextColor={Colors.text.tertiary}
                            multiline
                            numberOfLines={8}
                            maxLength={MAX_LENGTH}
                            editable={!loading}
                            autoFocus
                        />

                        <View style={styles.footer}>
                            <Text
                                style={[
                                    styles.charCounter,
                                    remainingChars < 50 && styles.charCounterWarning,
                                    remainingChars < 0 && styles.charCounterError,
                                ]}
                            >
                                {remainingChars} characters remaining
                            </Text>
                        </View>

                        {error ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <View style={styles.actions}>
                            <Button
                                title="Cancel"
                                onPress={handleClose}
                                variant="outline"
                                disabled={loading}
                                style={{ flex: 1, marginRight: Spacing.sm }}
                            />
                            <Button
                                title={loading ? 'Posting...' : 'Post'}
                                onPress={handleSubmit}
                                variant="primary"
                                loading={loading}
                                disabled={loading || text.length === 0 || text.length > MAX_LENGTH}
                                style={{ flex: 1 }}
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: Colors.paper,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border.light,
    },
    title: {
        fontSize: Typography.size.xl,
        fontWeight: Typography.weight.bold,
        color: Colors.text.primary,
    },
    closeButton: {
        fontSize: Typography.size['2xl'],
        color: Colors.text.secondary,
        padding: Spacing.sm,
    },
    content: {
        padding: Spacing.md,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border.light,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: Typography.size.base,
        color: Colors.text.primary,
        minHeight: 120,
        textAlignVertical: 'top',
        backgroundColor: Colors.background.secondary,
    },
    footer: {
        marginTop: Spacing.sm,
    },
    charCounter: {
        fontSize: Typography.size.sm,
        color: Colors.text.secondary,
        textAlign: 'right',
    },
    charCounterWarning: {
        color: Colors.sunYellow,
    },
    charCounterError: {
        color: Colors.solidarityRed,
    },
    errorContainer: {
        backgroundColor: '#FEE2E2',
        borderWidth: 1,
        borderColor: '#DC2626',
        borderRadius: BorderRadius.sm,
        padding: Spacing.sm,
        marginTop: Spacing.md,
    },
    errorText: {
        color: '#DC2626',
        fontSize: Typography.size.sm,
    },
    actions: {
        flexDirection: 'row',
        marginTop: Spacing.lg,
        gap: Spacing.sm,
    },
});

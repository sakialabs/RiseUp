import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Pressable,
    StyleSheet,
    Alert,
    Platform,
} from 'react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Typography, Spacing, BorderRadius, EventTypes } from '../../lib/design-tokens';
import { Button } from '../../components/Button';
import { eventAPI } from '../../lib/api';

const EVENT_TYPE_OPTIONS = [
    { value: 'RALLY', label: 'Rally' },
    { value: 'MARCH', label: 'March' },
    { value: 'WORKSHOP', label: 'Workshop' },
    { value: 'MEETING', label: 'Meeting' },
    { value: 'FUNDRAISER', label: 'Fundraiser' },
    { value: 'DIRECT_ACTION', label: 'Direct Action' },
    { value: 'MUTUAL_AID', label: 'Mutual Aid' },
];

const CAUSES = [
    'HOUSING',
    'CLIMATE',
    'LABOR',
    'COMMUNITY_CARE',
    'RACIAL_JUSTICE',
    'MUTUAL_AID',
    'FOOD_ACCESS',
    'EDUCATION',
];

/**
 * CreateEventScreen
 * 
 * Mobile screen for creating new events
 * Follows the same validation and UX as web version
 * Reference: docs/design.md - Event creation requirements
 */
export default function CreateEventScreen() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [eventType, setEventType] = useState('RALLY');
    const [startTime, setStartTime] = useState(new Date(Date.now() + 86400000)); // Tomorrow
    const [location, setLocation] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const toggleCause = (cause: string) => {
        setSelectedCauses((prev) =>
            prev.includes(cause)
                ? prev.filter((c) => c !== cause)
                : [...prev, cause]
        );
    };

    const handleSubmit = async () => {
        // Validation
        if (!title.trim()) {
            setError('Event title is required');
            return;
        }

        if (!description.trim()) {
            setError('Event description is required');
            return;
        }

        if (!location.trim()) {
            setError('Event location is required');
            return;
        }

        if (startTime <= new Date()) {
            setError('Event date must be in the future');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const eventData: any = {
                title: title.trim(),
                description: description.trim(),
                event_type: eventType,
                start_time: startTime.toISOString(),
                location: location.trim(),
                causes: selectedCauses,
            };

            // Add coordinates if provided
            if (latitude && longitude) {
                const lat = parseFloat(latitude);
                const lng = parseFloat(longitude);

                if (!isNaN(lat) && !isNaN(lng)) {
                    eventData.latitude = lat;
                    eventData.longitude = lng;
                }
            }

            await eventAPI.create(eventData);

            Alert.alert(
                'Success',
                'Event created successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to create event. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.header}>Create Event</Text>
            <Text style={styles.subheader}>
                Organize your community. Start something that matters.
            </Text>

            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : null}

            {/* Title */}
            <View style={styles.section}>
                <Text style={styles.label}>Event Title *</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Community Meeting on Housing Rights"
                    placeholderTextColor={Colors.text.tertiary}
                    editable={!loading}
                />
            </View>

            {/* Event Type */}
            <View style={styles.section}>
                <Text style={styles.label}>Event Type *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.pillContainer}>
                        {EVENT_TYPE_OPTIONS.map((type) => (
                            <Pressable
                                key={type.value}
                                style={[
                                    styles.pill,
                                    eventType === type.value && styles.pillActive,
                                ]}
                                onPress={() => setEventType(type.value)}
                                disabled={loading}
                            >
                                <Text
                                    style={[
                                        styles.pillText,
                                        eventType === type.value && styles.pillTextActive,
                                    ]}
                                >
                                    {type.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {/* Date & Time */}
            <View style={styles.section}>
                <Text style={styles.label}>Date & Time *</Text>
                <Pressable
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                    disabled={loading}
                >
                    <Text style={styles.dateButtonText}>
                        📅 {startTime.toLocaleDateString()} at {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </Pressable>

                {showDatePicker && (
                    <DateTimePicker
                        value={startTime}
                        mode="datetime"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(Platform.OS === 'ios');
                            if (selectedDate) {
                                setStartTime(selectedDate);
                            }
                        }}
                        minimumDate={new Date()}
                    />
                )}
            </View>

            {/* Description */}
            <View style={styles.section}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describe the event and what people can expect..."
                    placeholderTextColor={Colors.text.tertiary}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    editable={!loading}
                />
            </View>

            {/* Location */}
            <View style={styles.section}>
                <Text style={styles.label}>Location *</Text>
                <TextInput
                    style={styles.input}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="123 Main St, City, State"
                    placeholderTextColor={Colors.text.tertiary}
                    editable={!loading}
                />
            </View>

            {/* Coordinates (Optional) */}
            <View style={styles.section}>
                <Text style={styles.label}>Coordinates (Optional)</Text>
                <Text style={styles.helperText}>For map display. Leave empty if unsure.</Text>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        value={latitude}
                        onChangeText={setLatitude}
                        placeholder="Latitude"
                        placeholderTextColor={Colors.text.tertiary}
                        keyboardType="decimal-pad"
                        editable={!loading}
                    />
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        value={longitude}
                        onChangeText={setLongitude}
                        placeholder="Longitude"
                        placeholderTextColor={Colors.text.tertiary}
                        keyboardType="decimal-pad"
                        editable={!loading}
                    />
                </View>
            </View>

            {/* Causes */}
            <View style={styles.section}>
                <Text style={styles.label}>Related Causes</Text>
                <View style={styles.causesContainer}>
                    {CAUSES.map((cause) => (
                        <Pressable
                            key={cause}
                            style={[
                                styles.causeChip,
                                selectedCauses.includes(cause) && styles.causeChipActive,
                            ]}
                            onPress={() => toggleCause(cause)}
                            disabled={loading}
                        >
                            <Text
                                style={[
                                    styles.causeChipText,
                                    selectedCauses.includes(cause) && styles.causeChipTextActive,
                                ]}
                            >
                                {cause.replace(/_/g, ' ')}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* Submit Button */}
            <View style={styles.actions}>
                <Button
                    title={loading ? 'Creating...' : 'Create Event'}
                    onPress={handleSubmit}
                    variant="primary"
                    loading={loading}
                    disabled={loading}
                    style={styles.submitButton}
                />
            </View>

            <View style={{ height: Spacing['2xl'] }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    content: {
        padding: Spacing.md,
    },
    header: {
        fontSize: Typography.size['3xl'],
        fontWeight: Typography.weight.bold,
        color: Colors.text.primary,
        marginBottom: Spacing.xs,
    },
    subheader: {
        fontSize: Typography.size.base,
        color: Colors.text.secondary,
        marginBottom: Spacing.lg,
    },
    errorContainer: {
        backgroundColor: '#FEE2E2',
        borderWidth: 1,
        borderColor: '#DC2626',
        borderRadius: BorderRadius.sm,
        padding: Spacing.md,
        marginBottom: Spacing.md,
    },
    errorText: {
        color: '#DC2626',
        fontSize: Typography.size.sm,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    label: {
        fontSize: Typography.size.base,
        fontWeight: Typography.weight.semiBold,
        color: Colors.text.primary,
        marginBottom: Spacing.sm,
    },
    helperText: {
        fontSize: Typography.size.sm,
        color: Colors.text.tertiary,
        marginBottom: Spacing.sm,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border.light,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        fontSize: Typography.size.base,
        color: Colors.text.primary,
        backgroundColor: Colors.background.secondary,
    },
    textArea: {
        minHeight: 120,
    },
    row: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    halfInput: {
        flex: 1,
    },
    dateButton: {
        borderWidth: 1,
        borderColor: Colors.border.light,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        backgroundColor: Colors.background.secondary,
    },
    dateButtonText: {
        fontSize: Typography.size.base,
        color: Colors.text.primary,
    },
    pillContainer: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    pill: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: Colors.border.light,
        backgroundColor: Colors.background.secondary,
    },
    pillActive: {
        backgroundColor: Colors.charcoal,
        borderColor: Colors.charcoal,
    },
    pillText: {
        fontSize: Typography.size.sm,
        color: Colors.text.primary,
    },
    pillTextActive: {
        color: Colors.paper,
        fontWeight: Typography.weight.semiBold,
    },
    causesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    causeChip: {
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.sm,
        borderRadius: BorderRadius.sm,
        borderWidth: 1,
        borderColor: Colors.border.light,
        backgroundColor: Colors.background.secondary,
    },
    causeChipActive: {
        backgroundColor: Colors.earthGreen,
        borderColor: Colors.earthGreen,
    },
    causeChipText: {
        fontSize: Typography.size.xs,
        color: Colors.text.primary,
        textTransform: 'capitalize',
    },
    causeChipTextActive: {
        color: Colors.paper,
        fontWeight: Typography.weight.semiBold,
    },
    actions: {
        marginTop: Spacing.md,
    },
    submitButton: {
        paddingVertical: Spacing.md,
    },
});

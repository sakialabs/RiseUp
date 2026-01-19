import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '../lib/design-tokens';
import { Button } from '../components/Button';

/**
 * GuideScreen - Help Flow
 * 
 * Simple, human language guide explaining RiseUp's purpose
 * Reference: docs/tone.md - No "bot" or AI language
 * Label: "Guide" or "Need help?" (NOT "bot")
 */

const GUIDE_STEPS = [
    {
        title: 'Welcome to RiseUp',
        emoji: '✊',
        content: `This is a tool for organizing real action in your community. Not for scrolling, not for clout, just real people doing the work together.

We're here to help you find events, show up, and build power with others who care.`,
        action: null,
    },
    {
        title: 'How It Works',
        emoji: '🗺️',
        content: `RiseUp is simple:

• Browse events in your area
• Join actions that matter to you
• Organize your own events
• Connect with others who show up

No algorithms. No ads. No metrics. Just people and action.`,
        action: null,
    },
    {
        title: 'Finding Actions',
        emoji: '📅',
        content: `Check the Community Feed to see what's happening nearby. Use the Map to find events with locations.

Events are tagged by cause: Racial Justice, Climate Justice, Workers Rights, and more. Find what speaks to you.`,
        action: { label: 'View Feed', route: '/feed' },
    },
    {
        title: 'Showing Up',
        emoji: '💪',
        content: `When you find an event, tap "Join" to let organizers know you're coming. They'll see you in the attendance list.

Showing up is how we build power. One event at a time.`,
        action: null,
    },
    {
        title: 'Creating Events',
        emoji: '🎯',
        content: `Ready to organize? Create your own event:

• Share what you're planning
• Set a time and place
• Tag the cause
• Watch people join

You don't need permission. You just need to start.`,
        action: { label: 'Create Event', route: '/events/new' },
    },
    {
        title: 'Community Guidelines',
        emoji: '🌟',
        content: `We're building this together:

• Love: Care in action. Look out for each other.
• Solidarity: We move together. No saviors.
• Empowerment: Every voice counts.

Use Support reactions to show appreciation. Share posts to spread the word.`,
        action: null,
    },
    {
        title: 'Ready to Get Started',
        emoji: '🚀',
        content: `You're all set. Browse the feed, find an event, or create your own.

This platform is just a tool. The real work happens when you show up.

Let's build power together.`,
        action: null,
    },
];

export default function GuideScreen() {
    const [currentStep, setCurrentStep] = useState(0);

    const step = GUIDE_STEPS[currentStep];
    const isLastStep = currentStep === GUIDE_STEPS.length - 1;
    const isFirstStep = currentStep === 0;

    const handleNext = () => {
        if (isLastStep) {
            router.back();
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleAction = () => {
        if (step.action?.route) {
            router.push(step.action.route as any);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    {GUIDE_STEPS.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.progressDot,
                                index === currentStep && styles.progressDotActive,
                                index < currentStep && styles.progressDotComplete,
                            ]}
                        />
                    ))}
                </View>

                {/* Step Content */}
                <View style={styles.stepContainer}>
                    <Text style={styles.emoji}>{step.emoji}</Text>
                    <Text style={styles.title}>{step.title}</Text>
                    <Text style={styles.content}>{step.content}</Text>

                    {step.action && (
                        <Button
                            title={step.action.label}
                            onPress={handleAction}
                            variant="secondary"
                            style={styles.actionButton}
                        />
                    )}
                </View>

                {/* Step Counter */}
                <Text style={styles.stepCounter}>
                    Step {currentStep + 1} of {GUIDE_STEPS.length}
                </Text>
            </ScrollView>

            {/* Navigation */}
            <View style={styles.navigation}>
                <Pressable
                    style={[styles.navButton, isFirstStep && styles.navButtonDisabled]}
                    onPress={handlePrevious}
                    disabled={isFirstStep}
                >
                    <Text style={[styles.navButtonText, isFirstStep && styles.navButtonTextDisabled]}>
                        ‹ Back
                    </Text>
                </Pressable>

                <Button
                    title={isLastStep ? 'Done' : 'Next'}
                    onPress={handleNext}
                    variant="primary"
                    style={styles.nextButton}
                />
            </View>
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
        padding: Spacing.lg,
        justifyContent: 'center',
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.xl,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.border.light,
    },
    progressDotActive: {
        backgroundColor: Colors.solidarityRed,
        width: 24,
    },
    progressDotComplete: {
        backgroundColor: Colors.earthGreen,
    },
    stepContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    emoji: {
        fontSize: 64,
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: Typography.size['2xl'],
        fontWeight: Typography.weight.bold,
        color: Colors.text.primary,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    content: {
        fontSize: Typography.size.base,
        lineHeight: Typography.size.base * Typography.lineHeight.relaxed,
        color: Colors.text.secondary,
        textAlign: 'center',
        maxWidth: 400,
    },
    actionButton: {
        marginTop: Spacing.lg,
        minWidth: 200,
    },
    stepCounter: {
        fontSize: Typography.size.sm,
        color: Colors.text.tertiary,
        textAlign: 'center',
        marginTop: Spacing.xl,
    },
    navigation: {
        flexDirection: 'row',
        padding: Spacing.md,
        gap: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.border.light,
        backgroundColor: Colors.background.secondary,
    },
    navButton: {
        flex: 1,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navButtonDisabled: {
        opacity: 0.3,
    },
    navButtonText: {
        fontSize: Typography.size.base,
        fontWeight: Typography.weight.semiBold,
        color: Colors.text.primary,
    },
    navButtonTextDisabled: {
        color: Colors.text.tertiary,
    },
    nextButton: {
        flex: 2,
        paddingVertical: Spacing.md,
    },
});

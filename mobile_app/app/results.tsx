/**
 * Results Screen - Full detection results modal
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../src/components/ui/Button';
import { DetectionResults } from '../src/components/DetectionResults';
import { useDetectionStore } from '../src/store/detectionStore';

export default function ResultsScreen() {
    const router = useRouter();
    const { currentImage, currentResult } = useDetectionStore();

    const handleShare = async () => {
        if (!currentResult) return;

        try {
            await Share.share({
                message: `Detection Results:\n${currentResult.detections.length} object(s) detected.\nModel: ${currentResult.model_name}\nInference time: ${currentResult.inference_time_ms.toFixed(0)}ms`,
            });
        } catch (error) {
            console.error('Share failed:', error);
        }
    };

    if (!currentResult) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>📭</Text>
                <Text style={styles.emptyTitle}>No Results</Text>
                <Text style={styles.emptyDescription}>
                    Run a detection first to see results here.
                </Text>
                <Button variant="primary" onPress={() => router.back()}>
                    Go Back
                </Button>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Image Preview */}
            {currentImage && (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: currentImage }} style={styles.image} />
                </View>
            )}

            {/* Detection Results */}
            <DetectionResults result={currentResult} />

            {/* Actions */}
            <View style={styles.actions}>
                <Button
                    variant="secondary"
                    onPress={handleShare}
                    style={styles.actionButton}
                >
                    📤 Share Results
                </Button>
                <Button
                    variant="primary"
                    onPress={() => router.back()}
                    style={styles.actionButton}
                >
                    Done
                </Button>
            </View>

            {/* Footer spacing */}
            <View style={styles.footer} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        paddingHorizontal: 16,
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#f8fafc',
        marginBottom: 8,
    },
    emptyDescription: {
        fontSize: 14,
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: 24,
    },
    imageContainer: {
        marginTop: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    actionButton: {
        flex: 1,
    },
    footer: {
        height: 40,
    },
});

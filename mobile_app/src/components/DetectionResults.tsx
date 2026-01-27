/**
 * DetectionResults Component with dynamic theme
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import type { PredictionResponse, Detection } from '../api/types';
import { formatConfidence, getConfidenceColor } from '../utils/formatUtils';
import { useTheme } from '../store/themeStore';

interface DetectionResultsProps {
    result: PredictionResponse;
}

function DetectionItem({ detection, index }: { detection: Detection; index: number }) {
    const theme = useTheme();
    const { colors } = theme;
    const confidencePercent = detection.confidence * 100;
    const color = getConfidenceColor(detection.confidence);

    return (
        <View style={[styles.detectionItem, { backgroundColor: colors.surfaceLight }]}>
            <View style={styles.detectionHeader}>
                <View style={[styles.indexBadge, { backgroundColor: `${colors.primary}15` }]}>
                    <Text style={[styles.indexText, { color: colors.primary }]}>{index + 1}</Text>
                </View>
                <View style={styles.detectionInfo}>
                    <Text style={[styles.className, { color: colors.text }]}>{detection.class_name}</Text>
                    <Text style={[styles.confidence, { color }]}>
                        {formatConfidence(detection.confidence)}
                    </Text>
                </View>
            </View>
            <View style={styles.progressContainer}>
                <View style={[styles.progressBackground, { backgroundColor: `${colors.primary}10` }]}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${confidencePercent}%`, backgroundColor: color },
                        ]}
                    />
                </View>
            </View>
        </View>
    );
}

export function DetectionResults({ result }: DetectionResultsProps) {
    const theme = useTheme();
    const { colors } = theme;
    const hasDetections = result.detections.length > 0;

    return (
        <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerIcon}>📊</Text>
                <Text style={[styles.title, { color: colors.text }]}>Analysis Results</Text>
            </View>

            {/* Stats */}
            <View style={[styles.statsRow, { backgroundColor: colors.surfaceLight }]}>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.text }]}>{result.detections.length}</Text>
                    <Text style={[styles.statLabel, { color: colors.textMuted }]}>Detections</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.text }]}>{(result.inference_time_ms ?? 0).toFixed(0)}</Text>
                    <Text style={[styles.statLabel, { color: colors.textMuted }]}>Time (ms)</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                <View style={styles.statItem}>
                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: hasDetections ? `${colors.danger}15` : `${colors.success}15` }
                    ]}>
                        <Text style={[
                            styles.statusText,
                            { color: hasDetections ? colors.danger : colors.success }
                        ]}>
                            {hasDetections ? '⚠️ Found' : '✅ Clear'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Detection List */}
            {hasDetections ? (
                <ScrollView
                    style={styles.detectionList}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                >
                    {result.detections.map((detection, index) => (
                        <DetectionItem
                            key={`${detection.class_name}-${index}`}
                            detection={detection}
                            index={index}
                        />
                    ))}
                </ScrollView>
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>🎉</Text>
                    <Text style={[styles.emptyTitle, { color: colors.success }]}>All Clear!</Text>
                    <Text style={[styles.emptyText, { color: colors.textMuted }]}>No objects detected in this image</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        padding: 20,
        marginTop: 16,
        borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    headerIcon: {
        fontSize: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statDivider: {
        width: 1,
        height: 36,
    },
    statusBadge: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '700',
    },
    detectionList: {
        maxHeight: 250,
    },
    detectionItem: {
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
    },
    detectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    indexBadge: {
        width: 28,
        height: 28,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    indexText: {
        fontSize: 13,
        fontWeight: '700',
    },
    detectionInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    className: {
        fontSize: 15,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    confidence: {
        fontSize: 15,
        fontWeight: '700',
    },
    progressContainer: {
        marginTop: 4,
    },
    progressBackground: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
    },
});

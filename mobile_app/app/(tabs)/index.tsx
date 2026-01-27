/**
 * Home Screen - Dashboard with dynamic theme
 */

import React, { useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDetectionStore } from '../../src/store/detectionStore';
import { useTheme } from '../../src/store/themeStore';
import { checkHealth } from '../../src/api/endpoints';
import { formatDate } from '../../src/utils/formatUtils';

const { width } = Dimensions.get('window');

interface FeatureCardProps {
    emoji: string;
    title: string;
    description: string;
    color: string;
    bgColor: string;
    textColor: string;
    mutedColor: string;
    onPress: () => void;
}

function FeatureCard({
    emoji,
    title,
    description,
    color,
    bgColor,
    textColor,
    mutedColor,
    onPress,
}: FeatureCardProps) {
    return (
        <TouchableOpacity
            style={[styles.featureCard, { backgroundColor: bgColor, borderColor: `${color}40` }]}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <View style={[styles.featureGlow, { backgroundColor: `${color}15` }]} />
            <View style={[styles.featureIconWrapper, { backgroundColor: `${color}20` }]}>
                <Text style={styles.featureEmoji}>{emoji}</Text>
            </View>
            <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: textColor }]}>{title}</Text>
                <Text style={[styles.featureDescription, { color: mutedColor }]}>{description}</Text>
            </View>
            <View style={[styles.featureArrowWrapper, { backgroundColor: `${color}20` }]}>
                <Text style={[styles.featureArrow, { color }]}>→</Text>
            </View>
        </TouchableOpacity>
    );
}

export default function HomeScreen() {
    const router = useRouter();
    const { isServerConnected, setServerConnected, history } = useDetectionStore();
    const theme = useTheme();
    const { colors } = theme;

    useEffect(() => {
        const checkConnection = async () => {
            const response = await checkHealth();
            setServerConnected(response.success);
        };
        checkConnection();
    }, [setServerConnected]);

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            showsVerticalScrollIndicator={false}
        >
            {/* Hero Section */}
            <View style={styles.hero}>
                <View style={[styles.heroGlow, { backgroundColor: colors.primaryGlow }]} />
                <View style={[styles.heroIconWrapper, {
                    backgroundColor: `${colors.primary}15`,
                    borderColor: `${colors.primary}30`,
                }]}>
                    <Text style={styles.heroEmoji}>✨</Text>
                </View>
                <Text style={[styles.heroTitle, { color: colors.text }]}>Mate Vision</Text>
                <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                    AI-powered detection for safety and security
                </Text>
                <View style={styles.heroBadges}>
                    <View style={[styles.badge, { backgroundColor: `${colors.primary}15` }]}>
                        <Text style={[styles.badgeText, { color: colors.primary }]}>🚗 Accidents</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: `${colors.secondary}15` }]}>
                        <Text style={[styles.badgeText, { color: colors.secondary }]}>🔫 Weapons</Text>
                    </View>
                </View>
            </View>

            {/* Server Status */}
            <View style={[styles.statusCard, {
                backgroundColor: colors.surfaceLight,
                borderColor: colors.border
            }]}>
                <View style={styles.statusHeader}>
                    <Text style={styles.statusIcon}>📡</Text>
                    <Text style={[styles.statusLabel, { color: colors.textMuted }]}>Server Status</Text>
                </View>
                <View style={styles.statusRow}>
                    <View style={styles.statusInfo}>
                        <View style={[
                            styles.statusDot,
                            { backgroundColor: isServerConnected ? colors.success : colors.danger }
                        ]} />
                        <Text style={[
                            styles.statusValue,
                            { color: isServerConnected ? colors.success : colors.danger }
                        ]}>
                            {isServerConnected ? 'Connected' : 'Disconnected'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.refreshButton, {
                            backgroundColor: `${colors.primary}15`,
                            borderColor: `${colors.primary}30`,
                        }]}
                        onPress={async () => {
                            const response = await checkHealth();
                            setServerConnected(response.success);
                        }}
                    >
                        <Text style={[styles.refreshText, { color: colors.primary }]}>↻ Refresh</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Feature Cards */}
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>🎯 Detection Models</Text>
            <FeatureCard
                emoji="🚗"
                title="Car Accident Detection"
                description="Analyze images for vehicle accidents"
                color={colors.primary}
                bgColor={colors.surfaceLight}
                textColor={colors.text}
                mutedColor={colors.textMuted}
                onPress={() => router.push('/car-accident')}
            />
            <FeatureCard
                emoji="🔫"
                title="Weapon Detection"
                description="Identify weapons for security"
                color={colors.secondary}
                bgColor={colors.surfaceLight}
                textColor={colors.text}
                mutedColor={colors.textMuted}
                onPress={() => router.push('/weapon')}
            />

            {/* Recent History */}
            {history.length > 0 && (
                <>
                    <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>📊 Recent Detections</Text>
                    {history.slice(0, 3).map((item) => (
                        <View key={item.id} style={[styles.historyCard, {
                            backgroundColor: colors.surfaceLight,
                            borderColor: colors.border,
                        }]}>
                            <View style={styles.historyRow}>
                                <View style={[styles.historyIconWrapper, { backgroundColor: `${colors.primary}10` }]}>
                                    <Text style={styles.historyIcon}>
                                        {item.type === 'car_accident' ? '🚗' : '🔫'}
                                    </Text>
                                </View>
                                <View style={styles.historyInfo}>
                                    <Text style={[styles.historyType, { color: colors.text }]}>
                                        {item.type === 'car_accident' ? 'Car Accident' : 'Weapon'} Detection
                                    </Text>
                                    <Text style={[styles.historyDate, { color: colors.textMuted }]}>
                                        {formatDate(item.timestamp)}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.historyBadge,
                                    { backgroundColor: item.result.detections.length > 0 ? `${colors.danger}15` : `${colors.success}15` }
                                ]}>
                                    <Text style={[
                                        styles.historyCount,
                                        { color: item.result.detections.length > 0 ? colors.danger : colors.success }
                                    ]}>
                                        {item.result.detections.length} found
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </>
            )}

            {/* Footer spacing */}
            <View style={styles.footer} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    hero: {
        alignItems: 'center',
        paddingVertical: 40,
        position: 'relative',
    },
    heroGlow: {
        position: 'absolute',
        top: 20,
        width: 250,
        height: 250,
        borderRadius: 125,
        opacity: 0.4,
    },
    heroIconWrapper: {
        width: 90,
        height: 90,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
    },
    heroEmoji: {
        fontSize: 44,
    },
    heroTitle: {
        fontSize: 36,
        fontWeight: '800',
        marginBottom: 10,
        letterSpacing: 1,
    },
    heroSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    heroBadges: {
        flexDirection: 'row',
        gap: 12,
    },
    badge: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 13,
        fontWeight: '600',
    },
    statusCard: {
        borderRadius: 20,
        padding: 18,
        marginBottom: 28,
        borderWidth: 1,
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
    },
    statusIcon: {
        fontSize: 16,
    },
    statusLabel: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    statusValue: {
        fontSize: 15,
        fontWeight: '700',
    },
    refreshButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    refreshText: {
        fontSize: 13,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 14,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    featureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    featureGlow: {
        position: 'absolute',
        right: -30,
        top: -30,
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    featureIconWrapper: {
        width: 54,
        height: 54,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    featureEmoji: {
        fontSize: 26,
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 13,
    },
    featureArrowWrapper: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureArrow: {
        fontSize: 18,
        fontWeight: '700',
    },
    historyCard: {
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
    },
    historyRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    historyIconWrapper: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    historyIcon: {
        fontSize: 20,
    },
    historyInfo: {
        flex: 1,
    },
    historyType: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 3,
    },
    historyDate: {
        fontSize: 12,
    },
    historyBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    historyCount: {
        fontSize: 12,
        fontWeight: '700',
    },
    footer: {
        height: 50,
    },
});

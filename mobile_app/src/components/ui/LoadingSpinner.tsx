/**
 * LoadingSpinner Component with dynamic theme
 */

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../store/themeStore';

interface LoadingSpinnerProps {
    message?: string;
    fullScreen?: boolean;
}

export function LoadingSpinner({
    message = 'Processing...',
    fullScreen = false,
}: LoadingSpinnerProps) {
    const theme = useTheme();
    const { colors } = theme;

    if (fullScreen) {
        return (
            <View style={[styles.fullScreenContainer, { backgroundColor: `${colors.background}f5` }]}>
                <View style={[styles.loaderCard, {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    shadowColor: colors.primary,
                }]}>
                    <View style={[styles.spinnerWrapper, { backgroundColor: `${colors.primary}10` }]}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                    <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={[styles.loaderCard, {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.primary,
            }]}>
                <View style={[styles.spinnerWrapper, { backgroundColor: `${colors.primary}10` }]}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
        alignItems: 'center',
    },
    fullScreenContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    loaderCard: {
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
    },
    spinnerWrapper: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    message: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
});

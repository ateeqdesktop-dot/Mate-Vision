/**
 * Card Component with dynamic theme
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../store/themeStore';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass';

interface CardProps {
    children: React.ReactNode;
    variant?: CardVariant;
    style?: ViewStyle;
}

export function Card({ children, variant = 'default', style }: CardProps) {
    const theme = useTheme();
    const { colors } = theme;

    const getVariantStyles = (): ViewStyle => {
        switch (variant) {
            case 'default':
                return {
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                };
            case 'elevated':
                return {
                    backgroundColor: colors.surface,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                    elevation: 6,
                    borderWidth: 1,
                    borderColor: colors.border,
                };
            case 'outlined':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderColor: `${colors.primary}30`,
                };
            case 'glass':
                return {
                    backgroundColor: `${colors.primary}08`,
                    borderWidth: 1,
                    borderColor: colors.border,
                };
            default:
                return {
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                };
        }
    };

    return (
        <View style={[styles.base, getVariantStyles(), style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: 20,
        padding: 18,
    },
});

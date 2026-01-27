/**
 * Button Component with dynamic theme
 */

import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    View,
} from 'react-native';
import { useTheme } from '../../store/themeStore';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    children: React.ReactNode;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export function Button({
    children,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    style,
    textStyle,
    icon,
}: ButtonProps) {
    const theme = useTheme();
    const { colors } = theme;

    const getVariantStyles = (): ViewStyle => {
        switch (variant) {
            case 'primary':
                return { backgroundColor: colors.primary, shadowColor: colors.primary };
            case 'secondary':
                return { backgroundColor: colors.secondary, shadowColor: colors.secondary };
            case 'danger':
                return { backgroundColor: colors.danger, shadowColor: colors.danger };
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderColor: `${colors.primary}30`,
                    shadowOpacity: 0,
                    elevation: 0,
                };
            default:
                return { backgroundColor: colors.primary };
        }
    };

    const getTextColor = (): string => {
        if (variant === 'ghost') return colors.primary;
        if (disabled) return colors.textMuted;
        return colors.text;
    };

    const getSizeStyles = (): ViewStyle => {
        switch (size) {
            case 'sm': return { paddingVertical: 10, paddingHorizontal: 18 };
            case 'md': return { paddingVertical: 16, paddingHorizontal: 28 };
            case 'lg': return { paddingVertical: 20, paddingHorizontal: 36 };
            default: return { paddingVertical: 16, paddingHorizontal: 28 };
        }
    };

    const getTextSize = (): number => {
        switch (size) {
            case 'sm': return 14;
            case 'md': return 16;
            case 'lg': return 18;
            default: return 16;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.base,
                getSizeStyles(),
                getVariantStyles(),
                disabled && { backgroundColor: colors.surface, opacity: 0.5 },
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.85}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} size="small" />
            ) : (
                <View style={styles.content}>
                    {icon}
                    <Text style={[
                        styles.text,
                        { color: getTextColor(), fontSize: getTextSize() },
                        textStyle,
                    ]}>
                        {children}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        gap: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    text: {
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});

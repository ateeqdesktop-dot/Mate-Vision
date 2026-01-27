/**
 * Tabs Layout - Bottom tab navigation with theme support
 */

import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useDetectionStore } from '../../src/store/detectionStore';
import { useTheme } from '../../src/store/themeStore';

type TabIconProps = {
    focused: boolean;
    emoji: string;
    label: string;
    activeColor: string;
    inactiveColor: string;
};

function TabIcon({ focused, emoji, label, activeColor, inactiveColor }: TabIconProps) {
    return (
        <View style={styles.tabIcon}>
            <View style={[
                styles.iconWrapper,
                focused && { backgroundColor: `${activeColor}20` }
            ]}>
                <Text style={[styles.emoji, { opacity: focused ? 1 : 0.5 }]}>{emoji}</Text>
            </View>
            <Text style={[
                styles.label,
                { color: focused ? activeColor : inactiveColor }
            ]}>
                {label}
            </Text>
        </View>
    );
}

function ServerStatusIndicator() {
    const isServerConnected = useDetectionStore((state) => state.isServerConnected);
    const theme = useTheme();

    return (
        <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: `${theme.colors.text}10` }]}>
                <View
                    style={[
                        styles.statusDot,
                        { backgroundColor: isServerConnected ? theme.colors.success : theme.colors.danger }
                    ]}
                />
                <Text style={[
                    styles.statusText,
                    { color: isServerConnected ? theme.colors.success : theme.colors.danger }
                ]}>
                    {isServerConnected ? 'Online' : 'Offline'}
                </Text>
            </View>
        </View>
    );
}

export default function TabsLayout() {
    const theme = useTheme();
    const { colors } = theme;

    return (
        <Tabs
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.background,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 18,
                    letterSpacing: 0.5,
                },
                headerRight: () => <ServerStatusIndicator />,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    height: 90,
                    paddingBottom: 24,
                    paddingTop: 10,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                    elevation: 8,
                },
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: '✨ Mate Vision',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            emoji="🏠"
                            label="Home"
                            activeColor={colors.secondary}
                            inactiveColor={colors.textMuted}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="car-accident"
                options={{
                    title: '🚗 Car Accident',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            emoji="🚗"
                            label="Accidents"
                            activeColor={colors.primary}
                            inactiveColor={colors.textMuted}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="weapon"
                options={{
                    title: '🔫 Weapon',
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            emoji="🔫"
                            label="Weapons"
                            activeColor={colors.danger}
                            inactiveColor={colors.textMuted}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emoji: {
        fontSize: 20,
    },
    label: {
        fontSize: 10,
        fontWeight: '600',
    },
    statusContainer: {
        marginRight: 16,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
});

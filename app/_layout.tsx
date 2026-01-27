/**
 * Root Layout - App wrapper with navigation
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useDetectionStore } from '../src/store/detectionStore';
import { checkHealth } from '../src/api/endpoints';

export default function RootLayout() {
    const setServerConnected = useDetectionStore(
        (state) => state.setServerConnected
    );

    // Check server connection on mount
    useEffect(() => {
        const checkConnection = async () => {
            const response = await checkHealth();
            setServerConnected(response.success);
        };
        checkConnection();

        // Recheck every 30 seconds
        const interval = setInterval(checkConnection, 30000);
        return () => clearInterval(interval);
    }, [setServerConnected]);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#0f172a',
                    },
                    headerTintColor: '#f8fafc',
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                    contentStyle: {
                        backgroundColor: '#0f172a',
                    },
                }}
            >
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="results"
                    options={{
                        title: 'Detection Results',
                        presentation: 'modal',
                    }}
                />
            </Stack>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
});

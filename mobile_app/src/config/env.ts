/**
 * Environment configuration for the app
 */

import { Platform } from 'react-native';

// Default API URL for development
const DEV_API_URL = 'http://localhost:8000';

/**
 * App configuration
 */
export const config = {
    /**
     * API base URL - uses environment variable or defaults to empty string for relative paths
     * If platform is not web and env is missing, falls back to dev url
     */
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? (Platform.OS === 'web' ? '' : DEV_API_URL),

    /**
     * API timeout in milliseconds
     */
    timeout: 30000,

    /**
     * API version prefix
     */
    apiPrefix: '/api/v1',

    /**
     * Detection endpoints
     */
    endpoints: {
        carAccident: '/predict/car-accident',
        weapon: '/predict/weapon',
        models: '/models',
        health: '/health',
    },
} as const;

/**
 * Get the full API URL for an endpoint
 */
export function getApiUrl(endpoint: string): string {
    return `${config.apiUrl}${config.apiPrefix}${endpoint}`;
}

/**
 * Get the base health URL (no prefix)
 */
export function getHealthUrl(): string {
    return `${config.apiUrl}${config.endpoints.health}`;
}

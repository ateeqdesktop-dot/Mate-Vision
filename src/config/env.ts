/**
 * Environment configuration for the app
 */

import { Platform } from 'react-native';

// Default API URL for development
const DEV_API_URL = 'http://localhost:8000';
// Hosted API URL
const PROD_API_URL = 'https://mate-vision.onrender.com';

/**
 * App configuration
 */
export const config = {
    /**
     * API base URL - uses environment variable or defaults to production URL
     * If platform is web and EXPO_PUBLIC_API_URL is explicitly empty, it uses relative paths (for self-hosted Docker)
     */
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? PROD_API_URL,

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

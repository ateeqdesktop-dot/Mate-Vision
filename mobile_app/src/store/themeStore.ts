/**
 * Theme Store - Static Theme Hook
 * Simplified for single theme usage
 */

import { defaultTheme } from '../config/themes';

// Hook to get current theme colors
// Kept as a hook to minimize refactoring in components
export function useTheme() {
    return defaultTheme;
}

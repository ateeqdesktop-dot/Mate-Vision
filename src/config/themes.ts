/**
 * Theme Definitions - Single Static Theme
 */

export interface ThemeColors {
    background: string;
    surface: string;
    surfaceLight: string;
    primary: string;
    primaryGlow: string;
    secondary: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    success: string;
    warning: string;
    danger: string;
    border: string;
}

export interface Theme {
    id: string;
    name: string;
    colors: ThemeColors;
}

// Deep Ocean Theme (Updated based on user request)
export const defaultTheme: Theme = {
    id: 'deep-ocean',
    name: 'Deep Ocean',
    colors: {
        background: '#021024',      // Very Dark Navy
        surface: '#052659',         // Deep Blue
        surfaceLight: '#0a3575',    // Lighter Blue (derived)
        primary: '#5483B3',         // Steel Blue
        primaryGlow: 'rgba(84, 131, 179, 0.3)',
        secondary: '#7DA0CA',       // Light Steel Blue
        text: '#C1E8FF',            // Pale Blue
        textSecondary: '#7DA0CA',
        textMuted: '#5483B3',
        success: '#5483B3',         // Using palette colors as requested
        warning: '#7DA0CA',
        danger: '#CF4B4B',          // Keeping a semantic red for safety but muted to match
        border: 'rgba(84, 131, 179, 0.3)',
    },
};

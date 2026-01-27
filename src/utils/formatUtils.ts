/**
 * Format utilities
 */

/**
 * Format confidence as percentage
 */
export function formatConfidence(confidence: number): string {
    return `${(confidence * 100).toFixed(1)}%`;
}

/**
 * Format inference time
 */
export function formatInferenceTime(ms: number): string {
    if (ms < 1000) {
        return `${ms.toFixed(0)}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

/**
 * Get color for confidence level
 */
export function getConfidenceColor(confidence: number): string {
    if (confidence >= 0.8) return '#10b981'; // Green
    if (confidence >= 0.5) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format class name for display (replaces underscores with spaces)
 */
export function formatClassName(name: string): string {
    return capitalize(name.replace(/_/g, ' '));
}

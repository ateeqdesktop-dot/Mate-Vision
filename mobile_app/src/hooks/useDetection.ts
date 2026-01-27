/**
 * Custom hook for detection operations
 */

import { useCallback } from 'react';
import { useDetectionStore } from '../store/detectionStore';
import { runDetection, checkHealth } from '../api/endpoints';
import { apiClient } from '../api/client';
import type { DetectionType } from '../api/types';

/**
 * Hook for running detections
 */
export function useDetection() {
    const {
        currentImage,
        currentResult,
        isLoading,
        error,
        isServerConnected,
        setCurrentImage,
        setCurrentResult,
        setLoading,
        setError,
        setServerConnected,
        setServerUrl,
        addToHistory,
    } = useDetectionStore();

    /**
     * Run detection on the current image
     */
    const detect = useCallback(
        async (type: DetectionType) => {
            if (!currentImage) {
                setError('No image selected');
                return null;
            }

            setLoading(true);
            setError(null);

            const response = await runDetection(currentImage, type);

            if (response.success) {
                setCurrentResult(response.data);
                addToHistory({
                    type,
                    imageUri: currentImage,
                    result: response.data,
                });
                setLoading(false);
                return response.data;
            } else {
                setError(response.error);
                setLoading(false);
                return null;
            }
        },
        [currentImage, setLoading, setError, setCurrentResult, addToHistory]
    );

    /**
     * Check server health and update connection status
     */
    const checkConnection = useCallback(async () => {
        const response = await checkHealth();
        setServerConnected(response.success);
        return response.success;
    }, [setServerConnected]);

    /**
     * Update server URL and recheck connection
     */
    const updateServerUrl = useCallback(
        async (url: string) => {
            apiClient.setBaseUrl(url);
            setServerUrl(url);
            return checkConnection();
        },
        [setServerUrl, checkConnection]
    );

    /**
     * Clear current detection
     */
    const clearDetection = useCallback(() => {
        setCurrentImage(null);
        setCurrentResult(null);
        setError(null);
    }, [setCurrentImage, setCurrentResult, setError]);

    return {
        // State
        currentImage,
        currentResult,
        isLoading,
        error,
        isServerConnected,

        // Actions
        setCurrentImage,
        detect,
        checkConnection,
        updateServerUrl,
        clearDetection,
    };
}

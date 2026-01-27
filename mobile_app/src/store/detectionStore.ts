/**
 * Detection Store - Global state management using Zustand
 */

import { create } from 'zustand';
import type { PredictionResponse, DetectionType } from '../api/types';

/**
 * Detection history item
 */
export interface DetectionHistoryItem {
    id: string;
    type: DetectionType;
    imageUri: string;
    result: PredictionResponse;
    timestamp: Date;
}

/**
 * Detection store state
 */
interface DetectionState {
    // Current detection
    currentImage: string | null;
    currentResult: PredictionResponse | null;
    isLoading: boolean;
    error: string | null;

    // Server status
    isServerConnected: boolean;
    serverUrl: string;

    // History
    history: DetectionHistoryItem[];

    // Actions
    setCurrentImage: (uri: string | null) => void;
    setCurrentResult: (result: PredictionResponse | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setServerConnected: (connected: boolean) => void;
    setServerUrl: (url: string) => void;
    addToHistory: (item: Omit<DetectionHistoryItem, 'id' | 'timestamp'>) => void;
    clearHistory: () => void;
    reset: () => void;
}

/**
 * Generate unique ID
 */
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Initial state
 */
const initialState = {
    currentImage: null,
    currentResult: null,
    isLoading: false,
    error: null,
    isServerConnected: false,
    serverUrl: 'http://localhost:8000',
    history: [],
};

/**
 * Detection store
 */
export const useDetectionStore = create<DetectionState>((set) => ({
    ...initialState,

    setCurrentImage: (uri) => set({ currentImage: uri, error: null }),

    setCurrentResult: (result) => set({ currentResult: result }),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error, isLoading: false }),

    setServerConnected: (connected) => set({ isServerConnected: connected }),

    setServerUrl: (url) => set({ serverUrl: url }),

    addToHistory: (item) =>
        set((state) => ({
            history: [
                {
                    ...item,
                    id: generateId(),
                    timestamp: new Date(),
                },
                ...state.history,
            ].slice(0, 50), // Keep last 50 items
        })),

    clearHistory: () => set({ history: [] }),

    reset: () => set(initialState),
}));

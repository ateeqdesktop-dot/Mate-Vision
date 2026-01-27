/**
 * API Endpoints - Functions for calling backend API
 */

import { apiClient, ApiError } from './client';
import { config } from '../config/env';
import type {
    PredictionResponse,
    ModelsResponse,
    HealthResponse,
    ApiResponse,
    DetectionType,
} from './types';

/**
 * Create FormData from image URI
 */
import { Platform } from 'react-native';

/**
 * Create FormData from image URI
 */
async function createImageFormData(imageUri: string): Promise<FormData> {
    const formData = new FormData();

    if (Platform.OS === 'web') {
        // On web, fetching the URI retrieves the blob
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const fileExtension = blob.type === 'image/png' ? 'png' : 'jpg';
        // Cast to any to handle web-specific FormData.append with 3 args
        (formData as any).append('file', blob, `image.${fileExtension}`);
    } else {
        // On native, we pass the file object
        const uriParts = imageUri.split('.');
        const fileExtension = uriParts[uriParts.length - 1] || 'jpg';

        // Determine MIME type
        const mimeType =
            fileExtension.toLowerCase() === 'png' ? 'image/png' : 'image/jpeg';

        // Create the file object for React Native
        const file = {
            uri: imageUri,
            name: `image.${fileExtension}`,
            type: mimeType,
        } as unknown as Blob;

        formData.append('file', file);
    }

    return formData;
}

/**
 * Run car accident detection on an image
 */
export async function predictCarAccident(
    imageUri: string
): Promise<ApiResponse<PredictionResponse>> {
    try {
        const formData = await createImageFormData(imageUri);
        const response = await apiClient.postFormData<PredictionResponse>(
            `${config.apiPrefix}${config.endpoints.carAccident}`,
            formData
        );
        return { success: true, data: response };
    } catch (error) {
        const message =
            error instanceof ApiError ? error.message : 'Detection failed';
        return { success: false, error: message };
    }
}

/**
 * Run weapon detection on an image
 */
export async function predictWeapon(
    imageUri: string
): Promise<ApiResponse<PredictionResponse>> {
    try {
        const formData = await createImageFormData(imageUri);
        const response = await apiClient.postFormData<PredictionResponse>(
            `${config.apiPrefix}${config.endpoints.weapon}`,
            formData
        );
        return { success: true, data: response };
    } catch (error) {
        const message =
            error instanceof ApiError ? error.message : 'Detection failed';
        return { success: false, error: message };
    }
}

/**
 * Generic detection function based on type
 */
export async function runDetection(
    imageUri: string,
    type: DetectionType
): Promise<ApiResponse<PredictionResponse>> {
    if (type === 'car_accident') {
        return predictCarAccident(imageUri);
    }
    return predictWeapon(imageUri);
}

/**
 * Get list of available models
 */
export async function getModels(): Promise<ApiResponse<ModelsResponse>> {
    try {
        const response = await apiClient.get<ModelsResponse>(
            `${config.apiPrefix}${config.endpoints.models}`
        );
        return { success: true, data: response };
    } catch (error) {
        const message =
            error instanceof ApiError ? error.message : 'Failed to fetch models';
        return { success: false, error: message };
    }
}

/**
 * Check server health
 */
export async function checkHealth(): Promise<ApiResponse<HealthResponse>> {
    try {
        const response = await apiClient.get<HealthResponse>(
            config.endpoints.health
        );
        return { success: true, data: response };
    } catch (error) {
        const message =
            error instanceof ApiError ? error.message : 'Health check failed';
        return { success: false, error: message };
    }
}

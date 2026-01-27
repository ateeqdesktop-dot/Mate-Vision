/**
 * API Types - Matching FastAPI backend schemas
 */

/**
 * Bounding box coordinates for detected objects
 */
export interface BoundingBox {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

/**
 * Single detection result from the model
 */
export interface Detection {
    bbox: BoundingBox;
    confidence: number;
    class_id: number;
    class_name: string;
}

/**
 * Prediction response from the server
 */
export interface PredictionResponse {
    success: boolean;
    model_name: string;
    detections: Detection[];
    inference_time_ms: number;
    image_width: number;
    image_height: number;
}

/**
 * Error response from the server
 */
export interface ErrorResponse {
    success: false;
    error: string;
    detail?: string;
}

/**
 * Models list response
 */
export interface ModelsResponse {
    models: string[];
}

/**
 * Health check response
 */
export interface HealthResponse {
    status: 'healthy' | 'unhealthy';
    service?: string;
    models_loaded?: string[];
}

/**
 * Detection type enum
 */
export type DetectionType = 'car_accident' | 'weapon';

/**
 * Detection request with image
 */
export interface DetectionRequest {
    imageUri: string;
    type: DetectionType;
}

/**
 * API response wrapper for consistent error handling
 */
export type ApiResponse<T> =
    | { success: true; data: T }
    | { success: false; error: string };

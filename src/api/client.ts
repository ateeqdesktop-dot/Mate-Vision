/**
 * API Client - Handles all HTTP communication with the backend
 */

import { config } from '../config/env';

/**
 * Request options for API calls
 */
interface RequestOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: FormData | string;
    timeout?: number;
}

/**
 * API Error class for consistent error handling
 */
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public details?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Base API client class
 */
class ApiClient {
    private baseUrl: string;
    private timeout: number;

    constructor() {
        this.baseUrl = config.apiUrl;
        this.timeout = config.timeout;
    }

    /**
     * Update the base URL (useful for changing server)
     */
    setBaseUrl(url: string) {
        this.baseUrl = url;
    }

    /**
     * Get the current base URL
     */
    getBaseUrl(): string {
        return this.baseUrl;
    }

    /**
     * Make an HTTP request with timeout handling
     */
    private async request<T>(
        endpoint: string,
        options: RequestOptions
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(
            () => controller.abort(),
            options.timeout || this.timeout
        );

        try {
            const response = await fetch(url, {
                method: options.method,
                headers: options.headers,
                body: options.body,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                let errorMessage = `HTTP error ${response.status}`;

                if (typeof errorData.detail === 'string') {
                    errorMessage = errorData.detail;
                } else if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
                    // Handle FastAPI validation errors (array of objects)
                    const firstError = errorData.detail[0];
                    errorMessage = firstError.msg ? `${firstError.loc?.join('.')} ${firstError.msg}` : JSON.stringify(errorData.detail);
                } else if (errorData.detail) {
                    errorMessage = JSON.stringify(errorData.detail);
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                }

                throw new ApiError(
                    errorMessage,
                    response.status,
                    JSON.stringify(errorData)
                );
            }

            return response.json();
        } catch (error) {
            clearTimeout(timeoutId);

            if (error instanceof ApiError) {
                throw error;
            }

            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new ApiError('Request timeout', 408);
                }
                throw new ApiError(error.message);
            }

            throw new ApiError('Unknown error occurred');
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });
    }

    /**
     * POST request with JSON body
     */
    async postJson<T>(endpoint: string, data: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    /**
     * POST request with FormData (for file uploads)
     */
    async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                // Don't set Content-Type for FormData - browser will set it with boundary
            },
            body: formData,
        });
    }
}

/**
 * Singleton API client instance
 */
export const apiClient = new ApiClient();

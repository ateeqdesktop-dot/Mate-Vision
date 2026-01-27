/**
 * Image utilities
 */

import type { BoundingBox } from '../api/types';

/**
 * Calculate scaled bounding box coordinates
 */
export function scaleBoundingBox(
    bbox: BoundingBox,
    originalWidth: number,
    originalHeight: number,
    displayWidth: number,
    displayHeight: number
): BoundingBox {
    const scaleX = displayWidth / originalWidth;
    const scaleY = displayHeight / originalHeight;

    return {
        x1: bbox.x1 * scaleX,
        y1: bbox.y1 * scaleY,
        x2: bbox.x2 * scaleX,
        y2: bbox.y2 * scaleY,
    };
}

/**
 * Get bounding box dimensions
 */
export function getBoundingBoxDimensions(bbox: BoundingBox) {
    return {
        width: bbox.x2 - bbox.x1,
        height: bbox.y2 - bbox.y1,
        centerX: (bbox.x1 + bbox.x2) / 2,
        centerY: (bbox.y1 + bbox.y2) / 2,
    };
}

/**
 * Calculate aspect ratio
 */
export function getAspectRatio(width: number, height: number): number {
    return width / height;
}

/**
 * Fit image dimensions to container while maintaining aspect ratio
 */
export function fitToContainer(
    imageWidth: number,
    imageHeight: number,
    containerWidth: number,
    containerHeight: number
): { width: number; height: number } {
    const imageRatio = imageWidth / imageHeight;
    const containerRatio = containerWidth / containerHeight;

    if (imageRatio > containerRatio) {
        // Image is wider - fit to width
        return {
            width: containerWidth,
            height: containerWidth / imageRatio,
        };
    } else {
        // Image is taller - fit to height
        return {
            width: containerHeight * imageRatio,
            height: containerHeight,
        };
    }
}

/**
 * Custom hook for camera operations
 */

import { useState, useCallback } from 'react';
import { CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

/**
 * Camera hook return type
 */
interface UseCameraReturn {
    facing: CameraType;
    toggleFacing: () => void;
    requestPermission: () => Promise<boolean>;
    pickFromGallery: () => Promise<string | null>;
    hasPermission: boolean | null;
}

/**
 * Hook for camera operations
 */
export function useCamera(): UseCameraReturn {
    const [facing, setFacing] = useState<CameraType>('back');
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    /**
     * Toggle camera facing (front/back)
     */
    const toggleFacing = useCallback(() => {
        setFacing((current) => (current === 'back' ? 'front' : 'back'));
    }, []);

    /**
     * Request camera and media library permissions
     */
    const requestPermission = useCallback(async () => {
        const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
        const mediaResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const granted = cameraResult.granted && mediaResult.granted;
        setHasPermission(granted);
        return granted;
    }, []);

    /**
     * Pick image from gallery
     */
    const pickFromGallery = useCallback(async (): Promise<string | null> => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.9,
        });

        if (!result.canceled && result.assets[0]) {
            return result.assets[0].uri;
        }

        return null;
    }, []);

    return {
        facing,
        toggleFacing,
        requestPermission,
        pickFromGallery,
        hasPermission,
    };
}

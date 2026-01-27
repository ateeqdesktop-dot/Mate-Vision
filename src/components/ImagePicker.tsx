/**
 * ImagePicker Component with dynamic theme
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Dimensions,
} from 'react-native';
import * as ImagePickerLib from 'expo-image-picker';
import { Button } from './ui/Button';
import { useTheme } from '../store/themeStore';

const { width } = Dimensions.get('window');
const SQUARE_SIZE = width - 32;

interface ImagePickerProps {
    imageUri: string | null;
    onImageSelected: (uri: string) => void;
    onClear?: () => void;
}

export function ImagePicker({
    imageUri,
    onImageSelected,
    onClear,
}: ImagePickerProps) {
    const [isLoading, setIsLoading] = useState(false);
    const theme = useTheme();
    const { colors } = theme;

    const requestPermissions = async () => {
        const cameraResult = await ImagePickerLib.requestCameraPermissionsAsync();
        const mediaResult = await ImagePickerLib.requestMediaLibraryPermissionsAsync();

        if (!cameraResult.granted || !mediaResult.granted) {
            Alert.alert(
                'Permissions Required',
                'Camera and photo library permissions are needed to select images.',
                [{ text: 'OK' }]
            );
            return false;
        }
        return true;
    };

    const pickFromGallery = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        setIsLoading(true);
        try {
            const result = await ImagePickerLib.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.9,
            });

            if (!result.canceled && result.assets[0]) {
                onImageSelected(result.assets[0].uri);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const takePhoto = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        setIsLoading(true);
        try {
            const result = await ImagePickerLib.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.9,
            });

            if (!result.canceled && result.assets[0]) {
                onImageSelected(result.assets[0].uri);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (imageUri) {
        return (
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                    <View style={[styles.imageOverlay, { borderColor: `${colors.primary}60` }]} />
                    {onClear && (
                        <TouchableOpacity
                            style={[styles.clearButton, { backgroundColor: colors.primary }]}
                            onPress={onClear}
                        >
                            <Text style={[styles.clearText, { color: colors.text }]}>✕</Text>
                        </TouchableOpacity>
                    )}
                    <View style={[styles.cornerTL, { borderColor: colors.primary }]} />
                    <View style={[styles.cornerTR, { borderColor: colors.secondary }]} />
                    <View style={[styles.cornerBL, { borderColor: colors.secondary }]} />
                    <View style={[styles.cornerBR, { borderColor: colors.primary }]} />
                </View>
                <View style={styles.buttonRow}>
                    <Button variant="ghost" size="sm" onPress={pickFromGallery}>
                        🔄 Change Image
                    </Button>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.placeholder, {
                    backgroundColor: `${colors.primary}08`,
                    borderColor: `${colors.primary}30`,
                }]}
                onPress={pickFromGallery}
                activeOpacity={0.8}
            >
                <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                    <Text style={styles.placeholderIcon}>📷</Text>
                </View>
                <Text style={[styles.placeholderTitle, { color: colors.text }]}>Upload Image</Text>
                <Text style={[styles.placeholderText, { color: colors.primary }]}>Tap to select from gallery</Text>
                <View style={[styles.cornerTL, { borderColor: colors.primary }]} />
                <View style={[styles.cornerTR, { borderColor: colors.secondary }]} />
                <View style={[styles.cornerBL, { borderColor: colors.secondary }]} />
                <View style={[styles.cornerBR, { borderColor: colors.primary }]} />
            </TouchableOpacity>
            <View style={styles.buttonRow}>
                <Button
                    variant="primary"
                    onPress={pickFromGallery}
                    loading={isLoading}
                    style={styles.button}
                >
                    🖼️ Gallery
                </Button>
                <Button
                    variant="secondary"
                    onPress={takePhoto}
                    loading={isLoading}
                    style={styles.button}
                >
                    📸 Camera
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    placeholder: {
        width: SQUARE_SIZE,
        height: SQUARE_SIZE,
        maxWidth: 400,
        maxHeight: 400,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',
        position: 'relative',
        overflow: 'hidden',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    placeholderIcon: {
        fontSize: 36,
    },
    placeholderTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    placeholderText: {
        fontSize: 14,
        fontWeight: '500',
    },
    imageContainer: {
        position: 'relative',
        borderRadius: 24,
        overflow: 'hidden',
        width: SQUARE_SIZE,
        height: SQUARE_SIZE,
        maxWidth: 400,
        maxHeight: 400,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
        resizeMode: 'cover',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderWidth: 3,
        borderRadius: 24,
    },
    clearButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    clearText: {
        fontSize: 18,
        fontWeight: '700',
    },
    cornerTL: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 40,
        height: 40,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderTopLeftRadius: 24,
    },
    cornerTR: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 40,
        height: 40,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderTopRightRadius: 24,
    },
    cornerBL: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 40,
        height: 40,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderBottomLeftRadius: 24,
    },
    cornerBR: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 40,
        height: 40,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderBottomRightRadius: 24,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        gap: 16,
    },
    button: {
        flex: 1,
        maxWidth: 180,
    },
});

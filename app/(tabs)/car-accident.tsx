/**
 * Car Accident Detection Screen with dynamic theme
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { Button } from '../../src/components/ui/Button';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';
import { ImagePicker } from '../../src/components/ImagePicker';
import { DetectionResults } from '../../src/components/DetectionResults';
import { BoundingBoxOverlay } from '../../src/components/BoundingBoxOverlay';
import { useDetection } from '../../src/hooks/useDetection';
import { useTheme } from '../../src/store/themeStore';

const { width } = Dimensions.get('window');

export default function CarAccidentScreen() {
    const {
        currentImage,
        currentResult,
        isLoading,
        error,
        isServerConnected,
        setCurrentImage,
        detect,
        clearDetection,
    } = useDetection();

    const theme = useTheme();
    const { colors } = theme;

    const [displayDimensions, setDisplayDimensions] = useState({
        width: 0,
        height: 0,
    });

    const handleDetect = async () => {
        await detect('car_accident');
    };

    const handleImageLayout = (event: { nativeEvent: { layout: { width: number; height: number } } }) => {
        const { width, height } = event.nativeEvent.layout;
        setDisplayDimensions({ width, height });
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            showsVerticalScrollIndicator={false}
        >
            {/* Header with Gradient Effect */}
            <View style={styles.header}>
                <View style={[styles.headerGlow, { backgroundColor: colors.primaryGlow }]} />
                <View style={[styles.iconContainer, {
                    backgroundColor: `${colors.primary}15`,
                    borderColor: `${colors.primary}30`,
                }]}>
                    <Text style={styles.headerEmoji}>🚗</Text>
                </View>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Car Accident Detection</Text>
                <Text style={[styles.headerDescription, { color: colors.textMuted }]}>
                    AI-powered analysis to detect vehicle accidents in images
                </Text>
            </View>

            {/* Connection Warning */}
            {!isServerConnected && (
                <View style={[styles.warningBanner, {
                    backgroundColor: `${colors.warning}10`,
                    borderColor: `${colors.warning}30`,
                }]}>
                    <Text style={styles.warningIcon}>⚠️</Text>
                    <Text style={[styles.warningText, { color: colors.warning }]}>
                        Server is offline. Detection unavailable.
                    </Text>
                </View>
            )}

            {/* Image Picker */}
            <View style={styles.section}>
                <ImagePicker
                    imageUri={currentImage}
                    onImageSelected={setCurrentImage}
                    onClear={clearDetection}
                />
            </View>

            {/* Image with Bounding Boxes */}
            {currentImage && currentResult && currentResult.detections.length > 0 && (
                <View style={[styles.imageWithOverlay, { borderColor: `${colors.primary}30` }]}>
                    <Image
                        source={{ uri: currentImage }}
                        style={styles.resultImage}
                        onLayout={handleImageLayout}
                    />
                    {displayDimensions.width > 0 && (
                        <BoundingBoxOverlay
                            detections={currentResult.detections}
                            imageWidth={currentResult.image_width}
                            imageHeight={currentResult.image_height}
                            displayWidth={displayDimensions.width}
                            displayHeight={displayDimensions.height}
                        />
                    )}
                </View>
            )}

            {/* Error Message */}
            {error && (
                <View style={[styles.errorBanner, {
                    backgroundColor: `${colors.danger}10`,
                    borderColor: `${colors.danger}30`,
                }]}>
                    <Text style={styles.errorIcon}>❌</Text>
                    <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
                </View>
            )}

            {/* Detect Button */}
            {currentImage && (
                <View style={styles.section}>
                    <Button
                        variant="primary"
                        size="lg"
                        onPress={handleDetect}
                        loading={isLoading}
                        disabled={!isServerConnected}
                        style={styles.detectButton}
                    >
                        {isLoading ? '⏳ Analyzing...' : '🔍 Detect Accidents'}
                    </Button>
                </View>
            )}

            {/* Loading State */}
            {isLoading && <LoadingSpinner message="Scanning for accidents..." />}

            {/* Results */}
            {currentResult && <DetectionResults result={currentResult} />}

            {/* Footer spacing */}
            <View style={styles.footer} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 32,
        position: 'relative',
    },
    headerGlow: {
        position: 'absolute',
        top: 0,
        width: 200,
        height: 200,
        borderRadius: 100,
        opacity: 0.3,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
    },
    headerEmoji: {
        fontSize: 40,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        marginBottom: 10,
        letterSpacing: 0.5,
    },
    headerDescription: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: 300,
    },
    section: {
        marginBottom: 20,
    },
    warningBanner: {
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 16,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
    },
    warningIcon: {
        fontSize: 18,
    },
    warningText: {
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    errorBanner: {
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 16,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
    },
    errorIcon: {
        fontSize: 18,
    },
    errorText: {
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    imageWithOverlay: {
        position: 'relative',
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
    },
    resultImage: {
        width: '100%',
        aspectRatio: 1,
        resizeMode: 'cover',
    },
    detectButton: {
        width: '100%',
    },
    footer: {
        height: 50,
    },
});

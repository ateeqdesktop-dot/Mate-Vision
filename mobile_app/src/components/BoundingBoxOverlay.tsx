/**
 * BoundingBoxOverlay Component - Draw detection boxes over image
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import type { Detection } from '../api/types';
import { scaleBoundingBox } from '../utils/imageUtils';
import { getConfidenceColor, formatClassName } from '../utils/formatUtils';

interface BoundingBoxOverlayProps {
    detections: Detection[];
    imageWidth: number;
    imageHeight: number;
    displayWidth: number;
    displayHeight: number;
}

interface BoxLabelProps {
    detection: Detection;
    x: number;
    y: number;
}

function BoxLabel({ detection, x, y }: BoxLabelProps) {
    const color = getConfidenceColor(detection.confidence);

    return (
        <View style={[styles.label, { left: x, top: y - 24, borderColor: color }]}>
            <Text style={styles.labelText}>
                {formatClassName(detection.class_name)} (
                {(detection.confidence * 100).toFixed(0)}%)
            </Text>
        </View>
    );
}

export function BoundingBoxOverlay({
    detections,
    imageWidth,
    imageHeight,
    displayWidth,
    displayHeight,
}: BoundingBoxOverlayProps) {
    return (
        <View style={[styles.container, { width: displayWidth, height: displayHeight }]}>
            <Svg width={displayWidth} height={displayHeight}>
                {detections.map((detection, index) => {
                    const scaledBox = scaleBoundingBox(
                        detection.bbox,
                        imageWidth,
                        imageHeight,
                        displayWidth,
                        displayHeight
                    );
                    const color = getConfidenceColor(detection.confidence);
                    const width = scaledBox.x2 - scaledBox.x1;
                    const height = scaledBox.y2 - scaledBox.y1;

                    return (
                        <React.Fragment key={`box-${index}`}>
                            {/* Main bounding box */}
                            <Rect
                                x={scaledBox.x1}
                                y={scaledBox.y1}
                                width={width}
                                height={height}
                                stroke={color}
                                strokeWidth={2}
                                fill="transparent"
                            />
                            {/* Corner accents - Top Left */}
                            <Line
                                x1={scaledBox.x1}
                                y1={scaledBox.y1}
                                x2={scaledBox.x1 + Math.min(width * 0.2, 15)}
                                y2={scaledBox.y1}
                                stroke={color}
                                strokeWidth={3}
                            />
                            <Line
                                x1={scaledBox.x1}
                                y1={scaledBox.y1}
                                x2={scaledBox.x1}
                                y2={scaledBox.y1 + Math.min(height * 0.2, 15)}
                                stroke={color}
                                strokeWidth={3}
                            />
                            {/* Corner accents - Top Right */}
                            <Line
                                x1={scaledBox.x2 - Math.min(width * 0.2, 15)}
                                y1={scaledBox.y1}
                                x2={scaledBox.x2}
                                y2={scaledBox.y1}
                                stroke={color}
                                strokeWidth={3}
                            />
                            <Line
                                x1={scaledBox.x2}
                                y1={scaledBox.y1}
                                x2={scaledBox.x2}
                                y2={scaledBox.y1 + Math.min(height * 0.2, 15)}
                                stroke={color}
                                strokeWidth={3}
                            />
                            {/* Corner accents - Bottom Left */}
                            <Line
                                x1={scaledBox.x1}
                                y1={scaledBox.y2}
                                x2={scaledBox.x1 + Math.min(width * 0.2, 15)}
                                y2={scaledBox.y2}
                                stroke={color}
                                strokeWidth={3}
                            />
                            <Line
                                x1={scaledBox.x1}
                                y1={scaledBox.y2 - Math.min(height * 0.2, 15)}
                                x2={scaledBox.x1}
                                y2={scaledBox.y2}
                                stroke={color}
                                strokeWidth={3}
                            />
                            {/* Corner accents - Bottom Right */}
                            <Line
                                x1={scaledBox.x2 - Math.min(width * 0.2, 15)}
                                y1={scaledBox.y2}
                                x2={scaledBox.x2}
                                y2={scaledBox.y2}
                                stroke={color}
                                strokeWidth={3}
                            />
                            <Line
                                x1={scaledBox.x2}
                                y1={scaledBox.y2 - Math.min(height * 0.2, 15)}
                                x2={scaledBox.x2}
                                y2={scaledBox.y2}
                                stroke={color}
                                strokeWidth={3}
                            />
                        </React.Fragment>
                    );
                })}
            </Svg>

            {/* Labels */}
            {detections.map((detection, index) => {
                const scaledBox = scaleBoundingBox(
                    detection.bbox,
                    imageWidth,
                    imageHeight,
                    displayWidth,
                    displayHeight
                );
                return (
                    <BoxLabel
                        key={`label-${index}`}
                        detection={detection}
                        x={scaledBox.x1}
                        y={scaledBox.y1}
                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
    },
    labelText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
});

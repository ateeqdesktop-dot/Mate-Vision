import 'package:equatable/equatable.dart';

/// Bounding box entity representing detection coordinates
class BoundingBox extends Equatable {
  final double x1;
  final double y1;
  final double x2;
  final double y2;

  const BoundingBox({
    required this.x1,
    required this.y1,
    required this.x2,
    required this.y2,
  });

  /// Get the width of the bounding box
  double get width => x2 - x1;

  /// Get the height of the bounding box
  double get height => y2 - y1;

  /// Get the center X coordinate
  double get centerX => (x1 + x2) / 2;

  /// Get the center Y coordinate
  double get centerY => (y1 + y2) / 2;

  @override
  List<Object?> get props => [x1, y1, x2, y2];
}

/// Detection entity representing a single detected object
class Detection extends Equatable {
  final BoundingBox bbox;
  final double confidence;
  final int classId;
  final String className;

  const Detection({
    required this.bbox,
    required this.confidence,
    required this.classId,
    required this.className,
  });

  /// Get confidence as percentage string
  String get confidencePercent => '${(confidence * 100).toStringAsFixed(1)}%';

  @override
  List<Object?> get props => [bbox, confidence, classId, className];
}

/// Prediction result entity containing all detection results
class PredictionResult extends Equatable {
  final bool success;
  final String modelName;
  final List<Detection> detections;
  final double inferenceTimeMs;
  final int imageWidth;
  final int imageHeight;

  const PredictionResult({
    required this.success,
    required this.modelName,
    required this.detections,
    required this.inferenceTimeMs,
    required this.imageWidth,
    required this.imageHeight,
  });

  /// Check if any detections were found
  bool get hasDetections => detections.isNotEmpty;

  /// Get the number of detections
  int get detectionCount => detections.length;

  /// Get inference time formatted as string
  String get inferenceTimeFormatted => '${inferenceTimeMs.toStringAsFixed(1)}ms';

  @override
  List<Object?> get props => [
        success,
        modelName,
        detections,
        inferenceTimeMs,
        imageWidth,
        imageHeight,
      ];
}

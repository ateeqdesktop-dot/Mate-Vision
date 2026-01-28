import '../../domain/entities/detection_entity.dart';

/// DTO for bounding box from API
class BoundingBoxModel {
  final double x1;
  final double y1;
  final double x2;
  final double y2;

  BoundingBoxModel({
    required this.x1,
    required this.y1,
    required this.x2,
    required this.y2,
  });

  factory BoundingBoxModel.fromJson(Map<String, dynamic> json) {
    return BoundingBoxModel(
      x1: (json['x1'] as num).toDouble(),
      y1: (json['y1'] as num).toDouble(),
      x2: (json['x2'] as num).toDouble(),
      y2: (json['y2'] as num).toDouble(),
    );
  }

  /// Convert to domain entity
  BoundingBox toEntity() {
    return BoundingBox(x1: x1, y1: y1, x2: x2, y2: y2);
  }
}

/// DTO for single detection from API
class DetectionModel {
  final BoundingBoxModel bbox;
  final double confidence;
  final int classId;
  final String className;

  DetectionModel({
    required this.bbox,
    required this.confidence,
    required this.classId,
    required this.className,
  });

  factory DetectionModel.fromJson(Map<String, dynamic> json) {
    return DetectionModel(
      bbox: BoundingBoxModel.fromJson(json['bbox'] as Map<String, dynamic>),
      confidence: (json['confidence'] as num).toDouble(),
      classId: json['class_id'] as int,
      className: json['class_name'] as String,
    );
  }

  /// Convert to domain entity
  Detection toEntity() {
    return Detection(
      bbox: bbox.toEntity(),
      confidence: confidence,
      classId: classId,
      className: className,
    );
  }
}

/// DTO for prediction response from API
class PredictionResponseModel {
  final bool success;
  final String modelName;
  final List<DetectionModel> detections;
  final double inferenceTimeMs;
  final int imageWidth;
  final int imageHeight;

  PredictionResponseModel({
    required this.success,
    required this.modelName,
    required this.detections,
    required this.inferenceTimeMs,
    required this.imageWidth,
    required this.imageHeight,
  });

  factory PredictionResponseModel.fromJson(Map<String, dynamic> json) {
    return PredictionResponseModel(
      success: json['success'] as bool,
      modelName: json['model_name'] as String,
      detections: (json['detections'] as List<dynamic>)
          .map((e) => DetectionModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      inferenceTimeMs: (json['inference_time_ms'] as num).toDouble(),
      imageWidth: json['image_width'] as int,
      imageHeight: json['image_height'] as int,
    );
  }

  /// Convert to domain entity
  PredictionResult toEntity() {
    return PredictionResult(
      success: success,
      modelName: modelName,
      detections: detections.map((d) => d.toEntity()).toList(),
      inferenceTimeMs: inferenceTimeMs,
      imageWidth: imageWidth,
      imageHeight: imageHeight,
    );
  }
}

/// DTO for error response from API
class ErrorResponseModel {
  final bool success;
  final String error;
  final String? detail;

  ErrorResponseModel({
    required this.success,
    required this.error,
    this.detail,
  });

  factory ErrorResponseModel.fromJson(Map<String, dynamic> json) {
    return ErrorResponseModel(
      success: json['success'] as bool,
      error: json['error'] as String,
      detail: json['detail'] as String?,
    );
  }
}

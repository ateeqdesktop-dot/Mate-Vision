import 'dart:typed_data';
import 'package:equatable/equatable.dart';
import '../../domain/entities/detection_entity.dart';

/// Base class for detection states
abstract class DetectionState extends Equatable {
  const DetectionState();

  @override
  List<Object?> get props => [];
}

/// Initial state
class DetectionInitial extends DetectionState {
  const DetectionInitial();
}

/// State when an image is selected
class ImageSelected extends DetectionState {
  final Uint8List imageBytes;
  final String fileName;

  const ImageSelected({
    required this.imageBytes,
    required this.fileName,
  });

  @override
  List<Object?> get props => [imageBytes, fileName];
}

/// Loading state during detection
class DetectionLoading extends DetectionState {
  final Uint8List imageBytes;
  final String fileName;

  const DetectionLoading({
    required this.imageBytes,
    required this.fileName,
  });

  @override
  List<Object?> get props => [imageBytes, fileName];
}

/// Success state with detection results
class DetectionSuccess extends DetectionState {
  final PredictionResult result;
  final Uint8List imageBytes;
  final String fileName;

  const DetectionSuccess({
    required this.result,
    required this.imageBytes,
    required this.fileName,
  });

  @override
  List<Object?> get props => [result, imageBytes, fileName];
}

/// Error state
class DetectionError extends DetectionState {
  final String message;
  final Uint8List? imageBytes;
  final String? fileName;

  const DetectionError({
    required this.message,
    this.imageBytes,
    this.fileName,
  });

  @override
  List<Object?> get props => [message, imageBytes, fileName];
}

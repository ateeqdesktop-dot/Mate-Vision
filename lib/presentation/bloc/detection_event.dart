import 'dart:typed_data';
import 'package:equatable/equatable.dart';
import '../../core/constants.dart';

/// Base class for detection events
abstract class DetectionEvent extends Equatable {
  const DetectionEvent();

  @override
  List<Object?> get props => [];
}

/// Event to start detection
class StartDetection extends DetectionEvent {
  final DetectionType detectionType;
  final Uint8List imageBytes;
  final String fileName;

  const StartDetection({
    required this.detectionType,
    required this.imageBytes,
    required this.fileName,
  });

  @override
  List<Object?> get props => [detectionType, imageBytes, fileName];
}

/// Event to reset detection state
class ResetDetection extends DetectionEvent {
  const ResetDetection();
}

/// Event to select an image
class SelectImage extends DetectionEvent {
  final Uint8List imageBytes;
  final String fileName;

  const SelectImage({
    required this.imageBytes,
    required this.fileName,
  });

  @override
  List<Object?> get props => [imageBytes, fileName];
}

/// Event to clear selected image
class ClearImage extends DetectionEvent {
  const ClearImage();
}

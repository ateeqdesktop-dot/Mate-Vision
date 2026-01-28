import 'dart:typed_data';
import '../entities/detection_entity.dart';
import '../repositories/prediction_repository.dart';

/// Use case for detecting car accidents in images
class DetectCarAccidentUseCase {
  final PredictionRepository _repository;

  DetectCarAccidentUseCase(this._repository);

  /// Execute the car accident detection
  Future<PredictionResult> call(Uint8List imageBytes, String fileName) {
    return _repository.detectCarAccident(imageBytes, fileName);
  }
}

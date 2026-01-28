import 'dart:typed_data';
import '../entities/detection_entity.dart';
import '../repositories/prediction_repository.dart';

/// Use case for detecting weapons in images
class DetectWeaponUseCase {
  final PredictionRepository _repository;

  DetectWeaponUseCase(this._repository);

  /// Execute the weapon detection
  Future<PredictionResult> call(Uint8List imageBytes, String fileName) {
    return _repository.detectWeapon(imageBytes, fileName);
  }
}

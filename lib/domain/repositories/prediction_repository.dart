import 'dart:typed_data';
import '../entities/detection_entity.dart';

/// Abstract repository interface for predictions
abstract class PredictionRepository {
  /// Detect car accidents in an image
  Future<PredictionResult> detectCarAccident(Uint8List imageBytes, String fileName);

  /// Detect weapons in an image
  Future<PredictionResult> detectWeapon(Uint8List imageBytes, String fileName);

  /// Get list of available models
  Future<List<String>> getAvailableModels();

  /// Check server health
  Future<bool> checkHealth();
}

import 'dart:typed_data';

import '../../domain/entities/detection_entity.dart';
import '../../domain/repositories/prediction_repository.dart';
import '../datasources/api_client.dart';

/// Implementation of the prediction repository
class PredictionRepositoryImpl implements PredictionRepository {
  final ApiClient _apiClient;

  PredictionRepositoryImpl(this._apiClient);

  @override
  Future<PredictionResult> detectCarAccident(
    Uint8List imageBytes,
    String fileName,
  ) async {
    final response = await _apiClient.predictCarAccident(imageBytes, fileName);
    return response.toEntity();
  }

  @override
  Future<PredictionResult> detectWeapon(
    Uint8List imageBytes,
    String fileName,
  ) async {
    final response = await _apiClient.predictWeapon(imageBytes, fileName);
    return response.toEntity();
  }

  @override
  Future<List<String>> getAvailableModels() async {
    return await _apiClient.getModels();
  }

  @override
  Future<bool> checkHealth() async {
    return await _apiClient.checkHealth();
  }
}

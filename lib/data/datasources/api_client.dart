import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';

import '../../core/config.dart';
import '../../core/exceptions.dart';
import '../models/prediction_model.dart';

/// API client for communicating with the backend server
class ApiClient {
  final http.Client _client;
  final String _baseUrl;

  ApiClient({
    http.Client? client,
    String? baseUrl,
  })  : _client = client ?? http.Client(),
        _baseUrl = baseUrl ?? AppConfig.baseUrl;

  /// Full API URL with prefix
  String get _apiUrl => '$_baseUrl${AppConfig.apiPrefix}';

  /// Predict car accidents in an image
  Future<PredictionResponseModel> predictCarAccident(
    Uint8List imageBytes,
    String fileName,
  ) async {
    return _uploadAndPredict('/predict/car-accident', imageBytes, fileName);
  }

  /// Predict weapons in an image
  Future<PredictionResponseModel> predictWeapon(
    Uint8List imageBytes,
    String fileName,
  ) async {
    return _uploadAndPredict('/predict/weapon', imageBytes, fileName);
  }

  /// Common method for uploading image and getting prediction
  Future<PredictionResponseModel> _uploadAndPredict(
    String endpoint,
    Uint8List imageBytes,
    String fileName,
  ) async {
    try {
      final uri = Uri.parse('$_apiUrl$endpoint');
      final request = http.MultipartRequest('POST', uri);

      // Determine content type based on file extension
      final extension = fileName.split('.').last.toLowerCase();
      String mimeType;
      switch (extension) {
        case 'png':
          mimeType = 'image/png';
          break;
        case 'gif':
          mimeType = 'image/gif';
          break;
        case 'webp':
          mimeType = 'image/webp';
          break;
        case 'jpg':
        case 'jpeg':
        default:
          mimeType = 'image/jpeg';
      }

      request.files.add(
        http.MultipartFile.fromBytes(
          'file',
          imageBytes,
          filename: fileName,
          contentType: MediaType.parse(mimeType),
        ),
      );

      final streamedResponse = await request.send().timeout(
            Duration(seconds: AppConfig.receiveTimeout),
          );

      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        return PredictionResponseModel.fromJson(json);
      } else {
        _handleErrorResponse(response);
        throw ServerException(
          'Prediction failed',
          statusCode: response.statusCode,
        );
      }
    } on http.ClientException catch (e) {
      throw NetworkException('Network error: ${e.message}');
    } catch (e) {
      if (e is AppException) rethrow;
      throw NetworkException('Connection failed: $e');
    }
  }

  /// Get list of available models
  Future<List<String>> getModels() async {
    try {
      final response = await _client
          .get(Uri.parse('$_apiUrl/models'))
          .timeout(Duration(seconds: AppConfig.connectionTimeout));

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        return List<String>.from(json['models'] as List);
      } else {
        _handleErrorResponse(response);
        return [];
      }
    } catch (e) {
      if (e is AppException) rethrow;
      throw NetworkException('Failed to get models: $e');
    }
  }

  /// Check server health
  Future<bool> checkHealth() async {
    try {
      final response = await _client
          .get(Uri.parse('$_baseUrl/health'))
          .timeout(Duration(seconds: AppConfig.connectionTimeout));

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        return json['status'] == 'healthy';
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  /// Handle error responses
  void _handleErrorResponse(http.Response response) {
    try {
      final json = jsonDecode(response.body) as Map<String, dynamic>;
      final error = ErrorResponseModel.fromJson(json);
      throw ServerException(
        error.error,
        statusCode: response.statusCode,
        details: error.detail,
      );
    } catch (e) {
      if (e is ServerException) rethrow;
      throw ServerException(
        'Server error',
        statusCode: response.statusCode,
        details: response.body,
      );
    }
  }

  /// Close the client
  void dispose() {
    _client.close();
  }
}

/// Application configuration
class AppConfig {
  /// Base URL for the API server
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://mate-vision.onrender.com',
  );

  /// API version prefix
  static const String apiPrefix = '/api/v1';

  /// Connection timeout in seconds
  static const int connectionTimeout = 30;

  /// Receive timeout in seconds
  static const int receiveTimeout = 60;
}

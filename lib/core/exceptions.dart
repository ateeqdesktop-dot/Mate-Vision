/// Base exception for app-specific errors
class AppException implements Exception {
  final String message;
  final String? details;

  AppException(this.message, {this.details});

  @override
  String toString() => 'AppException: $message${details != null ? ' ($details)' : ''}';
}

/// Exception for network-related errors
class NetworkException extends AppException {
  final int? statusCode;

  NetworkException(
    super.message, {
    this.statusCode,
    super.details,
  });

  @override
  String toString() =>
      'NetworkException: $message${statusCode != null ? ' [Status: $statusCode]' : ''}';
}

/// Exception for server-side errors
class ServerException extends AppException {
  final int statusCode;

  ServerException(
    super.message, {
    required this.statusCode,
    super.details,
  });

  @override
  String toString() => 'ServerException: $message [Status: $statusCode]';
}

/// Exception for when no image is selected
class NoImageSelectedException extends AppException {
  NoImageSelectedException() : super('No image selected');
}

/// Exception for invalid image format
class InvalidImageException extends AppException {
  InvalidImageException(String format)
      : super('Invalid image format: $format');
}

/// Exception for detection failures
class DetectionException extends AppException {
  DetectionException(super.message, {super.details});
}

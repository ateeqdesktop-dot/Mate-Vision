/// Application-wide constants
class AppConstants {
  AppConstants._();

  /// App name
  static const String appName = 'Mate Vision';

  /// App description
  static const String appDescription = 'AI-Powered Detection System';

  /// Detection types
  static const String carAccidentDetection = 'car_accidents';
  static const String weaponDetection = 'weapons';

  /// API Endpoints
  static const String predictCarAccidentEndpoint = '/predict/car-accident';
  static const String predictWeaponEndpoint = '/predict/weapon';
  static const String modelsEndpoint = '/models';
  static const String healthEndpoint = '/health';

  /// Asset paths
  static const String imagesPath = 'assets/images/';

  /// Animation durations
  static const Duration shortAnimation = Duration(milliseconds: 200);
  static const Duration mediumAnimation = Duration(milliseconds: 400);
  static const Duration longAnimation = Duration(milliseconds: 600);
}

/// Detection type enum
enum DetectionType {
  carAccident(
    id: 'car_accidents',
    title: 'Car Accident Detection',
    description: 'Detect car accidents in images using AI',
    icon: '🚗',
    endpoint: '/predict/car-accident',
  ),
  weapon(
    id: 'weapons',
    title: 'Weapon Detection',
    description: 'Detect weapons in images using AI',
    icon: '🔫',
    endpoint: '/predict/weapon',
  );

  const DetectionType({
    required this.id,
    required this.title,
    required this.description,
    required this.icon,
    required this.endpoint,
  });

  final String id;
  final String title;
  final String description;
  final String icon;
  final String endpoint;
}

import 'package:flutter/material.dart';

/// Available theme types
enum AppThemeType {
  dark,
  light,
  forest,
  sunset,
}

/// App theme configuration with multiple modern designs
class AppTheme {
  // Private constructor
  AppTheme._();

  // --- Dark Theme Colors ---
  static const Color primaryStart = Color(0xFF667eea);
  static const Color primaryEnd = Color(0xFF764ba2);
  static const Color darkBackground = Color(0xFF0f0f23);
  static const Color cardBackground = Color(0xFF1a1a2e);
  static const Color surfaceColor = Color(0xFF16213e);
  
  // --- Light Theme Colors ---
  static const Color lightPrimaryStart = Color(0xFF00c6fb);
  static const Color lightPrimaryEnd = Color(0xFF005bea);
  static const Color lightBackground = Color(0xFFf0f2f5);
  static const Color lightCardBackground = Color(0xFFffffff);
  static const Color lightSurfaceColor = Color(0xFFe4e6eb);
  static const Color lightTextPrimary = Color(0xFF1a1a2e);
  static const Color lightTextSecondary = Color(0xFF65676b);

  // --- Forest Theme Colors ---
  static const Color forestPrimaryStart = Color(0xFF52B788);
  static const Color forestPrimaryEnd = Color(0xFF2D6A4F);
  static const Color forestBackground = Color(0xFF081C15);
  static const Color forestCardBackground = Color(0xFF1B4332);
  static const Color forestSurfaceColor = Color(0xFF2D6A4F);

  // --- Sunset Theme Colors ---
  static const Color sunsetPrimaryStart = Color(0xFFF48C06);
  static const Color sunsetPrimaryEnd = Color(0xFFD00000);
  static const Color sunsetBackground = Color(0xFF370617);
  static const Color sunsetCardBackground = Color(0xFF6A040F);
  static const Color sunsetSurfaceColor = Color(0xFF9D0208);

  // --- Shared Colors ---
  static const Color textPrimary = Color(0xFFffffff);
  static const Color textSecondary = Color(0xFFa0a0a0);
  static const Color successColor = Color(0xFF00d4aa);
  static const Color dangerColor = Color(0xFFff6b6b);
  static const Color warningColor = Color(0xFFfeca57);

  // --- Gradients ---
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primaryStart, primaryEnd],
  );

  static const LinearGradient lightPrimaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [lightPrimaryStart, lightPrimaryEnd],
  );

  static const LinearGradient forestPrimaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [forestPrimaryStart, forestPrimaryEnd],
  );

  static const LinearGradient sunsetPrimaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [sunsetPrimaryStart, sunsetPrimaryEnd],
  );

  static const LinearGradient backgroundGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFF1a1a2e), Color(0xFF0f0f23)],
  );

  static const LinearGradient lightBackgroundGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFFe0eafc), Color(0xFFcfdef3)],
  );
  
  static const LinearGradient forestBackgroundGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFF1B4332), Color(0xFF081C15)],
  );

  static const LinearGradient sunsetBackgroundGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFF6A040F), Color(0xFF370617)],
  );

  static const LinearGradient carAccidentGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFff9a56), Color(0xFFff6b6b)],
  );

  static const LinearGradient weaponGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF667eea), Color(0xFF764ba2)],
  );

  // --- Dimensions ---
  static const double radiusSmall = 8.0;
  static const double radiusMedium = 16.0;
  static const double radiusLarge = 24.0;
  static const double radiusXLarge = 32.0;

  static const double spacingXSmall = 4.0;
  static const double spacingSmall = 8.0;
  static const double spacingMedium = 16.0;
  static const double spacingLarge = 24.0;
  static const double spacingXLarge = 32.0;

  // --- Shadows ---
  static List<BoxShadow> get cardShadow => [
        BoxShadow(
          color: Colors.black.withValues(alpha: 0.3),
          blurRadius: 20,
          offset: const Offset(0, 10),
        ),
      ];
      
  static List<BoxShadow> get lightCardShadow => [
        BoxShadow(
          color: Colors.black.withValues(alpha: 0.05),
          blurRadius: 20,
          offset: const Offset(0, 5),
        ),
      ];

  static List<BoxShadow> get glowShadow => [
        BoxShadow(
          color: primaryStart.withValues(alpha: 0.4),
          blurRadius: 30,
          spreadRadius: 2,
        ),
      ];

  // --- Theme Factory ---
  static ThemeData getTheme(AppThemeType type) {
    switch (type) {
      case AppThemeType.light:
        return lightTheme;
      case AppThemeType.forest:
        return _createTheme(
          brightness: Brightness.dark,
          background: forestBackground,
          surface: forestSurfaceColor,
          card: forestCardBackground,
          primary: forestPrimaryStart,
          secondary: forestPrimaryEnd,
          text: textPrimary,
          subText: textSecondary,
        );
      case AppThemeType.sunset:
        return _createTheme(
          brightness: Brightness.dark,
          background: sunsetBackground,
          surface: sunsetSurfaceColor,
          card: sunsetCardBackground,
          primary: sunsetPrimaryStart,
          secondary: sunsetPrimaryEnd,
          text: textPrimary,
          subText: textSecondary,
        );
      case AppThemeType.dark:
        return darkTheme;
    }
  }

  // --- Specific Theme Definitions ---

  // Refactored helper to create themes easily
  static ThemeData _createTheme({
    required Brightness brightness,
    required Color background,
    required Color surface,
    required Color card,
    required Color primary,
    required Color secondary,
    required Color text,
    required Color subText,
  }) {
    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      scaffoldBackgroundColor: background,
      primaryColor: primary,
      colorScheme: brightness == Brightness.dark
          ? ColorScheme.dark(
              primary: primary,
              secondary: secondary,
              surface: surface,
              error: dangerColor,
            )
          : ColorScheme.light(
              primary: primary,
              secondary: secondary,
              surface: surface,
              error: dangerColor,
            ),
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          color: text,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
        iconTheme: IconThemeData(color: text),
      ),
      textTheme: TextTheme(
        displayLarge: TextStyle(color: text, fontSize: 32, fontWeight: FontWeight.bold),
        displayMedium: TextStyle(color: text, fontSize: 28, fontWeight: FontWeight.bold),
        displaySmall: TextStyle(color: text, fontSize: 24, fontWeight: FontWeight.bold),
        headlineMedium: TextStyle(color: text, fontSize: 20, fontWeight: FontWeight.w600),
        titleLarge: TextStyle(color: text, fontSize: 18, fontWeight: FontWeight.w600),
        titleMedium: TextStyle(color: text, fontSize: 16, fontWeight: FontWeight.w500),
        bodyLarge: TextStyle(color: text, fontSize: 16),
        bodyMedium: TextStyle(color: subText, fontSize: 14),
        bodySmall: TextStyle(color: subText, fontSize: 12),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: brightness == Brightness.dark ? Colors.white : text,
          padding: const EdgeInsets.symmetric(horizontal: spacingLarge, vertical: spacingMedium),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(radiusMedium)),
        ),
      ),
      cardTheme: CardThemeData(
        color: card,
        elevation: brightness == Brightness.dark ? 0 : 5,
        shadowColor: Colors.black.withValues(alpha: 0.05),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(radiusLarge)),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMedium),
          borderSide: BorderSide.none,
        ),
        contentPadding: const EdgeInsets.all(spacingMedium),
      ),
    );
  }

  static ThemeData get darkTheme => _createTheme(
    brightness: Brightness.dark,
    background: darkBackground,
    surface: surfaceColor,
    card: cardBackground,
    primary: primaryStart,
    secondary: primaryEnd,
    text: textPrimary,
    subText: textSecondary,
  );

  static ThemeData get lightTheme => _createTheme(
    brightness: Brightness.light,
    background: lightBackground,
    surface: lightSurfaceColor,
    card: lightCardBackground,
    primary: lightPrimaryStart,
    secondary: lightPrimaryEnd,
    text: lightTextPrimary,
    subText: lightTextSecondary,
  );
  
  // Helper to get gradient based on theme
  static LinearGradient getBackgroundGradient(AppThemeType type) {
    switch (type) {
      case AppThemeType.light:
        return lightBackgroundGradient;
      case AppThemeType.forest:
        return forestBackgroundGradient;
      case AppThemeType.sunset:
        return sunsetBackgroundGradient;
      case AppThemeType.dark:
        return backgroundGradient;
    }
  }
}

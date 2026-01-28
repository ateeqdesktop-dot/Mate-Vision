import 'package:flutter_bloc/flutter_bloc.dart';
import '../../core/theme.dart';

/// Cubit to manage the app theme state with support for multiple custom themes
class ThemeCubit extends Cubit<AppThemeType> {
  ThemeCubit() : super(AppThemeType.dark);

  /// Cycle through available themes
  void toggleTheme() {
    final nextIndex = (state.index + 1) % AppThemeType.values.length;
    emit(AppThemeType.values[nextIndex]);
  }
  
  /// Set a specific theme
  void setTheme(AppThemeType type) {
    emit(type);
  }

  /// Check if the current theme is dark (for white text usage etc)
  /// Forest and Sunset are also dark themes
  bool get isDark => state != AppThemeType.light;
}

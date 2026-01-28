import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'core/theme.dart';
import 'injection.dart';
import 'presentation/bloc/detection_bloc.dart';
import 'presentation/bloc/theme_cubit.dart';
import 'presentation/screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize dependency injection
  initializeDependencies();
  
  runApp(const MateVisionApp());
}

class MateVisionApp extends StatelessWidget {
  const MateVisionApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (context) => getIt<ThemeCubit>(),
        ),
        BlocProvider(
          create: (context) => getIt<DetectionBloc>(),
        ),
      ],
      child: BlocBuilder<ThemeCubit, AppThemeType>(
        builder: (context, themeType) {
          return MaterialApp(
            title: 'Mate Vision',
            debugShowCheckedModeBanner: false,
            // We force themeMode to light so that 'theme' property is always used,
            // allowing us to pass any custom ThemeData we want (including dark ones).
            themeMode: ThemeMode.light,
            theme: AppTheme.getTheme(themeType),
            home: const HomeScreen(),
          );
        },
      ),
    );
  }
}

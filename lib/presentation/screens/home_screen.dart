import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../core/constants.dart';
import '../../core/theme.dart';
import '../../injection.dart';
import '../bloc/detection_bloc.dart';
import '../bloc/theme_cubit.dart';
import '../widgets/glass_card.dart';
import 'detection_screen.dart';

/// Home screen with detection options
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: AppTheme.getBackgroundGradient(
            context.watch<ThemeCubit>().state,
          ),
        ),
        child: SafeArea(
          child: CustomScrollView(
            slivers: [
              // App Bar
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(AppTheme.spacingLarge),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: AppTheme.spacingMedium),
                      // Logo and Title
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              gradient: AppTheme.primaryGradient,
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: AppTheme.glowShadow,
                            ),
                            child: const Icon(
                              Icons.visibility,
                              color: Colors.white,
                              size: 28,
                            ),
                          )
                              .animate()
                              .fadeIn(duration: 600.ms)
                              .scale(delay: 200.ms),
                          const SizedBox(width: AppTheme.spacingMedium),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  AppConstants.appName,
                                  style: Theme.of(context)
                                      .textTheme
                                      .displaySmall
                                      ?.copyWith(
                                        fontWeight: FontWeight.bold,
                                      ),
                                )
                                    .animate()
                                    .fadeIn(duration: 600.ms, delay: 100.ms)
                                    .slideX(begin: -0.2, end: 0),
                                Text(
                                  AppConstants.appDescription,
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodyMedium
                                      ?.copyWith(
                                        height: 1.2,
                                      ),
                                )
                                    .animate()
                                    .fadeIn(duration: 600.ms, delay: 200.ms)
                                    .slideX(begin: -0.2, end: 0),
                              ],
                            ),
                          ),
                          // Theme Selector
                          BlocBuilder<ThemeCubit, AppThemeType>(
                            builder: (context, type) {
                              return GlassCard(
                                padding: const EdgeInsets.all(10),
                                borderRadius: 50,
                                onTap: () => _showThemeSelector(context),
                                child: Icon(
                                  Icons.palette_outlined,
                                  color: Theme.of(context).primaryColor,
                                  size: 24,
                                )
                                    .animate(target: type.index.toDouble())
                                    .rotate(begin: 0, end: 0.1),
                              );
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: AppTheme.spacingXLarge * 1.5),
                      // Welcome Section
                      Text(
                        'Choose Detection Type',
                        style:
                            Theme.of(context).textTheme.headlineMedium?.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                      )
                          .animate()
                          .fadeIn(duration: 600.ms, delay: 300.ms)
                          .slideY(begin: 0.2, end: 0),
                      const SizedBox(height: AppTheme.spacingSmall),
                      Text(
                        'Select the type of detection you want to perform',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              height: 1.5,
                            ),
                      )
                          .animate()
                          .fadeIn(duration: 600.ms, delay: 400.ms)
                          .slideY(begin: 0.2, end: 0),
                    ],
                  ),
                ),
              ),
              // Detection Cards
              SliverPadding(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppTheme.spacingLarge,
                ),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    _DetectionCard(
                      detectionType: DetectionType.carAccident,
                      gradient: AppTheme.carAccidentGradient,
                      icon: Icons.car_crash_rounded,
                      delay: 500,
                    ),
                    const SizedBox(height: AppTheme.spacingMedium),
                    _DetectionCard(
                      detectionType: DetectionType.weapon,
                      gradient: AppTheme.weaponGradient,
                      icon: Icons.security_rounded,
                      delay: 600,
                    ),
                    const SizedBox(height: AppTheme.spacingXLarge * 2),
                  ]),
                ),
              ),
              // Features Section
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppTheme.spacingLarge,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Features',
                        style: Theme.of(context).textTheme.titleLarge,
                      )
                          .animate()
                          .fadeIn(duration: 600.ms, delay: 700.ms),
                      const SizedBox(height: AppTheme.spacingMedium),
                      Row(
                        children: [
                          Expanded(
                            child: _FeatureChip(
                              icon: Icons.speed,
                              label: 'Fast',
                              delay: 800,
                            ),
                          ),
                          const SizedBox(width: AppTheme.spacingSmall),
                          Expanded(
                            child: _FeatureChip(
                              icon: Icons.precision_manufacturing,
                              label: 'Accurate',
                              delay: 900,
                            ),
                          ),
                          const SizedBox(width: AppTheme.spacingSmall),
                          Expanded(
                            child: _FeatureChip(
                              icon: Icons.cloud_done,
                              label: 'Real-time',
                              delay: 1000,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppTheme.spacingXLarge),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
  void _showThemeSelector(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => const _ThemeSelectorSheet(),
    );
  }
}

class _DetectionCard extends StatelessWidget {
  final DetectionType detectionType;
  final Gradient gradient;
  final IconData icon;
  final int delay;

  const _DetectionCard({
    required this.detectionType,
    required this.gradient,
    required this.icon,
    required this.delay,
  });

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => BlocProvider(
              create: (context) => getIt<DetectionBloc>(),
              child: DetectionScreen(
                detectionType: detectionType,
              ),
            ),
          ),
        );
      },
      padding: EdgeInsets.zero,
      child: Container(
        padding: const EdgeInsets.all(AppTheme.spacingLarge),
        child: Row(
          children: [
            Container(
              width: 70,
              height: 70,
              decoration: BoxDecoration(
                gradient: gradient,
                borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
                boxShadow: [
                  BoxShadow(
                    color: (gradient.colors.first).withValues(alpha: 0.4),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Icon(
                icon,
                color: Colors.white,
                size: 32,
              ),
            ),
            const SizedBox(width: AppTheme.spacingMedium),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    detectionType.title,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: AppTheme.spacingXSmall),
                  Text(
                    detectionType.description,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Theme.of(context).brightness == Brightness.dark
                    ? Colors.white.withValues(alpha: 0.1)
                    : Colors.black.withValues(alpha: 0.05),
                borderRadius: BorderRadius.circular(AppTheme.radiusSmall),
              ),
              child: Icon(
                Icons.arrow_forward_ios,
                color: Theme.of(context).textTheme.bodySmall?.color,
                size: 16,
              ),
            ),
          ],
        ),
      ),
    )
        .animate()
        .fadeIn(duration: 600.ms, delay: Duration(milliseconds: delay))
        .slideX(begin: 0.2, end: 0);
  }
}

class _FeatureChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final int delay;

  const _FeatureChip({
    required this.icon,
    required this.label,
    required this.delay,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        vertical: AppTheme.spacingSmall,
        horizontal: AppTheme.spacingMedium,
      ),
      decoration: BoxDecoration(
        color: Theme.of(context).brightness == Brightness.dark
            ? Colors.white.withValues(alpha: 0.05)
            : Colors.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
        border: Border.all(
          color: Theme.of(context).brightness == Brightness.dark
              ? Colors.white.withValues(alpha: 0.1)
              : Colors.black.withValues(alpha: 0.05),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            size: 16,
            color: Theme.of(context).primaryColor,
          ),
          const SizedBox(width: AppTheme.spacingXSmall),
          Text(
            label,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Theme.of(context).textTheme.bodySmall?.color,
                ),
          ),
        ],
      ),
    )
        .animate()
        .fadeIn(duration: 600.ms, delay: Duration(milliseconds: delay))
        .scale(begin: const Offset(0.8, 0.8), end: const Offset(1, 1));
  }
}

class _ThemeSelectorSheet extends StatelessWidget {
  const _ThemeSelectorSheet();

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      margin: const EdgeInsets.all(AppTheme.spacingLarge),
      padding: const EdgeInsets.all(AppTheme.spacingLarge),
      borderRadius: AppTheme.radiusLarge,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Select Theme',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              IconButton(
                icon: Icon(Icons.close, color: Theme.of(context).iconTheme.color),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: AppTheme.spacingMedium),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: AppThemeType.values.map((type) {
                return Padding(
                    padding: const EdgeInsets.only(right: 16),
                    child: _ThemeOption(type: type),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}

class _ThemeOption extends StatelessWidget {
  final AppThemeType type;

  const _ThemeOption({required this.type});

  @override
  Widget build(BuildContext context) {
    final isSelected = context.watch<ThemeCubit>().state == type;
    
    
    Gradient getGradient() {
        switch(type) {
            case AppThemeType.light: return AppTheme.lightPrimaryGradient;
            case AppThemeType.forest: return AppTheme.forestPrimaryGradient;
            case AppThemeType.sunset: return AppTheme.sunsetPrimaryGradient;
            case AppThemeType.dark: return AppTheme.primaryGradient;
        }
    }
    
    String getName() {
        switch(type) {
            case AppThemeType.light: return 'Light';
            case AppThemeType.forest: return 'Forest';
            case AppThemeType.sunset: return 'Sunset';
            case AppThemeType.dark: return 'Dark';
        }
    }

    return GestureDetector(
      onTap: () {
        context.read<ThemeCubit>().setTheme(type);
      },
      child: Column(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: getGradient(),
              border: isSelected 
                  ? Border.all(color: Theme.of(context).colorScheme.primary, width: 3) 
                  : null,
              boxShadow: isSelected ? AppTheme.glowShadow : [
                  BoxShadow(
                      color: Colors.black.withValues(alpha: 0.1),
                      blurRadius: 5,
                      offset: const Offset(0, 2),
                  )
              ],
            ),
            child: isSelected ? const Icon(Icons.check, color: Colors.white, size: 30) : null,
          ),
          const SizedBox(height: 8),
          Text(
            getName(),
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                color: isSelected ? Theme.of(context).primaryColor : null,
            ),
          ),
        ],
      ),
    );
  }
}

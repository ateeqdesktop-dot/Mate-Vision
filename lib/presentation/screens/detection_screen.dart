import 'dart:typed_data';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:image_picker/image_picker.dart';

import '../../core/constants.dart';
import '../../core/theme.dart';
import '../bloc/detection_bloc.dart';
import '../bloc/detection_event.dart';
import '../bloc/detection_state.dart';
import '../bloc/theme_cubit.dart';
import '../widgets/glass_card.dart';
import '../widgets/gradient_button.dart';
import '../widgets/detection_overlay.dart';

/// Detection screen for image upload and analysis
class DetectionScreen extends StatefulWidget {
  final DetectionType detectionType;

  const DetectionScreen({
    super.key,
    required this.detectionType,
  });

  @override
  State<DetectionScreen> createState() => _DetectionScreenState();
}

class _DetectionScreenState extends State<DetectionScreen> {
  final ImagePicker _picker = ImagePicker();

  Future<void> _pickImage(ImageSource source) async {
    try {
      final XFile? pickedFile = await _picker.pickImage(
        source: source,
        maxWidth: 1920,
        maxHeight: 1080,
        imageQuality: 90,
      );

      if (pickedFile != null) {
        final bytes = await pickedFile.readAsBytes();
        if (mounted) {
          context.read<DetectionBloc>().add(SelectImage(
                imageBytes: bytes,
                fileName: pickedFile.name,
              ));
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error picking image: $e'),
            backgroundColor: AppTheme.dangerColor,
          ),
        );
      }
    }
  }

  void _startDetection(Uint8List bytes, String fileName) {
    context.read<DetectionBloc>().add(StartDetection(
          detectionType: widget.detectionType,
          imageBytes: bytes,
          fileName: fileName,
        ));
  }

  Gradient get _gradient {
    return widget.detectionType == DetectionType.carAccident
        ? AppTheme.carAccidentGradient
        : AppTheme.weaponGradient;
  }

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
          child: Column(
            children: [
              // App Bar
              _buildAppBar(context),
              // Content
              Expanded(
                child: BlocBuilder<DetectionBloc, DetectionState>(
                  builder: (context, state) {
                    return SingleChildScrollView(
                      padding: const EdgeInsets.all(AppTheme.spacingLarge),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // Image Preview or Placeholder
                          _buildImageSection(state),
                          const SizedBox(height: AppTheme.spacingLarge),
                          // Action Buttons
                          _buildActionButtons(state),
                          const SizedBox(height: AppTheme.spacingLarge),
                          // Results Section
                          if (state is DetectionSuccess)
                            _buildResultsSection(state),
                          if (state is DetectionError)
                            _buildErrorSection(state),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAppBar(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(AppTheme.spacingMedium),
      child: Row(
        children: [
          GlassCard(
            padding: const EdgeInsets.all(8),
            borderRadius: AppTheme.radiusMedium,
            onTap: () => Navigator.pop(context),
            child: Icon(
              Icons.arrow_back_ios_new,
              color: Theme.of(context).iconTheme.color,
              size: 20,
            ),
          ),
          const SizedBox(width: AppTheme.spacingMedium),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.detectionType.title,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                Text(
                  'Upload an image to analyze',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              gradient: _gradient,
              borderRadius: BorderRadius.circular(AppTheme.radiusMedium),
            ),
            child: Icon(
              widget.detectionType == DetectionType.carAccident
                  ? Icons.car_crash_rounded
                  : Icons.security_rounded,
              color: Colors.white,
              size: 24,
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 400.ms).slideY(begin: -0.2, end: 0);
  }

  Widget _buildImageSection(DetectionState state) {
    Uint8List? imageBytes;
    if (state is ImageSelected) {
      imageBytes = state.imageBytes;
    } else if (state is DetectionLoading) {
      imageBytes = state.imageBytes;
    } else if (state is DetectionSuccess) {
      imageBytes = state.imageBytes;
    } else if (state is DetectionError) {
      imageBytes = state.imageBytes;
    }

    return GlassCard(
      padding: EdgeInsets.zero,
      child: AspectRatio(
        aspectRatio: 4 / 3,
        child: imageBytes != null
            ? Stack(
                fit: StackFit.expand,
                children: [
                  // Image
                  ClipRRect(
                    borderRadius: BorderRadius.circular(AppTheme.radiusLarge - 2),
                    child: Image.memory(
                      imageBytes,
                      fit: BoxFit.cover,
                    ),
                  ),
                  // Detection Overlay
                  if (state is DetectionSuccess)
                    ClipRRect(
                      borderRadius: BorderRadius.circular(AppTheme.radiusLarge - 2),
                      child: DetectionOverlay(
                        detections: state.result.detections,
                        imageWidth: state.result.imageWidth,
                        imageHeight: state.result.imageHeight,
                      ),
                    ),
                  // Loading Overlay
                  if (state is DetectionLoading)
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.6),
                        borderRadius: BorderRadius.circular(AppTheme.radiusLarge - 2),
                      ),
                      child: Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            CircularProgressIndicator(
                              valueColor: AlwaysStoppedAnimation<Color>(
                                Theme.of(context).primaryColor,
                              ),
                            ),
                            SizedBox(height: AppTheme.spacingMedium),
                            Text(
                              'Analyzing image...',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  // Clear Button
                  if (state is! DetectionLoading)
                    Positioned(
                      top: 8,
                      right: 8,
                      child: GlassCard(
                        padding: const EdgeInsets.all(6),
                        borderRadius: 20,
                        onTap: () {
                          context.read<DetectionBloc>().add(const ClearImage());
                        },
                        child: const Icon(
                          Icons.close,
                          color: Colors.white,
                          size: 18,
                        ),
                      ),
                    ),
                ],
              )
            : _buildPlaceholder(),
      ),
    ).animate().fadeIn(duration: 400.ms, delay: 100.ms).scale(begin: const Offset(0.95, 0.95));
  }

  Widget _buildPlaceholder() {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(AppTheme.radiusLarge - 2),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.add_photo_alternate_outlined,
            size: 64,
            color: Theme.of(context).textTheme.bodyMedium?.color?.withValues(alpha: 0.5),
          ),
          const SizedBox(height: AppTheme.spacingMedium),
          Text(
            'Select an image to analyze',
            style: TextStyle(
              color: Theme.of(context).textTheme.bodyMedium?.color?.withValues(alpha: 0.7),
              fontSize: 16,
            ),
          ),
          const SizedBox(height: AppTheme.spacingSmall),
          Text(
            'Tap the buttons below to choose',
            style: TextStyle(
              color: Theme.of(context).textTheme.bodySmall?.color?.withValues(alpha: 0.5),
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons(DetectionState state) {
    final hasImage = state is ImageSelected ||
        state is DetectionSuccess ||
        state is DetectionError;
    final isLoading = state is DetectionLoading;

    Uint8List? imageBytes;
    String? fileName;
    if (state is ImageSelected) {
      imageBytes = state.imageBytes;
      fileName = state.fileName;
    } else if (state is DetectionSuccess) {
      imageBytes = state.imageBytes;
      fileName = state.fileName;
    } else if (state is DetectionError) {
      imageBytes = state.imageBytes;
      fileName = state.fileName;
    }

    return Column(
      children: [
        // Image Source Buttons
        Row(
          children: [
            Expanded(
              child: GlassCard(
                onTap: isLoading ? null : () => _pickImage(ImageSource.gallery),
                padding: const EdgeInsets.symmetric(
                  vertical: AppTheme.spacingMedium,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.photo_library_outlined,
                      color: isLoading
                          ? Theme.of(context).disabledColor
                          : Theme.of(context).textTheme.bodyLarge?.color,
                    ),
                    const SizedBox(width: AppTheme.spacingSmall),
                    Text(
                      'Gallery',
                      style: TextStyle(
                        color: isLoading
                            ? Theme.of(context).disabledColor
                            : Theme.of(context).textTheme.bodyLarge?.color,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: AppTheme.spacingMedium),
            Expanded(
              child: GlassCard(
                onTap: isLoading || kIsWeb
                    ? null
                    : () => _pickImage(ImageSource.camera),
                padding: const EdgeInsets.symmetric(
                  vertical: AppTheme.spacingMedium,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.camera_alt_outlined,
                      color: isLoading || kIsWeb
                          ? Theme.of(context).disabledColor
                          : Theme.of(context).textTheme.bodyLarge?.color,
                    ),
                    const SizedBox(width: AppTheme.spacingSmall),
                    Text(
                      'Camera',
                      style: TextStyle(
                        color: isLoading || kIsWeb
                            ? Theme.of(context).disabledColor
                            : Theme.of(context).textTheme.bodyLarge?.color,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ).animate().fadeIn(duration: 400.ms, delay: 200.ms),
        const SizedBox(height: AppTheme.spacingMedium),
        // Analyze Button
        GradientButton(
          text: 'Analyze Image',
          icon: Icons.auto_awesome,
          gradient: _gradient,
          isLoading: isLoading,
          onPressed: hasImage && !isLoading && imageBytes != null
              ? () => _startDetection(imageBytes!, fileName ?? 'image.jpg')
              : null,
          width: double.infinity,
        ).animate().fadeIn(duration: 400.ms, delay: 300.ms),
      ],
    );
  }

  Widget _buildResultsSection(DetectionSuccess state) {
    final result = state.result;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Results',
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: AppTheme.spacingMedium),
        // Stats Row
        Row(
          children: [
            Expanded(
              child: _StatCard(
                icon: Icons.timer,
                label: 'Time',
                value: result.inferenceTimeFormatted,
              ),
            ),
            const SizedBox(width: AppTheme.spacingSmall),
            Expanded(
              child: _StatCard(
                icon: Icons.visibility,
                label: 'Detections',
                value: '${result.detectionCount}',
              ),
            ),
            const SizedBox(width: AppTheme.spacingSmall),
            Expanded(
              child: _StatCard(
                icon: Icons.aspect_ratio,
                label: 'Size',
                value: '${result.imageWidth}×${result.imageHeight}',
              ),
            ),
          ],
        ),
        const SizedBox(height: AppTheme.spacingMedium),
        // Detections List
        if (result.hasDetections)
          ...result.detections.asMap().entries.map((entry) {
            final index = entry.key;
            final detection = entry.value;
            return Padding(
              padding: const EdgeInsets.only(bottom: AppTheme.spacingSmall),
              child: GlassCard(
                child: Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        gradient: _gradient,
                        borderRadius: BorderRadius.circular(AppTheme.radiusSmall),
                      ),
                      child: Center(
                        child: Text(
                          '${index + 1}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: AppTheme.spacingMedium),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            detection.className.toUpperCase(),
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                          Text(
                            'Confidence: ${detection.confidencePercent}',
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                  color: Theme.of(context).textTheme.bodySmall?.color,
                                ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.successColor.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        detection.confidencePercent,
                        style: const TextStyle(
                          color: AppTheme.successColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn(
                    duration: 400.ms,
                    delay: Duration(milliseconds: 400 + index * 100),
                  ),
            );
          })
        else
          GlassCard(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.check_circle_outline,
                  color: AppTheme.successColor,
                  size: 24,
                ),
                const SizedBox(width: AppTheme.spacingSmall),
                Text(
                  'No ${widget.detectionType.id.replaceAll('_', ' ')} detected',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: AppTheme.successColor,
                      ),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 400.ms, delay: 400.ms),
      ],
    ).animate().fadeIn(duration: 400.ms);
  }

  Widget _buildErrorSection(DetectionError state) {
    return GlassCard(
      borderColor: AppTheme.dangerColor.withValues(alpha: 0.5),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppTheme.dangerColor.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(
              Icons.error_outline,
              color: AppTheme.dangerColor,
            ),
          ),
          const SizedBox(width: AppTheme.spacingMedium),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Error',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: AppTheme.dangerColor,
                      ),
                ),
                Text(
                  state.message,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Theme.of(context).textTheme.bodySmall?.color,
                      ),
                ),
              ],
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 400.ms).shake();
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _StatCard({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      padding: const EdgeInsets.all(AppTheme.spacingMedium),
      child: Column(
        children: [
          Icon(icon, color: Theme.of(context).primaryColor, size: 20),
          const SizedBox(height: AppTheme.spacingXSmall),
          Text(
            value,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          Text(
            label,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Theme.of(context).textTheme.bodySmall?.color,
                ),
          ),
        ],
      ),
    );
  }
}

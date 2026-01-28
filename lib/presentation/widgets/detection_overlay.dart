import 'package:flutter/material.dart';
import '../../domain/entities/detection_entity.dart';
import '../../core/theme.dart';

/// Custom painter for drawing detection bounding boxes on images
class DetectionOverlay extends StatelessWidget {
  final List<Detection> detections;
  final int imageWidth;
  final int imageHeight;

  const DetectionOverlay({
    super.key,
    required this.detections,
    required this.imageWidth,
    required this.imageHeight,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return CustomPaint(
          size: Size(constraints.maxWidth, constraints.maxHeight),
          painter: _DetectionPainter(
            detections: detections,
            imageWidth: imageWidth,
            imageHeight: imageHeight,
          ),
        );
      },
    );
  }
}

class _DetectionPainter extends CustomPainter {
  final List<Detection> detections;
  final int imageWidth;
  final int imageHeight;

  _DetectionPainter({
    required this.detections,
    required this.imageWidth,
    required this.imageHeight,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final scaleX = size.width / imageWidth;
    final scaleY = size.height / imageHeight;

    for (final detection in detections) {
      final bbox = detection.bbox;

      // Scale coordinates to display size
      final left = bbox.x1 * scaleX;
      final top = bbox.y1 * scaleY;
      final right = bbox.x2 * scaleX;
      final bottom = bbox.y2 * scaleY;

      final rect = Rect.fromLTRB(left, top, right, bottom);

      // Determine color based on class
      final color = detection.className.toLowerCase().contains('accident')
          ? AppTheme.warningColor
          : AppTheme.dangerColor;

      // Draw filled rectangle with low opacity
      final fillPaint = Paint()
        ..color = color.withValues(alpha: 0.2)
        ..style = PaintingStyle.fill;
      canvas.drawRect(rect, fillPaint);

      // Draw border
      final borderPaint = Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = 3;
      canvas.drawRect(rect, borderPaint);

      // Draw corner accents
      _drawCornerAccents(canvas, rect, color);

      // Draw label background
      final labelText = '${detection.className} ${detection.confidencePercent}';
      final textPainter = TextPainter(
        text: TextSpan(
          text: labelText,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 12,
            fontWeight: FontWeight.bold,
          ),
        ),
        textDirection: TextDirection.ltr,
      )..layout();

      final labelRect = Rect.fromLTWH(
        left,
        top - 24,
        textPainter.width + 16,
        22,
      );

      final labelPaint = Paint()..color = color;
      final labelRRect = RRect.fromRectAndRadius(
        labelRect,
        const Radius.circular(4),
      );
      canvas.drawRRect(labelRRect, labelPaint);

      // Draw label text
      textPainter.paint(canvas, Offset(left + 8, top - 21));
    }
  }

  void _drawCornerAccents(Canvas canvas, Rect rect, Color color) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4
      ..strokeCap = StrokeCap.round;

    const cornerLength = 15.0;

    // Top-left
    canvas.drawLine(
      rect.topLeft,
      Offset(rect.left + cornerLength, rect.top),
      paint,
    );
    canvas.drawLine(
      rect.topLeft,
      Offset(rect.left, rect.top + cornerLength),
      paint,
    );

    // Top-right
    canvas.drawLine(
      rect.topRight,
      Offset(rect.right - cornerLength, rect.top),
      paint,
    );
    canvas.drawLine(
      rect.topRight,
      Offset(rect.right, rect.top + cornerLength),
      paint,
    );

    // Bottom-left
    canvas.drawLine(
      rect.bottomLeft,
      Offset(rect.left + cornerLength, rect.bottom),
      paint,
    );
    canvas.drawLine(
      rect.bottomLeft,
      Offset(rect.left, rect.bottom - cornerLength),
      paint,
    );

    // Bottom-right
    canvas.drawLine(
      rect.bottomRight,
      Offset(rect.right - cornerLength, rect.bottom),
      paint,
    );
    canvas.drawLine(
      rect.bottomRight,
      Offset(rect.right, rect.bottom - cornerLength),
      paint,
    );
  }

  @override
  bool shouldRepaint(covariant _DetectionPainter oldDelegate) {
    return detections != oldDelegate.detections;
  }
}

import 'dart:math';
import 'package:flutter/material.dart';
import 'package:bored_games/app/theme.dart';

class CyberLaunchTransition extends StatelessWidget {
  final Animation<double> animation;
  final Widget child;

  const CyberLaunchTransition({
    super.key,
    required this.animation,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        child,
        AnimatedBuilder(
          animation: animation,
          builder: (context, _) {
            // If animation is complete, don't paint lines to save resources
            if (animation.status == AnimationStatus.completed) {
              return const SizedBox.shrink();
            }
            return CustomPaint(
              size: Size.infinite,
              painter: _CyberLinePainter(
                progress: animation.value,
                color: CyberColors.hazardMagenta,
              ),
            );
          },
        ),
      ],
    );
  }
}

class _CyberLinePainter extends CustomPainter {
  final double progress;
  final Color color;
  final Random _random = Random(42); // Fixed seed for consistent "randomness"

  _CyberLinePainter({required this.progress, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    // Phase 1: Grid Wipe (0.0 -> 0.5)
    // Phase 2: Fade Out / Expand (0.5 -> 1.0)
    
    final paint = Paint()
      ..color = color
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;

    final double gridProgress = (progress * 2).clamp(0.0, 1.0);
    // As progress goes 0->0.5, lines move across screen.
    // We'll simulate lines "shooting" from left/top to right/bottom.

    // Vertical Lines
    for (int i = 0; i < size.width; i += 40) {
      double lineDelay = (i / size.width) * 0.5; // Staggered start
      double lineProgress = (gridProgress - lineDelay) * 2; // Speed
      lineProgress = lineProgress.clamp(0.0, 1.0);

      if (lineProgress > 0 && lineProgress < 1.0) {
         // Draw a segment traveling down
         double startY = -size.height + (size.height * 2 * lineProgress);
         double endY = startY + size.height; // Long trail
         
         paint.color = color.withOpacity(1.0 - progress); // Fade out over time
         canvas.drawLine(Offset(i.toDouble(), startY), Offset(i.toDouble(), endY), paint);
      }
    }

    // Horizontal Lines (similar logic)
    for (int i = 0; i < size.height; i += 40) {
      double lineDelay = (i / size.height) * 0.5;
      double lineProgress = (gridProgress - lineDelay) * 2;
      lineProgress = lineProgress.clamp(0.0, 1.0);

      if (lineProgress > 0 && lineProgress < 1.0) {
         double startX = -size.width + (size.width * 2 * lineProgress);
         double endX = startX + size.width;
         
         paint.color = color.withOpacity(1.0 - progress);
         canvas.drawLine(Offset(startX, i.toDouble()), Offset(endX, i.toDouble()), paint);
      }
    }
  }

  @override
  bool shouldRepaint(_CyberLinePainter oldDelegate) {
    return oldDelegate.progress != progress;
  }
}

import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:bored_games/app/theme.dart';
import 'package:bored_games/core/state/animation_state.dart';

class CyberLaunchTransition extends ConsumerWidget {
  final Animation<double> animation;
  final Widget child;

  const CyberLaunchTransition({
    super.key,
    required this.animation,
    required this.child,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final focalPoint = ref.read(launchFocalPointProvider);

    return AnimatedBuilder(
      animation: animation,
      builder: (context, _) {
        // Handle Back Navigation (Reverse) -> Slide from Left to Right (Page slides out to Right)
        if (animation.status == AnimationStatus.reverse || 
            animation.status == AnimationStatus.dismissed) {
          final slideAnimation = Tween<Offset>(
            begin: const Offset(1.0, 0.0), // Off-screen right
            end: Offset.zero,              // On-screen center
          ).animate(CurvedAnimation(
            parent: animation,
            curve: Curves.easeInOut, // Smooth slide
          ));
          
          return SlideTransition(
            position: slideAnimation,
            child: child,
          );
        }

        // Handle Forward Navigation (Launch) -> Cyber Wipe + Fade
        // Calculate fade-in opacity for the game content
        final fadeProgress = ((animation.value - 0.7) / 0.3).clamp(0.0, 1.0);
        final opacity = Curves.easeIn.transform(fadeProgress);

        return Stack(
          children: [
            // 1. The Black Wipe (Covers the previous screen radially)
            ClipRect(
              child: ShaderMask(
                shaderCallback: (rect) {
                  final center = focalPoint ?? rect.center;
                  final maxDist = sqrt(rect.width * rect.width + rect.height * rect.height);
                  final radius = animation.value * maxDist * 1.5;

                  return RadialGradient(
                    center: Alignment(
                      (center.dx - rect.width / 2) / (rect.width / 2),
                      (center.dy - rect.height / 2) / (rect.height / 2),
                    ),
                    radius: radius / rect.shortestSide,
                    colors: const [Colors.white, Colors.transparent],
                    stops: const [0.0, 1.0],
                  ).createShader(rect);
                },
                blendMode: BlendMode.dstIn,
                child: Container(
                  color: CyberColors.voidBlack,
                ),
              ),
            ),

            // 2. The Game Content (Fades in)
            Opacity(
              opacity: opacity,
              child: child,
            ),
            
            // 3. The Decoration Lines (Overlay)
            if (animation.status != AnimationStatus.completed)
              CustomPaint(
                size: Size.infinite,
                painter: _CyberLinePainter(
                  progress: animation.value,
                  color: CyberColors.hazardMagenta,
                  focalPoint: focalPoint,
                ),
              ),
          ],
        );
      },
    );
  }
}

class _CyberLinePainter extends CustomPainter {
  final double progress;
  final Color color;
  final Offset? focalPoint;

  _CyberLinePainter({
    required this.progress,
    required this.color,
    this.focalPoint,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;

    final center = focalPoint ?? Offset(size.width / 2, size.height / 2);
    final maxDist = sqrt(size.width * size.width + size.height * size.height);

    // We want lines to start moving based on their distance from center.
    // Normalized distance from 0.0 (at center) to 1.0 (at furthers corner)
    
    // Grid Logic
    // We'll calculate progress for each line ID (x or y coordinate)
    
    // Vertical Lines
    for (int i = 0; i < size.width; i += 40) {
      double lineX = i.toDouble();
      // Distance from focal center's X projection (simplified)
      // Or better: distance of the closest point on this line to the center
      double dist = (lineX - center.dx).abs(); 
      double normalizedDist = dist / size.width;
      
      double delay = normalizedDist * 0.5; 
      double lineProgress = (progress * 1.5 - delay).clamp(0.0, 1.0);
      
      if (lineProgress > 0 && lineProgress < 1.0) {
         // Determine direction based on y position relative to center? 
         // Let's just have them shoot DOWN for Matrix style, but delayed by x-dist
         
         double startY = -size.height + (size.height * 2 * lineProgress);
         double endY = startY + size.height; 
         
         paint.color = color.withOpacity(1.0 - progress); 
         canvas.drawLine(Offset(lineX, startY), Offset(lineX, endY), paint);
      }
    }

    // Horizontal Lines
    for (int i = 0; i < size.height; i += 40) {
      double lineY = i.toDouble();
      double dist = (lineY - center.dy).abs();
      double normalizedDist = dist / size.height;

      double delay = normalizedDist * 0.5;
      double lineProgress = (progress * 1.5 - delay).clamp(0.0, 1.0);

      if (lineProgress > 0 && lineProgress < 1.0) {
         double startX = -size.width + (size.width * 2 * lineProgress);
         double endX = startX + size.width;
         
         paint.color = color.withOpacity(1.0 - progress);
         canvas.drawLine(Offset(startX, lineY), Offset(endX, lineY), paint);
      }
    }
    
    // Optional: Draw an expanding circle from focal point
    /*
    if (progress < 0.5) {
      final circlePaint = Paint()
        ..color = color.withOpacity(1.0 - (progress * 2))
        ..style = PaintingStyle.stroke
        ..strokeWidth = 4.0;
      canvas.drawCircle(center, progress * maxDist * 1.2, circlePaint);
    }
    */
  }

  @override
  bool shouldRepaint(_CyberLinePainter oldDelegate) {
    return oldDelegate.progress != progress || oldDelegate.focalPoint != focalPoint;
  }
}

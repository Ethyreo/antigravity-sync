import 'dart:math';
import 'package:flutter/material.dart';

class CyberParticles extends StatefulWidget {
  final int count;
  final Color color;
  final double size;
  final double spread;
  final Duration duration;
  final bool autoPlay;

  const CyberParticles({
    super.key,
    this.count = 20,
    required this.color,
    this.size = 4.0,
    this.spread = 50.0,
    this.duration = const Duration(milliseconds: 600),
    this.autoPlay = true,
  });

  @override
  State<CyberParticles> createState() => _CyberParticlesState();
}

class _CyberParticlesState extends State<CyberParticles> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<_Particle> _particles = [];
  final Random _random = Random();

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration);
    _initParticles();

    if (widget.autoPlay) {
      _controller.forward();
    }
  }

  void _initParticles() {
    _particles.clear();
    for (int i = 0; i < widget.count; i++) {
      double angle = _random.nextDouble() * 2 * pi;
      double speed = _random.nextDouble() * widget.spread;
      _particles.add(_Particle(
        angle: angle,
        speed: speed,
        size: widget.size * (0.5 + _random.nextDouble() * 0.5), // Varied size
      ));
    }
  }

  @override
  void didUpdateWidget(CyberParticles oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.autoPlay != widget.autoPlay && widget.autoPlay) {
      _controller.reset();
      _initParticles();
      _controller.forward();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        if (_controller.status == AnimationStatus.completed) {
          return const SizedBox.shrink();
        }
        return CustomPaint(
          size: Size.zero,
          painter: _ParticlePainter(
            particles: _particles,
            progress: _controller.value,
            color: widget.color,
          ),
        );
      },
    );
  }
}

class _Particle {
  final double angle;
  final double speed;
  final double size;

  _Particle({required this.angle, required this.speed, required this.size});
}

class _ParticlePainter extends CustomPainter {
  final List<_Particle> particles;
  final double progress;
  final Color color;

  _ParticlePainter({
    required this.particles,
    required this.progress,
    required this.color,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..style = PaintingStyle.fill;

    for (var particle in particles) {
      double distance = particle.speed * progress;
      double dx = cos(particle.angle) * distance;
      double dy = sin(particle.angle) * distance;
      
      // Opacity fades out at the end
      double opacity = (1.0 - progress).clamp(0.0, 1.0);
      paint.color = color.withOpacity(opacity);

      // Draw SQUARE particle (rect)
      Rect rect = Rect.fromCenter(
        center: Offset(dx, dy), // Relative to center (0,0) of CustomPaint
        width: particle.size,
        height: particle.size,
      );
      canvas.drawRect(rect, paint);
    }
  }

  @override
  bool shouldRepaint(_ParticlePainter oldDelegate) => true;
}

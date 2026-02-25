import 'dart:math';
import 'package:flutter/material.dart';

class Particle {
  double x, y;
  double vx, vy;
  double life; // 0.0 to 1.0 (opacity)
  double decay; // rate of life loss per second
  Color color;
  double size;

  Particle({
    required this.x, required this.y,
    required this.vx, required this.vy,
    required this.color,
    this.life = 1.0,
    this.decay = 2.0,
    this.size = 2.0,
  });

  bool update(double dt) {
    x += vx * dt;
    y += vy * dt;
    life -= decay * dt;
    return life > 0;
  }
}

class ParticleSystem {
  final List<Particle> particles = [];
  final Random _rng = Random();

  void update(double dt) {
    particles.removeWhere((p) => !p.update(dt));
  }

  void emitExplosion(double x, double y, Color color, int count) {
    for (int i = 0; i < count; i++) {
      final angle = _rng.nextDouble() * 2 * pi;
      final speed = 40 + _rng.nextDouble() * 120;
      particles.add(Particle(
        x: x, y: y,
        vx: cos(angle) * speed,
        vy: sin(angle) * speed,
        color: color,
        decay: 1.0 + _rng.nextDouble() * 2.0,
        size: 2 + _rng.nextDouble() * 3,
      ));
    }
  }

  void emitRunDust(double x, double y, double dir) {
    // dir: 1 for running right (dust kicks left), -1 for running left
    if (_rng.nextDouble() > 0.3) return; // Don't emit every frame
    particles.add(Particle(
      x: x, y: y,
      vx: (dir * -20) + (dir * _rng.nextDouble() * -40),
      vy: -10 - _rng.nextDouble() * 20,
      color: Colors.white.withOpacity(0.4),
      decay: 3.5,
      size: 1 + _rng.nextDouble() * 2,
    ));
  }

  void emitJumpSparks(double x, double y) {
    for (int i = 0; i < 5; i++) {
      final angle = -pi / 2 + (_rng.nextDouble() - 0.5);
      final speed = 30 + _rng.nextDouble() * 50;
      particles.add(Particle(
        x: x, y: y,
        vx: cos(angle) * speed,
        vy: sin(angle) * speed,
        color: Colors.cyanAccent,
        decay: 3.0,
        size: 1.5,
      ));
    }
  }
}

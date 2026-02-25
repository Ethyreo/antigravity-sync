import 'dart:math';
import 'package:flutter/material.dart';
import 'logic.dart';

class ParallaxBackground {
  // Static configuration
  static const int starCount = 60;
  static final Random _rng = Random(1337);
  
  // Cache procedural generation for consistent rendering
  static late final List<Offset> _stars;
  static late final List<double> _starSizes;
  static late final List<double> _buildingHeightsFar;
  static late final List<double> _buildingHeightsMid;

  static void init() {
    _stars = List.generate(starCount, (i) => Offset(
      _rng.nextDouble() * GC.viewW,
      _rng.nextDouble() * GC.viewH * 0.6
    ));
    _starSizes = List.generate(starCount, (i) => 0.5 + _rng.nextDouble() * 1.5);
    
    // Generate city skylines
    _buildingHeightsFar = List.generate(20, (i) => 30.0 + _rng.nextDouble() * 50);
    _buildingHeightsMid = List.generate(20, (i) => 50.0 + _rng.nextDouble() * 80);
  }

  static void draw(Canvas c, Size size, double camX, double animTime) {
    drawSky(c, size, animTime);
    drawFarCity(c, camX);
    drawMidCity(c, camX, animTime);
    // Near layer is handled by game platforms in renderer
  }

  static void drawSky(Canvas c, Size size, double t) {
    // 1. Gradient Background
    final paint = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [HC.sky1, HC.sky2],
      ).createShader(Rect.fromLTWH(0, 0, GC.viewW, GC.viewH));
    c.drawRect(Rect.fromLTWH(0, 0, GC.viewW, GC.viewH), paint);

    // 2. Twinkling Stars
    final starPaint = Paint()..color = HC.star;
    for (int i = 0; i < starCount; i++) {
      final flicker = (sin(t * 3 + i) + 1) / 2;
      starPaint.color = HC.star.withOpacity(0.2 + flicker * 0.6);
      c.drawCircle(_stars[i], _starSizes[i], starPaint);
    }
  }

  static void drawFarCity(Canvas c, double camX) {
    final paint = Paint()..color = HC.hillFar;
    const double layerSpeed = 0.1;
    const double buildingW = 40.0;
    
    final offset = camX * layerSpeed;
    final startIdx = (offset / buildingW).floor();
    final count = (GC.viewW / buildingW).ceil() + 1;

    for (int i = startIdx; i < startIdx + count; i++) {
      // Wrap index for infinite scrolling
      final h = _buildingHeightsFar[i % _buildingHeightsFar.length];
      final x = (i * buildingW) - offset;
      
      c.drawRect(
        Rect.fromLTWH(x, GC.viewH - h - 40, buildingW + 1, h + 40), 
        paint
      );
    }
  }

  static void drawMidCity(Canvas c, double camX, double t) {
    final paint = Paint()..color = HC.hillNear;
    final windowPaint = Paint()..color = HC.goalCyan.withOpacity(0.5);
    const double layerSpeed = 0.25;
    const double buildingW = 60.0;

    final offset = camX * layerSpeed;
    final startIdx = (offset / buildingW).floor();
    final count = (GC.viewW / buildingW).ceil() + 1;

    for (int i = startIdx; i < startIdx + count; i++) {
       final idx = i % _buildingHeightsMid.length;
       final h = _buildingHeightsMid[idx];
       final x = (i * buildingW) - offset;

       // Building Body
       c.drawRect(
         Rect.fromLTWH(x, GC.viewH - h - 20, buildingW + 1, h + 20), 
         paint
       );

       // Windows (Procedural neon lights)
       if (idx % 3 != 0) { // Some buildings are dark
         final rows = (h / 10).floor();
         for(int r = 0; r < rows; r++) {
           if ((i + r) % 2 == 0) continue; // Random pattern
           c.drawRect(
             Rect.fromLTWH(x + 10, GC.viewH - h - 10 + (r * 8), 6, 4),
             windowPaint
           );
           c.drawRect(
             Rect.fromLTWH(x + 30, GC.viewH - h - 10 + (r * 8), 6, 4),
             windowPaint
           );
         }
       }
    }
  }
}

import 'dart:math';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'logic.dart';
import 'parallax_background.dart';
import 'particle_system.dart';
import 'sprite_renderer.dart';



// ─── Game Renderer ────────────────────────────────────
class HedgehogPainter extends CustomPainter {
  final HedgehogState s;
  HedgehogPainter(this.s);

  @override
  void paint(Canvas c, Size size) {
    final sx = size.width / GC.viewW;
    final sy = size.height / GC.viewH;
    c.save();
    c.scale(sx, sy);

    ParallaxBackground.draw(c, size, s.cameraX, s.animTime);
    c.save();
    c.translate(-s.cameraX, 0);
    _drawPlatforms(c);
    _drawRings(c);
    _drawEnemies(c);
    _drawPlayer(c);
    _drawParticles(c);
    _drawGoal(c);
    c.restore();
    c.restore();
  }



  // ── Platforms ──
  void _drawPlatforms(Canvas c) {
    final tileLeft = SpriteRenderer.getImage('tile_left');
    final tileMid = SpriteRenderer.getImage('tile_mid');
    final tileRight = SpriteRenderer.getImage('tile_right');

    final bool hasAssets = tileLeft != null && tileMid != null && tileRight != null;

    final fill = Paint()..color = HC.platFill;
    final edge = Paint()
      ..color = HC.platEdge
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;
    final topLine = Paint()
      ..color = HC.groundTop
      ..strokeWidth = 2.5;

    for (final pl in s.platforms) {
      final r = Rect.fromLTWH(pl.rect.x, pl.rect.y, pl.rect.w, pl.rect.h);
      
      if (hasAssets && !pl.oneWay) {
        // Draw using Swamp Tiles
        // The original tiles are 128x128. We scale them down to match 32px height blocks
        const double tileSize = 32.0;
        final int tileCount = (pl.rect.w / tileSize).ceil();
        
        for (int i = 0; i < tileCount; i++) {
          final double xPos = pl.rect.x + (i * tileSize);
          final double drawW = (i == tileCount - 1) ? pl.rect.r - xPos : tileSize;
          
          ui.Image? imgToDraw;
          if (i == 0) {
            imgToDraw = tileLeft;
          } else if (i == tileCount - 1) {
            imgToDraw = tileRight;
          } else {
            imgToDraw = tileMid;
          }
          
          // Src rect is the full image (or clipped for the last tile)
          final srcRect = Rect.fromLTWH(0, 0, (drawW / tileSize) * imgToDraw.width, imgToDraw.height.toDouble());
          final destRect = Rect.fromLTWH(xPos, pl.rect.y, drawW, tileSize);
          c.drawImageRect(imgToDraw, srcRect, destRect, Paint());
        }

        // Draw filler for deep ground sections
        if (pl.rect.h > 32) {
           final dirtPaint = Paint()..color = const Color(0xFF1E272E); // Dark dirt color matching swamp
           c.drawRect(Rect.fromLTWH(pl.rect.x, pl.rect.y + 32, pl.rect.w, pl.rect.h - 32), dirtPaint);
        }

      } else {
        // Fallback or One-way procedural drawing
        if (pl.oneWay) {
          c.drawRect(r, fill);
          c.drawLine(Offset(pl.rect.x, pl.rect.y), Offset(pl.rect.r, pl.rect.y), topLine);
        } else {
          c.drawRect(r, fill);
          c.drawRect(r, edge);
          c.drawLine(Offset(pl.rect.x, pl.rect.y), Offset(pl.rect.r, pl.rect.y), topLine);
          final grassPaint = Paint()..color = HC.ground;
          c.drawRect(Rect.fromLTWH(pl.rect.x + 1, pl.rect.y + 3, pl.rect.w - 2, pl.rect.h - 4), grassPaint);
        }
      }
    }
  }

  // ── Neon Rings ──
  void _drawRings(Canvas c) {
    for (final ring in s.neonRings) {
      if (ring.collected) continue;
      final cx = ring.x + GC.ringSize / 2;
      final cy = ring.y + GC.ringSize / 2;
      final pulse = sin(ring.t * 4) * 0.15 + 0.85;
      final r = GC.ringSize / 2 * pulse;

      // Outer glow (Replaced Blur for FPS)
      c.drawCircle(
          Offset(cx, cy),
          r + 2,
          Paint()
            ..color = HC.ringOuter.withOpacity(0.25));
      // Ring circle
      c.drawCircle(
          Offset(cx, cy),
          r,
          Paint()
            ..color = HC.ringOuter
            ..style = PaintingStyle.stroke
            ..strokeWidth = 2.0);
      // Inner highlight
      c.drawCircle(
          Offset(cx, cy),
          r * 0.45,
          Paint()..color = HC.ringInner.withOpacity(0.7));
    }
  }

  // ─── Enemies ───
  void _drawEnemies(Canvas c) {
    for (final e in s.enemies) {
      if (!e.alive) continue;
      _drawNeonGlow(c, e.rect.cx, e.rect.cy, 20, e.type == EnemyType.walker ? HC.enemyBody : Colors.purpleAccent);
      
      if (e.type == EnemyType.walker) {
        // Draw Spider Bot
        final Color bodyColor = HC.enemyBody;
        final Color eyeColor = HC.enemyEye;
        
        // Body dome
        c.drawArc(
            Rect.fromLTWH(e.rect.x, e.rect.y + 8, e.rect.w, e.rect.h - 8), 
            pi, pi, true, 
            Paint()..color = bodyColor
        );
        c.drawRect(Rect.fromLTWH(e.rect.x, e.rect.cy + 4, e.rect.w, 4), Paint()..color = bodyColor.withOpacity(0.7));

        // Eye
        final eyeX = e.facing == FacingDir.right ? e.rect.x + 16 : e.rect.x + 6;
        c.drawCircle(Offset(eyeX, e.rect.y + 14), 3, Paint()..color = eyeColor);
        c.drawCircle(Offset(eyeX, e.rect.y + 14), 1.5, Paint()..color = Colors.black);

        // Legs
        final legShift = sin(e.t * 15) * 4;
        final legPaint = Paint()..color = bodyColor..strokeWidth = 2..style = PaintingStyle.stroke;
        c.drawLine(Offset(e.rect.x + 4, e.rect.cy + 8), Offset(e.rect.x + 2 - legShift, e.rect.b), legPaint);
        c.drawLine(Offset(e.rect.x + 13, e.rect.cy + 8), Offset(e.rect.x + 13 + (legShift * 0.5), e.rect.b), legPaint);
        c.drawLine(Offset(e.rect.x + 22, e.rect.cy + 8), Offset(e.rect.x + 24 + legShift, e.rect.b), legPaint);

      } else {
        // Draw Flying Saucer
        // Glow thrust
        final thrust = sin(e.t * 20).abs() * 6;
        c.drawArc(Rect.fromLTWH(e.rect.x + 6, e.rect.b - 8 - thrust, e.rect.w - 12, 16 + thrust), 0, pi, true, Paint()..color = Colors.cyanAccent.withOpacity(0.6));
        
        // Saucer rim
        c.drawOval(Rect.fromLTWH(e.rect.x - 4, e.rect.cy, e.rect.w + 8, 10), Paint()..color = HC.enemyBody);
        
        // Glass dome
        c.drawArc(Rect.fromLTWH(e.rect.x + 2, e.rect.y + 4, e.rect.w - 4, 20), pi, pi, true, Paint()..color = HC.enemyEye.withOpacity(0.7));
        
        // Blinking light
        if ((e.t * 5).floor() % 2 == 0) {
          c.drawCircle(Offset(e.rect.cx, e.rect.y + 6), 2, Paint()..color = Colors.redAccent);
        }
      }
    }
  }

  // ─── Player ───
  void _drawPlayer(Canvas c) {
    if (s.respawnTimer > 0) return;
    if (s.hurtTimer > 0 && (s.animTime * 10).floor() % 2 == 0) return;

    final px = s.px;
    final py = s.py;
    final right = s.facing == FacingDir.right;
    
    // Dynamic Glow (Keep for visual flair)
    _drawNeonGlow(c, px + GC.playerW/2, py + GC.playerH/2, 25, HC.playerBody.withOpacity(0.5));

    // Choose Sprite Sheet based on State
    String sheetKey = 'gorgon_idle';
    double frameRate = 10.0; // Frames per second

    if (s.pState == PlayerState.running) {
      sheetKey = 'gorgon_run';
      frameRate = 15.0; // Faster animation for running
    } else if (s.pState == PlayerState.jumping || s.pState == PlayerState.falling) {
      sheetKey = 'gorgon_jump'; // Special.png used for jump/roll
      frameRate = 12.0;
    } else if (s.pState == PlayerState.hurt) {
      sheetKey = 'gorgon_hurt';
      frameRate = 8.0;
    }

    final sheet = SpriteRenderer.getSheet(sheetKey);
    
    if (sheet != null) {
        // Calculate current frame using stateTime instead of global animTime
        int frameIndex = (s.stateTime * frameRate).floor();
        
        // Prevent jump/hurt animations from looping continuously
        if (s.pState == PlayerState.jumping || s.pState == PlayerState.falling || s.pState == PlayerState.hurt) {
          frameIndex = min(frameIndex, sheet.frameCount - 1);
        } else {
          frameIndex = frameIndex % sheet.frameCount;
        }
        
        // The Gorgon sprites are roughly 128x128. The actual character takes up less space.
        // We need to offset the drawing so the visual feet align with the collision box bottom (py + GC.playerH).
        // Trial and error scaling/offsetting based on typical CraftPix geometry.
        const double scale = 0.5; // Scale down the 128x128 to roughly 64x64 visually
        final double drawWidth = sheet.frameWidth * scale;
        final double drawHeight = sheet.frameHeight * scale;
        
        // Center horizontally around collision box center.
        final double drawX = px + (GC.playerW / 2) - (drawWidth / 2);
        // Align bottom to collision box bottom.
        final double drawY = py + GC.playerH - drawHeight + 16; // +16 pushes the feet down exactly onto the platform

        sheet.drawFrame(
            c, 
            frameIndex, 
            Offset(drawX, drawY), 
            scale: scale, 
            flipX: !right
        );
    } else {
        // Fallback to basic shape if assets fail to load immediately
        c.drawRect(Rect.fromLTWH(px, py, GC.playerW, GC.playerH), Paint()..color = Colors.red);
    }
  }

  void _drawNeonGlow(Canvas c, double x, double y, double radius, Color color) {
    // Replace expensive Blur with a fast RadialGradient
    final paint = Paint()
      ..shader = ui.Gradient.radial(
        Offset(x, y),
        radius,
        [color.withOpacity(0.4), color.withOpacity(0.0)],
        [0.0, 1.0],
      );
    c.drawRect(Rect.fromCircle(center: Offset(x, y), radius: radius), paint);
  }

  // ─── Particles ───
  void _drawParticles(Canvas c) {
    for (final p in s.particles.particles) {
      final paint = Paint()..color = p.color.withOpacity(p.life.clamp(0.0, 1.0));
      c.drawCircle(Offset(p.x, p.y), p.size, paint);
    }
  }

  // ── Goal ──
  void _drawGoal(Canvas c) {
    final x = s.goalX + 20;
    // Pole
    c.drawRect(
        Rect.fromLTWH(x, 140, 4, 98),
        Paint()..color = HC.goalCyan);

    // Checkered flag
    for (int row = 0; row < 4; row++) {
      for (int col = 0; col < 3; col++) {
        final isLight = (row + col) % 2 == 0;
        c.drawRect(
            Rect.fromLTWH(x + 4 + col * 8.0, 140 + row * 6.0, 8, 6),
            Paint()..color = isLight ? HC.goalCyan : Colors.black);
      }
    }

    // Glow (Replaced Blur for FPS)
    c.drawCircle(
        Offset(x + 16, 152), 18,
        Paint()
          ..color = HC.goalCyan.withOpacity(0.12));
  }

  @override
  bool shouldRepaint(covariant HedgehogPainter old) => true;
}

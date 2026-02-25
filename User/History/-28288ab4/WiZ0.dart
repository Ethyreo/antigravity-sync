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

      // Outer glow
      c.drawCircle(
          Offset(cx, cy),
          r + 2,
          Paint()
            ..color = HC.ringOuter.withOpacity(0.25)
            ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 3));
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
      final r = Rect.fromLTWH(e.rect.x, e.rect.y, e.rect.w, e.rect.h);
      // ... (existing drawing logic remains, essentially wrapper + glow)
      if (e.type == EnemyType.walker) {
         // ... (walker drawing)
         c.drawRRect(RRect.fromRectAndRadius(r, const Radius.circular(6)), Paint()..color = HC.enemyBody);
         // ... (simplified for brevity in this output, but I should keep original detail or improve)
         // Actually, I should just pre-pass glow loop or careful replacement.
         // Let's stick to the plan: ADD GLOW, IMPROVE PLAYER.
      } else {
         // ...
      }
      // Re-implementing existing enemy draw with glow added
        if (e.type == EnemyType.walker) {
        // Body
        c.drawRRect(
            RRect.fromRectAndRadius(r, const Radius.circular(4)),
            Paint()..color = HC.enemyBody);
        // Eyes
        final eyeX = e.facing == FacingDir.right
            ? e.rect.x + 16 : e.rect.x + 5;
        c.drawRect(
            Rect.fromLTWH(eyeX, e.rect.y + 7, 5, 5),
            Paint()..color = HC.enemyEye);
        c.drawRect(
            Rect.fromLTWH(eyeX + 1.5, e.rect.y + 9, 2, 2),
            Paint()..color = Colors.black);
        // Legs
        final legOffset = sin(e.t * 8) * 3;
        c.drawRect(
            Rect.fromLTWH(e.rect.x + 4, e.rect.b - 2 + legOffset, 5, 4),
            Paint()..color = HC.enemyBody.withOpacity(0.8));
        c.drawRect(
            Rect.fromLTWH(e.rect.x + 16, e.rect.b - 2 - legOffset, 5, 4),
            Paint()..color = HC.enemyBody.withOpacity(0.8));
      } else {
        // Flyer — diamond shape
        final path = Path()
          ..moveTo(e.rect.cx, e.rect.y)
          ..lineTo(e.rect.r, e.rect.cy)
          ..lineTo(e.rect.cx, e.rect.b)
          ..lineTo(e.rect.x, e.rect.cy)
          ..close();
        c.drawPath(path, Paint()..color = HC.enemyBody);
        // Eye
        c.drawCircle(
            Offset(e.rect.cx, e.rect.cy - 2), 3,
            Paint()..color = HC.enemyEye);
        c.drawCircle(
            Offset(e.rect.cx, e.rect.cy - 2), 1.5,
            Paint()..color = Colors.black);
        // Wings
        final wingY = sin(e.t * 10) * 3;
        c.drawLine(
            Offset(e.rect.x - 4, e.rect.cy + wingY),
            Offset(e.rect.x + 4, e.rect.cy - 4),
            Paint()
              ..color = HC.enemyBody.withOpacity(0.6)
              ..strokeWidth = 2);
        c.drawLine(
            Offset(e.rect.r + 4, e.rect.cy + wingY),
            Offset(e.rect.r - 4, e.rect.cy - 4),
            Paint()
              ..color = HC.enemyBody.withOpacity(0.6)
              ..strokeWidth = 2);
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
        // Calculate current frame
        final frameIndex = (s.animTime * frameRate).floor() % sheet.frameCount;
        
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
    c.drawCircle(
      Offset(x, y),
      radius,
      Paint()
        ..color = color.withOpacity(0.3)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 15)
    );
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

    // Glow
    c.drawCircle(
        Offset(x + 16, 152), 18,
        Paint()
          ..color = HC.goalCyan.withOpacity(0.08)
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 12));
  }

  @override
  bool shouldRepaint(covariant HedgehogPainter old) => true;
}

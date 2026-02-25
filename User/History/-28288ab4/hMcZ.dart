import 'dart:math';
import 'package:flutter/material.dart';
import 'logic.dart';
import 'parallax_background.dart';



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
    _drawGoal(c);
    c.restore();
    c.restore();
  }



  // ── Platforms ──
  void _drawPlatforms(Canvas c) {
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
      if (pl.oneWay) {
        // Thin one-way platform
        c.drawRect(r, fill);
        c.drawLine(Offset(pl.rect.x, pl.rect.y),
            Offset(pl.rect.r, pl.rect.y), topLine);
      } else {
        // Solid platform with neon edges
        c.drawRect(r, fill);
        c.drawRect(r, edge);
        c.drawLine(Offset(pl.rect.x, pl.rect.y),
            Offset(pl.rect.r, pl.rect.y), topLine);
        // Ground fill with subtle gradient
        final grassPaint = Paint()..color = HC.ground;
        c.drawRect(
            Rect.fromLTWH(pl.rect.x + 1, pl.rect.y + 3,
                pl.rect.w - 2, pl.rect.h - 4),
            grassPaint);
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

  // ── Enemies ──
  void _drawEnemies(Canvas c) {
    for (final e in s.enemies) {
      if (!e.alive) continue;
      final r = Rect.fromLTWH(e.rect.x, e.rect.y, e.rect.w, e.rect.h);

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

  // ── Player ──
  void _drawPlayer(Canvas c) {
    if (s.respawnTimer > 0) return;

    // Hurt flicker
    if (s.hurtTimer > 0 && (s.animTime * 10).floor() % 2 == 0) return;

    final px = s.px;
    final py = s.py;
    final right = s.facing == FacingDir.right;

    if (s.pState == PlayerState.jumping ||
        s.pState == PlayerState.falling) {
      // Ball form — spinning circle
      final cx = px + GC.playerW / 2;
      final cy = py + GC.playerH / 2;
      final r = GC.playerW / 2 + 2;

      c.drawCircle(Offset(cx, cy), r, Paint()..color = HC.playerBody);

      // Spinning spikes
      final angle = s.animTime * 12;
      for (int i = 0; i < 5; i++) {
        final a = angle + i * (2 * pi / 5);
        final sx = cx + cos(a) * (r + 3);
        final sy = cy + sin(a) * (r + 3);
        c.drawCircle(Offset(sx, sy), 2.5, Paint()..color = HC.playerSpike);
      }
    } else {
      // Standing form
      // Body
      c.drawRRect(
          RRect.fromRectAndRadius(
              Rect.fromLTWH(px + 2, py + 6, GC.playerW - 4, GC.playerH - 12),
              const Radius.circular(6)),
          Paint()..color = HC.playerBody);

      // Head
      c.drawCircle(
          Offset(px + GC.playerW / 2, py + 6), 8,
          Paint()..color = HC.playerBody);

      // Spikes (3 triangles on the back)
      final spikeX = right ? px - 1 : px + GC.playerW + 1;
      final dir = right ? -1.0 : 1.0;
      for (int i = 0; i < 3; i++) {
        final sy = py + 2 + i * 5.0;
        final path = Path()
          ..moveTo(px + GC.playerW / 2 + dir * -4, sy)
          ..lineTo(spikeX + dir * -3, sy + 2.5)
          ..lineTo(px + GC.playerW / 2 + dir * -4, sy + 5)
          ..close();
        c.drawPath(path, Paint()..color = HC.playerSpike);
      }

      // Eye
      final eyeX = right ? px + GC.playerW / 2 + 2 : px + GC.playerW / 2 - 6;
      c.drawRect(
          Rect.fromLTWH(eyeX, py + 3, 4, 4),
          Paint()..color = Colors.white);
      c.drawRect(
          Rect.fromLTWH(right ? eyeX + 2 : eyeX, py + 4, 2, 2),
          Paint()..color = Colors.black);

      // Shoes
      final legAnim = s.pState == PlayerState.running
          ? sin(s.animTime * 14) * 3 : 0.0;
      c.drawRect(
          Rect.fromLTWH(px + 3, py + GC.playerH - 6 + legAnim, 6, 5),
          Paint()..color = HC.playerShoe);
      c.drawRect(
          Rect.fromLTWH(px + GC.playerW - 9,
              py + GC.playerH - 6 - legAnim, 6, 5),
          Paint()..color = HC.playerShoe);
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

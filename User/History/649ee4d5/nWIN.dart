import 'package:flutter/material.dart';
import 'logic.dart';
import 'sprite_renderer.dart';

class ParallaxBackground {
  static void init() {
    // No longer generating procedural data
  }

  static void draw(Canvas c, Size size, double camX, double animTime) {
    _drawLayer(c, 'bg_1', camX, 0.05);  // Furthest (Sky/clouds)
    _drawLayer(c, 'bg_2', camX, 0.1);   // Far mountains
    _drawLayer(c, 'bg_3', camX, 0.25);  // Mid mountains
    _drawLayer(c, 'bg_4', camX, 0.45);  // Near trees/hills
    _drawLayer(c, 'bg_5', camX, 0.65);  // Foreground
  }

  static void _drawLayer(Canvas c, String imageKey, double camX, double parallaxFactor) {
    final img = SpriteRenderer.getImage(imageKey);
    if (img == null) return;

    // Calculate how much the layer should move
    final double offset = camX * parallaxFactor;
    
    // The images are typically 928x793 for CraftPix parallax.
    // We scale them to fit the vertical space constraints of our 480x270 logic resolution.
    final double scale = GC.viewH / img.height;
    final double drawWidth = img.width * scale;
    final double drawHeight = GC.viewH;

    // We tile the image horizontally to allow infinite scrolling
    // Calculate the starting X position based on the offset modulo the draw width
    final double startX = -(offset % drawWidth);

    // Draw enough copies to cover the screen width
    // Usually 2 copies are enough if the image is wider than the screen
    for (double x = startX; x < GC.viewW; x += drawWidth) {
      c.drawImageRect(
        img,
        Rect.fromLTWH(0, 0, img.width.toDouble(), img.height.toDouble()),
        Rect.fromLTWH(x, 0, drawWidth, drawHeight + 20), // +20 extends slightly below physical screen
        Paint(),
      );
    }
  }
}

import 'dart:async';
import 'dart:ui' as ui;
import 'package:flutter/services.dart';
import 'package:flutter/material.dart';

class SpriteSheet {
  final ui.Image image;
  final int frameWidth;
  final int frameHeight;
  final int frameCount;

  SpriteSheet({
    required this.image,
    required this.frameWidth,
    required this.frameHeight,
    required this.frameCount,
  });

  void drawFrame(Canvas canvas, int frameIndex, Offset position, {double scale = 1.0, bool flipX = false}) {
    if (frameIndex < 0 || frameIndex >= frameCount) return;

    final int cols = image.width ~/ frameWidth;
    final int row = frameIndex ~/ cols;
    final int col = frameIndex % cols;

    final srcRect = Rect.fromLTWH(
      col * frameWidth.toDouble(),
      row * frameHeight.toDouble(),
      frameWidth.toDouble(),
      frameHeight.toDouble(),
    );

    final destRect = Rect.fromLTWH(
      position.dx,
      position.dy,
      frameWidth * scale,
      frameHeight * scale,
    );

    canvas.save();
    if (flipX) {
      canvas.translate(position.dx + frameWidth * scale, position.dy);
      canvas.scale(-1, 1);
      canvas.translate(-position.dx, -position.dy);
    }
    canvas.drawImageRect(image, srcRect, destRect, Paint());
    canvas.restore();
  }
}

class SpriteRenderer {
  static final Map<String, ui.Image> _cache = {};
  static final Map<String, SpriteSheet> _sheets = {};

  static bool get isLoaded => _cache.isNotEmpty;

  static Future<void> loadAssets() async {
    // Character (Gorgon_1)
    await _loadImage('gorgon_idle', 'assets/Character/Gorgon_1/Idle.png');
    await _loadImage('gorgon_run', 'assets/Character/Gorgon_1/Run.png');
    await _loadImage('gorgon_jump', 'assets/Character/Gorgon_1/Special.png'); // Using Special for jump/roll
    await _loadImage('gorgon_hurt', 'assets/Character/Gorgon_1/Hurt.png');

    // Environment (Swamp)
    await _loadImage('tile_left', 'assets/swamp, plants, tiles etc/1 Tiles/Tile_01.png');
    await _loadImage('tile_mid', 'assets/swamp, plants, tiles etc/1 Tiles/Tile_02.png');
    await _loadImage('tile_right', 'assets/swamp, plants, tiles etc/1 Tiles/Tile_03.png');
    
    // Background Parallax
    await _loadImage('bg_1', 'assets/swamp, plants, tiles etc/2 Background/Layers/1.png');
    await _loadImage('bg_2', 'assets/swamp, plants, tiles etc/2 Background/Layers/2.png');
    await _loadImage('bg_3', 'assets/swamp, plants, tiles etc/2 Background/Layers/3.png');
    await _loadImage('bg_4', 'assets/swamp, plants, tiles etc/2 Background/Layers/4.png');
    await _loadImage('bg_5', 'assets/swamp, plants, tiles etc/2 Background/Layers/5.png');

    // Initialize Sprite Sheets (Assuming Gorgon frames are 128x128, standard for Craftpix)
    // We will verify frame counts/sizes dynamically if possible, or hardcode based on standard pack configs.
    // Based on typical CraftPix 4-7 frame animations:
    _initSheet('gorgon_idle', 128, 128, 7); 
    _initSheet('gorgon_run', 128, 128, 7);
    _initSheet('gorgon_jump', 128, 128, 4);
    _initSheet('gorgon_hurt', 128, 128, 3);
  }

  static Future<void> _loadImage(String key, String path) async {
    try {
      final data = await rootBundle.load(path);
      final codec = await ui.instantiateImageCodec(data.buffer.asUint8List());
      final frame = await codec.getNextFrame();
      _cache[key] = frame.image;
    } catch (e) {
      debugPrint('Failed to load asset: $path - $e');
    }
  }

  static void _initSheet(String key, int fW, int fH, int count) {
    var img = _cache[key];
    if (img != null) {
      // Auto-detect frame count based on width if it's a single row strip
      int actualCount = img.width ~/ fW; 
      _sheets[key] = SpriteSheet(image: img, frameWidth: fW, frameHeight: fH, frameCount: actualCount);
    }
  }

  static ui.Image? getImage(String key) => _cache[key];
  static SpriteSheet? getSheet(String key) => _sheets[key];
}

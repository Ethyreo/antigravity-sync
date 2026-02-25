import 'package:flutter/material.dart';
import 'package:bored_games/app/theme.dart';
import 'logic.dart';

class TetrisPainter extends CustomPainter {
  final TetrisState state;
  final double blockSize;
  final bool showGhost;

  // Cache paints to avoid GC churn
  static final Paint _gridPaint = Paint()
    ..color = CyberColors.dimGrid
    ..style = PaintingStyle.stroke
    ..strokeWidth = 1.0;

  static final Paint _highlightPaint = Paint()
    ..color = Colors.white.withOpacity(0.3)
    ..style = PaintingStyle.fill;

  // Cache for dynamic block colors
  static final Map<int, Paint> _fillPaints = {};
  static final Map<int, Paint> _borderPaints = {};
  static final Map<int, Paint> _ghostPaints = {};

  TetrisPainter({
    required this.state,
    required this.blockSize,
    this.showGhost = true,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // 1. Draw Grid Background
    for (int x = 0; x <= 10; x++) {
      canvas.drawLine(
        Offset(x * blockSize, 0),
        Offset(x * blockSize, 20 * blockSize),
        _gridPaint,
      );
    }
    for (int y = 0; y <= 20; y++) {
      canvas.drawLine(
        Offset(0, y * blockSize),
        Offset(10 * blockSize, y * blockSize),
        _gridPaint,
      );
    }

    // 2. Draw Locked Blocks
    for (int y = 0; y < 20; y++) {
      for (int x = 0; x < 10; x++) {
        final color = state.grid[y][x];
        if (color != null) {
          _drawBlock(canvas, x, y, color);
        }
      }
    }

    // 3. Draw Ghost Piece
    if (showGhost && state.currentPiece != null && state.status == GameStatus.playing) {
      final ghost = _calculateGhostPiece();
      if (ghost != null) {
        _drawGhostBlock(canvas, ghost);
      }
    }

    // 4. Draw Active Piece
    if (state.currentPiece != null) {
      final p = state.currentPiece!;
      for (int r = 0; r < p.shape.length; r++) {
        for (int c = 0; c < p.shape[r].length; c++) {
          if (p.shape[r][c] != 0) {
            _drawBlock(canvas, p.x + c, p.y + r, p.color);
          }
        }
      }
    }
  }

  TetrisPiece? _calculateGhostPiece() {
    if (state.currentPiece == null) return null;
    TetrisPiece ghost = state.currentPiece!;
    
    // Simulate drop until collision
    while (!_checkCollision(ghost.copyWith(y: ghost.y + 1))) {
      ghost = ghost.copyWith(y: ghost.y + 1);
    }
    return ghost;
  }

  bool _checkCollision(TetrisPiece piece) {
    for (int r = 0; r < piece.shape.length; r++) {
      for (int c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c] != 0) {
          int newX = piece.x + c;
          int newY = piece.y + r;
          if (newX < 0 || newX >= 10 || newY >= 20) return true;
          if (newY >= 0 && state.grid[newY][newX] != null) return true;
        }
      }
    }
    return false;
  }

  void _drawBlock(Canvas canvas, int x, int y, Color color) {
    final rect = Rect.fromLTWH(
      x * blockSize,
      y * blockSize,
      blockSize,
      blockSize,
    );

    // Get cached paints
    final fillPaint = _fillPaints.putIfAbsent(color.value, () => Paint()
      ..color = color.withOpacity(0.8)
      ..style = PaintingStyle.fill);
      
    final borderPaint = _borderPaints.putIfAbsent(color.value, () => Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0);

    // 1. Fill
    canvas.drawRect(rect.deflate(2.0), fillPaint);

    // 2. Inner Highlight
    canvas.drawRect(
      Rect.fromLTWH(
        x * blockSize + 4,
        y * blockSize + 4,
        blockSize - 8,
        blockSize / 4,
      ),
      _highlightPaint,
    );

    // 3. Border
    canvas.drawRect(rect.deflate(1.0), borderPaint);
  }

  void _drawGhostBlock(Canvas canvas, TetrisPiece ghost) {
    final paint = _ghostPaints.putIfAbsent(ghost.color.value, () => Paint()
      ..color = ghost.color.withOpacity(0.2)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5);

    for (int r = 0; r < ghost.shape.length; r++) {
      for (int c = 0; c < ghost.shape[r].length; c++) {
        if (ghost.shape[r][c] != 0) {
          final x = ghost.x + c;
          final y = ghost.y + r;
          final rect = Rect.fromLTWH(
            x * blockSize,
            y * blockSize,
            blockSize,
            blockSize,
          );
          
          canvas.drawRect(rect.deflate(1.0), paint);
        }
      }
    }
  }

  @override
  bool shouldRepaint(covariant TetrisPainter oldDelegate) {
    return oldDelegate.state != state;
  }
}

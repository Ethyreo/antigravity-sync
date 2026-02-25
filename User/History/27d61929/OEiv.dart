import 'package:flutter/material.dart';
import 'package:bored_games/app/theme.dart';
import 'logic.dart';

class TetrisPainter extends CustomPainter {
  final TetrisState state;
  final double blockSize;
  final bool showGhost;

  TetrisPainter({
    required this.state,
    required this.blockSize,
    this.showGhost = true,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // 1. Draw Grid Background
    final Paint gridPaint = Paint()
      ..color = CyberColors.dimGrid
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    for (int x = 0; x <= 10; x++) {
      canvas.drawLine(
        Offset(x * blockSize, 0),
        Offset(x * blockSize, 20 * blockSize),
        gridPaint,
      );
    }
    for (int y = 0; y <= 20; y++) {
      canvas.drawLine(
        Offset(0, y * blockSize),
        Offset(10 * blockSize, y * blockSize),
        gridPaint,
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

  // Duplicate collision check from logic for independent painter calculation
  // (Ideally this should be shared, but for painter independence we duplicate the check against grid)
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
    // Block Rect
    final rect = Rect.fromLTWH(
      x * blockSize,
      y * blockSize,
      blockSize,
      blockSize,
    );

    // 1. Fill
    final paint = Paint()
      ..color = color.withOpacity(0.8)
      ..style = PaintingStyle.fill;
    canvas.drawRect(rect.deflate(2.0), paint);

    // 2. Inner Highlight (3D effect / Bevel)
    final highlightPaint = Paint()
      ..color = Colors.white.withOpacity(0.3)
      ..style = PaintingStyle.fill;
    canvas.drawRect(
      Rect.fromLTWH(
        x * blockSize + 4,
        y * blockSize + 4,
        blockSize - 8,
        blockSize / 4,
      ),
      highlightPaint,
    );

    // 3. Border/Glow
    final borderPaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;

    // Optional: Add glow using MaskFilter if performance permits, 
    // but for 60fps on mobile/web simpler is better.
    canvas.drawRect(rect.deflate(1.0), borderPaint);
  }

  void _drawGhostBlock(Canvas canvas, TetrisPiece ghost) {
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

          final paint = Paint()
            ..color = ghost.color.withOpacity(0.2)
            ..style = PaintingStyle.stroke
            ..strokeWidth = 1.5;
          
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

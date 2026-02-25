import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:bored_games/app/theme.dart';
import 'package:bored_games/core/services/haptics_service.dart';
import 'package:bored_games/core/widgets/cyber_particles.dart';
import 'package:bored_games/core/widgets/game_scaffold.dart';
import 'package:bored_games/features/games/snake/logic.dart';

class SnakeGame extends ConsumerWidget {
  const SnakeGame({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(snakeGameProvider);
    final notifier = ref.read(snakeGameProvider.notifier);

    // Initial load
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (state.highScore == 0) notifier.loadHighScore();
    });

    return GameScaffold(
      title: 'NEON SNAKE',
      actions: [
        IconButton(
          icon: const Icon(Icons.refresh, color: CyberColors.electricCyan),
          onPressed: () {
            HapticsService.lightImpact();
            notifier.resetGame();
          },
        ),
      ],
      body: Column(
        children: [
          // Score Board
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildScore('SCORE', state.score),
                _buildScore('HIGH SCORE', state.highScore, color: CyberColors.cyberYellow),
              ],
            ),
          ),
          
          // Game Board
          Expanded(
            child: Center(
              child: AspectRatio(
                aspectRatio: 1, // Square board
                child: GestureDetector(
                  onVerticalDragUpdate: (details) {
                    if (details.delta.dy > 0) {
                      notifier.changeDirection(Direction.down);
                    } else if (details.delta.dy < 0) {
                      notifier.changeDirection(Direction.up);
                    }
                  },
                  onHorizontalDragUpdate: (details) {
                    if (details.delta.dx > 0) {
                      notifier.changeDirection(Direction.right);
                    } else if (details.delta.dx < 0) {
                      notifier.changeDirection(Direction.left);
                    }
                  },
                  child: Container(
                    decoration: BoxDecoration(
                      color: CyberColors.voidBlack,
                      border: Border.all(color: CyberColors.dimGrid, width: 2),
                    ),
                    margin: const EdgeInsets.all(16),
                    child: Stack(
                      children: [
                        // Grid & Snake
                        CustomPaint(
                          painter: _SnakePainter(state),
                          size: Size.infinite,
                        ),
                        
                        // Start/Game Over Overlay
                        if (!state.isPlaying)
                          Center(
                            child: Container(
                              padding: const EdgeInsets.all(20),
                              color: Colors.black54,
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    state.isGameOver ? 'GAME OVER' : 'READY?',
                                    style: TextStyle(
                                      fontFamily: 'Press Start 2P',
                                      fontSize: 24,
                                      color: state.isGameOver ? CyberColors.hazardMagenta : CyberColors.electricCyan,
                                    ),
                                  ),
                                  const SizedBox(height: 20),
                                  ElevatedButton(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: CyberColors.electricCyan,
                                      foregroundColor: CyberColors.voidBlack,
                                    ),
                                    onPressed: notifier.startGame,
                                    child: const Text('START'),
                                  )
                                ],
                              ),
                            ),
                          ),
                          
                        // Particles on Game Over
                        if (state.isGameOver)
                          const Center(
                            child: CyberParticles(
                              color: CyberColors.hazardMagenta,
                              count: 60,
                              spread: 200,
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          
          // Controls Hint
          const Padding(
            padding: EdgeInsets.only(bottom: 24.0),
            child: Text(
              'SWIPE TO MOVE',
              style: TextStyle(color: CyberColors.dimGrid, fontSize: 10),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildScore(String label, int value, {Color color = CyberColors.ghostWhite}) {
    return Column(
      children: [
        Text(label, style: const TextStyle(color: CyberColors.dimGrid, fontSize: 10)),
        const SizedBox(height: 4),
        Text(
          '$value',
          style: TextStyle(color: color, fontSize: 20, fontFamily: 'Press Start 2P'),
        ),
      ],
    );
  }
}

class _SnakePainter extends CustomPainter {
  final SnakeState state;

  _SnakePainter(this.state);

  @override
  void paint(Canvas canvas, Size size) {
    final double cellSize = size.width / 20; // Assuming 20x20 grid
    final Paint paint = Paint()..style = PaintingStyle.fill;

    // Draw Food
    paint.color = CyberColors.hazardMagenta;
    paint.shader = null;
    canvas.drawRect(
      Rect.fromLTWH(
        state.food.x * cellSize,
        state.food.y * cellSize,
        cellSize,
        cellSize,
      ),
      paint,
    );

    // Draw Snake
    for (int i = 0; i < state.snake.length; i++) {
      final point = state.snake[i];
      
      // Neon Trail Effect: Head is brightest, tail fades
      double opacity = 1.0 - (i / (state.snake.length + 5)); 
      paint.color = CyberColors.electricCyan.withOpacity(opacity.clamp(0.2, 1.0));
      
      canvas.drawRect(
        Rect.fromLTWH(
          point.x * cellSize + 1, // Gap for grid look
          point.y * cellSize + 1,
          cellSize - 2,
          cellSize - 2,
        ),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _SnakePainter oldDelegate) {
    return oldDelegate.state != state; 
  }
}

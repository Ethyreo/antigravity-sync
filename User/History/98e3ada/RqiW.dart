import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:bored_games/app/theme.dart';
import 'logic.dart';
import 'renderer.dart';

class TetrisGame extends ConsumerStatefulWidget {
  const TetrisGame({super.key});

  @override
  ConsumerState<TetrisGame> createState() => _TetrisGameState();
}

class _TetrisGameState extends ConsumerState<TetrisGame> {
  // Gesture state
  double _dragAccumulatorX = 0;
  double _dragAccumulatorY = 0;
  static const double _moveThreshold = 30.0; // Pixels to trigger a move

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(tetrisProvider);
    final notifier = ref.read(tetrisProvider.notifier);

    return Scaffold(
      backgroundColor: CyberColors.voidBlack,
      body: Stack(
        children: [
          // Background Grid Effect (Optional static decoration)
          Positioned.fill(
            child: Opacity(
              opacity: 0.1,
              child: GridPaper(
                color: CyberColors.electricCyan,
                interval: 50,
                divisions: 1,
                subdivisions: 1,
              ),
            ),
          ),

          // Main Game Layout
          SafeArea(
            child: OrientationBuilder(
              builder: (context, orientation) {
                return Row(
                  children: [
                    // Left HUD (Score/Level) - Landscape
                    if (orientation == Orientation.landscape)
                      Expanded(
                        child: _buildHud(state, isLeft: true),
                      ),

                    // Game Board
                    Expanded(
                      flex: 4,
                      child: Center(
                        child: AspectRatio(
                          aspectRatio: 10 / 20, // Tetris board ratio
                          child: GestureDetector(
                            onTap: notifier.rotate,
                            onDoubleTap: notifier.hardDrop,
                            onVerticalDragUpdate: (details) {
                              if (state.status != GameStatus.playing) return;
                              // Soft drop only on drag down
                              if (details.delta.dy > 0) {
                                _dragAccumulatorY += details.delta.dy;
                                if (_dragAccumulatorY > _moveThreshold) {
                                  notifier.softDrop();
                                  _dragAccumulatorY = 0;
                                }
                              }
                            },
                            onHorizontalDragUpdate: (details) {
                              if (state.status != GameStatus.playing) return;
                              _dragAccumulatorX += details.delta.dx;
                              if (_dragAccumulatorX.abs() > _moveThreshold) {
                                if (_dragAccumulatorX > 0) {
                                  notifier.moveRight();
                                } else {
                                  notifier.moveLeft();
                                }
                                _dragAccumulatorX = 0;
                              }
                            },
                            onHorizontalDragEnd: (_) => _dragAccumulatorX = 0,
                            onVerticalDragEnd: (_) => _dragAccumulatorY = 0,
                            child: Container(
                              decoration: BoxDecoration(
                                border: Border.all(
                                  color: CyberColors.electricCyan,
                                  width: 2,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: CyberColors.electricCyan
                                        .withOpacity(0.3),
                                    blurRadius: 10,
                                    spreadRadius: 2,
                                  )
                                ],
                              ),
                              child: CustomPaint(
                                painter: TetrisPainter(
                                  state: state,
                                  blockSize: 1.0, // Scaled by canvas transform usually, but here we let CustomPaint fit?
                                  // Actually CustomPaint passes size. We need to calculate tileSize inside painter based on size.
                                  // Wait, my painter took blockSize in constructor. 
                                  // I should modify painter/usage to use size.
                                ),
                                // We need a LayoutBuilder here to pass size? 
                                // No, CustomPaint passes size to paint().
                                // But I instantiated TetrisPainter with a fixed blockSize?
                                // Ah, I see internal ambiguity. Let's fix this below widget.
                                child: LayoutBuilder(
                                  builder: (ctx, constraints) {
                                    final blockSize = constraints.maxWidth / 10;
                                    return CustomPaint(
                                      painter: TetrisPainter(
                                        state: state,
                                        blockSize: blockSize,
                                      ),
                                    );
                                  },
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),

                    // Right HUD (Next Piece) - Landscape
                    // Or Mobile Portrait Layout
                    Expanded(
                      flex: orientation == Orientation.landscape ? 2 : 0,
                      child: orientation == Orientation.landscape
                          ? _buildHud(state, isLeft: false)
                          : const SizedBox.shrink(),
                    ),
                  ],
                );
              },
            ),
          ),

          // Portrait HUD overlay (if needed)
          // Simplified for now: Top HUD in portrait? 
          // I'll stick to a simple adaptable HUD.

          // Overlays
          if (state.status == GameStatus.initial)
            _buildOverlay(
              "CYBER TETRIS",
              "TAP TO START",
              Colors.greenAccent,
              notifier.startGame,
            ),
          
          if (state.status == GameStatus.paused)
            _buildOverlay(
              "PAUSED",
              "RESUME",
              Colors.orangeAccent,
              notifier.pauseGame,
            ),
            
          if (state.status == GameStatus.gameOver)
             _buildOverlay(
              "GAME OVER",
              "RETRY",
              Colors.redAccent,
              notifier.startGame,
              subtitle: "Score: ${state.score}",
            ),

          // Back Button
          Positioned(
            top: 40,
            left: 20,
            child: IconButton(
              icon: const Icon(Icons.arrow_back, color: CyberColors.electricCyan),
              onPressed: () {
                 if (state.status == GameStatus.playing) notifier.pauseGame();
                 context.pop();
              },
            ),
          ),
          
          // Pause Button (visible when playing)
           Positioned(
            top: 40,
            right: 20,
            child: IconButton(
              icon: Icon(
                state.status == GameStatus.paused ? Icons.play_arrow : Icons.pause,
                color: CyberColors.electricCyan,
              ),
              onPressed: notifier.pauseGame,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHud(TetrisState state, {required bool isLeft}) {
    // A simple container for score/next
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: isLeft
            ? [
                _buildInfoBox("SCORE", "${state.score}"),
                const SizedBox(height: 20),
                _buildInfoBox("LEVEL", "${state.level}"),
                const SizedBox(height: 20),
                _buildInfoBox("LINES", "${state.lines}"),
              ]
            : [
                 Text(
                  "NEXT",
                  style: AppTheme.cyberTheme.textTheme.headlineMedium?.copyWith(fontSize: 16),
                ),
                const SizedBox(height: 10),
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    border: Border.all(color: CyberColors.electricCyan),
                    color: Colors.black54
                  ),
                  child: CustomPaint(
                    painter: _NextPiecePainter(state.nextPiece),
                  ),
                ),
              ],
      ),
    );
  }

  Widget _buildInfoBox(String label, String value) {
    return Column(
      children: [
         Text(
          label,
          style: AppTheme.cyberTheme.textTheme.bodyMedium?.copyWith(
            color: CyberColors.ghostWhite,
            fontWeight: FontWeight.bold
          ),
        ),
        Text(
          value,
          style: AppTheme.cyberTheme.textTheme.headlineLarge?.copyWith(fontSize: 24),
        ),
      ],
    );
  }

  Widget _buildOverlay(String title, String buttonLabel, Color color, VoidCallback onTap, {String? subtitle}) {
    return Container(
      color: Colors.black.withOpacity(0.8),
      alignment: Alignment.center,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            title,
            style: AppTheme.cyberTheme.textTheme.headlineLarge?.copyWith(
              color: color,
              shadows: [Shadow(color: color, blurRadius: 20)],
            ),
          ),
          if (subtitle != null) ...[
            const SizedBox(height: 10),
            Text(
              subtitle,
              style: AppTheme.cyberTheme.textTheme.headlineMedium,
            ),
          ],
          const SizedBox(height: 40),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: color,
              foregroundColor: Colors.black,
              padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 20),
              shape:  const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
            ),
            onPressed: onTap,
            child: Text(
              buttonLabel,
              style: AppTheme.cyberTheme.textTheme.bodyLarge?.copyWith(
                color: Colors.black,
                fontWeight: FontWeight.bold
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _NextPiecePainter extends CustomPainter {
  final TetrisPiece? piece;
  _NextPiecePainter(this.piece);

  @override
  void paint(Canvas canvas, Size size) {
    if (piece == null) return;
    
    // Scale block size to fit 4x4 grid in container
    double blockSize = size.width / 4;
    
    // Center logic (simple offset)
    double offsetX = (size.width - (piece!.shape[0].length * blockSize)) / 2;
    double offsetY = (size.height - (piece!.shape.length * blockSize)) / 2;
    
    // Re-use logic for block drawing? Or simple draw?
    // Simple draw for now to avoid dependency cycle if I extracted too much.
    final paint = Paint()..style = PaintingStyle.fill;
    
    for (int r = 0; r < piece!.shape.length; r++) {
      for (int c = 0; c < piece!.shape[r].length; c++) {
        if (piece!.shape[r][c] != 0) {
           paint.color = piece!.color;
           canvas.drawRect(
             Rect.fromLTWH(offsetX + c * blockSize, offsetY + r * blockSize, blockSize - 2, blockSize - 2),
             paint
           );
        }
      }
    }
  }

  @override
  bool shouldRepaint(covariant _NextPiecePainter oldDelegate) => oldDelegate.piece != piece;
}

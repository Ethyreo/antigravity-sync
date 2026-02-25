import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:bored_games/app/theme.dart';
import 'package:bored_games/core/services/haptics_service.dart';
import 'package:bored_games/core/widgets/cyber_particles.dart';
import 'package:bored_games/core/widgets/game_scaffold.dart';
import 'package:bored_games/features/games/tic_tac_toe/logic.dart';

class TicTacToeGame extends ConsumerStatefulWidget {
  const TicTacToeGame({super.key});

  @override
  ConsumerState<TicTacToeGame> createState() => _TicTacToeGameState();
}

class _TicTacToeGameState extends ConsumerState<TicTacToeGame> {
  @override
  Widget build(BuildContext context) {
    final state = ref.watch(ticTacToeProvider);
    final notifier = ref.read(ticTacToeProvider.notifier);

    ref.listen(ticTacToeProvider, (previous, next) {
      if (next.winner != null && previous?.winner == null) {
        HapticsService.heavyImpact();
      } else if (next.board != previous?.board) {
        HapticsService.mediumImpact();
      }
    });

    // Initial load of high score
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (state.xWins == 0) notifier.loadWins();
    });

    return GameScaffold(
      title: 'TIC TAC TOE',
      actions: [
        IconButton(
          icon: const Icon(Icons.refresh, color: CyberColors.electricCyan),
          onPressed: () {
            HapticsService.lightImpact();
            notifier.reset();
          },
        ),
      ],
      body: Stack(
        alignment: Alignment.center,
        children: [
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildStatusText(state),
                const SizedBox(height: 16),
                Text(
                  'PLAYER X WINS: ${state.xWins}',
                  style: const TextStyle(color: CyberColors.ghostWhite, fontSize: 12),
                ),
                const SizedBox(height: 32),
                _buildBoard(state, notifier),
              ],
            ),
          ),
          if (state.winner == Player.x)
            const Positioned(
              child: CyberParticles(
                color: CyberColors.electricCyan,
                count: 50,
                spread: 150,
              ),
            ),
          if (state.winner == Player.o)
            const Positioned(
              child: CyberParticles(
                color: CyberColors.hazardMagenta,
                count: 50,
                spread: 150,
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildStatusText(TicTacToeState state) {
    String text;
    Color color = CyberColors.ghostWhite;

    if (state.winner != null) {
      text = '${state.winner == Player.x ? "X" : "O"} WINS!';
      color = state.winner == Player.x ? CyberColors.electricCyan : CyberColors.hazardMagenta;
    } else if (state.isDraw) {
      text = "DRAW GAME";
      color = CyberColors.cyberYellow;
    } else {
      text = "PLAYER ${state.currentPlayer == Player.x ? "X" : "O"}";
    }

    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 100),
      child: Text(
        text,
        key: ValueKey(text),
        style: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: color,
          shadows: [
            Shadow(color: color.withOpacity(0.8), blurRadius: 10),
          ],
        ),
      ),
    );
  }

  Widget _buildBoard(TicTacToeState state, TicTacToeNotifier notifier) {
    return Container(
      margin: const EdgeInsets.all(24),
      constraints: const BoxConstraints(maxWidth: 360, maxHeight: 360),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3,
          crossAxisSpacing: 8,
          mainAxisSpacing: 8,
        ),
        itemCount: 9,
        itemBuilder: (context, index) {
          final player = state.board[index];
          return GestureDetector(
            onTap: () => notifier.makeMove(index),
            child: Container(
              decoration: BoxDecoration(
                color: CyberColors.voidBlack,
                border: Border.all(
                  color: CyberColors.dimGrid,
                  width: 2,
                ),
              ),
              child: player == null
                  ? null
                  : Center(
                      child: Text(
                        player == Player.x ? 'X' : 'O',
                        style: TextStyle(
                          fontSize: 48,
                          fontWeight: FontWeight.bold,
                          color: player == Player.x
                              ? CyberColors.electricCyan
                              : CyberColors.hazardMagenta,
                          shadows: [
                            Shadow(
                              color: player == Player.x
                                  ? CyberColors.electricCyan.withOpacity(0.6)
                                  : CyberColors.hazardMagenta.withOpacity(0.6),
                              blurRadius: 8,
                            ),
                          ],
                        ),
                      ),
                    ),
            ),
          );
        },
      ),
    );
  }
}

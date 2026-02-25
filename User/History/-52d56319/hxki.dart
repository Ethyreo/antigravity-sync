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
        // Only haptic for human moves or AI moves? Both is fine.
        HapticsService.mediumImpact();
      }
      
      // Reset if user manually exits to menu (handled by state change to null)
    });

    // Initial load of high score
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (state.xWins == 0) notifier.loadWins();
    });

    return GameScaffold(
      title: 'TIC TAC TOE',
      actions: [
        if (state.gameMode != null)
          IconButton(
            icon: const Icon(Icons.refresh, color: CyberColors.electricCyan),
            onPressed: () {
              HapticsService.lightImpact();
              notifier.reset(); // Resets board only
            },
          ),
        if (state.gameMode != null)
          IconButton(
            icon: const Icon(Icons.logout, color: CyberColors.hazardMagenta),
            onPressed: () {
               HapticsService.mediumImpact();
               notifier.exitToMenu();
            },
          )
      ],
      body: state.gameMode == null 
          ? _buildModeSelection(notifier)
          : _buildGameContent(state, notifier),
    );
  }

  Widget _buildModeSelection(TicTacToeNotifier notifier) {
    // We need a local state for "Difficulty Selection" or just swap content
    // Let's use a simple local bool in state? 
    // Actually, we can just use a ValueNotifier/local state here or simple navigation.
    // Let's keep it simple: Two main buttons. If AI text clicked, expand options.
    
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text(
            "SELECT PROTOCOL",
            style: TextStyle(
              fontFamily: 'Press Start 2P',
              fontSize: 16,
              color: CyberColors.electricCyan,
            ),
          ),
          const SizedBox(height: 48),
          
          _CyberButton(
            text: "1v1 (HUMAN)",
            onTap: () => notifier.initializeGame(GameMode.pvp),
          ),
          const SizedBox(height: 24),
          
          const Text(
            "VS CYBERNET",
            style: TextStyle(color: CyberColors.dimGrid),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _CyberButton(
                text: "EASY", 
                compact: true,
                color: Colors.greenAccent,
                onTap: () => notifier.initializeGame(GameMode.pvAi, Difficulty.easy),
              ),
              const SizedBox(width: 8),
              _CyberButton(
                text: "NORMAL", 
                compact: true,
                color: Colors.yellowAccent,
                onTap: () => notifier.initializeGame(GameMode.pvAi, Difficulty.normal),
              ),
              const SizedBox(width: 8),
              _CyberButton(
                text: "HARD", 
                compact: true,
                color: CyberColors.hazardMagenta,
                onTap: () => notifier.initializeGame(GameMode.pvAi, Difficulty.hard),
              ),
            ],
          ),
        ],
      ),
    );
  }
  
  Widget _buildGameContent(TicTacToeState state, TicTacToeNotifier notifier) {
    return Stack(
        alignment: Alignment.center,
        children: [
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildStatusText(state),
                const SizedBox(height: 8),
                if (state.isAiThinking)
                   const Text(
                     "CYBERNET THINKING...",
                     style: TextStyle(
                       fontSize: 10,
                       letterSpacing: 2,
                       color: CyberColors.hazardMagenta,
                     ),
                   )
                else
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
      );
  }

  // Helper Button Class (Private)
  Widget _buildButton(String text, VoidCallback onTap) {
      return GestureDetector(
        onTap: () {
            HapticsService.selectionClick();
            onTap();
        },
        child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            decoration: BoxDecoration(
                border: Border.all(color: CyberColors.electricCyan),
                color: CyberColors.electricCyan.withOpacity(0.1),
            ),
            child: Text(text, style: const TextStyle(color: CyberColors.electricCyan, fontWeight: FontWeight.bold)),
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

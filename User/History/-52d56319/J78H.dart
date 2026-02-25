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
  Difficulty _selectedDifficulty = Difficulty.normal;
  bool _isVsAiSelected = false;

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
              notifier.reset();
            },
          ),
        if (state.gameMode != null)
          IconButton(
            icon: const Icon(Icons.logout, color: CyberColors.hazardMagenta),
            onPressed: () {
               HapticsService.mediumImpact();
               notifier.exitToMenu();
               setState(() => _isVsAiSelected = false);
            },
          )
      ],
      body: state.gameMode == null 
          ? _buildModeSelection(notifier)
          : _buildGameContent(state, notifier),
    );
  }

  Widget _buildModeSelection(TicTacToeNotifier notifier) {
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
          
          // 1v1 Button
          _CyberButton(
            text: "1v1 (HUMAN)",
            onTap: () => notifier.initializeGame(GameMode.pvp),
            color: _isVsAiSelected ? CyberColors.dimGrid : CyberColors.electricCyan,
          ),
          const SizedBox(height: 24),
          
          // VS Cybernet Button (Toggle)
          _CyberButton(
            text: "VS CYBERNET",
            color: _isVsAiSelected ? CyberColors.hazardMagenta : CyberColors.dimGrid,
            onTap: () {
              setState(() => _isVsAiSelected = true);
            },
          ),
          
          // Slider Section (Visible only when VS Cybernet is selected)
          AnimatedCrossFade(
            firstChild: const SizedBox(height: 0, width: double.infinity),
            secondChild: Column(
              children: [
                const SizedBox(height: 32),
                SizedBox(
                  width: 300,
                  child: Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10.0),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _buildLabel("EASY", Difficulty.easy),
                            _buildLabel("MEDIUM", Difficulty.normal),
                            _buildLabel("HARD", Difficulty.hard),
                          ],
                        ),
                      ),
                      SliderTheme(
                        data: SliderThemeData(
                          activeTrackColor: CyberColors.hazardMagenta,
                          inactiveTrackColor: CyberColors.dimGrid,
                          thumbColor: CyberColors.ghostWhite,
                          overlayColor: CyberColors.hazardMagenta.withOpacity(0.2),
                          trackHeight: 4,
                          thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 8),
                          overlayShape: const RoundSliderOverlayShape(overlayRadius: 16),
                          tickMarkShape: const RoundSliderTickMarkShape(tickMarkRadius: 4),
                          activeTickMarkColor: CyberColors.hazardMagenta,
                          inactiveTickMarkColor: CyberColors.dimGrid,
                        ),
                        child: Slider(
                          value: _selectedDifficulty.index.toDouble(),
                          min: 0,
                          max: 2,
                          divisions: 2,
                          onChanged: (value) {
                             setState(() {
                               _selectedDifficulty = Difficulty.values[value.round()];
                             });
                             HapticsService.selectionClick();
                          },
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                _CyberButton(
                  text: "INITIATE",
                  color: CyberColors.hazardMagenta,
                  onTap: () => notifier.initializeGame(GameMode.pvAi, _selectedDifficulty),
                ),
              ],
            ),
            crossFadeState: _isVsAiSelected ? CrossFadeState.showSecond : CrossFadeState.showFirst,
            duration: const Duration(milliseconds: 300),
          ),
        ],
      ),
    );
  }

  Widget _buildLabel(String text, Difficulty difficulty) {
    bool isSelected = _selectedDifficulty == difficulty;
    return Text(
      text,
      style: TextStyle(
        color: isSelected ? CyberColors.hazardMagenta : CyberColors.dimGrid,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        fontSize: 10,
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

class _CyberButton extends StatelessWidget {
  final String text;
  final VoidCallback onTap;
  final bool compact;
  final Color color;

  const _CyberButton({
    required this.text,
    required this.onTap,
    this.compact = false,
    this.color = CyberColors.electricCyan,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
        onTap: () {
            HapticsService.selectionClick();
            onTap();
        },
        child: MouseRegion(
          cursor: SystemMouseCursors.click,
          child: Container(
              padding: compact 
                ? const EdgeInsets.symmetric(horizontal: 16, vertical: 12)
                : const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
              decoration: BoxDecoration(
                  border: Border.all(color: color, width: 2),
                  color: color.withOpacity(0.05),
                  boxShadow: [
                    BoxShadow(color: color.withOpacity(0.2), blurRadius: 10, spreadRadius: 1)
                  ]
              ),
              child: Text(
                  text, 
                  style: TextStyle(
                      color: color, 
                      fontWeight: FontWeight.bold,
                      fontSize: compact ? 12 : 16,
                      letterSpacing: 1.5,
                  )
              ),
          ),
        ),
      );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:bored_games/core/widgets/game_scaffold.dart';
import 'package:bored_games/features/games/tic_tac_toe/logic.dart';

class TicTacToeGame extends ConsumerWidget {
  const TicTacToeGame({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(ticTacToeProvider);
    final notifier = ref.read(ticTacToeProvider.notifier);

    // Initial load of high score
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (state.xWins == 0) notifier.loadWins();
    });

    return GameScaffold(
      title: 'Tic Tac Toe',
      actions: [
        IconButton(
          icon: const Icon(Icons.refresh, color: Colors.white),
          onPressed: notifier.reset,
        ),
      ],
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildStatusText(state),
            const SizedBox(height: 16),
            Text(
              'Player X Wins: ${state.xWins}',
              style: const TextStyle(color: Colors.white70, fontSize: 16),
            ),
            const SizedBox(height: 16),
            _buildBoard(state, notifier),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusText(TicTacToeState state) {
    String text;
    Color color = Colors.white;

    if (state.winner != null) {
      text = '${state.winner == Player.x ? "X" : "O"} Wins!';
      color = Colors.greenAccent;
    } else if (state.isDraw) {
      text = "It's a Draw!";
      color = Colors.orangeAccent;
    } else {
      text = "Player ${state.currentPlayer == Player.x ? "X" : "O"}'s Turn";
    }

    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 300),
      child: Text(
        text,
        key: ValueKey(text),
        style: TextStyle(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: color,
        ),
      ),
    );
  }

  Widget _buildBoard(TicTacToeState state, TicTacToeNotifier notifier) {
    return Container(
      margin: const EdgeInsets.all(16),
      constraints: const BoxConstraints(maxWidth: 400, maxHeight: 400),
      decoration: BoxDecoration(
        color: Colors.white10,
        borderRadius: BorderRadius.circular(16),
      ),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3,
          crossAxisSpacing: 8,
          mainAxisSpacing: 8,
        ),
        padding: const EdgeInsets.all(8),
        itemCount: 9,
        itemBuilder: (context, index) {
          final player = state.board[index];
          return GestureDetector(
            onTap: () => notifier.makeMove(index),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white12,
                borderRadius: BorderRadius.circular(8),
              ),
              child: player == null
                  ? null
                  : Center(
                      child: Text(
                        player == Player.x ? 'X' : 'O',
                        style: TextStyle(
                          fontSize: 64,
                          fontWeight: FontWeight.bold,
                          color: player == Player.x
                              ? Colors.blueAccent
                              : Colors.redAccent,
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

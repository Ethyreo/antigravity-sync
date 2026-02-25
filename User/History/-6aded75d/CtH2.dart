import 'package:flutter_riverpod/flutter_riverpod.dart';

enum Player { x, o }

class TicTacToeState {
  final List<Player?> board;
  final Player currentPlayer;
  final Player? winner;
  final bool isDraw;
  final int xWins;

  const TicTacToeState({
    required this.board,
    required this.currentPlayer,
    this.winner,
    this.isDraw = false,
    this.xWins = 0,
  });

  factory TicTacToeState.initial() {
    return const TicTacToeState(
      board: [null, null, null, null, null, null, null, null, null],
      currentPlayer: Player.x,
    );
  }

  TicTacToeState copyWith({
    List<Player?>? board,
    Player? currentPlayer,
    Player? winner,
    bool? isDraw,
    int? xWins,
  }) {
    return TicTacToeState(
      board: board ?? this.board,
      currentPlayer: currentPlayer ?? this.currentPlayer,
      winner: winner,
      isDraw: isDraw ?? this.isDraw,
      xWins: xWins ?? this.xWins,
    );
  }
}

import 'package:bored_games/core/services/storage_service.dart';

class TicTacToeNotifier extends Notifier<TicTacToeState> {
  @override
  TicTacToeState build() {
    return TicTacToeState.initial();
  }

  void reset() {
    // Keep the high score/wins when resetting the board
    final currentWins = state.xWins; 
    state = TicTacToeState.initial().copyWith(xWins: currentWins);
  }

  void loadWins() {
    final wins = StorageService.getSecureHighscore('tic_tac_toe_x_wins');
    state = state.copyWith(xWins: wins);
  }

  Future<void> _saveWin() async {
    final newWins = state.xWins + 1;
    await StorageService.setSecureHighscore('tic_tac_toe_x_wins', newWins);
    state = state.copyWith(xWins: newWins);
  }

  void makeMove(int index) {
    if (state.board[index] != null || state.winner != null || state.isDraw) {
      return;
    }

    final newBoard = List<Player?>.from(state.board);
    newBoard[index] = state.currentPlayer;

    final winner = _checkWinner(newBoard);
    final isDraw = !newBoard.contains(null) && winner == null;

    state = state.copyWith(
      board: newBoard,
      currentPlayer: state.currentPlayer == Player.x ? Player.o : Player.x,
      winner: winner,
      isDraw: isDraw,
    );

    if (winner == Player.x) {
      _saveWin();
    }
  }

  Player? _checkWinner(List<Player?> board) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6],             // Diagonals
    ];

    for (var line in lines) {
      if (board[line[0]] != null &&
          board[line[0]] == board[line[1]] &&
          board[line[0]] == board[line[2]]) {
        return board[line[0]];
      }
    }
    return null;
  }
} // End of Notifier

final ticTacToeProvider =
    NotifierProvider<TicTacToeNotifier, TicTacToeState>(TicTacToeNotifier.new);

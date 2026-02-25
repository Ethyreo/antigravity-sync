import 'package:flutter_riverpod/flutter_riverpod.dart';

enum Player { x, o }

class TicTacToeState {
  final List<Player?> board;
  final Player currentPlayer;
  final Player? winner;
  final bool isDraw;

  const TicTacToeState({
    required this.board,
    required this.currentPlayer,
    this.winner,
    this.isDraw = false,
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
  }) {
    return TicTacToeState(
      board: board ?? this.board,
      currentPlayer: currentPlayer ?? this.currentPlayer,
      winner: winner,
      isDraw: isDraw ?? this.isDraw,
    );
  }
}

class TicTacToeNotifier extends Notifier<TicTacToeState> {
  @override
  TicTacToeState build() {
    return TicTacToeState.initial();
  }

  void reset() {
    state = TicTacToeState.initial();
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
}

final ticTacToeProvider =
    NotifierProvider<TicTacToeNotifier, TicTacToeState>(TicTacToeNotifier.new);

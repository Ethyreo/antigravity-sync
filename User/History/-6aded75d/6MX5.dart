import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:bored_games/core/services/storage_service.dart';
import 'package:bored_games/features/games/tic_tac_toe/ai.dart';

export 'package:bored_games/features/games/tic_tac_toe/ai.dart' show Difficulty;

enum Player { x, o }
enum GameMode { pvp, pvAi }

class TicTacToeState {
  final List<Player?> board;
  final Player currentPlayer;
  final Player? winner;
  final bool isDraw;
  final int xWins;
  
  // AI State
  final GameMode? gameMode; // Null = Selection Screen
  final Difficulty? difficulty;
  final bool isAiThinking;

  const TicTacToeState({
    required this.board,
    required this.currentPlayer,
    this.winner,
    this.isDraw = false,
    this.xWins = 0,
    this.gameMode,
    this.difficulty,
    this.isAiThinking = false,
  });

  factory TicTacToeState.initial() {
    return const TicTacToeState(
      board: [null, null, null, null, null, null, null, null, null],
      currentPlayer: Player.x,
      // Default to null mode to show selection screen
      gameMode: null, 
    );
  }

  TicTacToeState copyWith({
    List<Player?>? board,
    Player? currentPlayer,
    Player? winner,
    bool? isDraw,
    int? xWins,
    GameMode? gameMode,
    Difficulty? difficulty,
    bool? isAiThinking,
  }) {
    return TicTacToeState(
      board: board ?? this.board,
      currentPlayer: currentPlayer ?? this.currentPlayer,
      winner: winner,
      isDraw: isDraw ?? this.isDraw,
      xWins: xWins ?? this.xWins,
      gameMode: gameMode ?? this.gameMode,
      difficulty: difficulty ?? this.difficulty,
      isAiThinking: isAiThinking ?? this.isAiThinking,
    );
  }
}

class TicTacToeNotifier extends Notifier<TicTacToeState> {
  @override
  TicTacToeState build() {
    final wins = StorageService.getSecureHighscore('tic_tac_toe_x_wins');
    return TicTacToeState.initial().copyWith(xWins: wins);
  }

  void initializeGame(GameMode mode, [Difficulty? difficulty]) {
    // Keep wins but reset everything else
    final currentWins = state.xWins;
    state = TicTacToeState.initial().copyWith(
      xWins: currentWins,
      gameMode: mode,
      difficulty: difficulty,
    );
  }
  
  void reset() {
    if (state.gameMode == null) return; // Should not happen
    
    // Reset board but keep settings
    state = state.copyWith(
      board: [null, null, null, null, null, null, null, null, null],
      currentPlayer: Player.x,
      winner: null,
      isDraw: false,
      isAiThinking: false,
    );
  }

  void exitToMenu() {
    state = TicTacToeState.initial().copyWith(xWins: state.xWins);
  }

  Future<void> _saveWin() async {
    final newWins = state.xWins + 1;
    await StorageService.setSecureHighscore('tic_tac_toe_x_wins', newWins);
    state = state.copyWith(xWins: newWins);
  }

  Future<void> makeMove(int index) async {
    if (state.board[index] != null || 
        state.winner != null || 
        state.isDraw || 
        state.isAiThinking) {
      return;
    }

    // Human Move or AI Executed Move
    final newBoard = List<Player?>.from(state.board);
    newBoard[index] = state.currentPlayer;

    final winner = _checkWinner(newBoard);
    final isDraw = !newBoard.contains(null) && winner == null;

    final nextPlayer = state.currentPlayer == Player.x ? Player.o : Player.x;

    state = state.copyWith(
      board: newBoard,
      currentPlayer: nextPlayer,
      winner: winner,
      isDraw: isDraw,
    );

    if (winner == Player.x) {
      _saveWin();
    }
    
    // Trigger AI if needed
    if (winner == null && !isDraw && 
        state.gameMode == GameMode.pvAi && 
        nextPlayer == Player.o) {
      _makeAiMove();
    }
  }
  
  Future<void> _makeAiMove() async {
    if (state.difficulty == null) return;

    state = state.copyWith(isAiThinking: true);

    // Simulate thinking delay
    await Future.delayed(const Duration(milliseconds: 600));

    final bestMove = TicTacToeAI.getBestMove(state.board, state.difficulty!);
    if (bestMove != -1) {
      // Re-check state validity in case user reset during delay
      if (!state.isAiThinking) return; 
      
      // Stop thinking state handled in makeMove? 
      // No, makeMove checks isAiThinking. We must clear it *before* calling makeMove 
      // or inside makeMove. 
      // Actually, standard pattern: 
      
      state = state.copyWith(isAiThinking: false);
      makeMove(bestMove);
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
}

final ticTacToeProvider =
    NotifierProvider<TicTacToeNotifier, TicTacToeState>(TicTacToeNotifier.new);

import 'dart:math';
import 'package:bored_games/features/games/tic_tac_toe/logic.dart';

enum Difficulty { easy, normal, hard }

class TicTacToeAI {
  static final Random _random = Random();

  static int getBestMove(List<Player?> board, Difficulty difficulty) {
    switch (difficulty) {
      case Difficulty.easy:
        return _getRandomMove(board);
      case Difficulty.normal:
        return _getNormalMove(board);
      case Difficulty.hard:
        return _getMacMinMove(board);
    }
  }

  // --- Easy: Random ---
  static int _getRandomMove(List<Player?> board) {
    var available = <int>[];
    for (int i = 0; i < board.length; i++) {
      if (board[i] == null) available.add(i);
    }
    if (available.isEmpty) return -1;
    return available[_random.nextInt(available.length)];
  }

  // --- Normal: Rules ---
  static int _getNormalMove(List<Player?> board) {
    // 1. Check for immediate win
    int? winMove = _findWinningMove(board, Player.o);
    if (winMove != null) return winMove;

    // 2. Block opponent win
    int? blockMove = _findWinningMove(board, Player.x);
    if (blockMove != null) return blockMove;

    // 3. Take Center
    if (board[4] == null) return 4;

    // 4. Take Random Corner
    List<int> corners = [0, 2, 6, 8];
    corners.shuffle(_random);
    for (var corner in corners) {
      if (board[corner] == null) return corner;
    }

    // 5. Random
    return _getRandomMove(board);
  }

  static int? _findWinningMove(List<Player?> board, Player player) {
    // Check all empty spots. If placing 'player' there wins, return spot.
    for (int i = 0; i < board.length; i++) {
      if (board[i] == null) {
        // Simulate move
        board[i] = player;
        if (_checkWinner(board) == player) {
          board[i] = null; // Undo
          return i;
        }
        board[i] = null; // Undo
      }
    }
    return null;
  }

  // --- Hard: Minimax ---
  static int _getMacMinMove(List<Player?> board) {
    int bestScore = -1000;
    int bestMove = -1;

    for (int i = 0; i < board.length; i++) {
      if (board[i] == null) {
        board[i] = Player.o; // AI is O
        int score = _minimax(board, 0, false);
        board[i] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    
    // Fallback if something fails (shouldn't happen on empty board)
    if (bestMove == -1) return _getRandomMove(board);
    return bestMove;
  }

  static int _minimax(List<Player?> board, int depth, bool isMaximizing) {
    Player? result = _checkWinner(board);
    if (result == Player.o) return 10 - depth;
    if (result == Player.x) return depth - 10;
    if (!board.contains(null)) return 0; // Draw

    if (isMaximizing) {
      int bestScore = -1000;
      for (int i = 0; i < board.length; i++) {
        if (board[i] == null) {
          board[i] = Player.o;
          int score = _minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      int bestScore = 1000;
      for (int i = 0; i < board.length; i++) {
        if (board[i] == null) {
          board[i] = Player.x;
          int score = _minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  // Helper to check winner (duplicated from logic.dart but static)
  // Ideally, logic.dart should expose a static checkWinner, or we duplicate.
  // Duplicating for now to keep AI self-contained and stateless logic simple.
  static Player? _checkWinner(List<Player?> board) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
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

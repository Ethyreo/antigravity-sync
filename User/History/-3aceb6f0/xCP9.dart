import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:bored_games/app/theme.dart';

// --- Colors ---
class TetrisColors {
  static const Color cyan = CyberColors.electricCyan;
  static const Color blue = Color(0xFF0055FF); // Holographic Blue
  static const Color orange = Color(0xFFFF5500); // Solar Orange
  static const Color yellow = CyberColors.cyberYellow;
  static const Color green = Color(0xFF00FF00); // Toxic Green
  static const Color purple = Color(0xFFCC00FF); // Neon Purple
  static const Color red = CyberColors.hazardMagenta; // Hazard Red/Magenta
}

// --- Shapes ---
final List<List<List<int>>> _shapes = [
  // I (Cyan)
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  // J (Blue)
  [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  // L (Orange)
  [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ],
  // O (Yellow)
  [
    [1, 1],
    [1, 1]
  ],
  // S (Green)
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  // T (Purple)
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  // Z (Red)
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ]
];

final List<Color> _blockColors = [
  TetrisColors.cyan,
  TetrisColors.blue,
  TetrisColors.orange,
  TetrisColors.yellow,
  TetrisColors.green,
  TetrisColors.purple,
  TetrisColors.red,
];

// --- Models ---
enum GameStatus { initial, playing, paused, gameOver }

class TetrisPiece {
  final List<List<int>> shape;
  final Color color;
  final int x;
  final int y;

  const TetrisPiece({
    required this.shape,
    required this.color,
    required this.x,
    required this.y,
  });

  TetrisPiece copyWith({
    List<List<int>>? shape,
    Color? color,
    int? x,
    int? y,
  }) {
    return TetrisPiece(
      shape: shape ?? this.shape,
      color: color ?? this.color,
      x: x ?? this.x,
      y: y ?? this.y,
    );
  }

  TetrisPiece rotate() {
    final int rows = shape.length;
    final int cols = shape[0].length;
    List<List<int>> newShape = List.generate(cols, (i) => List.filled(rows, 0));

    for (int r = 0; r < rows; r++) {
      for (int c = 0; c < cols; c++) {
        newShape[c][rows - 1 - r] = shape[r][c];
      }
    }
    return copyWith(shape: newShape);
  }
}

class TetrisState {
  final List<List<Color?>> grid;
  final TetrisPiece? currentPiece;
  final TetrisPiece? nextPiece;
  final int score;
  final int level;
  final int lines;
  final GameStatus status;

  const TetrisState({
    required this.grid,
    this.currentPiece,
    this.nextPiece,
    this.score = 0,
    this.level = 1,
    this.lines = 0,
    this.status = GameStatus.initial,
  });

  TetrisState copyWith({
    List<List<Color?>>? grid,
    TetrisPiece? currentPiece,
    TetrisPiece? nextPiece,
    int? score,
    int? level,
    int? lines,
    GameStatus? status,
  }) {
    return TetrisState(
      grid: grid ?? this.grid,
      currentPiece: currentPiece ?? this.currentPiece,
      nextPiece: nextPiece ?? this.nextPiece,
      score: score ?? this.score,
      level: level ?? this.level,
      lines: lines ?? this.lines,
      status: status ?? this.status,
    );
  }

  // Create empty 10x20 grid
  static List<List<Color?>> emptyGrid() {
    return List.generate(20, (_) => List.filled(10, null));
  }
}

// --- Provider ---
final tetrisProvider = StateNotifierProvider<TetrisNotifier, TetrisState>((ref) {
  return TetrisNotifier();
});

// --- Notifier ---
class TetrisNotifier extends StateNotifier<TetrisState> {
  TetrisNotifier() : super(TetrisState(grid: TetrisState.emptyGrid()));

  Timer? _gameLoopTimer;
  final Random _random = Random();

  @override
  void dispose() {
    _gameLoopTimer?.cancel();
    super.dispose();
  }

  void startGame() {
    _resetState();
    _spawnPiece(); // Set current
    _spawnPiece(); // Set next
    // Move next to current
    state = state.copyWith(
      currentPiece: state.nextPiece,
      nextPiece: _generateRandomPiece(),
      status: GameStatus.playing,
    );
    _startGameLoop();
  }

  void pauseGame() {
    if (state.status == GameStatus.playing) {
      _stopGameLoop();
      state = state.copyWith(status: GameStatus.paused);
    } else if (state.status == GameStatus.paused) {
      state = state.copyWith(status: GameStatus.playing);
      _startGameLoop();
    }
  }

  void resetGame() {
    _stopGameLoop();
    _resetState();
  }

  void _resetState() {
    state = TetrisState(
      grid: TetrisState.emptyGrid(),
      score: 0,
      level: 1,
      lines: 0,
      status: GameStatus.initial,
    );
  }

  // --- Input ---

  void moveLeft() {
    if (state.status != GameStatus.playing) return;
    _tryMove(dx: -1);
  }

  void moveRight() {
    if (state.status != GameStatus.playing) return;
    _tryMove(dx: 1);
  }

  void rotate() {
    if (state.status != GameStatus.playing) return;
    if (state.currentPiece == null) return;

    final rotated = state.currentPiece!.rotate();
    if (!_checkCollision(rotated)) {
      state = state.copyWith(currentPiece: rotated);
    } else {
      // Wall kick (primitive: try left, try right)
      if (!_checkCollision(rotated.copyWith(x: rotated.x - 1))) {
        state = state.copyWith(currentPiece: rotated.copyWith(x: rotated.x - 1));
      } else if (!_checkCollision(rotated.copyWith(x: rotated.x + 1))) {
        state = state.copyWith(currentPiece: rotated.copyWith(x: rotated.x + 1));
      }
    }
  }

  void softDrop() {
    if (state.status != GameStatus.playing) return;
    if (!_tryMove(dy: 1)) {
      _lockPiece();
    }
  }

  void hardDrop() {
    if (state.status != GameStatus.playing) return;
    if (state.currentPiece == null) return;

    TetrisPiece p = state.currentPiece!;
    while (!_checkCollision(p.copyWith(y: p.y + 1))) {
      p = p.copyWith(y: p.y + 1);
    }
    state = state.copyWith(currentPiece: p);
    _lockPiece();
  }

  // --- Engine ---

  void _startGameLoop() {
    _stopGameLoop();
    int interval = max(100, 1000 - (state.level - 1) * 100);
    _gameLoopTimer = Timer.periodic(Duration(milliseconds: interval), (timer) {
      if (state.status == GameStatus.playing) {
        if (!_tryMove(dy: 1)) {
          _lockPiece();
        }
      }
    });
  }

  void _stopGameLoop() {
    _gameLoopTimer?.cancel();
    _gameLoopTimer = null;
  }

  bool _tryMove({int dx = 0, int dy = 0}) {
    if (state.currentPiece == null) return false;
    final p = state.currentPiece!;
    final moved = p.copyWith(x: p.x + dx, y: p.y + dy);

    if (!_checkCollision(moved)) {
      state = state.copyWith(currentPiece: moved);
      return true;
    }
    return false;
  }

  bool _checkCollision(TetrisPiece piece) {
    for (int r = 0; r < piece.shape.length; r++) {
      for (int c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c] != 0) {
          int newX = piece.x + c;
          int newY = piece.y + r;

          // Boundaries
          if (newX < 0 || newX >= 10 || newY >= 20) return true;

          // Occupied grid (ignore top invisible rows if we implement them, here newY >= 0 check)
          if (newY >= 0 && state.grid[newY][newX] != null) return true;
        }
      }
    }
    return false;
  }

  void _lockPiece() {
    if (state.currentPiece == null) return;
    final p = state.currentPiece!;

    // Clone grid
    final newGrid = List<List<Color?>>.from(
      state.grid.map((row) => List<Color?>.from(row)),
    );

    // Bake piece into grid
    for (int r = 0; r < p.shape.length; r++) {
      for (int c = 0; c < p.shape[r].length; c++) {
        if (p.shape[r][c] != 0) {
          int newX = p.x + c;
          int newY = p.y + r;
          if (newY >= 0 && newY < 20 && newX >= 0 && newX < 10) {
            newGrid[newY][newX] = p.color;
          }
        }
      }
    }

    state = state.copyWith(grid: newGrid);
    _clearLines();
    _spawnNext();
  }

  void _clearLines() {
    List<List<Color?>> newGrid = [];
    int linesCleared = 0;

    // Keep rows that are NOT full
    for (var row in state.grid) {
      if (row.any((cell) => cell == null)) {
        newGrid.add(row);
      } else {
        linesCleared++;
      }
    }

    if (linesCleared > 0) {
      // Add empty rows at top
      while (newGrid.length < 20) {
        newGrid.insert(0, List.filled(10, null));
      }

      int totalLines = state.lines + linesCleared;
      int oldLevel = state.level;
      int newLevel = (totalLines ~/ 10) + 1;

      // Score: 100, 300, 500, 800 * level
      List<int> points = [0, 100, 300, 500, 800];
      int addScore = points[linesCleared] * state.level;

      state = state.copyWith(
        grid: newGrid,
        score: state.score + addScore,
        lines: totalLines,
        level: newLevel,
      );

      if (newLevel > oldLevel) {
        _startGameLoop(); // Update speed
      }
    }
  }

  void _spawnNext() {
    final next = state.nextPiece!;
    // Check game over (naive check: if next piece collides at valid spawn)
    if (_checkCollision(next)) {
      state = state.copyWith(status: GameStatus.gameOver);
      _stopGameLoop();
    } else {
      state = state.copyWith(
        currentPiece: next,
        nextPiece: _generateRandomPiece(),
      );
    }
  }

  void _spawnPiece() {
    // Only used for initial setup in startGame
    // Intentionally empty or legacy, handled in startGame logic
  }

  TetrisPiece _generateRandomPiece() {
    int idx = _random.nextInt(_shapes.length);
    return TetrisPiece(
      shape: _shapes[idx],
      color: _blockColors[idx],
      x: 3, // Middle-ish
      y: 0,
    );
  }
}

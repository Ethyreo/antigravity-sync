import 'dart:async';
import 'dart:math';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:bored_games/core/services/storage_service.dart';
import 'package:bored_games/core/services/haptics_service.dart';

enum Direction { up, down, left, right }

class Point {
  final int x;
  final int y;
  const Point(this.x, this.y);

  @override
  bool operator ==(Object other) =>
      other is Point && other.x == x && other.y == y;

  @override
  int get hashCode => Object.hash(x, y);
}

class SnakeState {
  final List<Point> snake;
  final Point food;
  final Direction direction;
  final bool isPlaying;
  final bool isGameOver;
  final int score;
  final int highScore;

  const SnakeState({
    required this.snake,
    required this.food,
    required this.direction,
    this.isPlaying = false,
    this.isGameOver = false,
    this.score = 0,
    this.highScore = 0,
  });

  factory SnakeState.initial() {
    return const SnakeState(
      snake: [Point(10, 10), Point(10, 11), Point(10, 12)], // Head at index 0
      food: Point(5, 5),
      direction: Direction.up,
    );
  }

  SnakeState copyWith({
    List<Point>? snake,
    Point? food,
    Direction? direction,
    bool? isPlaying,
    bool? isGameOver,
    int? score,
    int? highScore,
  }) {
    return SnakeState(
      snake: snake ?? this.snake,
      food: food ?? this.food,
      direction: direction ?? this.direction,
      isPlaying: isPlaying ?? this.isPlaying,
      isGameOver: isGameOver ?? this.isGameOver,
      score: score ?? this.score,
      highScore: highScore ?? this.highScore,
    );
  }
}

class SnakeGameNotifier extends Notifier<SnakeState> {
  Timer? _timer;
  final int _rows = 20;
  final int _cols = 20;
  final Random _random = Random();
  Duration _speed = const Duration(milliseconds: 300);

  @override
  SnakeState build() {
    return SnakeState.initial();
  }

  void loadHighScore() {
    final highScore = StorageService.getSecureHighscore('snake_highscore');
    state = state.copyWith(highScore: highScore);
  }

  void startGame() {
    if (state.isPlaying) return;
    state = SnakeState.initial().copyWith(isPlaying: true, highScore: state.highScore);
    _speed = const Duration(milliseconds: 300);
    _startTimer();
    HapticsService.lightImpact(); // Start feedback
  }

  void resetGame() {
    _timer?.cancel();
    state = SnakeState.initial().copyWith(highScore: state.highScore);
  }

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(_speed, (_) => _gameLoop());
  }

  void changeDirection(Direction newDirection) {
    // Prevent 180-degree turns
    if (state.direction == Direction.up && newDirection == Direction.down) return;
    if (state.direction == Direction.down && newDirection == Direction.up) return;
    if (state.direction == Direction.left && newDirection == Direction.right) return;
    if (state.direction == Direction.right && newDirection == Direction.left) return;

    state = state.copyWith(direction: newDirection);
    HapticsService.selectionClick(); // Feedback for input
  }

  void _gameLoop() {
    if (!state.isPlaying || state.isGameOver) return;

    final head = state.snake.first;
    Point newHead;

    switch (state.direction) {
      case Direction.up:
        newHead = Point(head.x, head.y - 1);
        break;
      case Direction.down:
        newHead = Point(head.x, head.y + 1);
        break;
      case Direction.left:
        newHead = Point(head.x - 1, head.y);
        break;
      case Direction.right:
        newHead = Point(head.x + 1, head.y);
        break;
    }

    // Check Wall Collision
    if (newHead.x < 0 || newHead.x >= _cols || newHead.y < 0 || newHead.y >= _rows) {
      _gameOver();
      return;
    }

    // Check Self Collision
    if (state.snake.contains(newHead)) {
      _gameOver();
      return;
    }

    final newSnake = List<Point>.from(state.snake)..insert(0, newHead);

    // Check Food Collision
    if (newHead == state.food) {
      // Eat Food
      final newScore = state.score + 10;
      final newFood = _generateFood(newSnake);
      _increaseSpeed();
      
      HapticsService.mediumImpact(); // Eat feedback
      
      state = state.copyWith(
        snake: newSnake,
        food: newFood,
        score: newScore,
      );
      
      if (newScore > state.highScore) {
        state = state.copyWith(highScore: newScore);
        StorageService.setSecureHighscore('snake_highscore', newScore);
      }
    } else {
      // Move (remove tail)
      newSnake.removeLast();
      state = state.copyWith(snake: newSnake);
    }
  }

  void _gameOver() {
    _timer?.cancel();
    state = state.copyWith(isPlaying: false, isGameOver: true);
    HapticsService.heavyImpact(); // Collision feedback
  }

  Point _generateFood(List<Point> snake) {
    Point food;
    do {
      food = Point(_random.nextInt(_cols), _random.nextInt(_rows));
    } while (snake.contains(food));
    return food;
  }

  void _increaseSpeed() {
    // Check if speed should increase (cap at 50ms)
    if (_speed.inMilliseconds > 100) {
      _speed = Duration(milliseconds: _speed.inMilliseconds - 10);
      _startTimer(); // Restart timer with new speed
    }
  }
  
  @override
  void dispose() { // Typically done in provider onDispose, but good for clarity
    _timer?.cancel();
    // super.dispose(); // Not needed for Notifier
  }
}

final snakeGameProvider = NotifierProvider<SnakeGameNotifier, SnakeState>(SnakeGameNotifier.new);

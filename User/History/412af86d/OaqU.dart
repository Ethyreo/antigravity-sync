import 'dart:math';
import 'package:flutter/foundation.dart';

enum Difficulty { easy, medium, hard }

class MinesweeperConfig {
  final int width;
  final int height;
  final int totalBombs;

  const MinesweeperConfig(this.width, this.height, this.totalBombs);
}

const Map<Difficulty, MinesweeperConfig> gameConfigs = {
  Difficulty.easy: MinesweeperConfig(9, 9, 10),
  Difficulty.medium: MinesweeperConfig(16, 16, 40),
  Difficulty.hard: MinesweeperConfig(30, 16, 99),
};

class FieldState {
  bool clicked;
  bool isBomb;
  bool isFlag;
  int? boomCount;

  FieldState({
    this.clicked = false,
    this.isBomb = false,
    this.isFlag = false,
    this.boomCount,
  });
}

enum GameStatus { playing, won, lost }

class MinesweeperEngine extends ChangeNotifier {
  Difficulty currentDifficulty = Difficulty.easy;
  late MinesweeperConfig config;

  List<FieldState> fields = [];
  int currentBombs = 0;
  bool firstClick = true;
  GameStatus status = GameStatus.playing;
  final Random _random = Random();

  MinesweeperEngine([Difficulty diff = Difficulty.easy]) {
    startGame(diff);
  }

  void startGame(Difficulty diff) {
    currentDifficulty = diff;
    config = gameConfigs[diff]!;
    currentBombs = config.totalBombs;
    status = GameStatus.playing;
    firstClick = true;
    fields = List.generate(config.width * config.height, (_) => FieldState());
    notifyListeners();
  }

  void initBomb(int safeIndex) {
    int remaining = config.totalBombs;
    while (remaining > 0) {
      int rn = _random.nextInt(config.width * config.height);
      if (rn != safeIndex && !fields[rn].isBomb) {
        fields[rn].isBomb = true;
        remaining--;
      }
    }
  }

  int? findBomb(int i) {
    int count = 0;
    final w = config.width;
    final h = config.height;
    final total = w * h;

    // Checks
    // Left
    if (i % w != 0 && i - 1 >= 0 && fields[i - 1].isBomb) count++;
    // Right
    if (i % w != w - 1 && i + 1 < total && fields[i + 1].isBomb) count++;
    // Up
    if (i - w >= 0 && fields[i - w].isBomb) count++;
    // Up Left
    if (i % w != 0 && i - w - 1 >= 0 && fields[i - w - 1].isBomb) count++;
    // Up Right
    if (i % w != w - 1 && i - w + 1 >= 0 && fields[i - w + 1].isBomb) count++;
    // Down
    if (i + w < total && fields[i + w].isBomb) count++;
    // Down Left
    if (i % w != 0 && i + w - 1 < total && fields[i + w - 1].isBomb) count++;
    // Down Right
    if (i % w != w - 1 && i + w + 1 < total && fields[i + w + 1].isBomb) count++;

    return count == 0 ? null : count;
  }

  void toggleFlag(int i) {
    if (status != GameStatus.playing || fields[i].clicked) return;

    fields[i].isFlag = !fields[i].isFlag;
    currentBombs += fields[i].isFlag ? -1 : 1;
    _checkWin(); // Flags can technically win if strict flag check is enabled, but we check click count in this game to match original
    notifyListeners();
  }

  void onClick(int i) {
    if (status != GameStatus.playing) return;
    if (fields[i].isFlag) return;

    if (fields[i].clicked) {
      // If clicking a revealed number, fast-open neighbors if flags match the number
      _openAll(i);
      notifyListeners();
      return;
    }

    _onClickInternal(i);
    notifyListeners();
  }

  void _onClickInternal(int i) {
    if (fields[i].isFlag || fields[i].clicked || status != GameStatus.playing) return;

    if (firstClick) {
      initBomb(i);
      firstClick = false;
    }

    fields[i].clicked = true;

    if (fields[i].isBomb) {
      status = GameStatus.lost;
      _revealAllMines();
      return;
    }

    int? count = findBomb(i);
    fields[i].boomCount = count;

    if (count == null) {
      _floodFillEmpty(i);
    }

    _checkWin();
  }

  void _floodFillEmpty(int i) {
    final w = config.width;
    final total = w * config.height;
    List<int> neighbors = [];

    if (i % w != 0 && i - 1 >= 0) neighbors.add(i - 1);
    if (i % w != w - 1 && i + 1 < total) neighbors.add(i + 1);
    if (i - w >= 0) neighbors.add(i - w);
    if (i % w != 0 && i - w - 1 >= 0) neighbors.add(i - w - 1);
    if (i % w != w - 1 && i - w + 1 >= 0) neighbors.add(i - w + 1);
    if (i + w < total) neighbors.add(i + w);
    if (i % w != 0 && i + w - 1 < total) neighbors.add(i + w - 1);
    if (i % w != w - 1 && i + w + 1 < total) neighbors.add(i + w + 1);

    for (var n in neighbors) {
      if (!fields[n].clicked && !fields[n].isFlag) {
        _onClickInternal(n);
      }
    }
  }

  void _openAll(int i) {
    if (fields[i].boomCount == null) return;

    int flagCount = 0;
    final w = config.width;
    final total = w * config.height;
    List<int> neighbors = [];

    if (i % w != 0 && i - 1 >= 0) {
      if (fields[i - 1].isFlag) flagCount++;
      neighbors.add(i - 1);
    }
    if (i % w != w - 1 && i + 1 < total) {
      if (fields[i + 1].isFlag) flagCount++;
      neighbors.add(i + 1);
    }
    if (i - w >= 0) {
      if (fields[i - w].isFlag) flagCount++;
      neighbors.add(i - w);
    }
    if (i % w != 0 && i - w - 1 >= 0) {
      if (fields[i - w - 1].isFlag) flagCount++;
      neighbors.add(i - w - 1);
    }
    if (i % w != w - 1 && i - w + 1 >= 0) {
      if (fields[i - w + 1].isFlag) flagCount++;
      neighbors.add(i - w + 1);
    }
    if (i + w < total) {
      if (fields[i + w].isFlag) flagCount++;
      neighbors.add(i + w);
    }
    if (i % w != 0 && i + w - 1 < total) {
      if (fields[i + w - 1].isFlag) flagCount++;
      neighbors.add(i + w - 1);
    }
    if (i % w != w - 1 && i + w + 1 < total) {
      if (fields[i + w + 1].isFlag) flagCount++;
      neighbors.add(i + w + 1);
    }

    if (flagCount == fields[i].boomCount) {
      for (var n in neighbors) {
        if (!fields[n].isFlag && !fields[n].clicked) {
          _onClickInternal(n);
        }
      }
    }
  }

  void _revealAllMines() {
    for (var f in fields) {
      if (f.isBomb) f.clicked = true;
    }
  }

  void _checkWin() {
    int revealed = fields.where((f) => f.clicked).length;
    int target = (config.width * config.height) - config.totalBombs;
    if (revealed == target) {
      status = GameStatus.won;
    }
  }
}

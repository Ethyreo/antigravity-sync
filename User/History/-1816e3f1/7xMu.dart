import 'package:flutter/material.dart';

enum GameDifficulty { easy, medium, hard }

class Game {
  final String id;
  final String title;
  final String description;
  final IconData icon;
  final String route;
  final GameDifficulty difficulty;
  final bool isLongForm;
  final Color primaryColor;

  const Game({
    required this.id,
    required this.title,
    required this.description,
    required this.icon,
    required this.route,
    required this.difficulty,
    this.isLongForm = false,
    required this.primaryColor,
  });
}

import 'package:flutter/material.dart';
import 'package:bored_games/features/home/domain/game_model.dart';
import 'package:bored_games/app/theme.dart';

class GameRegistry {
  static const List<Game> games = [
    Game(
      id: 'tic_tac_toe',
      title: 'Tic Tac Toe',
      description: 'The classic game of X and O.',
      icon: Icons.close, // Placeholder until we have assets
      route: '/games/tic_tac_toe',
      difficulty: GameDifficulty.easy,
      primaryColor: CyberColors.electricCyan,
    ),
    Game(
      id: 'snake',
      title: 'Neon Snake',
      description: 'Eat glitch pixels and grow!',
      icon: Icons.timeline, // Placeholder
      route: '/games/snake',
      difficulty: GameDifficulty.medium,
      primaryColor: CyberColors.hazardMagenta,
    ),
    // Future games will be added here
  ];

  static Game? getGameById(String id) {
    try {
      return games.firstWhere((game) => game.id == id);
    } catch (e) {
      return null;
    }
  }
}

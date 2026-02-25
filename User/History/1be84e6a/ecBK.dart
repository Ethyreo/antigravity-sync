import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:bored_games/features/home/presentation/screens/home_screen.dart';
import 'package:bored_games/features/games/tic_tac_toe/game.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/games/tic_tac_toe',
      builder: (context, state) => const TicTacToeGame(),
    ),
    // Game routes will be added here dynamically or statically
  ],
);

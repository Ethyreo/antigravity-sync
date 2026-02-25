import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:bored_games/features/home/presentation/screens/home_screen.dart';
import 'package:bored_games/features/games/tic_tac_toe/game.dart';
import 'package:bored_games/features/games/snake/game.dart';
import 'package:bored_games/core/widgets/cyber_page_route.dart';

import 'package:bored_games/features/splash/presentation/screens/loading_screen.dart';

final router = GoRouter(
  initialLocation: '/home',
  routes: [
    GoRoute(
      path: '/home',
      pageBuilder: (context, state) => CustomTransitionPage(
        key: state.pageKey,
        transitionDuration: const Duration(milliseconds: 600),
        child: const HomeScreen(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
      ),
    ),
    GoRoute(
      path: '/games/tic_tac_toe',
      pageBuilder: (context, state) => CustomTransitionPage(
        key: state.pageKey,
        transitionDuration: const Duration(milliseconds: 1200),
        reverseTransitionDuration: const Duration(milliseconds: 300),
        child: const TicTacToeGame(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return CyberLaunchTransition(
            animation: animation,
            child: child,
          );
        },
      ),
    ),
    GoRoute(
      path: '/games/snake',
      pageBuilder: (context, state) => CustomTransitionPage(
        key: state.pageKey,
        transitionDuration: const Duration(milliseconds: 1200),
        reverseTransitionDuration: const Duration(milliseconds: 300),
        child: const SnakeGame(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return CyberLaunchTransition(
            animation: animation,
            child: child,
          );
        },
      ),
    ),
    // Game routes will be added here dynamically or statically
  ],
);

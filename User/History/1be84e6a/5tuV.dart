import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:bored_games/features/home/presentation/screens/home_screen.dart';
import 'package:bored_games/features/games/tic_tac_toe/game.dart';
import 'package:bored_games/core/widgets/cyber_page_route.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/games/tic_tac_toe',
      pageBuilder: (context, state) => CustomTransitionPage(
        key: state.pageKey,
        child: const TicTacToeGame(),
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

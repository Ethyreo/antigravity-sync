import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:bored_games/app/theme.dart';
import 'package:bored_games/features/home/domain/game_model.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:bored_games/core/services/haptics_service.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:bored_games/core/state/animation_state.dart';

class GameCard extends ConsumerStatefulWidget {
  final Game game;

  const GameCard({super.key, required this.game});

  @override
  ConsumerState<GameCard> createState() => _GameCardState();
}

class _GameCardState extends ConsumerState<GameCard> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  bool _isActive = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 100));
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
        CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _handleTap(TapUpDetails details) {
    // Save the global tap position for the transition
    ref.read(launchFocalPointProvider.notifier).state = details.globalPosition;

    HapticsService.selectionClick();
    setState(() => _isActive = true);
    _controller.forward();
    
    // Delay for visual "activation" before navigation
    Future.delayed(const Duration(milliseconds: 150), () {
      if (mounted) {
        _controller.reverse();
        context.go(widget.game.route);
        // Reset state after navigation
        Future.delayed(const Duration(milliseconds: 300), () {
          if (mounted) setState(() => _isActive = false);
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final borderColor = _isActive 
        ? CyberColors.hazardMagenta 
        : (_isHovered ? CyberColors.electricCyan : CyberColors.dimGrid);

    return GestureDetector(
      onTapDown: (_) => setState(() => _isActive = true),
      onTapUp: (details) => _handleTap(details),
      onTapCancel: () {
         _controller.reverse();
         setState(() => _isActive = false);
      },
      child: MouseRegion(
        onEnter: (_) => setState(() => _isHovered = true),
        onExit: (_) => setState(() => _isHovered = false),
        child: ScaleTransition(
          scale: _scaleAnimation,
          child: Container(
            decoration: BoxDecoration(
              color: CyberColors.voidBlack,
              border: Border.all(
                color: borderColor,
                width: 2,
              ),
              boxShadow: _isActive || _isHovered
                  ? [
                      BoxShadow(
                        color: borderColor.withOpacity(0.4),
                        blurRadius: _isActive ? 20 : 10, // More glow when active
                        spreadRadius: _isActive ? 4 : 2,
                      )
                    ]
                  : [],
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  widget.game.icon,
                  size: 48,
                  color: _isHovered ? CyberColors.electricCyan : CyberColors.ghostWhite,
                ),
                const SizedBox(height: 16),
                Text(
                  widget.game.title.toUpperCase(),
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: _isHovered ? CyberColors.electricCyan : CyberColors.ghostWhite,
                        fontSize: 12,
                      ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _isHovered ? CyberColors.electricCyan.withOpacity(0.2) : Colors.transparent,
                    border: Border.all(
                        color: _isHovered ? CyberColors.electricCyan : Colors.transparent),
                  ),
                  child: Text(
                    widget.game.difficulty.name.toUpperCase(),
                    style: TextStyle(
                      fontSize: 8,
                      color: _isHovered ? CyberColors.electricCyan : Colors.white24,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

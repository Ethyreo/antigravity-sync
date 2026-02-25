import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:bored_games/app/theme.dart';
import 'package:bored_games/features/home/domain/game_model.dart';
import 'package:google_fonts/google_fonts.dart';

class GameCard extends StatefulWidget {
  final Game game;

  const GameCard({super.key, required this.game});

  @override
  State<GameCard> createState() => _GameCardState();
}

class _GameCardState extends State<GameCard> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  bool _isHovered = false;

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

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _controller.forward(),
      onTapUp: (_) => _controller.reverse().then((_) => context.go(widget.game.route)),
      onTapCancel: () => _controller.reverse(),
      child: MouseRegion(
        onEnter: (_) => setState(() => _isHovered = true),
        onExit: (_) => setState(() => _isHovered = false),
        child: ScaleTransition(
          scale: _scaleAnimation,
          child: Container(
            decoration: BoxDecoration(
              color: CyberColors.voidBlack,
              border: Border.all(
                color: _isHovered ? CyberColors.electricCyan : CyberColors.dimGrid,
                width: 2,
              ),
              boxShadow: _isHovered
                  ? [
                      BoxShadow(
                        color: CyberColors.electricCyan.withOpacity(0.4),
                        blurRadius: 10,
                        spreadRadius: 2,
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

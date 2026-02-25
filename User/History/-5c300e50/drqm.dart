import 'package:flutter/material.dart';
import 'package:bored_games/app/theme.dart';

class CyberButton extends StatefulWidget {
  final String text;
  final VoidCallback onPressed;
  final Color? color;
  final double width;
  final double height;

  const CyberButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.color,
    this.width = 200,
    this.height = 50,
  });

  @override
  State<CyberButton> createState() => _CyberButtonState();
}

class _CyberButtonState extends State<CyberButton> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

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

  void _onTapDown(TapDownDetails details) {
    _controller.forward();
  }

  void _onTapUp(TapUpDetails details) {
    _controller.reverse().then((_) {
      widget.onPressed();
    });
  }

  void _onTapCancel() {
    _controller.reverse();
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = widget.color ?? CyberColors.electricCyan;

    return GestureDetector(
      onTapDown: _onTapDown,
      onTapUp: _onTapUp,
      onTapCancel: _onTapCancel,
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            color: CyberColors.voidBlack,
            border: Border.all(
              color: primaryColor,
              width: 2,
            ),
            boxShadow: [
              BoxShadow(
                color: primaryColor.withOpacity(0.4),
                blurRadius: 4,
                offset: const Offset(0, 2),
              )
            ],
          ),
          child: Center(
            child: Text(
              widget.text.toUpperCase(),
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: primaryColor,
                    fontWeight: FontWeight.bold,
                  ),
            ),
          ),
        ),
      ),
    );
  }
}

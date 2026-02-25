import 'package:flutter/material.dart';

/// Slide-to-Accept widget for the Creator inbox.
class SlideToAccept extends StatefulWidget {
  final VoidCallback onAccept;
  final String label;

  const SlideToAccept({
    super.key,
    required this.onAccept,
    this.label = 'Slide to Accept',
  });

  @override
  State<SlideToAccept> createState() => _SlideToAcceptState();
}

class _SlideToAcceptState extends State<SlideToAccept>
    with SingleTickerProviderStateMixin {
  double _dragPosition = 0;
  bool _accepted = false;
  late AnimationController _shimmerController;

  @override
  void initState() {
    super.initState();
    _shimmerController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();
  }

  @override
  void dispose() {
    _shimmerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final maxDrag = constraints.maxWidth - 64;
        final progress = (maxDrag > 0) ? (_dragPosition / maxDrag).clamp(0.0, 1.0) : 0.0;

        return Container(
          height: 56,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(28),
            color: _accepted
                ? Colors.green
                : Color.lerp(
                    Colors.grey.shade800,
                    Colors.green.shade700,
                    progress,
                  ),
          ),
          child: Stack(
            children: [
              // Label
              Center(
                child: AnimatedBuilder(
                  animation: _shimmerController,
                  builder: (context, child) {
                    return AnimatedOpacity(
                      opacity: _accepted ? 0 : (1 - progress * 2).clamp(0.3, 1.0),
                      duration: const Duration(milliseconds: 150),
                      child: Text(
                        _accepted ? 'Accepted! ✓' : widget.label,
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.8),
                          fontWeight: FontWeight.w600,
                          fontSize: 15,
                        ),
                      ),
                    );
                  },
                ),
              ),

              // Draggable thumb
              AnimatedPositioned(
                duration: _dragPosition == 0
                    ? const Duration(milliseconds: 300)
                    : Duration.zero,
                curve: Curves.easeOut,
                left: _dragPosition,
                top: 4,
                child: GestureDetector(
                  onHorizontalDragUpdate: (details) {
                    if (_accepted) return;
                    setState(() {
                      _dragPosition =
                          (_dragPosition + details.delta.dx).clamp(0.0, maxDrag);
                    });
                  },
                  onHorizontalDragEnd: (details) {
                    if (_accepted) return;
                    if (_dragPosition > maxDrag * 0.75) {
                      setState(() {
                        _dragPosition = maxDrag;
                        _accepted = true;
                      });
                      widget.onAccept();
                    } else {
                      setState(() => _dragPosition = 0);
                    }
                  },
                  child: Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _accepted ? Colors.white : Colors.white,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.2),
                          blurRadius: 8,
                        ),
                      ],
                    ),
                    child: Icon(
                      _accepted ? Icons.check : Icons.arrow_forward_ios,
                      color: _accepted ? Colors.green : Colors.grey.shade700,
                      size: 20,
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

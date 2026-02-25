import 'package:flutter/material.dart';
import 'package:bored_games/app/theme.dart';
import 'logic.dart';

class CyberCell extends StatelessWidget {
  final FieldState state;
  final VoidCallback onTap;
  final VoidCallback onLongPress;

  const CyberCell({
    super.key,
    required this.state,
    required this.onTap,
    required this.onLongPress,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      onLongPress: onLongPress,
      onSecondaryTap: onLongPress, // Right click for flags
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        margin: const EdgeInsets.all(1),
        decoration: BoxDecoration(
          color: _getFillColor(),
          border: Border.all(
            color: _getBorderColor(),
            width: state.clicked ? 0.5 : 1.5,
          ),
          borderRadius: BorderRadius.circular(2),
          boxShadow: state.clicked
              ? []
              : [
                  BoxShadow(
                    color: CyberColors.electricCyan.withOpacity(0.3),
                    blurRadius: 4,
                  )
                ],
        ),
        child: Center(
          child: _buildContent(),
        ),
      ),
    );
  }

  Color _getFillColor() {
    if (!state.clicked) {
      return CyberColors.deepSpace.withOpacity(0.8);
    }
    if (state.isBomb) {
      return CyberColors.hazardMagenta.withOpacity(0.3);
    }
    return Colors.transparent;
  }

  Color _getBorderColor() {
    if (!state.clicked) {
      return CyberColors.electricCyan;
    }
    if (state.isBomb) {
      return CyberColors.hazardMagenta;
    }
    return CyberColors.dimGrid;
  }

  Widget? _buildContent() {
    if (state.isFlag) {
      return const Icon(Icons.flag, color: CyberColors.toxicGreen, size: 16);
    }

    if (!state.clicked) {
      return null;
    }

    if (state.isBomb) {
      return const Icon(Icons.emergency, color: CyberColors.hazardMagenta, size: 18);
    }

    if (state.boomCount != null && state.boomCount! > 0) {
      return Text(
        '${state.boomCount}',
        style: TextStyle(
          fontFamily: 'Press Start 2P',
          fontSize: 10,
          color: _getNumberColor(state.boomCount!),
          shadows: [
            Shadow(
              color: _getNumberColor(state.boomCount!).withOpacity(0.5),
              blurRadius: 4,
            )
          ],
        ),
      );
    }

    return null;
  }

  Color _getNumberColor(int count) {
    switch (count) {
      case 1:
        return CyberColors.electricCyan;
      case 2:
        return CyberColors.toxicGreen;
      case 3:
        return CyberColors.cyberYellow;
      case 4:
        return CyberColors.solarOrange;
      default:
        return CyberColors.hazardMagenta;
    }
  }
}

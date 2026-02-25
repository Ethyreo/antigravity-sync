import 'package:flutter/material.dart';

class ScanlineOverlay extends StatelessWidget {
  const ScanlineOverlay({super.key});

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.transparent,
              Colors.black12,
            ],
            stops: [0.5, 0.5],
            tileMode: TileMode.repeated,
          ),
        ),
        foregroundDecoration: BoxDecoration(
          backgroundBlendMode: BlendMode.overlay,
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Colors.transparent, 
              Colors.black.withOpacity(0.1) // Subtle dimming for scanlines
            ],
            stops: const [0.0, 1.0],
          ),
        ),
      ),
    );
  }
}

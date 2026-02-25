import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:bored_games/app/theme.dart';
import 'package:bored_games/core/services/haptics_service.dart';
import 'package:bored_games/core/widgets/scanline_overlay.dart';

class LoadingScreen extends StatefulWidget {
  const LoadingScreen({super.key});

  @override
  State<LoadingScreen> createState() => _LoadingScreenState();
}

class _LoadingScreenState extends State<LoadingScreen> with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late AnimationController _progressController;
  late AnimationController _glitchController; // For the text jitter

  bool _showLogo = false;
  bool _showProgress = false;
  
  @override
  void initState() {
    super.initState();

    // 1. Black Screen (Init)
    _fadeController = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 1000));
    
    _progressController = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 2000));

    _glitchController = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 100)); // Rapid updates

    _startSequence();
  }

  void _startSequence() async {
    // Phase 1: Hold Black (500ms)
    await Future.delayed(const Duration(milliseconds: 500));
    if (!mounted) return;

    // Phase 2: Fade In Logo & Start Glitch (1000ms)
    setState(() => _showLogo = true);
    _fadeController.forward();
    _glitchController.repeat(reverse: true); // Start jittering immediately? Or wait?
    // Let's subtle jitter always, harsh jitter later.

    await Future.delayed(const Duration(milliseconds: 500));
    if (!mounted) return;

    // Phase 3: Progress Bar (2000ms)
    setState(() => _showProgress = true);
    _progressController.forward();

    // Wait for progress + extra beat
    await Future.delayed(const Duration(milliseconds: 2500));
    if (!mounted) return;

    // Phase 4: Gentle Glitch Exit
    // Trigger Haptic
    HapticsService.heavyImpact();
    // Navigate home with a custom fade
    context.go('/home');
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _progressController.dispose();
    _glitchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: CyberColors.voidBlack,
      body: Stack(
        children: [
          // Scanlines are always on top, except maybe splash text? No, overlay is good.
          const ScanlineOverlay(),
          
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (_showLogo)
                  FadeTransition(
                    opacity: _fadeController,
                    child: AnimatedBuilder(
                      animation: _glitchController,
                      builder: (context, child) {
                        return GlitchText(
                          text: "BORED GAMES",
                          intensity: _progressController.value, // Glitch increases as it loads?
                        );
                      },
                    ),
                  ),
                
                const SizedBox(height: 48),

                if (_showProgress)
                  AnimatedBuilder(
                    animation: _progressController,
                    builder: (context, child) {
                      return CyberProgressBar(progress: _progressController.value);
                    },
                  ),
                  
                if (_showProgress)
                   Padding(
                     padding: const EdgeInsets.only(top: 8.0),
                     child: Text(
                        "LOADING SYSTEM...",
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          fontSize: 10,
                          color: CyberColors.dimGrid,
                        ),
                     ),
                   ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class GlitchText extends StatelessWidget {
  final String text;
  final double intensity; // 0.0 to 1.0

  const GlitchText({
    super.key,
    required this.text,
    required this.intensity,
  });

  @override
  Widget build(BuildContext context) {
    final random = Random();
    // Base Jitter amount
    double offsetMax = 2.0 + (intensity * 4.0); // 2px to 6px
    
    // Random offsets for RGB split
    double rX = (random.nextDouble() - 0.5) * offsetMax;
    double rY = (random.nextDouble() - 0.5) * offsetMax;
    
    double bX = (random.nextDouble() - 0.5) * offsetMax;
    double bY = (random.nextDouble() - 0.5) * offsetMax;

    TextStyle baseStyle = Theme.of(context).textTheme.headlineLarge!.copyWith(
      color: CyberColors.ghostWhite,
      fontSize: 40,
    );

    return Stack(
      children: [
        // Red Channel
        Transform.translate(
          offset: Offset(rX, rY),
          child: Text(
            text,
            style: baseStyle.copyWith(color: Colors.red.withOpacity(0.8)),
          ),
        ),
        // Blue Channel
        Transform.translate(
          offset: Offset(bX, bY),
          child: Text(
            text,
            style: baseStyle.copyWith(color: Colors.blue.withOpacity(0.8)),
          ),
        ),
        // Main White Text
        Text(
          text,
          style: baseStyle,
        ),
      ],
    );
  }
}

class CyberProgressBar extends StatelessWidget {
  final double progress;

  const CyberProgressBar({super.key, required this.progress});

  @override
  Widget build(BuildContext context) {
    // 8-bit style progress bar: Segments strictly? Or fluid inside a box?
    // Let's do fluid inside a rect border for simplicity but strict sharp corners.
    return Container(
      width: 200,
      height: 20,
      decoration: BoxDecoration(
        border: Border.all(color: CyberColors.electricCyan, width: 2),
      ),
      alignment: Alignment.centerLeft,
      child: FractionallySizedBox(
        widthFactor: progress,
        child: Container(
          color: CyberColors.hazardMagenta,
        ),
      ),
    );
  }
}

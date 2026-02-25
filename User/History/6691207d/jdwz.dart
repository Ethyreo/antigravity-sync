import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:go_router/go_router.dart';
import 'package:bored_games/app/theme.dart';
import 'logic.dart';
import 'renderer.dart';

class RetroHedgehogGame extends StatefulWidget {
  const RetroHedgehogGame({super.key});
  @override
  State<RetroHedgehogGame> createState() => _RetroHedgehogGameState();
}

class _RetroHedgehogGameState extends State<RetroHedgehogGame>
    with TickerProviderStateMixin {
  late HedgehogEngine _engine;
  Ticker? _ticker;
  Duration _last = Duration.zero;

  // Orientation intro animation
  late AnimationController _introCtrl;
  late Animation<double> _introRotation;
  late Animation<double> _introFade;
  bool _introComplete = false;

  @override
  void initState() {
    super.initState();
    _engine = HedgehogEngine();

    // Intro animation: portrait → landscape rotation
    _introCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );
    _introRotation = Tween<double>(begin: pi / 2, end: 0).animate(
      CurvedAnimation(parent: _introCtrl, curve: Curves.easeOutCubic),
    );
    _introFade = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: _introCtrl,
        curve: const Interval(0.3, 1.0, curve: Curves.easeIn),
      ),
    );
    _introCtrl.forward().then((_) {
      setState(() => _introComplete = true);
    });
  }

  void _startTicker() {
    _last = Duration.zero;
    _ticker = createTicker(_onTick);
    _ticker!.start();
  }

  void _onTick(Duration elapsed) {
    final dt = (_last == Duration.zero)
        ? 0.016
        : (elapsed - _last).inMicroseconds / 1e6;
    _last = elapsed;
    _engine.update(dt);
    if (mounted) setState(() {});
  }

  void _startGame() {
    _engine.start();
    _ticker?.stop();
    _ticker?.dispose();
    _startTicker();
  }

  void _goBack() {
    _ticker?.stop();
    if (context.canPop()) {
      context.pop();
    } else {
      context.go('/home');
    }
  }

  @override
  void dispose() {
    _ticker?.stop();
    _ticker?.dispose();
    _introCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: AnimatedBuilder(
        animation: _introCtrl,
        builder: (context, child) {
          return Opacity(
            opacity: _introFade.value,
            child: Transform.rotate(
              angle: _introRotation.value,
              child: child,
            ),
          );
        },
        child: LayoutBuilder(
          builder: (context, box) {
            // Determine if we need to rotate for landscape
            final isPortrait = box.maxHeight > box.maxWidth;
            final gameW = isPortrait ? box.maxHeight : box.maxWidth;
            final gameH = isPortrait ? box.maxWidth : box.maxHeight;

            Widget gameContent = SizedBox(
              width: gameW,
              height: gameH,
              child: Stack(
                children: [
                  // Game Canvas
                  Positioned.fill(
                    child: CustomPaint(
                      painter: HedgehogPainter(_engine.state),
                    ),
                  ),
                  // HUD Overlay
                  _buildHUD(gameW, gameH),
                  // Touch Controls
                  if (_engine.state.playing) _buildControls(gameW, gameH),
                  // Overlays (start / game over / victory)
                  if (!_engine.state.playing) _buildOverlay(gameW, gameH),
                  // Back Button
                  Positioned(
                    top: 8,
                    left: 8,
                    child: GestureDetector(
                      onTap: _goBack,
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.black38,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Icon(Icons.arrow_back_ios_new,
                            color: CyberColors.electricCyan, size: 18),
                      ),
                    ),
                  ),
                ],
              ),
            );

            if (isPortrait) {
              gameContent = Center(
                child: RotatedBox(
                  quarterTurns: 1,
                  child: gameContent,
                ),
              );
            }
            return gameContent;
          },
        ),
      ),
    );
  }

  // ─── HUD ───
  Widget _buildHUD(double w, double h) {
    final s = _engine.state;
    return Positioned(
      top: 6,
      left: 50,
      right: 10,
      child: DefaultTextStyle(
        style: const TextStyle(
          fontFamily: 'Press Start 2P',
          fontSize: 9,
          color: CyberColors.ghostWhite,
          shadows: [Shadow(color: Colors.black, blurRadius: 4)],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            // Rings
            Row(
              children: [
                Container(
                  width: 10, height: 10,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                        color: CyberColors.electricCyan, width: 1.5),
                  ),
                ),
                const SizedBox(width: 4),
                Text('${s.rings}',
                    style: const TextStyle(color: CyberColors.electricCyan)),
              ],
            ),
            // Score
            Text('SCORE ${s.score}'),
            // Lives
            Row(
              children: [
                const Icon(Icons.favorite, color: CyberColors.hazardMagenta,
                    size: 12),
                const SizedBox(width: 3),
                Text('${s.lives}'),
              ],
            ),
            // Time
            Text(_formatTime(s.gameTime)),
          ],
        ),
      ),
    );
  }

  String _formatTime(double t) {
    final m = (t ~/ 60).toString().padLeft(2, '0');
    final sec = (t.toInt() % 60).toString().padLeft(2, '0');
    return '$m:$sec';
  }

  // ─── Touch Controls ───
  Widget _buildControls(double w, double h) {
    return Stack(
      children: [
        // Left / Right arrows
        Positioned(
          bottom: 16,
          left: 16,
          child: Row(
            children: [
              _ctrlBtn(Icons.arrow_left, () => _engine.state.inLeft = true,
                  () => _engine.state.inLeft = false),
              const SizedBox(width: 10),
              _ctrlBtn(Icons.arrow_right, () => _engine.state.inRight = true,
                  () => _engine.state.inRight = false),
            ],
          ),
        ),
        // Jump button
        Positioned(
          bottom: 18,
          right: 20,
          child: Listener(
            onPointerDown: (_) => _engine.state.inJump = true,
            child: Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: CyberColors.electricCyan.withOpacity(0.18),
                border: Border.all(
                    color: CyberColors.electricCyan.withOpacity(0.5),
                    width: 2),
              ),
              child: const Center(
                child: Icon(Icons.arrow_upward, color: CyberColors.electricCyan,
                    size: 28),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _ctrlBtn(IconData icon, VoidCallback onDown, VoidCallback onUp) {
    return Listener(
      onPointerDown: (_) => onDown(),
      onPointerUp: (_) => onUp(),
      onPointerCancel: (_) => onUp(),
      child: Container(
        width: 52,
        height: 52,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          color: CyberColors.electricCyan.withOpacity(0.12),
          border: Border.all(
              color: CyberColors.electricCyan.withOpacity(0.4), width: 1.5),
        ),
        child: Icon(icon, color: CyberColors.electricCyan.withOpacity(0.7),
            size: 26),
      ),
    );
  }

  // ─── Overlays ───
  Widget _buildOverlay(double w, double h) {
    final s = _engine.state;
    String title;
    String subtitle;
    Color titleColor;

    if (s.victory) {
      title = 'ZONE CLEAR!';
      subtitle = 'SCORE: ${s.score}';
      titleColor = CyberColors.cyberYellow;
    } else if (s.gameOver) {
      title = 'GAME OVER';
      subtitle = 'SCORE: ${s.score}';
      titleColor = CyberColors.hazardMagenta;
    } else {
      title = 'RETRO HEDGEHOG';
      subtitle = 'TAP START TO PLAY';
      titleColor = CyberColors.electricCyan;
    }

    return Positioned.fill(
      child: Container(
        color: Colors.black54,
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontFamily: 'Press Start 2P',
                  fontSize: 18,
                  color: titleColor,
                  shadows: [
                    Shadow(color: titleColor.withOpacity(0.6), blurRadius: 12),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Text(
                subtitle,
                style: const TextStyle(
                  fontFamily: 'Press Start 2P',
                  fontSize: 10,
                  color: CyberColors.ghostWhite,
                ),
              ),
              const SizedBox(height: 24),
              GestureDetector(
                onTap: _startGame,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 28, vertical: 12),
                  decoration: BoxDecoration(
                    border: Border.all(color: titleColor, width: 2),
                    color: titleColor.withOpacity(0.15),
                  ),
                  child: Text(
                    s.victory || s.gameOver ? 'RETRY' : 'START',
                    style: TextStyle(
                      fontFamily: 'Press Start 2P',
                      fontSize: 12,
                      color: titleColor,
                    ),
                  ),
                ),
              ),
              if (s.victory || s.gameOver) ...[
                const SizedBox(height: 14),
                GestureDetector(
                  onTap: _goBack,
                  child: const Text(
                    'BACK TO MENU',
                    style: TextStyle(
                      fontFamily: 'Press Start 2P',
                      fontSize: 8,
                      color: CyberColors.dimGrid,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

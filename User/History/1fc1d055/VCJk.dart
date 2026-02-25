import 'package:flutter/material.dart';
import 'package:bored_games/app/theme.dart';
import 'package:bored_games/core/widgets/scanline_overlay.dart';
import 'package:bored_games/features/home/domain/game_registry.dart';
import 'package:bored_games/features/home/presentation/widgets/game_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: CyberColors.voidBlack,
      body: Stack(
        children: [
          // Background Grid (Optional aesthetic)
          Positioned.fill(
            child: GridPaper(
              color: CyberColors.dimGrid.withOpacity(0.3),
              interval: 50,
              divisions: 1,
              subdivisions: 1,
            ),
          ),
          
          SafeArea(
            child: Column(
              children: [
                const SizedBox(height: 40),
                // Header
                Text(
                  'BORED GAMES',
                  style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                        color: CyberColors.electricCyan,
                        shadows: [
                          const Shadow(
                            color: CyberColors.electricCyan,
                            blurRadius: 10,
                            offset: Offset(0, 0),
                          ),
                        ],
                      ),
                ),
                Text(
                  'SELECT CARTRIDGE',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: CyberColors.ghostWhite,
                        fontSize: 10,
                        letterSpacing: 2,
                      ),
                ),
                const SizedBox(height: 40),
                
                // Game Grid
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: GridView.builder(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 24,
                        mainAxisSpacing: 24,
                        childAspectRatio: 0.85,
                      ),
                      itemCount: GameRegistry.games.length,
                      itemBuilder: (context, index) {
                        final game = GameRegistry.games[index];
                        return GameCard(game: game);
                      },
                    ),
                  ),
                ),
              ],
            ),
          ),

          // CRT Overlay
          const Positioned.fill(child: ScanlineOverlay()),
        ],
      ),
    );
  }
}

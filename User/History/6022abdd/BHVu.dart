import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:bored_games/core/widgets/scanline_overlay.dart';
import 'package:bored_games/app/theme.dart';
import 'logic.dart';
import 'renderer.dart';

class MinesweeperGame extends StatefulWidget {
  const MinesweeperGame({super.key});

  @override
  State<MinesweeperGame> createState() => _MinesweeperGameState();
}

class _MinesweeperGameState extends State<MinesweeperGame> {
  late MinesweeperEngine _engine;

  @override
  void initState() {
    super.initState();
    _engine = MinesweeperEngine();
    _engine.addListener(_onStateChange);
  }

  @override
  void dispose() {
    _engine.removeListener(_onStateChange);
    _engine.dispose();
    super.dispose();
  }

  void _onStateChange() {
    setState(() {});
  }

  void _goBack() {
    if (context.canPop()) {
      context.pop();
    } else {
      context.go('/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Background layer
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Color(0xFF030014),
                    Color(0xFF0B1021),
                    Color(0xFF0F0B1E),
                  ],
                ),
              ),
            ),
          ),
          // Game content
          SafeArea(
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _buildHeader(),
                  const SizedBox(height: 20),
                  _buildGrid(),
                ],
              ),
            ),
          ),
          
          // Overlays
          if (_engine.status != GameStatus.playing) _buildOverlay(),
          
          const ScanlineOverlay(),
          
          // Back Button
          Positioned(
            top: MediaQuery.of(context).padding.top + 8,
            left: 16,
            child: GestureDetector(
              onTap: _goBack,
              child: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.black54,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: CyberColors.electricCyan, width: 1),
                ),
                child: const Icon(Icons.arrow_back_ios_new, color: CyberColors.electricCyan, size: 20),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Mine Counter
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: CyberColors.voidBlack,
              border: Border.all(color: CyberColors.hazardMagenta, width: 2),
              borderRadius: BorderRadius.circular(4),
              boxShadow: [
                BoxShadow(
                  color: CyberColors.hazardMagenta.withOpacity(0.5),
                  blurRadius: 8,
                )
              ],
            ),
            child: Row(
              children: [
                const Icon(Icons.emergency, color: CyberColors.hazardMagenta, size: 16),
                const SizedBox(width: 8),
                Text(
                  '${_engine.currentBombs.toString().padLeft(3, '0')}',
                  style: const TextStyle(
                    fontFamily: 'Press Start 2P',
                    fontSize: 16,
                    color: CyberColors.hazardMagenta,
                  ),
                ),
              ],
            ),
          ),
          
          // Difficulty Selector
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            decoration: BoxDecoration(
              color: CyberColors.voidBlack,
              border: Border.all(color: CyberColors.electricCyan, width: 1),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<Difficulty>(
                value: _engine.currentDifficulty,
                dropdownColor: CyberColors.voidBlack,
                icon: const Icon(Icons.arrow_drop_down, color: CyberColors.electricCyan),
                items: Difficulty.values.map((d) => DropdownMenuItem(
                  value: d,
                  child: Text(
                    d.name.toUpperCase(),
                    style: const TextStyle(
                      fontFamily: 'Press Start 2P',
                      fontSize: 10,
                      color: CyberColors.electricCyan,
                    ),
                  ),
                )).toList(),
                onChanged: (d) {
                  if (d != null) _engine.startGame(d);
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGrid() {
    return Expanded(
      child: Center(
        child: SingleChildScrollView(
          scrollDirection: Axis.vertical,
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: CyberColors.voidBlack,
                border: Border.all(color: CyberColors.electricCyan, width: 2),
                boxShadow: [
                  BoxShadow(
                    color: CyberColors.electricCyan.withOpacity(0.2),
                    blurRadius: 20,
                  )
                ],
              ),
              child: SizedBox(
                width: _engine.config.width * 30.0,
                height: _engine.config.height * 30.0,
                child: GridView.builder(
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: _engine.config.width,
                    childAspectRatio: 1,
                  ),
                  itemCount: _engine.fields.length,
                  itemBuilder: (context, index) {
                    return CyberCell(
                      state: _engine.fields[index],
                      onTap: () => _engine.onClick(index),
                      onLongPress: () => _engine.toggleFlag(index),
                    );
                  },
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildOverlay() {
    bool win = _engine.status == GameStatus.won;
    Color color = win ? CyberColors.cyberYellow : CyberColors.hazardMagenta;
    String text = win ? 'SYSTEM SECURED' : 'SYSTEM BREACH';

    return Positioned.fill(
      child: Container(
        color: Colors.black.withOpacity(0.8),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                text,
                style: TextStyle(
                  fontFamily: 'Press Start 2P',
                  fontSize: 24,
                  color: color,
                  shadows: [
                    Shadow(
                      color: color.withOpacity(0.6),
                      blurRadius: 16,
                    )
                  ],
                ),
              ),
              const SizedBox(height: 32),
              GestureDetector(
                onTap: () => _engine.startGame(_engine.currentDifficulty),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    border: Border.all(color: color, width: 2),
                  ),
                  child: Text(
                    'REBOOT',
                    style: TextStyle(
                      fontFamily: 'Press Start 2P',
                      fontSize: 16,
                      color: color,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

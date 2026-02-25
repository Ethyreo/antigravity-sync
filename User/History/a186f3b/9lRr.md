# Retro Hedgehog — Platformer Game Integration

## Background

The user wants to integrate a side-scrolling platformer game (inspired by [SonicTheHedgehogProject](https://github.com/JoshOtter/SonicTheHedgehogProject)) into the Bored Games app. That repo is a **Unity C#** project — it cannot be directly embedded in Flutter. Instead, we'll build a **Flutter-native platformer** using `CustomPainter` (same approach as the existing Neon Snake game), keeping the project dependency-free.

> [!IMPORTANT]
> All copyrighted names, sprites, and colors will be replaced. The game will be called **"Retro Hedgehog"** and use original pixel art inspired by, but distinct from, the source material.

## Proposed Changes

### Phase 1: Core Game Engine

#### [NEW] [game.dart](file:///Users/gurman/Coding%20Projects/Bored%20Games/lib/features/games/retro_hedgehog/game.dart)
Main game widget — landscape `CustomPainter` game with:
- Game loop via `Ticker`/`AnimationController`
- Camera system that follows the player
- Collision detection (AABB)
- Portrait→landscape rotation animation on launch (user requirement)
- Touch HUD overlay for controls

#### [NEW] [logic.dart](file:///Users/gurman/Coding%20Projects/Bored%20Games/lib/features/games/retro_hedgehog/logic.dart)
Game state management with Riverpod `Notifier`:
- Player state machine (idle, running, jumping, falling, hurt, spinning)
- Physics (gravity, velocity, acceleration, platform one-way collisions)
- Level data (platforms, ramps, enemies, collectibles, goal)
- Enemy AI (basic patrol patterns: walk back-and-forth, fly sine-wave)
- Collectible items (gems instead of rings to avoid copyright)
- Score, lives, timer — win/loss conditions

#### [NEW] [renderer.dart](file:///Users/gurman/Coding%20Projects/Bored%20Games/lib/features/games/retro_hedgehog/renderer.dart)
`CustomPainter` that draws:
- Scrolling background layers (parallax)
- Tile-based level terrain with pixel art
- Player character with animation frames (drawn with geometric shapes/rects)
- Enemies (simple pixel-art shapes)
- Collectibles (spinning gem animation)
- HUD elements (score, lives, timer)

---

### Phase 2: Touch Controls & Orientation

#### Touch HUD (inside game.dart)
Translucent mobile-style controls:
- **Left side**: D-pad (left/right arrows + down for duck)
- **Right side**: Jump button (large, circular)
- Semi-transparent (~30% opacity) so game is visible underneath
- Position: bottom of screen, within thumb reach

#### Orientation Transition (inside game.dart)  
When game opens:
1. Start in portrait (matching app shell)
2. Subtle rotation animation (0.6s) — content rotates 90° with a fade
3. Game fades in at landscape aspect ratio
4. On exit: reverse animation back to portrait

---

### Phase 3: App Integration

#### [MODIFY] [game_registry.dart](file:///Users/gurman/Coding%20Projects/Bored%20Games/lib/features/home/domain/game_registry.dart)
Add Retro Hedgehog to the games list:
```dart
Game(
  id: 'retro_hedgehog',
  title: 'Retro Hedgehog',
  description: 'Run, jump, and spin through zones!',
  icon: Icons.speed,
  route: '/games/retro_hedgehog',
  difficulty: GameDifficulty.hard,
  primaryColor: CyberColors.cyberYellow,
)
```

#### [MODIFY] [routes.dart](file:///Users/gurman/Coding%20Projects/Bored%20Games/lib/app/routes.dart)
Add route `/games/retro_hedgehog` → `RetroHedgehogGame()` with `CyberLaunchTransition`.

---

## Game Design Details

### Character ("Speedy" the hedgehog)
- Blue/cyan colored pixel sphere with spikes (geometric, not Sonic's design)
- States: idle (bouncing), running (legs animate), jumping (curl into ball), spin attack (rotating circle)
- Physics: gravity, variable-height jump (hold = higher), horizontal acceleration with max speed

### Level Design
- **Green Zone Act 1** — grassy platforms, ramps, loops (simplified)
- ~3000px wide scrolling level
- Platforms at various heights
- Ramps for speed boosts
- End-of-zone goal marker

### Enemies (2 types)
1. **Walker** — patrols left/right on a platform, damages on contact. Destroyed by spin attack from above.
2. **Flyer** — moves in sine wave pattern, damages on contact. Destroyed by jumping on it.

### Collectibles
- **Gems** — scattered throughout level, +10 points each
- Losing gems on damage (scatter animation)
- 100 gems = extra life

### Win/Loss
- **Win**: reach end-of-zone goal marker
- **Lose**: lose all 3 lives (touching enemies without gems or falling off-screen)

### Copyright Avoidance
| Original | Our Version |
|----------|-------------|
| Sonic | Speedy |
| Rings | Gems |
| Green Hill Zone | Emerald Zone |
| Blue character | Cyan/teal palette (matches app theme) |
| Specific enemy designs | Generic geometric enemies |

## Verification Plan

### Automated Tests
- `flutter analyze` — no errors
- Hot reload stability

### Manual Verification (Browser)
1. Game card appears in home screen grid
2. Tapping card → rotation animation → game loads in landscape
3. Touch controls visible and responsive
4. Character runs, jumps, collects gems
5. Enemies damage player (lose gems / life)
6. Win condition (reach goal)
7. Game over screen on losing all lives
8. Back button → rotation animation back → home screen

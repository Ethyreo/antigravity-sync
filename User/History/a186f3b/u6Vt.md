# Cyber Tetris — Game Integration (IMPLEMENTED)

> [!NOTE]
> This plan was successfully implemented and verified on 2026-02-19. See `walkthrough.md` for details.

## Goal
Integrate a classic Tetris-style puzzle game into the Bored Games app, adapting the logic from [shorve6/Tetris](https://github.com/shorve6/Tetris) (JS/HTML) into a native Flutter implementation. The game will strictly adhere to the app's "Cyber-8-bit" aesthetic using `CyberColors`.

## Proposed Architecture

### Phase 1: Core Game Engine (`logic.dart`)
We will port the JS logic to Dart using **Riverpod** for state management.

#### `TetrisState` (Immutable Data Class)
- `grid`: `List<List<Color?>>` (10 cols x 20 rows) — stores locked blocks.
- `currentPiece`: Object with `shape` (List<List<int>>), `color`, `x`, `y`, `rotation`.
- `nextPiece`: Object for the preview piece.
- `score`, `level`, `lines`: Integers.
- `status`: Enum (`playing`, `paused`, `gameOver`).

#### `TetrisEngine` (StateNotifier)
- **Game Loop**: Uses `Ticker` to drive the gravity (drop interval based on level).
- **Collision Detection**: Checks grid boundaries and occupied cells.
- **Line Clearing**: Standard Tetris line clear logic + score calculation (100/300/500/800).
- **Rotation**: SRS (Super Rotation System) or simplified classic rotation with wall kicks.

### Phase 2: Rendering (`renderer.dart`)
High-performance rendering using `CustomPainter`.

#### `TetrisPainter`
- **Grid**: Draws faint `CyberColors.dimGrid` lines.
- **Blocks**: Draws individual blocks with a "cyber" look:
  - Fill: `Color` from `CyberColors` palette (mapped from standard Tetris colors).
  - Border: Bright accent color.
  - Inner Glow: Subtle center highlight for 3D effect.
- **Ghost Piece**: Draws the landing position of the current piece (faint/outline).

### Phase 3: UI & Controls (`game.dart`)
#### Main Widget (`TetrisGame`)
- **Layout**: 
  - Center: Game Board (Aspect Ratio 1:2).
  - Right/Top: HUD (Next Piece, Score, Level).
- **Controls**:
  - **Gestures**: 
    - Tap: Rotate.
    - Swipe Left/Right: Move.
    - Swipe Down: Soft Drop.
    - Double Tap: Hard Drop.
  - **On-Screen Buttons** (Optional/Alternative): D-pad for precision.

#### Overlays
- **Start Screen**: "PRESS START".
- **Pause Screen**: "SYSTEM PAUSED".
- **Game Over**: Final Score + "RETRY".

### Phase 4: Integration
- Add to `GameRegistry`:
  - ID: `tetris`
  - Title: "Cyber Tetris"
  - Color: `CyberColors.electricCyan`
- Add Route: `/games/tetris` -> `TetrisGame()`

## Asset Mapping
| Tetris Color | CyberColor Mapping |
|--------------|--------------------|
| Cyan (I)     | `electricCyan`     |
| Blue (J)     | `holographicBlue`  |
| Orange (L)   | `solarOrange`      |
| Yellow (O)   | `cyberYellow`      |
| Green (S)    | `toxicGreen`       |
| Purple (T)   | `neonPurple`       |
| Red (Z)      | `hazardMagenta`    |

## Phase 6: Graphics Overhaul (Retro Hedgehog)
Improving visuals and animation using `2d-games` skill.

### Goals
- Enhance `HedgehogPainter` with advanced effects (parallax, trails, lighting?)
- Improve animation fluidity (interpolations, easing)
- Refine sprite/shape rendering logic for a polished look.

### Implementation Guide (Manual Overhaul)
> [!WARNING]
> The `2d-games` skill could not be installed (repo timeout). Proceeding with manual implementation based on best practices.

1. **Parallax Background**:
   - Implement `ParallaxLayer` class.
   - Create 3 layers of scrolling cyber-cityscape (far, mid, near).

2. **Particle System**:
   - Add `ParticleEmitter` for:
     - Dust when running.
     - Sparks when jumping/landing.
     - Explosion when destroying badniks.

3. **Dynamic Lighting**:
   - Add radial gradient overlays for "neon glow" around player and active elements.

4. **Sprite Polish**:
   - Improve `HedgehogPainter` to use `Path` operations for smoother curves (if not using assets).
   - Add "stretch and squash" animation effect on jump.

## Phase 7: Asset Replacement (Gorgon & Swamp)
Replacing procedural canvas shapes with actual high-quality 8-bit assets provided by the user.

### Goal
Replace the abstract "Hedgehog" and "Cyber City" with the "Gorgon" character and "Swamp" environment assets.

### Integration Plan

1. **Asset Configuration**:
   - Update `pubspec.yaml` to include:
     - `assets/Character/Gorgon_1/`
     - `assets/swamp, plants, tiles etc/1 Tiles/`
     - `assets/swamp, plants, tiles etc/2 Background/Layers/`

2. **Sprite Loading Utility**:
   - Create a service to load and cache `dart:ui.Image` instances asynchronously when the game starts, ensuring no mid-game stutter.

3. **Character Rendering**:
   - Map `PlayerState` to Gorgon sprite sheets:
     - `idle` -> `Idle.png`
     - `running` -> `Run.png`
     - `jumping` -> `Special.png` or an attack frame for rolling.
     - `hurt` -> `Hurt.png`
   - Use `ImageShader` or `canvas.drawImageRect` to map specific frames of the sprite sheet based on `state.animTime`.

4. **Environment Rendering**:
   - Replace procedural platform drawing with Swamp Tiles.
   - Use `Tile_02.png` for center pieces, `Tile_01.png` for left edges, and `Tile_03.png` for right edges.
   - Replace the procedural parallax background with the parallax `Layers/1.png` to `5.png`.

---

# Cyber Minesweeper — Game Integration (PLANNED)

## Goal
Adapt the classic Minesweeper logic from the [seahwm/Minesweeper](https://github.com/seahwm/Minesweeper) repository into a native Flutter module for the Bored Games app. The implementation will strip the default Material styling and apply the app's signature "Cyber-8-bit" aesthetic, utilizing `CyberColors` and matching the UI conventions used in Tetris and Retro Hedgehog.

## Proposed Architecture

### Phase 1: Core Logic Extraction (`logic.dart`)
Extract the raw state and game logic from the monolith `main.dart` of the cloned repo into clean, testable Dart models.

#### `MinesweeperState`
- `config`: Difficulty matrix (width, height, totalBombs).
- `fields`: 1D List of `FieldState` representing the 2D grid.
- `currentBombs`: Integer tracking remaining unflagged mines.
- `status`: Enum (`playing`, `won`, `lost`).
- `firstClick`: Boolean to handle safe-start bomb generation.

#### `MinesweeperEngine`
- `initBomb(int safeIndex)`: Populates grid identically to the repo but excludes the very first clicked cell.
- `onClick(int index)`: Handles the recursive flood-fill algorithm `openAll(i)` for clearing zero-bomb clusters.
- `toggleFlag(int index)`: Marks mines and decrements counter.
- `checkWin()`: Validates remaining unrevealed boxes against total bombs.

### Phase 2: Cyber Visuals (`renderer.dart` & `widgets`)
Instead of plain gray containers, we will build "Cyber" cells.
- **Hidden Cell**: Dark solid `background` with bright `CyberColors.electricCyan` border glow.
- **Revealed Empty**: Dim, transparent background indicating hollow space.
- **Revealed Number**: Extracted `boomCount` using `CyberColors` depending on threat level (1=Cyan, 2=Green, 3=Yellow, 4=Orange, 5+=Magenta).
- **Bomb**: A distinct `Icons.coronavirus` or generic target icon glowing `hazardMagenta`.
- **Flag**: Bright neon green flag icon.

### Phase 3: Game UI (`game.dart`)
- **App Bar**: Consistent with the rest of the app (`RetroHedgehogGame`), featuring a persistent back button and retro font title.
- **Header Plate**: Neon text showing "MINES LEFT: X".
- **Grid Layout**: Convert the repository's `GridView.count` into an `InteractiveViewer` or simple centered padded `GridView` depending on difficulty size to ensure mobile/desktop scalability.
- **Controls**:
  - Primary Tap / Left Click -> Reveal Cell
  - Long Press / Right Click (if web) -> Place Flag
  - Secondary "Toggle Mode" switch at the bottom for purely touch devices (as seen in the original repo).

## User Review Required
> [!IMPORTANT]
> - Do you want a strict timer for the leaderboard, or casual untimed play?
> - Do you prefer Long Press for flags, or keeping the explicit "Toggle Flag" switch from the repo?

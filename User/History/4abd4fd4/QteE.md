# Cyber Tetris Integration

## Planning
- [x] Analyze source JS logic (grid, shapes, scoring)
- [x] Create implementation plan
- [ ] User review & approval

## Phase 1: Core Game Engine (`logic.dart`)
- [x] Define `TetrisPiece` class (shapes, rotation, colors)
- [x] Define `TetrisState` (grid, score, level, game status)
- [x] Implement `TetrisEngine` (game loop, collision, line clearing, gravity)

## Phase 2: Visuals (`renderer.dart`)
- [x] Create `TetrisPainter`
- [x] Implement cyber-themed block rendering (glow, borders)
- [x] Draw grid, ghost piece, and active piece

## Phase 3: UI & Controls (`game.dart`)
- [x] Build main game widget with `CustomPaint`
- [x] Implement gesture controls (Tap=Rotate, Swipe=Move/Drop)
- [x] Add HUD (Next piece, Score, Level)
- [x] Add Overlays (Start, Pause, Game Over)

## Phase 4: Integration & Verification
- [x] Add to `GameRegistry`
- [x] Add route to `routes.dart`
- [x] Verify using Codex critique (Self-critique performed)
- [x] Play-test in browser (Passed)
- [x] Play-test in browser (Passed)

## Phase 5: Bug Fixing
- [x] Fix black screen on load (Passed)

## Phase 6: Graphics Overhaul
- [x] Install `2d-games` skill (Failed - Timeout)
- [x] Implement Parallax Backgrounds
- [x] Add Particle System (Dust/Sparks)
- [x] Enhance Dynamic Lighting
- [x] Polish Sprite Animations

## Phase 7: Asset Replacement
- [x] Update `pubspec.yaml` with image paths
- [x] Create `SpriteRenderer` utility for loading/drawing sheets
- [x] Replace Player shapes with Gorgon Sprite Sheets
- [x] Replace Platform shapes with Swamp Tiles
- [x] Replace Parallax layers with Background assets

## Phase 8: Animation & FPS Optimization (Polish)
- [x] Identify and remove `MaskFilter.blur` to drastically improve web FPS
- [x] Add localized `stateTime` to `logic.dart` for glitch-free frame synchronization
- [x] Stop loop-jumping frames by clamping action states (Jump/Hurt)
- [x] Overhaul placeholder "square block" enemies into intricately drawn Spider/UFO drones using canvas paths
- [x] Ensure "stable single frame" idle state instead of breathing loop and fix collision state stutter

## Phase 9: Controls & Physics Refinement
- [x] Add Keyboard listener mapping (WASD, Arrows, Space) to allow simultaneous running and jumping on Web/Desktop.
- [x] Fix touch Jump button missing `onPointerUp` state clearer.
- [x] Overhaul AABB collision resolution to fix the "getting stuck randomly" ledge snagging bug.

## Phase 10: Cyber Minesweeper Core Logic (`logic.dart`)
- [x] Create `MinesweeperState` and `MinesweeperEngine`
- [x] Implement robust grid generation and random bomb placement (`initBomb`)
- [x] Implement neighbour bomb counting calculation wrapper
- [x] Implement flood-fill empty space discovery (`onClick` / `openAll`)
- [x] Implement flagging system and win/loss detector

## Phase 11: Cyber Minesweeper Visuals & UI (`renderer.dart` & `game.dart`)
- [/] Implement `CyberCell` rendering box (Cyan outlines, dark fill, hazard colors)
- [/] Implement `game.dart` view using `GridView.builder` or `InteractiveViewer`
- [/] Implement Cyber-style Header (Mines counter, retro fonts, toggles)
- [/] Implement Control scheme (Tap = Reveal, LongPress/Toggle = Flag)
- [/] Register game into `GameRegistry` and `routes.dart`

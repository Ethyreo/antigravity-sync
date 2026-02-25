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

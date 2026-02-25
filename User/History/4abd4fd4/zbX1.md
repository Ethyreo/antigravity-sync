# Cyber Tetris Integration

## Planning
- [x] Analyze source JS logic (grid, shapes, scoring)
- [x] Create implementation plan
- [ ] User review & approval

## Phase 1: Core Game Engine (`logic.dart`)
- [ ] Define `TetrisPiece` class (shapes, rotation, colors)
- [ ] Define `TetrisState` (grid, score, level, game status)
- [ ] Implement `TetrisEngine` (game loop, collision, line clearing, gravity)

## Phase 2: Visuals (`renderer.dart`)
- [ ] Create `TetrisPainter`
- [ ] Implement cyber-themed block rendering (glow, borders)
- [ ] Draw grid, ghost piece, and active piece

## Phase 3: UI & Controls (`game.dart`)
- [ ] Build main game widget with `CustomPaint`
- [ ] Implement gesture controls (Tap=Rotate, Swipe=Move/Drop)
- [ ] Add HUD (Next piece, Score, Level)
- [ ] Add Overlays (Start, Pause, Game Over)

## Phase 4: Integration & Verification
- [ ] Add to `GameRegistry`
- [ ] Add route to `routes.dart`
- [ ] Verify using Codex critique
- [ ] Play-test in browser

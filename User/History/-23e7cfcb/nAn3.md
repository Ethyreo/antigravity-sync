# Codebase Audit & Fix — Walkthrough

## Problem
App crashed with an assertion error when entering Tic-Tac-Toe, followed by a white screen.

## Root Causes Found & Fixed

### 1. `ref.listen` illegally placed in `initState` (Assertion Error)
- **File**: [game.dart](file:///Users/gurman/Coding%20Projects/Bored%20Games/lib/features/games/tic_tac_toe/game.dart)
- **Issue**: `ref.listen` was called inside `initState()`, which is illegal in Riverpod — it must be called inside `build()`.
- **Fix**: Removed `initState` entirely, moved the listener into `build()`.

### 2. Infinite rebuild loop via `loadWins` (White Screen)
- **File**: [logic.dart](file:///Users/gurman/Coding%20Projects/Bored%20Games/lib/features/games/tic_tac_toe/logic.dart)
- **Issue**: `loadWins()` was triggered via `addPostFrameCallback` on every build when `xWins == 0`, causing an infinite setState→rebuild cycle.
- **Fix**: Moved high-score loading into the Notifier's `build()` method, eliminating the need for a separate `loadWins` call from the UI.

### 3. AI board mutation risk
- **File**: [ai.dart](file:///Users/gurman/Coding%20Projects/Bored%20Games/lib/features/games/tic_tac_toe/ai.dart)
- **Issue**: `getBestMove` was operating directly on the state's board list reference. The minimax and rule-based algorithms mutate the board in-place during simulation — this could corrupt the actual game state.
- **Fix**: Added `List.from(board)` clone at the entry point of `getBestMove`.

## Verification

Tested all flows via automated browser testing — **zero console errors**:

````carousel
![Home screen loads correctly](file:///Users/gurman/.gemini/antigravity/brain/66d9a5d4-ed3d-4acf-9470-976026c5fe1b/home_screen_1771264059905.png)
<!-- slide -->
![Protocol selection works](file:///Users/gurman/.gemini/antigravity/brain/66d9a5d4-ed3d-4acf-9470-976026c5fe1b/protocol_selection_screen_1771264082403.png)
<!-- slide -->
![Game board and moves work](file:///Users/gurman/.gemini/antigravity/brain/66d9a5d4-ed3d-4acf-9470-976026c5fe1b/game_after_move_1771264102863.png)
````

| Test | Result |
|------|--------|
| Home screen loads | ✅ |
| Tic-Tac-Toe navigation | ✅ |
| 1v1 (HUMAN) mode | ✅ |
| VS CYBERNET + difficulty slider | ✅ |
| Making moves on board | ✅ |
| Console errors | None |

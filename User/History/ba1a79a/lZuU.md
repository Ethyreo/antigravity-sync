# Polish Implementation Plan: "Juice"

## Goal
Enhance the tactile and visual feel of the app to match the "Cyber-8-bit" aesthetic.

## 1. 8-bit Particle System (`CyberParticles`)
**Concept**: "Explosions" made of square pixels that scatter and fade, not round blurred dots.
-   **Widget**: `CyberParticles` (StatefulWidget).
-   **Logic**:
    -   Spawns `N` particles (default 20-30).
    -   **Physics**: Simple velocity (x, y) + decay. No gravity needed for top-down UI, but maybe slight friction.
    -   **Rendering**: `CustomPainter` drawing `Rect`s.
    -   **Lifecycle**: Auto-disposes after animation (e.g., 600ms).
-   **Usage**:
    -   **Tic-Tac-Toe**: Explode on the winning line.
    -   **Home**: Maybe on "Press Start" (Play button).

## 2. Haptic Feedback (`HapticsService`)
**Concept**: Physical feedback matching the "weight" of actions.
-   **Wrapper**: `core/services/haptics_service.dart`.
-   **Profiles**:
    -   `click`: `HapticFeedback.selectionClick` (UI navigation, typing).
    -   `light`: `HapticFeedback.lightImpact` (Coin collect, small score).
    -   `medium`: `HapticFeedback.mediumImpact` (Wall hit, Player move).
    -   `heavy`: `HapticFeedback.heavyImpact` (Game Over, Explosion).
    -   `vibrate`: `HapticFeedback.vibrate` (Long duration, e.g., death).

## 3. Integration Points
-   **Tic-Tac-Toe**:
    -   *Move*: Medium Impact.
    -   *Win*: Heavy Impact + Particle Explosion on winning cells.
    -   *Reset*: Light Impact.
-   **GameCard**:
    -   *Tap*: Medium Impact (already has visual feedback).

## Execution Steps
1.  Create `HapticsService`.
2.  Create `CyberParticles` widget.
3.  Integrate both into `TicTacToeGame` and `GameCard`.

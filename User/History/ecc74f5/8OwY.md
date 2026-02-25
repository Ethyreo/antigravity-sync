# Game Launch Animation Plan

## Goal
Implement a "Neon Line" transition when launching a game.
**Effect**: The clicked tile "morphs" (conceptually) into neon pink lines that travel through the screen to reveal the game.

## Approach
Since strictly morphing a specific list item (card) into a full-screen transition in a declarative router (`GoRouter`) can be complex (requires passing GlobalKeys or LayoutCoordinates), we will approximate the effect with a **Custom Layout-Aware Transition**.

### 1. `CyberLaunchTransition` (Custom PageRoute)
We will create a custom page transition that:
1.  **Starts**: With a "Line Explosion" or "Grid Wipe" effect.
2.  **Color**: Uses `CyberColors.hazardMagenta` (Neon Pink) as requested.
3.  **Animation**:
    -   A dense grid of vertical/horizontal lines appears.
    -   The lines move/expand rapidly.
    -   The new page (Game) is revealed underneath or through the lines.

### 2. Update `GameCard` Interaction
To sell the effect that the *tile* triggers this:
1.  On Tap: The `GameCard` border immediately turns **Neon Pink**.
2.  We add a slight delay (e.g., 150ms) before pushing the route, letting the user see the "activation".
3.  Then the route transition takes over, filling the screen with pink lines.

### 3. Implementation Details
-   **File**: `lib/core/widgets/cyber_page_route.dart`
-   **Logic**:
    -   Use `CustomTransitionPage` in `GoRouter`.
    -   `transitionsBuilder`: Uses a `CustomPainter` that draws lines based on the `animation` value (0.0 to 1.0).
    -   **Painter**: Draws vertical/horizontal lines that sweep across the screen.

### 4. Technical Feasibility
-   **Difficulty**: Moderate. Custom Painters are performant.
-   **No Assets Needed**: We can draw this programmatically.

## Execution Steps
1.  Create `CyberLaunchTransition`.
2.  Configure logic in `GameCard` to "activate" (Pink state) before navigation.
3.  Apply transition to `routes.dart`.

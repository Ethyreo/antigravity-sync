# Loading Screen Implementation Plan

## Goal
Create a "Cyber-8-bit" loading screen that loads instantly, fades in the logo with glitch effects, shows a progress bar, and transitions smoothly to the home screen.

## 1. Widget Structure
-   **Location**: `lib/features/splash/presentation/screens/loading_screen.dart`
-   **State**: `StatefulWidget` (AnimationControllers needed).

## 2. Animation Sequence
1.  **Black Void (0ms - 500ms)**: Instant black screen.
2.  **Fade In (500ms - 1500ms)**:
    -   Logo "BORED GAMES" fades in opacity 0->1.
    -   Loading Bar appears at bottom.
3.  **Glitch Phase (1500ms - 3500ms)**:
    -   **Logo**: chromatic aberration (RGB split) jitters randomly.
    -   **Progress**: Bar fills up (simulated loading).
4.  **Exit Transition (3500ms - 4000ms)**:
    -   Screen "glitches" (shift x/y slightly).
    -   Navigate to `/home` with a fade transition.

## 3. Components
-   **GlitchText**: A widget that stacks 3 copies of text (Cyan, Magenta, White) and jitters the Cyan/Magenta layers based on an AnimationController.
-   **CyberProgressBar**: A container with a neon border and a filling inner container.

## 4. Routing Changes
-   **Current `/`**: `HomeScreen`.
-   **New `/`**: `LoadingScreen`.
-   **New `/home`**: `HomeScreen`.

## 5. Implementation Steps
1.  Create `GlitchText` widget.
2.  Create `LoadingScreen` widget.
3.  Update `routes.dart`.

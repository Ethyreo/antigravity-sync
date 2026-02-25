# Bored Games - Walkthrough

## Summary
We have successfully initialized the **Bored Games** Flutter project with a scalable, modular architecture. The app allows for easy addition of new games and comes pre-loaded with **Tic-Tac-Toe**.

## Key Features
1.  **Modular Architecture**: Each game is a separate module in `features/games`.
2.  **Game Registry**: Centralized list of games in `features/home/domain/game_registry.dart`.
3.  **Tic-Tac-Toe**: A fully functional 2-player local game with "Winner" and "Draw" detection.
4.  **Core Services**:
    -   `StorageService`: Ready for local data persistence.
    -   `AdService`: Placeholders for future ad integration.

## UI Overhaul (Cyber-8-bit)
The app now features a "Tomb of the Mask" inspired aesthetic:
-   **Neon Palette**: Electric Cyan, Hazard Magenta, and Cyber Yellow on Void Black.
-   **Typography**: "Press Start 2P" for headers, "Roboto" for body.
-   **Effects**: CRT Scanline overlay, pixel-perfect borders, and bouncy animations.

## Animations & Polish
-   **Launch Transition**: "Neon Line" wipe effect when starting a game (Implemented).
-   **Particles**: Square-pixel explosions on win events (Implemented).
-   **Haptics**: Tactile feedback for taps, moves, and game events (Implemented).

## Security Enhancements
-   **Obfuscation**: Build instructions provided in `docs/BUILD.md`.
-   **Secure Storage**: High scores are protected with SHA-256 checksums to prevent tampering.
-   **Permissions**: Audited and minimized (Android only requests INTERNET).

## How to Run
```bash
cd "Bored Games"
flutter run
```

## How to Add a New Game
See `lib/features/games/game_template/README.md` for detailed instructions.
1.  Create game folder.
2.  Implement `GameScaffold` based widget.
3.  Register in `GameRegistry` and `routes.dart`.

## Verification
-   **Static Analysis**: Code structure follows clean architecture principles.
-   **UI**: Home screen displays grid of games; Tic-Tac-Toe features immersive black background and animated status text.

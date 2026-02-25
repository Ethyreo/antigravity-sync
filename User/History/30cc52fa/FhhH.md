# New Game Template

To add a new game to **Bored Games**:

1.  **Create a folder** in `lib/features/games/` (e.g., `lib/features/games/snake/`).
2.  **Create the Game Widget**:
    -   Create `game.dart` which acts as the entry point.
    -   Use `GameScaffold` for consistent UI.
3.  **Implement Logic**:
    -   Use Riverpod for state management in `logic.dart`.
4.  **Register the Game**:
    -   Add a new `Game` entry in `lib/features/home/domain/game_registry.dart`.
    -   Add a new route in `lib/app/routes.dart`.

## Example Structure
```
lib/features/games/my_new_game/
├── game.dart      # UI
├── logic.dart     # StateNotifier
└── assets/        # Images/Icons
```
